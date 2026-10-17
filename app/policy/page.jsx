import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi - MangNime",
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-[#161218] pb-20 pt-8 animate-fade-in">
      <div className="container mx-auto px-4 md:px-8 max-w-[900px] space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E88D9E]">
            Legal &amp; Privacy
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7]">
            Kebijakan{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Privasi
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm">
            Privacy Policy MangNime.
          </p>
        </div>

        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 shadow-vogue-card space-y-6 text-[#AD9CA6] text-sm md:text-base leading-relaxed">
          <p>
            Di MangNime, privasi pengunjung kami adalah prioritas utama. Dokumen
            Kebijakan Privasi ini menguraikan bagaimana kami mengelola data
            peramban (browser) serta informasi akun komunitas Anda.
          </p>

          <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] border-b border-[#F4B8C6]/15 pb-2 pt-2">
            1. Informasi yang Kami Kumpulkan
          </h2>
          <p>
            Pengguna dapat menonton anime maupun membaca komik tanpa wajib
            membuat akun. Untuk fitur{" "}
            <strong className="text-[#FDF6F7]">Bookmark</strong> dan{" "}
            <strong className="text-[#FDF6F7]">Riwayat Tonton/Baca</strong>,
            kami menggunakan teknologi{" "}
            <code className="bg-[#161218] px-2 py-0.5 rounded-md text-[#F4B8C6] text-xs border border-[#F4B8C6]/20">
              localStorage
            </code>{" "}
            yang menyimpan data secara lokal di perangkat Anda.
          </p>

          <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] border-b border-[#F4B8C6]/15 pb-2 pt-2">
            2. Cookies dan Sesi Login
          </h2>
          <p>
            MangNime menggunakan cookies esensial untuk menjaga sesi autentikasi
            apabila Anda memilih masuk menggunakan akun untuk berdiskusi di
            kolom komentar komunitas.
          </p>

          <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] border-b border-[#F4B8C6]/15 pb-2 pt-2">
            3. Layanan Pihak Ketiga
          </h2>
          <p>
            Pemutar video pihak ketiga yang disematkan pada halaman episode
            mungkin menggunakan cookies mereka sendiri. MangNime tidak memiliki
            kendali atas cookies dari penyedia server pihak ketiga tersebut.
          </p>

          <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] border-b border-[#F4B8C6]/15 pb-2 pt-2">
            4. Persetujuan
          </h2>
          <p>
            Dengan menggunakan situs web kami, Anda menyetujui Kebijakan Privasi
            ini beserta ketentuannya.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex px-8 py-3 bg-[#F4B8C6] text-[#161218] rounded-full text-xs font-extrabold shadow-vogue-blush transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
