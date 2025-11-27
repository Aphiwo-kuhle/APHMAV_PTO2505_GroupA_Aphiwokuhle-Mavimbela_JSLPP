/* ===============================
   SIDEBAR SHOW / HIDE LOGIC
================================ */

const sidebar = document.getElementById("sidebar");
const hideSidebarBtn = document.getElementById("hideSidebar");  // inside sidebar
const showSidebarBtn = document.getElementById("showSidebar");  // outside sidebar
const closeSidebarBtn = document.getElementById("closeSidebar"); // mobile only

/* ===============================
   DESKTOP: Hide Sidebar
================================ */
hideSidebarBtn.addEventListener("click", () => {
  sidebar.classList.add("hidden");      // slide out
  showSidebarBtn.classList.add("visible"); // show the 👁 button
});

/* ===============================
   DESKTOP: Show Sidebar
================================ */
showSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("hidden");   // slide back in
  showSidebarBtn.classList.remove("visible");
});

/* ===============================
   MOBILE: Open sidebar by tapping logo
================================ */
const logo = document.querySelector(".sidebar-logo");

logo.addEventListener("click", () => {
  // open only on mobile
  if (window.innerWidth <= 768) {
    sidebar.classList.remove("hidden");
  }
});

/* ===============================
   MOBILE: Close sidebar (X button)
================================ */
if (closeSidebarBtn) {
  closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.add("hidden");
  });
}

/* ===============================
   AUTO HANDLING WHEN RESIZING
================================ */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    // Desktop → sidebar always visible
    sidebar.classList.remove("hidden");
    showSidebarBtn.classList.remove("visible");
  } else {
    // Mobile → sidebar hidden by default
    sidebar.classList.add("hidden");
  }
});
// Sidebar wiring + content shift
function wireSidebar() {
  const sidebar = document.getElementById("sidebar");
  const hideBtn = document.getElementById("hideSidebar");
  const showBtn = document.getElementById("showSidebar");
  const mobileLogo = document.getElementById("mobileLogo");
  const closeMobile = document.getElementById("closeSidebar");
  const content = document.querySelector(".content");

  const openSidebar = () => {
    sidebar.classList.remove("hidden");
    if (showBtn) showBtn.classList.remove("visible");
    if (content) content.classList.add("with-sidebar");
  };
  const closeSidebar = () => {
    sidebar.classList.add("hidden");
    if (showBtn) showBtn.classList.add("visible");
    if (content) content.classList.remove("with-sidebar");
  };

  // initial state based on screen size
  if (window.innerWidth > 768) {
    openSidebar();
  } else {
    closeSidebar();
  }

  if (hideBtn) hideBtn.addEventListener("click", closeSidebar);
  if (showBtn) showBtn.addEventListener("click", openSidebar);

  if (mobileLogo) {
    mobileLogo.addEventListener("click", () => {
      if (window.innerWidth <= 768) openSidebar();
    });
  }
  if (closeMobile) closeMobile.addEventListener("click", closeSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) openSidebar();
    else closeSidebar();
  });
}
