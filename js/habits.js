/**
 * AXIOM HABITS - Final Logic Controller
 * Version: 4.6.0 (Theme-Aware Hover Cards & High Z-Index)
 */

let habitsCache = [];
let checkinsCache = [];
let currentViewDate = new Date();

// THE HANDSHAKE
document.addEventListener('view-loaded', (e) => {
    if (e.detail.view === 'habits') {
        injectThemeAwareStyles(); // Injects the high z-index, theme-aware CSS
        initHabitsView();
    }
});

/**
 * INJECT THEME-AWARE STYLES
 * Handles Light/Dark mode automatically and ensures card visibility.
 */
function injectThemeAwareStyles() {
    if (document.getElementById('axiom-card-styles')) return;
    const style = document.createElement('style');
    style.id = 'axiom-card-styles';
    style.innerHTML = `
        /* Root variable detection for the card */
        :root {
            --card-bg: #ffffff;
            --card-text: #1e293b;
            --card-sub: #64748b;
            --card-border: #e2e8f0;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --card-bg: #1e293b;
                --card-text: #f8fafc;
                --card-sub: #94a3b8;
                --card-border: #334155;
            }
        }

        .habit-table td, .sticky-col { overflow: visible !important; }
        .habit-info-wrapper { position: relative; display: inline-block; cursor: help; }
        
        .habit-card-popover {
            display: none; 
            position: absolute; 
            left: calc(100% + 15px);
            top: 50%; 
            transform: translateY(-50%); 
            width: 280px;
            background: var(--card-bg); 
            border: 1px solid var(--card-border); 
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
            z-index: 99999; /* Increased Z-Index */
            overflow: hidden; 
            pointer-events: none;
            transition: opacity 0.2s ease;
        }

        .habit-info-wrapper:hover .habit-card-popover { 
            display: flex; 
            animation: hPop 0.2s ease-out; 
        }

        @keyframes hPop { 
            from { opacity: 0; transform: translateY(-50%) translateX(-10px); } 
            to { opacity: 1; transform: translateY(-50%) translateX(0); } 
        }

        .card-accent { width: 6px; flex-shrink: 0; }
        .card-content { padding: 16px; flex-grow: 1; text-align: left; }
        .card-meta { font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--card-sub); }
        .card-title { margin: 4px 0 10px; font-size: 16px; font-weight: 700; color: var(--card-text); }
        .card-body label { display: block; font-size: 11px; font-weight: 600; color: var(--card-sub); margin-bottom: 2px; }
        .card-body p { margin: 0; font-size: 13px; color: var(--card-text); line-height: 1.5; opacity: 0.9; }
        .card-body p.empty-state { font-style: italic; opacity: 0.5; }

        /* 1. Ensure the row being hovered is always on top of other rows */
.habit-table tr:hover {
    z-index: 999;
    position: relative;
}

/* 2. Ensure the sticky column doesn't clip the card */
.sticky-col {
    z-index: 10;
    position: sticky;
    left: 0;
}

/* 3. Make the wrapper specifically high priority */
.habit-info-wrapper:hover {
    z-index: 100000;
}
    `;
    document.head.appendChild(style);
    addChartStyles();
    addSleepTrackerStyles();
}

async function initHabitsView() {
    updateMonthLabel();
    setupFormToggles(); 
    
    const hResponse = await fetchAPI('list');
    
    if (hResponse.success) {
        habitsCache = hResponse.data || [];
        
        const countDisplay = document.getElementById('habits-count');
        if (countDisplay) {
            const count = habitsCache.length;
            countDisplay.innerText = `${count} Habit${count !== 1 ? 's' : ''} active`;
        }
        
        await renderSpreadsheet(hResponse);
        renderSleepTracker();
    }
}

async function fetchAPI(action, method = 'GET', body = null) {
    try {
        const options = { method };
        if (body) {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(body);
        }

        const r = await fetch(`api/habits.php?action=${action}`, options);
        let text = await r.text();
        const jsonStart = text.indexOf('{');
        if (jsonStart !== -1) text = text.substring(jsonStart);
        return JSON.parse(text);
    } catch (e) {
        console.error(`[HABITS API] Error for ${action}:`, e);
        return { success: false, data: [] };
    }
}

