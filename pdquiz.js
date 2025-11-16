/* =================================================================== */
/* --- (BAGIAN 1): ELEMEN DOM & VARIABEL GLOBAL --- */
/* =================================================================== */

// --- Elemen Layar ---
const quizStartScreen = document.getElementById("quiz-start-screen");
const quizActiveScreen = document.getElementById("quiz-active-screen");
const quizResultsScreen = document.getElementById("quiz-results-screen");

// --- Elemen Tombol ---
const startQuizBtn = document.getElementById("start-quiz-btn");

// --- Elemen Quiz Aktif ---
const questionCountText = document.getElementById("question-count");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const answerOptionsContainer = document.getElementById(
  "answer-options-container"
);
const quizTimer = document.getElementById("quiz-timer");

// --- Elemen Layar Hasil ---
const resultScore = document.getElementById("result-score");
const resultDivision = document.getElementById("result-division");
const resultDescription = document.getElementById("result-description");
const secondaryResultsList = document.getElementById("secondary-results-list");

// --- Variabel Status Quiz ---
let currentCategory = "default"; // Kategori yang dipilih
let quizData = []; // Soal akan dimuat di sini
let scores = {}; // Skor akan dibuat secara dinamis
let resultData = {}; // Data hasil akan dimuat di sini

let currentQuestionIndex = 0;
let timerInterval;
let timeRemaining = 300; // 5 menit
const totalTime = 300;

// Definisikan warna di JS agar mudah diubah
const timerColorDefault = "#667eea"; // <-- WARNA BARU (Ungu)
const timerColorLow = "#FF5252"; // <-- WARNA BARU (Merah)

/* =================================================================== */
/* --- (BAGIAN 2): BANK SOAL & DATA MASTER --- */
/* =================================================================== */

// Peta untuk judul & deskripsi di halaman "Mulai Kuis"
const categoryMap = {
  general: {
    title: "Pandu Saya! (Tes Minat)",
    description: "Jawab kuis ini untuk mendapatkan rekomendasi kategori.",
  },
  software: {
    title: "Software & Development",
    description: "Jawab 5 pertanyaan seputar programming, UI/UX, dan EdTech.",
  },
  data: {
    title: "Data & AI",
    description: "Jawab 5 pertanyaan seputar analisis data, Python, dan ML.",
  },
  cybersecurity: {
    title: "Cybersecurity",
    description:
      "Jawab 5 pertanyaan seputar ethical hacking dan forensik digital.",
  },
  marketing: {
    title: "Marketing & Komunikasi",
    description: "Jawab 5 pertanyaan seputar branding, media sosial, dan PR.",
  },
  finance: {
    title: "Finance & Perbankan",
    description:
      "Jawab 5 pertanyaan seputar analisis keuangan dan pasar modal.",
  },
  business: {
    title: "Bisnis & Operasional",
    description:
      "Jawab 5 pertanyaan seputar manajemen proyek, HR, dan strategi.",
  },
  default: {
    title: "Kategori Quiz",
    description: "Jawab pertanyaan untuk menemukan divisi yang cocok.",
  },
};

