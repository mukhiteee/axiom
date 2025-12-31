/* ═══════════════════════════════════════════════════════════
   AXIOM // THE STATE ENGINE
   Vanilla JS Store with IndexedDB Persistence
   ═══════════════════════════════════════════════════════════ */

class AxiomState {
  constructor() {
    this.db = null;
    this.dbName = 'axiom-db';
    this.dbVersion = 1;
    this.currentUser = null;
    this.theme = 'onyx';
    
    this.init();
  }
  
  async init() {
    await this.initDB();
    await this.registerServiceWorker();
    this.attachEventListeners();
    this.updateConnectionStatus();
    
    // Monitor online/offline status
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }
  
  // ═══ DATABASE INITIALIZATION ═══
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('[AXIOM] IndexedDB initialization failed');
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('[AXIOM] IndexedDB initialized');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // User Store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        }
        
        // Habits Store
        if (!db.objectStoreNames.contains('habits')) {
          const habitStore = db.createObjectStore('habits', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          habitStore.createIndex('userId', 'userId', { unique: false });
        }
        
        // Logs Store (Unsynced habit logs)
        if (!db.objectStoreNames.contains('logs')) {
          const logStore = db.createObjectStore('logs', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          logStore.createIndex('synced', 'synced', { unique: false });
          logStore.createIndex('userId', 'userId', { unique: false });
        }
        
        console.log('[AXIOM] Database schema created');
      };
    });
  }
  
    // ═══ SERVICE WORKER REGISTRATION ═══
    async registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('[AXIOM] Service Worker registered:', registration.scope);
          
          // Enable Background Sync
          if ('sync' in registration) {
            console.log('[AXIOM] Background Sync available');
          }
        } catch (error) {
          console.error('[AXIOM] Service Worker registration failed:', error);
        }
      }
    }
  
  // ═══ THEME MANAGEMENT ═══
  setTheme(theme) {
    this.theme = theme;
    document.body.setAttribute('data-theme', theme);
    
    const statusMode = document.getElementById('status-mode');
    if (statusMode) {
      statusMode.textContent = theme.toUpperCase();
    }
  }
  
  // ═══ CONNECTION STATUS ═══
  updateConnectionStatus() {
    const indicator = document.getElementById('connection-status');
    if (!indicator) return;
    
    if (navigator.onLine) {
      indicator.textContent = 'ONLINE';
      indicator.style.color = 'var(--primary)';
    } else {
      indicator.textContent = 'OFFLINE_READY';
      indicator.style.color = 'var(--text-tertiary)';
    }
  }
  
  handleOnline() {
    console.log('[AXIOM] Connection established');
    this.updateConnectionStatus();
    this.syncPendingLogs();
  }
  
  handleOffline() {
    console.log('[AXIOM] Connection lost - entering offline mode');
    this.updateConnectionStatus();
  }
  
  // ═══ BACKGROUND SYNC ═══
  async syncPendingLogs() {
    if (!this.db) return;
    
    const transaction = this.db.transaction(['logs'], 'readonly');
    const store = transaction.objectStore('logs');
    const index = store.index('synced');
    const request = index.getAll(false); // Get unsynced logs
    
    request.onsuccess = async () => {
      const unsyncedLogs = request.result;
      
      if (unsyncedLogs.length === 0) {
        console.log('[AXIOM] No pending logs to sync');
        return;
      }
      
      console.log(`[AXIOM] Syncing ${unsyncedLogs.length} pending logs...`);
      
      // In production, this would POST to your PHP API
      // For now, simulate sync
      for (const log of unsyncedLogs) {
        try {
          // await fetch('/api/habits/log', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(log)
          // });
          
          // Mark as synced
          await this.markLogSynced(log.id);
          console.log(`[AXIOM] Log ${log.id} synced`);
        } catch (error) {
          console.error(`[AXIOM] Failed to sync log ${log.id}:`, error);
        }
      }
    };
  }
  
  async markLogSynced(logId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['logs'], 'readwrite');
      const store = transaction.objectStore('logs');
      const request = store.get(logId);
      
      request.onsuccess = () => {
        const log = request.result;
        log.synced = true;
        log.syncedAt = Date.now();
        
        const updateRequest = store.put(log);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      };
    });
  }
  
  // ═══ AUTH HANDLING ═══
  async handleAuth(username, password) {
    console.log('[AXIOM] Authentication attempt:', username);
    
    // In production, this would validate against your PHP API
    // For now, simulate auth
    
    // Store user in IndexedDB
    const user = {
      username,
      createdAt: Date.now(),
      xp: 0,
      level: 1,
      integrity: 100
    };
    
    const transaction = this.db.transaction(['users'], 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(user);
    
    request.onsuccess = () => {
      this.currentUser = { ...user, id: request.result };
      console.log('[AXIOM] User authenticated:', this.currentUser);
      
      // Update UI
      document.getElementById('status-system').textContent = 'ACTIVE';
      
      // In production: redirect to dashboard
      alert('Authentication successful! (Dashboard coming in Phase 2)');
    };
    
    request.onerror = () => {
      console.error('[AXIOM] Auth failed:', request.error);
      alert('Authentication failed. Please try again.');
    };
  }
  
  // ═══ EVENT LISTENERS ═══
  attachEventListeners() {
    const authForm = document.getElementById('auth-form');
    
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        this.handleAuth(username, password);
      });
    }
    
    // Theme switcher (for testing)
    // In production, this would be based on system integrity
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 't') {
        const themes = ['onyx', 'monolith', 'critical'];
        const currentIndex = themes.indexOf(this.theme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        this.setTheme(nextTheme);
      }
    });
  }
}

// ═══ INITIALIZE ═══
const axiom = new AxiomState();

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   █████╗ ██╗  ██╗██╗ ██████╗ ███╗   ███╗                ║
║  ██╔══██╗╚██╗██╔╝██║██╔═══██╗████╗ ████║                ║
║  ███████║ ╚███╔╝ ██║██║   ██║██╔████╔██║                ║
║  ██╔══██║ ██╔██╗ ██║██║   ██║██║╚██╔╝██║                ║
║  ██║  ██║██╔╝ ██╗██║╚██████╔╝██║ ╚═╝ ██║                ║
║  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝                ║
║                                                           ║
║  RELATIONAL HABIT LOGIC ENGINE v2026.01                  ║
║  System initialized. All modules operational.            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);