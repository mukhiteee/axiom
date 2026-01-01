/**
 * ═══════════════════════════════════════════════════════════
 * AXIOM // ANALYTICS CORE - DATABASE VERSION
 * ═══════════════════════════════════════════════════════════
 */

const AxiomAnalytics = {
    state: {
        currentTab: 'overview',
        period: 30,
        habitFilter: 'all',
        data: { logs: [], habits: [] }
    },

    async init() {
        console.log("AXIOM // Analytics Engine: Fetching from DB...");
        await this.fetchFromDB();
        this.bindEvents();
        this.renderActiveTab();
        this.updateSidebar();
    },

    // 1. THE DATABASE BRIDGE
    async fetchFromDB() {
        try {
            // Fetching logs and habits in parallel for speed
            const [logsRes, habitsRes] = await Promise.all([
                fetch(`api/get_logs.php?period=${this.state.period}`),
                fetch(`api/get_habits.php`)
            ]);

            this.state.data.logs = await logsRes.json();
            this.state.data.habits = await habitsRes.json();
        } catch (error) {
            console.error("AXIOM // Database Connection Failed:", error);
            // Fallback for UI if DB is unreachable
            this.state.data.logs = []; 
        }
    },

    // 2. EVENT BINDING
    bindEvents() {
        // Tab Switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.state.currentTab = e.target.dataset.tab;
                this.renderActiveTab();
            });
        });

        // Dropdown Filters - Now triggers a fresh DB Fetch
        document.getElementById('periodFilter')?.addEventListener('change', async (e) => {
            this.state.period = parseInt(e.target.value);
            await this.fetchFromDB(); // Re-fetch for the new time window
            this.renderActiveTab();
            this.updateSidebar();
        });
    },

    // 3. RENDERING ENGINE
    renderActiveTab() {
        const container = document.getElementById('tab-content');
        if (!container) return;

        const logs = this.state.data.logs;
        
        container.innerHTML = ''; // Clear loader

        switch(this.state.currentTab) {
            case 'overview':
                this.tabs.overview(container, logs);
                break;
            case 'insights':
                this.tabs.insights(container, logs);
                break;
            default:
                container.innerHTML = `<div class="glass-card fade-in">Component [${this.state.currentTab}] Loading...</div>`;
        }
    },

    updateSidebar() {
        const logs = this.state.data.logs;
        const totalLogsEl = document.getElementById('side-total-logs');
        const avgIntensityEl = document.getElementById('side-avg-intensity');

        if (totalLogsEl) totalLogsEl.innerText = logs.length;
        
        if (avgIntensityEl && logs.length > 0) {
            const avg = logs.reduce((acc, l) => acc + (parseFloat(l.intensity) || 0), 0) / logs.length;
            avgIntensityEl.innerText = avg.toFixed(1);
        }
    },

    // 4. TAB RENDERERS
    tabs: {
        overview(container, logs) {
            if (logs.length === 0) {
                container.innerHTML = `<div class="glass-card fade-in" style="text-align:center; padding:var(--space-12);">
                    <p style="color:var(--text-tertiary); font-family:var(--font-mono);">NO DATABASE ENTRIES FOUND</p>
                </div>`;
                return;
            }

            const stats = AxiomAnalytics.utils.calculateStats(logs);
            
            container.innerHTML = `
                <div class="overview-grid fade-in">
                    <section class="overview-section glass-card">
                        <h3 class="section-title">Integrity Breakdown</h3>
                        <div class="integrity-bars">
                            ${AxiomAnalytics.utils.renderBar('Physical', stats.physical, 'var(--success)')}
                            ${AxiomAnalytics.utils.renderBar('Mental', stats.mental, 'var(--primary)')}
                            ${AxiomAnalytics.utils.renderBar('Productivity', stats.prod, 'var(--warning)')}
                        </div>
                    </section>
                    <section class="overview-section glass-card streak-display">
                        <h3 class="section-title">Momentum Engine</h3>
                        <div class="streak-container">
                            <div class="streak-fire">
                                <span class="fire-icon">🔥</span>
                                <span class="streak-value">${stats.streak}</span>
                            </div>
                            <p class="streak-label">Active Streak</p>
                        </div>
                    </section>
                </div>
            `;
        }
    },

    // 5. MATH UTILITIES
    utils: {
        calculateStats(logs) {
            const cats = { physical: 0, mental: 0, productivity: 0 };
            logs.forEach(l => {
                const cat = l.category?.toLowerCase();
                if (l.completed && cats.hasOwnProperty(cat)) {
                    cats[cat]++;
                }
            });

            // Count unique days for streak
            const uniqueDays = [...new Set(logs.map(l => l.date))].length;

            return {
                physical: Math.round((cats.physical / (logs.length / 3 || 1)) * 100),
                mental: Math.round((cats.mental / (logs.length / 3 || 1)) * 100),
                prod: Math.round((cats.productivity / (logs.length / 3 || 1)) * 100),
                streak: uniqueDays
            };
        },
        renderBar(label, percent, color) {
            return `
                <div class="integrity-item">
                    <div class="bar-info"><span>${label}</span><span>${percent}%</span></div>
                    <div class="bar-bg">
                        <div class="bar-fill" style="width: ${percent}%; background: ${color}; box-shadow: 0 0 10px ${color}66;"></div>
                    </div>
                </div>`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => AxiomAnalytics.init());