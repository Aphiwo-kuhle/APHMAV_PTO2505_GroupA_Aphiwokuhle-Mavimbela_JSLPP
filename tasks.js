// tasks.js
import { loadTasks } from "./data.js";

const PRIORITY_ORDER = { "High": 0, "Medium": 1, "Low": 2 };

/** Render the full board */
export function renderBoard() {
  const tasks = loadTasks();

  // Filter by status
  const todo = tasks.filter(t => t.status === "todo").sort(comparePriority);
  const doing = tasks.filter(t => t.status === "doing").sort(comparePriority);
  const done = tasks.filter(t => t.status === "done").sort(comparePriority);

  paintList("todoList", todo);
  paintList("doingList", doing);
  paintList("doneList", done);

  document.getElementById("todoTitle").textContent = `TODO (${todo.length})`;
  document.getElementById("doingTitle").textContent = `DOING (${doing.length})`;
  document.getElementById("doneTitle").textContent = `DONE (${done.length})`;
}

/** Compare tasks by priority (High -> Medium -> Low) */
function comparePriority(a, b) {
  const pa = PRIORITY_ORDER[a.priority || "Medium"] ?? 1;
  const pb = PRIORITY_ORDER[b.priority || "Medium"] ?? 1;
  if (pa !== pb) return pa - pb;
  // fallback to insertion order (no change)
  return 0;
}

function paintList(id, tasks) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  tasks.forEach(t => list.appendChild(taskCard(t)));
}

/** Create a task card element. */
function taskCard(task) {
  const el = document.createElement("article");
  el.className = "task";
  el.dataset.id = task.id;

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
      <div style="flex:1">
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        <p class="task-desc">${escapeHtml(task.desc || "No description")}</p>
      </div>
      <div style="flex-shrink:0;margin-left:8px">
        <span class="priority-badge ${task.priority ? task.priority.toLowerCase() : 'medium'}">
          ${escapeHtml(task.priority || "Medium")}
        </span>
      </div>
    </div>
  `;

  return el;
}

/** Basic html escape to avoid accidental injection when showing user content */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
export function createTaskCard(task) {
  const card = document.createElement("div");
  card.classList.add("task-card");
  card.dataset.id = task.id;

  card.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-desc">${task.description}</div>
    <div class="priority-tag ${getPriorityClass(task.priority)}">
      ${task.priority}
    </div>
  `;

  // Click event to open modal for editing later
  card.addEventListener("click", () => {
    openModal(task.status, task);
  });

  return card;
}

function getPriorityClass(level) {
  switch (level) {
    case "High": return "priority-high";
    case "Medium": return "priority-medium";
    case "Low": return "priority-low";
    default: return "";
  }
}
