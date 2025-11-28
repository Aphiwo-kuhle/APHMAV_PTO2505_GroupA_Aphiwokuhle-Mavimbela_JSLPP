// tasks.js
import { getTasks } from "./storage.js";

// high → medium → low
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

/**
 * Render all tasks into the three columns.
 * @param {(id:string)=>void} onTaskClick callback when a card is clicked
 */
export function renderBoard(onTaskClick) {
  const all = getTasks();

  const groups = {
    todo: [],
    doing: [],
    done: [],
  };

  all.forEach((t) => {
    if (!groups[t.status]) groups[t.status] = [];
    groups[t.status].push(t);
  });

  ["todo", "doing", "done"].forEach((status) => {
    const tasks = (groups[status] || []).sort(sortByPriority);
    paintList(status, tasks, onTaskClick);
  });
}

/**
 * Sort tasks by priority, high to low.
 */
function sortByPriority(a, b) {
  return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
}

/**
 * Render a single column's list.
 * @param {"todo"|"doing"|"done"} status
 * @param {Array<object>} tasks
 * @param {(id:string)=>void} onTaskClick
 */
function paintList(status, tasks, onTaskClick) {
  const list = document.getElementById(`${status}Tasks`);
  if (!list) return;

  list.innerHTML = "";

  tasks.forEach((task) => {
    const card = createTaskCard(task);
    if (typeof onTaskClick === "function") {
      card.addEventListener("click", () => onTaskClick(task.id));
    }
    list.appendChild(card);
  });
}

/**
 * Create a DOM node for a task.
 * @param {object} task
 * @returns {HTMLElement}
 */
function createTaskCard(task) {
  const article = document.createElement("article");
  article.className = "task-card";
  article.dataset.id = task.id;

  const priorityClass = `priority-${task.priority}`;
  const priorityLabel = task.priority.toUpperCase();

  article.innerHTML = `
    <div class="priority-badge ${priorityClass}">${priorityLabel}</div>
    <p class="task-card-title">${escapeHtml(task.title)}</p>
    <span class="task-card-desc">
      ${escapeHtml(task.desc || "No description")}
    </span>
  `;

  return article;
}

/**
 * Basic HTML escaping to prevent layout issues.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str = "") {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
