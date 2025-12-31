/**
 * AXIOM API Layer
 * Centralized API communication
 */

class AxiomAPI {
  constructor() {
    this.baseURL = 'api/';
  }
  
  /**
   * Generic API request handler
   */
  async request(endpoint, options = {}) {
    const url = this.baseURL + endpoint;
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'same-origin', // Important for session cookies
      ...options
    };
    
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data.data;
      
    } catch (error) {
      console.error('[API] Request failed:', error);
      throw error;
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // HABITS ENDPOINTS
  // ═══════════════════════════════════════════════════════════
  
  /**
   * Get all habits
   */
  async getHabits(category = 'all') {
    return this.request(`habits.php?action=list&category=${category}`);
  }
  
  /**
   * Create new habit
   */
  async createHabit(habitData) {
    return this.request('habits.php?action=create', {
      method: 'POST',
      body: habitData
    });
  }
  
  /**
   * Update habit
   */
  async updateHabit(habitId, updates) {
    return this.request('habits.php?action=update', {
      method: 'POST',
      body: { id: habitId, ...updates }
    });
  }
  
  /**
   * Delete habit (soft delete)
   */
  async deleteHabit(habitId) {
    return this.request('habits.php?action=delete', {
      method: 'POST',
      body: { id: habitId }
    });
  }
  
  /**
   * Save check-in
   */
  async saveCheckin(checkinData) {
    return this.request('habits.php?action=checkin', {
      method: 'POST',
      body: checkinData
    });
  }
  
  /**
   * Get check-ins
   */
  async getCheckins(habitId = null, month = null) {
    let url = 'habits.php?action=checkins';
    if (habitId) url += `&habit_id=${habitId}`;
    if (month) url += `&month=${month}`;
    
    return this.request(url);
  }
  
  // ═══════════════════════════════════════════════════════════
  // AUTH ENDPOINTS (for reference)
  // ═══════════════════════════════════════════════════════════
  
  /**
   * Login
   */
  async login(username, password) {
    return this.request('auth.php?action=login', {
      method: 'POST',
      body: { username, password }
    });
  }
  
  /**
   * Logout
   */
  async logout() {
    return this.request('auth.php?action=logout', {
      method: 'POST'
    });
  }
  
  /**
   * Validate session
   */
  async validateSession() {
    return this.request('auth.php?action=validate');
  }
}

// Create global instance
window.AxiomAPI = new AxiomAPI();

console.log('[AXIOM] API layer initialized');