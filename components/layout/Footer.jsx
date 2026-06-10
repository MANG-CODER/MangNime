import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#08060F] border-t border-white/5 pt-16 pb-8 relative overflow-hidden mt-20">
      {/* Top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-celestia-lavender to-transparent opacity-50"></div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block relative h-12 w-40">
              <Image
                src="/img/logo.png"
                alt="MangNime"
                fill
                sizes="160px"
                className="object-contain object-left"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-light">
              Temukan dunia penuh keajaiban. Nonton anime subtitle Indonesia
              gratis dengan kualitas HD tanpa iklan yang mengganggu. Harmoni
              tanpa batas menantimu di MangNime.
            </p>

            {/* Sosial Media + Email */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Email */}
              <a
                href="mailto:pani@mangnime.my.id"
                title="Email"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-celestia-pink hover:border-celestia-pink border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <svg
                  className="w-4 h-4"
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
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/vestiapani"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] border border-white/10 hover:border-transparent flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/vestiapani"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#1877f2] border border-white/10 hover:border-[#1877f2] flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Divider */}
              <span className="w-px h-5 bg-white/10 mx-1"></span>

              {/* Email teks */}
              <a
                href="mailto:pani@mangnime.my.id"
                className="text-xs text-gray-500 hover:text-celestia-pink transition-colors"
              >
                pani@mangnime.my.id
              </a>
            </div>
          </div>

          {/* Navigasi Anime */}
          <div className="space-y-5">
            <h4 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-celestia-sky rounded-full"></span>
              Anime
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: "Ongoing", path: "/ongoing" },
                { label: "Completed", path: "/completed" },
                { label: "Jadwal Rilis", path: "/schedule" },
                { label: "Daftar Genre", path: "/genre" },
                { label: "Movies", path: "/movies" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigasi Komik */}
          <div className="space-y-5">
            <h4 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-celestia-pink rounded-full"></span>
              Komik
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: "Update Terbaru", path: "/komik/latest" },
                { label: "Komik Populer", path: "/komik/popular" },
                { label: "Daftar Genre", path: "/komik/genres" },
                { label: "Top Manga", path: "/komik/popular?category=manga" },
                { label: "Top Manhwa", path: "/komik/popular?category=manhwa" },
                { label: "Top Manhua", path: "/komik/popular?category=manhua" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div className="space-y-5">
            <h4 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-4 bg-celestia-lavender rounded-full"></span>
              Bantuan
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: "Tentang Kami", path: "/about" },
                { label: "Cara Nonton & Download", path: "/guide" },
                { label: "Syarat & Ketentuan", path: "/terms" },
                { label: "Kebijakan Privasi", path: "/policy" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Tombol Lapor Link Rusak */}
            <div className="pt-2">
              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-celestia-pink/10 hover:bg-celestia-pink/20 border border-celestia-pink/20 hover:border-celestia-pink/40 text-celestia-pink text-xs font-bold rounded-xl transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
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
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-6 border-t border-white/5">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 flex items-start gap-3">
            <svg
              className="w-4 h-4 text-gray-600 shrink-0 mt-0.5"
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
            <p className="text-xs text-gray-500 font-light leading-relaxed">
              <span className="text-gray-400 font-semibold">Disclaimer:</span>{" "}
              Situs ini tidak menyimpan file apapun di servernya sendiri. Semua
              konten yang tersedia disediakan oleh pihak ketiga yang tidak
              berafiliasi dengan MangNime. Kami tidak bertanggung jawab atas
              konten yang diunggah atau disediakan oleh pihak ketiga tersebut.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500 font-light">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-celestia-lavender font-bold">MangNime</span>.
            All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Made with ♥ by MangCoder — Mamang Organization
          </p>
        </div>
      </div>
    </footer>
  );
}
