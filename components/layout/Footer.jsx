import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#08060F] border-t border-white/5 pt-16 pb-8 relative overflow-hidden mt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-celestia-lavender to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16 mb-12">
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="inline-block relative h-12 w-40">
              <Image
                src="/img/logo.png"
                alt="MangNime"
                fill
                sizes="(max-width: 768px) 144px, 144px"
                className="object-contain object-left"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-light">
              Temukan dunia penuh keajaiban. Nonton anime subtitle Indonesia
              gratis dengan kualitas HD tanpa iklan yang mengganggu.
              <br />
              <br />
              Harmoni tanpa batas menantimu di MangNime.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-lg flex items-center gap-2">
              <span className="w-1.5 h-5 bg-celestia-lavender rounded-full shadow-glow-lavender"></span>
              Navigasi Anime
            </h4>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              <li>
                <Link
                  href="/ongoing"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Anime Ongoing
                </Link>
              </li>
              <li>
                <Link
                  href="/completed"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Anime Completed
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Jadwal Rilis
                </Link>
              </li>
              <li>
                <Link
                  href="/genre"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Daftar Genre
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Komik */}
          <div className="space-y-6">
            <h4 className="text-white font-black text-lg flex items-center gap-2">
              <span className="w-1.5 h-5 bg-celestia-lavender rounded-full shadow-glow-lavender"></span>
              Navigasi Komik
            </h4>
            <ul className="space-y-3 text-sm font-medium text-gray-400">
              <li>
                <Link
                  href="/komik/latest"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Update Terbaru
                </Link>
              </li>
              <li>
                <Link
                  href="/komik/popular"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Komik Populer
                </Link>
              </li>
              <li>
                <Link
                  href="/komik/genres"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Daftar Genre
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black text-lg flex items-center gap-2">
              <span className="w-1.5 h-5 bg-celestia-lavender rounded-full shadow-glow-lavender"></span>
              Panduan & Bantuan
            </h4>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li>
                <Link
                  href="/about"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Cara Nonton & Download
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Syarat & Ketentuan (ToS)
                </Link>
              </li>
              <li>
                <Link
                  href="/policy"
                  className="hover:text-celestia-lavender hover:translate-x-1 transition-all inline-block"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-heading text-xl font-bold text-white mb-6 tracking-wide">
              Disclaimer
            </h4>
            <p className="text-gray-500 text-xs leading-relaxed font-light">
              Situs ini tidak menyimpan file di servernya sendiri. Semua konten
              disediakan oleh pihak ketiga non-afiliasi.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-light">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-celestia-lavender font-bold">MangNime</span>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
