// Get elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const dateDisplay = document.getElementById('dateDisplay');

// Date display
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    dateDisplay.textContent = today;
}

const openAppBtn = document.getElementById('openAppBtn');
const openGoogleBtn = document.getElementById('openGoogleBtn');
const openDuckBtn = document.getElementById('openDuckBtn');

function openAppInNewTab() {
    window.open(window.location.href, '_blank');
}

function searchDailyCompanionOnGoogle() {
    window.open('https://www.google.com/search?q=Daily+Companion', '_blank');
}

function searchDailyCompanionOnDuckDuckGo() {
    window.open('https://duckduckgo.com/?q=Daily+Companion', '_blank');
}

openAppBtn.addEventListener('click', openAppInNewTab);
openGoogleBtn.addEventListener('click', searchDailyCompanionOnGoogle);
openDuckBtn.addEventListener('click', searchDailyCompanionOnDuckDuckGo);

const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const habitInput = document.getElementById('habitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');
const weeklySummary = document.getElementById('weeklySummary');

const goalInput = document.getElementById('goalInput');
const addGoalBtn = document.getElementById('addGoalBtn');
const goalList = document.getElementById('goalList');

const pomodoroTimerEl = document.getElementById('pomodoroTimer');
const startPomodoroBtn = document.getElementById('startPomodoroBtn');
const pausePomodoroBtn = document.getElementById('pausePomodoroBtn');
const resetPomodoroBtn = document.getElementById('resetPomodoroBtn');
const workMinutes = document.getElementById('workMinutes');
const breakMinutes = document.getElementById('breakMinutes');

const moodButtons = document.querySelectorAll('.mood-btn');
const moodResult = document.getElementById('moodResult');
const gratitudeInput = document.getElementById('gratitudeInput');
const saveGratitudeBtn = document.getElementById('saveGratitudeBtn');
const dailyQuote = document.getElementById('dailyQuote');
const breathingBtn = document.getElementById('breathingBtn');
const breathingTip = document.getElementById('breathingTip');

const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFileInput = document.getElementById('importFileInput');
const taskSearch = document.getElementById('taskSearch');
const journalSearch = document.getElementById('journalSearch');
const journalSearchResults = document.getElementById('journalSearchResults');
const smartTaskBtn = document.getElementById('smartTaskBtn');
const smartTaskResult = document.getElementById('smartTaskResult');

function setTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('dailyCompanionTheme', theme);
    toggleThemeBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('dailyCompanionTheme') || 'light';
    setTheme(savedTheme);
}

toggleThemeBtn.addEventListener('click', () => {
    const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
});

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// ===== TASKS =====
const taskInput = document.getElementById('taskInput');
const taskRecurring = document.getElementById('taskRecurring');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskProgress = document.getElementById('taskProgress');
const progressFill = document.getElementById('progressFill');

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        tasks.push({
            text: item.querySelector('.task-text').textContent,
            completed: item.querySelector('.task-checkbox').checked,
            recurring: !!item.querySelector('.status-badge')
        });
    });
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
    tasks.forEach(task => {
        addTaskToList(task.text, task.completed, task.recurring);
    });
    updateTaskProgress();
}

