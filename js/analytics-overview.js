/**
 * AXIOM ANALYTICS // OVERVIEW TAB
 * Visualizes Integrity, Trends, and Streaks
 */
const OverviewRenderer = {
    render(container, data) {
        const stats = this.processLogs(data.logs);
        
        container.innerHTML = `
            <div class="overview-grid fade-in">
                <section class="overview-section glass-card">
                    <h3 class="section-title">Integrity Breakdown</h3>
                    <div class="integrity-bars">
                        ${this.renderIntegrityBar('Physical', stats.physical, 'var(--success)')}
                        ${this.renderIntegrityBar('Mental', stats.mental, 'var(--primary)')}
                        ${this.renderIntegrityBar('Productivity', stats.prod, 'var(--warning)')}
                    </div>
                </section>

                <section class="overview-section glass-card streak-display">
                    <h3 class="section-title">Current Momentum</h3>
                    <div class="streak-container">
                        <div class="streak-fire">
                            <span class="fire-icon">🔥</span>
                            <span class="streak-value">${stats.streak}</span>
                        </div>
                        <p class="streak-label">Day Success Streak</p>
                    </div>
                </section>
            </div>
        `;
    },

    processLogs(logs) {
        // Simple logic: Calculate % of completed tasks per category
        const categories = { physical: 0, mental: 0, prod: 0, total: 0 };
        
        logs.forEach(log => {
            if (log.completed) {
                categories[log.category]++;
            }
            categories.total++;
        });

        // Calculate streaks (simplified logic)
        let streak = 0;
        const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
        // Logic would go here to check consecutive days...
        
        return {
            physical: Math.round((categories.physical / (logs.length / 3 || 1)) * 100),
            mental: Math.round((categories.mental / (logs.length / 3 || 1)) * 100),
            prod: Math.round((categories.prod / (logs.length / 3 || 1)) * 100),
            streak: 12 // Placeholder for logic
        };
    },

    renderIntegrityBar(label, percent, color) {
        return `
            <div class="integrity-item">
                <div class="bar-info">
                    <span>${label}</span>
                    <span>${percent}%</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${percent}%; background: ${color}; box-shadow: 0 0 10px ${color}66;"></div>
                </div>
            </div>
        `;
    }
};

// Listen for the Data Controller's broadcast
document.addEventListener('analytics-update', (e) => {
    const container = document.getElementById('tab-content');
    OverviewRenderer.render(container, e.detail);
});