// Peta untuk data hasil (deskripsi divisi)
// KUNCI-nya (e.g., "web_uiux") harus SAMA dengan di 'masterQuizData'
const masterResultData = {
  // Kategori: software
  web_uiux: {
    name: "Web Dev & UIUX",
    description:
      "Anda seimbang antara logika coding dan empati pengguna. Anda senang membangun produk yang fungsional sekaligus mudah digunakan.",
  },
  ed_tech: {
    name: "Education Technology",
    description:
      "Anda memiliki passion di teknologi sekaligus pendidikan. Anda ingin menciptakan platform yang membuat proses belajar lebih efektif.",
  },

  // Kategori: data
  data_scientist: {
    name: "Python Data Scientists",
    description:
      "Anda seorang problem solver analitis. Anda suka menggunakan model statistik dan machine learning untuk memprediksi masa depan.",
  },
  data_analyst: {
    name: "Data Analyst",
    description:
      "Anda rapi, detail, dan jago visualisasi. Anda senang mengubah data mentah menjadi dashboard dan laporan yang actionable untuk bisnis.",
  },
  machine_learning: {
    name: "Python Machine Learning",
    description:
      "Anda adalah seorang arsitek AI. Anda tidak hanya menganalisis data, tapi juga membangun algoritma yang bisa belajar mandiri.",
  },

  // Kategori: cybersecurity
  pentester: {
    name: "Cybersecurity (Penetration Tester)",
    description:
      "Anda adalah seorang 'detektif' ofensif. Anda dibayar untuk 'meretas' sistem secara etis guna menemukan celah keamanan sebelum penjahat menemukannya.",
  },
  investigator: {
    name: "Cybersecurity Investigator",
    description:
      "Anda adalah seorang 'forensik' defensif. Saat terjadi insiden, Anda melacak jejak digital untuk mencari tahu siapa, apa, dan bagaimana serangan itu terjadi.",
  },
  eth_hacker: {
    name: "Ethical Hacker (Cybersecurity)",
    description:
      "Anda memiliki mindset 'out-of-the-box'. Anda secara kreatif mencari berbagai cara untuk membobol sistem, semuanya demi memperkuat keamanan.",
  },

  // Kategori: marketing
  pr_diplomacy: {
    name: "Digital Public Diplomacy (PR)",
    description:
      "Anda adalah 'wajah' perusahaan. Anda ahli dalam komunikasi, negosiasi, dan membangun citra positif di mata publik dan media.",
  },
  social_media: {
    name: "Digital & Social Media Marketing",
    description:
      "Anda adalah 'suara' perusahaan. Anda paham tren, jago membuat konten, dan senang berinteraksi membangun komunitas online.",
  },
  brand_design: {
    name: "Brand Design & Marketing",
    description:
      "Anda adalah 'jiwa' perusahaan. Anda menentukan identitas visual, dari logo, warna, hingga 'rasa' dari sebuah brand secara keseluruhan.",
  },

  // Kategori: finance
  fin_analyst: {
    name: "Financial Market Analyst",
    description:
      "Anda adalah seorang pengamat pasar. Anda menganalisis tren saham, forex, dan komoditas untuk membuat keputusan investasi yang menguntungkan.",
  },
  bank_finance: {
    name: "Banking & Finance (Company Valuation)",
    description:
      "Anda adalah seorang penilai bisnis. Anda ahli dalam 'membedah' laporan keuangan untuk menentukan nilai sebuah perusahaan (valuasi).",
  },
  asset_mgt: {
    name: "Asset & Liabilities Management",
    description:
      "Anda adalah seorang manajer risiko perbankan. Anda bertugas menyeimbangkan aset dan kewajiban bank agar tetap sehat dan aman.",
  },

  // Kategori: business
  pm: {
    name: "Tech Project Management",
    description:
      "Anda adalah 'kapten' tim. Anda bertugas memastikan proyek berjalan lancar, tepat waktu, dan sesuai anggaran, dari awal hingga akhir.",
  },
  hr: {
    name: "Human Resources (SDM) Analyst",
    description:
      "Anda adalah 'hati' perusahaan. Anda berfokus pada aset terpenting: manusia. Anda menangani rekrutmen, pengembangan, dan kesejahteraan karyawan.",
  },
  legal: {
    name: "Legal Analyst (Tech Law)",
    description:
      "Anda adalah 'perisai' perusahaan. Anda memastikan semua kontrak, produk, dan operasional bisnis mematuhi hukum dan regulasi yang berlaku.",
  },
  biz_digital: {
    name: "Bisnis Digital",
    description:
      "Anda adalah 'ahli strategi' pertumbuhan. Anda mencari peluang pasar baru, model bisnis digital, dan cara inovatif untuk meningkatkan pendapatan.",
  },
  admin: {
    name: "Business Admin & Tech Operation",
    description:
      "Anda adalah 'tulang punggung' perusahaan. Anda sangat teliti dan jago Excel, memastikan semua data administrasi dan operasional berjalan rapi.",
  },
};

