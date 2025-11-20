// modal.js
import { addTask, updateTask, deleteTask, getTask } from "./data.js";
import { renderBoard } from "./tasks.js";

let $modal, $form, $title, $desc, $status, $idHidden, $priority;
let $btnPrimary, $btnEdit, $btnDelete;

let mode = "create"; // "create", "view", "edit"

export function initModal() {
  $modal = document.getElementById("modal");
  $form = document.getElementById("taskForm");
  $title = document.getElementById("title");
  $desc = document.getElementById("desc");
  $status = document.getElementById("status");
  $idHidden = document.getElementById("taskId");

  // Create priority select dynamically if not exists
  // We inject a priority select after status if not present
  if (!document.getElementById("priority")) {
    const statusLabel = $status.parentElement.querySelector('label[for="status"]');
    const priorityLabel = document.createElement("label");
    priorityLabel.setAttribute("for", "priority");
    priorityLabel.textContent = "Priority";
    $status.parentElement.insertBefore(priorityLabel, $status.nextSibling);

    const select = document.createElement("select");
    select.id = "priority";
    select.name = "priority";
    select.innerHTML = `
      <option value="High">High</option>
      <option value="Medium" selected>Medium</option>
      <option value="Low">Low</option>
    `;
    statusLabel.parentElement.insertBefore(select, priorityLabel.nextSibling);
  }
  $priority = document.getElementById("priority");

  $btnPrimary = document.getElementById("primaryAction");
  $btnEdit = document.getElementById("editAction");
  $btnDelete = document.getElementById("deleteAction");

  document.getElementById("closeModal").onclick = hideModal;
  $modal.onclick = (e) => { if (e.target === $modal) hideModal(); };

  // Primary button behavior (create/save/close)
  $btnPrimary.type = "button";
  $btnPrimary.onclick = () => {
    if (mode === "create") {
      doCreate();
    } else if (mode === "edit") {
      doSave();
    } else {
      hideModal();
    }
  };

  $btnEdit.onclick = () => {
    setMode("edit");
  };

  $btnDelete.onclick = () => {
    if (!confirm("Are you sure you want to delete this task? This cannot be undone.")) return;
    const id = $idHidden.value;
    if (id) {
      deleteTask(id);
      renderBoard();
      hideModal();
    }
  };
}

/** Open modal in create mode */
export function openCreateModal() {
  setMode("create");
  $idHidden.value = "";
  $title.value = "";
  $desc.value = "";
  $status.value = "todo";
  $priority.value = "Medium";
  showModal();
}

/** Open modal to view an existing task */
export function openViewModal(taskId) {
  const t = getTask(taskId);
  if (!t) return;

  $idHidden.value = t.id;
  $title.value = t.title || "";
  $desc.value = t.desc || "";
  $status.value = t.status || "todo";
  $priority.value = t.priority || "Medium";

  setMode("view");
  showModal();
}

function showModal() {
  $modal.classList.remove("hidden");
}

function hideModal() {
  $modal.classList.add("hidden");
}

/** Set mode and adjust controls */
function setMode(m) {
  mode = m;
  if (mode === "create") {
    $title.disabled = false;
    $desc.disabled = false;
    $status.disabled = false;
    $priority.disabled = false;
    $btnPrimary.textContent = "Create Task";
    $btnEdit.style.display = "none";
    $btnDelete.style.display = "none";
  } else if (mode === "view") {
    $title.disabled = true;
    $desc.disabled = true;
    $status.disabled = true;
    $priority.disabled = true;
    $btnPrimary.textContent = "Close";
    $btnEdit.style.display = "inline-block";
    $btnDelete.style.display = "inline-block";
  } else if (mode === "edit") {
    $title.disabled = false;
    $desc.disabled = false;
    $status.disabled = false;
    $priority.disabled = false;
    $btnPrimary.textContent = "Save Task";
    $btnEdit.style.display = "none";
    $btnDelete.style.display = "inline-block";
  }
}

/** Create new task using form values */
function doCreate() {
  const title = $title.value.trim();
  const desc = $desc.value.trim();
  const status = $status.value;
  const priority = $priority.value;

  if (!title) return alert("Title is required");

  addTask({ title, desc, status, priority });
  renderBoard();
  hideModal();
}

/** Save edited task */
function doSave() {
  const id = $idHidden.value;
  if (!id) return;
  const title = $title.value.trim();
  const desc = $desc.value.trim();
  const status = $status.value;
  const priority = $priority.value;

  if (!title) return alert("Title is required");
  updateTask(id, { title, desc, status, priority });
  renderBoard();
  setMode("view");
  hideModal();
}
/* Priority badges */
.priority-badge {
  display: inline-block;
  padding: 6px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  text-transform: capitalize;
  letter-spacing: 0.2px;
  min-width: 52px;
  text-align: center;
}

/* Colors for badges */
.priority-badge.high { background: #ff6b6b; }   /* red-ish */
.priority-badge.medium { background: #f9a825; } /* amber */
.priority-badge.low { background: #6acb8d; }    /* green */
