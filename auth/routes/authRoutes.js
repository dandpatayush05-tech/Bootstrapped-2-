/**
 * Authentication Routes
 *
 * POST /api/auth/signup         — Register a new user
 * POST /api/auth/login          — Authenticate and receive tokens
 * POST /api/auth/refresh-token  — Exchange refresh token for new access token
 * GET  /api/auth/me             — Get current user profile (protected)
 * POST /api/auth/logout         — Clear refresh token cookie
 *
 * All routes use authRateLimiterPre from the existing rate-limiter.
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const { createUser, findByEmail, findById } = require('../lib/userStore');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../lib/tokenService');
const { requireAuth } = require('../middleware/requireAuth');

// Rate limiter integration (graceful if not available)
let authRateLimiterPre, authRateLimiterPost;
try {
  const limiter = require('../../rate-limiter/middleware/authRateLimiter');
  authRateLimiterPre = limiter.authRateLimiterPre;
  authRateLimiterPost = limiter.authRateLimiterPost;
} catch {
  // Rate limiter not available — use passthrough
  authRateLimiterPre = (req, res, next) => next();
  authRateLimiterPost = {
    onSuccess: async () => {},
    onFailure: async () => {},
  };
  console.warn('[Auth] Rate limiter not available — running without rate limits');
}

const BCRYPT_ROUNDS = 12;

// Cookie options for refresh token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth',
};

// ═══════════════════════════════════════════════════════
// POST /api/auth/signup
// ═══════════════════════════════════════════════════════

router.post('/signup', authRateLimiterPre, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // --- Validation ---
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Missing fields',
        message: 'Email, password, and name are required.',
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address.',
      });
    }

    // Password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must be at least 8 characters long.',
      });
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      });
    }

    // Name length
    if (name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({
        error: 'Invalid name',
        message: 'Name must be between 2 and 50 characters.',
      });
    }

    // --- Create user ---
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    let user;

    try {
      user = createUser(email, hashedPassword, name);
    } catch (err) {
      if (err.message === 'EMAIL_EXISTS') {
        await authRateLimiterPost.onFailure(req);
        return res.status(409).json({
          error: 'Email already registered',
          message: 'An account with this email already exists. Please log in instead.',
        });
      }
      throw err;
    }

    // --- Generate tokens ---
    const accessToken = signAccessToken(user.id, user.email);
    const refreshToken = signRefreshToken(user.id);

    await authRateLimiterPost.onSuccess(req);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(201).json({
      message: 'Account created successfully',
      user,
      accessToken,
    });
  } catch (err) {
    console.error('[Auth:Signup] Error:', err.message);
    await authRateLimiterPost.onFailure(req);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════
// POST /api/auth/login
// ═══════════════════════════════════════════════════════

router.post('/login', authRateLimiterPre, async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing fields',
        message: 'Email and password are required.',
      });
    }

    // --- Find user ---
    const user = findByEmail(email);

    if (!user) {
      await authRateLimiterPost.onFailure(req);
      // Non-revealing error — same message whether account exists or not
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'The email or password you entered is incorrect.',
      });
    }

    // --- Verify password ---
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      await authRateLimiterPost.onFailure(req);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'The email or password you entered is incorrect.',
      });
    }

    // --- Generate tokens ---
    const accessToken = signAccessToken(user.id, user.email);
    const refreshToken = signRefreshToken(user.id);

    await authRateLimiterPost.onSuccess(req);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    // Return user without password
    const { password: _, ...safeUser } = user;

    return res.json({
      message: 'Login successful',
      user: safeUser,
      accessToken,
    });
  } catch (err) {
    console.error('[Auth:Login] Error:', err.message);
    await authRateLimiterPost.onFailure(req);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════
// POST /api/auth/refresh-token
// ═══════════════════════════════════════════════════════

router.post('/refresh-token', authRateLimiterPre, async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({
        error: 'No refresh token',
        message: 'Refresh token is required.',
        code: 'NO_REFRESH_TOKEN',
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        message: 'The refresh token is invalid or expired. Please log in again.',
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid token type',
        message: 'Expected a refresh token.',
      });
    }

    // Look up user to ensure they still exist
    const user = findById(decoded.sub);
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'The user associated with this token no longer exists.',
      });
    }

    // Issue new access token
    const accessToken = signAccessToken(user.id, user.email);

    // Rotate refresh token
    const newRefreshToken = signRefreshToken(user.id);
    res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.json({
      accessToken,
      user,
    });
  } catch (err) {
    console.error('[Auth:Refresh] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ═══════════════════════════════════════════════════════
// GET /api/auth/me
// ═══════════════════════════════════════════════════════

router.get('/me', requireAuth, (req, res) => {
  const user = findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found',
      message: 'Could not find your user profile.',
    });
  }

  return res.json({ user });
});

// ═══════════════════════════════════════════════════════
// POST /api/auth/logout
// ═══════════════════════════════════════════════════════

router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
  });

  return res.json({ message: 'Logged out successfully' });
});

module.exports = router;
