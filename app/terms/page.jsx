import Link from "next/link";

export const metadata = {
  title: "Syarat & Ketentuan - MangNime",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#161218] pb-20 pt-8 animate-fade-in">
      <div className="container mx-auto px-4 md:px-8 max-w-[900px] space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E88D9E]">
            Terms &amp; Conditions
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7]">
            Syarat &amp;{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Ketentuan
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm">
            Terms of Service &amp; DMCA Disclaimer.
          </p>
        </div>

        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 shadow-vogue-card space-y-6 text-[#AD9CA6] text-sm md:text-base leading-relaxed">
          <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] border-b border-[#F4B8C6]/15 pb-2">
            1. Ketentuan Penggunaan
          </h2>
          <p>
            Dengan mengakses dan menggunakan situs MangNime, Anda menerima dan
            setuju untuk mematuhi syarat dan ketentuan layanan ini.
          </p>

          <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] border-b border-[#F4B8C6]/15 pb-2 pt-2">
            2. Disclaimer Hak Cipta (DMCA)
          </h2>
          <p>
            MangNime adalah situs penyedia layanan indeks tautan yang menautkan
            konten ke sumber pihak ketiga.{" "}
            <strong className="text-[#FDF6F7]">
              MangNime TIDAK menyimpan file video, gambar, atau media apa pun di
              server kami sendiri.
            </strong>
          </p>
          <p>
            Semua media yang ditampilkan di-hosting oleh layanan pihak ketiga
            yang tidak berada di bawah kendali langsung MangNime.
          </p>

          <h2 className="text-lg md:text-xl font-extrabold text-[#FDF6F7] border-b border-[#F4B8C6]/15 pb-2 pt-2">
            3. Penghapusan Konten
          </h2>
          <p>
            Jika Anda adalah pemilik hak cipta dan merasa bahwa konten Anda
            telah ditautkan tanpa izin, silakan hubungi layanan penyedia hosting
            pihak ketiga tempat file tersebut disimpan untuk meminta
            penghapusan.
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
