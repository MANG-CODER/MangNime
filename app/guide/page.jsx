import Link from "next/link";

export const metadata = {
  title: "Panduan & Bantuan - MangNime",
  description:
    "Panduan cara menonton, mengunduh anime, dan membaca komik di MangNime.",
};

const Section = ({ color, label }) => (
  <div
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border mb-6 ${
      color === "sky"
        ? "bg-celestia-sky/10 text-celestia-sky border-celestia-sky/20"
        : "bg-celestia-pink/10 text-celestia-pink border-celestia-pink/20"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${color === "sky" ? "bg-celestia-sky" : "bg-celestia-pink"}`}
    ></span>
    {label}
  </div>
);

const QA = ({ color, q, a }) => (
  <div>
    <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-2">
      <span
        className={`shrink-0 mt-0.5 ${color === "sky" ? "text-celestia-sky" : "text-celestia-pink"}`}
      >
        Q:
      </span>
      {q}
    </h3>
    <p className="text-gray-400 leading-relaxed pl-7 border-l-2 border-white/10 ml-2">
      <strong className="text-gray-300">A:</strong> {a}
    </p>
  </div>
);

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#0D0B1A] pb-20 pt-10 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-celestia-sky/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-[900px] relative z-10">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
            Panduan & <span className="text-celestia-sky">Bantuan</span>
          </h1>
          <p className="text-gray-400">
            Pertanyaan yang sering diajukan dan cara penggunaan MangNime.
          </p>
        </div>

        {/* ───── SEKSI ANIME ───── */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 backdrop-blur-xl mb-6">
          <Section color="sky" label="Panduan Anime" />

          <QA
            color="sky"
            q="Bagaimana cara mengatasi video yang error / tidak bisa diputar?"
            a={
              <>
                Jika video tidak memuat (<strong>buffering</strong> lama atau
                error), silakan <strong>scroll</strong> ke bagian bawah video
                player. Kami menyediakan beberapa pilihan{" "}
                <strong>Server Resolusi (360p, 480p, 720p)</strong>. Klik pada
                server lain (misalnya dari OtakuWatch ke VidHide) untuk mencari
                server yang paling lancar sesuai koneksi internet Anda.
              </>
            }
          />

          <QA
            color="sky"
            q="Bagaimana cara mengunduh (Download) episode?"
            a={
              <>
                Kami menyediakan fitur <strong>Download Batch</strong> (unduh
                semua episode sekaligus). Anda bisa menemukan tombol "Unduh
                Sekarang" di bagian paling bawah halaman Detail Anime. Untuk{" "}
                <strong>download</strong> per episode, sebagian besar server
                pemutar video kami memiliki tombol <strong>download</strong>{" "}
                bawaan di dalam layarnya.
              </>
            }
          />

          <QA
            color="sky"
            q="Apakah MangNime berbayar?"
            a="Tidak. MangNime 100% gratis dan bisa diakses kapan saja tanpa perlu berlangganan. Kami sangat menghargai jika Anda terus mendukung kami dengan membagikan web ini ke teman-teman Anda."
          />

          <QA
            color="sky"
            q="Bagaimana cara menyimpan anime ke Bookmark?"
            a={
              <>
                Buka halaman detail anime, lalu klik tombol{" "}
                <strong>Bookmark</strong> (ikon bookmark) di bagian tombol aksi.
                Anime akan tersimpan otomatis di halaman{" "}
                <strong>/bookmark</strong> dan bisa diakses kapan saja meski
                tanpa login.
              </>
            }
          />
        </div>

        {/* ───── SEKSI KOMIK ───── */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 backdrop-blur-xl mb-8">
          <Section color="pink" label="Panduan Komik" />

          <QA
            color="pink"
            q="Bagaimana cara membaca komik di MangNime?"
            a={
              <>
                Buka halaman detail komik, lalu klik tombol{" "}
                <strong>Mulai Baca</strong> untuk langsung ke chapter pertama,
                atau pilih chapter tertentu dari daftar chapter yang tersedia.
                Gambar akan dimuat secara <strong>bertahap</strong> — scroll ke
                bawah dan halaman berikutnya akan otomatis muncul.
              </>
            }
          />

          <QA
            color="pink"
            q="Gambar komik tidak muncul atau rusak, apa yang harus dilakukan?"
            a={
              <>
                Coba <strong>refresh halaman</strong> terlebih dahulu. Jika
                masih tidak muncul, kemungkinan server gambar sedang sibuk —
                tunggu beberapa saat dan coba lagi. Jika masalah berlanjut,
                silakan{" "}
                <Link
                  href="/report"
                  className="text-celestia-pink hover:underline font-semibold"
                >
                  laporkan chapter yang bermasalah
                </Link>{" "}
                agar tim kami segera menindaklanjuti.
              </>
            }
          />

          <QA
            color="pink"
            q="Apakah MangNime menyediakan Manga, Manhwa, dan Manhua?"
            a={
              <>
                Ya! MangNime menyediakan ketiganya. Kamu bisa filter berdasarkan
                jenis melalui halaman <strong>Komik Populer</strong> dengan
                memilih kategori <strong>Manga</strong> (Jepang),{" "}
                <strong>Manhwa</strong> (Korea), atau <strong>Manhua</strong>{" "}
                (Tiongkok) di bagian atas halaman.
              </>
            }
          />

          <QA
            color="pink"
            q="Bagaimana cara melanjutkan bacaan dari chapter terakhir?"
            a={
              <>
                MangNime otomatis menyimpan riwayat bacaan kamu secara lokal.
                Buka halaman detail komik, lalu klik tombol{" "}
                <strong>Lanjut Baca</strong> — kamu akan langsung diarahkan ke
                chapter terakhir yang dibaca tanpa perlu login.
              </>
            }
          />

          <QA
            color="pink"
            q="Bagaimana cara menyimpan komik ke Bookmark?"
            a={
              <>
                Di halaman detail komik atau saat membaca chapter, klik tombol{" "}
                <strong>Bookmark</strong>. Komik akan tersimpan di halaman{" "}
                <strong>/bookmark</strong> bersama anime yang sudah kamu simpan
                sebelumnya.
              </>
            }
          />
        </div>

        {/* CTA Lapor */}
        <div className="mb-8 p-5 bg-celestia-pink/5 border border-celestia-pink/15 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-celestia-pink shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-gray-400">
              Menemukan link atau video yang rusak?{" "}
              <span className="text-gray-300">
                Bantu kami perbaiki dengan mengirim laporan.
              </span>
            </p>
          </div>
          <Link
            href="/report"
            className="shrink-0 px-5 py-2.5 bg-celestia-pink/10 hover:bg-celestia-pink/20 border border-celestia-pink/30 text-celestia-pink text-sm font-bold rounded-xl transition-all whitespace-nowrap"
          >
            Lapor Link Rusak
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