async function renderSpreadsheet(hResponse = null) {
    const container = document.getElementById('habits-spreadsheet');
    if (!container) return;

    if (!hResponse) hResponse = await fetchAPI('list');
    const cResponse = await fetchAPI('checkins');

    habitsCache = hResponse.data || [];
    checkinsCache = cResponse.data || [];

    const journeyStartStr = hResponse.journey_start || (habitsCache.length > 0 ? habitsCache[habitsCache.length - 1].created_at : new Date().toISOString());
    const journeyStart = new Date(journeyStartStr);
    journeyStart.setHours(0,0,0,0);

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    setupActionListeners(journeyStart, today);

    let html = `<table class="habit-table">
        <thead>
            <tr>
                <th class="sticky-col">Habit</th>`;
    
    for (let i = 1; i <= daysInMonth; i++) { 
        const cellDate = new Date(year, month, i);
        if (cellDate >= journeyStart) {
            const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isToday = checkDate === todayStr;
            html += `<th class="${isToday ? 'today-header' : ''}">${i}</th>`; 
        }
    }
    html += `</tr></thead><tbody>`;

    habitsCache.forEach(habit => {
        const hasDesc = habit.description && habit.description.trim() !== "";
        const descContent = hasDesc ? habit.description : "No description provided.";

        html += `<tr>
            <td class="sticky-col" style="border-left: 5px solid ${habit.color}">
                <div class="habit-info-wrapper">
                    <span class="habit-name-label">${habit.name}</span>
                    
                    <div class="habit-card-popover">
                        <div class="card-accent" style="background: ${habit.color}"></div>
                        <div class="card-content">
                            <span class="card-meta">${habit.category || 'General'}</span>
                            <h4 class="card-title">${habit.name}</h4>
                            <div class="card-body">
                                <label>Description</label>
                                <p class="${hasDesc ? '' : 'empty-state'}">${descContent}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </td>`;
        
        for (let d = 1; d <= daysInMonth; d++) {
            const cellDate = new Date(year, month, d);
            if (cellDate < journeyStart) continue;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const checkin = checkinsCache.find(c => String(c.habit_id) === String(habit.id) && c.date === dateStr);
            const isDone = checkin && (checkin.completed == 1 || checkin.completed == "1");
            const isToday = dateStr === todayStr;

            html += `<td class="${isToday ? 'today-highlight' : ''}">
                <div class="habit-checkbox ${isDone ? 'checked' : ''} ${!isToday ? 'locked-checkbox' : ''}" 
                     onclick="${isToday ? `openCheckinModal(${habit.id}, '${dateStr}')` : 'void(0)'}"
                     style="${!isToday ? 'cursor: default; opacity: 0.6;' : 'cursor: pointer;'}">
                     ${isDone ? '✓' : ''}
                </div>
            </td>`;
        }
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
    scrollToToday();
    renderChartSection();
}

function setupFormToggles() {
    const radios = document.querySelectorAll('input[name="frequency"]');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const cd = document.getElementById('custom-days');
            const pw = document.getElementById('per-week-input');
            if(cd) cd.style.display = (e.target.value === 'custom-days') ? 'flex' : 'none';
            if(pw) pw.style.display = (e.target.value === 'per-week') ? 'block' : 'none';
        });
    });

    const colorInput = document.getElementById('habit-color');
    const preview = document.getElementById('color-preview');
    if (colorInput && preview) {
        preview.style.background = colorInput.value;
        colorInput.oninput = (e) => preview.style.background = e.target.value;
    }

    const randBtn = document.getElementById('randomize-color');
    if (randBtn) {
        randBtn.onclick = () => {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            if(colorInput) colorInput.value = randomColor;
            if(preview) preview.style.background = randomColor;
        };
    }

    const startDateInput = document.getElementById('habit-start-date');
    if (startDateInput && !startDateInput.value) {
        startDateInput.value = new Date().toISOString().split('T')[0];
    }

    const saveBtn = document.getElementById('save-habit');
    if (saveBtn) {
        saveBtn.onclick = async (e) => {
            e.preventDefault();
            const selectedDays = [];
            document.querySelectorAll('#custom-days input:checked').forEach(cb => selectedDays.push(cb.value));

            try {
                const habitData = {
                    name: document.getElementById('habit-name')?.value || "",
                    description: document.getElementById('habit-description')?.value || "",
                    color: document.getElementById('habit-color')?.value || "#3498db",
                    category: document.getElementById('habit-category')?.value || "general",
                    frequency: document.querySelector('input[name="frequency"]:checked')?.value || "daily",
                    start_date: document.getElementById('habit-start-date')?.value || new Date().toISOString().split('T')[0],
                    end_date: document.getElementById('habit-end-date')?.value || null,
                    custom_days: selectedDays.join(','),
                    per_week: document.querySelector('#per-week-input input')?.value || 0,
                    duration: document.getElementById('habit-duration')?.value || 0,
                    duration_unit: document.getElementById('duration-unit')?.value || "minutes",
                    expected_time: document.getElementById('habit-time')?.value || null,
                    is_public: document.getElementById('habit-public')?.checked ? 1 : 0
                };

                if (!habitData.name) {
                    alert("Please enter a habit name.");
                    return;
                }

                const result = await fetchAPI('create', 'POST', habitData);
                if (result.success) {
                    document.getElementById('add-habit-modal').style.display = 'none';
                    document.getElementById('add-habit-form')?.reset();
                    await initHabitsView(); 
                } else {
                    alert("Error saving habit: " + (result.error || "Unknown error"));
                }
            } catch (err) {
                console.error("Submission Crash:", err);
            }
        };
    }
}

function setupActionListeners(journeyStart, today) {
    const prev = document.getElementById('prev-month');
    const next = document.getElementById('next-month');

    if (prev) {
        const isStartMonth = currentViewDate.getMonth() === journeyStart.getMonth() && 
                             currentViewDate.getFullYear() === journeyStart.getFullYear();
        prev.style.opacity = isStartMonth ? "0.2" : "1";
        prev.style.pointerEvents = isStartMonth ? "none" : "auto";
        prev.onclick = isStartMonth ? null : () => { 
            currentViewDate.setMonth(currentViewDate.getMonth() - 1); 
            initHabitsView(); 
        };
    }

    if (next) {
        const isCurrentMonth = currentViewDate.getMonth() === today.getMonth() && 
                             currentViewDate.getFullYear() === today.getFullYear();
        next.style.opacity = isCurrentMonth ? "0.2" : "1";
        next.style.pointerEvents = isCurrentMonth ? "none" : "auto";
        next.onclick = isCurrentMonth ? null : () => { 
            currentViewDate.setMonth(currentViewDate.getMonth() + 1); 
            initHabitsView(); 
        };
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.onchange = (e) => {
            const val = e.target.value;
            const rows = document.querySelectorAll('.habit-table tbody tr');
            rows.forEach(row => {
                const habitName = row.querySelector('.habit-name-label').innerText;
                const habit = habitsCache.find(h => h.name === habitName);
                row.style.display = (val === 'all' || habit?.category === val) ? '' : 'none';
            });
        };
    }

    const addBtn = document.getElementById('add-habit-btn');
    const firstHabitBtn = document.getElementById('create-first-habit');
    const addModal = document.getElementById('add-habit-modal');
    
    if (addBtn) addBtn.onclick = () => addModal.style.display = 'flex';
    if (firstHabitBtn) firstHabitBtn.onclick = () => addModal.style.display = 'flex';

    document.querySelectorAll('.modal-close, .btn-secondary, #cancel-add-habit, #cancel-checkin, #close-checkin').forEach(btn => {
        btn.onclick = () => {
            if(addModal) addModal.style.display = 'none';
            document.getElementById('checkin-modal').style.display = 'none';
        };
    });
}