// BANK SOAL MASTER
const masterQuizData = {
  // --- Kategori general (Pandu Saya!) ---
  // Poinnya mengarah ke NAMA KATEGORI
  general: [
    {
      question: "Aktivitas apa yang paling Anda nikmati?",
      answers: [
        {
          text: "Mengatur dan menganalisis data dalam spreadsheet.",
          points: { data: 2, finance: 2 },
        },
        {
          text: "Memecahkan teka-teki logika atau menulis kode.",
          points: { software: 2, cybersecurity: 1 },
        },
        {
          text: "Mendesain poster atau layout yang indah.",
          points: { marketing: 2 },
        },
        {
          text: "Berbicara, bernegosiasi, atau memimpin tim.",
          points: { business: 2, marketing: 1 },
        },
      ],
    },
    {
      question: "Anda lebih suka bekerja dengan...",
      answers: [
        {
          text: "Angka dan Laporan.",
          points: { data: 2, finance: 2, business: 1 },
        },
        {
          text: "Sistem, Kode, dan Komputer.",
          points: { software: 2, cybersecurity: 2 },
        },
        {
          text: "Orang dan Ide.",
          points: { business: 2, marketing: 2, software: 1 },
        },
      ],
    },
    {
      question: "Tool apa yang paling menarik bagi Anda?",
      answers: [
        { text: "Code Editor (misal: VS Code)", points: { software: 3 } },
        {
          text: "Spreadsheet (misal: Excel, Google Sheets)",
          points: { data: 2, finance: 1, business: 1 },
        },
        {
          text: "Desain (misal: Figma, Canva)",
          points: { software: 1, marketing: 2 },
        },
        { text: "Terminal / Command Line", points: { cybersecurity: 3 } },
      ],
    },
    {
      question: "Masalah apa yang paling ingin Anda pecahkan?",
      answers: [
        {
          text: "Bagaimana cara melindungi sistem ini dari hacker?",
          points: { cybersecurity: 3 },
        },
        {
          text: "Bagaimana cara membuat produk ini lebih mudah digunakan?",
          points: { software: 3 },
        },
        {
          text: "Bagaimana cara membuat produk ini laku terjual?",
          points: { marketing: 3 },
        },
        {
          text: "Bagaimana cara membuat tim ini bekerja lebih efisien?",
          points: { business: 3 },
        },
      ],
    },
    {
      question: "Lingkungan kerja ideal Anda adalah...",
      answers: [
        {
          text: "Tenang, fokus, dan mendalam (deep work) pada satu masalah.",
          points: { software: 2, data: 2 },
        },
        {
          text: "Dinamis, cepat, dan kolaboratif dengan banyak orang.",
          points: { business: 2, marketing: 2 },
        },
        {
          text: "Analitis, penuh investigasi, dan penuh teka-teki.",
          points: { cybersecurity: 2, data: 1 },
        },
        {
          text: "Struktur, aturan, dan angka yang jelas.",
          points: { finance: 3 },
        },
      ],
    },
  ],

  // --- Kategori software ---
  software: [
    {
      question:
        "Apa yang paling membuat Anda puas dalam sebuah proyek digital?",
      answers: [
        {
          text: "Membangun alur yang logis dan fungsional (coding).",
          points: { web_uiux: 2 },
        },
        {
          text: "Memastikan pengguna merasa nyaman dan mudah (UX).",
          points: { web_uiux: 3, ed_tech: 1 },
        },
        {
          text: "Merancang materi agar mudah dipahami pelajar.",
          points: { ed_tech: 3, web_uiux: 1 },
        },
      ],
    },
    {
      question: "Saat mendesain, apa prioritas utama Anda?",
      answers: [
        {
          text: "Tampilan visual (UI) yang estetik dan menarik.",
          points: { web_uiux: 2 },
        },
        {
          text: "Alur pengguna (UX) yang intuitif dan logis.",
          points: { web_uiux: 3 },
        },
        {
          text: "Kejelasan materi (Instructional Design) agar tidak bingung.",
          points: { ed_tech: 3 },
        },
      ],
    },
    {
      question: "Tool apa yang paling ingin Anda kuasai?",
      answers: [
        {
          text: "Visual Studio Code, GitHub, dan React/Laravel.",
          points: { web_uiux: 3 },
        },
        {
          text: "Figma, Sketch, dan alat user testing.",
          points: { web_uiux: 3, ed_tech: 1 },
        },
        {
          text: "Articulate 360 atau platform Learning Management (LMS).",
          points: { ed_tech: 3 },
        },
      ],
    },
    {
      question: "Masalah apa yang paling menarik untuk Anda pecahkan?",
      answers: [
        {
          text: "Situs web lambat atau memiliki banyak bug.",
          points: { web_uiux: 3 },
        },
        {
          text: "Pengguna bingung saat memakai aplikasi (High Bounce Rate).",
          points: { web_uiux: 3, ed_tech: 1 },
        },
        {
          text: "Siswa/pelajar merasa bosan dengan materi e-learning.",
          points: { ed_tech: 3 },
        },
      ],
    },
    {
      question: "Apa fokus Anda saat membuat website?",
      answers: [
        {
          text: "Arsitektur kode yang bersih dan database yang efisien.",
          points: { web_uiux: 3 },
        },
        {
          text: "Desain responsif dan aksesibilitas untuk semua pengguna.",
          points: { web_uiux: 2, ed_tech: 1 },
        },
        {
          text: "Kurikulum pembelajaran yang terstruktur di dalam platform.",
          points: { ed_tech: 3 },
        },
      ],
    },
  ],

  // --- Kategori data ---
  data: [
    {
      question: "Tugas 'data' apa yang paling Anda sukai?",
      answers: [
        {
          text: "Membuat visualisasi/dashboard untuk laporan bisnis.",
          points: { data_analyst: 3, data_scientist: 1 },
        },
        {
          text: "Memprediksi tren masa depan menggunakan data historis.",
          points: { data_scientist: 3, machine_learning: 1 },
        },
        {
          text: "Merancang algoritma yang bisa belajar mandiri.",
          points: { machine_learning: 3, data_scientist: 2 },
        },
      ],
    },
    {
      question: "Apa output akhir yang paling memuaskan?",
      answers: [
        {
          text: "Dashboard real-time yang jelas untuk manajer.",
          points: { data_analyst: 3 },
        },
        {
          text: "Model prediktif yang akurat dalam laporan riset.",
          points: { data_scientist: 3 },
        },
        {
          text: "Sistem rekomendasi (spt Netflix) yang berfungsi cerdas.",
          points: { machine_learning: 3 },
        },
      ],
    },
    {
      question: "Bahasa/Tools apa yang paling Anda utamakan?",
      answers: [
        {
          text: "SQL dan tools BI (Tableau/Power BI) untuk reporting.",
          points: { data_analyst: 3, data_scientist: 1 },
        },
        {
          text: "Python (Pandas, Scikit-learn) untuk analisis statistik.",
          points: { data_scientist: 3, machine_learning: 1 },
        },
        {
          text: "Python (TensorFlow, PyTorch) untuk deep learning.",
          points: { machine_learning: 3, data_scientist: 1 },
        },
      ],
    },
    {
      question: "Pertanyaan apa yang ingin Anda jawab?",
      answers: [
        {
          text: "'Apa yang terjadi?' (Laporan penjualan, data historis)",
          points: { data_analyst: 3 },
        },
        {
          text: "'Mengapa ini terjadi?' (Analisis regresi, korelasi)",
          points: { data_scientist: 3 },
        },
        {
          text: "'Apa yang akan terjadi selanjutnya?' (Prediksi, forecasting)",
          points: { machine_learning: 3, data_scientist: 2 },
        },
      ],
    },
    {
      question: "Saat melihat dataset, apa yang pertama Anda lakukan?",
      answers: [
        {
          text: "Membersihkan data (cleaning) dan mencari insight cepat.",
          points: { data_analyst: 3 },
        },
        {
          text: "Melakukan 'feature engineering' untuk model statistik.",
          points: { data_scientist: 3 },
        },
        {
          text: "Mempersiapkan data (preprocessing) untuk dilatih oleh model AI.",
          points: { machine_learning: 3 },
        },
      ],
    },
  ],

  // --- Kategori cybersecurity ---
  cybersecurity: [
    {
      question:
        "Saat terjadi 'insiden keamanan', peran apa yang ingin Anda ambil?",
      answers: [
        {
          text: "Mencari celah keamanan sebelum orang jahat menemukannya (Ofensif).",
          points: { pentester: 3, eth_hacker: 3 },
        },
        {
          text: "Mencari tahu siapa pelakunya dan bagaimana dia masuk (Forensik/Defensif).",
          points: { investigator: 3 },
        },
        {
          text: "Menulis kode untuk menambal lubang keamanan (Defensif).",
          points: { eth_hacker: 1, pentester: 1 },
        },
      ],
    },
    {
      question: "Metodologi apa yang paling Anda sukai?",
      answers: [
        {
          text: "Melakukan uji coba 'serangan' formal pada aplikasi web/jaringan.",
          points: { pentester: 3 },
        },
        {
          text: "Mengkloning hard drive dan menganalisis 'image' untuk bukti digital.",
          points: { investigator: 3 },
        },
        {
          text: "Menggunakan 'Social Engineering' atau 'Red Teaming' yang kreatif.",
          points: { eth_hacker: 3 },
        },
      ],
    },
    {
      question: "Tool favorit Anda adalah...",
      answers: [
        {
          text: "Burp Suite atau Metasploit untuk eksploitasi.",
          points: { pentester: 3, eth_hacker: 2 },
        },
        {
          text: "Wireshark atau Autopsy untuk analisis file dan jaringan.",
          points: { investigator: 3 },
        },
        {
          text: "Nmap atau Kali Linux (keseluruhan) untuk eksplorasi.",
          points: { eth_hacker: 3, pentester: 1 },
        },
      ],
    },
    {
      question: "Apa motivasi utama Anda?",
      answers: [
        {
          text: "Sensasi 'menang' saat berhasil membobol sistem yang sulit.",
          points: { eth_hacker: 3, pentester: 2 },
        },
        {
          text: "Keinginan untuk 'keadilan' dan menemukan kebenaran (mencari bukti).",
          points: { investigator: 3 },
        },
        {
          text: "Keinginan untuk 'melindungi' dan membuat sistem lebih kuat.",
          points: { pentester: 2, eth_hacker: 1 },
        },
      ],
    },
    {
      question: "Fokus Anda adalah...",
      answers: [
        {
          text: "Aplikasi Web (Web App Pentesting).",
          points: { pentester: 3 },
        },
        { text: "Jaringan (Network Pentesting).", points: { eth_hacker: 2 } },
        {
          text: "Sistem Operasi dan File (Digital Forensics).",
          points: { investigator: 3 },
        },
      ],
    },
  ],

  // --- Kategori marketing ---
  marketing: [
    {
      question: "Bagaimana cara terbaik membangun 'citra' sebuah perusahaan?",
      answers: [
        {
          text: "Melalui identitas visual (logo, warna) yang konsisten.",
          points: { brand_design: 3, social_media: 1 },
        },
        {
          text: "Melalui interaksi harian yang otentik di media sosial.",
          points: { social_media: 3, pr_diplomacy: 1 },
        },
        {
          text: "Melalui rilis pers dan menjalin hubungan baik dengan media.",
          points: { pr_diplomacy: 3 },
        },
      ],
    },
    {
      question: "Tool apa yang paling sering Anda buka?",
      answers: [
        {
          text: "Adobe Illustrator atau Figma untuk membuat aset visual.",
          points: { brand_design: 3 },
        },
        {
          text: "Hootsuite atau Meta Business Suite untuk menjadwalkan konten.",
          points: { social_media: 3 },
        },
        {
          text: "Platform monitoring media (Meltwater) atau email client.",
          points: { pr_diplomacy: 3 },
        },
      ],
    },
    {
      question: "Apa metrik kesuksesan utama bagi Anda?",
      answers: [
        {
          text: "Brand Recall (Seberapa banyak orang ingat brand kita).",
          points: { brand_design: 3, pr_diplomacy: 1 },
        },
        {
          text: "Engagement Rate (Likes, Comments, Shares).",
          points: { social_media: 3 },
        },
        {
          text: "Media Mentions (Seberapa sering media meliput kita).",
          points: { pr_diplomacy: 3 },
        },
      ],
    },
    {
      question: "Saat terjadi krisis reputasi, apa yang Anda lakukan?",
      answers: [
        {
          text: "Menyiapkan 'holding statement' dan menjadi juru bicara.",
          points: { pr_diplomacy: 3 },
        },
        {
          text: "Memonitor sentimen di media sosial dan merespon keluhan.",
          points: { social_media: 3 },
        },
        {
          text: "Mendesain ulang 'image' brand agar terlihat baru (rebranding).",
          points: { brand_design: 3 },
        },
      ],
    },
    {
      question: "Mana yang lebih penting?",
      answers: [
        { text: "Konsistensi Visual (Estetika).", points: { brand_design: 3 } },
        {
          text: "Konsistensi Suara (Tone & Voice).",
          points: { social_media: 2, pr_diplomacy: 2 },
        },
        {
          text: "Konsistensi Narasi (Cerita Brand).",
          points: { pr_diplomacy: 2, brand_design: 1 },
        },
      ],
    },
  ],

  // --- Kategori finance ---
  finance: [
    {
      question: "Analisis keuangan apa yang paling menarik bagi Anda?",
      answers: [
        {
          text: "Memprediksi pergerakan pasar saham & forex (Market).",
          points: { fin_analyst: 3 },
        },
        {
          text: "Menghitung nilai wajar (valuasi) sebuah perusahaan.",
          points: { bank_finance: 3 },
        },
        {
          text: "Mengelola portofolio aset & liabilitas bank (Risk).",
          points: { asset_mgt: 3 },
        },
      ],
    },
    {
      question: "Lingkungan kerja seperti apa yang Anda sukai?",
      answers: [
        {
          text: "Cepat (fast-paced), penuh adrenalin, memantau berita global.",
          points: { fin_analyst: 3 },
        },
        {
          text: "Analitis (deep-dive), fokus pada laporan keuangan & model Excel.",
          points: { bank_finance: 3, asset_mgt: 1 },
        },
        {
          text: "Strategis, penuh regulasi, dan fokus jangka panjang.",
          points: { asset_mgt: 3, bank_finance: 1 },
        },
      ],
    },
    {
      question: "Tool apa yang paling penting bagi Anda?",
      answers: [
        {
          text: "Bloomberg Terminal atau platform trading lainnya.",
          points: { fin_analyst: 3 },
        },
        {
          text: "Excel yang sangat kompleks untuk 'Financial Modeling'.",
          points: { bank_finance: 3 },
        },
        {
          text: "Software ALM atau manajemen risiko internal.",
          points: { asset_mgt: 3 },
        },
      ],
    },
    {
      question: "Pertanyaan apa yang ingin Anda jawab?",
      answers: [
        {
          text: "'Kapan waktu terbaik untuk membeli atau menjual aset ini?'",
          points: { fin_analyst: 3 },
        },
        {
          text: "'Berapa harga yang pantas untuk perusahaan ini jika dijual?'",
          points: { bank_finance: 3 },
        },
        {
          text: "'Bagaimana jika suku bunga naik? Apakah bank kita aman?'",
          points: { asset_mgt: 3 },
        },
      ],
    },
    {
      question: "Fokus Anda adalah...",
      answers: [
        {
          text: "Pasar Eksternal (Ekonomi Makro).",
          points: { fin_analyst: 3 },
        },
        {
          text: "Perusahaan Spesifik (Ekonomi Mikro/Valuasi).",
          points: { bank_finance: 3 },
        },
        { text: "Internal Bank (Manajemen Risiko).", points: { asset_mgt: 3 } },
      ],
    },
  ],

  // --- Kategori business ---
  business: [
    {
      question:
        "Dalam sebuah tim proyek, masalah apa yang pertama Anda selesaikan?",
      answers: [
        { text: "Proyek 'molor' dari jadwal (Deadline).", points: { pm: 3 } },
        { text: "Konflik antar anggota tim (Manusia).", points: { hr: 3 } },
        { text: "Risiko kontrak atau aturan (Hukum).", points: { legal: 3 } },
        {
          text: "Data operasional berantakan (Administrasi).",
          points: { admin: 3 },
        },
        {
          text: "Target penjualan tidak tercapai (Strategi).",
          points: { biz_digital: 3 },
        },
      ],
    },
    {
      question: "Tool apa yang paling Anda kuasai?",
      answers: [
        {
          text: "Jira, Asana, atau Trello untuk manajemen tugas.",
          points: { pm: 3 },
        },
        {
          text: "Platform HRIS atau survei kepuasan karyawan.",
          points: { hr: 3 },
        },
        {
          text: "Draft dokumen legal atau platform 'e-discovery'.",
          points: { legal: 3 },
        },
        {
          text: "Excel/Google Sheets (Pivot Table, VLOOKUP).",
          points: { admin: 3, biz_digital: 1 },
        },
        {
          text: "Google Analytics atau alat riset pasar.",
          points: { biz_digital: 3 },
        },
      ],
    },
    {
      question: "Apa definisi 'sukses' bagi Anda dalam pekerjaan?",
      answers: [
        {
          text: "Proyek diluncurkan tepat waktu dan sesuai anggaran.",
          points: { pm: 3 },
        },
        {
          text: "Karyawan merasa senang, produktif, dan berkembang.",
          points: { hr: 3 },
        },
        {
          text: "Perusahaan terlindungi dari semua risiko hukum.",
          points: { legal: 3 },
        },
        {
          text: "Semua laporan administrasi 100% akurat dan rapi.",
          points: { admin: 3 },
        },
        {
          text: "Menemukan sumber pendapatan atau pasar baru.",
          points: { biz_digital: 3 },
        },
      ],
    },
    {
      question: "Anda lebih condong ke...",
      answers: [
        { text: "Proses & Struktur (Mengatur).", points: { pm: 2, admin: 2 } },
        { text: "Manusia & Empati (Mendengar).", points: { hr: 3 } },
        { text: "Aturan & Kepatuhan (Menganalisis).", points: { legal: 3 } },
        {
          text: "Peluang & Pertumbuhan (Berinovasi).",
          points: { biz_digital: 3 },
        },
      ],
    },
    {
      question: "Saat rapat, Anda adalah orang yang...",
      answers: [
        {
          text: "Mencatat 'action items' dan 'next steps'.",
          points: { pm: 3 },
        },
        {
          text: "Memastikan semua orang didengar pendapatnya.",
          points: { hr: 3 },
        },
        {
          text: "Menilai apakah ide tersebut melanggar aturan.",
          points: { legal: 3 },
        },
        {
          text: "Menyimpan data dan 'minutes of meeting' (MoM).",
          points: { admin: 3 },
        },
        {
          text: "Membahas strategi 'big picture' dan target.",
          points: { biz_digital: 3 },
        },
      ],
    },
  ],
};

