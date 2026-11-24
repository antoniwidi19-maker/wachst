/* =========================================================
   Strata Ridge X — script.js
   Logika interaktif tanpa library eksternal.
   ========================================================= */

// ---------- 0. Util & deteksi "kurangi gerakan" ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n) => String(n).padStart(2, '0');
const fmt = (n) => n.toLocaleString('id-ID');

// ---------- 1. Pasang komponen jam tangan dari <template> ----------
const watchTpl = document.getElementById('watch-tpl');
document.querySelectorAll('[data-watch]').forEach((slot) => {
  slot.appendChild(watchTpl.content.cloneNode(true));
});

// ---------- 2. Jam di layar watch (mengikuti waktu perangkat) ----------
function tickClock() {
  const d = new Date();
  const t = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  document.querySelectorAll('[data-clock]').forEach((el) => (el.textContent = t));
}
tickClock();
setInterval(tickClock, 1000);

// ---------- 3. Hero: jam ikut miring mengikuti kursor ----------
const hero = document.querySelector('.hero');
const heroProduct = document.getElementById('heroProduct');

if (!reduceMotion) {
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;   // -0.5 … 0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    heroProduct.style.setProperty('--ry', `${x * 28}deg`);
    heroProduct.style.setProperty('--rx', `${-y * 20}deg`);
  });
  hero.addEventListener('pointerleave', () => {
    heroProduct.style.setProperty('--rx', '0deg');
    heroProduct.style.setProperty('--ry', '0deg');
  });
}

// ---------- 4. Story: scroll-driven (sticky) ----------
const story = document.querySelector('.story');
const scenes = [...document.querySelectorAll('.scene')];
const dots = [...document.querySelectorAll('.story-dots span')];

// Angka naik dari 0 ke nilai data-count (easeOutCubic)
function countUp(el) {
  const target = Number(el.dataset.count);
  if (reduceMotion) {
    el.textContent = fmt(target);
    return;
  }
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

scenes.forEach((s) => (s.querySelector('.big').textContent = '0'));

function updateStory() {
  const rect = story.getBoundingClientRect();
  const total = story.offsetHeight - window.innerHeight;
  const p = Math.min(1, Math.max(0, -rect.top / total)); // progres 0 → 1
  story.style.setProperty('--p', p.toFixed(4));          // dipakai CSS untuk rotasi

  const idx = Math.min(scenes.length - 1, Math.floor(p * scenes.length));
  scenes.forEach((s, i) => {
    const active = i === idx;
    s.classList.toggle('active', active);
    if (active && !s.dataset.done) {
      s.dataset.done = '1';
      countUp(s.querySelector('.big'));
    }
  });
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}

// ---------- 5. Elemen muncul saat masuk layar ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal-up').forEach((el) => io.observe(el));

// Spesifikasi muncul bertahap (stagger)
document.querySelectorAll('.spec-grid > div').forEach((el, i) => {
  el.style.transitionDelay = `${i * 90}ms`;
});

// ---------- 6. Dashboard metrik live (simulasi) ----------
const GOAL_KM = 10;
const RING_C = 2 * Math.PI * 50;                  // keliling lingkaran r = 50
const ringFg = document.getElementById('ringFg');
const ringPct = document.getElementById('ringPct');
const distEl = document.getElementById('dist');
const timerEl = document.getElementById('timer');
const bpmEl = document.getElementById('bpm');
const hrLine = document.getElementById('hrLine');

ringFg.style.strokeDasharray = RING_C;
ringFg.style.strokeDashoffset = RING_C;          // mulai dari kosong

let seconds = 0;
let km = 0;
let bpm = 120;
const hrHistory = Array.from({ length: 40 }, () => 110 + Math.random() * 20);

function drawHeartRate() {
  const points = hrHistory.map((v, i) => {
    const x = (i / (hrHistory.length - 1)) * 300;
    const y = 70 - ((v - 90) / 80) * 60;          // petakan 90–170 bpm ke sumbu Y
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  hrLine.setAttribute('points', points.join(' '));
}

function tickMetrics() {
  seconds += 1;
  km += 0.0025 + Math.random() * 0.0015;
  bpm = Math.min(168, Math.max(96, bpm + (Math.random() * 10 - 5)));

  hrHistory.push(bpm);
  hrHistory.shift();

  const pct = Math.min(1, km / GOAL_KM);
  ringFg.style.strokeDashoffset = RING_C * (1 - pct);
  ringPct.textContent = `${Math.round(pct * 100)}%`;

  distEl.textContent = km.toFixed(2).replace('.', ',');
  timerEl.textContent =
    `${pad(Math.floor(seconds / 3600))}:` +
    `${pad(Math.floor((seconds % 3600) / 60))}:` +
    `${pad(seconds % 60)}`;
  bpmEl.textContent = Math.round(bpm);
  drawHeartRate();
}

drawHeartRate();
setInterval(tickMetrics, 1000);

// ---------- 7. Pemilih warna tali ----------
const bandsProduct = document.getElementById('bandsProduct');
const swatches = [...document.querySelectorAll('.swatch')];

swatches.forEach((btn) => {
  btn.addEventListener('click', () => {
    swatches.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-checked', String(isActive));
    });
    bandsProduct.style.setProperty('--band', btn.dataset.color);
  });
});

// ---------- 8. Tombol beli (demo, tanpa backend) ----------
const toast = document.getElementById('toast');
let toastTimer;

document.getElementById('buyBtn').addEventListener('click', () => {
  toast.textContent = 'Ditambahkan ke keranjang (demo) ✓';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
});

// ---------- 9. Scroll global: progress bar, navbar, dan story ----------
const bar = document.getElementById('progress');
const nav = document.getElementById('nav');

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  nav.classList.toggle('scrolled', window.scrollY > 40);
  updateStory();
}

let ticking = false;
window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  },
  { passive: true }
);
window.addEventListener('resize', onScroll);
onScroll();