function openCheckinModal(habitId, date) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (date !== todayStr) return;

    const habit = habitsCache.find(h => h.id == habitId);
    const checkin = checkinsCache.find(c => String(c.habit_id) === String(habitId) && c.date === date);

    document.getElementById('checkin-habit-name').innerText = `Log Today: ${habit.name}`;
    document.getElementById('checkin-notes').value = checkin?.notes || "";

    const timeField = document.getElementById('checkin-time-field');
    const timeInput = document.getElementById('checkin-time-input');
    if (habit.expected_time && habit.expected_time !== "00:00:00") {
        timeField.style.display = 'block';
        timeInput.value = checkin?.checkin_time || ""; 
    } else {
        timeField.style.display = 'none';
    }

    const durField = document.getElementById('checkin-duration-field');
    const durInput = document.getElementById('checkin-actual-duration');
    if (habit.duration && habit.duration > 0) {
        durField.style.display = 'block';
        document.getElementById('dur-unit-text').innerText = habit.duration_unit || 'mins';
        durInput.value = checkin?.actual_duration || ""; 
    } else {
        durField.style.display = 'none';
    }

    document.querySelectorAll('.difficulty-btn, .mood-btn').forEach(b => b.classList.remove('active'));

    if (checkin) {
        if (checkin.difficulty) document.querySelector(`.difficulty-btn[data-value="${checkin.difficulty}"]`)?.classList.add('active');
        if (checkin.mood) document.querySelector(`.mood-btn[data-mood="${checkin.mood}"]`)?.classList.add('active');
    }

    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });

    document.getElementById('checkin-modal').style.display = 'flex';

    const saveBtn = document.getElementById('save-checkin');
    saveBtn.onclick = async () => {
        const payload = {
            habit_id: habitId,
            date: date,
            completed: 1, 
            difficulty: document.querySelector('.difficulty-btn.active')?.dataset.value || 1,
            mood: document.querySelector('.mood-btn.active')?.dataset.mood || 'okay',
            notes: document.getElementById('checkin-notes').value,
            checkin_time: (timeField.style.display !== 'none') ? timeInput.value : null,
            actual_duration: (durField.style.display !== 'none') ? durInput.value : null
        };

        const result = await fetchAPI('checkin', 'POST', payload);
        if (result.success) {
            document.getElementById('checkin-modal').style.display = 'none';
            await renderSpreadsheet(); 
        }
    };
}

function updateMonthLabel() {
    const el = document.getElementById('current-month');
    if (el) el.textContent = currentViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function scrollToToday() {
    const todayCell = document.querySelector('.today-highlight');
    const container = document.querySelector('.habits-spreadsheet-container');
    if (todayCell && container && window.innerWidth < 768) {
        const offset = todayCell.offsetLeft - (container.offsetWidth / 2);
        container.scrollTo({ left: offset, behavior: 'smooth' });
    }
}

/**
 * PERFORMANCE CHART ADD-ON - ALIGNED VERSION
 * Add this code to the END of your existing habits.js file
 * 
 * FEATURES:
 * - Left stats panel (matches habit names column width)
 * - Chart aligns perfectly with spreadsheet day columns
 * - Hover tooltip shows day stats
 * - Green by default, RED only on dips
 */

/**
 * Add chart styles to existing styles
 */
function addChartStyles() {
    const existingStyle = document.getElementById('axiom-card-styles');
    if (!existingStyle) return;
    
    const chartCSS = `
        /* Performance Chart Container */
        .performance-chart-wrapper {
            background: var(--bg-primary);
            border: var(--border-1) solid var(--border-base);
            border-radius: var(--radius-2xl);
            padding: var(--space-4);
            margin-bottom: var(--space-4);
            display: flex;
            gap: 0;
        }
        
        /* Left Stats Panel - matches habit column width */
        .chart-stats-panel {
            width: 210px;
            padding: var(--space-3);
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: var(--space-3);
            border-right: var(--border-1) solid var(--border-base);
        }
        
        .stat-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        
        .stat-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-tertiary);
            font-weight: 600;
        }
        
        .stat-value {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1.2;
        }
        
        .stat-subtext {
            font-size: 11px;
            color: var(--text-secondary);
            margin-top: 2px;
        }
        
        /* Chart Canvas Container */
        .chart-canvas-container {
            flex: 1;
            position: relative;
        }
        
        #performance-canvas {
            width: 100%;
            height: 180px;
            display: block;
            cursor: crosshair;
        }
        
        /* Tooltip */
        .chart-tooltip {
            position: fixed;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 12px;
            color: var(--card-text);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            white-space: nowrap;
        }
        
        .chart-tooltip.visible {
            opacity: 1;
        }
        
        .tooltip-day {
            font-weight: bold;
            margin-bottom: 4px;
            color: var(--text-primary);
        }
        
        .tooltip-stats {
            color: var(--text-secondary);
            font-size: 11px;
        }
        
        .tooltip-percentage {
            font-weight: bold;
            color: var(--accent-success);
        }
        
        @media (max-width: 768px) {
            .performance-chart-wrapper {
                flex-direction: column;
            }
            
            .chart-stats-panel {
                width: 100%;
                border-right: none;
                border-bottom: var(--border-1) solid var(--border-base);
                flex-direction: row;
                justify-content: space-around;
            }
            
            #performance-canvas {
                height: 140px;
            }
        }
    `;
    
    existingStyle.innerHTML += chartCSS;
}

/**
 * Calculate daily performance data
 */
function calculateDailyPerformance() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const today = new Date();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get journey start to align with spreadsheet
    const hResponse = { data: habitsCache };
    const journeyStartStr = hResponse.journey_start || (habitsCache.length > 0 ? habitsCache[habitsCache.length - 1].created_at : new Date().toISOString());
    const journeyStart = new Date(journeyStartStr);
    journeyStart.setHours(0,0,0,0);
    
    const dailyData = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        
        // Skip if before journey start (to align with spreadsheet)
        if (currentDate < journeyStart) {
            dailyData.push({
                day,
                percentage: null,
                completed: 0,
                total: 0,
                isEmpty: true
            });
            continue;
        }
        
        // Skip if future date
        if (currentDate > today) {
            dailyData.push({
                day,
                percentage: null,
                completed: 0,
                total: 0,
                isEmpty: true
            });
            continue;
        }
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        let dayTotal = 0;
        let dayCompleted = 0;
        
        habitsCache.forEach(habit => {
            const habitStart = new Date(habit.created_at);
            habitStart.setHours(0, 0, 0, 0);
            
            if (currentDate >= habitStart) {
                dayTotal++;
                const checkin = checkinsCache.find(c => 
                    String(c.habit_id) === String(habit.id) && c.date === dateStr
                );
                if (checkin) dayCompleted++;
            }
        });
        
        const percentage = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;
        
        dailyData.push({
            day,
            percentage,
            completed: dayCompleted,
            total: dayTotal,
            isEmpty: false
        });
    }
    
    return dailyData;
}

