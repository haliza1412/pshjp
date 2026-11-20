// ============================================================
// CHARTS.JS — Carta Chart.js untuk Dashboard PSH JP 2027
// ============================================================

let chartStatus = null;
let chartPeserta = null;
let chartTrend = null;
let chartYuran = null;

function binaCartaStatusProgram(data) {
  const selesai = data.filter((p) => p.status === "Selesai").length;
  const berjalan = data.filter((p) => p.status === "Berjalan").length;
  const dirancang = data.filter((p) => p.status === "Dirancang").length;
  const batal = data.filter((p) => p.status === "Dibatalkan").length;

  const ctx = document.getElementById("cartaStatus").getContext("2d");
  if (chartStatus) chartStatus.destroy();

  chartStatus = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Selesai", "Sedang Berjalan", "Dirancang", "Dibatalkan"],
      datasets: [{
        data: [selesai, berjalan, dirancang, batal],
        backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
        borderWidth: 2,
        borderColor: "#ffffff",
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 12 }, padding: 12 } },
        tooltip: { callbacks: { label: (c) => " " + c.label + ": " + c.raw + " program" } },
      },
    },
  });
}

function binaCartaPesertaProgram(data) {
  const aktif = data.filter((p) => p.status === "Selesai" || p.status === "Berjalan");
  const labels = aktif.map((p) => p.nama.length > 25 ? p.nama.substring(0, 25) + "\u2026" : p.nama);
  const values = aktif.map((p) => p.pesertaDaftar);

  const ctx = document.getElementById("cartaPeserta").getContext("2d");
  if (chartPeserta) chartPeserta.destroy();

  chartPeserta = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Bilangan Peserta",
        data: values,
        backgroundColor: "#6366f1",
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => " " + c.raw + " peserta" } },
      },
      scales: {
        x: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

function binaCartaTrendBulanan(trend) {
  const ctx = document.getElementById("cartaTrend").getContext("2d");
  if (chartTrend) chartTrend.destroy();

  chartTrend = new Chart(ctx, {
    type: "line",
    data: {
      labels: trend.map((t) => t.bulan),
      datasets: [
        {
          label: "Bilangan Peserta",
          data: trend.map((t) => t.peserta),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#3b82f6",
          pointRadius: 5,
          yAxisID: "y",
        },
        {
          label: "Kutipan Yuran (RM)",
          data: trend.map((t) => t.yuran),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.07)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#22c55e",
          pointRadius: 5,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "top", labels: { font: { size: 12 } } },
      },
      scales: {
        y: {
          beginAtZero: true,
          position: "left",
          title: { display: true, text: "Peserta", font: { size: 11 } },
          grid: { color: "#f1f5f9" },
        },
        y1: {
          beginAtZero: true,
          position: "right",
          title: { display: true, text: "Yuran (RM)", font: { size: 11 } },
          grid: { drawOnChartArea: false },
        },
        x: { grid: { display: false } },
      },
    },
  });
}

function binaCartaYuran(sasaran, sebenar) {
  const ctx = document.getElementById("cartaYuran").getContext("2d");
  if (chartYuran) chartYuran.destroy();

  chartYuran = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Sasaran", "Kutipan Sebenar"],
      datasets: [{
        label: "Jumlah (RM)",
        data: [sasaran, sebenar],
        backgroundColor: ["#cbd5e1", "#22c55e"],
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (c) => " RM " + c.raw.toLocaleString("ms-MY", { minimumFractionDigits: 2 }),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#f1f5f9" },
          ticks: { callback: (v) => "RM " + v.toLocaleString("ms-MY"), font: { size: 11 } },
        },
        x: { grid: { display: false } },
      },
    },
  });
}
