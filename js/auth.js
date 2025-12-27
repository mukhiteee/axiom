/**
 * AXIOM Authentication
 * Handles sign in form submission
 */

class AxiomAuth {
  constructor() {
    this.form = document.getElementById('signin-form');
    this.errorEl = document.getElementById('auth-error');
    this.init();
  }
  
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSignIn(e));
    }
    
    // Update theme button states when theme changes
    document.addEventListener('theme-changed', (e) => {
      this.updateThemeButtons(e.detail.theme);
    });
    
    // Set initial theme button state
    this.updateThemeButtons(window.themeManager.getCurrentTheme());
  }
  
  async handleSignIn(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
      this.showError('Username and password are required');
      return;
    }
    
    this.setLoading(true);
    this.clearError();
    
    // TODO: Connect to PHP API
    // For now, simulate auth
    setTimeout(() => {
      this.showError('API not connected yet. Please set up backend first.');
      this.setLoading(false);
    }, 1000);
    
    /*
    // Uncomment when API is ready:
    try {
      const response = await fetch('/api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Authentication failed');
      }
      
      // Success: redirect to dashboard
      window.location.href = '/dashboard.php';
      
    } catch (error) {
      this.showError(error.message);
      this.setLoading(false);
    }
    */
  }
  
  showError(message) {
    if (this.errorEl) {
      this.errorEl.textContent = `ERROR: ${message}`;
      this.errorEl.style.display = 'block';
    }
  }
  
  clearError() {
    if (this.errorEl) {
      this.errorEl.style.display = 'none';
      this.errorEl.textContent = '';
    }
  }
  
  setLoading(isLoading) {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = isLoading;
      submitBtn.querySelector('span').textContent = isLoading ? 'PROCESSING...' : 'AUTHENTICATE';
    }
  }
  
  updateThemeButtons(currentTheme) {
    // Update active state on theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      const theme = btn.getAttribute('data-theme-select');
      if (theme === currentTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new AxiomAuth();
});