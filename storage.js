// storage.js
export const STORAGE_KEY = "kanban.tasks.v1";

/** Generate unique id */
export function uid() {
  return (crypto && crypto.randomUUID)
    ? crypto.randomUUID()
    : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Load tasks or seed initial data */
export function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse tasks:", e);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const seed = [
    { id: uid(), title: "Launch Epic Career 🚀", desc: "Define roadmap.", status: "todo", priority: "high" },
    { id: uid(), title: "Master JavaScript 💛", desc: "Deep JS study.", status: "doing", priority: "medium" },
    { id: uid(), title: "Have fun 😺", desc: "Enjoy learning!", status: "done", priority: "low" },
  ];

  saveTasks(seed);
  return seed;
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(data) {
  const tasks = loadTasks();
  const task = { id: uid(), ...data };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

export function updateTask(id, changes) {
  const tasks = loadTasks();
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return null;
  tasks[i] = { ...tasks[i], ...changes };
  saveTasks(tasks);
  return tasks[i];
}

export function deleteTask(id) {
  const tasks = loadTasks().filter(t => t.id !== id);
  saveTasks(tasks);
}
