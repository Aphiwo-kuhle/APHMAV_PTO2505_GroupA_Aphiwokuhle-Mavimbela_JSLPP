/* =========================================================
   SELECT ELEMENTS
========================================================= */
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

const taskForm = document.getElementById("taskForm");

const themeToggle = document.getElementById("themeToggle");

const todoColumn = document.getElementById("todoTasks");
const doingColumn = document.getElementById("doingTasks");
const doneColumn = document.getElementById("doneTasks");

/* For Edit / Delete */
let editingTask = null;


/* =========================================================
   SIDEBAR — DESKTOP
========================================================= */
hideSidebarBtn.addEventListener("click", () => {
  sidebar.classList.add("hidden");
  showSidebarBtn.classList.add("visible");
  content.classList.remove("with-sidebar");
});

showSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("hidden");
  showSidebarBtn.classList.remove("visible");
  content.classList.add("with-sidebar");
});


/* =========================================================
   SIDEBAR — MOBILE
========================================================= */
mobileLogo.addEventListener("click", () => {
  sidebar.classList.add("mobile-open");
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("mobile-open");
});


/* =========================================================
   THEME TOGGLE
========================================================= */
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});


/* =========================================================
   OPEN MODAL (ADD MODE)
========================================================= */
function openAddModal() {
  editingTask = null;

  document.getElementById("modalTitle").textContent = "Add Task";
  document.getElementById("deleteTaskBtn").classList.add("hidden");

  taskForm.reset();
  modal.classList.remove("hidden");
}

addTaskDesktop.addEventListener("click", openAddModal);
addTaskMobile.addEventListener("click", openAddModal);


/* =========================================================
   CLOSE MODAL
========================================================= */
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});


/* =========================================================
   CREATE OR EDIT TASK (SUBMIT)
========================================================= */
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const status = document.getElementById("taskStatus").value;
  const priority = document.getElementById("taskPriority").value;

  if (!title) return;

  if (editingTask) {
    updateTask(editingTask, title, description, status, priority);
  } else {
    createTaskCard(title, description, status, priority);
  }

  modal.classList.add("hidden");
});


/* =========================================================
   CREATE TASK CARD
========================================================= */
function createTaskCard(title, description, status, priority) {
  const card = document.createElement("div");
  card.classList.add("task-card");

  card.innerHTML = `
    <div class="priority-badge priority-${priority}">${priority.toUpperCase()}</div>
    <p class="task-title">${title}</p>
    <span class="task-desc">${description || "No description"}</span>
  `;

  card.addEventListener("click", () => openEditModal(card));

  appendToColumn(card, status);
}


/* =========================================================
   MOVE TASK TO CORRECT COLUMN
========================================================= */
function appendToColumn(card, status) {
  if (status === "todo") todoColumn.appendChild(card);
  if (status === "doing") doingColumn.appendChild(card);
  if (status === "done") doneColumn.appendChild(card);
}


/* =========================================================
   OPEN EDIT MODE
========================================================= */
function openEditModal(card) {
  editingTask = card;

  const title = card.querySelector(".task-title").textContent;
  const description = card.querySelector(".task-desc").textContent;
  const priority = card.querySelector(".priority-badge").textContent.toLowerCase();

  document.getElementById("modalTitle").textContent = "Edit Task";
  document.getElementById("taskTitle").value = title;
  document.getElementById("taskDescription").value = description;
  document.getElementById("taskPriority").value = priority;

  // detect current column
  if (todoColumn.contains(card)) document.getElementById("taskStatus").value = "todo";
  if (doingColumn.contains(card)) document.getElementById("taskStatus").value = "doing";
  if (doneColumn.contains(card)) document.getElementById("taskStatus").value = "done";

  document.getElementById("deleteTaskBtn").classList.remove("hidden");

  modal.classList.remove("hidden");
}


/* =========================================================
   UPDATE EXISTING TASK
========================================================= */
function updateTask(card, title, description, status, priority) {
  card.querySelector(".task-title").textContent = title;
  card.querySelector(".task-desc").textContent = description || "No description";

  const badge = card.querySelector(".priority-badge");
  badge.textContent = priority.toUpperCase();
  badge.className = `priority-badge priority-${priority}`;

  appendToColumn(card, status);
}


/* =========================================================
   DELETE TASK
========================================================= */
document.getElementById("deleteTaskBtn").addEventListener("click", () => {
  if (editingTask) editingTask.remove();
  modal.classList.add("hidden");
});
