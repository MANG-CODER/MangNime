import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Tentang Kami - MangNime",
  description: "Kenali lebih dekat platform streaming anime & komik MangNime.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#161218] pb-20 pt-8 animate-fade-in relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-[1100px] relative z-10 space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E88D9E]">
            Editorial Profile
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7]">
            Tentang{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              MangNime
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm">
            Platform Streaming Anime &amp; Baca Komik Tanpa Iklan.
          </p>
        </div>

        {/* SHOWCASE BANNER IMAGE */}
        <div className="relative w-full aspect-[21/9] rounded-[32px] overflow-hidden shadow-vogue-card border border-[#F4B8C6]/25 group">
          <Image
            src="/img/GFX.jpg"
            alt="MangNime GFX Showcase"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161218] via-transparent to-transparent opacity-80" />
        </div>

        {/* Konten Teks */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 shadow-vogue-card space-y-8 text-[#FDF6F7]/85 text-sm md:text-base leading-relaxed">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7] mb-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#F4B8C6]" />
              Siapa Kami?
            </h2>
            <p className="mb-3 text-[#AD9CA6]">
              Selamat datang di{" "}
              <strong className="text-[#FDF6F7]">MangNime</strong>! Kami adalah
              wadah bagi para penggemar kultur pop Jepang, Korea, dan
              Tiongkok—khususnya anime serta komik—yang menginginkan pengalaman
              menonton dan membaca yang bersih, modern, dan tanpa hambatan.
            </p>
            <p className="text-[#AD9CA6]">
              Berawal dari kecintaan terhadap anime dan keresahan terhadap iklan
              pop-up yang mengganggu, MangNime dibangun dari nol untuk
              memberikan alternatif platform hiburan yang fungsional sekaligus
              memanjakan mata secara visual.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7] mb-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#B8C4D4]" />
              Visi &amp; Misi
            </h2>
            <p className="mb-4 text-[#AD9CA6]">
              Kami percaya bahwa menikmati anime dan komik haruslah menjadi
              kegiatan bersantai yang menyenangkan:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#AD9CA6] ml-2">
              <li>
                <strong className="text-[#FDF6F7]">
                  Desain Editorial Modern:
                </strong>{" "}
                Menyajikan antarmuka gelap yang nyaman di mata dan responsif di
                perangkat mobile maupun desktop.
              </li>
              <li>
                <strong className="text-[#FDF6F7]">Kualitas Terbaik:</strong>{" "}
                Menyediakan berbagai pilihan resolusi video hingga HD dengan
                multi-server yang andal.
              </li>
              <li>
                <strong className="text-[#FDF6F7]">Akses Mudah:</strong>{" "}
                Pencarian cepat, penyimpanan riwayat otomatis, serta fitur
                Bookmark instan.
              </li>
            </ul>
          </div>

          {/* SECTION HUBUNGI KAMI */}
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7] mb-3 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#E88D9E]" />
              Hubungi Kami
            </h2>
            <p className="mb-5 text-[#AD9CA6]">
              Ada pertanyaan, masukan desain, atau ingin bekerja sama? Jangan
              ragu menghubungi tim MangNime melalui email resmi kami:
            </p>
            <a
              href="mailto:pani131335@gmail.com"
              className="inline-flex items-center gap-3.5 bg-[#161218] hover:bg-[#F4B8C6]/15 border border-[#F4B8C6]/25 px-6 py-4 rounded-2xl transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F4B8C6]/15 border border-[#F4B8C6]/30 flex items-center justify-center text-[#F4B8C6] shrink-0">
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
                <div className="text-[11px] text-[#AD9CA6]">Email Resmi</div>
                <div className="text-[#FDF6F7] font-extrabold group-hover:text-[#F4B8C6] transition-colors">
                  pani131335@gmail.com
                </div>
              </div>
            </a>
          </div>

          <div className="p-6 bg-[#161218] rounded-2xl border border-[#F4B8C6]/15 text-center">
            <p className="font-serif italic text-sm md:text-base text-[#F4B8C6]">
              &ldquo;Terima kasih telah memilih MangNime sebagai tempat Anda
              menikmati cerita favorit. Kami akan terus berkembang untuk
              komunitas ini.&rdquo;
            </p>
            <p className="font-bold text-xs text-[#FDF6F7] mt-2">
              — MangCoder by Mamang Organization
            </p>
          </div>
        </div>

        {/* Tombol Navigasi */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#211B24] border border-[#F4B8C6]/25 hover:border-[#F4B8C6] rounded-full text-[#FDF6F7] text-xs font-extrabold transition-all"
          >
            Lapor Link Rusak
          </Link>
          <Link
            href="/"
            className="inline-flex px-7 py-3 bg-[#F4B8C6] hover:bg-[#f8c7d3] rounded-full text-[#161218] text-xs font-extrabold shadow-vogue-blush transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
