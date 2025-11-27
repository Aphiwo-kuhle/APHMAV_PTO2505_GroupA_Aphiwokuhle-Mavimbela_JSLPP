// tasks.js
import { loadTasks } from "./data.js";

export function renderBoard() {
  const tasks = loadTasks();

  const todo = tasks.filter(t => t.status === "todo");
  const doing = tasks.filter(t => t.status === "doing");
  const done = tasks.filter(t => t.status === "done");

  paintList("todoList", todo);
  paintList("doingList", doing);
  paintList("doneList", done);

  document.getElementById("todoTitle").textContent = `TODO (${todo.length})`;
  document.getElementById("doingTitle").textContent = `DOING (${doing.length})`;
  document.getElementById("doneTitle").textContent = `DONE (${done.length})`;
}

function paintList(id, tasks) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  tasks.forEach(t => list.appendChild(taskCard(t)));
}

function taskCard(task) {
  const el = document.createElement("article");
  el.className = "task";
  el.dataset.id = task.id;

  el.innerHTML = `
    <h3 class="task-title">${task.title}</h3>
    <p class="task-desc">${task.desc || "No description"}</p>
  `;
  return el;
}
// tasks.js
import { loadTasks } from "./storage.js";

/**
 * Render the whole board (counts + lists)
 */
export function renderBoard() {
  const tasks = loadTasks();

  // Sort tasks inside each column by priority: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const todo = tasks.filter(t => t.status === "todo").sort((a,b) => (priorityOrder[a.priority || "low"] - priorityOrder[b.priority || "low"]));
  const doing = tasks.filter(t => t.status === "doing").sort((a,b) => (priorityOrder[a.priority || "low"] - priorityOrder[b.priority || "low"]));
  const done = tasks.filter(t => t.status === "done").sort((a,b) => (priorityOrder[a.priority || "low"] - priorityOrder[b.priority || "low"]));

  paintList("todoList", todo);
  paintList("doingList", doing);
  paintList("doneList", done);

  // counts
  const todoCountEl = document.getElementById("todoCount");
  const doingCountEl = document.getElementById("doingCount");
  const doneCountEl = document.getElementById("doneCount");
  if (todoCountEl) todoCountEl.textContent = todo.length;
  if (doingCountEl) doingCountEl.textContent = doing.length;
  if (doneCountEl) doneCountEl.textContent = done.length;
}

/** Populate a target list with task cards */
function paintList(listId, tasks) {
  const list = document.getElementById(listId);
  if (!list) return;
  list.innerHTML = "";
  tasks.forEach(t => list.appendChild(taskCard(t)));
}

/** Create the DOM element for a single task */
function taskCard(task) {
  const el = document.createElement("article");
  el.className = "task-card";
  el.dataset.id = task.id;

  // Priority badge
  const priorityClass = `priority-${task.priority || "low"}`;
  const priorityLabel = (task.priority || "low").toUpperCase();

  el.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
      <div>
        <p>${escapeHtml(task.title)}</p>
        <span>${escapeHtml(task.desc || "")}</span>
      </div>
      <div style="text-align:right">
        <div class="priority-badge ${priorityClass}">${priorityLabel}</div>
      </div>
    </div>
  `;

  // clicking a card will trigger a global handler (main.js will listen for clicks)
  return el;
}

/** simple escape to avoid accidental HTML injection */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
