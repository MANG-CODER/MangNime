import Link from "next/link";

export const metadata = {
  title: "Panduan & Bantuan - MangNime",
  description:
    "Panduan cara menonton, mengunduh anime, dan membaca komik di MangNime.",
};

const Section = ({ color, label }) => (
  <div
    className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border mb-6 ${
      color === "slate"
        ? "bg-[#B8C4D4]/15 text-[#B8C4D4] border-[#B8C4D4]/30"
        : "bg-[#F4B8C6]/15 text-[#F4B8C6] border-[#F4B8C6]/30"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        color === "slate" ? "bg-[#B8C4D4]" : "bg-[#F4B8C6]"
      }`}
    />
    {label}
  </div>
);

const QA = ({ color, q, a }) => (
  <div>
    <h3 className="text-base md:text-lg font-extrabold text-[#FDF6F7] mb-2.5 flex items-start gap-2">
      <span
        className={`shrink-0 ${
          color === "slate" ? "text-[#B8C4D4]" : "text-[#F4B8C6]"
        }`}
      >
        Q:
      </span>
      {q}
    </h3>
    <p className="text-[#AD9CA6] text-sm leading-relaxed pl-6 border-l-2 border-[#F4B8C6]/20 ml-1">
      <strong className="text-[#FDF6F7]">A:</strong> {a}
    </p>
  </div>
);

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#161218] pb-20 pt-8 animate-fade-in relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-[900px] relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E88D9E]">
            Help Center &amp; FAQ
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7]">
            Panduan &amp;{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Bantuan
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm">
            Pertanyaan yang sering diajukan seputar penggunaan MangNime.
          </p>
        </div>

        {/* ANIME */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 shadow-vogue-card space-y-7">
          <Section color="pink" label="Panduan Streaming Anime" />

          <QA
            color="pink"
            q="Bagaimana cara mengatasi video yang error / tidak bisa diputar?"
            a={
              <>
                Jika video mengalami buffering lama atau tidak memuat, silakan
                gulir ke bagian bawah pemutar video. Kami menyediakan beberapa
                pilihan{" "}
                <strong className="text-[#FDF6F7]">
                  Server &amp; Resolusi (360p, 480p, 720p, 1080p)
                </strong>
                . Klik server alternatif untuk beralih ke server yang paling
                lancar di jaringan Anda.
              </>
            }
          />

          <QA
            color="pink"
            q="Bagaimana cara mengunduh (Download) episode?"
            a={
              <>
                Kami menyediakan fitur{" "}
                <strong className="text-[#FDF6F7]">Download Batch</strong> di
                bagian bawah halaman Detail Anime untuk mengunduh seluruh
                episode sekaligus.
              </>
            }
          />

          <QA
            color="pink"
            q="Apakah MangNime berbayar?"
            a="Tidak. MangNime 100% gratis dan bisa diakses kapan saja tanpa biaya berlangganan."
          />

          <QA
            color="pink"
            q="Bagaimana cara menyimpan anime ke Bookmark?"
            a={
              <>
                Buka halaman detail anime lalu klik tombol{" "}
                <strong className="text-[#FDF6F7]">Simpan</strong>. Anime akan
                tersimpan otomatis di halaman{" "}
                <strong className="text-[#FDF6F7]">/bookmark</strong>.
              </>
            }
          />
        </div>

        {/* KOMIK */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 shadow-vogue-card space-y-7">
          <Section color="slate" label="Panduan Baca Komik" />

          <QA
            color="slate"
            q="Bagaimana cara membaca komik di MangNime?"
            a={
              <>
                Buka halaman detail komik, lalu klik tombol{" "}
                <strong className="text-[#FDF6F7]">Mulai Baca</strong> atau
                pilih nomor chapter dari daftar yang tersedia.
              </>
            }
          />

          <QA
            color="slate"
            q="Gambar komik tidak muncul atau rusak, apa yang harus dilakukan?"
            a={
              <>
                Coba muat ulang (refresh) halaman terlebih dahulu. Jika masalah
                berlanjut, silakan{" "}
                <Link
                  href="/report"
                  className="text-[#F4B8C6] hover:underline font-bold"
                >
                  laporkan chapter yang bermasalah
                </Link>{" "}
                agar tim kami segera memperbaikinya.
              </>
            }
          />

          <QA
            color="slate"
            q="Bagaimana cara melanjutkan bacaan dari chapter terakhir?"
            a={
              <>
                MangNime otomatis mencatat riwayat bacaanmu. Cukup buka halaman
                detail komik atau halaman Profil, lalu klik tombol{" "}
                <strong className="text-[#FDF6F7]">Lanjut Baca</strong>.
              </>
            }
          />
        </div>

        {/* CTA Lapor */}
        <div className="p-6 bg-[#211B24] border border-[#F4B8C6]/25 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-vogue-card">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F4B8C6]/15 text-[#F4B8C6] flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
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
            </div>
            <p className="text-xs md:text-sm text-[#AD9CA6]">
              Menemukan tautan episode atau gambar chapter yang rusak?{" "}
              <span className="text-[#FDF6F7] font-bold">
                Bantu kami perbaiki dengan mengirim laporan.
              </span>
            </p>
          </div>
          <Link
            href="/report"
            className="shrink-0 px-5 py-2.5 bg-[#F4B8C6] text-[#161218] text-xs font-extrabold rounded-full whitespace-nowrap"
          >
            Lapor Link Rusak
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex px-8 py-3 bg-[#211B24] hover:bg-[#2B232F] border border-[#F4B8C6]/25 rounded-full text-[#FDF6F7] text-xs font-extrabold transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
