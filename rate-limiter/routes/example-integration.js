/**
 * Example Route Integration
 *
 * Demonstrates how to wire the three rate-limiter tiers
 * into an Express application.
 */

const express = require('express');
const router = express.Router();

// Rate limiter middleware imports
const { authRateLimiterPre, authRateLimiterPost } = require('../middleware/authRateLimiter');
const { publicRateLimiter } = require('../middleware/publicRateLimiter');
const { userRateLimiter } = require('../middleware/userRateLimiter');

// ═══════════════════════════════════════════════════════
// AUTH ROUTES — Strictest limits (dual-key: IP + account)
// ═══════════════════════════════════════════════════════

router.post('/auth/login', authRateLimiterPre, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Your authentication logic here
    const user = await authenticateUser(email, password);

    if (user) {
      // ✅ Clear failure counters on successful login
      await authRateLimiterPost.onSuccess(req);
      return res.json({ token: generateToken(user), user: { id: user.id, email: user.email } });
    } else {
      // ❌ Record failure for backoff calculation
      await authRateLimiterPost.onFailure(req);
      // Non-revealing error — same message whether account exists or not
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    await authRateLimiterPost.onFailure(req);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/signup', authRateLimiterPre, async (req, res) => {
  // Signup handler — authRateLimiterPre prevents mass registration
  // Call authRateLimiterPost.onSuccess(req) after successful creation
  // Call authRateLimiterPost.onFailure(req) on validation failure
  res.status(501).json({ message: 'Signup handler — implement me' });
});

router.post('/auth/password-reset', authRateLimiterPre, async (req, res) => {
  // Password reset — rate limited to prevent email bombing
  res.status(501).json({ message: 'Password reset handler — implement me' });
});

router.post('/auth/verify-otp', authRateLimiterPre, async (req, res) => {
  // OTP verification — strictest limits to prevent brute-force
  res.status(501).json({ message: 'OTP verify handler — implement me' });
});

router.post('/auth/refresh-token', authRateLimiterPre, async (req, res) => {
  // Token refresh — rate limited to prevent token farming
  res.status(501).json({ message: 'Token refresh handler — implement me' });
});


// ═══════════════════════════════════════════════════════
// PUBLIC ROUTES — Moderate limits (per-IP only)
// ═══════════════════════════════════════════════════════

router.get('/search', publicRateLimiter, async (req, res) => {
  // Public search — moderate limits, allows reasonable browsing
  res.json({ results: [], query: req.query.q || '' });
});

router.get('/listings', publicRateLimiter, async (req, res) => {
  // Public listings — read-only endpoint
  res.json({ listings: [], page: req.query.page || 1 });
});

router.get('/products/:id', publicRateLimiter, async (req, res) => {
  // Product detail — read-only endpoint
  res.json({ product: { id: req.params.id, name: 'Example Product' } });
});


// ═══════════════════════════════════════════════════════
// AUTHENTICATED ROUTES — Looser limits (per-user-ID)
//
// NOTE: requireAuth middleware must run before userRateLimiter
// so that req.user.id is available for per-user scoping.
// ═══════════════════════════════════════════════════════

// Placeholder auth middleware for demonstration
function requireAuth(req, res, next) {
  // In production: verify JWT, set req.user = decoded token payload
  if (req.headers.authorization) {
    req.user = { id: 'user-123' }; // placeholder
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

router.post('/posts', requireAuth, userRateLimiter, async (req, res) => {
  res.status(201).json({ message: 'Post created', post: req.body });
});

router.put('/posts/:id', requireAuth, userRateLimiter, async (req, res) => {
  res.json({ message: 'Post updated', id: req.params.id });
});

router.delete('/posts/:id', requireAuth, userRateLimiter, async (req, res) => {
  res.json({ message: 'Post deleted', id: req.params.id });
});


// ═══════════════════════════════════════════════════════
// Placeholder functions (replace with your actual logic)
// ═══════════════════════════════════════════════════════

async function authenticateUser(email, password) {
  // Replace with your actual auth logic (bcrypt compare, DB lookup, etc.)
  return null;
}

function generateToken(user) {
  // Replace with JWT signing logic
  return 'jwt-token-placeholder';
}

module.exports = router;
