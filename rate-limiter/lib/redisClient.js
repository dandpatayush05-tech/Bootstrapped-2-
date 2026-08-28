const Redis = require('ioredis');

let client = null;

/**
 * Get or create the shared Redis client instance.
 * Uses lazy initialization — connection is established on first call.
 */
function getRedisClient() {
  if (client && client.status === 'ready') return client;

  client = new Redis({
    host:     process.env.REDIS_HOST || '127.0.0.1',
    port:     parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db:       parseInt(process.env.REDIS_DB) || 0,
    keyPrefix: '',  // handled by rate limiter config, not here
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 5) return null;          // stop retrying after 5 attempts
      return Math.min(times * 200, 2000);  // 200ms, 400ms, ..., 2s
    },
    enableOfflineQueue: false,             // fail fast if disconnected
  });

  client.on('error', (err) => {
    console.error('[RateLimiter:Redis] Connection error:', err.message);
  });

  client.on('connect', () => {
    console.log('[RateLimiter:Redis] Connected');
  });

  return client;
}

/**
 * Graceful shutdown — call during process exit
 */
async function closeRedis() {
  if (client) {
    await client.quit();
    client = null;
  }
}

module.exports = { getRedisClient, closeRedis };
