/* =========================================================
   utils.js — FINAL VERSION (UI LEVEL 3 + CORE FUNCTIONS)
   ========================================================= */

/* ---------- DARK MODE HANDLER ---------- */
const body = document.body;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
}

// Dark mode toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleDark");
  if (toggle) {
    toggle.onclick = () => {
      body.classList.toggle("dark");
      localStorage.setItem(
        "theme",
        body.classList.contains("dark") ? "dark" : "light"
      );
    };
  }
});

/* ---------- TOAST NOTIFICATION ---------- */
function toast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;

  t.textContent = msg;
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2000);
}

/* ---------- RIPPLE BUTTON EFFECT ---------- */
document.addEventListener("click", e => {
  if (e.target.classList.contains("btn")) {
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;
    e.target.style.setProperty("--x", x + "px");
    e.target.style.setProperty("--y", y + "px");
  }
});

/* ---------- AUTO ACTIVE SIDEBAR MENU ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar a");
  const current = location.pathname.split("/").pop();

  links.forEach(a => {
    if (a.getAttribute("href") === current) {
      a.classList.add("active");
    }
  });
});

/* ---------- MODAL HANDLER ---------- */
function openModal(id = "modalBox") {
  document.getElementById(id)?.classList.add("show");
}

function closeModal(id = "modalBox") {
  document.getElementById(id)?.classList.remove("show");
}

/* ---------- SIMPLE DATE FORMAT ---------- */
function formatDate(d) {
  return new Date(d).toISOString().split("T")[0];
}

/* ---------- AUTONUMBER FORMAT ---------- */
function num(n) {
  return Number(n || 0).toLocaleString("id-ID");
}