function addTaskToList(text, completed = false, recurring = false) {
    if (!text || !text.trim()) return false;
    
    const li = document.createElement('li');
    li.className = 'task-item' + (completed ? ' completed' : '');
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
        <span class="task-text">${text}</span>
        ${recurring ? '<span class="status-badge">Recurring</span>' : ''}
        <button class="btn btn-danger">Delete</button>
    `;
    
    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed');
        saveTasks();
        updateTaskProgress();
    });
    
    const deleteBtn = li.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
        updateTaskProgress();
    });
    
    taskList.appendChild(li);
    return true;
}

function updateTaskProgress() {
    const tasks = document.querySelectorAll('.task-item');
    const completed = document.querySelectorAll('.task-item.completed');
    const progress = tasks.length === 0 ? 0 : Math.round((completed.length / tasks.length) * 100);
    taskProgress.textContent = progress + '%';
    progressFill.style.width = progress + '%';
}

addTaskBtn.addEventListener('click', () => {
    const recurring = taskRecurring.checked;
    if (!addTaskToList(taskInput.value, false, recurring)) return;
    logActivity(`Task added: ${taskInput.value}${recurring ? ' (Recurring)' : ''}`);
    taskInput.value = '';
    taskRecurring.checked = false;
    saveTasks();
    updateTaskProgress();
    checkAchievements();
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

taskSearch.addEventListener('input', () => {
    const filter = taskSearch.value.toLowerCase();
    document.querySelectorAll('.task-item').forEach(item => {
        const text = item.querySelector('.task-text').textContent.toLowerCase();
        item.style.display = text.includes(filter) ? 'flex' : 'none';
    });
});

function filterJournalHistory(query) {
    const results = [];
    const prefix = 'journal_';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
            const entry = localStorage.getItem(key);
            if (entry && entry.toLowerCase().includes(query.toLowerCase())) {
                results.push({ date: key.replace(prefix, ''), text: entry });
            }
        }
    }
    journalSearchResults.innerHTML = results.length === 0
        ? '<p>No journal entries found.</p>'
        : results.map(entry => `<p><strong>${entry.date}</strong>: ${entry.text}</p>`).join('');
}

journalSearch.addEventListener('input', () => {
    filterJournalHistory(journalSearch.value);
});

smartTaskBtn.addEventListener('click', () => {
    const incompleteItems = Array.from(document.querySelectorAll('.task-item')).filter(item => !item.querySelector('.task-checkbox').checked);
    if (incompleteItems.length === 0) {
        smartTaskResult.textContent = 'All tasks are complete! Add a new task or review your goals.';
        return;
    }
    const next = incompleteItems[0].querySelector('.task-text').textContent;
    smartTaskResult.textContent = '🔎 Next task: ' + next;
});

// ===== JOURNAL =====
const journalInput = document.getElementById('journalInput');
const saveJournalBtn = document.getElementById('saveJournalBtn');
const clearJournalBtn = document.getElementById('clearJournalBtn');
const journalSaved = document.getElementById('journalSaved');

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function loadJournal() {
    const today = getToday();
    const entry = localStorage.getItem('journal_' + today);
    if (entry) {
        journalInput.value = entry;
    }
}

saveJournalBtn.addEventListener('click', () => {
    const today = getToday();
    localStorage.setItem('journal_' + today, journalInput.value);
    logActivity('Journal entry saved');
    journalSaved.classList.add('show');
    journalSaved.textContent = '✓ Journal entry saved!';
    setTimeout(() => {
        journalSaved.classList.remove('show');
    }, 3000);
    checkAchievements();
});

clearJournalBtn.addEventListener('click', () => {
    if (confirm('Clear today\'s journal entry?')) {
        journalInput.value = '';
        const today = getToday();
        localStorage.removeItem('journal_' + today);
    }
});

// ===== PLANNER =====
const plannerTime = document.getElementById('plannerTime');
const plannerEvent = document.getElementById('plannerEvent');
const addEventBtn = document.getElementById('addEventBtn');
const scheduleList = document.getElementById('scheduleList');

// ===== RANDOMIZER =====
const randomIdeaBtn = document.getElementById('randomIdeaBtn');
const randomTaskBtn = document.getElementById('randomTaskBtn');
const randomScheduleBtn = document.getElementById('randomScheduleBtn');
const randomReminderBtn = document.getElementById('randomReminderBtn');
const randomDailyBoosterBtn = document.getElementById('randomDailyBoosterBtn');
const randomResult = document.getElementById('randomResult');

const randomIdeas = [
    'Take a 10-minute walk outside and breathe deeply.',
    'Write down three things you are grateful for today.',
    'Drink a glass of water and stretch for 2 minutes.',
    'Spend 5 minutes planning your top priority for tomorrow.',
    'Try a new recipe or make a healthy snack.',
    'Call or message someone you haven’t spoken to in a while.',
    'Do a quick cleanup of one small area in your room.',
    'Read a short article or listen to a podcast episode.',
    'Complete one task you’ve been putting off.',
    'Set a mini-goal and celebrate when it’s done.'
];

const randomPlannerPrompts = [
    'Review your top 3 priorities and schedule the easiest one first.',
    'Add a short focus session to your planner for a creative task.',
    'Plan a 10-minute break between two work blocks.',
    'Schedule a quick check-in with yourself mid-day.',
    'Block time for a small self-care activity.'
];

const randomReminderPrompts = [
    'Drink a glass of water now.',
    'Take a deep breath and stretch for one minute.',
    'Stand up and move for 2 minutes.',
    'Write one quick gratitude note.',
    'Check your planner and adjust one item.'
];

const randomCompanionPrompts = [
    'Pick one task and complete it before lunch.',
    'Use a random idea to kickstart your next work session.',
    'Take a short walk and reflect on what you want to finish today.',
    'Set a reminder for hydration or a breathing break.',
    'Review your planner and add one small win for later.'
];

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function showRandomResult(text) {
    randomResult.textContent = text;
}

function pickRandomTask() {
    const items = Array.from(document.querySelectorAll('.task-item .task-text'));
    if (items.length === 0) {
        showRandomResult('No tasks available yet. Add a task first and try again.');
        return;
    }
    const randomText = getRandomItem(items).textContent;
    showRandomResult('🎯 Random task: ' + randomText);
}

function pickRandomIdea() {
    showRandomResult('💡 ' + getRandomItem(randomIdeas));
}

function pickRandomSchedule() {
    const items = Array.from(document.querySelectorAll('.schedule-item .event-text'));
    if (items.length === 0) {
        showRandomResult('📅 ' + getRandomItem(randomPlannerPrompts));
        return;
    }
    const randomText = getRandomItem(items).textContent;
    showRandomResult('📅 Random plan item: ' + randomText);
}

function pickRandomReminder() {
    const items = Array.from(document.querySelectorAll('.reminder-item .reminder-text'));
    if (items.length === 0) {
        showRandomResult('🔔 ' + getRandomItem(randomReminderPrompts));
        return;
    }
    const randomText = getRandomItem(items).textContent;
    showRandomResult('🔔 Random reminder: ' + randomText);
}

function pickRandomDailyBooster() {
    const options = ['idea', 'task', 'schedule', 'reminder', 'tip'];
    const choice = getRandomItem(options);

    switch (choice) {
        case 'task':
            pickRandomTask();
            break;
        case 'schedule':
            pickRandomSchedule();
            break;
        case 'reminder':
            pickRandomReminder();
            break;
        case 'idea':
            pickRandomIdea();
            break;
        default:
            showRandomResult('🚀 ' + getRandomItem(randomCompanionPrompts));
            break;
    }
}

randomIdeaBtn.addEventListener('click', pickRandomIdea);
randomTaskBtn.addEventListener('click', pickRandomTask);
randomScheduleBtn.addEventListener('click', pickRandomSchedule);
randomReminderBtn.addEventListener('click', pickRandomReminder);
randomDailyBoosterBtn.addEventListener('click', pickRandomDailyBooster);

function saveSchedule() {
    const events = [];
    document.querySelectorAll('.schedule-item').forEach(item => {
        events.push({
            time: item.querySelector('.time-display').textContent,
            event: item.querySelector('.event-text').textContent
        });
    });
    localStorage.setItem('dailySchedule', JSON.stringify(events));
}

function loadSchedule() {
    const events = JSON.parse(localStorage.getItem('dailySchedule')) || [];
    events.sort((a, b) => a.time.localeCompare(b.time));
    events.forEach(e => {
        addEventToSchedule(e.time, e.event);
    });
}

function addEventToSchedule(time, event) {
    if (!time || !event || !event.trim()) return false;
    
    const li = document.createElement('li');
    li.className = 'schedule-item';
    li.innerHTML = `
        <span class="time-display">${time}</span>
        <span class="event-text">${event}</span>
        <button class="btn btn-danger">Delete</button>
    `;
    
    const deleteBtn = li.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveSchedule();
    });
    
    scheduleList.appendChild(li);
    
    // Sort by time
    const items = Array.from(scheduleList.querySelectorAll('.schedule-item'));
    items.sort((a, b) => {
        const timeA = a.querySelector('.time-display').textContent;
        const timeB = b.querySelector('.time-display').textContent;
        return timeA.localeCompare(timeB);
    });
    
    scheduleList.innerHTML = '';
    items.forEach(item => scheduleList.appendChild(item));
    return true;
}

addEventBtn.addEventListener('click', () => {
    if (!addEventToSchedule(plannerTime.value, plannerEvent.value)) return;
    plannerTime.value = '';
    plannerEvent.value = '';
    saveSchedule();
});

// ===== REMINDERS =====
const reminderTime = document.getElementById('reminderTime');
const reminderText = document.getElementById('reminderText');
const addReminderBtn = document.getElementById('addReminderBtn');
const reminderList = document.getElementById('reminderList');

function saveReminders() {
    const reminders = [];
    document.querySelectorAll('.reminder-item').forEach(item => {
        reminders.push({
            time: item.querySelector('.time-display').textContent,
            reminder: item.querySelector('.reminder-text').textContent
        });
    });
    localStorage.setItem('dailyReminders', JSON.stringify(reminders));
}

function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('dailyReminders')) || [];
    reminders.sort((a, b) => a.time.localeCompare(b.time));
    reminders.forEach(r => {
        addReminderToList(r.time, r.reminder);
    });
}

function addReminderToList(time, reminder) {
    if (!time || !reminder || !reminder.trim()) return false;
    
    const li = document.createElement('li');
    li.className = 'reminder-item';
    li.innerHTML = `
        <span class="time-display">${time}</span>
        <span class="reminder-text">${reminder}</span>
        <button class="btn btn-danger">Delete</button>
    `;
    
    const deleteBtn = li.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveReminders();
    });
    
    reminderList.appendChild(li);
    
    // Sort by time
    const items = Array.from(reminderList.querySelectorAll('.reminder-item'));
    items.sort((a, b) => {
        const timeA = a.querySelector('.time-display').textContent;
        const timeB = b.querySelector('.time-display').textContent;
        return timeA.localeCompare(timeB);
    });
    
    reminderList.innerHTML = '';
    items.forEach(item => reminderList.appendChild(item));
    return true;
}

addReminderBtn.addEventListener('click', () => {
    if (!addReminderToList(reminderTime.value, reminderText.value)) return;
    reminderTime.value = '';
    reminderText.value = '';
    saveReminders();
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    updateDate();
    loadTasks();
    loadJournal();
    loadSchedule();
    loadReminders();
    loadHabits();
    loadGoals();
    loadMoodEntry();
    loadGratitudeEntry();
    showDailyQuote();
    loadMode();
    loadEnergyChart();
    loadQuickNotes();
    displayAchievements();
    loadChallenges();
    displayActivityLog();
    
    // Unlock Starter achievement on first load
    if (!localStorage.getItem('starterUnlocked')) {
        unlockAchievement(7); // Starter
        localStorage.setItem('starterUnlocked', 'true');
    }
    
    // Log app start
    logActivity('Daily Companion started');
    checkAchievements();
    
    // Check reminders every minute
    setInterval(checkReminders, 60000);
    
    // Check achievements periodically
    setInterval(checkAchievements, 60000);
});

function checkReminders() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    document.querySelectorAll('.reminder-item').forEach(item => {
        const time = item.querySelector('.time-display').textContent;
        const reminder = item.querySelector('.reminder-text').textContent;
        
        if (time === currentTime) {
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Daily Reminder', {
                    body: reminder,
                    icon: '🔔'
                });
            }
            // Alert fallback
            alert('🔔 Reminder: ' + reminder);
        }
    });
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// ===== HABITS =====
function addHabitToList(habit, streak = 0) {
    if (!habit || !habit.trim()) return false;
    
    const li = document.createElement('li');
    li.className = 'habit-item';
    li.innerHTML = `
        <span>${habit}</span>
        <span class="status-badge">Streak: ${streak} 🔥</span>
        <button class="btn btn-secondary" data-action="streak">+1 Day</button>
        <button class="btn btn-danger">Delete</button>
    `;
    
    const streakBtn = li.querySelector('[data-action="streak"]');
    streakBtn.addEventListener('click', () => {
        streak++;
        li.querySelector('.status-badge').textContent = `Streak: ${streak} 🔥`;
        saveHabits();
    });
    
    const deleteBtn = li.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveHabits();
    });
    
    habitList.appendChild(li);
    return true;
}

function saveHabits() {
    const habits = [];
    document.querySelectorAll('.habit-item').forEach(item => {
        const badge = item.querySelector('.status-badge').textContent;
        const streak = parseInt(badge.match(/\\d+/)[0]);
        habits.push({
            name: item.querySelector('span').textContent,
            streak: streak
        });
    });
    localStorage.setItem('dailyHabits', JSON.stringify(habits));
}

function loadHabits() {
    const habits = JSON.parse(localStorage.getItem('dailyHabits')) || [];
    habits.forEach(h => addHabitToList(h.name, h.streak));
    updateWeeklySummary();
}

function updateWeeklySummary() {
    const habits = document.querySelectorAll('.habit-item');
    const totalHabits = habits.length;
    const totalStreak = Array.from(habits).reduce((sum, item) => {
        const badge = item.querySelector('.status-badge').textContent;
        return sum + parseInt(badge.match(/\\d+/) ? badge.match(/\\d+/)[0] : 0);
    }, 0);
    weeklySummary.innerHTML = `<p><strong>Weekly Summary:</strong> ${totalHabits} habits | Total streak: ${totalStreak} days 🔥</p>`;
}

addHabitBtn.addEventListener('click', () => {
    if (!addHabitToList(habitInput.value)) return;
    logActivity(`Habit added: ${habitInput.value}`);
    habitInput.value = '';
    saveHabits();
    updateWeeklySummary();
    checkAchievements();
});

// ===== GOALS =====
function addGoalToList(goal, progress = 0) {
    if (!goal || !goal.trim()) return false;
    
    const li = document.createElement('li');
    li.className = 'goal-item';
    li.innerHTML = `
        <span>${goal}</span>
        <span class="status-badge">${progress}%</span>
        <button class="btn btn-secondary" data-action="progress">+10%</button>
        <button class="btn btn-danger">Delete</button>
    `;
    
    const progressBtn = li.querySelector('[data-action="progress"]');
    progressBtn.addEventListener('click', () => {
        let currentProgress = parseInt(li.querySelector('.status-badge').textContent);
        currentProgress = Math.min(currentProgress + 10, 100);
        li.querySelector('.status-badge').textContent = currentProgress + '%';
        saveGoals();
    });
    
    const deleteBtn = li.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveGoals();
    });
    
    goalList.appendChild(li);
    return true;
}

function saveGoals() {
    const goals = [];
    document.querySelectorAll('.goal-item').forEach(item => {
        goals.push({
            name: item.querySelector('span').textContent,
            progress: parseInt(item.querySelector('.status-badge').textContent)
        });
    });
    localStorage.setItem('dailyGoals', JSON.stringify(goals));
}

function loadGoals() {
    const goals = JSON.parse(localStorage.getItem('dailyGoals')) || [];
    goals.forEach(g => addGoalToList(g.name, g.progress));
}

addGoalBtn.addEventListener('click', () => {
    if (!addGoalToList(goalInput.value)) return;
    logActivity(`Goal added: ${goalInput.value}`);
    goalInput.value = '';
    saveGoals();
    checkAchievements();
});

// ===== POMODORO FOCUS =====
let pomodoroTime = parseInt(workMinutes.value) * 60;
let pomodoroInterval = null;
let isRunning = false;
let isWorkSession = true;

function updatePomodoroDisplay() {
    const mins = Math.floor(pomodoroTime / 60);
    const secs = pomodoroTime % 60;
    pomodoroTimerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startPomodoro() {
    if (isRunning) return;
    isRunning = true;
    pomodoroInterval = setInterval(() => {
        pomodoroTime--;
        updatePomodoroDisplay();
        if (pomodoroTime <= 0) {
            const msg = isWorkSession ? 'Work session complete!' : 'Break over!';
            alert(msg);
            isWorkSession = !isWorkSession;
            pomodoroTime = (isWorkSession ? parseInt(workMinutes.value) : parseInt(breakMinutes.value)) * 60;
            updatePomodoroDisplay();
        }
    }, 1000);
}

function pausePomodoro() {
    clearInterval(pomodoroInterval);
    isRunning = false;
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    isRunning = false;
    isWorkSession = true;
    pomodoroTime = parseInt(workMinutes.value) * 60;
    updatePomodoroDisplay();
}

startPomodoroBtn.addEventListener('click', startPomodoro);
pausePomodoroBtn.addEventListener('click', pausePomodoro);
resetPomodoroBtn.addEventListener('click', resetPomodoro);

workMinutes.addEventListener('change', () => {
    if (!isRunning) {
        pomodoroTime = parseInt(workMinutes.value) * 60;
        updatePomodoroDisplay();
    }
});

// ===== WELLNESS =====
moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        moodResult.textContent = `You selected: ${mood} 😊`;
        saveMoodEntry(mood);
    });
});

function saveMoodEntry(mood) {
    const today = getToday();
    localStorage.setItem('mood_' + today, mood);
}

function loadMoodEntry() {
    const today = getToday();
    const mood = localStorage.getItem('mood_' + today);
    if (mood) {
        moodResult.textContent = `Today's mood: ${mood} 😊`;
    }
}

