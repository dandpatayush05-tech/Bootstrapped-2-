/**
 * Hackverse — Express Server Entry Point
 *
 * Serves the static frontend and mounts all API routes:
 * - /api/auth/*   → Authentication (JWT + bcrypt)
 * - /api/*        → Protected CRUD & public routes
 *
 * Connects the existing rate-limiter infrastructure.
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

// ── Middleware ────────────────────────────────────────
app.use(cors({
  origin: true,                    // Allow same-origin in development
  credentials: true,               // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Trust proxy for accurate client IPs (rate limiter needs this)
app.set('trust proxy', 1);

// ── Static Files ─────────────────────────────────────
// Serve the frontend (index.html, auth.html, styles.css, app.js, etc.)
app.use(express.static(path.join(__dirname), {
  index: 'index.html',
  extensions: ['html'],
}));

// ── Auth API Routes ──────────────────────────────────
const authRoutes = require('./auth/routes/authRoutes');
app.use('/api/auth', authRoutes);

// ── Protected CRUD Routes (example) ─────────────────
const { requireAuth } = require('./auth/middleware/requireAuth');

// Rate limiters (graceful if Redis is unavailable)
let publicRateLimiter, userRateLimiter;
try {
  publicRateLimiter = require('./rate-limiter/middleware/publicRateLimiter').publicRateLimiter;
  userRateLimiter = require('./rate-limiter/middleware/userRateLimiter').userRateLimiter;
} catch {
  const passthrough = (req, res, next) => next();
  publicRateLimiter = passthrough;
  userRateLimiter = passthrough;
  console.warn('[Server] Rate limiters not available — running without rate limits');
}

// Public endpoints
app.get('/api/search', publicRateLimiter, (req, res) => {
  res.json({ results: [], query: req.query.q || '' });
});

app.get('/api/listings', publicRateLimiter, (req, res) => {
  res.json({ listings: [], page: req.query.page || 1 });
});

app.get('/api/products/:id', publicRateLimiter, (req, res) => {
  res.json({ product: { id: req.params.id, name: 'Example Product' } });
});

// Protected endpoints
app.post('/api/posts', requireAuth, userRateLimiter, (req, res) => {
  res.status(201).json({ message: 'Post created', post: req.body });
});

app.put('/api/posts/:id', requireAuth, userRateLimiter, (req, res) => {
  res.json({ message: 'Post updated', id: req.params.id });
});

app.delete('/api/posts/:id', requireAuth, userRateLimiter, (req, res) => {
  res.json({ message: 'Post deleted', id: req.params.id });
});

// ── Health Check ─────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Fallback for API routes ──────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not found', message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Start Server ─────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n  ⚡ Hackverse server running at http://localhost:${PORT}`);
  console.log(`  📄 Frontend:  http://localhost:${PORT}/index.html`);
  console.log(`  🔐 Auth page: http://localhost:${PORT}/auth.html`);
  console.log(`  🏥 Health:    http://localhost:${PORT}/api/health`);
  console.log(`  🌍 Env:       ${process.env.NODE_ENV || 'development'}\n`);
});

// ── Graceful Shutdown ────────────────────────────────
async function gracefulShutdown(signal) {
  console.log(`\n[Server] ${signal} received — shutting down gracefully...`);

  server.close(() => {
    console.log('[Server] HTTP server closed');
  });

  try {
    const { closeRedis } = require('./rate-limiter/lib/redisClient');
    await closeRedis();
    console.log('[Server] Redis connection closed');
  } catch {
    // Redis client not available — nothing to close
  }

  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
