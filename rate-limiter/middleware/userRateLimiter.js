/**
 * Authenticated User Rate Limiter — per-userID, looser limits.
 * Scoped to the authenticated user performing CRUD on their own resources.
 *
 * Assumes req.user.id is set by your auth middleware upstream.
 */

const { config } = require('../config/rate-limit.config');
const { checkSlidingWindow } = require('../lib/slidingWindowStore');
const { flagAbuse } = require('../lib/abuseLogger');

const USER = config.authenticated;
const REDIS_PREFIX = config.redis.keyPrefix;
const TTL_BUFFER = config.redis.ttlBufferMs;

/**
 * Middleware: rate-limits authenticated user actions by user ID.
 *
 * Usage:
 *   router.post('/posts', requireAuth, userRateLimiter, createPostHandler);
 */
function userRateLimiter(req, res, next) {
  (async () => {
    const userId = req.user?.id;

    if (!userId) {
      // No authenticated user — this middleware shouldn't be here,
      // but fail open rather than crash the request
      return next();
    }

    const key = `${REDIS_PREFIX}user:${userId}`;

    const result = await checkSlidingWindow(
      key,
      USER.perUser.maxRequests,
      USER.perUser.windowMs,
      TTL_BUFFER
    );

    // Set informational rate-limit headers
    res.set({
      'X-RateLimit-Limit':     USER.perUser.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset':     Math.ceil((Date.now() + USER.perUser.windowMs) / 1000).toString(),
    });

    if (!result.allowed) {
      const retryAfterSec = Math.ceil(result.retryAfterMs / 1000);

      res.set('Retry-After', retryAfterSec.toString());
      await flagAbuse(userId, 'authenticated', req.originalUrl);

      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'You have exceeded your request allowance. Please wait.',
        retryAfter: retryAfterSec,
      });
    }

    next();
  })().catch((err) => {
    console.error('[UserRateLimiter] Redis error, failing open:', err.message);
    next();
  });
}

module.exports = { userRateLimiter };
