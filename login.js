document.addEventListener("DOMContentLoaded", () => {
  // Jika sudah login → langsung masuk
  if (DataStore.getLoginUser()) {
    location.href = "dashboard.html";
  }
});

function doLogin() {
  const u = document.getElementById("u").value.trim();
  const p = document.getElementById("p").value.trim();

  if (!u || !p) {
    document.getElementById("msg").textContent = "Isi semua data!";
    return;
  }

  const ok = DataStore.login(u, p);

  if (!ok) {
    document.getElementById("msg").textContent = "Username / password salah!";
    return;
  }

  location.href = "dashboard.html";
}
