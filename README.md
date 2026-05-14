# 🌸 MangNime

> **Platform Streaming Anime & Baca Komik Modern** 
> Dibuat dengan cinta untuk kaum *wibu* dan penikmat pop-culture, dibalut dengan UI/UX premium kelas atas.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Halo! 👋 Selamat datang di *repository* **MangNime**. 

MangNime bukan sekadar web *streaming* atau *manga reader* biasa. Ini adalah *platform* serba ada yang dirancang khusus agar pengalaman menonton dan membaca terasa lebih elegan, mulus, dan *nggak* bikin mata sakit berkat tema "Celestia Dark" (perpaduan warna kosmik gelap dengan aksen *pink* dan *sky blue*).

## ✨ Fitur Utama

- **📺 Nonton Santai:** *Streaming* episode Anime terbaru dengan berbagai pilihan resolusi dan server.
- **📖 Manga Reader Mulus:** Pengalaman baca komik (*Manga, Manhwa, Manhua*) tanpa jeda mengganggu.
- **🔖 Bookmark & History:** Simpan tontonan favoritmu, dan *lanjutkan* dari episode/chapter terakhir yang kamu tinggalkan (auto-save).
- **💬 Ruang Diskusi (Komentar):** Fitur komentar interaktif di tiap anime dan komik menggunakan autentikasi Supabase.
- **📥 Download Batch:** Buat kaum kaum fakir kuota yang suka marathon, tersedia link *batch* sekali sedot.
- **🎨 Premium UI/UX:** Transisi mulus (*smooth fade-in*), efek *glassmorphism*, dan desain responsif (cakep di PC, nyaman di HP).

## 🛠️ Tech Stack yang Digunakan

- **Frontend:** Next.js (App Router), React.js
- **Styling:** Tailwind CSS (Custom Theme)
- **Backend & Database:** Supabase (PostgreSQL & Auth)
- **Data Source:** Custom REST API

---

## 🚀 Cara Menjalankan di Localhost

Penasaran pengen coba di komputer sendiri? Yuk, ikuti langkah gampang ini:

### 1. Clone Repository
Siapkan terminal favoritmu, lalu ketik:
```bash
git clone [https://github.com/MANG-CODER/MangNime.git](https://github.com/MANG-CODER/MangNime.git)
cd MangNime
```

### 2. Install Dependencies
Pastikan Node.js sudah terpasang, lalu jalankan:

```bash
npm install
```
### 3. Setup Environment Variables
Biar fitur komentar dan login-nya jalan, kamu butuh Supabase.

Buat file baru bernama .env.local di root folder.

Contek format dari .env.example (kalau ada), atau isi dengan ini:

Cuplikan kode
```
NEXT_PUBLIC_SUPABASE_URL=link_url_supabase_kamu
NEXT_PUBLIC_SUPABASE_ANON_KEY=kunci_anon_supabase_kamu
```
### 4. Gas Nyalakan Server!
```bash
npm run dev
```

Buka http://localhost:3000 di browser, dan voila! MangNime siap dinikmati. 🍿
<br>

## 🤝 Kontribusi & Feedback
Kalau kamu menemukan bug, ada link yang mati, atau punya ide fitur gila lainnya, jangan sungkan untuk buka Issue atau bikin Pull Request. Semua masukan sangat diapresiasi!

Dibuat oleh [Pani](github.com/vestiapani) - Junior Front-End Engineer MangCoder

Stay otaku, stay coding! 🎮💻
