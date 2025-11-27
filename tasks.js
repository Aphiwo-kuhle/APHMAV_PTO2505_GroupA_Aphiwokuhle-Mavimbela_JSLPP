// tasks.js
import { loadTasks } from "./storage.js";

/** Render whole board */
export function renderBoard() {
  const tasks = loadTasks();
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const todo = tasks.filter(t => t.status === "todo").sort(sortByPriority);
  const doing = tasks.filter(t => t.status === "doing").sort(sortByPriority);
  const done = tasks.filter(t => t.status === "done").sort(sortByPriority);

  paintList("todoList", todo);
  paintList("doingList", doing);
  paintList("doneList", done);

  setCount("todoCount", todo.length);
  setCount("doingCount", doing.length);
  setCount("doneCount", done.length);

  function sortByPriority(a, b) {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  }
}

function setCount(id, count) {
  const el = document.getElementById(id);
  if (el) el.textContent = count;
}

function paintList(id, tasks) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = "";
  tasks.forEach(t => list.appendChild(taskCard(t)));
}

function taskCard(task) {
  const el = document.createElement("article");
  el.className = "task-card";
  el.dataset.id = task.id;

  const priorityClass = `priority-${task.priority}`;
  const priorityLabel = task.priority.toUpperCase();

  el.innerHTML = `
    <p>${escapeHtml(task.title)}</p>
    <span>${escapeHtml(task.desc)}</span>
    <div class="priority-badge ${priorityClass}">${priorityLabel}</div>
  `;

  return el;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
// =========================
// tasks.js
// Handles: create task, render tasks, load tasks
// =========================

import { getTasks, saveTasks } from "./storage.js";

// DOM references
const modal = document.getElementById("taskModal");
const form = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDescription");
const taskStatus = document.getElementById("taskStatus");

const colTodo = document.getElementBy