saveGratitudeBtn.addEventListener('click', () => {
    const today = getToday();
    localStorage.setItem('gratitude_' + today, gratitudeInput.value);
    alert('✨ Gratitude saved!');
});

function loadGratitudeEntry() {
    const today = getToday();
    const entry = localStorage.getItem('gratitude_' + today);
    if (entry) {
        gratitudeInput.value = entry;
    }
}

const dailyQuotes = [
    '\"The only way to do great work is to love what you do.\" - Steve Jobs',
    '\"Success is not final, failure is not fatal.\" - Winston Churchill',
    '\"Believe you can and you are halfway there.\" - Theodore Roosevelt',
    '\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt',
    '\"It always seems impossible until it is done.\" - Nelson Mandela'
];

function showDailyQuote() {
    const quote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
    dailyQuote.textContent = '💭 ' + quote;
}

breathingBtn.addEventListener('click', () => {
    breathingTip.textContent = 'Try the 4-7-8 technique: Breathe in for 4, hold for 7, exhale for 8. Repeat 3 times.';
});

// ===== MODES =====
const modeButtons = document.querySelectorAll('.mode-btn');
const modeTips = document.getElementById('modeTips');

const modeTipsMap = {
    work: 'Focus Mode: Show tasks first, minimize distractions, Pomodoro enabled.',
    study: 'Study Mode: Focus on habits and goals, display quotes and timer.',
    wellness: 'Wellness Mode: Prioritize mood tracking, gratitude, and breathing.',
    creative: 'Creative Mode: Brainstorm freely, notes enabled, randomizer active.',
    social: 'Social Mode: Challenges enabled, share progress, celebrate wins.',
    relax: 'Relax Mode: Breathing tips, wellness focus, calming quotes.',
    stupid: '🤪 Stupid Mode: Have fun, get random jokes and silly activities!'
};

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        const tips = modeTipsMap[mode];
        modeTips.textContent = tips;
        if (mode === 'silly') {
            displaySillyMode();
        } else {
            modeTips.classList.remove('silly-message');
        }
        logActivity(`Switched to ${mode.charAt(0).toUpperCase() + mode.slice(1)} mode`);
        localStorage.setItem('currentMode', mode);
    });
});

