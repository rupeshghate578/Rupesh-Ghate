// DOM Elements
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const emptyState = document.getElementById('empty-state');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');

// State
let tasks = [];
let currentFilter = 'all';

// Initialize app
function init() {
    loadTasks();
    renderTasks();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
}

// Add Task
function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        priority: priority,
        completed: false,
    };

    tasks.push(newTask);
    taskInput.value = '';
    prioritySelect.value = 'medium';

    saveTasks();
    renderTasks();
    updateStats();
}

// Delete Task
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

// Toggle Task Completion
function toggleComplete(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Edit Task
function editTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const taskElement = document.querySelector(`[data-id="${id}"]`);
    const taskContent = taskElement.querySelector('.task-content');

    const editHTML = `
        <input type="text" class="edit-input" value="${task.text}">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;

    taskContent.innerHTML = editHTML;

    const saveBtn = taskContent.querySelector('.save-btn');
    const cancelBtn = taskContent.querySelector('.cancel-btn');
    const editInput = taskContent.querySelector('.edit-input');

    saveBtn.addEventListener('click', () => {
        const newText = editInput.value.trim();
        if (newText !== '') {
            task.text = newText;
            saveTasks();
            renderTasks();
        }
    });

    cancelBtn.addEventListener('click', () => {
        renderTasks();
    });

    editInput.focus();
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;

    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter((t) => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter((t) => t.completed);
    }

    // Sort: pending first, then completed
    filteredTasks.sort((a, b) => a.completed - b.completed);

    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    filteredTasks.forEach((task) => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

// Create Task Element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : 'pending'}`;
    li.dataset.id = task.id;

    li.innerHTML = `
        <input 
            type="checkbox" 
            class="checkbox" 
            ${task.completed ? 'checked' : ''} 
            onchange="toggleComplete(${task.id})"
        >
        <div class="task-content">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <span class="priority-badge ${task.priority}">${task.priority}</span>
        </div>
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    return li;
}

// Update Statistics
function updateStats() {
    const pending = tasks.filter((t) => !t.completed).length;
    const completed = tasks.filter((t) => t.completed).length;

    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

// Save Tasks to LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load Tasks from LocalStorage
function loadTasks() {
    const stored = localStorage.getItem('tasks');
    tasks = stored ? JSON.parse(stored) : [];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Start the app
init();
