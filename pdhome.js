// --- LOGIKA YANG BERJALAN SAAT HALAMAN DIMUAT ---

// 1. Create Stars
const space = document.getElementById("space");

// Kita tambahkan pengecekan "if (space)" agar
// kode tidak error jika elemen #space tidak ditemukan
if (space) {
  const starCount = 200;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDuration = Math.random() * 3 + 2 + "s";
    star.style.animationDelay = Math.random() * 3 + "s";
    space.appendChild(star);
  }

  // 2. Create Shooting Stars
  setInterval(() => {
    const shootingStar = document.createElement("div");
    shootingStar.className = "shooting-star";
    shootingStar.style.left = Math.random() * 100 + "%";
    shootingStar.style.top = Math.random() * 50 + "%";
    space.appendChild(shootingStar);

    setTimeout(() => {
      shootingStar.remove();
    }, 3000);
  }, 3000);
} // Akhir dari "if (space)"

// 3. Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// 4. LOGIKA COMMUNITY SCROLLING GRID
// (Ini yang sebelumnya Anda salah tempatkan di dalam startQuiz)
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// HANYA jalankan animasi jika tidak ada preferensi "reduced motion"
if (!prefersReducedMotion) {
  setupInfiniteScroll(
    document.querySelector(".grid-column.left"),
    "scroll-down"
  );
  setupInfiniteScroll(
    document.querySelector(".grid-column.right"),
    "scroll-up"
  );
}

// --- AKHIR DARI LOGIKA YANG BERJALAN SAAT HALAMAN DIMUAT ---

/* ================================================= */
/* ==       DEFINISI FUNGSI YANG DIGUNAKAN        == */
/* ================================================= */

/**
 * Fungsi startQuiz
 * (Hanya berisi alert, ini sudah benar)
 */
function startQuiz(category) {
  // Baris ini adalah perintah JS untuk "pindah halaman"
  window.location.href = "pdquiz.html";
}

/**
 * Fungsi untuk setup infinite scroll
 * (Definisi fungsi ini harus diletakkan di luar,
 * bukan di dalam fungsi startQuiz)
 */
function setupInfiniteScroll(column, animationClass) {
  // Pastikan elemennya ada
  if (!column) {
    console.warn(`Elemen kolom untuk scroll tidak ditemukan.`);
    return;
  }

  // 1. Duplikasi konten (ini bagian "dinamis"-nya)
  // Ini penting agar animasi bisa looping mulus
  column.innerHTML += column.innerHTML;

  // 2. Tambahkan class animasi untuk memicu CSS
  column.classList.add(animationClass);
}

/**
 * (Tempatkan fungsi carousel testimoni Anda di sini jika ada)
 */
// ... (misal: const testimonialSlider = ...)
// ... (misal: function goToSlide(...) )