function loadMode() {
    const mode = localStorage.getItem('currentMode') || 'work';
    const modeBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (modeBtn) modeBtn.click();
}

// ===== SILLY MODE =====
const sillyJokes = [
    "Why don't eggs tell jokes? Because they'd crack each other up!",
    "What did the ocean say to the beach? Nothing, it just waved!",
    "Why don't skeletons ever go trick or treating? Because they have no body to go with!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "How do you organize a space party? You planet!",
    "Why did the cookie go to the doctor? Because it felt crumbly!",
    "What's orange and sounds like a parrot? A carrot!",
    "Why don't scientists trust atoms? Because they make up everything!"
];

const sillyActivities = [
    "Take a silly walk around the room!",
    "Make funny faces in the mirror!",
    "Sing your favorite song off-key!",
    "Do a silly dance for 1 minute!",
    "Tell yourself a joke and laugh!",
    "Draw something with your eyes closed!",
    "Try yoga while making funny sounds!",
    "Text a friend a silly meme!",
    "Imagine you're a circus performer!",
    "Give yourself silly compliments!"
];

function getRandomSillyJoke() {
    return sillyJokes[Math.floor(Math.random() * sillyJokes.length)];
}

function getRandomSillyActivity() {
    return sillyActivities[Math.floor(Math.random() * sillyActivities.length)];
}