/**
 * Calculate chart statistics for left panel
 */
function calculateChartStats() {
    const dailyData = calculateDailyPerformance();
    const validData = dailyData.filter(d => !d.isEmpty);
    
    if (validData.length === 0) {
        return {
            avgCompletion: 0,
            bestDay: '-',
            bestDayPercent: 0,
            totalCompleted: 0,
            totalPossible: 0
        };
    }
    
    // Calculate average completion
    const totalPercentage = validData.reduce((sum, d) => sum + d.percentage, 0);
    const avgCompletion = Math.round(totalPercentage / validData.length);
    
    // Find best day(s)
    const maxPercentage = Math.max(...validData.map(d => d.percentage));
    const bestDays = validData.filter(d => d.percentage === maxPercentage);
    
    let bestDay = '';
    if (bestDays.length === 1) {
        bestDay = `Day ${bestDays[0].day}`;
    } else if (bestDays.length === validData.length) {
        bestDay = 'All Days';
    } else if (bestDays.length <= 3) {
        bestDay = bestDays.map(d => d.day).join(', ');
    } else {
        bestDay = `${bestDays.length} days`;
    }
    
    // Total completed vs possible
    const totalCompleted = validData.reduce((sum, d) => sum + d.completed, 0);
    const totalPossible = validData.reduce((sum, d) => sum + d.total, 0);
    
    return {
        avgCompletion,
        bestDay,
        bestDayPercent: maxPercentage,
        totalCompleted,
        totalPossible
    };
}

/**
 * Render performance chart with hover tooltips
 */
