/**
 * AXIOM Theme Manager (Updated)
 * Supports: Onyx, Light, Amethyst, Emerald, Amber
 */

(function() {
  'use strict';
  
  const STORAGE_KEY = 'axiom-theme';
  const DEFAULT_THEME = 'onyx';
  
  // Define all available themes and their primary "brand" color
  // These colors appear in the mobile browser's status bar
  const THEME_CONFIG = {
    onyx: '#06b6d4',      // Cyan 500
    light: '#2563eb',     // Blue 600
    amethyst: '#8b5cf6',  // Violet 500
    emerald: '#10b981',   // Emerald 500
    amber: '#f59e0b'      // Amber 500
  };

  const THEME_KEYS = Object.keys(THEME_CONFIG);
  
  function loadTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return THEME_KEYS.includes(saved) ? saved : DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browser chrome
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_CONFIG[theme] || THEME_CONFIG[DEFAULT_THEME]);
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('[AXIOM] Could not save theme preference');
    }
  }
  
  // Initial pre-render execution
  const savedTheme = loadTheme();
  applyTheme(savedTheme);
  
  window.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('[data-theme-select]');
    
    function updateButtons(activeTheme) {
      buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme-select') === activeTheme);
      });
    }
    
    updateButtons(savedTheme);
    
    // Click handlers
    buttons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const theme = this.getAttribute('data-theme-select');
        applyTheme(theme);
        updateButtons(theme);
      });
    });
    
    // Keyboard shortcut (Ctrl+T) - Now cycles through ALL themes
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme');
        const currentIndex = THEME_KEYS.indexOf(current);
        const nextIndex = (currentIndex + 1) % THEME_KEYS.length;
        const nextTheme = THEME_KEYS[nextIndex];
        
        applyTheme(nextTheme);
        updateButtons(nextTheme);
      }
    });
    
    console.log('[AXIOM] Theme system initialized with support for:', THEME_KEYS.join(', '));
  });
})();