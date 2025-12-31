const Analytics = {
    charts: {},

    init: function() {
        // Ensure data exists before running
        if (!window.habitsCache || !window.checkinsCache) return;

        this.calculateTopStats();
        this.renderHabitList();
        this.renderHeatmap();
        this.initTrendChart();
        this.initMoodChart();
    },

    calculateTopStats: function() {
        const totalHabits = habitsCache.length;
        const totalDone = checkinsCache.filter(c => c.completed == 1).length;
        
        // 1. Total Habits
        document.getElementById('stat-total-habits').innerText = totalHabits;

        // 2. Avg Completion (Last 30 days)
        const avg = totalHabits > 0 ? Math.round((totalDone / (totalHabits * 30)) * 100) : 0;
        document.getElementById('stat-avg-completion').innerText = `${avg}%`;

        // 3. Best Habit calculation
        const habitStats = habitsCache.map(h => {
            const count = checkinsCache.filter(c => c.habit_id == h.id && c.completed == 1).length;
            return { name: h.name, score: count };
        });
        const best = habitStats.reduce((prev, curr) => (prev.score > curr.score) ? prev : curr, {name: 'None', score: 0});
        document.getElementById('stat-best-habit').innerText = best.score > 0 ? `${Math.round((best.score/30)*100)}%` : '--';
        document.getElementById('stat-best-habit-name').innerText = best.name;
    },

    renderHabitList: function() {
        const list = document.getElementById('habitsListDynamic');
        list.innerHTML = '';
        
        habitsCache.forEach(habit => {
            const count = checkinsCache.filter(c => c.habit_id == habit.id && c.completed == 1).length;
            const pct = Math.round((count / 30) * 100);
            
            const item = document.createElement('div');
            item.className = 'habit-item';
            item.innerHTML = `
                <div class="habit-info">
                    <div class="habit-name">${habit.name}</div>
                    <div class="habit-meta">${habit.category || 'General'}</div>
                </div>
                <div class="habit-progress">
                    <div class="progress-bar"><div class="progress-fill" style="width: ${pct}%; background: ${habit.color}"></div></div>
                    <div class="progress-text" style="color: ${habit.color}">${pct}%</div>
                </div>`;
            list.appendChild(item);
        });
    },

    initTrendChart: function() {
        const ctx = document.getElementById('lineChart').getContext('2d');
        if (this.charts.line) this.charts.line.destroy();

        // Calculate completions for the last 7 days
        const labels = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            labels.push(d.toLocaleDateString('en-US', {weekday: 'short'}));
            data.push(checkinsCache.filter(c => c.date === dateStr && c.completed == 1).length);
        }

        this.charts.line = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Habits Completed',
                    data: data,
                    borderColor: '#667eea',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(102, 126, 234, 0.1)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    },

    renderHeatmap: function() {
        const container = document.getElementById('heatmapDynamic');
        container.innerHTML = '';
        const colors = ['#f3f4f6', '#dbeafe', '#93c5fd', '#3b82f6', '#1e3a8a'];
        
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const count = checkinsCache.filter(c => c.date === dateStr && c.completed == 1).length;
            
            const intensity = count === 0 ? 0 : Math.min(count, 4);
            const day = document.createElement('div');
            day.className = 'heatmap-day';
            day.style.backgroundColor = colors[intensity];
            day.title = `${dateStr}: ${count} habits`;
            container.appendChild(day);
        }
    },
    
    initMoodChart: function() {
        // Logic similar to TrendChart, grouping checkins by checkin.mood
    }
};