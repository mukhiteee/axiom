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