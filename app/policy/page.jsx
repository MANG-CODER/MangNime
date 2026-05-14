import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi - MangNime",
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[#0D0B1A] pb-20 pt-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-[900px]">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
            Kebijakan <span className="text-celestia-pink">Privasi</span>
          </h1>
          <p className="text-gray-400">Privacy Policy MangNime.</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 text-gray-300 backdrop-blur-xl leading-relaxed">
          <p>
            Di MangNime, privasi pengunjung kami adalah prioritas utama. Dokumen
            Kebijakan Privasi ini menguraikan jenis informasi pribadi yang tidak
            kami kumpulkan dan bagaimana kami menggunakan data peramban
            (browser) dasar.
          </p>

          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 pt-4">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p>
            Kami{" "}
            <strong>
              tidak meminta pengguna untuk mendaftar (membuat akun)
            </strong>{" "}
            atau memberikan informasi identifikasi pribadi (seperti nama asli,
            alamat email, atau nomor telepon) untuk menonton atau mengunduh
            konten di MangNime.
          </p>
          <p>
            Untuk fitur seperti <strong>Bookmark (Simpan Episode)</strong>, kami
            menggunakan teknologi{" "}
            <code className="bg-black/30 px-2 py-1 rounded text-celestia-pink text-sm">
              localStorage
            </code>{" "}
            yang menyimpan data riwayat secara lokal di dalam peramban (browser)
            Anda. Data ini tidak pernah dikirim atau disimpan di server kami.
          </p>

          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 pt-4">
            2. Cookies dan Pelacak
          </h2>
          <p>
            Seperti situs web lainnya, MangNime menggunakan "cookies". Cookie
            ini digunakan untuk menyimpan informasi dasar seperti preferensi
            pengunjung guna mengoptimalkan pengalaman pengguna dengan
            menyesuaikan konten halaman web kami.
          </p>

          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 pt-4">
            3. Iklan Pihak Ketiga
          </h2>
          <p>
            Server iklan pihak ketiga atau jaringan iklan dapat menggunakan
            teknologi seperti *cookies*, JavaScript, atau Web Beacons yang
            digunakan dalam iklan dan tautan masing-masing yang muncul di
            MangNime. Mereka secara otomatis menerima alamat IP Anda ketika hal
            ini terjadi. MangNime tidak memiliki akses ke atau kontrol atas
            *cookies* yang digunakan oleh pengiklan pihak ketiga ini.
          </p>

          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 pt-4">
            4. Persetujuan
          </h2>
          <p>
            Dengan menggunakan situs web kami, Anda dengan ini menyetujui
            Kebijakan Privasi kami dan menyetujui syarat-syaratnya.
          </p>
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
