/**
 * AXIOM Authentication & Session Management
 */

class AxiomAuth {
  constructor() {
    this.SESSION_KEY = 'axiom-session';
    this.USER_KEY = 'axiom-user';
    this.SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const session = localStorage.getItem(this.SESSION_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    if (!session || !user) return false;
    
    // Check session expiry
    const sessionData = JSON.parse(session);
    const now = Date.now();
    
    if (now - sessionData.timestamp > this.SESSION_DURATION) {
      this.logout();
      return false;
    }
    
    return true;
  }
  
  /**
   * Get current user
   */
  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  
  /**
   * Login user
   */
  async login(username, password) {
    try {
      const response = await fetch('api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      
      // Store user and session
      localStorage.setItem(this.USER_KEY, JSON.stringify(result.data.user));
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({
        timestamp: Date.now(),
        userId: result.data.user.id
      }));
      
      return result.data.user;
      
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      throw error;
    }
  }
  
  /**
   * Logout user
   */
  async logout() {
    try {
      // Call server logout
      await fetch('api/auth.php?action=logout', { method: 'POST' });
    } catch (error) {
      console.error('[AUTH] Logout API error:', error);
    }
    
    // Clear local data
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.SESSION_KEY);
    
    // Redirect to login
    window.location.href = 'index.html';
  }
  
  /**
   * Require authentication (redirect if not logged in)
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      console.log('[AUTH] Not authenticated, redirecting to login');
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }
  
  /**
   * Initialize auth on page load
   */
  init() {
    const currentPage = window.location.pathname;
    
    // If on dashboard.html, require auth
    if (currentPage.includes('dashboard.html')) {
      if (!this.requireAuth()) return;
      
      // Update UI with user data
      const user = this.getUser();
      if (user) {
        this.updateUI(user);
      }
    }
    
    // If on index.html and already logged in, redirect
    if (currentPage.includes('index.html') && this.isAuthenticated()) {
      console.log('[AUTH] Already authenticated, redirecting to dashboard');
      window.location.href = 'dashboard.html';
    }
  }
  
  /**
   * Update UI with user data
   */
  updateUI(user) {
    // Update avatar
    const avatar = document.getElementById('user-avatar');
    if (avatar) {
      const initials = user.username.substring(0, 2).toUpperCase();
      avatar.querySelector('span').textContent = initials;
    }
    
    // Store in window for global access
    window.AXIOM_USER = user;
  }
}

// Create global instance
window.AxiomAuth = new AxiomAuth();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.AxiomAuth.init();
  
  // Setup login form if on index.html
  const loginForm = document.getElementById('signin-form');
  if (loginForm) {
    setupLoginForm();
  }
  
  // Setup logout button if on dashboard
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to sign out?')) {
        window.AxiomAuth.logout();
      }
    });
  }
});

/**
 * Setup login form handler
 */
function setupLoginForm() {
  const form = document.getElementById('signin-form');
  const errorEl = document.getElementById('auth-error');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
      showError('Please enter your username and password');
      return;
    }
    
    setLoading(true);
    clearError();
    
    try {
      await window.AxiomAuth.login(username, password);
      
      // Redirect to dashboard
      window.location.href = 'dashboard.html';
      
    } catch (error) {
      showError(error.message);
      setLoading(false);
    }
  });
  
  function showError(message) {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }
  
  function clearError() {
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }
  }
  
  function setLoading(isLoading) {
    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.disabled = isLoading;
      submitBtn.textContent = isLoading ? 'SIGNING IN...' : 'SIGN IN';
    }
    
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.disabled = isLoading;
    });
  }
}