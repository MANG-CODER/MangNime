# 🌸 MangNime
> **Platform Streaming Anime & Baca Komik Modern**
> Dibuat dengan cinta untuk kaum *wibu* dan penikmat pop-culture, dibalut dengan UI/UX premium kelas atas.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Deno Deploy](https://img.shields.io/badge/Deno_Deploy-000000?style=for-the-badge&logo=deno&logoColor=white)

Halo! 👋 Selamat datang di *repository* **MangNime**.

MangNime bukan sekadar web *streaming* atau *manga reader* biasa. Ini adalah *platform* serba ada yang dirancang khusus agar pengalaman menonton dan membaca terasa lebih elegan, mulus, dan *nggak* bikin mata sakit berkat tema **"Celestia Dark"** — perpaduan warna kosmik gelap dengan aksen *pink* dan *sky blue*.

---

## ✨ Fitur Utama

- **📺 Nonton Santai** — *Streaming* episode anime terbaru dengan berbagai pilihan resolusi dan server.
- **📖 Manga Reader Mulus** — Pengalaman baca komik (*Manga, Manhwa, Manhua*) tanpa jeda mengganggu.
- **🔖 Bookmark & History** — Simpan tontonan favoritmu dan lanjutkan dari episode/chapter terakhir yang ditinggalkan (auto-save).
- **💬 Ruang Diskusi** — Fitur komentar interaktif di tiap anime dan komik menggunakan autentikasi Supabase.
- **📥 Download Batch** — Tersedia link *batch* sekali sedot untuk kaum fakir kuota yang suka marathon.
- **🎨 Premium UI/UX** — Transisi mulus (*smooth fade-in*), efek *glassmorphism*, dan desain responsif (cakep di PC, nyaman di HP).

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Frontend | Next.js 14 (App Router), React.js |
| Styling | Tailwind CSS (Custom Theme "Celestia Dark") |
| Backend & Database | Supabase (PostgreSQL & Auth) |
| Data Anime | Custom REST API |
| Data Komik | [KomikCast Adapter API](https://github.com/vestiapani/KomikcastAPI) — self-hosted di Deno Deploy |

---

## 🏗️ Arsitektur Data Komik

```
MangNime (Next.js)
      ↓  fetch via komikApi.js
KomikCast Adapter API (Deno Deploy)
      ↓  normalize + cache
be.komikcast.cc (backend asli KomikCast)
```

Data komik diambil melalui API adapter sendiri yang di-deploy di Deno Deploy. Adapter ini menangani normalisasi data, in-memory cache, rate limiting, dan sanitasi input — sehingga frontend cukup memanggil satu endpoint yang sudah bersih dan konsisten.

---

## 🚀 Cara Menjalankan di Localhost

### 1. Clone Repository

```bash
git clone https://github.com/MANG-CODER/MangNime.git
cd MangNime
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=link_url_supabase_kamu
NEXT_PUBLIC_SUPABASE_ANON_KEY=kunci_anon_supabase_kamu
NEXT_PUBLIC_KOMIK_API_URL=https://komikcastapi.vestiapani.deno.net/api
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka http://localhost:3000 di browser, dan voila! MangNime siap dinikmati. 🍿

---

## 📁 Struktur Folder Penting

```
MangNime/
├── app/                    ← Next.js App Router (pages & layouts)
│   ├── komik/
│   │   ├── [slug]/         ← Halaman detail komik
│   │   │   └── [chapter]/  ← Halaman baca chapter
│   │   ├── popular/        ← Komik terpopuler + filter kategori
│   │   └── latest/         ← Komik update terbaru
│   └── search/             ← Halaman pencarian (anime & komik)
├── components/
│   ├── komik/              ← KomikCard, KomikActionButtons, dll
│   ├── anime/              ← AnimeCard, HeroCarousel, dll
│   └── ui/                 ← Komponen reusable (Button, BackButton, dll)
├── services/
│   ├── komikApi.js         ← Helper fetch ke KomikCast Adapter API
│   └── api.js              ← Helper fetch ke API anime
└── .env.local              ← Environment variables (tidak di-commit)
```

---

## 🔗 API yang Digunakan

### Komik — KomikCast Adapter API
Self-hosted di Deno Deploy oleh [@vestiapani](https://github.com/vestiapani).
Repo: https://github.com/vestiapani/KomikcastAPI

```javascript
// services/komikApi.js
const KOMIK_API_URL = "https://komikcastapi.vestiapani.deno.net/api";

export const getHomeKomik     = (options = {}) => fetchKomikAPI("/home", 0, options);
export const getLatestKomik   = (page = 1, options = {}) => fetchKomikAPI(`/latest?page=${page}`, 0, options);
export const getPopularKomik  = (page = 1, category = "all", options = {}) => fetchKomikAPI(`/popular?category=${category}&page=${page}`, 0, options);
export const getKomikDetail   = (slug, options = {}) => fetchKomikAPI(`/komik/${slug}`, 0, options);
export const getChapterDetail = (slug, chapterId, options = {}) => fetchKomikAPI(`/komik/${slug}/${chapterId}`, 0, options);
export const searchKomik      = (keyword, options = {}) => fetchKomikAPI(`/advanceSearch?search=${encodeURIComponent(keyword)}`, 0, options);
```

---

## 🤝 Kontribusi & Feedback

Kalau kamu menemukan bug, ada link yang mati, atau punya ide fitur lainnya, jangan sungkan untuk buka **Issue** atau bikin **Pull Request**. Semua masukan sangat diapresiasi!

---

Dibuat oleh [Pani](https://github.com/vestiapani) — Junior Front-End Engineer @ MangCoder

*Stay otaku, stay coding!* 🎮💻