function displaySillyMode() {
    modeTips.classList.add('silly-message');
    modeTips.innerHTML = 'Joke: ' + getRandomSillyJoke() + '<br><br><strong>Try this:</strong> ' + getRandomSillyActivity() + '<br><br><button class="btn silly-btn" onclick="displaySillyMode()">Get Another Joke!</button>';
    logActivity('Viewing silly jokes and activities');
}

// ===== ENERGY TRACKER =====
const energySlider = document.getElementById('energySlider');
const energyValue = document.getElementById('energyValue');
const saveEnergyBtn = document.getElementById('saveEnergyBtn');
const energyChart = document.getElementById('energyChart');
const energyTips = document.getElementById('energyTips');

const energyTipMap = {
    1: 'Extremely low energy. Consider taking a break, hydrating, or napping.',
    2: 'Very low energy. Try light movement or a quick energizer.',
    3: 'Low energy. Take a short break and stay hydrated.',
    4: 'Slightly low energy. Stretch or take deep breaths.',
    5: 'Medium energy. Maintain momentum!',
    6: 'Good energy. Now is a great time to tackle focus work.',
    7: 'High energy. Perfect time for challenging tasks!',
    8: 'Very high energy. Channel this into your most important goals.',
    9: 'Excellent energy! Use this peak time wisely.',
    10: 'Peak energy! Maximize this moment for important work.'
};

