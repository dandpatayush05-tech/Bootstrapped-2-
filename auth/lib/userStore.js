/**
 * File-Based User Store
 *
 * Lightweight JSON-file persistence for hackathon-scale user management.
 * Swap this module for a real database adapter (MongoDB, PostgreSQL, etc.)
 * when scaling beyond a prototype.
 *
 * Data file: data/users.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

/**
 * Ensure the data directory and file exist.
 */
function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf8');
  }
}

/**
 * Read all users from the JSON file.
 * @returns {Array} Array of user objects
 */
function readUsers() {
  ensureStore();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Write the full users array to the JSON file.
 * @param {Array} users
 */
function writeUsers(users) {
  ensureStore();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

/**
 * Create a new user.
 * @param {string} email           - User email (unique)
 * @param {string} hashedPassword  - bcrypt-hashed password
 * @param {string} name            - Display name
 * @returns {Object} The created user (without password)
 */
function createUser(email, hashedPassword, name) {
  const users = readUsers();

  const existing = users.find(u => u.email === email.toLowerCase().trim());
  if (existing) {
    throw new Error('EMAIL_EXISTS');
  }

  const user = {
    id: crypto.randomUUID(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);

  // Return without password
  const { password, ...safeUser } = user;
  return safeUser;
}

/**
 * Find a user by email.
 * @param {string} email
 * @returns {Object|null} User object (including hashed password) or null
 */
function findByEmail(email) {
  const users = readUsers();
  return users.find(u => u.email === email.toLowerCase().trim()) || null;
}

/**
 * Find a user by ID.
 * @param {string} id
 * @returns {Object|null} User object (without password) or null
 */
function findById(id) {
  const users = readUsers();
  const user = users.find(u => u.id === id);
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = { createUser, findByEmail, findById };
