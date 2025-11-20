// modal.js
import { addTask, updateTask, deleteTask, getTask } from "./data.js";
import { renderBoard } from "./tasks.js";

let $modal, $form, $title, $desc, $status, $idHidden;
let $btnCreate, $btnEdit, $btnDelete;

export function initModal() {
  $modal = document.getElementById("modal");
  $form = document.getElementById("taskForm");
  $title = document.getElementById("title");
  $desc = document.getElementById("desc");
  $status = document.getElementById("status");
  $idHidden = document.getElementById("taskId");

  $btnCreate = document.getElementById("primaryAction");
  $btnEdit = document.getElementById("editAction");
  $btnDelete = document.getElementById("deleteAction");

  document.getElementById("closeModal").onclick = hideModal;
  $modal.onclick = (e) => { if (e.target === $modal) hideModal(); };

  // CREATE or SAVE
  $form.onsubmit = (e) => {
    e.preventDefault();

    const id = $idHidden.value.trim();
    const title = $title.value.trim();
    const desc = $desc.value.trim();
    const status = $status.value;

    if (!title) return alert("Title required!");

    if (!id) {
      addTask({ title, desc, status });
    } else {
      updateTask(id, { title, desc, status });
    }

    renderBoard();
    hideModal();
  };

  // ENTER EDIT MODE
  $btnEdit.onclick = () => setEditMode(true);

  // DELETE TASK
  $btnDelete.onclick = () => {
    const id = $idHidden.value;
    deleteTask(id);
    renderBoard();
    hideModal();
  };
}

export function openCreateModal() {
  setEditMode(true);
  $idHidden.value = "";
  $title.value = "";
  $desc.value = "";
  $status.value = "todo";
  $btnCreate.textContent = "Create Task";
  $btnEdit.style.display = "none";
  $btnDelete.style.display = "none";
  showModal();
}

export function openViewModal(taskId) {
  const t = getTask(taskId);
  if (!t) return;

  setEditMode(false);
  $idHidden.value = t.id;
  $title.value = t.title;
  $desc.value = t.desc;
  $status.value = t.status;

  $btnCreate.textContent = "Close";
  $btnEdit.style.display = "inline-block";
  $btnDelete.style.display = "inline-block";

  showModal();
}

function showModal() {
  $modal.classList.remove("hidden");
}

function hideModal() {
  $modal.classList.add("hidden");
}

function setEditMode(enabled) {
  [$title, $desc, $status].forEach(f => {
    f.disabled = !enabled;
  });
  $btnCreate.textContent = enabled ? "Save Task" : "Close";
}
// ================== MODAL HANDLING ==================

export function setupModal(openBtn, closeBtn, modal, form, onSubmit) {
  
  // Open modal
  openBtn.addEventListener("click", () => {
    modal.classList.add("open");
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    form.reset();
  });

  // Submit form
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = form.querySelector("#task-title").value.trim();
    const description = form.querySelector("#task-desc").value.trim();

    if (title === "") return;

    // Send data to main.js
    onSubmit({
      id: Date.now(),
      title,
      description,
      status: "todo",
    });

    // Close modal and clear form
    modal.classList.remove("open");
    form.reset();
  });
}