energySlider.addEventListener('input', () => {
    energyValue.textContent = energySlider.value + '/10';
    energyTips.textContent = energyTipMap[energySlider.value];
});

saveEnergyBtn.addEventListener('click', () => {
    const today = getToday();
    const hours = new Date().getHours();
    const energyData = JSON.parse(localStorage.getItem('energyData') || '{}');
    if (!energyData[today]) energyData[today] = {};
    energyData[today][hours] = parseInt(energySlider.value);
    localStorage.setItem('energyData', JSON.stringify(energyData));
    logActivity(`Energy level: ${energySlider.value}/10`);
    alert('✅ Energy level saved!');
});

function loadEnergyChart() {
    const today = getToday();
    const energyData = JSON.parse(localStorage.getItem('energyData') || '{}')[today] || {};
    if (Object.keys(energyData).length === 0) {
        energyChart.textContent = 'No energy data yet. Save your energy level throughout the day!';
        return;
    }
    const entries = Object.entries(energyData)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([hour, level]) => `${hour}:00 → ${level}/10`)
        .join(' | ');
    energyChart.textContent = entries;
}

// ===== QUICK NOTES =====
const quickNotes = document.getElementById('quickNotes');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const clearNotesBtn = document.getElementById('clearNotesBtn');
const notesSaved = document.getElementById('notesSaved');