function renderPerformanceChart() {
    const canvas = document.getElementById('performance-canvas');
    if (!canvas) return;
    
    const dailyData = calculateDailyPerformance();
    if (dailyData.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 15, right: 15, bottom: 15, left: 15 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Colors
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const greenColor = '#10b981'; // Green for default/improvements
    const redColor = '#ef4444';   // Red for declines only
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Filter out empty days and calculate points
    const validData = dailyData.filter(d => !d.isEmpty);
    if (validData.length === 0) return;
    
    // Calculate x-position for each day to align with spreadsheet columns
    const points = dailyData.map((data, index) => {
        if (data.isEmpty) {
            return {
                x: padding.left + (chartWidth / (dailyData.length - 1)) * index,
                y: null,
                data: data
            };
        }
        return {
            x: padding.left + (chartWidth / (dailyData.length - 1)) * index,
            y: padding.top + chartHeight - (chartHeight * data.percentage / 100),
            data: data
        };
    });
    
    // Filter valid points for drawing
    const validPoints = points.filter(p => p.y !== null);
    
    // Draw gradient fill
    if (validPoints.length > 0) {
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(validPoints[0].x, padding.top + chartHeight);
        validPoints.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.lineTo(validPoints[validPoints.length - 1].x, padding.top + chartHeight);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw line segments
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let i = 1; i < validPoints.length; i++) {
        const prev = validPoints[i - 1];
        const curr = validPoints[i];
        
        // Determine color: RED only if current is LOWER than previous (dip)
        const isDip = curr.data.percentage < prev.data.percentage;
        ctx.strokeStyle = isDip ? redColor : greenColor;
        
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
    }
    
    // Draw points
    validPoints.forEach((point, index) => {
        // Determine if next segment is a dip
        let pointColor = greenColor;
        if (index < validPoints.length - 1) {
            const nextPoint = validPoints[index + 1];
            const isDip = nextPoint.data.percentage < point.data.percentage;
            pointColor = isDip ? redColor : greenColor;
        }
        
        // Point
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = pointColor;
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    // Store points for hover detection
    canvas._chartPoints = points;
}

/**
 * Add chart to page with stats panel and tooltip
 */
function renderChartSection() {
    const spreadsheetContainer = document.getElementById('habits-spreadsheet');
    if (!spreadsheetContainer) return;
    
    // Check if chart already exists
    let chartWrapper = document.getElementById('performance-chart-wrapper');
    
    if (!chartWrapper) {
        // Calculate stats
        const stats = calculateChartStats();
        
        // Create chart wrapper
        chartWrapper = document.createElement('div');
        chartWrapper.id = 'performance-chart-wrapper';
        chartWrapper.className = 'performance-chart-wrapper';
        chartWrapper.innerHTML = `
            <div class="chart-stats-panel">
                <div class="stat-item">
                    <div class="stat-label">Avg Rate</div>
                    <div class="stat-value">${stats.avgCompletion}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Best Day</div>
                    <div class="stat-value">${stats.bestDay}</div>
                    <div class="stat-subtext">${stats.bestDayPercent}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total</div>
                    <div class="stat-value">${stats.totalCompleted}/${stats.totalPossible}</div>
                    <div class="stat-subtext">completed</div>
                </div>
            </div>
            <div class="chart-canvas-container">
                <canvas id="performance-canvas"></canvas>
                <div class="chart-tooltip" id="chart-tooltip">
                    <div class="tooltip-day"></div>
                    <div class="tooltip-stats"></div>
                </div>
            </div>
        `;
        
        // Insert BEFORE spreadsheet table
        spreadsheetContainer.parentNode.insertBefore(chartWrapper, spreadsheetContainer);
        
        // Setup hover interactions
        setupChartHover();
    } else {
        // Update stats if chart exists
        const stats = calculateChartStats();
        const statsPanel = chartWrapper.querySelector('.chart-stats-panel');
        if (statsPanel) {
            statsPanel.innerHTML = `
                <div class="stat-item">
                    <div class="stat-label">Avg Rate</div>
                    <div class="stat-value">${stats.avgCompletion}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Best Day</div>
                    <div class="stat-value">${stats.bestDay}</div>
                    <div class="stat-subtext">${stats.bestDayPercent}%</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total</div>
                    <div class="stat-value">${stats.totalCompleted}/${stats.totalPossible}</div>
                    <div class="stat-subtext">completed</div>
                </div>
            `;
        }
    }
    
    // Render the chart
    setTimeout(() => renderPerformanceChart(), 100);
}

/**
 * Setup hover interactions for tooltip
 */
function setupChartHover() {
    const canvas = document.getElementById('performance-canvas');
    const tooltip = document.getElementById('chart-tooltip');
    if (!canvas || !tooltip) return;
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const points = canvas._chartPoints;
        if (!points) return;
        
        // Find closest point
        let closestPoint = null;
        let minDistance = 25; // Hover threshold
        
        points.forEach(point => {
            if (point.y === null) return; // Skip empty days
            
            const distance = Math.sqrt(
                Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestPoint = point;
            }
        });
        
        if (closestPoint) {
            const data = closestPoint.data;
            
            // Update tooltip content
            tooltip.querySelector('.tooltip-day').textContent = `Day ${data.day}`;
            tooltip.querySelector('.tooltip-stats').innerHTML = `
                <span class="tooltip-percentage">${data.percentage}%</span> 
                (${data.completed}/${data.total} habits completed)
            `;
            
            // Position tooltip
            const tooltipWidth = 180; // Approximate
            let tooltipX = e.clientX + 10;
            let tooltipY = e.clientY - 50;
            
            // Keep tooltip in bounds
            if (tooltipX + tooltipWidth > window.innerWidth - 20) {
                tooltipX = e.clientX - tooltipWidth - 10;
            }
            
            tooltip.style.left = tooltipX + 'px';
            tooltip.style.top = tooltipY + 'px';
            tooltip.classList.add('visible');
        } else {
            tooltip.classList.remove('visible');
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('performance-canvas');
    if (canvas) {
        renderPerformanceChart();
    }
});

/**
 * AXIOM SLEEP TRACKER MODULE
 * Add this to the END of your habits.js file
 * 
 * FEATURES:
 * - Sleep cycle wave graph (Awake/Sleep/Deep phases)
 * - Sleep quality bar chart (daily percentages)
 * - Stats cards (bedtime, wake time, duration, quality, mood)
 * - Time period filters (Days/Weeks/Months)
 * - Log sleep modal
 */

let sleepDataCache = [];

/**
 * Add sleep tracker styles
 */
function addSleepTrackerStyles() {
    const existingStyle = document.getElementById('axiom-card-styles');
    if (!existingStyle) return;
    
    const sleepCSS = `
        /* Sleep Tracker Section */
        .sleep-tracker-section {
            margin-top: var(--space-8);
            background: var(--bg-primary);
            border: var(--border-1) solid var(--border-base);
            border-radius: var(--radius-2xl);
            padding: var(--space-6);
        }
        
        .sleep-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-6);
        }
        
        .sleep-title {
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-primary);
        }
        
        .btn-log-sleep {
            padding: var(--space-3) var(--space-5);
            background: var(--accent-primary);
            color: white;
            border: none;
            border-radius: var(--radius-lg);
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .btn-log-sleep:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        /* Sleep Cycle Graph */
        .sleep-cycle-card {
            background: var(--bg-secondary);
            border: var(--border-1) solid var(--border-base);
            border-radius: var(--radius-xl);
            padding: var(--space-5);
            margin-bottom: var(--space-5);
        }
        
        .cycle-graph-title {
            font-size: var(--text-sm);
            font-weight: var(--weight-semibold);
            color: var(--text-secondary);
            margin-bottom: var(--space-4);
        }
        
        #sleep-cycle-canvas {
            width: 100%;
            height: 200px;
            display: block;
        }
        
        /* Quality Chart */
        .quality-chart-card {
            background: var(--bg-secondary);
            border: var(--border-1) solid var(--border-base);
            border-radius: var(--radius-xl);
            padding: var(--space-5);
            margin-bottom: var(--space-5);
        }
        
        .quality-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-4);
        }
        
        .quality-title {
            font-size: var(--text-base);
            font-weight: var(--weight-semibold);
            color: var(--text-primary);
        }
        
        .period-filters {
            display: flex;
            gap: var(--space-2);
        }
        
        .period-btn {
            padding: var(--space-2) var(--space-4);
            background: transparent;
            border: var(--border-1) solid var(--border-base);
            border-radius: var(--radius-md);
            font-size: var(--text-xs);
            color: var(--text-secondary);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .period-btn.active {
            background: var(--accent-primary);
            border-color: var(--accent-primary);
            color: white;
        }
        
        .period-btn:hover:not(.active) {
            border-color: var(--border-strong);
        }
        
        #quality-chart-canvas {
            width: 100%;
            height: 180px;
            display: block;
        }
        
        /* Sleep Stats Grid */
        .sleep-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-4);
        }
        
        .sleep-stat-card {
            background: var(--bg-secondary);
            border: var(--border-1) solid var(--border-base);
            border-radius: var(--radius-xl);
            padding: var(--space-4);
            display: flex;
            align-items: center;
            gap: var(--space-3);
        }
        
        .stat-icon {
            font-size: 24px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
            border-radius: var(--radius-lg);
        }
        
        .stat-content {
            flex: 1;
        }
        
        .stat-label-small {
            font-size: var(--text-xs);
            color: var(--text-tertiary);
            margin-bottom: 2px;
        }
        
        .stat-value-large {
            font-size: var(--text-xl);
            font-weight: var(--weight-bold);
            color: var(--text-primary);
        }
        
        .stat-subtitle {
            font-size: var(--text-xs);
            color: var(--text-secondary);
            margin-top: 2px;
        }
        
        /* Sleep Log Modal */
        #sleep-log-modal .modal-card {
            max-width: 500px;
        }
        
        .time-input-group {
            display: flex;
            gap: var(--space-3);
        }
        
        .time-input-group .form-field {
            flex: 1;
        }
        
        .quality-slider {
            width: 100%;
            height: 8px;
            border-radius: var(--radius-full);
            background: var(--bg-secondary);
            outline: none;
            -webkit-appearance: none;
        }
        
        .quality-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--accent-primary);
            cursor: pointer;
        }
        
        .quality-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--accent-primary);
            cursor: pointer;
            border: none;
        }
        
        .quality-value {
            text-align: center;
            font-size: var(--text-2xl);
            font-weight: var(--weight-bold);
            color: var(--accent-primary);
            margin-top: var(--space-2);
        }
        
        @media (max-width: 768px) {
            .sleep-stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            #sleep-cycle-canvas {
                height: 150px;
            }
            
            #quality-chart-canvas {
                height: 140px;
            }
        }
    `;
    
    existingStyle.innerHTML += sleepCSS;
}

/**
 * Render sleep tracker section
 */
function renderSleepTracker() {
    const container = document.querySelector('.habits-spreadsheet-container');
    if (!container) return;
    
    // Check if sleep tracker already exists
    let sleepSection = document.getElementById('sleep-tracker-section');
    
    if (!sleepSection) {
        sleepSection = document.createElement('div');
        sleepSection.id = 'sleep-tracker-section';
        sleepSection.className = 'sleep-tracker-section';
        sleepSection.innerHTML = `
            <div class="sleep-header">
                <h2 class="sleep-title">Sleep Tracker</h2>
                <button class="btn-log-sleep" id="log-sleep-btn">
                    🌙 Log Sleep
                </button>
            </div>
            
            <!-- Sleep Cycle Graph -->
            <div class="sleep-cycle-card">
                <div class="cycle-graph-title">Sleep Cycle - Last Night</div>
                <canvas id="sleep-cycle-canvas"></canvas>
            </div>
            
            <!-- Quality Bar Chart -->
            <div class="quality-chart-card">
                <div class="quality-header">
                    <div class="quality-title">Sleep Quality</div>
                    <div class="period-filters">
                        <button class="period-btn active" data-period="days">Days</button>
                        <button class="period-btn" data-period="weeks">Weeks</button>
                        <button class="period-btn" data-period="months">Months</button>
                    </div>
                </div>
                <canvas id="quality-chart-canvas"></canvas>
            </div>
            
            <!-- Sleep Stats -->
            <div class="sleep-stats-grid">
                <div class="sleep-stat-card">
                    <div class="stat-icon">🌙</div>
                    <div class="stat-content">
                        <div class="stat-label-small">Bedtime</div>
                        <div class="stat-value-large" id="avg-bedtime">--:--</div>
                        <div class="stat-subtitle">Average</div>
                    </div>
                </div>
                
                <div class="sleep-stat-card">
                    <div class="stat-icon">☀️</div>
                    <div class="stat-content">
                        <div class="stat-label-small">Wake Up</div>
                        <div class="stat-value-large" id="avg-wakeup">--:--</div>
                        <div class="stat-subtitle">Average</div>
                    </div>
                </div>
                
                <div class="sleep-stat-card">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-content">
                        <div class="stat-label-small">Duration</div>
                        <div class="stat-value-large" id="avg-duration">0h</div>
                        <div class="stat-subtitle">Average</div>
                    </div>
                </div>
                
                <div class="sleep-stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-content">
                        <div class="stat-label-small">Quality</div>
                        <div class="stat-value-large" id="avg-quality">0%</div>
                        <div class="stat-subtitle">Average</div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after spreadsheet container
        container.parentNode.insertBefore(sleepSection, container.nextSibling);
        
        // Setup event listeners
        setupSleepTrackerEvents();
    }
    
    // Load sleep data and render charts
    loadSleepData();
}

/**
 * Setup event listeners
 */
function setupSleepTrackerEvents() {
    // Log sleep button
    const logBtn = document.getElementById('log-sleep-btn');
    if (logBtn) {
        logBtn.onclick = () => openSleepLogModal();
    }
    
    // Period filter buttons
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.onclick = () => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderQualityChart(btn.dataset.period);
        };
    });
}

/**
 * Load sleep data from API
 */
async function loadSleepData() {
    try {
        const response = await fetch('api/sleep.php?action=list');
        const data = await response.json();
        
        if (data.success) {
            sleepDataCache = data.data || [];
            renderSleepCycleGraph();
            renderQualityChart('days');
            updateSleepStats();
        }
    } catch (error) {
        console.error('Error loading sleep data:', error);
        // Show empty state
        sleepDataCache = [];
    }
}

/**
 * Render sleep cycle wave graph
 */
function renderSleepCycleGraph() {
    const canvas = document.getElementById('sleep-cycle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 30, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Colors
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const lineColor = '#22d3ee';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
    
    ctx.clearRect(0, 0, width, height);
    
    // Get last sleep entry
    const lastSleep = sleepDataCache.length > 0 ? sleepDataCache[0] : null;
    
    if (!lastSleep || !lastSleep.cycle_data) {
        // Show placeholder
        ctx.fillStyle = textColor;
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No sleep data yet', width / 2, height / 2);
        return;
    }
    
    // Parse cycle data (assume format: "awake,sleep,deep,sleep,awake,...")
    const cyclePhases = lastSleep.cycle_data.split(',');
    const phaseValues = cyclePhases.map(phase => {
        if (phase === 'awake') return 1;
        if (phase === 'sleep') return 0.5;
        if (phase === 'deep') return 0;
        return 0.5;
    });
    
    // Draw Y-axis labels
    const labels = ['Awake', 'Sleep', 'Deep sleep'];
    const labelY = [padding.top, padding.top + chartHeight / 2, padding.top + chartHeight];
    
    ctx.fillStyle = textColor;
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    
    labels.forEach((label, i) => {
        ctx.fillText(label, padding.left - 10, labelY[i] + 4);
    });
    
    // Draw grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 2; i++) {
        const y = padding.top + (chartHeight / 2) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
    }
    
    // Calculate points
    const points = phaseValues.map((value, index) => ({
        x: padding.left + (chartWidth / (phaseValues.length - 1)) * index,
        y: padding.top + chartHeight - (chartHeight * value)
    }));
    
    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.2)');
    gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartHeight);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.stroke();
    
    // Draw time labels (X-axis)
    const timeLabels = ['11', '12', '1', '2', '3', '4', '5', '6', '7', '8'];
    const labelInterval = Math.ceil(timeLabels.length / 8);
    
    ctx.fillStyle = textColor;
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    
    timeLabels.forEach((label, i) => {
        if (i % labelInterval === 0) {
            const x = padding.left + (chartWidth / (timeLabels.length - 1)) * i;
            ctx.fillText(label, x, height - 10);
        }
    });
}

/**
 * Render quality bar chart
 */
function renderQualityChart(period = 'days') {
    const canvas = document.getElementById('quality-chart-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const barColor = '#fbbf24';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const textColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
    
    ctx.clearRect(0, 0, width, height);
    
    // Get data based on period
    const data = getSleepQualityData(period);
    
    if (data.length === 0) {
        ctx.fillStyle = textColor;
        ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No sleep data yet', width / 2, height / 2);
        return;
    }
    
    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
        
        // Y-axis labels
        const value = 100 - (i * 25);
        ctx.fillStyle = textColor;
        ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(value + '%', padding.left - 8, y + 4);
    }
    
    // Draw bars
    const barWidth = (chartWidth / data.length) * 0.7;
    const barSpacing = (chartWidth / data.length) * 0.3;
    
    data.forEach((item, index) => {
        const barHeight = (chartHeight * item.quality) / 100;
        const x = padding.left + (index * (barWidth + barSpacing)) + barSpacing / 2;
        const y = padding.top + chartHeight - barHeight;
        
        // Bar
        ctx.fillStyle = barColor;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Label
        ctx.fillStyle = textColor;
        ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x + barWidth / 2, height - 10);
    });
}

/**
 * Get sleep quality data for period
 */
function getSleepQualityData(period) {
    if (sleepDataCache.length === 0) return [];
    
    // For demo, generate last 7 days
    const data = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        
        // Find sleep data for this date
        const dateStr = date.toISOString().split('T')[0];
        const sleepEntry = sleepDataCache.find(s => s.date === dateStr);
        
        data.push({
            label: dayName,
            quality: sleepEntry ? sleepEntry.quality : 0
        });
    }
    
    return data;
}

/**
 * Update sleep stats cards
 */
function updateSleepStats() {
    if (sleepDataCache.length === 0) return;
    
    // Calculate averages from last 7 days
    const recentData = sleepDataCache.slice(0, 7);
    
    // Average bedtime
    const avgBedtimeMinutes = recentData.reduce((sum, s) => {
        const [hours, minutes] = s.bedtime.split(':');
        return sum + (parseInt(hours) * 60 + parseInt(minutes));
    }, 0) / recentData.length;
    
    const bedtimeHours = Math.floor(avgBedtimeMinutes / 60);
    const bedtimeMinutes = Math.round(avgBedtimeMinutes % 60);
    document.getElementById('avg-bedtime').textContent = 
        `${bedtimeHours}:${String(bedtimeMinutes).padStart(2, '0')}`;
    
    // Average wake up
    const avgWakeupMinutes = recentData.reduce((sum, s) => {
        const [hours, minutes] = s.wakeup_time.split(':');
        return sum + (parseInt(hours) * 60 + parseInt(minutes));
    }, 0) / recentData.length;
    
    const wakeupHours = Math.floor(avgWakeupMinutes / 60);
    const wakeupMinutes = Math.round(avgWakeupMinutes % 60);
    document.getElementById('avg-wakeup').textContent = 
        `${wakeupHours}:${String(wakeupMinutes).padStart(2, '0')}`;
    
    // Average duration
    const avgDuration = recentData.reduce((sum, s) => sum + s.duration, 0) / recentData.length;
    const durationHours = Math.floor(avgDuration);
    const durationMinutes = Math.round((avgDuration % 1) * 60);
    document.getElementById('avg-duration').textContent = 
        `${durationHours}h ${durationMinutes}m`;
    
    // Average quality
    const avgQuality = Math.round(
        recentData.reduce((sum, s) => sum + s.quality, 0) / recentData.length
    );
    document.getElementById('avg-quality').textContent = `${avgQuality}%`;
}

/**
 * Open sleep log modal
 */
function openSleepLogModal() {
    // Create modal if doesn't exist
    let modal = document.getElementById('sleep-log-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'sleep-log-modal';
        modal.className = 'modal-overlay';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-header">
                    <h2>Log Sleep</h2>
                    <button class="modal-close" id="close-sleep-log">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <form class="modal-body" id="sleep-log-form">
                    <div class="form-field">
                        <label for="sleep-date">Date</label>
                        <input type="date" id="sleep-date" required>
                    </div>
                    
                    <div class="time-input-group">
                        <div class="form-field">
                            <label for="sleep-bedtime">Bedtime</label>
                            <input type="time" id="sleep-bedtime" required>
                        </div>
                        
                        <div class="form-field">
                            <label for="sleep-wakeup">Wake Up</label>
                            <input type="time" id="sleep-wakeup" required>
                        </div>
                    </div>
                    
                    <div class="form-field">
                        <label for="sleep-quality">Sleep Quality</label>
                        <input type="range" id="sleep-quality" class="quality-slider" min="0" max="100" value="70">
                        <div class="quality-value" id="quality-display">70%</div>
                    </div>
                    
                    <div class="form-field">
                        <label>How do you feel?</label>
                        <div class="mood-picker">
                            <button type="button" class="mood-btn" data-mood="terrible">😢</button>
                            <button type="button" class="mood-btn" data-mood="bad">😞</button>
                            <button type="button" class="mood-btn" data-mood="okay">😐</button>
                            <button type="button" class="mood-btn" data-mood="good">🙂</button>
                            <button type="button" class="mood-btn" data-mood="great">😊</button>
                        </div>
                    </div>
                    
                    <div class="form-field">
                        <label for="sleep-notes">Notes / Dreams</label>
                        <textarea id="sleep-notes" rows="3" placeholder="Any notes about your sleep..."></textarea>
                    </div>
                </form>
                
                <div class="modal-footer">
                    <button type="button" class="btn-secondary" id="cancel-sleep-log">Cancel</button>
                    <button type="submit" class="btn-primary" id="save-sleep-log">Save Sleep Log</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup modal events
        setupSleepModalEvents();
    }
    
    // Set today's date
    document.getElementById('sleep-date').value = new Date().toISOString().split('T')[0];
    
    modal.style.display = 'flex';
}

/**
 * Setup sleep modal events
 */
function setupSleepModalEvents() {
    // Close button
    document.getElementById('close-sleep-log').onclick = () => {
        document.getElementById('sleep-log-modal').style.display = 'none';
    };
    
    document.getElementById('cancel-sleep-log').onclick = () => {
        document.getElementById('sleep-log-modal').style.display = 'none';
    };
    
    // Quality slider
    const qualitySlider = document.getElementById('sleep-quality');
    const qualityDisplay = document.getElementById('quality-display');
    
    qualitySlider.oninput = (e) => {
        qualityDisplay.textContent = e.target.value + '%';
    };
    
    // Mood buttons
    document.querySelectorAll('#sleep-log-modal .mood-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('#sleep-log-modal .mood-btn').forEach(b => 
                b.classList.remove('selected')
            );
            btn.classList.add('selected');
        };
    });
    
    // Save button
    document.getElementById('save-sleep-log').onclick = async (e) => {
        e.preventDefault();
        await saveSleepLog();
    };
}

/**
 * Save sleep log to API
 */
async function saveSleepLog() {
    const date = document.getElementById('sleep-date').value;
    const bedtime = document.getElementById('sleep-bedtime').value;
    const wakeup = document.getElementById('sleep-wakeup').value;
    const quality = document.getElementById('sleep-quality').value;
    const mood = document.querySelector('#sleep-log-modal .mood-btn.selected')?.dataset.mood || 'okay';
    const notes = document.getElementById('sleep-notes').value;
    
    if (!date || !bedtime || !wakeup) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Calculate duration
    const bedDateTime = new Date(`${date} ${bedtime}`);
    const wakeDateTime = new Date(`${date} ${wakeup}`);
    if (wakeDateTime < bedDateTime) {
        wakeDateTime.setDate(wakeDateTime.getDate() + 1);
    }
    const duration = (wakeDateTime - bedDateTime) / (1000 * 60 * 60); // hours
    
    const sleepData = {
        date,
        bedtime,
        wakeup_time: wakeup,
        duration: duration.toFixed(2),
        quality: parseInt(quality),
        mood,
        notes,
        cycle_data: generateDummyCycleData() // For demo
    };
    
    try {
        const response = await fetch('api/sleep.php?action=log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sleepData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('sleep-log-modal').style.display = 'none';
            document.getElementById('sleep-log-form').reset();
            loadSleepData(); // Reload data
        } else {
            alert('Error saving sleep log: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error saving sleep log:', error);
        alert('Error saving sleep log');
    }
}

/**
 * Generate dummy cycle data for demo
 */
function generateDummyCycleData() {
    const phases = ['awake', 'sleep', 'deep', 'sleep'];
    const cycleData = [];
    
    for (let i = 0; i < 30; i++) {
        cycleData.push(phases[Math.floor(Math.random() * phases.length)]);
    }
    
    return cycleData.join(',');
}

// Handle window resize
window.addEventListener('resize', () => {
    if (document.getElementById('sleep-cycle-canvas')) {
        renderSleepCycleGraph();
        renderQualityChart(document.querySelector('.period-btn.active')?.dataset.period || 'days');
    }
});

/**
 * INTEGRATION INSTRUCTIONS:
 * 
 * 1. Add styles - In your injectThemeAwareStyles() function:
 *    addSleepTrackerStyles();
 * 
 * 2. Render tracker - In your initHabitsView() function, after renderSpreadsheet():
 *    renderSleepTracker();
 * 
 * 3. Create API endpoint - Create api/sleep.php with actions: 'list' and 'log'
 *    Database table: sleep_logs (id, user_id, date, bedtime, wakeup_time, duration, quality, mood, notes, cycle_data)
 */