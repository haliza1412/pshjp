// ============================================================
// APP.JS — Logik Utama Dashboard PSH JP 2027
// ============================================================

// ── Lightbox KPI Rujukan ───────────────────────────────────
function bukaLightbox(src, tajuk) {
  document.getElementById("lightbox-img").src = src;
  document.getElementById("lightbox-title").textContent = tajuk;
  document.getElementById("lightbox").classList.add("aktif");
  document.body.style.overflow = "hidden";
}

function tutupLightbox() {
  document.getElementById("lightbox").classList.remove("aktif");
  document.body.style.overflow = "";
}

// Tutup lightbox dengan kekunci Esc
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") tutupLightbox();
});

let filterAktif = "Semua";

// ── Kira KPI ──────────────────────────────────────────────
function kiraKPI() {
  const prog = PSH_DATA.program;
  const sijil = PSH_DATA.sijil;

  const jumlahProgram   = prog.length;
  const programSelesai  = prog.filter((p) => p.status === "Selesai").length;
  const programBerjalan = prog.filter((p) => p.status === "Berjalan").length;
  const programDirancang= prog.filter((p) => p.status === "Dirancang").length;
  const programBatal    = prog.filter((p) => p.status === "Dibatalkan").length;

  const jumlahPeserta = prog.reduce((acc, p) => acc + p.pesertaDaftar, 0);

  const kutipanSebenar = prog
    .filter((p) => p.status === "Selesai" || p.status === "Berjalan")
    .reduce((acc, p) => acc + p.pesertaDaftar * p.yuranPerPeserta, 0);

  const sasaranYuran = PSH_DATA.maklumatJabatan.sasaranYuran;
  const peratusYuran = ((kutipanSebenar / sasaranYuran) * 100).toFixed(1);
  const tunggakan = sasaranYuran - kutipanSebenar;

  const sijilDikeluarkan = sijil.reduce((acc, s) => acc + s.dikeluarkan, 0);
  const sijilBelum       = sijil.reduce((acc, s) => acc + s.belumSiap, 0);

  return {
    jumlahProgram, programSelesai, programBerjalan,
    programDirancang, programBatal,
    jumlahPeserta, kutipanSebenar, sasaranYuran,
    peratusYuran, tunggakan, sijilDikeluarkan, sijilBelum,
  };
}

// ── Kemaskini KPI Cards ────────────────────────────────────
function kemaskiniKPI() {
  const k = kiraKPI();

  document.getElementById("kpi-program-total").textContent   = k.jumlahProgram;
  document.getElementById("kpi-selesai").textContent         = k.programSelesai;
  document.getElementById("kpi-berjalan").textContent        = k.programBerjalan;
  document.getElementById("kpi-dirancang").textContent       = k.programDirancang;
  document.getElementById("kpi-batal").textContent           = k.programBatal;
  document.getElementById("kpi-peserta").textContent         = k.jumlahPeserta;

  document.getElementById("kpi-kutipan").textContent =
    "RM " + k.kutipanSebenar.toLocaleString("ms-MY", { minimumFractionDigits: 2 });
  document.getElementById("kpi-sasaran").textContent =
    "RM " + k.sasaranYuran.toLocaleString("ms-MY", { minimumFractionDigits: 2 });
  document.getElementById("kpi-peratus-yuran").textContent = k.peratusYuran + "%";
  document.getElementById("kpi-tunggakan").textContent =
    "RM " + k.tunggakan.toLocaleString("ms-MY", { minimumFractionDigits: 2 });

  const bar = document.getElementById("progress-yuran");
  bar.style.width = Math.min(k.peratusYuran, 100) + "%";
  bar.classList.toggle("bg-green-500", k.peratusYuran >= 80);
  bar.classList.toggle("bg-yellow-400", k.peratusYuran >= 50 && k.peratusYuran < 80);
  bar.classList.toggle("bg-red-400", k.peratusYuran < 50);

  document.getElementById("kpi-sijil-keluar").textContent = k.sijilDikeluarkan;
  document.getElementById("kpi-sijil-belum").textContent  = k.sijilBelum;
}