/* =================================================================== */
/* --- (BAGIAN 3): LOGIKA UTAMA & FUNGSI QUIZ --- */
/* =================================================================== */

// --- FUNGSI INI BERJALAN PERTAMA KALI SAAT HALAMAN DIMUAT ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil kategori dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");

  // 2. Tentukan kategori yang valid
  if (categoryParam && masterQuizData[categoryParam]) {
    currentCategory = categoryParam;
    quizData = masterQuizData[currentCategory]; // <-- MEMUAT BANK SOAL YANG TEPAT
    resultData = masterResultData; // (Nanti ini juga bisa difilter)
  } else {
    // Default jika kategori tidak ada atau tidak valid
    currentCategory = "software"; // (Ganti ke 'general' jika Anda sudah punya soalnya)
    quizData = masterQuizData[currentCategory];
    resultData = masterResultData;
  }

  // 3. Update judul & deskripsi di layar "Mulai"
  const categoryInfo = categoryMap[currentCategory] || categoryMap.default;
  const titleElement = document.getElementById("quiz-category-title");
  const descriptionElement = document.getElementById(
    "quiz-category-description"
  );
  if (titleElement) titleElement.innerText = categoryInfo.title;
  if (descriptionElement)
    descriptionElement.innerText = categoryInfo.description;

  // 4. Tambahkan event listener ke tombol "Mulai Quiz"
  if (startQuizBtn) {
    startQuizBtn.addEventListener("click", startQuiz);
  }

  // 5. Muat background bintang
  loadStars();
});

