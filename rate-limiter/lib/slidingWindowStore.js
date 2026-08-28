/**
 * Sliding Window Log using Redis Sorted Sets
 *
 * Each request is stored as a member in a sorted set with timestamp as score.
 * To check the rate: count members within [now - windowMs, now].
 *
 * Why sorted sets over simple counters:
 * - No boundary burst problem (fixed window's weakness)
 * - Exact per-request granularity
 * - Natural TTL cleanup via ZREMRANGEBYSCORE
 * - Atomic multi-step via Redis pipeline
 */

const { getRedisClient } = require('./redisClient');

/**
 * Check if the given key has exceeded its rate limit.
 *
 * @param {string} key         - Redis key (e.g., "rl:prod:auth:ip:1.2.3.4")
 * @param {number} maxRequests - Maximum allowed requests in the window
 * @param {number} windowMs    - Window duration in milliseconds
 * @param {number} ttlBufferMs - Extra TTL for key expiry beyond the window
 * @returns {Object} { allowed, current, remaining, retryAfterMs }
 */
async function checkSlidingWindow(key, maxRequests, windowMs, ttlBufferMs = 5000) {
  const redis = getRedisClient();
  const now = Date.now();
  const windowStart = now - windowMs;
  const uniqueMember = `${now}:${Math.random().toString(36).slice(2, 10)}`;

  // Atomic pipeline:
  // 1. Remove expired entries outside the window
  // 2. Add current request
  // 3. Count entries in window
  // 4. Set TTL so keys auto-expire
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, now, uniqueMember);
  pipeline.zcard(key);
  pipeline.pexpire(key, windowMs + ttlBufferMs);

  const results = await pipeline.exec();
  const currentCount = results[2][1]; // zcard result

  if (currentCount > maxRequests) {
    // Over limit — remove the entry we just added (it shouldn't count)
    await redis.zrem(key, uniqueMember);

    // Calculate retry-after: when the oldest entry in the window expires
    const oldestEntries = await redis.zrangebyscore(
      key, windowStart, '+inf', 'WITHSCORES', 'LIMIT', 0, 1
    );
    let retryAfterMs = windowMs; // worst case
    if (oldestEntries.length >= 2) {
      const oldestTimestamp = parseInt(oldestEntries[1]);
      retryAfterMs = Math.max(0, (oldestTimestamp + windowMs) - now);
    }

    return {
      allowed: false,
      current: currentCount - 1,
      remaining: 0,
      retryAfterMs,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    remaining: Math.max(0, maxRequests - currentCount),
    retryAfterMs: 0,
  };
}

/**
 * Count entries in a sliding window WITHOUT adding a new one.
 * Used for failure-count checks (read-only probe).
 */
async function countInWindow(key, windowMs) {
  const redis = getRedisClient();
  const now = Date.now();
  const windowStart = now - windowMs;

  await redis.zremrangebyscore(key, 0, windowStart);
  const count = await redis.zcard(key);

  return count;
}

/**
 * Record a single event (e.g., a failed login attempt) without checking limits.
 */
async function recordEvent(key, windowMs, ttlBufferMs = 5000) {
  const redis = getRedisClient();
  const now = Date.now();
  const uniqueMember = `${now}:${Math.random().toString(36).slice(2, 10)}`;

  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, now - windowMs);
  pipeline.zadd(key, now, uniqueMember);
  pipeline.pexpire(key, windowMs + ttlBufferMs);
  await pipeline.exec();
}

/**
 * Clear all entries for a key (e.g., after successful login resets failure count).
 */
async function clearKey(key) {
  const redis = getRedisClient();
  await redis.del(key);
}

module.exports = {
  checkSlidingWindow,
  countInWindow,
  recordEvent,
  clearKey,
};
