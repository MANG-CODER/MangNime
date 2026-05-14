import Link from "next/link";

export const metadata = {
  title: "Panduan & Bantuan - MangNime",
  description: "Panduan cara menonton dan mengunduh anime di MangNime.",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#0D0B1A] pb-20 pt-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-[900px]">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
            Panduan & <span className="text-celestia-sky">Bantuan</span>
          </h1>
          <p className="text-gray-400">
            Pertanyaan yang sering diajukan dan cara penggunaan MangNime.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 backdrop-blur-xl">
          {/* FAQ Item 1 */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-celestia-sky">Q:</span> Bagaimana cara
              mengatasi video yang error / tidak bisa diputar?
            </h3>
            <p className="text-gray-400 leading-relaxed pl-7 border-l-2 border-white/10 ml-2">
              <strong className="text-gray-300">A:</strong> Jika video tidak
              memuat (<strong>buffering</strong> lama atau error), silakan <strong>scroll</strong> ke bagian
              bawah video player. Kami menyediakan beberapa pilihan{" "}
              <strong>Server Resolusi (360p, 480p, 720p)</strong>. Klik pada
              server lain (misalnya dari OtakuWatch ke VidHide) untuk mencari
              server yang paling lancar sesuai koneksi internet Anda.
            </p>
          </div>

          {/* FAQ Item 2 */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-celestia-sky">Q:</span> Bagaimana cara
              mengunduh (Download) episode?
            </h3>
            <p className="text-gray-400 leading-relaxed pl-7 border-l-2 border-white/10 ml-2">
              <strong className="text-gray-300">A:</strong> Kami menyediakan
              fitur <strong>Download Batch</strong> (unduh semua episode
              sekaligus). Anda bisa menemukan tombol "Unduh Sekarang" di bagian
              paling bawah halaman Detail Anime. Untuk <strong>download</strong> per episode,
              sebagian besar server pemutar video kami memiliki tombol
              <strong> download</strong> bawaan di dalam layarnya.
            </p>
          </div>

          {/* FAQ Item 3 */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-celestia-sky">Q:</span> Apakah MangNime
              berbayar?
            </h3>
            <p className="text-gray-400 leading-relaxed pl-7 border-l-2 border-white/10 ml-2">
              <strong className="text-gray-300">A:</strong> Tidak. MangNime 100%
              gratis dan bisa diakses kapan saja tanpa perlu berlangganan. Kami
              sangat menghargai jika Anda terus mendukung kami dengan membagikan
              web ini ke teman-teman Anda.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
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
