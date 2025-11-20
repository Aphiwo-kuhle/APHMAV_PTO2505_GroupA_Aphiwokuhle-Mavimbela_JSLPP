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