function loadQuickNotes() {
    const today = getToday();
    const notes = localStorage.getItem('quickNotes_' + today);
    if (notes) quickNotes.value = notes;
}

saveNotesBtn.addEventListener('click', () => {
    const today = getToday();
    localStorage.setItem('quickNotes_' + today, quickNotes.value);
    logActivity('Quick notes saved');
    notesSaved.classList.add('show');
    notesSaved.textContent = '✨ Notes saved!';
    setTimeout(() => notesSaved.classList.remove('show'), 3000);
});

clearNotesBtn.addEventListener('click', () => {
    if (confirm('Clear all notes?')) {
        quickNotes.value = '';
        const today = getToday();
        localStorage.removeItem('quickNotes_' + today);
        logActivity('Quick notes cleared');
    }
});

// ===== ACHIEVEMENTS =====
const badgesContainer = document.getElementById('badgesContainer');
const achievementStats = document.getElementById('achievementStats');

const achievementsList = [
    { emoji: '🎯', name: 'Goal Setter', condition: 'Add 5 goals', unlocked: false },
    { emoji: '🔥', name: 'Habit Hero', condition: '30 day streak', unlocked: false },
    { emoji: '⚡', name: 'Energy Master', condition: 'Log energy 10 times', unlocked: false },
    { emoji: '✍️', name: 'Writer', condition: 'Write 5 journal entries', unlocked: false },
    { emoji: '🎨', name: 'Creative Mind', condition: 'Use Creative Mode', unlocked: false },
    { emoji: '🏆', name: 'Achiever', condition: 'Complete 20 tasks', unlocked: false },
    { emoji: '💯', name: 'Perfect Day', condition: 'Complete all tasks', unlocked: false },
    { emoji: '🚀', name: 'Starter', condition: 'First use', unlocked: false }
];