// ── Render Jadual Program ──────────────────────────────────
function renderJadual(filter) {
  filterAktif = filter;

  document.querySelectorAll(".btn-filter").forEach((btn) => {
    btn.classList.toggle("aktif", btn.dataset.filter === filter);
  });

  let data = PSH_DATA.program;
  if (filter !== "Semua") data = data.filter((p) => p.status === filter);

  const tbody = document.getElementById("jadual-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-gray-400">Tiada rekod ditemui.</td></tr>`;
    return;
  }

  data.forEach((p) => {
    const yuranKutip = (p.status === "Selesai" || p.status === "Berjalan")
      ? (p.pesertaDaftar * p.yuranPerPeserta)
      : 0;

    const statusClass = {
      "Selesai": "badge-selesai",
      "Berjalan": "badge-berjalan",
      "Dirancang": "badge-dirancang",
      "Dibatalkan": "badge-batal",
    }[p.status] || "";

    const sijilRekod = PSH_DATA.sijil.find((s) => s.idProgram === p.id);
    let sijilText = "\u2014";
    if (sijilRekod) {
      sijilText = sijilRekod.dikeluarkan + " / " + (sijilRekod.dikeluarkan + sijilRekod.belumSiap);
    } else if (p.status === "Berjalan" || p.status === "Dirancang") {
      sijilText = "Belum";
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="font-mono text-xs text-gray-500">${p.id}</td>
      <td class="font-medium">${p.nama}</td>
      <td><span class="kategori-tag">${p.kategori}</span></td>
      <td class="text-center"><span class="badge ${statusClass}">${p.status}</span></td>
      <td class="text-center">${p.pesertaDaftar > 0 ? p.pesertaDaftar + " / " + p.kapasiti : "\u2014 / " + p.kapasiti}</td>
      <td class="text-right">${yuranKutip > 0 ? "RM " + yuranKutip.toLocaleString("ms-MY", { minimumFractionDigits: 2 }) : "\u2014"}</td>
      <td class="text-center">${sijilText}</td>
      <td class="text-xs text-gray-400">${p.tarikhMula} \u2192 ${p.tarikhTamat}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ── Carian ─────────────────────────────────────────────────
function setupCarian() {
  document.getElementById("input-cari").addEventListener("input", function () {
    const kata = this.value.toLowerCase();
    document.querySelectorAll("#jadual-body tr").forEach((tr) => {
      tr.style.display = tr.textContent.toLowerCase().includes(kata) ? "" : "none";
    });
  });
}

// ── Export CSV ─────────────────────────────────────────────
function exportCSV() {
  const headers = ["ID", "Nama Program", "Kategori", "Status", "Peserta", "Kapasiti", "Yuran/Peserta", "Kutipan", "Tarikh Mula", "Tarikh Tamat"];
  const rows = PSH_DATA.program.map((p) => {
    const kutip = (p.status === "Selesai" || p.status === "Berjalan") ? p.pesertaDaftar * p.yuranPerPeserta : 0;
    return [p.id, p.nama, p.kategori, p.status, p.pesertaDaftar, p.kapasiti, p.yuranPerPeserta, kutip, p.tarikhMula, p.tarikhTamat].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "PSH_JP_PTSB_2027.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Cetakan ────────────────────────────────────────────────
function cetakLaporan() {
  window.print();
}

// ── Init ───────────────────────────────────────────────────
function init() {
  kemaskiniKPI();
  renderJadual("Semua");
  setupCarian();

  const k = kiraKPI();
  binaCartaStatusProgram(PSH_DATA.program);
  binaCartaPesertaProgram(PSH_DATA.program);
  binaCartaTrendBulanan(PSH_DATA.trendBulanan);
  binaCartaYuran(k.sasaranYuran, k.kutipanSebenar);

  document.querySelectorAll(".btn-filter").forEach((btn) => {
    btn.addEventListener("click", () => renderJadual(btn.dataset.filter));
  });

  document.getElementById("btn-export").addEventListener("click", exportCSV);
  document.getElementById("btn-cetak").addEventListener("click", cetakLaporan);
}

document.addEventListener("DOMContentLoaded", init);
