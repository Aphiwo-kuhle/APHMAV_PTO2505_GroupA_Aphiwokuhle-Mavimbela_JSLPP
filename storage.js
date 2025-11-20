// ================== STORAGE FUNCTIONS ==================

// Load tasks from localStorage
export function loadTasks() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
}

// Save tasks to localStorage
export function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
