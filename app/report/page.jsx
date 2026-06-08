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

  const mailtoLink = `mailto:pani@mangnime.my.id?subject=${emailSubject}&body=${emailBody}`;

  return (
    <div className="min-h-screen bg-[#0D0B1A] pb-20 pt-10 animate-fade-in relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-celestia-pink/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-celestia-royal/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-[800px] relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-celestia-pink/10 border border-celestia-pink/20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-celestia-pink"
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
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
            Lapor <span className="text-celestia-pink">Link Rusak</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Menemukan video yang tidak bisa diputar, gambar komik yang rusak,
            atau halaman yang error? Bantu kami perbaiki dengan mengirim
            laporan.
          </p>
        </div>

        {/* Cara Melapor */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          {/* Langkah-langkah */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-celestia-sky rounded-full"></span>
              Cara Melapor
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Catat halaman yang bermasalah",
                  desc: "Copy URL halaman yang link atau videonya tidak berfungsi dari address bar browser kamu.",
                  color: "celestia-sky",
                },
                {
                  step: "2",
                  title: "Isi template laporan",
                  desc: "Klik tombol kirim laporan di bawah, template sudah otomatis terisi. Lengkapi bagian yang masih kosong seperti judul anime dan jenis masalahnya.",
                  color: "celestia-lavender",
                },
                {
                  step: "3",
                  title: "Kirim ke email kami",
                  desc: "Setelah template dilengkapi, kirim emailnya. Tim kami akan menindaklanjuti laporan secepatnya.",
                  color: "celestia-pink",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/5"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-${item.color}/10 border border-${item.color}/20 flex items-center justify-center text-${item.color} font-black text-sm shrink-0`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Laporan */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-celestia-lavender rounded-full"></span>
              Template Laporan
            </h2>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {`Judul Anime/Komik  : [isi judul]
Episode/Chapter    : [isi nomor episode atau chapter]
URL Halaman        : [tempel link halaman yang bermasalah]
Jenis Masalah      : [Video tidak muncul / Server error /
                      Gambar rusak / Lainnya]

Keterangan Tambahan:
[Ceritakan lebih detail masalah yang kamu temukan]`}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Template ini sudah otomatis terisi saat kamu klik tombol di bawah.
            </p>
          </div>

          {/* Tombol Kirim */}
          <div className="pt-2">
            <a
              href={mailtoLink}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-celestia-pink to-celestia-lavender text-white font-black rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,100,150,0.3)] transition-all text-base"
            >
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Kirim Laporan via Email
            </a>
            <p className="text-center text-xs text-gray-500 mt-3">
              Akan membuka aplikasi email dengan template yang sudah terisi ke{" "}
              <span className="text-gray-400">pani@mangnime.my.id</span>
            </p>
          </div>
        </div>

        {/* Info tambahan */}
        <div className="mt-6 p-5 bg-celestia-royal/5 border border-celestia-royal/20 rounded-2xl flex gap-4">
          <svg
            className="w-5 h-5 text-celestia-sky shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-gray-400 leading-relaxed">
            Laporan biasanya ditindaklanjuti dalam{" "}
            <strong className="text-gray-300">1–3 hari kerja</strong>. Semakin
            lengkap informasi yang kamu berikan, semakin cepat kami bisa
            memperbaikinya. Terima kasih sudah membantu!
          </p>
        </div>

        {/* Navigasi */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-gray-300 font-bold hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            Tentang Kami
          </Link>
          <Link
            href="/"
            className="inline-flex px-6 py-3 bg-gradient-to-r from-celestia-royal to-celestia-lavender rounded-full text-white font-bold hover:scale-105 transition-transform shadow-glow-purple text-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
