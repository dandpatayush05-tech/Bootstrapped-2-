/**
 * Abuse Logger — Flag and Alert on Repeated Rate-Limit Violations
 *
 * Tracks how many times an entity (IP or account) has been rate-limited.
 * After crossing the configured threshold within a time window, emits
 * a structured alert for security review.
 */

const { config } = require('../config/rate-limit.config');
const { getRedisClient } = require('./redisClient');

const ABUSE = config.abuse;
const REDIS_PREFIX = config.redis.keyPrefix;

/**
 * Flag an entity that just hit a rate limit.
 *
 * @param {string} identifier - IP address or account ID
 * @param {string} tier       - Rate limit tier that was hit (e.g., 'auth:ip', 'public')
 * @param {string} endpoint   - The route that triggered the limit
 */
async function flagAbuse(identifier, tier, endpoint) {
  if (!ABUSE.alertEnabled) return;

  try {
    const redis = getRedisClient();
    const key = `${REDIS_PREFIX}abuse:${tier}:${identifier}`;
    const now = Date.now();
    const windowStart = now - ABUSE.flagWindowMs;
    const uniqueMember = `${now}:${Math.random().toString(36).slice(2, 8)}`;

    const pipeline = redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zadd(key, now, uniqueMember);
    pipeline.zcard(key);
    pipeline.pexpire(key, ABUSE.flagWindowMs + 5000);
    const results = await pipeline.exec();

    const hitCount = results[2][1];

    if (hitCount >= ABUSE.flagThreshold) {
      emitAbuseAlert({
        identifier,
        tier,
        endpoint,
        hitCount,
        windowMinutes: Math.round(ABUSE.flagWindowMs / 60000),
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    // Abuse logging should never crash the request pipeline
    console.error('[AbuseLogger] Error recording abuse flag:', err.message);
  }
}

/**
 * Emit abuse alert — plug in your alerting pipeline here.
 *
 * Options:
 * - Structured log → ELK / Datadog / CloudWatch
 * - Webhook → Slack / Discord / PagerDuty
 * - Queue → SQS / Pub/Sub for async processing
 */
function emitAbuseAlert(alert) {
  // Structured JSON log for log aggregation pipelines
  console.warn(JSON.stringify({
    level: 'WARN',
    type: 'RATE_LIMIT_ABUSE',
    ...alert,
  }));

  // TODO: Plug in your preferred alerting:
  // await slackWebhook.send(`🚨 Rate limit abuse: ${alert.identifier} hit ${alert.tier} limit ${alert.hitCount}x`);
  // await pagerduty.trigger({ summary: `Rate limit abuse from ${alert.identifier}`, severity: 'warning' });
}

module.exports = { flagAbuse };
