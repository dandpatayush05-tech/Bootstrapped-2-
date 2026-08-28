/**
 * JWT Token Service
 *
 * Handles signing and verification of access and refresh tokens.
 * Access tokens are short-lived (15 min), refresh tokens are long-lived (7 days).
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Secrets — MUST be set via environment in production
const JWT_SECRET = process.env.JWT_SECRET
  || crypto.randomBytes(32).toString('hex');

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
  || crypto.randomBytes(32).toString('hex');

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Sign a short-lived access token.
 * @param {string} userId
 * @param {string} email
 * @returns {string} JWT access token
 */
function signAccessToken(userId, email) {
  return jwt.sign(
    { sub: userId, email, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

/**
 * Sign a long-lived refresh token.
 * @param {string} userId
 * @returns {string} JWT refresh token
 */
function signRefreshToken(userId) {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

/**
 * Verify an access token.
 * @param {string} token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Verify a refresh token.
 * @param {string} token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
};
