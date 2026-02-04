<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#00ffff">
  <title>AXIOM // Sign In</title>
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/themes.css">
  <link rel="stylesheet" href="css/gateway.css">

  <link rel="manifest" href="manifest.json">
  
  <!-- Theme MUST load before page renders -->
  <script src="js/theme.js"></script>
</head>
<body>
  
  <div class="gateway">
    
    <!-- LEFT: VISUAL PANEL -->
    <section class="visual-panel">
      <div class="visual-content">
        
        <!-- Brand -->
        <div class="brand">
          <div class="brand-logo">
            <div class="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2 17l10 5 10-5"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 class="brand-name">AXIOM</h1>
          </div>
          <p class="brand-tagline">
            A relational habit logic engine that treats your life as a system. 
            Track patterns, measure integrity, optimize performance.
          </p>
        </div>
        
        <!-- Chart -->
        <div class="chart-section">
          <div class="chart-header">
            <div class="chart-title">System Integrity</div>
            <div class="chart-value">87.3%</div>
          </div>
          
          <div class="chart-canvas">
            <svg viewBox="0 0 200 200" class="radar-chart">
              <!-- Grid -->
              <g opacity="0.2">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" stroke-width="1"/>
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" stroke-width="1"/>
                <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" stroke-width="1"/>
                <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" stroke-width="1"/>
                <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" stroke-width="1"/>
                <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" stroke-width="1"/>
              </g>
              
              <!-- Data -->
              <polygon 
                points="100,30 155,65 165,100 130,150 70,150 35,100 45,65" 
                fill="var(--primary)" 
                fill-opacity="0.2" 
                stroke="var(--primary)" 
                stroke-width="2"/>
              
              <!-- Points -->
              <circle cx="100" cy="30" r="4" fill="#22d3ee"/>
              <circle cx="155" cy="65" r="4" fill="#10b981"/>
              <circle cx="165" cy="100" r="4" fill="#a855f7"/>
              <circle cx="130" cy="150" r="4" fill="#f59e0b"/>
              <circle cx="70" cy="150" r="4" fill="#ef4444"/>
            </svg>
          </div>
          
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-dot" style="background: #22d3ee;"></span>
              <span>Mental</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #10b981;"></span>
              <span>Physical</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #a855f7;"></span>
              <span>Technical</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #f59e0b;"></span>
              <span>Social</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #ef4444;"></span>
              <span>Creative</span>
            </div>
          </div>
        </div>
        
        <!-- Features -->
        <div class="features">
          <div class="feature">
            <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            <span>Offline-first PWA architecture</span>
          </div>
          <div class="feature">
            <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>XP-based progression system</span>
          </div>
          <div class="feature">
            <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            <span>Command palette quick logging</span>
          </div>
        </div>
        
      </div>
      
      <!-- Theme Switcher -->
      <div class="theme-switcher">
  <button class="theme-btn active" data-theme-select="onyx" title="Onyx (Dark)">
    <span class="theme-preview" style="background: linear-gradient(135deg, #0c0c0d, #18181b);"></span>
  </button>
  <button class="theme-btn" data-theme-select="amethyst" title="Amethyst (Purple)">
    <span class="theme-preview" style="background: linear-gradient(135deg, #0a0a0f, #12121a);"></span>
  </button>
  <button class="theme-btn" data-theme-select="emerald" title="Emerald (Green)">
    <span class="theme-preview" style="background: linear-gradient(135deg, #060e14, #0f1719);"></span>
  </button>
  <button class="theme-btn" data-theme-select="amber" title="Amber (Orange)">
    <span class="theme-preview" style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a);"></span>
  </button>
  <button class="theme-btn" data-theme-select="light" title="Light Theme">
    <span class="theme-preview" style="background: linear-gradient(135deg, #ffffff, #f4f4f5);"></span>
  </button>
</div>
      
    </section>
    
    <!-- RIGHT: AUTH PANEL -->
    <section class="auth-panel">
      <div class="auth-wrapper">
        
        <div class="auth-header">
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to continue</p>
        </div>
        
        <div class="auth-card">
          
          <!-- Error -->
          <div class="auth-error" id="auth-error" style="display: none;"></div>
          
          <!-- Form -->
          <form class="auth-form" id="signin-form">
            <div class="form-group">
              <label for="username" class="form-label">Username or Email</label>
              <input 
                type="text" 
                id="username" 
                class="form-input"
                placeholder="your@email.com"
                autocomplete="username"
                required>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                id="password" 
                class="form-input"
                placeholder="••••••••"
                autocomplete="current-password"
                required>
            </div>
            
            <button type="submit" class="btn-submit">
              Sign In
            </button>
          </form>
          
          <div class="auth-footer">
            AXIOM v2026.01
          </div>
          
        </div>
        
      </div>
    </section>
    
  </div>

  <script src="js/auth.js"></script>
  
</body>
</html>