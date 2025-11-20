// main.js
import { initModal, openCreateModal, openViewModal } from "./modal.js";
import { renderBoard } from "./tasks.js";

function init() {
  initModal();
  renderBoard();

  document.getElementById("addTaskTopRight").onclick = openCreateModal;
  document.getElementById("addTaskMobile").onclick = openCreateModal;
  document.getElementById("addTaskFab").onclick = openCreateModal;

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".task");
    if (card) openViewModal(card.dataset.id);
  });
}

document.addEventListener("DOMContentLoaded", init);
 // ========== THEME TOGGLE ==========
const themeToggle = document.getElementById("themeToggle");

// Load previous theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.checked = true;
}

// Listen for toggle
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});
// ========== SIDEBAR TOGGLE ==========
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});
