import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Tentang Kami - MangNime",
  description: "Kenali lebih dekat platform streaming anime MangNime.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0B1A] pb-20 pt-10 animate-fade-in relative overflow-hidden">
      {/* Ornamen Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-celestia-sky/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-[1300px] relative z-10">
        {/* Header Title */}
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
            Tentang <span className="text-celestia-pink">MangNime</span>
          </h1>
          <p className="text-gray-400">
            Platform Streaming & Download Anime Tanpa Iklan.
          </p>
        </div>

        {/* IMAGE */}
        <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(76,201,255,0.15)] border border-white/10 mb-12 group">
          <Image
            src="/img/GFX.png"
            alt="MangNime GFX Showcase"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B1A] via-transparent to-transparent opacity-80"></div>
        </div>

        {/* Konten Teks */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 text-gray-300 backdrop-blur-xl leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-celestia-sky rounded-full shadow-glow-blue"></span>
              Siapa Kami?
            </h2>
            <p className="mb-4">
              Selamat datang di <strong>MangNime</strong>! Kami adalah wadah
              bagi para penggemar kultur pop Jepang, khususnya anime, yang
              menginginkan pengalaman menonton yang bersih, modern, dan tanpa
              hambatan.
            </p>
            <p>
              Berawal dari kecintaan terhadap anime dan keresahan terhadap iklan
              yang menggangu serta ketertarikan terhadap tampilan yang elegan,
              MangNime dibangun dari nol untuk memberikan alternatif platform
              streaming yang tidak hanya fungsional, tetapi juga memanjakan mata
              secara visual.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-celestia-lavender rounded-full shadow-glow-purple"></span>
              Visi & Misi
            </h2>
            <p className="mb-4">
              Kami percaya bahwa menonton anime haruslah menjadi kegiatan
              bersantai yang menyenangkan, bukan malah membuat pusing karena
              tampilan web yang berantakan atau <strong>server</strong> yang
              lambat.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>
                <strong className="text-gray-300">Desain Premium:</strong>{" "}
                Menyajikan antarmuka (UI/UX) yang modern, gelap (
                <strong>dark mode</strong>), dan responsif di semua perangkat.
              </li>
              <li>
                <strong className="text-gray-300">Kualitas Terbaik:</strong>{" "}
                Menyediakan berbagai pilihan resolusi mulai dari 360p hingga
                720p/1080p dengan server yang andal.
              </li>
              <li>
                <strong className="text-gray-300">Akses Mudah:</strong> Navigasi
                yang simpel, pencarian cepat, dan fitur penyimpanan riwayat
                (Bookmark) tanpa perlu membuat akun.
              </li>
            </ul>
          </div>

          {/* SECTION HUBUNGI KAMI */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-celestia-pink rounded-full shadow-glow-pink"></span>
              Hubungi Kami
            </h2>
            <p className="mb-6 text-gray-400">
              Ada pertanyaan, saran, atau ingin bekerja sama dengan kami? Jangan
              ragu untuk menghubungi tim MangNime melalui email di bawah ini.
              Kami akan membalas sesegera mungkin.
            </p>
            <a
              href="mailto:pani@mangnime.my.id"
              className="inline-flex items-center gap-3 bg-white/5 hover:bg-celestia-pink/10 border border-white/10 hover:border-celestia-pink/50 px-6 py-4 rounded-2xl transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-celestia-pink/10 border border-celestia-pink/20 flex items-center justify-center text-celestia-pink shrink-0">
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
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">Email Kami</div>
                <div className="text-white font-bold group-hover:text-celestia-pink transition-colors">
                  pani@mangnime.my.id
                </div>
              </div>
              <svg
                className="w-4 h-4 text-gray-600 group-hover:text-celestia-pink group-hover:translate-x-1 transition-all ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          <div className="p-6 bg-black/30 rounded-2xl border border-white/5 text-center mt-6">
            <p className="text-sm text-gray-400 italic">
              "Terima kasih telah memilih MangNime sebagai tempat Anda menonton.
              Kami akan terus berkembang dan memberikan yang terbaik untuk
              komunitas ini."
            </p>
            <p className="font-bold text-white mt-3">
              — MangCoder by Mamang Organization
            </p>
          </div>
        </div>

        {/* Tombol Navigasi */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 hover:border-celestia-pink/50 hover:bg-celestia-pink/10 rounded-full text-white font-bold hover:scale-105 transition-all"
          >
            <svg
              className="w-4 h-4 text-celestia-pink"
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
            Lapor Link Rusak
          </Link>
          <Link
            href="/"
            className="inline-flex px-8 py-3 bg-gradient-to-r from-celestia-royal to-celestia-lavender rounded-full text-white font-bold hover:scale-105 transition-transform shadow-glow-purple"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
