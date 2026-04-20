import { LightningElement ,track } from 'lwc';
export default class TodoApp extends LightningElement {
   @track tasks = [];
  @track filteredTasks = [];
  taskInput = '';
  priority = 'Low';
  filter = 'all';

  handleInput(event) {
    this.taskInput = event.target.value;
  }

  handlePriorityChange(event) {
    this.priority = event.target.value;
  }

  handleKeyDown(event) {
    if (event.key === 'Enter') {
      this.addTask();
    }
  }

  addTask() {
    if (!this.taskInput) return;

    const newTask = {
      id: Date.now(),
      text: this.taskInput,
      priority: this.priority,
      completed: false
    };

    this.tasks = [...this.tasks, newTask];
    this.taskInput = '';
    this.applyFilter();
  }

  toggleTask(event) {
    const id = Number(event.target.dataset.id);
    this.tasks = this.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.applyFilter();
  }

  deleteTask(event) {
    const id = Number(event.target.dataset.id);
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.applyFilter();
  }

  showAll() {
    this.filter = 'all';
    this.applyFilter();
  }

  showPending() {
    this.filter = 'pending';
    this.applyFilter();
  }

  showCompleted() {
    this.filter = 'completed';
    this.applyFilter();
  }

  applyFilter() {
    let temp = [...this.tasks];

    if (this.filter === 'completed') {
      temp = temp.filter(t => t.completed);
    } else if (this.filter === 'pending') {
      temp = temp.filter(t => !t.completed);
    }

    // Move completed to bottom
    temp.sort((a, b) => a.completed - b.completed);

    this.filteredTasks = temp;
  }
}
