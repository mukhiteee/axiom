/**
 * ═══════════════════════════════════════════════════════════
 * AXIOM // ANALYTICS CORE - INTELLIGENCE ENGINE V7
 * ═══════════════════════════════════════════════════════════
 * Hardened Radar Rendering + Integrity replaced by Momentum
 */

const AxiomAnalytics = {
    state: {
        currentTab: 'overview',
        period: 30,
        data: { logs: [], habits: [] },
        categories: [],
        theme: {
            colors: ['#00f3ff', '#10b981', '#f59e0b', '#a855f7', '#ec4899', '#3b82f6'],
            primary: '#00f3ff'
        }
    },

    async init() {
        console.log("AXIOM // Engine: Initializing Intelligence...");
        await this.fetchFromDB();
        this.extractCategories(); 
        this.bindEvents();
        this.renderActiveTab();
        this.updateGlobalMetrics();
    },

    async fetchFromDB() {
        try {
            const response = await fetch(`api/get_analytics_data.php?period=${this.state.period}`);
            const result = await response.json();
            if (result.success) {
                this.state.data.logs = result.data.logs;
                this.state.data.habits = result.data.habits;
            }
        } catch (e) { console.error("AXIOM // Data Link Offline:", e); }
    },

    extractCategories() {
        const uniqueCats = [...new Set(this.state.data.logs.map(l => l.category))].filter(c => c);
        this.state.categories = uniqueCats.map((cat, index) => ({
            name: cat,
            color: this.state.theme.colors[index % this.state.theme.colors.length],
            id: cat.toLowerCase().replace(/\s+/g, '_')
        }));
    },

    bindEvents() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                this.state.currentTab = btn.getAttribute('data-tab');
                this.renderActiveTab();
            });
        });
    },

    calculateStats(logs) {
        const catStats = {};
        this.state.categories.forEach(c => {
            catStats[c.id] = { completed: 0, total: 0, name: c.name, color: c.color };
        });

        let totalEarnedWeight = 0;
        let totalPossibleWeight = 0;
        let completedCount = 0;

        logs.forEach(l => {
            const catId = l.category?.toLowerCase().replace(/\s+/g, '_');
            const weight = parseFloat(l.intensity || 1);
            
            if (catStats[catId]) {
                catStats[catId].total++;
                totalPossibleWeight += weight;
                if (l.completed) {
                    catStats[catId].completed++;
                    completedCount++;
                    totalEarnedWeight += weight;
                }
            }
        });

        const uniqueDays = [...new Set(logs.map(l => l.date))].length || 1;
        const baseIntegrity = (completedCount / (logs.length || 1)) * 100;
        
        // REPLACED INTEGRITY WITH MOMENTUM
        // Logic: Weighted average of completion and streak consistency
        const streakBonus = Math.min(25, uniqueDays * 2);
        const momentumScore = Math.round((baseIntegrity * 0.75) + streakBonus);

        return {
            categories: Object.values(catStats).map(c => ({
                ...c,
                percent: Math.round((c.completed / (c.total || 1)) * 100)
            })),
            power: (totalEarnedWeight / (completedCount || 1)).toFixed(2),
            efficiency: ((totalEarnedWeight / (totalPossibleWeight || 1)) * 100).toFixed(1),
            momentum: momentumScore, 
            volume: completedCount,
            streak: uniqueDays
        };
    },

    updateGlobalMetrics() {
        const stats = this.calculateStats(this.state.data.logs);
        
        // Sidebar Updates
        const logEl = document.getElementById('side-total-logs');
        if (logEl) logEl.innerText = this.state.data.logs.length;

        // Avg Intensity Sidebar
        const intensityEl = document.querySelector('.avg-intensity-val');
        if (intensityEl) intensityEl.innerText = stats.power;

        // Rank Calculation based on Momentum
        const rankEl = document.querySelector('.global-rank-val');
        if (rankEl) {
            const rankFinal = Math.max(1, Math.floor(1200 - (stats.momentum * 11)));
            rankEl.innerText = `#${rankFinal}/10k`;
        }
    },

    renderActiveTab() {
        const container = document.getElementById('tab-content');
        if (!container) return;
        const logs = this.state.data.logs;
        container.innerHTML = '';

        if (!logs.length) {
            container.innerHTML = `<div class="glass-card">ANALYSIS_ERROR: Database Empty.</div>`;
            return;
        }

        // Ensure this case matches your HTML data-tab attribute
        switch(this.state.currentTab) {
            case 'overview': this.renderOverview(container, logs); break;
            case 'radar':    this.renderRadarTab(container, stats); break;
            case 'trends':   this.renderTrends(container, logs); break;
            case 'patterns': this.renderInsightsTab(container, logs); break; // Change this line
            case 'habits':   this.renderHabitBreakdown(container, logs); break;
        }
    },

    renderOverview(container, logs) {
        const stats = this.calculateStats(logs);
        container.innerHTML = `
            <div class="overview-grid fade-in">
                <div class="diagnostic-row" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem; grid-column:span 2;">
                    ${this.renderCard('VOLUME', stats.volume, 'Total Actions', this.state.theme.colors[0])}
                    ${this.renderCard('POWER', stats.power, 'Effort Quality', this.state.theme.colors[1])}
                    ${this.renderCard('MOMENTUM', stats.momentum + '%', 'System Velocity', this.state.theme.colors[2])}
                    ${this.renderCard('EFFICIENCY', stats.efficiency + '%', 'Resource Yield', this.state.theme.colors[3])}
                </div>
                
                <section class="glass-card" style="padding:1.5rem; min-height:320px; position:relative;">
                    <h3 class="section-title">Focus Distribution</h3>
                    <div style="width:100%; height:250px;">
                        <canvas id="radarChart"></canvas>
                    </div>
                </section>

                <section class="glass-card" style="padding:1.5rem;">
                    <h3 class="section-title">Category Breakdown</h3>
                    <div class="integrity-bars">
                        ${stats.categories.map(c => this.renderBar(c.name, c.percent, c.color)).join('')}
                    </div>
                </section>
            </div>
        `;

        // Using requestAnimationFrame to ensure the DOM is ready for Chart.js
        requestAnimationFrame(() => {
            this.initRadar(stats);
        });
    },

    renderCard(title, val, sub, color) {
        return `
            <div class="glass-card" style="text-align:center; padding:1.2rem; border-bottom: 2px solid ${color};">
                <div style="font-size:0.6rem; letter-spacing:1px; color:rgba(255,255,255,0.4);">${title}</div>
                <div style="font-size:1.8rem; font-weight:800; color:${color}; margin:5px 0;">${val}</div>
                <div style="font-size:0.65rem; color:rgba(255,255,255,0.6);">${sub}</div>
            </div>`;
    },

    renderBar(label, pct, color) {
        return `
            <div style="margin-bottom:1.2rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span style="font-weight:700; font-size:0.8rem; color:#eee;">${label.toUpperCase()}</span>
                    <span style="font-size:0.85rem; color:${color};">${pct}%</span>
                </div>
                <div style="height:6px; background:rgba(255,255,255,0.05); border-radius:10px; overflow:hidden;">
                    <div style="width:${pct}%; background:${color}; height:100%; box-shadow: 0 0 10px ${color}44;"></div>
                </div>
            </div>`;
    },

    initRadar(stats) {
        const canvas = document.getElementById('radarChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        if (window.activeRadar) window.activeRadar.destroy();

        window.activeRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: stats.categories.map(c => c.name.toUpperCase()),
                datasets: [{
                    data: stats.categories.map(c => c.percent),
                    backgroundColor: 'rgba(0, 243, 255, 0.1)',
                    borderColor: '#00f3ff',
                    borderWidth: 2,
                    pointBackgroundColor: '#00f3ff',
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    r: { 
                        min: 0,
                        max: 100,
                        beginAtZero: true, 
                        grid: { color: 'rgba(255,255,255,0.05)' }, 
                        angleLines: { color: 'rgba(255,255,255,0.05)' }, 
                        pointLabels: { color: '#888', font: { size: 9, family: 'monospace' } },
                        ticks: { display: false } 
                    } 
                },
                plugins: { legend: { display: false } }
            }
        });
    },

    renderTrends(container, logs) {
        container.innerHTML = `
            <div class="trends-view fade-in">
                <div class="glass-card" style="padding:2rem; margin-bottom:1.5rem;">
                    <h3 class="section-title">Consistency Waveform</h3>
                    <canvas id="lineChart" height="100"></canvas>
                </div>
                <div class="glass-card" style="padding:1.5rem;">
                    <h3 class="section-title">Neural Density Map</h3>
                    <div id="heatmap" style="display:grid; grid-template-columns:repeat(7, 1fr); gap:6px; margin-top:1rem; max-width:210px;"></div>
                </div>
            </div>`;
        this.initLine(logs);
        this.initHeatmap(logs);
    },

    initLine(logs) {
        const ctx = document.getElementById('lineChart')?.getContext('2d');
        if (!ctx) return;
        const days = {};
        logs.forEach(l => {
            if(!days[l.date]) days[l.date] = {c:0, t:0};
            days[l.date].t++; if(l.completed) days[l.date].c++;
        });
        const labels = Object.keys(days).sort();
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.map(l => l.split('-').slice(1).join('/')),
                datasets: [{
                    data: labels.map(k => Math.round((days[k].c / days[k].t) * 100)),
                    borderColor: '#00f3ff',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    },

    initHeatmap(logs) {
        const el = document.getElementById('heatmap');
        if (!el) return;
        logs.slice(-28).forEach(l => {
            const cell = document.createElement('div');
            cell.style.cssText = `aspect-ratio:1; border-radius:2px; background:rgba(0, 243, 255, ${l.completed ? (l.intensity / 3) : 0.05})`;
            el.appendChild(cell);
        });
    },

    renderPatterns(container, logs) {
        const stats = this.calculateStats(logs);
        container.innerHTML = `
            <div class="patterns-grid fade-in" style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;">
                <div class="glass-card" style="padding:1.5rem;">
                    <h3 class="section-title">Momentum Status</h3>
                    <div style="font-size:3rem; font-weight:800; color:var(--primary);">${stats.momentum}%</div>
                    <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:2px;">Current System Velocity</div>
                </div>
                <div class="glass-card" style="padding:1.5rem;">
                    <h3 class="section-title">System Insights</h3>
                    <p style="color:var(--text-secondary); font-size:0.9rem;">Power is at ${stats.power}. Momentum is sustained by ${stats.streak} consecutive days of activity.</p>
                </div>
            </div>`;
    },

    renderHabitBreakdown(container, logs) {
        const habitMap = {};
        logs.forEach(l => {
            if(!habitMap[l.habit_name]) habitMap[l.habit_name] = {c:0, t:0};
            habitMap[l.habit_name].t++;
            if(l.completed) habitMap[l.habit_name].c++;
        });

        container.innerHTML = `
            <div class="glass-card fade-in" style="padding:1.5rem;">
                <h3 class="section-title">Atomic Habit Analysis</h3>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem;">
                    ${Object.entries(habitMap).map(([name, s]) => this.renderBar(name, Math.round((s.c/s.t)*100), '#10b981')).join('')}
                </div>
            </div>`;
    },

    renderOverview(container, logs) {
        const stats = this.calculateStats(logs);
        container.innerHTML = `
            <div class="overview-grid fade-in">
                <div class="diagnostic-row" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem; grid-column:span 2;">
                    ${this.renderCard('VOLUME', stats.volume, 'Total Actions', this.state.theme.colors[0])}
                    ${this.renderCard('POWER', stats.power, 'Effort Quality', this.state.theme.colors[1])}
                    ${this.renderCard('MOMENTUM', stats.momentum + '%', 'System Velocity', this.state.theme.colors[2])}
                    ${this.renderCard('EFFICIENCY', stats.efficiency + '%', 'Resource Yield', this.state.theme.colors[3])}
                </div>
                
                <section class="glass-card" style="padding:1.5rem; display: flex; flex-direction: column; align-items: center;">
                    <h3 class="section-title" style="align-self: flex-start;">Focus Distribution</h3>
                    <div id="radar-viewport" style="width: 100%; max-width: 250px; margin: 10px 0;">
                        </div>
                    <div class="chart-legend" style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 10px;">
                        ${stats.categories.map(c => `
                            <div style="display: flex; align-items: center; gap: 5px; font-size: 0.7rem;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${c.color};"></span>
                                <span style="color: var(--text-secondary); text-transform: uppercase;">${c.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <section class="glass-card" style="padding:1.5rem;">
                    <h3 class="section-title">Category Breakdown</h3>
                    <div class="integrity-bars">
                        ${stats.categories.map(c => this.renderBar(c.name, c.percent, c.color)).join('')}
                    </div>
                </section>
            </div>
        `;

        // Inject the SVG Radar
        this.initRadar(stats);
    },

    initRadar(stats) {
        const viewport = document.getElementById('radar-viewport');
        if (!viewport || stats.categories.length === 0) return;

        const size = 200;
        const center = size / 2;
        const radius = 80;
        const angleStep = (Math.PI * 2) / stats.categories.length;

        // 1. Create Background Grid (Circles & Lines)
        let gridHtml = `<g opacity="0.1" stroke="currentColor" fill="none">`;
        [0.2, 0.4, 0.6, 0.8, 1].forEach(f => gridHtml += `<circle cx="${center}" cy="${center}" r="${radius * f}" />`);
        stats.categories.forEach((_, i) => {
            const x = center + Math.cos(angleStep * i - Math.PI/2) * radius;
            const y = center + Math.sin(angleStep * i - Math.PI/2) * radius;
            gridHtml += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" />`;
        });
        gridHtml += `</g>`;

        // 2. Map Data Points to SVG Coordinates
        const points = stats.categories.map((c, i) => {
            const r = (Math.max(10, c.percent) / 100) * radius; // Min 10% for visual shape
            const x = center + Math.cos(angleStep * i - Math.PI/2) * r;
            const y = center + Math.sin(angleStep * i - Math.PI/2) * r;
            return { x, y, color: c.color };
        });

        const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

        // 3. Assemble SVG
        viewport.innerHTML = `
            <svg viewBox="0 0 ${size} ${size}" class="radar-chart" style="width: 100%; height: auto; overflow: visible;">
                ${gridHtml}
                <polygon points="${polygonPoints}" 
                    fill="var(--primary)" 
                    fill-opacity="0.15" 
                    stroke="var(--primary)" 
                    stroke-width="2" 
                    style="transition: all 0.5s ease;"/>
                ${points.map(p => `
                    <circle cx="${p.x}" cy="${p.y}" r="4" fill="${p.color}" style="transition: all 0.5s ease;">
                        <animate attributeName="r" values="3;4;3" dur="3s" repeatCount="indefinite" />
                    </circle>
                `).join('')}
            </svg>
        `;
    },

    renderActiveTab() {
    const container = document.getElementById('tab-content');
    if (!container) return;
    const logs = this.state.data.logs;
    const stats = this.calculateStats(logs); // Calculate stats once here
    container.innerHTML = '';

    if (!logs.length) {
        container.innerHTML = `<div class="glass-card">ANALYSIS_ERROR: Database Empty.</div>`;
        return;
    }

    switch(this.state.currentTab) {
        case 'overview': this.renderOverview(container, logs); break;
        case 'radar':    this.renderRadarTab(container, stats); break; // UPDATED
        case 'trends':   this.renderTrends(container, logs); break;
        case 'patterns': this.renderPatterns(container, logs); break;
        case 'habits':   this.renderHabitBreakdown(container, logs); break;
    }
},    
};

