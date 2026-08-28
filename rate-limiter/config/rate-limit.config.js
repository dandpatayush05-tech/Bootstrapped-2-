/**
 * Rate Limit Configuration
 *
 * All thresholds externalized via environment variables.
 * Defaults are production-safe; override per environment.
 *
 * ENV PREFIX: RL_ (rate limit)
 */

const environments = {
  development: {
    auth: {
      perIp:       { maxRequests: 50,  windowMs: 15 * 60 * 1000 },
      perAccount:  { maxRequests: 20,  windowMs: 15 * 60 * 1000 },
      failureBackoff: {
        baseDelayMs:   1000,
        multiplier:    2,
        maxDelayMs:    30000,
        failureWindow: 30 * 60 * 1000,
        maxFailures:   20,
      },
      hardCooldownMs: 5 * 60 * 1000,
    },
    public: {
      perIp:  { maxRequests: 200, windowMs: 60 * 1000 },
    },
    authenticated: {
      perUser: { maxRequests: 100, windowMs: 60 * 1000 },
    },
    abuse: {
      flagThreshold: 10,
      flagWindowMs: 60 * 60 * 1000,
      alertEnabled: true,
    },
    redis: {
      keyPrefix: 'rl:dev:',
      ttlBufferMs: 5000,
    },
  },

  staging: {
    auth: {
      perIp:       { maxRequests: 15,  windowMs: 15 * 60 * 1000 },
      perAccount:  { maxRequests: 8,   windowMs: 15 * 60 * 1000 },
      failureBackoff: {
        baseDelayMs:   1000,
        multiplier:    2,
        maxDelayMs:    60000,
        failureWindow: 30 * 60 * 1000,
        maxFailures:   10,
      },
      hardCooldownMs: 10 * 60 * 1000,
    },
    public: {
      perIp:  { maxRequests: 100, windowMs: 60 * 1000 },
    },
    authenticated: {
      perUser: { maxRequests: 60, windowMs: 60 * 1000 },
    },
    abuse: {
      flagThreshold: 5,
      flagWindowMs: 60 * 60 * 1000,
      alertEnabled: true,
    },
    redis: {
      keyPrefix: 'rl:stg:',
      ttlBufferMs: 5000,
    },
  },

  production: {
    auth: {
      perIp: {
        maxRequests: parseInt(process.env.RL_AUTH_IP_MAX) || 10,
        windowMs: parseInt(process.env.RL_AUTH_IP_WINDOW_MS) || 15 * 60 * 1000,
      },
      perAccount: {
        maxRequests: parseInt(process.env.RL_AUTH_ACCT_MAX) || 5,
        windowMs: parseInt(process.env.RL_AUTH_ACCT_WINDOW_MS) || 15 * 60 * 1000,
      },
      failureBackoff: {
        baseDelayMs:    parseInt(process.env.RL_AUTH_BACKOFF_BASE_MS) || 1000,
        multiplier:     parseInt(process.env.RL_AUTH_BACKOFF_MULT) || 2,
        maxDelayMs:     parseInt(process.env.RL_AUTH_BACKOFF_MAX_MS) || 120000,
        failureWindow:  parseInt(process.env.RL_AUTH_FAIL_WINDOW_MS) || 30 * 60 * 1000,
        maxFailures:    parseInt(process.env.RL_AUTH_MAX_FAILURES) || 5,
      },
      hardCooldownMs:   parseInt(process.env.RL_AUTH_COOLDOWN_MS) || 15 * 60 * 1000,
    },
    public: {
      perIp: {
        maxRequests: parseInt(process.env.RL_PUB_IP_MAX) || 60,
        windowMs: parseInt(process.env.RL_PUB_IP_WINDOW_MS) || 60 * 1000,
      },
    },
    authenticated: {
      perUser: {
        maxRequests: parseInt(process.env.RL_USER_MAX) || 30,
        windowMs: parseInt(process.env.RL_USER_WINDOW_MS) || 60 * 1000,
      },
    },
    abuse: {
      flagThreshold:  parseInt(process.env.RL_ABUSE_FLAG_THRESHOLD) || 3,
      flagWindowMs:   parseInt(process.env.RL_ABUSE_FLAG_WINDOW_MS) || 60 * 60 * 1000,
      alertEnabled:   process.env.RL_ABUSE_ALERT_ENABLED !== 'false',
    },
    redis: {
      keyPrefix: 'rl:prod:',
      ttlBufferMs: 5000,
    },
  },
};

const env = process.env.NODE_ENV || 'development';
const config = environments[env] || environments.development;

module.exports = { config, environments };
