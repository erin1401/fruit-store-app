/* =========================================================
   utils.js — Helper Functions Global Aplikasi
   ========================================================= */

/* -------------------------------
   LocalStorage Wrapper
   ------------------------------- */
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("saveJSON error:", e);
    return false;
  }
}

function loadJSON(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error("loadJSON error:", e);
    return fallback;
  }
}

/* -------------------------------
   ID Generator (unik + timestamp)
   ------------------------------- */
function generateID(prefix = "") {
  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).substr(2, 6)
  );
}

/* -------------------------------
   Format Rupiah
   ------------------------------- */
function formatRupiah(num) {
  if (num === null || num === undefined || isNaN(num)) return "Rp 0";
  return (
    "Rp " +
    parseInt(num, 10)
      .toLocaleString("id-ID")
  );
}

/* -------------------------------
   Format Tanggal
   ------------------------------- */
function formatTanggal(date = new Date()) {
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
}

function formatTanggalJam(date = new Date()) {
  try {
    return new Date(date).toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

/* -------------------------------
   Toast Notification (mini-alert)
   ------------------------------- */
function showToast(message, type = "success") {
  let bg = "#2ecc71"; // success
  if (type === "error") bg = "#e74c3c";
  if (type === "warn") bg = "#f39c12";

  const div = document.createElement("div");
  div.className = "toast";
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bg};
    color: #fff;
    padding: 12px 18px;
    border-radius: 6px;
    z-index: 99999;
    font-size: 15px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
    opacity: 0;
    transition: .3s;
  `;
  div.innerText = message;

  document.body.appendChild(div);

  setTimeout(() => (div.style.opacity = 1), 50);
  setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => div.remove(), 300);
  }, 2500);
}

/* -------------------------------
   Confirm Box Modern
   ------------------------------- */
async function askConfirm(text = "Yakin?") {
  return new Promise((resolve) => {
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      position: fixed;
      top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.4);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index: 999999;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      background:#fff;
      padding:25px;
      border-radius:8px;
      width:300px;
      text-align:center;
      font-size:16px;
    `;
    box.innerHTML = `
      <p>${text}</p>
      <div style="margin-top:18px;display:flex;gap:10px;justify-content:center">
        <button id="yes" class="btn" style="background:#2ecc71;">Ya</button>
        <button id="no" class="btn btn-danger">Tidak</button>
      </div>
    `;

    wrap.appendChild(box);
    document.body.appendChild(wrap);

    box.querySelector("#yes").onclick = () => {
      wrap.remove();
      resolve(true);
    };
    box.querySelector("#no").onclick = () => {
      wrap.remove();
      resolve(false);
    };
  });
}

/* -------------------------------
   Dark Mode Controller
   ------------------------------- */
function initDarkMode() {
  const saved = localStorage.getItem("darkMode");
  if (saved === "on") document.body.classList.add("dark");

  const toggle = document.querySelector(".dark-toggle");
  if (!toggle) return;

  toggle.checked = saved === "on";

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "on");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "off");
    }
  });
}

/* -------------------------------
   Query Helper (alias mini jQuery)
   ------------------------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* -------------------------------
   URL Parameter Reader
   ------------------------------- */
function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

/* -------------------------------
   Export CSV
   ------------------------------- */
function exportCSV(filename, rows) {
  if (!rows || !rows.length) return showToast("Data kosong", "warn");

  const csv = rows
    .map((r) =>
      r
        .map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/* -------------------------------
   Prevent Enter Submit
   ------------------------------- */
function disableEnterSubmit(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;
  form.addEventListener("keypress", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
}

/* -------------------------------
   Page Redirect (with check)
   ------------------------------- */
function go(url) {
  window.location.href = url;
}
