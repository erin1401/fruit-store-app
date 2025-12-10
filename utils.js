/* =========================================================
   utils.js — Juragan Buah
   Utility global untuk modal, toast, storage, login,
   formatting, popup confirm, dsb.
   ========================================================= */

/* ======================
   FORMAT ANGGKA & TANGGAL
   ====================== */
function nf(num) {
  return Number(num).toLocaleString("id-ID");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function val(id) {
  return document.getElementById(id).value.trim();
}

/* ======================
   LOCAL STORAGE SAFE GET/SET
   ====================== */
function setStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStore(key, defaultValue = []) {
  let d = localStorage.getItem(key);
  if (!d) return defaultValue;
  try {
    return JSON.parse(d);
  } catch (e) {
    return defaultValue;
  }
}

/* ======================
   LOGIN HANDLING
   ====================== */
function checkLogin() {
  const user = getStore("loginUser", null);
  if (!user) {
    window.location = "login.html";
    return;
  }

  const box = document.getElementById("userBox");
  if (box) {
    box.innerHTML = `
      <div class="user-info">
        <span>${user.username} (${user.role})</span>
        <button class="btn btn-danger" onclick="logout()">Logout</button>
      </div>
    `;
  }
}

function logout() {
  localStorage.removeItem("loginUser");
  window.location = "login.html";
}

/* ======================
   SIDEBAR ACTIVE LINK
   ====================== */
function activateSidebarLinks() {
  const links = document.querySelectorAll(".sidebar a");
  const here = window.location.pathname.split("/").pop();

  links.forEach(a => {
    if (a.getAttribute("href") === here) {
      a.classList.add("active");
    }
  });
}

/* ======================
   TOAST NOTIFICATION
   ====================== */
let toastTimer = null;

function toast(msg) {
  const t = document.getElementById("globalToast");
  t.innerText = msg;
  t.style.display = "block";
  t.style.opacity = "1";

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    t.style.opacity = "0";
    setTimeout(() => t.style.display = "none", 400);
  }, 2000);
}

/* ======================
   MODAL SYSTEM
   ====================== */
function openModal(html) {
  const bg = document.getElementById("globalModal");
  const box = document.getElementById("globalModalBox");

  box.innerHTML = html;
  bg.style.display = "flex";
}

function closeModal() {
  const bg = document.getElementById("globalModal");
  bg.style.display = "none";
}

/* ======================
   CONFIRM BOX
   ====================== */
function confirmBox(msg, yesFunc) {
  openModal(`
    <h3>Konfirmasi</h3>
    <p>${msg}</p>

    <div style="text-align:right;margin-top:12px;">
      <button class="btn btn-success" id="yesConfirm">Ya</button>
      <button class="btn btn-danger" onclick="closeModal()">Tidak</button>
    </div>
  `);

  document.getElementById("yesConfirm").onclick = () => {
    closeModal();
    yesFunc();
  };
}

/* ======================
   PRINT STRUK
   ====================== */
function printStruk(htmlContent) {
  const w = window.open("", "_blank");
  w.document.write(`
    <html>
      <head>
        <title>Struk Penjualan</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          td, th { border: 1px solid #333; padding: 6px; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

/* ======================
   RANDOM ID
   ====================== */
function rid() {
  return "ID-" + Math.random().toString(36).substring(2, 10);
}

/* ======================
   EXPORT KE GLOBAL
   ====================== */
window.nf = nf;
window.val = val;
window.setStore = setStore;
window.getStore = getStore;
window.openModal = openModal;
window.closeModal = closeModal;
window.confirmBox = confirmBox;
window.toast = toast;
window.printStruk = printStruk;
window.rid = rid;
window.checkLogin = checkLogin;
window.activateSidebarLinks = activateSidebarLinks;
window.logout = logout;
