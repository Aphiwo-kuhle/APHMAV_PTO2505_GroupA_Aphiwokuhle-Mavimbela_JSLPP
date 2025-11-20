// data.js
export const STORAGE_KEY = "kanban.tasks";

/** Unique id */
export function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Save tasks to localStorage */
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/** Load tasks from localStorage */
export function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse tasks from storage:", err);
    return [];
  }
}

/** Add a task */
export function addTask(data) {
  const tasks = loadTasks();
  const task = { id: uid(), priority: "Medium", ...data };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

/** Update a task */
export function updateTask(id, changes) {
  const tasks = loadTasks();
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return;
  tasks[i] = { ...tasks[i], ...changes };
  saveTasks(tasks);
  return tasks[i];
}

/** Delete a task */
export function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}

/** Get single task */
export function getTask(id) {
  return loadTasks().find(t => t.id === id);
}

/** Fetch initial tasks from API and save to localStorage (with loading/error) */
export async function fetchInitialTasks() {
  const API = "https://jsl-kanban-api.vercel.app/";
  try {
    const res = await fetch(API, {cache: "no-store"});
    if (!res.ok) throw new Error("Network response not ok: " + res.status);
    const data = await res.json();

    // Normalize tasks: ensure fields exist and set priority default
    const tasks = (Array.isArray(data) ? data : []).map(t => ({
      id: t.id || uid(),
      title: t.title || "Untitled",
      desc: t.desc || t.description || "",
      status: t.status || "todo",
      priority: t.priority || "Medium"
    }));

    // Save to localStorage
    if (tasks.length > 0) {
      saveTasks(tasks);
      return { success: true, tasks };
    } else {
      // If API returned empty, do not wipe existing storage
      return { success: false, error: "No tasks from API" };
    }
  } catch (err) {
    console.warn("fetchInitialTasks failed:", err);
    return { success: false, error: err.message || "Fetch failed" };
  }
}

/** Seed data (only used if no localStorage and fetch fails) */
export function seedTasks() {
  const seed = [
    { id: uid(), title: "Launch Epic Career 🚀", desc: "Define roadmap.", status: "todo", priority: "High" },
    { id: uid(), title: "Master JavaScript 💛", desc: "Deep JS study.", status: "doing", priority: "Medium" },
    { id: uid(), title: "Have fun 😺", desc: "Enjoy learning!", status: "done", priority: "Low" },
  ];
  saveTasks(seed);
  return seed;
}
