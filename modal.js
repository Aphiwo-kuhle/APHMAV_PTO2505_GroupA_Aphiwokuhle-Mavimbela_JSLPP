// modal.js
import { addTask, updateTask, deleteTask as storageDeleteTask, getTask } from "./storage.js";
import { renderBoard } from "./tasks.js";

let $modal, $form, $title, $desc, $status, $priority, $idHidden;
let $primaryAction, $editAction, $deleteAction, $closeBtn;

const FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initModal() {
  // lazy-init elements
  $modal = document.getElementById("modal");
  $form = document.getElementById("taskForm");
  $title = document.getElementById("title");
  $desc = document.getElementById("desc");
  $status = document.getElementById("status");
  $priority = document.getElementById("priority");
  $idHidden = document.getElementById("taskId");

  $primaryAction = document.getElementById("primaryAction");
  $editAction = document.getElementById("editAction");
  $deleteAction = document.getElementById("deleteAction");
  $closeBtn = document.getElementById("closeModal");

  if (!$modal || !$form) {
    console.warn("modal.js: missing #modal or #taskForm in DOM");
    return;
  }

  // close handlers
  if ($closeBtn) $closeBtn.addEventListener("click", hideModal);
  $modal.addEventListener("click", (e) => { if (e.target === $modal) hideModal(); });

  // ESC and focus trap
  document.addEventListener("keydown", (e) => {
    if (!$modal || $modal.classList.contains("hidden")) return;
    if (e.key === "Escape") hideModal();
    if (e.key === "Tab") maintainFocus(e);
  });

  // form submit: create or update
  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    // defensive lookups
    const id = $idHidden ? $idHidden.value.trim() : "";
    const title = $title ? $title.value.trim() : "";
    const desc = $desc ? $desc.value.trim() : "";
    const status = $status ? $status.value : "todo";
    const priority = $priority ? $priority.value : "low";

    console.log("[modal] submit:", { id, title, desc, status, priority });

    if (!title) {
      alert("Please enter a title.");
      if ($title) $title.focus();
      return;
    }

    try {
      if (!id) {
        // create
        addTask({ title, desc, status, priority });
        console.log("[modal] Task created");
      } else {
        // update
        updateTask(id, { title, desc, status, priority });
        console.log("[modal] Task updated:", id);
      }
      renderBoard();
      hideModal();
    } catch (err) {
      console.error("[modal] Error saving task:", err);
      alert("There was an error saving the task. See console for details.");
    }
  });

  // edit / delete
  if ($editAction) $editAction.addEventListener("click", () => setEditMode(true));
  if ($deleteAction) $deleteAction.addEventListener("click", () => {
    const id = $idHidden ? $idHidden.value : "";
    if (!id) return;
    if (confirm("Delete this task?")) {
      storageDeleteTask(id);
      renderBoard();
      hideModal();
    }
  });

  hideModal();
}

export function openCreateModal() {
  if (!$modal) initModal();

  if (!$modal) return console.error("modal: #modal not found");

  // reset
  if ($idHidden) $idHidden.value = "";
  if ($title) $title.value = "";
  if ($desc) $desc.value = "";
  if ($status) $status.value = "todo";
  if ($priority) $priority.value = "low";

  setEditMode(true);
  if ($editAction) $editAction.classList.add("hidden");
  if ($deleteAction) $deleteAction.classList.add("hidden");
  if ($primaryAction) $primaryAction.textContent = "Create Task";

  showModal();
  setTimeout(() => { if ($title) $title.focus(); }, 60);
}

export function openViewModal(taskId) {
  if (!$modal) initModal();
  const t = getTask(taskId);
  if (!t) return alert("Task not found");

  if ($idHidden) $idHidden.value = t.id;
  if ($title) $title.value = t.title;
  if ($desc) $desc.value = t.desc || "";
  if ($status) $status.value = t.status || "todo";
  if ($priority) $priority.value = t.priority || "low";

  setEditMode(false);
  if ($primaryAction) $primaryAction.textContent = "Close";
  if ($editAction) $editAction.classList.remove("hidden");
  if ($deleteAction) $deleteAction.classList.remove("hidden");

  showModal();
  setTimeout(() => { if ($editAction) $editAction.focus(); }, 60);
}

function showModal() {
  $modal.classList.remove("hidden");
  $modal.classList.add("visible");
  $modal.setAttribute("aria-hidden", "false");
  disablePageScroll();
  $modal._previouslyFocused = document.activeElement;
  focusFirstElement();
}

function hideModal() {
  if (!$modal) return;
  $modal.classList.add("hidden");
  $modal.classList.remove("visible");
  $modal.setAttribute("aria-hidden", "true");
  enablePageScroll();
  // restore focus
  if ($modal._previouslyFocused) $modal._previouslyFocused.focus();
  if ($form) $form.reset();
  if ($idHidden) $idHidden.value = "";
  setEditMode(true);
}

function setEditMode(enabled) {
  [$title, $desc, $status, $priority].forEach(el => { if (!el) return; el.disabled = !enabled; });
  if ($primaryAction) $primaryAction.textContent = enabled ? ($idHidden && $idHidden.value ? "Save Task" : "Create Task") : "Close";
}

/* focus helpers */
function focusFirstElement() {
  const focusable = [...$modal.querySelectorAll(FOCUSABLE_SELECTORS)].filter(el => el.offsetParent !== null);
  if (focusable.length) focusable[0].focus();
  $modal._focusable = focusable;
}

function maintainFocus(e) {
  if (!$modal || $modal.classList.contains("hidden")) return;
  const focusable = $modal._focusable || [...$modal.querySelectorAll(FOCUSABLE_SELECTORS)].filter(el => el.offsetParent !== null);
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (!first) return;
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* disable/enable page scroll while modal is open */
function disablePageScroll() { document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden"; }
function enablePageScroll() { document.documentElement.style.overflow = ""; document.body.style.overflow = ""; }

export default { initModal, openCreateModal, openViewModal };

