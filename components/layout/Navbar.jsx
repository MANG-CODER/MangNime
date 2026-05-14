"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/ui/Button";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const getFirstName = (fullName, email) => {
    if (fullName) return fullName.split(" ")[0];
    if (email) return email.split("@")[0];
    return "User";
  };

  const isHome = pathname === "/";

  return (
    <nav className="w-full bg-[#0D0B1A]/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LOGO SVG */}
          <Link
            href="/"
            className="flex-shrink-0 ml-8 md:ml-12 lg:ml-16 transition-transform hover:scale-105"
          >
            <img
              src="/img/logo.png"
              alt="MangNime"
              className="h-8 md:h-10 object-contain"
            />
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-2 text-sm font-heading font-bold">
            {/* BERANDA */}
            <Link
              href="/"
              className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
                isHome
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Beranda
              {isHome && (
                <div className="absolute -bottom-2.5 flex justify-center w-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-celestia-pink opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-celestia-pink"></span>
                  </span>
                </div>
              )}
            </Link>

            {/* MEGA MENU ANIME */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group-hover:bg-white/5 group-hover:text-white">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
                Anime{" "}
                <span className="text-[10px] opacity-50 transition-transform group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div className="absolute top-full left-0 pt-6 w-[700px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-[#151226] border border-white/10 rounded-2xl p-6 shadow-2xl grid grid-cols-2 gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-celestia-royal/10 blur-[80px] rounded-full pointer-events-none"></div>

                  <Link
                    href="/schedule"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center group-hover/item:text-celestia-sky text-gray-400 transition-colors">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">
                        Jadwal Rilis
                      </h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Lihat jadwal tayang anime favoritmu setiap minggunya.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/ongoing"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center group-hover/item:text-celestia-sky text-gray-400 transition-colors">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Ongoing</h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Daftar anime yang sedang tayang pada musim ini.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/completed"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center group-hover/item:text-celestia-sky text-gray-400 transition-colors">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Completed</h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Kumpulan anime yang sudah tamat dan siap ditonton.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/genre"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center group-hover/item:text-celestia-sky text-gray-400 transition-colors">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Genre</h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Eksplorasi berbagai anime berdasarkan genre favoritmu.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* MEGA MENU KOMIK */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group-hover:bg-white/5 group-hover:text-white">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Komik{" "}
                <span className="text-[10px] opacity-50 transition-transform group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div className="absolute top-full left-0 pt-6 w-[700px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="bg-[#151226] border border-white/10 rounded-2xl p-6 shadow-2xl grid grid-cols-2 gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-celestia-pink/10 blur-[80px] rounded-full pointer-events-none"></div>

                  <Link
                    href="/komik/latest"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center group-hover/item:text-celestia-pink text-gray-400 transition-colors">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">
                        Update Terbaru
                      </h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Baca rilisan chapter terbaru dari komik favoritmu.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/komik/popular"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center group-hover/item:text-celestia-pink text-gray-400 transition-colors">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">
                        Komik Populer
                      </h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Daftar komik yang sedang ramai dibaca minggu ini.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/komik/genres"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center group-hover/item:text-celestia-pink text-gray-400 transition-colors">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">
                        Daftar Genre
                      </h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Temukan komik (Manga, Manhwa, Manhua) berdasarkan genre.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/komik/popular?category=manhwa"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-celestia-gold transition-colors shadow-lg">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1 group-hover/item:text-celestia-gold transition-colors">
                        Top Manhwa
                      </h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Lihat jajaran Manhwa Korea terpopuler dengan rating
                        tertinggi saat ini.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/komik/popular?category=manga"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-celestia-pink transition-colors shadow-lg">
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1 group-hover/item:text-celestia-pink transition-colors">
                        Top Manga
                      </h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Eksplorasi komik Jepang pilihan dengan cerita dan art
                        memukau.
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/komik/popular?category=manhua"
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.04] transition-colors group/item"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-gray-400 group-hover/item:text-celestia-sky transition-colors shadow-lg">
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1 group-hover/item:text-celestia-sky transition-colors">
                        Top Manhua
                      </h4>
                      <p className="text-xs text-gray-400 font-body leading-relaxed">
                        Temukan seri Tiongkok (Manhua) penuh aksi, kultivasi,
                        dan artwork memukau.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: SEARCH, BOOKMARK, PROFIL */}
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end max-w-md">
            <SearchBar />

            <Link
              href="/bookmark"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-celestia-pink text-gray-300 hover:text-white transition-all border border-white/10 shrink-0"
              title="Bookmark Saya"
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pr-4 p-1 transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-celestia-pink shrink-0">
                  <img
                    src={
                      user.user_metadata?.avatar_url ||
                      "https://placehold.co/100x100/151226/ffffff?text=U"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-bold text-white truncate max-w-[80px]">
                  {getFirstName(user.user_metadata?.full_name, user.email)}
                </span>
              </Link>
            ) : (
              // ✅ Logic Login Baru
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="px-6 py-2.5 bg-gradient-to-r from-celestia-royal to-celestia-lavender text-white font-bold text-sm rounded-xl hover:scale-105 hover:shadow-glow-purple transition-all text-center flex justify-center"
              >
                LOGIN
              </Link>
            )}
          </div>

          {/* HAMBURGER MENU */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden transition-all duration-300 bg-celestia-night border-b border-white/5 ${isOpen ? "max-h-[85vh] py-4 overflow-y-auto" : "max-h-0 py-0 overflow-hidden border-transparent"}`}
      >
        <div className="container mx-auto px-4 flex flex-col gap-6 pb-20">
          <div className="md:hidden w-full relative z-50">
            <SearchBar />
          </div>

          {/* BAGIAN ANIME */}
          <div className="flex flex-col gap-3 text-sm font-heading">
            <span className="flex items-center gap-2 text-xs text-celestia-sky font-bold tracking-widest uppercase border-b border-white/10 pb-2">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
              Anime
            </span>
            {[
              { label: "Jadwal Rilis", path: "/schedule" },
              { label: "Ongoing", path: "/ongoing" },
              { label: "Completed", path: "/completed" },
              { label: "Genre", path: "/genre" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* BAGIAN KOMIK */}
          <div className="flex flex-col gap-3 text-sm font-heading">
            <span className="flex items-center gap-2 text-xs text-celestia-pink font-bold tracking-widest uppercase border-b border-white/10 pb-2 mt-2">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Komik
            </span>
            {[
              { label: "Update Terbaru", path: "/komik/latest" },
              { label: "Komik Populer", path: "/komik/popular" },
              { label: "Daftar Genre", path: "/komik/genres" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* BAGIAN PROFIL & BOOKMARK */}
          <div className="sm:hidden mt-4 border-t border-white/10 pt-4 flex flex-col gap-4">
            <Link
              href="/bookmark"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-white hover:bg-white/10"
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Bookmark Saya
            </Link>
            {user ? (
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-celestia-pink shrink-0">
                  <img
                    src={
                      user.user_metadata?.avatar_url ||
                      "https://placehold.co/100"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                  <div className="text-xs text-gray-400">Lihat Profil</div>
                </div>
              </Link>
            ) : (
              // ✅ Logic Login Baru (Mobile)
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="px-6 py-2.5 bg-gradient-to-r from-celestia-royal to-celestia-lavender text-white font-bold text-sm rounded-xl hover:scale-105 hover:shadow-glow-purple transition-all text-center flex justify-center"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