// --- FUNGSI SAAT TOMBOL "MULAI QUIZ" DIKLIK ---
function startQuiz() {
  // Sembunyikan layar mulai, tampilkan layar quiz
  quizStartScreen.classList.add("hidden");
  quizActiveScreen.classList.remove("hidden");

  // Reset status
  currentQuestionIndex = 0;
  scores = {}; // Reset skor
  progressBar.style.width = "0%"; // Reset progress bar

  // Reset & Mulai Timer
  timeRemaining = 300; // 5 menit
  quizTimer.innerText = "05:00";
  // Hapus interval lama jika ada (untuk mencegah bug)
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  // Set state awal yang penuh (360 derajat)
  quizTimer.style.setProperty("--timer-progress", "360deg");
  quizTimer.style.setProperty("--timer-color", timerColorDefault);
  quizTimer.classList.remove("low-time");

  quizTimer.innerText = "05:00";
  clearInterval(timerInterval); // Hapus interval lama (jika ada)
  timerInterval = setInterval(updateTimer, 1000);

  // Tampilkan pertanyaan pertama
  showQuestion();
}

// --- FUNGSI UNTUK MENAMPILKAN PERTANYAAN ---
function showQuestion() {
  // Ambil data pertanyaan saat ini
  const q = quizData[currentQuestionIndex];
  // Update teks pertanyaan
  questionText.innerText = q.question;

  // Update progress bar (berdasarkan jumlah SOAL YANG DIJAWAB)
  const progressPercent = (currentQuestionIndex / quizData.length) * 100;
  progressBar.style.width = `${progressPercent}%`;

  // Update hitungan pertanyaan
  const questionNumber = currentQuestionIndex + 1;
  questionCountText.innerText = `Pertanyaan ${questionNumber} dari ${quizData.length}`;

  // Hapus tombol jawaban sebelumnya
  answerOptionsContainer.innerHTML = "";

  // Buat tombol jawaban baru
  q.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("answer-btn");
    button.addEventListener("click", () => selectAnswer(answer.points));
    answerOptionsContainer.appendChild(button);
  });
}

