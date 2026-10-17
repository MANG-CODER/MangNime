import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#120E14] border-t border-[#F4B8C6]/15 pt-16 pb-24 lg:pb-10 relative overflow-hidden mt-20">
      {/* Top subtle blush line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#F4B8C6]/50 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link
              href="/"
              prefetch={false}
              className="inline-block relative h-11 w-40"
            >
              <Image
                src="/img/logo.svg"
                alt="MangNime"
                fill
                sizes="160px"
                className="object-contain object-left"
              />
            </Link>
            <p className="text-[#AD9CA6] text-sm leading-relaxed max-w-sm">
              Temukan dunia penuh cerita. Nonton anime subtitle Indonesia dan
              baca komik gratis dengan kualitas HD tanpa iklan yang mengganggu
              di MangNime.
            </p>

            {/* Sosial Media + Email */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href="mailto:pani131335@gmail.com"
                title="Email"
                className="w-9 h-9 rounded-full bg-[#211B24] hover:bg-[#F4B8C6] border border-[#F4B8C6]/20 flex items-center justify-center text-[#AD9CA6] hover:text-[#161218] transition-all"
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
              <a
                href="https://instagram.com/vestiapani_"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-9 h-9 rounded-full bg-[#211B24] hover:bg-[#F4B8C6] border border-[#F4B8C6]/20 flex items-center justify-center text-[#AD9CA6] hover:text-[#161218] transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/vestiapani"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-9 h-9 rounded-full bg-[#211B24] hover:bg-[#F4B8C6] border border-[#F4B8C6]/20 flex items-center justify-center text-[#AD9CA6] hover:text-[#161218] transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <span className="w-px h-5 bg-[#F4B8C6]/15 mx-1" />
              <a
                href="mailto:pani131335@gmail.com"
                className="text-xs text-[#AD9CA6] hover:text-[#F4B8C6] transition-colors font-medium"
              >
                pani131335@gmail.com
              </a>
            </div>
          </div>

          {/* Navigasi Anime */}
          <div className="space-y-4">
            <h4 className="text-[#FDF6F7] font-extrabold text-xs uppercase tracking-[0.18em] flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#F4B8C6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
              Anime
            </h4>
            <ul className="space-y-2.5 text-sm text-[#AD9CA6]">
              {[
                { label: "Ongoing", path: "/ongoing" },
                { label: "Completed", path: "/completed" },
                { label: "Jadwal Rilis", path: "/schedule" },
                { label: "Daftar Genre", path: "/genre" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    prefetch={false}
                    className="hover:text-[#F4B8C6] hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigasi Komik */}
          <div className="space-y-4">
            <h4 className="text-[#FDF6F7] font-extrabold text-xs uppercase tracking-[0.18em] flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#B8C4D4]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Komik
            </h4>
            <ul className="space-y-2.5 text-sm text-[#AD9CA6]">
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
                    prefetch={false}
                    className="hover:text-[#F4B8C6] hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bantuan */}
          <div className="space-y-4">
            <h4 className="text-[#FDF6F7] font-extrabold text-xs uppercase tracking-[0.18em] flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#E88D9E]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-sm text-[#AD9CA6]">
              {[
                { label: "Tentang Kami", path: "/about" },
                { label: "Cara Nonton & Download", path: "/guide" },
                { label: "Syarat & Ketentuan", path: "/terms" },
                { label: "Kebijakan Privasi", path: "/policy" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    prefetch={false}
                    className="hover:text-[#F4B8C6] hover:translate-x-1 transition-all inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/report"
                prefetch={false}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4B8C6]/15 hover:bg-[#F4B8C6] border border-[#F4B8C6]/30 text-[#F4B8C6] hover:text-[#161218] text-xs font-extrabold rounded-full transition-all"
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
        <div className="py-6 border-t border-[#F4B8C6]/10">
          <div className="bg-[#211B24]/60 border border-[#F4B8C6]/15 rounded-2xl px-5 py-4 flex items-start gap-3">
            <svg
              className="w-4 h-4 text-[#F4B8C6] shrink-0 mt-0.5"
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
            <p className="text-xs text-[#AD9CA6] leading-relaxed">
              <span className="text-[#FDF6F7] font-bold">Disclaimer:</span>{" "}
              Situs ini tidak menyimpan file apapun di servernya sendiri. Semua
              konten yang tersedia disediakan oleh pihak ketiga yang tidak
              berafiliasi dengan MangNime. Kami tidak bertanggung jawab atas
              konten yang diunggah atau disediakan oleh pihak ketiga tersebut.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#AD9CA6]">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-[#F4B8C6] font-bold">MangNime</span>. All
            rights reserved.
          </p>
          <p className="text-xs text-[#AD9CA6]/80">
            Made with <span className="text-[#E88D9E]">♥</span> by MangCoder —
            Mamang Organization
          </p>
        </div>
      </div>
    </footer>
  );
}
