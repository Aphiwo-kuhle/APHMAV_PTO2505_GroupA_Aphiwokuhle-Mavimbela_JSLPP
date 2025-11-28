// main.js
import { initTasks, addTask, updateTask, deleteTask, getTask } from "./storage.js";
import { renderBoard } from "./tasks.js";

const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarLogo = document.getElementById("sidebarLogo");

/* ===== DOM ELEMENTS ===== */
const sidebar = document.getElementById("sidebar");
const showSidebarBtn = document.getElementById("showSidebar");
const hideSidebarBtn = document.getElementById("hideSidebar");
const closeSidebarBtn = document.getElementById("closeSidebar");
const mobileLogo = document.getElementById("mobileLogo");
const content = document.getElementById("content");

const addTaskDesktop = document.getElementById("addTaskBtn");
const addTaskMobile = document.getElementById("addTaskMobile");

const modal = document.getElementById("taskModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");

const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescInput = document.getElementById("taskDescription");
const taskStatusSelect = document.getElementById("taskStatus");
const taskPrioritySelect = document.getElementById("taskPriority");
const deleteTaskBtn = document.getElementById("deleteTaskBtn");

const boardMessage = document.getElementById("boardMessage");
const themeToggle = document.getElementById("themeToggle");

let editingId = null;

/* =========================================================
   INITIAL BOOTSTRAP
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  setupSidebar();
  setupThemeToggle();
  setupModal();

  showMessage("Loading tasks…");

  let hadFetchError = false;
  try {
    await initTasks();
  } catch (err) {
    hadFetchError = true;
    showMessage("Could not load tasks from the server. Showing offline data instead.");
  }

  if (!hadFetchError) {
    clearMessage();
  }

  renderBoard(handleCardClick);
});

/* =========================================================
   SIDEBAR
========================================================= */

function setupSidebar() {
  // Desktop hide
  if (hideSidebarBtn) {
    hideSidebarBtn.addEventListener("click", () => {
      sidebar.classList.add("hidden");
      content.classList.add("no-sidebar");
      if (showSidebarBtn) {
        showSidebarBtn.classList.add("visible");
      }
    });
  }

  // Desktop show
  if (showSidebarBtn) {
    showSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("hidden");
      content.classList.remove("no-sidebar");
      showSidebarBtn.classList.remove("visible");
    });
  }

  // Helpers for mobile open/close
  const openMobileSidebar = () => {
    sidebar.classList.add("mobile-open");
    if (sidebarOverlay) {
      sidebarOverlay.classList.add("visible");
    }
    document.body.style.overflow = "hidden";
  };

  const closeMobileSidebar = () => {
    sidebar.classList.remove("mobile-open");
    if (sidebarOverlay) {
      sidebarOverlay.classList.remove("visible");
    }
    document.body.style.overflow = "";
  };

  // Mobile: open via logo
  if (mobileLogo) {
    mobileLogo.addEventListener("click", openMobileSidebar);
  }

  // Mobile: close via X button
  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", closeMobileSidebar);
  }

  // Mobile: close when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeMobileSidebar);
  }
}

/* =========================================================
   THEME TOGGLE
========================================================= */

const THEME_KEY = "kanban.theme";

function applyTheme(mode) {
  const dark = mode === "dark";

  // toggle body class
  document.body.classList.toggle("dark", dark);

  // sync checkbox
  if (themeToggle) {
    themeToggle.checked = dark;
  }

  // swap logo
  if (sidebarLogo) {
    sidebarLogo.src = dark ? "assets/logo-dark.svg" : "assets/logo-light.svg";
  }

  // remember
  localStorage.setItem(THEME_KEY, mode);
}

function setupThemeToggle() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      const mode = themeToggle.checked ? "dark" : "light";
      applyTheme(mode);
    });
  }
}

/* =========================================================
   MODAL + TASK CRUD
========================================================= */

function setupModal() {
  if (!taskForm || !modal) return;

  // Open modal in "add" mode
  if (addTaskDesktop) {
    addTaskDesktop.addEventListener("click", () => openModalForCreate());
  }
  if (addTaskMobile) {
    addTaskMobile.addEventListener("click", () => openModalForCreate());
  }

  // Close modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Submit form (create or update)
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = taskTitleInput.value.trim();
    const desc = taskDescInput.value.trim();
    const status = taskStatusSelect.value;
    const priority = taskPrioritySelect.value;

    if (!title) {
      alert("Please enter a task title.");
      taskTitleInput.focus();
      return;
    }

    if (!editingId) {
      addTask({ title, desc, status, priority });
    } else {
      updateTask(editingId, { title, desc, status, priority });
    }

    renderBoard(handleCardClick);
    closeModal();
  });

  // Delete button
  if (deleteTaskBtn) {
    deleteTaskBtn.addEventListener("click", () => {
      if (!editingId) return;
      const confirmed = window.confirm("Delete this task?");
      if (!confirmed) return;

      deleteTask(editingId);
      renderBoard(handleCardClick);
      closeModal();
    });
  }
}

/**
 * Open modal to create a new task.
 */
function openModalForCreate() {
  editingId = null;
  if (modalTitle) modalTitle.textContent = "Add Task";
  if (deleteTaskBtn) {
    deleteTaskBtn.classList.add("hidden");
  }

  taskIdInput.value = "";
  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskStatusSelect.value = "todo";
  taskPrioritySelect.value = "medium";

  openModal();
}

/**
 * Open modal to edit an existing task.
 * @param {string} id
 */
function openModalForEdit(id) {
  const task = getTask(id);
  if (!task) return;

  editingId = task.id;
  if (modalTitle) modalTitle.textContent = "Edit Task";

  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskDescInput.value = task.desc || "";
  taskStatusSelect.value = task.status || "todo";
  taskPrioritySelect.value = task.priority || "medium";

  if (deleteTaskBtn) {
    deleteTaskBtn.classList.remove("hidden");
  }
  openModal();
}

/**
 * Show modal.
 */
function openModal() {
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  setTimeout(() => taskTitleInput.focus(), 40);
}

/**
 * Close modal.
 */
function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
  taskForm.reset();
  editingId = null;
}

/**
 * Callback used by tasks.js when a card is clicked.
 * @param {string} id
 */
function handleCardClick(id) {
  openModalForEdit(id);
}

/* =========================================================
   MESSAGES
========================================================= */

function showMessage(text) {
  if (boardMessage) boardMessage.textContent = text;
}
function clearMessage() {
  showMessage("");
}