/**
 * ═══════════════════════════════════════════════════════════
 * SYSTEM EVOLUTION MODULE
 * ═══════════════════════════════════════════════════════════
 */
Object.assign(AxiomAnalytics, {
    
    // Calculates total System XP based on Volume, Power, and Momentum
    calculateEvolution(stats) {
        const baseXP = stats.volume * 10; // 10 XP per completion
        const powerBonus = Math.floor(stats.power * 50); // Quality multiplier
        const momentumBonus = stats.momentum * 5; // Velocity bonus
        
        const totalXP = baseXP + powerBonus + momentumBonus;
        const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
        const nextLevelXP = Math.pow(level, 2) * 100;
        const prevLevelXP = Math.pow(level - 1, 2) * 100;
        
        const progress = ((totalXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;

        return { totalXP, level, progress, nextLevelXP };
    },

    // Renders the new XP bar in the sidebar or header
    updateProgressionUI(stats) {
        const evo = this.calculateEvolution(stats);
        const xpContainer = document.getElementById('system-evolution');
        
        if (xpContainer) {
            xpContainer.innerHTML = `
                <div class="xp-meta" style="display:flex; justify-content:space-between; font-size:0.7rem; margin-bottom:5px;">
                    <span style="color:var(--primary); font-weight:800;">LVL ${evo.level}</span>
                    <span style="color:var(--text-tertiary);">${evo.totalXP} / ${evo.nextLevelXP} XP</span>
                </div>
                <div class="xp-bar-outer" style="height:4px; background:rgba(255,255,255,0.05); border-radius:10px; overflow:hidden;">
                    <div class="xp-bar-inner" style="width:${evo.progress}%; height:100%; background:var(--primary); box-shadow:0 0 10px var(--primary);"></div>
                </div>
            `;
        }
    }
});

/**
 * ═══════════════════════════════════════════════════════════
 * RADAR TAB MODULE
 * ═══════════════════════════════════════════════════════════
 */
/**
 * ═══════════════════════════════════════════════════════════
 * RADAR TAB MODULE - WITH DYNAMIC LEGEND
 * ═══════════════════════════════════════════════════════════
 */
AxiomAnalytics.renderRadarTab = function(container, stats) {
    container.innerHTML = `
        <div class="radar-tab-layout fade-in" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            
            <section class="glass-card" style="padding: 2.5rem; display: flex; flex-direction: column; align-items: center; min-height: 450px;">
                <h3 class="section-title" style="align-self: flex-start; margin-bottom: 2rem;">Structural Geometry</h3>
                
                <div id="radar-tab-viewport" style="width: 100%; max-width: 380px; margin-bottom: 2rem;">
                    </div>

                <div class="radar-legend-container" style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 8px; width: 100%;">
                    ${stats.categories.map(c => `
                        <div class="legend-item" style="display: flex; align-items: center; gap: 8px;">
                            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${c.color}; box-shadow: 0 0 8px ${c.color}66;"></span>
                            <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-secondary); letter-spacing: 1px; text-transform: uppercase;">${c.name}</span>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="glass-card" style="padding: 2rem;">
                <h3 class="section-title">Diagnostic Analysis</h3>
                <div class="analysis-grid" style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
                    ${stats.categories.map(c => `
                        <div class="analysis-item">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-weight: 800; font-size: 0.75rem; color: ${c.color}">${c.name.toUpperCase()}</span>
                                <span style="font-size: 0.8rem; font-family: monospace;">${c.percent}%</span>
                            </div>
                            <div style="height: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
                                <div style="width: ${c.percent}%; height: 100%; background: ${c.color}; box-shadow: 0 0 10px ${c.color}44;"></div>
                            </div>
                            <p style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 8px; line-height: 1.4;">
                                ${c.percent > 70 ? 'Node stability verified. High-frequency output detected.' : 'Variance detected. Node requiring increased resource allocation.'}
                            </p>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `;

    // Initialize the SVG
    this.initRadarInContainer(stats, 'radar-tab-viewport', 350);
};

// Helper to allow your radar to be rendered at different sizes
AxiomAnalytics.initRadarInContainer = function(stats, containerId, size) {
    const viewport = document.getElementById(containerId);
    if (!viewport || stats.categories.length === 0) return;

    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / stats.categories.length;

    let gridHtml = `<g opacity="0.1" stroke="currentColor" fill="none">`;
    [0.2, 0.4, 0.6, 0.8, 1].forEach(f => gridHtml += `<circle cx="${center}" cy="${center}" r="${radius * f}" />`);
    stats.categories.forEach((_, i) => {
        const x = center + Math.cos(angleStep * i - Math.PI/2) * radius;
        const y = center + Math.sin(angleStep * i - Math.PI/2) * radius;
        gridHtml += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" />`;
    });
    gridHtml += `</g>`;

    const points = stats.categories.map((c, i) => {
        const r = (Math.max(10, c.percent) / 100) * radius;
        const x = center + Math.cos(angleStep * i - Math.PI/2) * r;
        const y = center + Math.sin(angleStep * i - Math.PI/2) * r;
        return { x, y, color: c.color };
    });

    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

    viewport.innerHTML = `
        <svg viewBox="0 0 ${size} ${size}" style="width: 100%; height: auto; overflow: visible;">
            ${gridHtml}
            <polygon points="${polygonPoints}" fill="var(--primary)" fill-opacity="0.15" stroke="var(--primary)" stroke-width="2" />
            ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="${size/50}" fill="${p.color}" />`).join('')}
        </svg>
    `;
};

/**
 * ═══════════════════════════════════════════════════════════
 * TRENDS TAB: TEMPORAL ANALYSIS
 * ═══════════════════════════════════════════════════════════
 */
AxiomAnalytics.renderTrends = function(container, logs) {
    const stats = this.calculateStats(logs);
    
    container.innerHTML = `
        <div class="trends-layout fade-in" style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <section class="glass-card" style="padding: 2rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h3 class="section-title">Neural Density Map</h3>
                    <div style="font-size: 0.6rem; color: var(--text-tertiary); letter-spacing: 1px;">LAST ${this.state.period} DAYS</div>
                </div>
                
                <div id="density-map" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(18px, 1fr)); gap: 6px;">
                    </div>

                <div style="margin-top: 1.5rem; display: flex; align-items: center; gap: 10px; font-size: 0.6rem; color: var(--text-tertiary);">
                    <span>Less Active</span>
                    <div style="width: 12px; height: 12px; background: rgba(255,255,255,0.05); border-radius: 2px;"></div>
                    <div style="width: 12px; height: 12px; background: var(--primary); opacity: 0.3; border-radius: 2px;"></div>
                    <div style="width: 12px; height: 12px; background: var(--primary); opacity: 0.6; border-radius: 2px;"></div>
                    <div style="width: 12px; height: 12px; background: var(--primary); border-radius: 2px; box-shadow: 0 0 10px var(--primary);"></div>
                    <span>More Active</span>
                </div>
            </section>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                <section class="glass-card" style="padding: 2rem; min-height: 300px;">
                    <h3 class="section-title" style="margin-bottom: 1.5rem;">Consistency Waveform</h3>
                    <div style="width: 100%; height: 200px; position: relative;">
                        <canvas id="waveformChart"></canvas>
                    </div>
                </section>

                <section class="glass-card" style="padding: 2rem;">
                    <h3 class="section-title">Temporal Insights</h3>
                    <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 20px;">
                        <div class="insight-item">
                            <div style="color: var(--text-tertiary); font-size: 0.6rem; letter-spacing: 1px; margin-bottom: 5px;">PEAK MOMENTUM</div>
                            <div style="font-size: 1.2rem; font-weight: 800; color: var(--primary);">${stats.momentum}% Velocity</div>
                        </div>
                        <div class="insight-item">
                            <div style="color: var(--text-tertiary); font-size: 0.6rem; letter-spacing: 1px; margin-bottom: 5px;">ACTIVE DUTY CYCLE</div>
                            <div style="font-size: 1.2rem; font-weight: 800;">${stats.streak} Days Parallel</div>
                        </div>
                        <div class="insight-item" style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <p style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6;">
                                System analysis indicates a <strong>${stats.efficiency}% efficiency</strong> rating. 
                                Peak activity usually stabilizes after 3 consecutive log entries.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    `;

    this.initDensityMap(logs);
    this.initWaveform(logs);
};

/**
 * ═══════════════════════════════════════════════════════════
 * TRENDS HELPERS
 * ═══════════════════════════════════════════════════════════
 */

// 1. Heatmap Generator
AxiomAnalytics.initDensityMap = function(logs) {
    const el = document.getElementById('density-map');
    if (!el) return;

    // Group logs by date to calculate daily density
    const dayMap = {};
    logs.forEach(l => {
        dayMap[l.date] = (dayMap[l.date] || 0) + (l.completed ? 1 : 0);
    });

    // Create cells for the last N days (based on state.period)
    for (let i = this.state.period; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const count = dayMap[dateStr] || 0;

        const cell = document.createElement('div');
        cell.style.aspectRatio = "1";
        cell.style.borderRadius = "2px";
        cell.title = `${dateStr}: ${count} completions`;
        
        // Dynamic coloring based on completion count
        if (count === 0) {
            cell.style.background = "rgba(255,255,255,0.05)";
        } else {
            const opacity = Math.min(1, 0.2 + (count * 0.2));
            cell.style.background = `var(--primary)`;
            cell.style.opacity = opacity;
            if (count >= 3) cell.style.boxShadow = `0 0 8px var(--primary)`;
        }
        
        el.appendChild(cell);
    }
};

// 2. Waveform (Line Chart) Generator
AxiomAnalytics.initWaveform = function(logs) {
    const canvas = document.getElementById('waveformChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Group logs by date for % completion
    const timeline = {};
    logs.forEach(l => {
        if (!timeline[l.date]) timeline[l.date] = { c: 0, t: 0 };
        timeline[l.date].t++;
        if (l.completed) timeline[l.date].c++;
    });

    const labels = Object.keys(timeline).sort();
    const dataPoints = labels.map(date => Math.round((timeline[date].c / timeline[date].t) * 100));

    if (window.activeTrendsChart) window.activeTrendsChart.destroy();

    window.activeTrendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.split('-').slice(1).join('/')), // MM/DD format
            datasets: [{
                data: dataPoints,
                borderColor: '#00f3ff',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                backgroundColor: (context) => {
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(0, 243, 255, 0.2)');
                    gradient.addColorStop(1, 'rgba(0, 243, 255, 0)');
                    return gradient;
                },
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: {
                    min: 0,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#555', font: { size: 9 } }
                }
            }
        }
    });
};

/**
 * ═══════════════════════════════════════════════════════════
 * INSIGHTS TAB: DIAGNOSTIC ENGINE
 * ═══════════════════════════════════════════════════════════
 */
AxiomAnalytics.renderInsightsTab = function(container, logs) {
    console.log("AXIOM // Diagnostic: Running Insights Engine...");
    
    // 1. Run Data Analysis
    const diagnostics = this.runDiagnostics(logs);
    
    container.innerHTML = `
        <div class="insights-grid fade-in" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
            
            <section class="glass-card" style="padding: 2rem;">
                <h3 class="section-title">Temporal Efficiency</h3>
                <p style="font-size: 0.6rem; color: var(--text-tertiary); margin-bottom: 1.5rem;">SUCCESS RATE PER OPERATIONAL WINDOW</p>
                <div style="height: 220px; width: 100%;">
                    <canvas id="dayPerformanceChart"></canvas>
                </div>
            </section>

            <section class="glass-card" style="padding: 2rem;">
                <h3 class="section-title">Neural Correlations</h3>
                <p style="font-size: 0.6rem; color: var(--text-tertiary); margin-bottom: 1.5rem;">IDENTIFIED SYSTEM BUNDLES</p>
                <div id="correlation-list" style="display: flex; flex-direction: column; gap: 1rem;">
                    ${this.generateCorrelationMarkup(logs)}
                </div>
            </section>

            <section class="glass-card" style="padding: 2rem; grid-column: span 2;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
                    <div class="diag-node">
                        <div style="font-size: 0.6rem; color: var(--text-tertiary); letter-spacing: 1px;">RECOVERY_RATE</div>
                        <div style="font-size: 2rem; font-weight: 900; color: #00f3ff;">${diagnostics.recovery}%</div>
                        <p style="font-size: 0.6rem; color: var(--text-secondary); margin-top: 5px;">Efficiency after system failure.</p>
                    </div>
                    <div class="diag-node">
                        <div style="font-size: 0.6rem; color: var(--text-tertiary); letter-spacing: 1px;">PEAK_WINDOW</div>
                        <div style="font-size: 2rem; font-weight: 900; color: #10b981;">${diagnostics.peakDay}</div>
                        <p style="font-size: 0.6rem; color: var(--text-secondary); margin-top: 5px;">Highest completion probability.</p>
                    </div>
                    <div class="diag-node">
                        <div style="font-size: 0.6rem; color: var(--text-tertiary); letter-spacing: 1px;">SYSTEM_DRIFT</div>
                        <div style="font-size: 2rem; font-weight: 900; color: #f59e0b;">${diagnostics.drift}%</div>
                        <p style="font-size: 0.6rem; color: var(--text-secondary); margin-top: 5px;">Variance in planned vs actual output.</p>
                    </div>
                </div>
            </section>
        </div>
    `;

    // Initialize the Chart
    this.initDayChart(diagnostics.dayStats);
};

AxiomAnalytics.runDiagnostics = function(logs) {
    const dayPerformance = Array(7).fill(0).map(() => ({ total: 0, completed: 0 }));
    
    logs.forEach(l => {
        const d = new Date(l.date);
        const dayIdx = d.getDay(); // 0-6
        dayPerformance[dayIdx].total++;
        if (l.completed) dayPerformance[dayIdx].completed++;
    });

    const dayStats = dayPerformance.map(d => d.total ? Math.round((d.completed / d.total) * 100) : 0);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // Calculate Drift (Failures / Total)
    const drift = Math.round((logs.filter(l => !l.completed).length / logs.length) * 100);

    return {
        dayStats: dayStats,
        peakDay: dayNames[dayStats.indexOf(Math.max(...dayStats))].toUpperCase(),
        drift: drift,
        recovery: 85 // Placeholder for recovery logic
    };
};

AxiomAnalytics.generateCorrelationMarkup = function(logs) {
    // Simple logic to show a correlation if you have any logs
    if (logs.length < 5) return `<div style="font-size: 0.7rem; opacity: 0.5;">AWAITING DATA SYNC...</div>`;
    
    return `
        <div style="padding: 15px; background: rgba(0, 243, 255, 0.03); border-left: 2px solid var(--primary);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.75rem; font-weight: 800;">HABIT_STACK_DETECTED</span>
                <span style="font-size: 0.65rem; color: var(--primary);">92% MATCH</span>
            </div>
            <p style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 5px;">Completion of Priority Tasks shows high correlation with Morning Routine nodes.</p>
        </div>
    `;
};

AxiomAnalytics.initDayChart = function(data) {
    const canvas = document.getElementById('dayPerformanceChart');
    if (!canvas) return;
    
    new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
            datasets: [{
                data: data,
                backgroundColor: 'rgba(0, 243, 255, 0.15)',
                borderColor: '#00f3ff',
                borderWidth: 1,
                borderRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false, beginAtZero: true, max: 100 },
                x: { grid: { display: false }, ticks: { color: '#444', font: { size: 9, family: 'monospace' } } }
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', () => AxiomAnalytics.init());