import Link from "next/link";

export const metadata = {
  title: "Lapor Link Rusak - MangNime",
  description:
    "Temukan link atau video yang rusak? Laporkan ke tim MangNime agar segera diperbaiki.",
};

export default function LaporPage() {
  const emailSubject = encodeURIComponent("[LAPORAN] Link Rusak - MangNime");
  const emailBody = encodeURIComponent(
    `Halo Tim MangNime,

Saya ingin melaporkan link/video yang tidak bisa diputar. Berikut detailnya:

━━━━━━━━━━━━━━━━━━━━━━━━
DETAIL LAPORAN
━━━━━━━━━━━━━━━━━━━━━━━━

Judul Anime/Komik  : [isi judul]
Episode/Chapter    : [isi nomor episode atau chapter]
URL Halaman        : [tempel link halaman yang bermasalah]
Jenis Masalah      : [Video tidak muncul / Server error / Gambar rusak / Lainnya]

Keterangan Tambahan:
[Ceritakan lebih detail masalah yang kamu temukan]

━━━━━━━━━━━━━━━━━━━━━━━━

Terima kasih sudah membantu MangNime menjadi lebih baik!`,
  );

  const mailtoLink = `mailto:pani131335@gmail.com?subject=${emailSubject}&body=${emailBody}`;

  const steps = [
    {
      step: "01",
      title: "Catat halaman yang bermasalah",
      desc: "Salin URL halaman anime atau chapter komik yang bermasalah dari address bar browser kamu.",
    },
    {
      step: "02",
      title: "Lengkapi template laporan",
      desc: "Klik tombol Kirim Laporan di bawah. Template otomatis terisi, kamu cukup melengkapi judul dan kendalanya.",
    },
    {
      step: "03",
      title: "Kirim ke email tim MangNime",
      desc: "Setelah terkirim, tim kami akan segera memeriksa dan memperbarui server terkait.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#161218] pb-20 pt-8 animate-fade-in relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-[820px] relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#211B24] border border-[#F4B8C6]/30 flex items-center justify-center mx-auto mb-3 text-[#F4B8C6]">
            <svg
              className="w-7 h-7"
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
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7]">
            Lapor{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Link Rusak
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm max-w-lg mx-auto">
            Menemukan video yang tidak bisa diputar atau gambar komik yang gagal
            dimuat? Bantu kami memperbaikinya.
          </p>
        </div>

        {/* Konten Utama */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 shadow-vogue-card space-y-8">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] mb-5">
              Langkah Pelaporan
            </h2>
            <div className="space-y-3.5">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 p-4 bg-[#161218] rounded-2xl border border-[#F4B8C6]/15"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F4B8C6]/15 border border-[#F4B8C6]/35 flex items-center justify-center text-[#F4B8C6] font-serif italic font-bold text-sm shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-[#FDF6F7] font-bold text-sm mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-[#AD9CA6] text-xs md:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Laporan */}
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] mb-3">
              Pratinjau Template Email
            </h2>
            <div className="bg-[#161218] border border-[#F4B8C6]/20 rounded-2xl p-5 font-mono text-xs md:text-sm text-[#FDF6F7]/85 leading-relaxed whitespace-pre-wrap">
              {`Judul Anime/Komik  : [isi judul]
Episode/Chapter    : [isi nomor episode atau chapter]
URL Halaman        : [tempel link halaman yang bermasalah]
Jenis Masalah      : [Video tidak muncul / Server error / Gambar rusak]

Keterangan Tambahan:
[Ceritakan lebih detail masalah yang kamu temukan]`}
            </div>
          </div>

          {/* Tombol Kirim */}
          <div className="pt-2">
            <a
              href={mailtoLink}
              className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold rounded-full shadow-vogue-blush active:scale-98 transition-all text-xs md:text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Kirim Laporan via Email
            </a>
            <p className="text-center text-[11px] text-[#AD9CA6] mt-3">
              Otomatis membuka aplikasi email menuju{" "}
              <span className="text-[#F4B8C6] font-bold">
                pani131335@gmail.com
              </span>
            </p>
          </div>
        </div>

        {/* Navigasi */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/about"
            className="px-6 py-2.5 bg-[#211B24] border border-[#F4B8C6]/20 rounded-full text-[#AD9CA6] hover:text-[#FDF6F7] font-bold text-xs transition-all"
          >
            Tentang Kami
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 bg-[#F4B8C6] text-[#161218] rounded-full font-extrabold text-xs shadow-vogue-blush transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
