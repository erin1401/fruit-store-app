/* =========================================================
   login.js — Juragan Buah
   Login Stabil + Fix localStorage Path GitHub Pages
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Jika sudah login → langsung masuk dashboard
  if (DataStore.getLoginUser()) {
    location.href = "dashboard.html";
  }
});

function doLogin() {
  const u = document.getElementById("u").value.trim();
  const p = document.getElementById("p").value.trim();

  if (!u || !p) {
    document.getElementById("msg").textContent = "Isi semua field!";
    return;
  }

  const ok = DataStore.login(u, p);

  if (!ok) {
    document.getElementById("msg").textContent = "Username atau password salah!";
    return;
  }

  // Login berhasil → arahkan dashboard
  location.href = "dashboard.html";
}
