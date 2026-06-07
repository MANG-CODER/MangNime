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

        {/* IMAGE PLACEHOLDER (Rasio 16:9) */}
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
              Berawal dari kecintaan terhadap anime dan keresahan terhadap iklan yang menggangu serta ketertarikan terhadap tampilan
              yang elegan, MangNime dibangun dari nol untuk memberikan
              alternatif platform streaming yang tidak hanya fungsional, tetapi
              juga memanjakan mata secara visual.
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
              tampilan web yang berantakan atau <strong>server</strong> yang lambat.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-2">
              <li>
                <strong className="text-gray-300">Desain Premium:</strong>{" "}
                Menyajikan antarmuka (UI/UX) yang modern, gelap (<strong>dark mode</strong>),
                dan responsif di semua perangkat.
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

          <div className="p-6 bg-black/30 rounded-2xl border border-white/5 text-center mt-6">
            <p className="text-sm text-gray-400 italic">
              "Terima kasih telah memilih MangNime sebagai tempat Anda menonton.
              Kami akan terus berkembang dan memberikan yang terbaik untuk
              komunitas ini."
            </p>
            <p className="font-bold text-white mt-3">— MangCoder by Mamang Organization</p>
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-10 text-center">
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
