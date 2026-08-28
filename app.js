/**
 * NexusAI - Core Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initFaqAccordion();
  initCounters();
  initChatTriggers();
  initYear();
});

/**
 * Theme Management (Dark / Light mode)
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve stored theme or default to dark
  const savedTheme = localStorage.getItem('nexus_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('nexus_theme', newTheme);
    });
  }
}

/**
 * Mobile Navigation Drawer
 */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'ri-close-line';
        } else {
          icon.className = 'ri-menu-4-line';
        }
      }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'ri-menu-4-line';
      });
    });
  }
}

/**
 * FAQ Accordion Interactivity
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });
}

/**
 * Animated Numbers Counter
 */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const duration = 1500; // ms
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const isDecimal = target % 1 !== 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
              clearInterval(timer);
            } else {
              counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.2 });

  const metricsStrip = document.querySelector('.metrics-strip');
  if (metricsStrip) {
    observer.observe(metricsStrip);
  }
}

/**
 * Triggers and Helpers to open Zapier Chatbot Widget
 */
function initChatTriggers() {
  const chatButtons = [
    document.getElementById('nav-chat-btn'),
    document.getElementById('hero-trigger-chat'),
    document.getElementById('cap-chat-trigger'),
    document.getElementById('highlight-chat-btn'),
    document.getElementById('footer-chat-btn'),
    document.getElementById('mockup-send-btn')
  ];

  chatButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openZapierChatbot();
      });
    }
  });

  // Prompt Pill Quick Questions
  const promptPills = document.querySelectorAll('.prompt-pill');
  promptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const promptText = pill.getAttribute('data-prompt');
      openZapierChatbot(promptText);
    });
  });
}

/**
 * Opens or interacts with the Zapier Chatbot component
 * @param {string} [initialMessage] - Optional message/prompt text to copy or pass
 */
function openZapierChatbot(initialMessage) {
  const zapierWidget = document.querySelector('zapier-interfaces-chatbot-embed') || document.getElementById('zapier-chatbot');
  
  if (zapierWidget) {
    // Check if shadowRoot or internal trigger button is accessible
    try {
      const shadowRoot = zapierWidget.shadowRoot;
      if (shadowRoot) {
        const launcherBtn = shadowRoot.querySelector('button') || shadowRoot.querySelector('[role="button"]');
        if (launcherBtn) {
          launcherBtn.click();
        }
      } else {
        // Dispatch click or toggle attribute if supported
        zapierWidget.click();
      }
    } catch (e) {
      console.log('Interacting with Zapier widget:', e);
    }
  }

  // If user clicked a prompt pill, provide a subtle copy toast or notification if needed
  if (initialMessage) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(initialMessage).then(() => {
        showToast(`Prompt copied: "${initialMessage}". Paste it into the chat!`);
      }).catch(() => {
        showToast(`Click into the chat window to ask: "${initialMessage}"`);
      });
    } else {
      showToast(`Ask the chatbot: "${initialMessage}"`);
    }
  }
}

/**
 * Lightweight Toast notification
 */
function showToast(message) {
  let toast = document.getElementById('nexus-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'nexus-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(15, 23, 42, 0.95);
      color: #fff;
      padding: 12px 22px;
      border-radius: 9999px;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      border: 1px solid rgba(99, 102, 241, 0.4);
      z-index: 99999;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
      opacity: 0;
      pointer-events: none;
      backdrop-filter: blur(10px);
      text-align: center;
      max-width: 90vw;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3500);
}

/**
 * Set dynamic footer copyright year
 */
function initYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Authentication State Management
 *
 * Checks for stored access token, refreshes if expired,
 * and updates the header UI (avatar vs login button).
 */
function initAuth() {
  const loginBtn  = document.getElementById('header-login-btn');
  const userMenu  = document.getElementById('header-user-menu');
  const avatarBtn = document.getElementById('header-avatar-btn');
  const dropdown  = document.getElementById('header-auth-dropdown');
  const logoutBtn = document.getElementById('header-logout-btn');

  if (!loginBtn || !userMenu) return;

  const accessToken = sessionStorage.getItem('hackverse_access_token');
  const storedUser  = sessionStorage.getItem('hackverse_user');

  if (accessToken && storedUser) {
    try {
      const user = JSON.parse(storedUser);
      showLoggedInUI(user);
    } catch {
      showLoggedOutUI();
    }
  } else {
    // Try silent refresh via refresh token cookie
    tryTokenRefresh();
  }

  // Avatar dropdown toggle
  if (avatarBtn) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
    });
  }

  function showLoggedInUI(user) {
    loginBtn.style.display = 'none';
    userMenu.style.display = 'block';

    // Set initials
    const initials = (user.name || 'U')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');

    const initialsEl = document.getElementById('header-avatar-initials');
    const nameEl     = document.getElementById('header-user-name');
    const emailEl    = document.getElementById('header-user-email');

    if (initialsEl) initialsEl.textContent = initials;
    if (nameEl) nameEl.textContent = user.name || 'User';
    if (emailEl) emailEl.textContent = user.email || '';
  }

  function showLoggedOutUI() {
    loginBtn.style.display = 'inline-flex';
    userMenu.style.display = 'none';
  }

  async function tryTokenRefresh() {
    try {
      const res = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('hackverse_access_token', data.accessToken);
        sessionStorage.setItem('hackverse_user', JSON.stringify(data.user));
        showLoggedInUI(data.user);
      } else {
        showLoggedOutUI();
      }
    } catch {
      // Server not available or no refresh token — show logged out
      showLoggedOutUI();
    }
  }
}

/**
 * Logout — clears tokens and redirects to auth page
 */
async function logout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Server unreachable — still clear local state
  }

  sessionStorage.removeItem('hackverse_access_token');
  sessionStorage.removeItem('hackverse_user');
  window.location.href = 'auth.html';
}
