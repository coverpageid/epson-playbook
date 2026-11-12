/* Epson Sales & Product Playbook — Interactive Web App */
(() => {
  "use strict";
  const TKDN_PRODUCTS = window.PRODUCTS || [];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const URL_ECO  = "https://aris-projectai.github.io/epson-ecotank-catalog/";
  const URL_PROJ = "https://aris-projectai.github.io/epson-projector-catalog/";
  const URL_TKDN = "https://aris-projectai.github.io/epson-tkdn-catalog/";

  const ICON = {
    wizard: '<path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2zm6 13l1 2.5L21.5 18.5 19 19.5 18 22l-1-2.5-2.5-1 2.5-1L18 15z"/>',
    ecotank: '<path d="M7 3h10v4H7zM5 8h14a2 2 0 0 1 2 2v6h-4v4H7v-4H3v-6a2 2 0 0 1 2-2zm4 8v2h6v-2z"/>',
    ink: '<path d="M12 2c.6 0 1 .4 1 1v2h2a1 1 0 0 1 1 1v3l2 3v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8l2-3V6a1 1 0 0 1 1-1h2V3c0-.6.4-1 1-1zm-2 9v8h4v-8h-4z"/>',
    projector: '<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2v2h-2v-2H9v2H7v-2H5a2 2 0 0 1-2-2V7zm12 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>',
    tkdn: '<path d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/>',
    certs: '<path d="M4 4h16v16H4V4zm2 4v2h12V8H6zm0 4v2h12v-2H6zm0 4v2h8v-2H6z"/>',
    objection: '<path d="M13 2L3 14h7v8l10-12h-7V2z"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k] || ICON.wizard}</svg>`;

  const MODULES = [
    { id: "wizard", short: "Rekomendasi", label: "Asisten Rekomendasi", desc: "Pilih profil pelanggan & kebutuhan untuk mendapatkan rekomendasi produk Terbaik, Ideal, dan Upsell dalam hitungan detik." },
    { id: "ecotank", short: "EcoTank", label: "Playbook Printer EcoTank", desc: "Rumus membaca kode model 47 printer EcoTank aktif, matriks Upselling Ladder, dan panduan generasi baru 2026." },
    { id: "ink", short: "Kode Tinta", label: "Panduan Kode Tinta", desc: "Pencarian cepat kompatibilitas botol tinta Epson (664, 003, 001, 008, 057, 005), formula Dye vs Pigmen, dan sertifikat TKDN." },
    { id: "projector", short: "Proyektor", label: "Playbook Proyektor 3LCD", desc: "Panduan 21 proyektor Corporate & Education: kalkulator ukuran ruangan, kode seri EB-, dan keunggulan 3LCD vs DLP." },
    { id: "tkdn", short: "Strategi TKDN", label: "Strategi Tender TKDN & PDN", desc: "Aturan pengadaan pemerintah (PP 29/2018), Cheat Sheet pemenang tender per kategori, & strategi mengalahkan fotokopi laser." },
    { id: "certs", short: "Sertifikat", label: "Tabel 79 Sertifikat TKDN", desc: "Daftar lengkap Kode SKU, Nilai TKDN, Nilai BMP, Total, dan Nomor Sertifikat Kemenperin RI (Efektif 28 Agu 2026) siap salin." },
    { id: "objection", short: "Battlecards", label: "Objection Handling & Battlecards", desc: "Jawaban siap pakai saat menghadapi keberatan harga, perbandingan melawan kompetitor Laser & DLP, serta tips closing." },
  ];

  /* ---------- Recommendation Wizard Data ---------- */
  const WIZARD_MATRIX = {
    "swasta:printer:home": {
      title: "Printer Rumah, Pelajar & Keluarga (Cetak Harian Hemat)",
      tiers: [
        { tag: "Ekonomis (Entry)", color: "#6e6e73", model: "EcoTank L1310 / L3211 / L3311", meta: "Tinta 003 · USB 2.0 · 4.500 hal. hitam / 7.500 warna", pitch: "Solusi paling terjangkau untuk cetak saja (L1310 Baru 2026) atau All-in-One Print/Scan/Copy (L3211 TKDN 66,45% / L3311 Baru 2026).", url: `${URL_ECO}#/compare/L1310,L3211,L3311` },
        { tag: "Pilihan Ideal (Best Seller)", color: "#0a84ff", best: true, model: "EcoTank L3251 / L3351", meta: "Tinta 003 · Wi-Fi & Wi-Fi Direct · Epson Smart Panel", pitch: "Bisa cetak & scan langsung dari HP Android/iPhone tanpa menyalakan laptop. L3251 memiliki TKDN 75,28%, sedangkan L3351 hadir dengan bodi baru 2026.", url: `${URL_ECO}#/compare/L3251,L3351` },
        { tag: "Upsell / Pro", color: "#30d158", model: "EcoTank L4360", meta: "Tinta 001 (Hitam Pigmen) · Auto Duplex · Layar LCD", pitch: "Alasan Upsell: Cetak bolak-balik otomatis menghemat kertas 50% dan tinta hitam pigmennya tahan air seperti hasil cetak laser!", url: `${URL_ECO}#/p/L4360` },
      ]
    },
    "swasta:printer:office": {
      title: "Printer UMKM & Kantor Sibuk (ADF, Duplex & Tinta Tahan Air)",
      tiers: [
        { tag: "Kantor Kecil (ADF)", color: "#6e6e73", model: "EcoTank L5391 / L5590", meta: "Tinta 003 · ADF 30 Lembar · Print/Scan/Copy/Fax · Wi-Fi & LAN", pitch: "Cocok untuk admin yang sering fotokopi/scan tumpukan dokumen lewat ADF serta butuh port kabel LAN.", url: `${URL_ECO}#/compare/L5391,L5590` },
        { tag: "Pilihan Ideal (Duplex + ADF)", color: "#0a84ff", best: true, model: "EcoTank L6370 / L6390", meta: "Tinta 001 (Hitam Pigmen) · Auto Duplex · ADF · Baki 250 Lembar", pitch: "Kecepatan cetak tinggi 15 ipm, laci kertas tertutup bebas debu 250 lembar, dan teks hitam anti-luntur.", url: `${URL_ECO}#/compare/L6370,L6390` },
        { tag: "Upsell Bisnis (Full Pigmen)", color: "#30d158", model: "EcoTank L6460 / L6490", meta: "Tinta 008 (Full Pigmen 4 Warna) · PrecisionCore · 17 ipm", pitch: "Alasan Upsell: Semua 4 warna menggunakan tinta pigmen DURABrite ET — cetakan grafik & logo warna tidak luntur terkena stabilo/air!", url: `${URL_ECO}#/compare/L6460,L6490` },
      ]
    },
    "swasta:printer:a3": {
      title: "Printer Format Lebar A3+ (Arsitek, Konstruksi, Laporan Keuangan & Foto)",
      tiers: [
        { tag: "Cetak A3+ Ekonomis", color: "#6e6e73", model: "EcoTank L11050 / L14150", meta: "L11050 (Tinta 003, Cetak A3+) · L14150 (Tinta 001, Scan A4 + Cetak A3+)", pitch: "Pilihan hemat untuk mencetak tabel Excel lebar, gambar CAD A3, atau poster.", url: `${URL_ECO}#/compare/L11050,L14150` },
        { tag: "Pilihan Ideal (Full A3+ Bisnis)", color: "#0a84ff", best: true, model: "EcoTank L15150 / L15160", meta: "Tinta 008 (Full Pigmen) · Print/Scan/Copy/Duplex A3 Penuh · 25 ipm", pitch: "Bisa Scan, Copy, dan Duplex hingga ukuran A3 penuh dengan kecepatan tinggi 25 ipm dan tinta pigmen tahan air.", url: `${URL_ECO}#/compare/L15150,L15160` },
        { tag: "Studio Foto / Kreator A3+", color: "#30d158", model: "EcoTank L18050 (Foto 6 Warna)", meta: "Tinta 057 (6 Warna Dye) · Cetak Foto A3+ & ID Card PVC", pitch: "Khusus fotografer, percetakan undangan, dan produksi ID Card PVC langsung tanpa mesin laminasi panas.", url: `${URL_ECO}#/compare/L8050,L8100,L18050` },
      ]
    },
    "swasta:printer:mono": {
      title: "Printer Monokrom Hitam-Putih (Pengganti Printer Laser untuk Kasir, Notaris & Logistik)",
      tiers: [
        { tag: "Cetak Saja Ringkas", color: "#6e6e73", model: "EcoTank M1050 / M1140", meta: "Tinta Pigmen 005 (6.000 hal.) · M1050 (Wi-Fi/LAN) · M1140 (Duplex)", pitch: "Biaya cetak per lembar jauh lebih murah dari toner laser dan konsumsi listrik hanya ~14 Watt (bisa pakai UPS kecil).", url: `${URL_ECO}#/compare/M1050,M1140` },
        { tag: "Pilihan Ideal (Mono All-in-One)", color: "#0a84ff", best: true, model: "EcoTank M2050 / M2140", meta: "Tinta Pigmen 005 · Print/Scan/Copy · ADF (M2050) / Duplex (M2140)", pitch: "All-in-One hitam-putih super tangguh untuk kantor notaris, klinik, dan ekspedisi.", url: `${URL_ECO}#/compare/M2050,M2140` },
        { tag: "Upsell Mono Lengkap / A3", color: "#30d158", model: "EcoTank M3170 / M15140 (A3)", meta: "M3170 (A4 ADF+Duplex+Fax) · M15140 (Full A3+ Mono 25 ipm)", pitch: "Alasan Upsell: M3170 punya paket komplit A4 (ADF+Duplex+Wi-Fi), sedangkan M15140 mendukung cetak & scan A3 penuh!", url: `${URL_ECO}#/compare/M3170,M15140` },
      ]
    },
    "swasta:projector:meeting": {
      title: "Proyektor Ruang Rapat & Kelas (10–40 Peserta)",
      tiers: [
        { tag: "Ekonomis (XGA 4:3)", color: "#6e6e73", model: "Epson EB-E01 / EB-E12", meta: "3.300 – 3.600 Lumens · XGA · EB-E12 punya 2× HDMI", pitch: "Pilihan hemat dan terang untuk ruang kelas atau ruang rapat kecil.", url: `${URL_PROJ}#/compare/EB-E01,EB-E12,EB-X52` },
        { tag: "Pilihan Ideal (Widescreen + Wi-Fi)", color: "#0a84ff", best: true, model: "Epson EB-W53 / EB-W55", meta: "4.000 Lumens · WXGA (16:10) · 2× HDMI · Wi-Fi Built-in (EB-W55)", pitch: "Rasio layar lebar 16:10 pas dengan layar laptop modern. EB-W55 sudah dilengkapi Wi-Fi Built-in tanpa perlu beli dongle.", url: `${URL_PROJ}#/compare/EB-W53,EB-W55` },
        { tag: "Upsell Full HD 1080p", color: "#30d158", model: "Epson EB-FH54", meta: "4.100 Lumens · Full HD 1080p · Wi-Fi Built-in · Screen Mirroring · Speaker 16W", pitch: "Alasan Upsell: Resolusi Full HD 1080p membuat angka tabel keuangan & desain terlihat sangat tajam, lengkap dengan Miracast & speaker 16W!", url: `${URL_PROJ}#/p/EB-FH54` },
      ]
    },
    "swasta:projector:pro": {
      title: "Proyektor Short Throw, Laser 20.000 Jam & Aula Besar (5.000+ Lumens)",
      tiers: [
        { tag: "Ruang Sempit (Short Throw)", color: "#6e6e73", model: "EB-W56S / EB-L210SW", meta: "Proyeksi besar dari jarak < 1m · EB-L210SW sudah Laser 4.000 lm", pitch: "Bebas bayangan presenter di layar dan tidak menyilaukan mata pembicara.", url: `${URL_PROJ}#/compare/EB-W56S,EB-L210SW,EB-L210SF` },
        { tag: "Pilihan Ideal (Laser Bebas Perawatan)", color: "#0a84ff", best: true, model: "EB-L210W / EB-L260F", meta: "Laser 4.500 – 4.600 Lumens · Kontras > 5.000.000:1 · Umur 20.000 Jam", pitch: "Menyala instan tanpa waktu pemanasan, bebas biaya ganti lampu hingga 20.000 jam, dilengkapi Wi-Fi & Screen Mirroring.", url: `${URL_PROJ}#/compare/EB-L210W,EB-L260F` },
        { tag: "Aula / Auditorium Besar", color: "#30d158", model: "EB-2155W / EB-2265U", meta: "5.000 – 5.500 Lumens · WXGA (2155W) / WUXGA + HDBaseT (2265U)", pitch: "Kecerahan sangat tinggi 5.500 lumens agar gambar tetap jelas di aula atau ballroom besar.", url: `${URL_PROJ}#/compare/EB-2065,EB-2155W,EB-2265U` },
      ]
    },
    "tkdn:printer:all": {
      title: "Pengadaan Printer Pemerintah / BUMN (Wajib TKDN+BMP ≥ 40%)",
      tiers: [
        { tag: "A4 All-in-One TKDN Tertinggi", color: "#d70015", model: "EcoTank L3251 / L3211", meta: "L3251: TKDN+BMP 75,28% (Wi-Fi) · L3211: 66,45% (USB) · Cert: 6109/..05/2025", pitch: "Nilai TKDN+BMP mencapai 75,28% — sangat aman mengunci spesifikasi e-Katalog untuk printer meja kerja staf.", url: `${URL_TKDN}#/compare/L3251,L3211` },
        { tag: "Pilihan Ideal (A3+ Warna & Mono TKDN)", color: "#0a84ff", best: true, model: "L15150 (68,94%) / M15140 (69,82%)", meta: "Sertifikat Baru Juni 2026 · L15150/15160/15180 (Warna A3) · M15140/15180 (Mono A3)", pitch: "Nilai TKDN+BMP naik signifikan ke 67%–69,82% pada sertifikat 2026! Solusi mutlak untuk cetak & scan A3 di dinas/instansi.", url: `${URL_TKDN}#/compare/L15150,L15160,M15140,M15180` },
        { tag: "MFP Bisnis & Pengganti Fotokopi", color: "#30d158", model: "EM-C800 (66,87%) / AM-C400 (61,13%) / EM-C8100 (61,40%)", meta: "Sertifikat Baru Agustus 2026 (10240–10244/..08/2026) · RIPS & Linehead", pitch: "Kalahkan mesin fotokopi laser kompetitor dengan MFP Heat-Free Epson yang hemat listrik 85% dan ber-TKDN > 60%!", url: `${URL_TKDN}#/compare/EM-C800,AM-C400,EM-C8100,AM-M5500` },
      ]
    },
    "tkdn:scanner:all": {
      title: "Pengadaan Document Scanner & Proyektor TKDN Instansi",
      tiers: [
        { tag: "Scanner Meja & Flatbed+ADF", color: "#6e6e73", model: "DS-1730 (55,91%) / DS-C330 (52,83%)", meta: "Sertifikat Agustus 2026 (10246 & 10245) · Flatbed+ADF (DS-1730)", pitch: "DS-1730 menggantikan DS-1630 dengan kecepatan 30 ppm dan nilai TKDN+BMP tertinggi di kategori scanner (55,91%).", url: `${URL_TKDN}#/compare/DS-1730,DS-C330,DS-530II` },
        { tag: "Scanner Arsip Cepat (35–85 ppm)", color: "#0a84ff", best: true, model: "DS-530II (53,44%) / ES-580W (53,99%) / DS-770II (53,76%)", meta: "Sertifikat Juni 2026 · Tersedia hingga 85 ppm (DS-970) & A3 (DS-32000)", pitch: "Standar emas digitalisasi arsip pemerintahan dengan sensor ultrasonik anti-macet dan TKDN+BMP > 53%.", url: `${URL_TKDN}#/compare/DS-530II,DS-570WII,ES-580W,DS-770II` },
        { tag: "Proyektor TKDN Resmi", color: "#30d158", model: "EB-E600 (55,70%) & EB-X600 (55,02%)", meta: "Cert: 8453 & 8509/SJ-IND.8/E-TKDN/9/2024 · 3.400 & 3.600 Lumens XGA", pitch: "Pengganti resmi EB-X500 (Discontinue). EB-X600 dilengkapi port RJ45 LAN dan dukungan Wi-Fi opsional ELPAP11.", url: `${URL_TKDN}#/compare/EB-E600,EB-X600` },
      ]
    },
    "tkdn:spec:all": {
      title: "Pengadaan Plotter CAD/GIS, Dot Matrix, Passbook & Label TKDN/PDN",
      tiers: [
        { tag: "Dot Matrix & Passbook Bank", color: "#6e6e73", model: "LQ-2190 (40,54%) / LQ-310 (38,99%) / PLQ-35 (35,78%)", meta: "Cert: 1271/..4/2024 (LQ/LX) & 974/..3/2024 (PLQ-35/50)", pitch: "Untuk cetak faktur rangkap, pajak, koperasi, dan buku tabungan perbankan.", url: `${URL_TKDN}#/compare/LQ-310,LQ-2190,PLQ-35,PLQ-50` },
        { tag: "Plotter Teknis 24\"–44\" (TKDN & PDN)", color: "#0a84ff", best: true, model: "SC-T3130 (38,94%) / SC-T5130M (39,84%) / SC-T3730D (PDN)", meta: "Cert: 976 & 977/..3/2024 · Tersedia Plotter+Scanner (M) & Dual Roll 6-Warna (PDN)", pitch: "Wajib untuk Dinas PU, BPN, BUMN Karya, dan Fakultas Teknik.", url: `${URL_TKDN}#/compare/SC-T3130,SC-T3130M,SC-T5130M,SC-T5435` },
        { tag: "Label Industri & Sublimasi SMK", color: "#30d158", model: "CW-C6050P (29,88%) & SC-F531 (37,37%)", meta: "ColorWorks Label 4\"/8\" (Cert 979) · SureColor Sublimasi 24\" (Cert 1068)", pitch: "CW-C6050/6550 untuk label farmasi/RS/logistik; SC-F530/F531 untuk BLK & SMK Kreatif.", url: `${URL_TKDN}#/compare/CW-C6050A,CW-C6050P,SC-F530,SC-F531` },
      ]
    }
  };

  const state = {
    sec: "wizard",
    wizKey: "swasta:printer:home",
    decModel: "L3251",
    certQ: "",
    certCat: "all",
  };

  /* ---------- Theme & Clock ---------- */
  const root = document.documentElement;
  const mq = matchMedia("(prefers-color-scheme: dark)");
  let manualTheme = sessionStorage.getItem("theme_override");
  const applyTheme = (t) => { root.dataset.theme = t; };
  applyTheme(manualTheme || (mq.matches ? "dark" : "light"));
  mq.addEventListener("change", (e) => {
    sessionStorage.removeItem("theme_override");
    manualTheme = null;
    applyTheme(e.matches ? "dark" : "light");
  });
  $("#themeBtn").onclick = () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    sessionStorage.setItem("theme_override", next);
    applyTheme(next);
  };
  const tick = () => {
    const d = new Date();
    $("#clock").textContent = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" }) + "  " +
      d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };
  tick(); setInterval(tick, 15000);

  /* ---------- Navigation ---------- */
  const toggleDrawer = (open) => {
    const sb = $("#sidebar"), bd = $("#drawerBackdrop");
    const show = open ?? !sb.classList.contains("open");
    sb.classList.toggle("open", show);
    if (bd) bd.hidden = !show;
  };
  if ($("#filterBtn")) $("#filterBtn").onclick = () => toggleDrawer();
  if ($("#drawerClose")) $("#drawerClose").onclick = () => toggleDrawer(false);
  if ($("#drawerBackdrop")) $("#drawerBackdrop").onclick = () => toggleDrawer(false);

  function renderNav() {
    $("#moduleList").innerHTML = MODULES.map((m) => `
      <li><button class="side-item ${state.sec === m.id ? "active" : ""}" data-sec="${m.id}">
        <span class="ico">${svg(m.id)}</span>${m.label}
      </button></li>`).join("");
    $("#chapterNav").innerHTML = MODULES.map((m) => `
      <button class="chapter-item ${state.sec === m.id ? "active" : ""}" data-sec="${m.id}">
        <span class="chapter-ico">${svg(m.id)}</span>
        <span class="chapter-lbl">${m.short}</span>
      </button>`).join("");
  }

  /* ---------- Decoder Logic for EcoTank ---------- */
  function decodeEcoTank(raw) {
    const m = raw.trim().toUpperCase().replace(/^EPSON\s+|ECOTANK\s+/g, "");
    const parts = [];
    if (m.startsWith("M")) {
      parts.push({ code: "M", label: "Seri Monokrom", desc: "Khusus Hitam Pigmen (Kode Tinta 005) — tahan air, super tajam, hemat listrik." });
    } else if (m.startsWith("L")) {
      parts.push({ code: "L", label: "Seri EcoTank Warna", desc: "Tangki tinta warna terintegrasi bebas repot isi ulang." });
    } else {
      parts.push({ code: m || "?", label: "Format Seri", desc: "Ketik model seperti L3251, L4360, L15150, atau M15140." });
      return parts;
    }
    const digits = m.slice(1);
    if (digits.startsWith("15") || digits.startsWith("14") || digits.startsWith("11") || digits.startsWith("18")) {
      const pfx = digits.slice(0, 2);
      const mapA3 = {
        "11": "Format A3+ Cetak Saja (L11050)",
        "14": "Format A3+ Cetak & Scan A4 (L14150)",
        "15": "Format A3+ Penuh: Print, Scan, Copy & Duplex A3 (L151xx / M151xx)",
        "18": "Format A3+ Foto 6 Warna (L18050)"
      };
      parts.push({ code: pfx + "xxx", label: "Kelas Format Lebar A3+", desc: mapA3[pfx] });
    } else if (digits.length >= 3) {
      const c1 = digits[0];
      const clsMap = {
        "1": "Single-Function (Cetak Saja)",
        "2": "Monokrom All-in-One (Print, Scan, Copy)",
        "3": "All-in-One Standar (Print, Scan, Copy)",
        "4": "All-in-One + Auto Duplex + Hitam Pigmen + Layar LCD",
        "5": "All-in-One + ADF (Scan Tumpukan) + Faks",
        "6": "Kelas Bisnis (Duplex Cepat, Kaset Bawah, Tinta Pigmen)",
        "8": "Kelas Foto 6 Warna (Tinta 057 + Cetak ID Card PVC)"
      };
      parts.push({ code: c1 + "xxx", label: "Kelas Fungsi", desc: clsMap[c1] || "Seri Khusus EcoTank" });
      const c2 = digits[1];
      parts.push({
        code: "x" + c2 + "xx",
        label: "Generasi Model",
        desc: c2 === "3" ? "Generasi Baru 2026 (Bodi lebih ringkas & cepat)" : "Generasi Eksisting Teruji"
      });
      const c3 = digits[2];
      parts.push({
        code: "xx" + c3 + "x",
        label: "Konektivitas",
        desc: c3 === "1" ? "USB 2.0 Standar" : c3 === "5" || c3 === "6" || c3 === "7" || c3 === "9" ? "Dilengkapi Wi-Fi / Wi-Fi Direct (+ Ethernet pada seri bisnis)" : "Konektivitas Standar/Jaringan"
      });
      if (digits.length >= 4) {
        const c4 = digits[3];
        parts.push({
          code: "xxx" + c4,
          label: "Varian SKU",
          desc: (m === "L3211" || m === "L3251") ? "Varian Resmi Bersertifikat TKDN Tinggi (66,45% / 75,28%)"
                : c4 === "6" ? "Varian Warna/Channel Distribusi (Spesifikasi identik dengan akhiran 0/1)"
                : "SKU Standar Resmi"
        });
      }
    }
    return parts;
  }

  /* ---------- Render Modules ---------- */
  function renderWizard() {
    const cur = WIZARD_MATRIX[state.wizKey] || WIZARD_MATRIX["swasta:printer:home"];
    const scenarios = [
      ["swasta:printer:home", "🏠 Printer Rumah & Pelajar"],
      ["swasta:printer:office", "🏢 Printer UMKM & Kantor"],
      ["swasta:printer:a3", "📐 Printer A3+ & Studio Foto"],
      ["swasta:printer:mono", "⚫ Printer Mono (Pengganti Laser)"],
      ["swasta:projector:meeting", "📽️ Proyektor Rapat & Kelas"],
      ["swasta:projector:pro", "✨ Proyektor Short Throw / Laser / Aula"],
      ["tkdn:printer:all", "🏛️ Tender Printer TKDN & MFP"],
      ["tkdn:scanner:all", "📄 Tender Scanner & Proyektor TKDN"],
      ["tkdn:spec:all", "🖨️ Tender Plotter, Dot Matrix & Label TKDN"],
    ];
    return `
      <div class="portal-grid">
        <a class="portal-item" href="${URL_ECO}" target="_blank" rel="noopener">
          <span class="portal-badge" style="background:linear-gradient(135deg,#0a84ff,#0051a8)">47 Model Printer</span>
          <h4>Katalog Digital Epson EcoTank</h4>
          <p>Seluruh printer Ink Tank rumah, kantor, foto 6 warna, monokrom, hingga A3+ lengkap dengan filter kode tinta & perbandingan.</p>
          <span class="portal-cta">Buka Katalog EcoTank →</span>
        </a>
        <a class="portal-item" href="${URL_PROJ}" target="_blank" rel="noopener">
          <span class="portal-badge" style="background:linear-gradient(135deg,#30d158,#198754)">21 Model Proyektor</span>
          <h4>Katalog Proyektor 3LCD</h4>
          <p>Seluruh proyektor Corporate & Education (XGA, WXGA, Full HD, Short Throw, Laser 20.000 jam, hingga 5.500 lumens).</p>
          <span class="portal-cta">Buka Katalog Proyektor →</span>
        </a>
        <a class="portal-item" href="${URL_TKDN}" target="_blank" rel="noopener">
          <span class="portal-badge" style="background:linear-gradient(135deg,#d70015,#0a84ff)">67 TKDN + 12 PDN</span>
          <h4>Katalog Khusus TKDN &amp; PDN</h4>
          <p>Portal pengadaan pemerintah & BUMN mencakup 8 kategori produk lengkap dengan Nomor Sertifikat Kemenperin RI siap salin.</p>
          <span class="portal-cta">Buka Katalog TKDN &amp; PDN →</span>
        </a>
      </div>

      <div class="pb-card">
        <h3>${svg("wizard")} Asisten Rekomendasi Cepat (Pilih Skenario Pelanggan)</h3>
        <p class="sub">Klik salah satu kebutuhan pelanggan di bawah ini untuk melihat rekomendasi berjenjang (Ekonomis, Ideal, & Upsell) beserta argumen penjualannya:</p>
        <div class="wiz-pills" style="margin-bottom:18px">
          ${scenarios.map(([k, lbl]) => `<button class="wiz-btn ${state.wizKey === k ? "active" : ""}" data-wiz="${k}">${lbl}</button>`).join("")}
        </div>
        <h4 style="margin:0 0 12px;font-size:16px;color:var(--accent)">${esc(cur.title)}</h4>
        <div class="tier-grid">
          ${cur.tiers.map((t) => `
            <div class="tier-box ${t.best ? "best" : ""}">
              <span class="tier-tag" style="background:${t.color}22;color:${t.color}">${esc(t.tag)}</span>
              <h4>${esc(t.model)}</h4>
              <div class="tier-meta">${esc(t.meta)}</div>
              <p class="pitch">${esc(t.pitch)}</p>
              <a class="btn ${t.best ? "primary" : ""} small" href="${t.url}" target="_blank" rel="noopener" style="margin-top:6px">Buka Perbandingan di Katalog ↗</a>
            </div>`).join("")}
        </div>
      </div>`;
  }

  function renderEcoTank() {
    const parts = decodeEcoTank(state.decModel);
    const presets = ["L3211", "L3251", "L3311", "L3351", "L4360", "L5391", "L6460", "L15150", "L18050", "M15140"];
    return `
      <div class="pb-card">
        <h3>🔍 Dekoder Interaktif Kode Model EcoTank</h3>
        <p class="sub">Ketik atau klik contoh model untuk membedah arti setiap huruf dan angka di hadapan pelanggan:</p>
        <div class="decoder-bar">
          <input id="decInput" class="decoder-input" value="${esc(state.decModel)}" placeholder="Mis. L3251" />
          <div class="wiz-pills">
            ${presets.map((m) => `<button class="sf-pill ${state.decModel.toUpperCase() === m ? "active" : ""}" data-dec="${m}">${m}</button>`).join("")}
          </div>
        </div>
        <div class="decoder-breakdown" id="decOutput">
          ${parts.map((p) => `<div class="dec-part"><b>${esc(p.code)}</b><small>${esc(p.label)}</small><span>${esc(p.desc)}</span></div>`).join("")}
        </div>
      </div>

      <div class="pb-card">
        <h3>⚠️ Status Discontinue &amp; Belum TKDN/PDN (L120, L1210, L3210, L3250)</h3>
        <p class="sub">Tipe <b>L120, L1210, L3210, dan L3250</b> sudah <b>Discontinue</b> serta <b>belum berstatus TKDN/PDN</b>. Arahkan permintaan pelanggan ke pengganti resminya:</p>
        <div class="tier-grid">
          <div class="tier-box best">
            <span class="tier-tag" style="background:#d7001522;color:#d70015">Pengganti Resmi Bersertifikat TKDN</span>
            <h4>EcoTank L3211 (66,45%) &amp; L3251 (75,28%)</h4>
            <div class="tier-meta">Sertifikat: 6109/SJ-IND.8/E-TKDN/5/2025 · Tinta 003</div>
            <p class="pitch">Pengganti langsung L3210 (USB → <b>L3211</b>) dan L3250 (Wi-Fi → <b>L3251</b>) yang sudah resmi bersertifikat TKDN tertinggi.</p>
          </div>
          <div class="tier-box best">
            <span class="tier-tag" style="background:#0a84ff22;color:#0a84ff">Pengganti Generasi Baru 2026 &amp; Single-Function</span>
            <h4>L121 · L1310 · L3311 · L3351</h4>
            <div class="tier-meta">L121 (Pengganti L120) · L1310 (Pengganti L1210) · L3311/L3351 (Generasi Baru)</div>
            <p class="pitch">Untuk kebutuhan cetak saja arahkan L120 ke <b>L121</b> dan L1210 ke <b>L1310 / L1250</b>; untuk All-in-One ritel arahkan ke <b>L3311 / L3351</b>.</p>
          </div>
        </div>
      </div>

      <div class="pb-card">
        <h3>📈 Matriks Upselling Ladder Printer EcoTank</h3>
        <p class="sub">Gunakan tangga upselling ini untuk mengarahkan pelanggan ke seri dengan nilai tambah yang lebih menguntungkan:</p>
        <div class="pb-table-wrap">
          <table class="pb-table">
            <thead>
              <tr>
                <th>Segmen Pelanggan</th>
                <th>Model Awal (Entry)</th>
                <th>Target Upsell 1 (Best Value)</th>
                <th>Target Upsell 2 (Pro / Bisnis)</th>
                <th>Kalimat Kunci Upselling</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Rumah & Pelajar</b></td>
                <td><code>L121</code> / <code>L1310</code> / <code>L3211</code> / <code>L3311</code></td>
                <td><b><code>L3251</code> (TKDN) / <code>L3351</code></b> (Wi-Fi)</td>
                <td><b><code>L4360</code></b> (Duplex + LCD + Hitam Pigmen)</td>
                <td>"Dengan L3251/L3351 bisa cetak langsung dari HP via Wi-Fi. Kalau naik ke L4360, sudah bisa bolak-balik otomatis & teks hitamnya tahan air."</td>
              </tr>
              <tr>
                <td><b>Admin / Kantor Kecil</b></td>
                <td><code>L3251</code> / <code>L3351</code></td>
                <td><b><code>L5290</code> / <code>L5391</code></b> (+ADF & LAN)</td>
                <td><b><code>L6260</code> / <code>L6370</code></b> (Duplex Cepat + Baki 250 lbr)</td>
                <td>"Kalau sering scan/fotokopi berkas banyak lembar, wajib ambil yang ada ADF (L5391/L6370) supaya tidak perlu buka-tutup kaca satu per satu."</td>
              </tr>
              <tr>
                <td><b>Perusahaan / Korporat</b></td>
                <td><code>L6260</code></td>
                <td><b><code>L6460</code> / <code>L6490</code></b> (Tinta 008 Full Pigmen)</td>
                <td><b><code>L6550</code> / <code>L6580</code></b> (TKDN 44% + 25 ipm)</td>
                <td>"Seri L6460 ke atas memakai tinta 008 Full Pigmen di keempat warnanya — dokumen kontrak dan grafik warna tidak akan luntur kena air/stabilo."</td>
              </tr>
              <tr>
                <td><b>Teknik / Keuangan A3</b></td>
                <td><code>L11050</code> (Cetak A3+)</td>
                <td><b><code>L14150</code></b> (Cetak A3+ & Scan Folio/A4)</td>
                <td><b><code>L15150</code> / <code>L15160</code> / <code>L15180</code></b> (Full A3+)</td>
                <td>"L14150 kaca scannya masih A4/Folio. Jika butuh scan & fotokopi buku gambar atau tabel A3 utuh, ambil L15150/L15160."</td>
              </tr>
              <tr>
                <td><b>Kasir / Notaris (Mono)</b></td>
                <td><code>M1100</code> / <code>M1120</code></td>
                <td><b><code>M1050</code> / <code>M2050</code></b> (Generasi Baru 2026)</td>
                <td><b><code>M2140</code> / <code>M3170</code> / <code>M15140 (A3)</code></b></td>
                <td>"Daya listriknya hanya ~14 Watt (30× lebih hemat dari printer laser), hasil cetak hitamnya 100% pigmen tahan air setajam laser."</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="pb-card">
        <h3>🆕 Daftar 12 Model Baru EcoTank Generasi 2026</h3>
        <p class="sub">Model generasi terbaru dengan sasis lebih ringkas, kecepatan meningkat, dan akses perawatan mudah:</p>
        <div class="pills">
          ${["L1310", "L1350", "L3311", "L3316", "L3351", "L3356", "L4360", "L5391", "L6370", "L6390", "M1050", "M2050"]
            .map((m) => `<a class="pill blue" style="padding:6px 12px;font-size:13px" href="${URL_ECO}#/p/${m}" target="_blank" rel="noopener">${m} ↗</a>`).join("")}
        </div>
      </div>`;
  }

  function renderInk() {
    const inks = [
      { code: "003", type: "Dye 4 Warna (CMYK) · Botol Anti-Tumpah Key-Lock", yield: "4.500 hal. Hitam / 7.500 hal. Warna (65 ml)", tkdn: "Bersertifikat TKDN Mei 2026: Bk 25,65% (4000) · C 25,25% (4004) · M 25,72% (4005) · Y 25,54% (4006)", models: "L11050, L1250, L1256, L1310, L1350, L3211, L3216, L3251, L3256, L3311, L3316, L3351, L3356, L3550, L3556, L5290, L5296, L5391, L5590" },
      { code: "664", type: "Dye 4 Warna (CMYK) · Botol Standar 70 ml", yield: "4.000 hal. Hitam / 6.500 hal. Warna (70 ml)", tkdn: "Bersertifikat TKDN Mei 2026: T6641 Bk 25,23% (3999) · T6642 C 25,25% (4003) · T6643 M 25,27% (4001) · T6644 Y 25,20% (4002)", models: "L121" },
      { code: "001", type: "Hitam Pigmen (127 ml) + Warna Dye CMY (70 ml)", yield: "7.500 hal. Hitam / 6.000 hal. Warna", tkdn: "—", models: "L4360, L6260, L6370, L6390, L14150" },
      { code: "008", type: "Full Pigmen 4 Warna DURABrite ET (Tahan Air & Stabilo)", yield: "7.500 hal. Hitam (127 ml) / 6.000 hal. Warna (70 ml)", tkdn: "—", models: "L6460, L6490, L6550, L6580, L15150, L15160, L15180" },
      { code: "057", type: "Dye Foto 6 Warna (Bk, C, M, Y, Light Cyan, Light Magenta)", yield: "Hingga 2.100 foto 4R (70 ml/botol)", tkdn: "—", models: "L8050, L8100, L18050" },
      { code: "005", type: "Hitam Pigmen Monokrom (120 ml)", yield: "6.000 halaman Hitam per botol", tkdn: "—", models: "M1050, M1100, M1120, M1140, M1170, M2050, M2140, M2170, M3170, M15140, M15180" },
    ];
    return `
      <div class="pb-card">
        <h3>💧 Panduan Lengkap Kode Tinta Botol Epson EcoTank</h3>
        <p class="sub">Pastikan pelanggan tidak salah membeli nomor kode tinta karena bentuk kunci mulut botol (Key-Lock) tiap seri berbeda:</p>
        <div class="pb-table-wrap">
          <table class="pb-table">
            <thead>
              <tr>
                <th>Kode Tinta</th>
                <th>Formula & Karakteristik</th>
                <th>Kapasitas & Yield</th>
                <th>Sertifikasi TKDN Tinta</th>
                <th>Model Printer yang Kompatibel</th>
              </tr>
            </thead>
            <tbody>
              ${inks.map((i) => `
                <tr>
                  <td><b style="font-size:18px;color:var(--accent)">${esc(i.code)}</b></td>
                  <td><b>${esc(i.type)}</b></td>
                  <td>${esc(i.yield)}</td>
                  <td>${esc(i.tkdn)}</td>
                  <td>${esc(i.models)}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderProjector() {
    return `
      <div class="pb-card">
        <h3>📽️ Matriks Pemilihan Proyektor 3LCD Berdasarkan Ukuran Ruangan</h3>
        <p class="sub">Gunakan tabel ini untuk menentukan tingkat kecerahan (Lumens), resolusi, dan fitur yang tepat bagi klien:</p>
        <div class="pb-table-wrap">
          <table class="pb-table">
            <thead>
              <tr>
                <th>Jenis Ruangan & Kapasitas</th>
                <th>Rekomendasi Lumens</th>
                <th>Pilihan Ekonomis</th>
                <th>Pilihan Ideal (2× HDMI / Wi-Fi)</th>
                <th>Pilihan Unggulan / Laser</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Ruang Kelas / Rapat Kecil</b><br><span class="muted">10 – 25 orang · Layar 70"–100"</span></td>
                <td><b>3.300 – 3.600 lm</b></td>
                <td><a href="${URL_PROJ}#/p/EB-E01" target="_blank"><b>EB-E01</b></a> (3.300 lm XGA)<br><a href="${URL_PROJ}#/p/EB-E600" target="_blank"><b>EB-E600</b></a> (3.400 lm <b>TKDN</b>)</td>
                <td><a href="${URL_PROJ}#/p/EB-E12" target="_blank"><b>EB-E12</b></a> (3.600 lm, 2× HDMI)<br><a href="${URL_PROJ}#/p/EB-X600" target="_blank"><b>EB-X600</b></a> (3.600 lm <b>TKDN</b> + LAN)</td>
                <td><a href="${URL_PROJ}#/p/EB-W56S" target="_blank"><b>EB-W56S</b></a> (Short Throw WXGA)</td>
              </tr>
              <tr>
                <td><b>Ruang Rapat Menengah</b><br><span class="muted">25 – 40 orang · Lampu menyala</span></td>
                <td><b>3.800 – 4.200 lm</b></td>
                <td><a href="${URL_PROJ}#/p/EB-X52" target="_blank"><b>EB-X52</b></a> (3.800 lm XGA)<br><a href="${URL_PROJ}#/p/EB-W53" target="_blank"><b>EB-W53</b></a> (4.000 lm WXGA)</td>
                <td><a href="${URL_PROJ}#/p/EB-W55" target="_blank"><b>EB-W55</b></a> (4.000 lm WXGA + <b>Wi-Fi Built-in</b>)<br><a href="${URL_PROJ}#/p/EB-982W" target="_blank"><b>EB-982W</b></a> (4.200 lm + Spk 16W)</td>
                <td><a href="${URL_PROJ}#/p/EB-FH54" target="_blank"><b>EB-FH54</b></a> (<b>Full HD 1080p</b>, 4.100 lm, Wi-Fi Built-in, Speaker 16W)</td>
              </tr>
              <tr>
                <td><b>Ruang Sempit / Kelas Interaktif</b><br><span class="muted">Jarak tembak &lt; 1 meter</span></td>
                <td><b>3.700 – 4.000 lm (Short Throw)</b></td>
                <td><a href="${URL_PROJ}#/p/EB-W56S" target="_blank"><b>EB-W56S</b></a> (Lampu 3.700 lm WXGA)</td>
                <td><a href="${URL_PROJ}#/p/EB-L210SW" target="_blank"><b>EB-L210SW</b></a> (<b>Laser</b> 4.000 lm WXGA + Mirroring)</td>
                <td><a href="${URL_PROJ}#/p/EB-L210SF" target="_blank"><b>EB-L210SF</b></a> (<b>Laser Full HD 1080p</b> 4.000 lm + Mirroring)</td>
              </tr>
              <tr>
                <td><b>Ruang Direksi / Pemakaian Intensif</b><br><span class="muted">Bebas perawatan lampu 20.000 jam</span></td>
                <td><b>4.500 – 4.600 lm (Laser)</b></td>
                <td><a href="${URL_PROJ}#/p/EB-U50" target="_blank"><b>EB-U50</b></a> (WUXGA 3.700 lm)</td>
                <td><a href="${URL_PROJ}#/p/EB-L210W" target="_blank"><b>EB-L210W</b></a> (<b>Laser 4.500 lm</b> WXGA)</td>
                <td><a href="${URL_PROJ}#/p/EB-L260F" target="_blank"><b>EB-L260F</b></a> (<b>Laser 4.600 lm Full HD</b> + Edge Blending)</td>
              </tr>
              <tr>
                <td><b>Aula / Auditorium / Ballroom</b><br><span class="muted">50 – 200+ peserta · Layar 150"–300"</span></td>
                <td><b>5.000 – 5.500 lm</b></td>
                <td><a href="${URL_PROJ}#/p/EB-2155W" target="_blank"><b>EB-2155W</b></a> (5.000 lm WXGA)</td>
                <td><a href="${URL_PROJ}#/p/EB-2065" target="_blank"><b>EB-2065</b></a> (5.500 lm XGA)</td>
                <td><a href="${URL_PROJ}#/p/EB-2265U" target="_blank"><b>EB-2265U</b></a> (<b>5.500 lm WUXGA</b> + HDBaseT + Mirroring)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="pb-card">
        <h3>⚠️ Panduan Pengganti Model Discontinue (EB-X500)</h3>
        <p class="sub">Model <b>EB-X500</b> sudah <i>Discontinued</i> (tidak diproduksi lagi). Arahkan permintaan pelanggan ke:</p>
        <div class="tier-grid">
          <div class="tier-box best">
            <span class="tier-tag" style="background:#d7001522;color:#d70015">Pengganti TKDN Ekonomis</span>
            <h4>Epson EB-E600 (TKDN 55,70%)</h4>
            <div class="tier-meta">SKU: V11H981055 · Cert: 8453/SJ-IND.8/E-TKDN/9/2024</div>
            <p class="pitch">3.400 Lumens XGA, Kontras 15.000:1, Umur lampu 12.000 jam (Eco), HDMI + 2× VGA, fitur Split Screen.</p>
          </div>
          <div class="tier-box best">
            <span class="tier-tag" style="background:#0a84ff22;color:#0a84ff">Pengganti TKDN + LAN / Wi-Fi</span>
            <h4>Epson EB-X600 (TKDN 55,02%)</h4>
            <div class="tier-meta">SKU: V11H982055 · Cert: 8509/SJ-IND.8/E-TKDN/9/2024</div>
            <p class="pitch">3.600 Lumens XGA, Kontras 16.000:1, dilengkapi port jaringan RJ45 LAN, Auto Vertical Keystone, & dukungan Wi-Fi opsional ELPAP11.</p>
          </div>
        </div>
      </div>`;
  }

  function renderTKDN() {
    return `
      <div class="pb-card">
        <h3>🏛️ Aturan Emas Pengadaan Pemerintah (PP 29/2018 &amp; Perpres 12/2021)</h3>
        <p class="sub">Pahami 3 poin regulasi berikut saat berdiskusi dengan PPK / Pokja Pengadaan / Pejabat Pengadaan:</p>
        <div class="tier-grid">
          <div class="tier-box best">
            <span class="tier-tag" style="background:#30d15822;color:#1f8a3c">Aturan Penguncian Wajib</span>
            <h4>TKDN ≥ 25% &amp; (TKDN + BMP) ≥ 40%</h4>
            <p class="pitch">Jika sudah ada produk dalam negeri dengan TKDN ≥ 25% dan total (TKDN + BMP) ≥ 40%, maka instansi pemerintah/BUMN <b>WAJIB</b> membeli produk ber-TKDN tersebut dan menggugurkan produk impor.</p>
          </div>
          <div class="tier-box">
            <span class="tier-tag" style="background:#0a84ff22;color:#0a84ff">Keunggulan BMP Epson</span>
            <h4>Nilai BMP Epson = 13,65%</h4>
            <p class="pitch">PT Indonesia Epson Industry memiliki Bobot Manfaat Perusahaan (BMP) tinggi sebesar <b>13,65%</b>. Artinya produk Epson dengan TKDN 26,35% saja sudah langsung menembus batas wajib <b>40%</b>!</p>
          </div>
          <div class="tier-box">
            <span class="tier-tag" style="background:#af52de22;color:#9140bf">67 TKDN + 12 PDN</span>
            <h4>47 Produk Epson Memiliki TKDN+BMP &gt; 40%</h4>
            <p class="pitch">Dari 79 produk di Katalog TKDN & PDN Epson, sebanyak 47 model memiliki nilai TKDN+BMP di atas 40% (bahkan mencapai <b>75,28%</b> pada EcoTank L3251).</p>
          </div>
        </div>
      </div>

      <div class="pb-card">
        <h3>🏆 Cheat Sheet Produk Pengunci Spesifikasi Tender per Kategori</h3>
        <p class="sub">Gunakan model dengan nilai TKDN+BMP tertinggi ini saat menyusun KAK / spesifikasi teknis bersama user instansi:</p>
        <div class="pb-table-wrap">
          <table class="pb-table">
            <thead>
              <tr>
                <th>Kategori Pengadaan</th>
                <th>Model Juara TKDN</th>
                <th>Total TKDN+BMP</th>
                <th>Nomor Sertifikat Resmi</th>
                <th>Keunggulan Pengunci Spesifikasi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Printer A4 All-in-One Wi-Fi</b></td>
                <td><b>EcoTank L3251</b> (<code>C11CJ67506</code>)</td>
                <td><b style="color:#1f8a3c">75,28%</b></td>
                <td><code>6109/SJ-IND.8/E-TKDN/5/2025</code></td>
                <td>Nilai TKDN+BMP tertinggi (75,28%), Print/Scan/Copy + Wi-Fi Direct + Smart Panel.</td>
              </tr>
              <tr>
                <td><b>Printer A4 All-in-One USB</b></td>
                <td><b>EcoTank L3211</b> (<code>C11CJ68504</code>)</td>
                <td><b style="color:#1f8a3c">66,45%</b></td>
                <td><code>6109/SJ-IND.8/E-TKDN/5/2025</code></td>
                <td>Print/Scan/Copy hemat biaya untuk meja staf administrasi.</td>
              </tr>
              <tr>
                <td><b>Printer A3+ Monokrom Bisnis</b></td>
                <td><b>M15140</b> / <b>M15180</b></td>
                <td><b style="color:#1f8a3c">69,82%</b></td>
                <td><code>6579</code> &amp; <code>6576/SJ-IND.8/TKDN/LVI/06/2026</code></td>
                <td>Cetak, Scan, Copy &amp; Duplex A3 penuh 25 ipm (32 ppm) dengan tinta pigmen 005.</td>
              </tr>
              <tr>
                <td><b>Printer A3+ Warna Bisnis</b></td>
                <td><b>L15150</b> / <b>L15160</b> / <b>L15180</b></td>
                <td><b style="color:#1f8a3c">68,94% / 67,05% / 67,02%</b></td>
                <td><code>5391</code>, <code>6581</code>, <code>6580/.../06/2026</code></td>
                <td>A3 penuh + tinta pigmen 4 warna DURABrite ET (008) tahan air.</td>
              </tr>
              <tr>
                <td><b>MFP Bisnis A4 &amp; A3 (RIPS / Linehead)</b></td>
                <td><b>EM-C800</b> / <b>EM-C8100</b> / <b>AM-C400</b> / <b>AM-M5500</b></td>
                <td><b style="color:#1f8a3c">66,87% / 61,40% / 61,13% / 60,78%</b></td>
                <td><code>10240</code> – <code>10244/SJ-IND.8/TKDN/LVI/08/2026</code></td>
                <td>Teknologi PrecisionCore Heat-Free hemat listrik 85% dibanding fotokopi laser.</td>
              </tr>
              <tr>
                <td><b>Scanner Dokumen A4 (Flatbed+ADF &amp; Sheetfed)</b></td>
                <td><b>DS-1730</b> / <b>DS-570WII</b> / <b>ES-580W</b> / <b>DS-770II</b> / <b>DS-530II</b></td>
                <td><b style="color:#1f8a3c">55,91% – 53,44%</b></td>
                <td><code>10246/.../08/2026</code> &amp; <code>5389–5397/.../06/2026</code></td>
                <td>One-pass duplex cepat (30–85 ppm) dengan deteksi ultrasonik anti-macet.</td>
              </tr>
              <tr>
                <td><b>Proyektor Bisnis &amp; Pendidikan</b></td>
                <td><b>EB-E600</b> / <b>EB-X600</b></td>
                <td><b style="color:#1f8a3c">55,70% / 55,02%</b></td>
                <td><code>8453</code> &amp; <code>8509/SJ-IND.8/E-TKDN/9/2024</code></td>
                <td>Teknologi 3LCD 3.400 &amp; 3.600 lumens XGA, umur lampu 12.000 jam.</td>
              </tr>
              <tr>
                <td><b>Dot Matrix &amp; Passbook</b></td>
                <td><b>LQ-2190</b> / <b>LQ-310</b> / <b>PLQ-35</b> / <b>PLQ-50</b></td>
                <td><b style="color:#0a84ff">40,54% / 38,99% / 35,78% / 35,25%</b></td>
                <td><code>1271/.../4/2024</code> &amp; <code>974/.../3/2024</code></td>
                <td>Standar mutlak administrasi keuangan, pajak, dan buku tabungan bank.</td>
              </tr>
              <tr>
                <td><b>Plotter CAD/GIS &amp; Sublimasi</b></td>
                <td><b>SC-T5130M</b> / <b>SC-T3130</b> / <b>SC-T5435</b> / <b>SC-F531</b></td>
                <td><b style="color:#0a84ff">39,84% – 36,12%</b> (+5 Model PDN)</td>
                <td><code>976</code>, <code>977</code>, <code>1068/SJ-IND.8/E-TKDN/3/2024</code></td>
                <td>Tersedia 24" (A1), 36" (A0), hingga 44" (B0+) termasuk model +Scanner terintegrasi.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderCerts() {
    const q = state.certQ.trim().toLowerCase();
    const list = TKDN_PRODUCTS.filter((p) =>
      (state.certCat === "all" || p.category === state.certCat) &&
      (!q || [p.model, p.name, p.sku, p.certNo, p.totalVal, p.status].join(" ").toLowerCase().includes(q))
    );
    const cats = [
      ["all", "Semua (79)"], ["ecotank", "EcoTank (9)"], ["workforce", "WorkForce (19)"],
      ["scanner", "Scanner (16)"], ["dotmatrix", "Dot Matrix (5)"], ["label", "Label (4)"],
      ["plotter", "Plotter (16)"], ["projector", "Proyektor (2)"], ["ink", "Tinta (8)"]
    ];
    return `
      <div class="pb-card">
        <h3>📋 Tabel Pencarian &amp; Salin Cepat Nomor Sertifikat TKDN (79 Produk)</h3>
        <p class="sub">Data valid efektif per 28 Agustus 2026. Klik tombol <b>Salin</b> untuk menyalin Nomor Sertifikat langsung ke clipboard:</p>
        <div class="decoder-bar" style="justify-content:space-between">
          <div class="wiz-pills">
            ${cats.map(([id, lbl]) => `<button class="sf-pill ${state.certCat === id ? "active" : ""}" data-certcat="${id}">${lbl}</button>`).join("")}
          </div>
          <label class="search" style="width:260px">
            <input id="certSearchInput" type="search" value="${esc(state.certQ)}" placeholder="Cari model / SKU / no. sertifikat…" autocomplete="off" />
          </label>
        </div>
        <div class="pb-table-wrap">
          <table class="pb-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode SKU</th>
                <th>Tipe / Model</th>
                <th>Nilai TKDN</th>
                <th>Nilai BMP</th>
                <th>Total</th>
                <th>Nomor Sertifikat Kemenperin RI</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${list.map((p, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><code>${esc(p.sku)}</code></td>
                  <td><a href="${URL_TKDN}#/p/${encodeURIComponent(p.model)}" target="_blank" rel="noopener"><b>${esc(p.model)}</b></a></td>
                  <td>${esc(p.tkdnVal)}</td>
                  <td>${esc(p.bmpVal)}</td>
                  <td><b style="color:var(--accent)">${esc(p.totalVal)}</b></td>
                  <td><code>${esc(p.certNo)}</code></td>
                  <td>
                    <button class="btn small" style="padding:3px 9px;font-size:11px" data-copy="${esc(p.certNo)}">Salin Sertifikat</button>
                  </td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function renderObjection() {
    const cards = [
      {
        q: "1. \"Kenapa kami harus pindah dari Printer/Fotokopi Laser ke Epson Bisnis Inkjet (EcoTank / WorkForce)?\"",
        a: "<b>Teknologi PrecisionCore Heat-Free Epson tidak membutuhkan pemanas fuser (tidak seperti laser yang menyedot 400–1.500 Watt).</b> Konsumsi listrik Epson hingga <b>85% lebih hemat</b> (cukup 12–50 Watt, bahkan bisa di-backup UPS kecil), komponen aus jauh lebih sedikit, waktu keluar halaman pertama lebih cepat karena tanpa pemanasan, dan tinta pigmen DURABrite ET/005/008 sama-sama 100% tahan air!"
      },
      {
        q: "2. \"Proyektor merek DLP kompetitor harganya sedikit lebih murah dengan klaim lumens yang sama. Apa bedanya?\"",
        a: "<b>Perhatikan Colour Brightness (Kecerahan Warna)!</b> Proyektor 1-chip DLP menggunakan roda warna berputar sehingga kecerahan warnanya sering turun drastis dibanding kecerahan putihnya, serta menimbulkan efek pelangi (<i>Rainbow Effect</i>) yang membuat mata lelah. Proyektor <b>Epson 3LCD menghasilkan 100% Colour Brightness = White Brightness</b> (warna hingga 3× lebih cerah & hidup) dan bebas efek pelangi."
      },
      {
        q: "3. \"Kalau printer Ink Tank jarang dipakai, apakah head-nya mudah mampet?\"",
        a: "Epson menggunakan printhead permanen <b>Micro Piezo / PrecisionCore</b> yang bekerja secara mekanis (tanpa memanaskan tinta sampai mendidih seperti thermal inkjet merek lain). Selama menggunakan tinta orisinal Epson dan dinyalakan secara berkala, printhead sangat awet dan dilindungi <b>garansi resmi hingga 2 tahun (+1 tahun via MyEpson Portal) atau 30.000–50.000 halaman</b>."
      },
      {
        q: "4. \"Pelanggan mencari L3210, L3250, L120, atau L1210 untuk pengadaan / pembelian baru?\"",
        a: "<b>Tipe L3210, L3250, L120, dan L1210 sudah Discontinue serta belum berstatus TKDN/PDN.</b> Arahkan langsung ke pengganti resminya: <b>L3211 (TKDN+BMP 66,45%)</b> dan <b>L3251 (TKDN+BMP 75,28%)</b> dengan Sertifikat <code>6109/SJ-IND.8/E-TKDN/5/2025</code>, atau model generasi baru 2026 <b>L3311 / L3351</b> serta <b>L121 / L1310</b> untuk cetak saja."
      },
      {
        q: "5. \"Klien mencari Proyektor EB-X500 untuk pengadaan sekolah/dinas, tapi barangnya kosong?\"",
        a: "Model <b>EB-X500 sudah resmi Discontinue</b>. Pengganti resminya yang sudah bersertifikat TKDN lebih tinggi dan spesifikasi lebih baru adalah <b>EB-E600 (3.400 lm, TKDN+BMP 55,70%)</b> dan <b>EB-X600 (3.600 lm + RJ45 LAN, TKDN+BMP 55,02%)</b>."
      },
      {
        q: "6. \"Kapan harus menawarkan Proyektor Laser (EB-L210W / L260F) dibanding proyektor lampu biasa?\"",
        a: "Jika proyektor dipakai setiap hari lebih dari 4–6 jam (ruang kuliah, ruang rapat utama, lobby/signage, atau dipasang tinggi di plafon aula). Sumber cahaya Laser bertahan <b>20.000 jam bebas ganti lampu</b>, menyala instan dalam hitungan detik, dan sudah dilengkapi <b>Wi-Fi Built-in + Screen Mirroring + Speaker 16W</b>."
      },
    ];
    return `
      <div class="pb-card">
        <h3>⚡ Amunisi Objection Handling &amp; Competitor Battlecards</h3>
        <p class="sub">Jawaban taktis siap pakai untuk mematahkan keraguan pelanggan dan memenangkan kompetisi di lapangan:</p>
        <div class="battle-grid">
          ${cards.map((c) => `
            <div class="battle-card">
              <div class="battle-q">${c.q}</div>
              <div class="battle-a">${c.a}</div>
            </div>`).join("")}
        </div>
      </div>`;
  }

  function render() {
    renderNav();
    const mod = MODULES.find((m) => m.id === state.sec) || MODULES[0];
    $("#paneTitle").textContent = mod.label;
    $("#hero").innerHTML = `<h2>${esc(mod.label)}</h2><p>${esc(mod.desc)}</p>`;
    const box = $("#playbookContent");
    if (state.sec === "wizard") box.innerHTML = renderWizard();
    else if (state.sec === "ecotank") box.innerHTML = renderEcoTank();
    else if (state.sec === "ink") box.innerHTML = renderInk();
    else if (state.sec === "projector") box.innerHTML = renderProjector();
    else if (state.sec === "tkdn") box.innerHTML = renderTKDN();
    else if (state.sec === "certs") box.innerHTML = renderCerts();
    else if (state.sec === "objection") box.innerHTML = renderObjection();
  }

  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-sec]");
    if (s) { state.sec = s.dataset.sec; toggleDrawer(false); render(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const w = e.target.closest("[data-wiz]");
    if (w) { state.wizKey = w.dataset.wiz; render(); return; }
    const d = e.target.closest("[data-dec]");
    if (d) { state.decModel = d.dataset.dec; render(); return; }
    const cc = e.target.closest("[data-certcat]");
    if (cc) { state.certCat = cc.dataset.certcat; render(); return; }
    const cp = e.target.closest("[data-copy]");
    if (cp) {
      navigator.clipboard?.writeText(cp.dataset.copy);
      toast(`Disalin: ${cp.dataset.copy}`);
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "decInput") {
      state.decModel = e.target.value;
      const parts = decodeEcoTank(state.decModel);
      $("#decOutput").innerHTML = parts.map((p) => `<div class="dec-part"><b>${esc(p.code)}</b><small>${esc(p.label)}</small><span>${esc(p.desc)}</span></div>`).join("");
    }
    if (e.target.id === "certSearchInput") {
      state.certQ = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const el = $("#certSearchInput");
      if (el) { el.focus(); el.setSelectionRange(pos, pos); }
    }
  });

  let tt;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800); }

  render();
})();
