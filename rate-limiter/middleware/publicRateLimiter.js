/**
 * Public Endpoint Rate Limiter — per-IP, moderate limits.
 * Allows reasonable access to read-only endpoints (search, listings, etc.)
 */

const { config } = require('../config/rate-limit.config');
const { checkSlidingWindow } = require('../lib/slidingWindowStore');
const { flagAbuse } = require('../lib/abuseLogger');

const PUB = config.public;
const REDIS_PREFIX = config.redis.keyPrefix;
const TTL_BUFFER = config.redis.ttlBufferMs;

/**
 * Middleware: rate-limits public endpoints by client IP.
 *
 * Usage:
 *   router.get('/search', publicRateLimiter, searchHandler);
 */
function publicRateLimiter(req, res, next) {
  (async () => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `${REDIS_PREFIX}pub:ip:${clientIp}`;

    const result = await checkSlidingWindow(
      key,
      PUB.perIp.maxRequests,
      PUB.perIp.windowMs,
      TTL_BUFFER
    );

    // Set informational rate-limit headers
    res.set({
      'X-RateLimit-Limit':     PUB.perIp.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset':     Math.ceil((Date.now() + PUB.perIp.windowMs) / 1000).toString(),
    });

    if (!result.allowed) {
      const retryAfterSec = Math.ceil(result.retryAfterMs / 1000);

      res.set('Retry-After', retryAfterSec.toString());
      await flagAbuse(clientIp, 'public', req.originalUrl);

      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please slow down.',
        retryAfter: retryAfterSec,
      });
    }

    next();
  })().catch((err) => {
    console.error('[PublicRateLimiter] Redis error, failing open:', err.message);
    next();
  });
}

module.exports = { publicRateLimiter };
