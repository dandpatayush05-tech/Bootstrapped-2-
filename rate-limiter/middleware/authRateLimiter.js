/**
 * AUTH RATE LIMITER
 *
 * Dual-key: per-IP AND per-account (email/username).
 * Exponential backoff on failures only.
 * Successful attempts DO NOT count toward backoff limits.
 *
 * Flow:
 *   1. Check per-IP rate limit (total auth requests from this IP)
 *   2. Extract account identifier from request body
 *   3. Check per-account rate limit (total auth requests for this account)
 *   4. Check failure count for this IP+account → compute backoff delay
 *   5. If any check fails → 429 with Retry-After
 *   6. If all pass → proceed to route handler
 *   7. After route handler: record success (clear failures) or failure (increment)
 */

const { config } = require('../config/rate-limit.config');
const {
  checkSlidingWindow,
  countInWindow,
  recordEvent,
  clearKey,
} = require('../lib/slidingWindowStore');
const { flagAbuse } = require('../lib/abuseLogger');

const AUTH = config.auth;
const REDIS_PREFIX = config.redis.keyPrefix;
const TTL_BUFFER = config.redis.ttlBufferMs;

/**
 * Extract account identifier from request.
 * Tries body.email, body.username, body.phone — in that order.
 * Returns normalized lowercase string or null.
 */
function extractAccountId(req) {
  const body = req.body || {};
  const raw = body.email || body.username || body.phone || null;
  return raw ? raw.toString().toLowerCase().trim() : null;
}

/**
 * Compute exponential backoff delay based on failure count.
 * Formula: min(baseDelay * multiplier^(failures-1), maxDelay)
 */
function computeBackoffMs(failureCount) {
  if (failureCount <= 0) return 0;
  const { baseDelayMs, multiplier, maxDelayMs } = AUTH.failureBackoff;
  const delay = baseDelayMs * Math.pow(multiplier, failureCount - 1);
  return Math.min(delay, maxDelayMs);
}

/**
 * Build the 429 response — intentionally non-revealing.
 * Does NOT leak whether the account exists.
 */
function send429(res, retryAfterMs, tier) {
  const retryAfterSec = Math.ceil(retryAfterMs / 1000);

  res.set({
    'Retry-After': retryAfterSec.toString(),
    'X-RateLimit-Tier': tier,
  });

  return res.status(429).json({
    error: 'Too Many Requests',
    message: 'You have exceeded the allowed number of attempts. Please wait before trying again.',
    retryAfter: retryAfterSec,
  });
}

/**
 * Pre-handler middleware: checks rate limits BEFORE the route executes.
 *
 * Usage:
 *   router.post('/auth/login', authRateLimiterPre, loginHandler);
 */
function authRateLimiterPre(req, res, next) {
  (async () => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const accountId = extractAccountId(req);

    const ipKey       = `${REDIS_PREFIX}auth:ip:${clientIp}`;
    const acctKey     = accountId ? `${REDIS_PREFIX}auth:acct:${accountId}` : null;
    const failIpKey   = `${REDIS_PREFIX}auth:fail:ip:${clientIp}`;
    const failAcctKey = accountId ? `${REDIS_PREFIX}auth:fail:acct:${accountId}` : null;

    // --- Step 1: Per-IP total request limit ---
    const ipResult = await checkSlidingWindow(
      ipKey,
      AUTH.perIp.maxRequests,
      AUTH.perIp.windowMs,
      TTL_BUFFER
    );

    if (!ipResult.allowed) {
      await flagAbuse(clientIp, 'auth:ip', req.originalUrl);
      return send429(res, ipResult.retryAfterMs, 'auth:ip');
    }

    // --- Step 2: Per-account total request limit ---
    if (acctKey) {
      const acctResult = await checkSlidingWindow(
        acctKey,
        AUTH.perAccount.maxRequests,
        AUTH.perAccount.windowMs,
        TTL_BUFFER
      );

      if (!acctResult.allowed) {
        await flagAbuse(accountId, 'auth:account', req.originalUrl);
        return send429(res, acctResult.retryAfterMs, 'auth:account');
      }
    }

    // --- Step 3: Failure-based exponential backoff ---
    const ipFailures = await countInWindow(failIpKey, AUTH.failureBackoff.failureWindow);
    const acctFailures = failAcctKey
      ? await countInWindow(failAcctKey, AUTH.failureBackoff.failureWindow)
      : 0;

    const maxFailures = Math.max(ipFailures, acctFailures);

    // Hard cooldown check
    if (maxFailures >= AUTH.failureBackoff.maxFailures) {
      await flagAbuse(clientIp, 'auth:hard-cooldown', req.originalUrl);
      return send429(res, AUTH.hardCooldownMs, 'auth:cooldown');
    }

    // Exponential backoff check
    if (maxFailures > 0) {
      const backoffMs = computeBackoffMs(maxFailures);

      // Check when the last failure was recorded
      const { getRedisClient } = require('../lib/redisClient');
      const redis = getRedisClient();
      const lastFailKey = ipFailures >= acctFailures ? failIpKey : (failAcctKey || failIpKey);
      const lastEntries = await redis.zrevrangebyscore(
        lastFailKey, '+inf', '-inf', 'WITHSCORES', 'LIMIT', 0, 1
      );

      if (lastEntries.length >= 2) {
        const lastFailTime = parseInt(lastEntries[1]);
        const elapsed = Date.now() - lastFailTime;

        if (elapsed < backoffMs) {
          const waitMs = backoffMs - elapsed;
          return send429(res, waitMs, 'auth:backoff');
        }
      }
    }

    // --- Attach metadata for post-handler ---
    req._rateLimitMeta = {
      clientIp,
      accountId,
      failIpKey,
      failAcctKey,
    };

    next();
  })().catch((err) => {
    // Redis down → fail open (allow request but log error)
    console.error('[AuthRateLimiter] Redis error, failing open:', err.message);
    next();
  });
}

/**
 * Post-handler helpers: call AFTER your auth logic resolves.
 *
 * Usage in route handler:
 *   if (loginSuccess) {
 *     await authRateLimiterPost.onSuccess(req);
 *     res.json({ token });
 *   } else {
 *     await authRateLimiterPost.onFailure(req);
 *     res.status(401).json({ error: 'Invalid credentials' });
 *   }
 */
const authRateLimiterPost = {
  async onSuccess(req) {
    const meta = req._rateLimitMeta;
    if (!meta) return;

    try {
      // Clear failure counters on successful auth
      if (meta.failIpKey)   await clearKey(meta.failIpKey);
      if (meta.failAcctKey) await clearKey(meta.failAcctKey);
    } catch (err) {
      console.error('[AuthRateLimiter] Failed to clear on success:', err.message);
    }
  },

  async onFailure(req) {
    const meta = req._rateLimitMeta;
    if (!meta) return;

    try {
      await recordEvent(meta.failIpKey, AUTH.failureBackoff.failureWindow, TTL_BUFFER);
      if (meta.failAcctKey) {
        await recordEvent(meta.failAcctKey, AUTH.failureBackoff.failureWindow, TTL_BUFFER);
      }
    } catch (err) {
      console.error('[AuthRateLimiter] Failed to record failure:', err.message);
    }
  },
};

module.exports = { authRateLimiterPre, authRateLimiterPost };
