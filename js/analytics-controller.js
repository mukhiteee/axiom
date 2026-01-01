/**
 * AXIOM ANALYTICS CONTROLLER
 * Location: assets/js/analytics-controller.js
 */
const AnalyticsController = {
    state: {
        period: 30,
        activeHabit: 'all',
        data: { logs: [], habits: [] }
    },

    init() {
        console.log("Axiom Controller: Initializing Handshake...");
        this.loadData();
        this.listen();
        
        // CRITICAL FIX: Trigger the first render immediately
        this.applyFilters();
    },

    loadData() {
        // Ensure these keys match exactly what you use in your logger
        this.state.data.logs = JSON.parse(localStorage.getItem('habit_logs')) || [];
        this.state.data.habits = JSON.parse(localStorage.getItem('habits')) || [];
    },

    listen() {
        const periodSelect = document.getElementById('periodFilter');
        const habitSelect = document.getElementById('habitFilter');

        periodSelect?.addEventListener('change', (e) => {
            this.state.period = parseInt(e.target.value);
            this.applyFilters();
        });

        habitSelect?.addEventListener('change', (e) => {
            this.state.activeHabit = e.target.value;
            this.applyFilters();
        });
    },

    applyFilters() {
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - this.state.period);

        const filteredLogs = this.state.data.logs.filter(log => {
            const logDate = new Date(log.date);
            const matchesDate = logDate >= cutoff;
            const matchesHabit = this.state.activeHabit === 'all' || log.habitId == this.state.activeHabit;
            return matchesDate && matchesHabit;
        });

        // The "Signal" that tells OverviewRenderer.js to draw the bars
        const event = new CustomEvent('analytics-update', { 
            detail: { 
                logs: filteredLogs,
                period: this.state.period 
            } 
        });
        document.dispatchEvent(event);
    }
};

// Start the engine as soon as the window is ready
window.addEventListener('load', () => AnalyticsController.init());