function displayAchievements() {
    loadAchievements();
    badgesContainer.innerHTML = '';
    achievementsList.forEach((achievement, idx) => {
        const badge = document.createElement('div');
        badge.className = `badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        badge.innerHTML = `
            <div class="badge-emoji">${achievement.emoji}</div>
            <div class="badge-name">${achievement.name}</div>
        `;
        badgesContainer.appendChild(badge);
    });
    
    const unlockedCount = achievementsList.filter(a => a.unlocked).length;
    achievementStats.textContent = `🏅 Unlocked: ${unlockedCount} / ${achievementsList.length}`;
}

function saveAchievements() {
    localStorage.setItem('achievements', JSON.stringify(achievementsList));
}

function loadAchievements() {
    const saved = JSON.parse(localStorage.getItem('achievements'));
    if (saved) achievementsList.forEach((a, i) => a.unlocked = saved[i]?.unlocked || false);
}

function unlockAchievement(index) {
    if (!achievementsList[index].unlocked) {
        achievementsList[index].unlocked = true;
        saveAchievements();
        displayAchievements();
    }
}

function checkAchievements() {
    const taskCount = document.querySelectorAll('.task-item').length;
    const taskCompleted = document.querySelectorAll('.task-item.completed').length;
    const journalEntries = Object.keys(localStorage).filter(k => k.startsWith('journal_')).length;
    const goalCount = document.querySelectorAll('.goal-item').length;
    const energyLogs = Object.keys(localStorage).filter(k => k.startsWith('energyData')).length;
    
    if (taskCount >= 20) unlockAchievement(5); // Achiever
    if (goalCount >= 5) unlockAchievement(0); // Goal Setter
    if (journalEntries >= 5) unlockAchievement(3); // Writer
    if (taskCount > 0 && taskCount === taskCompleted) unlockAchievement(6); // Perfect Day
    if (energyLogs >= 10) unlockAchievement(2); // Energy Master
    if (localStorage.getItem('currentMode') === 'creative') unlockAchievement(4); // Creative Mind
}

// ===== CHALLENGES =====
const challengeInput = document.getElementById('challengeInput');
const addChallengeBtn = document.getElementById('addChallengeBtn');
const challengeList = document.getElementById('challengeList');

function addChallengeToList(challenge, completed = false) {
    if (!challenge || !challenge.trim()) return false;

    const li = document.createElement('li');
    li.className = 'challenge-item' + (completed ? ' completed' : '');
    li.innerHTML = `
        <input type="checkbox" class="challenge-checkbox" ${completed ? 'checked' : ''}>
        <span class="challenge-text">${challenge}</span>
        <button class="btn btn-danger">Delete</button>
    `;

    const checkbox = li.querySelector('.challenge-checkbox');
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed');
        saveChallenges();
        logActivity(`Challenge ${li.classList.contains('completed') ? 'completed' : 'uncompleted'}: ${challenge}`);
    });

    const deleteBtn = li.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveChallenges();
        logActivity(`Challenge deleted: ${challenge}`);
    });

    challengeList.appendChild(li);
    return true;
}

function saveChallenges() {
    const challenges = [];
    document.querySelectorAll('.challenge-item').forEach(item => {
        challenges.push({
            text: item.querySelector('.challenge-text').textContent,
            completed: item.querySelector('.challenge-checkbox').checked
        });
    });
    localStorage.setItem('dailyChallenges', JSON.stringify(challenges));
}

function loadChallenges() {
    const challenges = JSON.parse(localStorage.getItem('dailyChallenges')) || [];
    challenges.forEach(c => addChallengeToList(c.text, c.completed));
}

addChallengeBtn.addEventListener('click', () => {
    if (!addChallengeToList(challengeInput.value)) return;
    logActivity(`Challenge added: ${challengeInput.value}`);
    challengeInput.value = '';
    saveChallenges();
});

// ===== ACTIVITY LOG =====
const activityLog = document.getElementById('activityLog');
const clearLogBtn = document.getElementById('clearLogBtn');
const logFilter = document.getElementById('logFilter');

function logActivity(activity) {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = getToday();
    
    let logs = JSON.parse(localStorage.getItem('activityLog_' + today) || '[]');
    logs.push({ time, activity });
    localStorage.setItem('activityLog_' + today, JSON.stringify(logs));
    
    displayActivityLog();
}

function displayActivityLog() {
    const today = getToday();
    const logs = JSON.parse(localStorage.getItem('activityLog_' + today) || '[]');
    const filter = logFilter.value.toLowerCase();
    
    activityLog.innerHTML = logs
        .filter(log => log.activity.toLowerCase().includes(filter))
        .map(log => `<div class="log-entry"><div class="log-time">${log.time}</div><div class="log-text">${log.activity}</div></div>`)
        .reverse()
        .join('');
}

clearLogBtn.addEventListener('click', () => {
    if (confirm('Clear the activity log?')) {
        const today = getToday();
        localStorage.removeItem('activityLog_' + today);
        displayActivityLog();
    }
});

logFilter.addEventListener('input', displayActivityLog);

// ===== DATA & TOOLS =====
exportDataBtn.addEventListener('click', () => {
    const allData = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allData[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'daily-companion-backup.json';
    link.click();
});

importDataBtn.addEventListener('click', () => {
    importFileInput.click();
});

importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            Object.keys(data).forEach(key => {
                localStorage.setItem(key, data[key]);
            });
            alert('✅ Data imported successfully! Please refresh the page.');
            location.reload();
        } catch (error) {
            alert('❌ Error importing data: ' + error.message);
        }
    };
    reader.readAsText(file);
});
