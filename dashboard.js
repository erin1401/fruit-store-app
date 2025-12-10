/* =========================================================
   dashboard.js — Juragan Buah
   Dashboard Analytics + Chart
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  
  // Tampilkan nama user di UI
  const user = DataStore.getLoginUser();
  if (user) {
    document.getElementById("uName").textContent = user.username + " (" + user.role + ")";
  }

  // Load analytics
  loadSummary();
  loadChart();
});


/* =========================================================
   SUMMARY STAT
   ========================================================= */

function loadSummary() {
  const items = DataStore.getItems();
  const buyers = DataStore.getBuyers();
  const sales = DataStore.getSales();

  document.getElementById("totalItems").textContent = items.length + " Item";
  document.getElementById("totalBuyers").textContent = buyers.length + " Pembeli";
  document.getElementById("totalSales").textContent = sales.length + " Transaksi";
}


/* =========================================================
   CHART: Grafik Total Penjualan per Hari
   ========================================================= */

function loadChart() {
  const sales = DataStore.getSales();

  if (!sales || sales.length === 0) {
    drawEmptyChart();
    return;
  }

  // Kelompokkan penjualan berdasarkan tanggal
  const map = {};

  sales.forEach(s => {
    const d = s.date;
    if (!map[d]) map[d] = 0;
    map[d] += s.total;
  });

  const labels = Object.keys(map).sort();
  const values = labels.map(d => map[d]);

  const ctx = document.getElementById("salesChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Total Penjualan (Rp)",
        data: values,
        borderColor: "#0a7a32",
        backgroundColor: "rgba(10,122,50,0.25)",
        borderWidth: 2,
        fill: true,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: { callback: v => "Rp " + v.toLocaleString() }
        }
      }
    }
  });
}


/* =========================================================
   CHART KOSONG (jika belum ada penjualan)
   ========================================================= */

function drawEmptyChart() {
  const ctx = document.getElementById("salesChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Belum ada data"],
      datasets: [{
        label: "Penjualan",
        data: [0],
        borderColor: "#ccc",
        backgroundColor: "rgba(200,200,200,0.3)"
      }]
    },
    options: {
      scales: {
        x: { display: false },
        y: { display: false }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {
  localStorage.removeItem("loginUser");
  window.location.href = "login.html";
}
