// main.js
import { initModal, openCreateModal, openViewModal } from "./modal.js";
import { renderBoard } from "./tasks.js";
import { fetchInitialTasks, seedTasks, loadTasks } from "./data.js";

async function init() {
  initModal();

  // Show a simple loading indicator in the heading area
  showLoading(true);

  // Try to fetch tasks from API. If failed, keep existing localStorage or seed.
  const res = await fetchInitialTasks().catch(() => ({ success:false }));
  if (!res.success) {
    // If no tasks in storage, seed defaults
    if (loadTasks().length === 0) {
      seedTasks();
    }
  }

  showLoading(false);

  renderBoard();

  // Bind add buttons
  document.getElementById("addTaskTopRight").onclick = openCreateModal;
  document.getElementById("addTaskMobile").onclick = openCreateModal;
  const fab = document.getElementById("addTaskFab");
  if (fab) fab.onclick = openCreateModal;

  // Click on card to open view modal
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".task");
    if (card) openViewModal(card.dataset.id);
  });

  setupThemeToggle();
  setupSidebarToggle();
}

document.addEventListener("DOMContentLoaded", init);

/* Loading visual (simple) */
function showLoading(on = true) {
  // Create or remove small loading overlay
  let el = document.getElementById("appLoading");
  if (!el && on) {
    el = document.createElement("div");
    el.id = "appLoading";
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.right = "0";
    el.style.background = "rgba(0,0,0,0.05)";
    el.style.textAlign = "center";
    el.style.padding = "8px 0";
    el.style.zIndex = "2000";
    el.textContent = "Loading tasks...";
    document.body.appendChild(el);
  } else if (el && !on) {
    el.remove();
  }
}

/* Theme toggle setup */
function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  // Load previous theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (themeToggle) themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark");
    if (themeToggle) themeToggle.checked = false;
  }

  if (!themeToggle) return;
  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
}

/* Sidebar toggle (mobile) */
function setupSidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  if (!sidebar || !sidebarToggle) return;
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}
document.querySelectorAll('.sidebar-icon').forEach(icon => {
  icon.addEventListener('click', () => {
    document.querySelector('.sidebar-icon.active')?.classList.remove('active');
    icon.classList.add('active');
  });
});
document.querySelectorAll('.add-task-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const status = btn.dataset.status;
    openModal(status);
  });
});
function renderTasks() {
  const todoCol = document.getElementById("todo-column");
  const doingCol = document.getElementById("doing-column");
  const doneCol = document.getElementById("done-column");

  todoCol.innerHTML = "";
  doingCol.innerHTML = "";
  doneCol.innerHTML = "";

  tasks.forEach(task => {
    const card = createTaskCard(task);

    if (task.status === "todo") todoCol.appendChild(card);
    else if (task.status === "doing") doingCol.appendChild(card);
    else if (task.status === "done") doneCol.appendChild(card);
  });
}
let editingTask = null;

export function openModal(status, task = null) {
  const modal = document.getElementById("task-modal");
  const overlay = document.getElementById("modal-overlay");

  modal.classList.add("show");
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  document.getElementById("modal-status-input").value = status;

  if (task) {
    editingTask = task;
    document.getElementById("modal-title").textContent = "Edit Task";
    document.getElementById("modal-title-input").value = task.title;
    document.getElementById("modal-desc-input").value = task.description;
    document.getElementById("delete-task-btn").classList.remove("hidden");

    setPriority(task.priority);
  } else {
    editingTask = null;
    document.getElementById("modal-title").textContent = "Add Task";
    document.getElementById("modal-title-input").value = "";
    document.getElementById("modal-desc-input").value = "";
    document.getElementById("delete-task-btn").classList.add("hidden");

    setPriority(null);
  }
}

export function closeModal() {
  document.getElementById("task-modal").classList.add("hidden");
  document.getElementById("modal-overlay").classList.add("hidden");
}

/* Priority Selector */
document.querySelectorAll(".priority-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    setPriority(btn.dataset.value);
  });
});

function setPriority(value) {
  document.querySelectorAll(".priority-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.value === value) {
      btn.classList.add("active");
    }
  });
}

/* SAVE TASK */
document.getElementById("save-btn").addEventListener("click", () => {
  const title = document.getElementById("modal-title-input").value;
  const desc  = document.getElementById("modal-desc-input").value;
  const status = document.getElementById("modal-status-input").value;
  const priority = document.querySelector(".priority-btn.active")?.dataset.value;

  if (!title || !priority) return alert("Please fill all fields");

  if (editingTask) {
    editingTask.title = title;
    editingTask.description = desc;
    editingTask.status = status;
    editingTask.priority = priority;
  } else {
    tasks.push({
      id: crypto.randomUUID(),
      title,
      description: desc,
      status,
      priority
    });
  }

  saveTasks();
  renderTasks();
  closeModal();
});

/* DELETE TASK */
document.getElementById("delete-task-btn").addEventListener("click", () => {
  if (!editingTask) return;

  tasks = tasks.filter(t => t.id !== editingTask.id);

  saveTasks();
  renderTasks();
  closeModal();
});

/* CANCEL BUTTON */
document.getElementById("cancel-btn").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", closeModal);