// --- FUNGSI SAAT JAWABAN DIPILIH ---
function selectAnswer(points) {
  // LOGIKA SKOR DINAMIS:
  // Loop melalui poin dan tambahkan ke objek 'scores'
  // Ini tidak peduli apa nama divisinya (e.g., 'web_uiux' atau 'data_analyst')
  for (const division in points) {
    if (scores[division]) {
      scores[division] += points[division];
    } else {
      scores[division] = points[division];
    }
  }

  // Pindah ke pertanyaan berikutnya
  currentQuestionIndex++;

  // Cek apakah quiz sudah selesai (LOGIKA YANG BENAR)
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    // Selesai! Hentikan timer & tampilkan hasil
    clearInterval(timerInterval); // Hentikan timer lebih awal
    showResults();
  }
}

// --- FUNGSI UNTUK MENGUPDATE TIMER ---
// Ganti fungsi updateTimer() Anda dengan ini
function updateTimer() {
  // Hitung menit dan detik
  const minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;

  // Format detik (e.g., "05")
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // 1. Update Teks Timer
  quizTimer.innerText = `${minutes}:${seconds}`;

  // 2. Hitung Progress (dalam derajat, 360 s/d 0)
  const progressPercentage = timeRemaining / totalTime;
  const progressInDegrees = progressPercentage * 360;

  // 3. Cek jika waktu hampir habis (misal: 30 detik)
  if (timeRemaining <= 30) {
    quizTimer.style.setProperty("--timer-color", timerColorLow);
    quizTimer.classList.add("low-time"); // Tambahkan class untuk animasi pulse
  } else {
    quizTimer.style.setProperty("--timer-color", timerColorDefault);
    quizTimer.classList.remove("low-time"); // Hapus class
  }

  // 4. Update Variabel CSS (Ini yang menggerakkan cincin)
  quizTimer.style.setProperty("--timer-progress", `${progressInDegrees}deg`);

  // 5. Kurangi waktu
  timeRemaining--;

  // 6. Cek jika waktu habis
  if (timeRemaining < 0) {
    clearInterval(timerInterval);
    showResults();
  }
}

