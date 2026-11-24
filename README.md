# Strata Ridge X — Landing Page Smartwatch

Landing page produk bergaya dark-mode dengan animasi scroll, jam tangan berbasis CSS yang bisa diputar, dashboard metrik live, dan pemilih warna tali. Dibuat dengan **HTML, CSS, dan JavaScript murni**, tanpa framework dan tanpa build tool.

> Demo: `https://USERNAME.github.io/REPO-NAME/` (ganti setelah deploy)

## ✨ Fitur

- **Hero interaktif**: jam tangan miring mengikuti kursor (efek 3D tilt) dan melayang pelan.
- **Story pinned**: saat di-scroll, produk berputar 360° dan angka di sebelahnya naik otomatis.
- **Dashboard live**: cincin progres, jarak, timer, dan grafik detak jantung yang bergerak (simulasi).
- **Pemilih tali**: klik warna untuk mengganti tali dengan transisi halus.
- **Animasi muncul bertahap**: elemen fade-in saat masuk layar (IntersectionObserver).
- **Jam asli**: layar jam di watch menampilkan waktu perangkat.
- **Responsif**: menyesuaikan HP, tablet, dan desktop.
- **Ramah aksesibilitas**: menghormati pengaturan *reduce motion* di perangkat.

## 📁 Struktur Folder

```
strata-ridge-x/
├── index.html          # Struktur halaman
├── style.css           # Styling & animasi
├── script.js           # Logika interaktif
├── README.md           # Dokumentasi ini
├── .gitignore
└── .github/
    └── workflows/
        └── pages.yml   # (opsional) deploy otomatis
```

## 🚀 Menjalankan Lokal

Tidak perlu install apa pun:

1. Download atau clone repo ini.
2. Buka `index.html` langsung di browser, **atau** jalankan server lokal:

```bash
python -m http.server 8000
# lalu buka http://localhost:8000
```

## 🌐 Deploy ke GitHub Pages

### Cara A: Paling mudah (tanpa workflow)
1. Push semua file ke branch `main`.
2. Buka repo → **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Source: Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu 1–2 menit. Website tersedia di `https://USERNAME.github.io/REPO-NAME/`.

### Cara B: Pakai workflow (otomatis setiap push)
1. Pastikan file `.github/workflows/pages.yml` sudah ada di repo.
2. Buka **Settings → Pages**, lalu pada **Source** pilih **GitHub Actions**.
3. Setiap push ke `main` akan men-deploy ulang secara otomatis.

> Pilih salah satu cara saja.

## 🛠️ Kustomisasi

| Yang diubah | Di mana |
|---|---|
| Warna aksen | `--accent` di `style.css` |
| Warna tali default | `--band` di `:root` (`style.css`) dan `data-color` di `index.html` |
| Nama produk & teks | `index.html` |
| Harga | Section `#beli` di `index.html` |
| Kecepatan putar produk | `.story { height: 380vh }`, makin besar makin lambat |
| Target jarak dashboard | `GOAL_KM` di `script.js` |
| Angka yang naik | Atribut `data-count` di `index.html` |

## 🧩 Cara Kerja Singkat

- **Jam tangan** dibuat dari satu `<template>` lalu di-clone ke tiga tempat oleh `script.js`, jadi markup-nya tidak diulang.
- **Scroll story** memakai `position: sticky` dan variabel CSS `--p` (0 → 1) yang dihitung dari posisi scroll.
- **Rotasi produk** memakai `transform: rotateY(calc(var(--p) * 360deg))`.

## ⚠️ Catatan

- Nama produk, harga, dan spesifikasi bersifat **fiktif** untuk keperluan demo.
- Font Inter diambil dari Google Fonts. Tanpa internet, halaman tetap jalan dengan font cadangan.
- Data dashboard (jarak, detak jantung) adalah **simulasi**, bukan data sensor asli.

## 📄 Lisensi

MIT. Silakan dipakai, diubah, dan dibagikan. Untuk menambahkannya, klik **Add file → Create new file** di GitHub, beri nama `LICENSE`, lalu pilih template *MIT License*.
