/**
 * Hackverse — Frontend Authentication Client
 *
 * Handles login/signup form submission, token management,
 * password strength visualization, and form tab switching.
 */

(function () {
  'use strict';

  // ── API Base ───────────────────────────────────────
  const API_BASE = '/api/auth';

  // ── DOM Elements ───────────────────────────────────
  const tabLogin  = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const msgBox     = document.getElementById('auth-message');
  const msgText    = document.getElementById('auth-message-text');
  const footerLink = document.getElementById('footer-switch-link');
  const footerDiv  = document.getElementById('auth-footer');

  // Password strength elements
  const strengthContainer = document.getElementById('password-strength');
  const strengthBarFill   = document.getElementById('strength-bar-fill');
  const strengthText      = document.getElementById('strength-text');
  const strengthTips      = document.getElementById('strength-tips');

  // ── Token Storage ──────────────────────────────────
  // Access token in sessionStorage (cleared on tab close)
  // Refresh token via httpOnly cookie (managed by server)

  function storeAccessToken(token) {
    sessionStorage.setItem('hackverse_access_token', token);
  }

  function getAccessToken() {
    return sessionStorage.getItem('hackverse_access_token');
  }

  function storeUserInfo(user) {
    sessionStorage.setItem('hackverse_user', JSON.stringify(user));
  }

  // ── Tab Switching ──────────────────────────────────
  function switchToLogin() {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    footerDiv.innerHTML = 'Don\'t have an account? <a href="#" id="footer-switch-link">Create one</a>';
    document.getElementById('footer-switch-link').addEventListener('click', handleFooterSwitch);
    hideMessage();
  }

  function switchToSignup() {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    footerDiv.innerHTML = 'Already have an account? <a href="#" id="footer-switch-link">Sign in</a>';
    document.getElementById('footer-switch-link').addEventListener('click', handleFooterSwitch);
    hideMessage();
  }

  function handleFooterSwitch(e) {
    e.preventDefault();
    if (tabLogin.classList.contains('active')) {
      switchToSignup();
    } else {
      switchToLogin();
    }
  }

  tabLogin.addEventListener('click', switchToLogin);
  tabSignup.addEventListener('click', switchToSignup);
  footerLink.addEventListener('click', handleFooterSwitch);

  // Check URL params for initial tab
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tab') === 'signup') {
    switchToSignup();
  }

  // ── Messages ───────────────────────────────────────
  function showMessage(text, type = 'error') {
    msgBox.className = `auth-message show ${type}`;
    const iconEl = msgBox.querySelector('i');
    if (iconEl) {
      iconEl.className = type === 'error' ? 'ri-error-warning-line' : 'ri-check-line';
    }
    msgText.textContent = text;
  }

  function hideMessage() {
    msgBox.className = 'auth-message';
    msgText.textContent = '';
  }

  // ── Password Visibility Toggle ─────────────────────
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'ri-eye-line';
      } else {
        input.type = 'password';
        icon.className = 'ri-eye-off-line';
      }
    });
  });

  // ── Password Strength Indicator ────────────────────
  const signupPasswordInput = document.getElementById('signup-password');

  signupPasswordInput.addEventListener('input', () => {
    const val = signupPasswordInput.value;

    if (val.length === 0) {
      strengthContainer.classList.remove('visible');
      return;
    }

    strengthContainer.classList.add('visible');

    let score = 0;
    const tips = [];

    if (val.length >= 8) score++;
    else tips.push('8+ chars');

    if (/[A-Z]/.test(val)) score++;
    else tips.push('uppercase');

    if (/[a-z]/.test(val)) score++;
    else tips.push('lowercase');

    if (/[0-9]/.test(val)) score++;
    else tips.push('number');

    if (/[^A-Za-z0-9]/.test(val)) score++;
    else tips.push('symbol');

    const levels = [
      { label: 'Very Weak', cls: 'strength-weak', width: '20%', color: '#ef4444' },
      { label: 'Weak',      cls: 'strength-weak', width: '30%', color: '#ef4444' },
      { label: 'Fair',      cls: 'strength-fair', width: '50%', color: '#f59e0b' },
      { label: 'Good',      cls: 'strength-good', width: '75%', color: '#3b82f6' },
      { label: 'Strong',    cls: 'strength-strong', width: '100%', color: '#10b981' },
    ];

    const level = levels[Math.min(score, levels.length - 1)];
    strengthBarFill.style.width = level.width;
    strengthBarFill.className = `strength-bar-fill ${level.cls}`;
    strengthText.textContent = level.label;
    strengthText.style.color = level.color;
    strengthTips.textContent = tips.length > 0 ? `Need: ${tips.join(', ')}` : '✓ All criteria met';
    strengthTips.style.color = tips.length > 0 ? 'rgba(148, 163, 184, 0.6)' : '#10b981';
  });

  // ── Login Handler ──────────────────────────────────
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn      = document.getElementById('btn-login');

    if (!email || !password) {
      showMessage('Please fill in all fields.');
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        storeAccessToken(data.accessToken);
        storeUserInfo(data.user);
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      } else {
        showMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      showMessage('Network error. Please check your connection.');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  // ── Signup Handler ─────────────────────────────────
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();

    const name     = document.getElementById('signup-name').value.trim();
    const email    = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm  = document.getElementById('signup-confirm').value;
    const btn      = document.getElementById('btn-signup');

    // Client-side validation
    if (!name || !email || !password || !confirm) {
      showMessage('Please fill in all fields.');
      return;
    }

    if (name.length < 2) {
      showMessage('Name must be at least 2 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      showMessage('Password must be at least 8 characters.');
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      showMessage('Password needs uppercase, lowercase, and a number.');
      return;
    }

    if (password !== confirm) {
      showMessage('Passwords do not match.');
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        storeAccessToken(data.accessToken);
        storeUserInfo(data.user);
        showMessage('Account created! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 800);
      } else {
        showMessage(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      showMessage('Network error. Please check your connection.');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  // ── Already logged in? Redirect to home ────────────
  if (getAccessToken()) {
    window.location.href = 'index.html';
  }
})();