// --- FUNGSI UNTUK MENAMPILKAN HASIL AKHIR ---
function showResults() {
  // Hentikan timer (untuk jaga-jaga jika belum berhenti)
  clearInterval(timerInterval);

  // Sembunyikan layar quiz, tampilkan layar hasil
  quizActiveScreen.classList.add("hidden");
  quizResultsScreen.classList.remove("hidden");

  // LOGIKA HASIL DINAMIS:
  // 1. Cari divisi dengan skor tertinggi
  let topDivision = "";
  let highestScore = -1; // Mulai dari -1

  for (const division in scores) {
    if (scores[division] > highestScore) {
      highestScore = scores[division];
      topDivision = division;
    }
  }

  // 2. Hitung total poin maksimum (ASUMSI: 3 poin per soal)
  // (Ini bisa dibuat lebih canggih nanti)
  const totalPointsPossible = quizData.length * 3;
  const percentage = Math.round((highestScore / totalPointsPossible) * 100);

  // 3. Tampilkan hasil utama
  if (topDivision && resultData[topDivision]) {
    resultScore.innerText = `${percentage}%`;
    resultDivision.innerText = resultData[topDivision].name;
    resultDescription.innerText = resultData[topDivision].description;
  } else {
    // Tampilan 'fallback' jika terjadi error
    resultScore.innerText = "N/A";
    resultDivision.innerText = "Tidak Ditemukan";
    resultDescription.innerText =
      "Terjadi kesalahan dalam perhitungan. Silakan coba lagi.";
  }

  // 4. Tampilkan hasil sekunder (divisi lain di kategori ini)
  secondaryResultsList.innerHTML = ""; // Kosongkan list
  for (const division in scores) {
    if (division !== topDivision && resultData[division]) {
      const secondaryPercentage = Math.round(
        (scores[division] / totalPointsPossible) * 100
      );
      const li = document.createElement("li");
      li.innerText = `${resultData[division].name}: ${secondaryPercentage}%`;
      secondaryResultsList.appendChild(li);
    }
  }
}

// --- FUNGSI UNTUK BACKGROUND BINTANG ---
function loadStars() {
  const space = document.getElementById("space");
  if (space) {
    const starCount = 200; // (Anda bisa kurangi jika terlalu berat)
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      // .star harus ada di index.css atau quiz.css
      // Pastikan Anda memuat index.css di pdquiz.html
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDuration = Math.random() * 3 + 2 + "s";
      star.style.animationDelay = Math.random() * 3 + "s";
      space.appendChild(star);
    }
  }
}
