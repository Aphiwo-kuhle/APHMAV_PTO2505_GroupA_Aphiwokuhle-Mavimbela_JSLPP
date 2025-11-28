// storage.js

export const STORAGE_KEY = "kanban.tasks.v1";
const API_URL = "https://jsl-kanban-api.vercel.app/";

/**
 * Generate a unique id for tasks.
 * @returns {string}
 */
export function uid() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Read all tasks from localStorage.
 * @returns {Array<object>}
 */
export function getTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("storage.getTasks: could not parse JSON", err);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

/**
 * Save all tasks to localStorage.
 * @param {Array<object>} tasks
 */
export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Normalise a task object coming from the API.
 * @param {any} raw
 * @returns {object}
 */
function normaliseTask(raw) {
  return {
    id: raw.id || uid(),
    title: raw.title || "Untitled task",
    desc: raw.description || raw.desc || "",
    status: raw.status === "doing" || raw.status === "done" ? raw.status : "todo",
    priority: ["high", "medium", "low"].includes(raw.priority) ? raw.priority : "medium",
  };
}

/**
 * Seed fallback data used when API is unavailable.
 * @returns {Array<object>}
 */
function seedTasks() {
  return [
    {
      id: uid(),
      title: "Launch Epic Career 🚀",
      desc: "Define roadmap.",
      status: "todo",
      priority: "high",
    },
    {
      id: uid(),
      title: "Master JavaScript 💛",
      desc: "Deep JS study.",
      status: "doing",
      priority: "medium",
    },
    {
      id: uid(),
      title: "Never Give Up 🏆",
      desc: "Stay consistent and keep coding.",
      status: "done",
      priority: "low",
    },
  ];
}

/**
 * Initialise task data.
 * 1. If localStorage already has tasks, just return them.
 * 2. Otherwise, fetch from the API and save.
 * 3. If fetch fails, seed fallback data and rethrow so UI can show an error.
 * @returns {Promise<Array<object>>}
 */
export async function initTasks() {
  const existing = getTasks();
  if (existing.length > 0) return existing;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    const tasks = Array.isArray(data) ? data.map(normaliseTask) : [];
    saveTasks(tasks);
    return tasks;
  } catch (err) {
    console.error("storage.initTasks: fetch failed, using seed data", err);
    const fallback = seedTasks();
    saveTasks(fallback);
    // rethrow so main.js can show error message
    throw err;
  }
}

/**
 * Get a single task by id.
 * @param {string} id
 * @returns {object|null}
 */
export function getTask(id) {
  return getTasks().find((t) => t.id === id) || null;
}

/**
 * Add a new task.
 * @param {{title:string, desc:string, status:string, priority:string}} data
 * @returns {object} created task
 */
export function addTask(data) {
  const tasks = getTasks();
  const task = {
    id: uid(),
    title: data.title,
    desc: data.desc || "",
    status: data.status || "todo",
    priority: data.priority || "medium",
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

/**
 * Update an existing task.
 * @param {string} id
 * @param {{title?:string, desc?:string, status?:string, priority?:string}} changes
 * @returns {object|null} updated task or null if not found
 */
export function updateTask(id, changes) {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...changes };
  saveTasks(tasks);
  return tasks[index];
}

/**
 * Delete a task by id.
 * @param {string} id
 */
export function deleteTask(id) {
  const tasks = getTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
}

