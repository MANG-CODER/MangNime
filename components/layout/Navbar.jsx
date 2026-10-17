"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SearchBar from "./SearchBar";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  const menuContainerRef = useRef(null);
  const homeRef = useRef(null);
  const animeRef = useRef(null);
  const komikRef = useRef(null);
  const scheduleRef = useRef(null);

  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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

  const isHomeSection = pathname === "/";
  const isScheduleSection = pathname.startsWith("/schedule");
  const isAnimeSection = [
    "/ongoing",
    "/completed",
    "/genre",
    "/anime",
    "/episode",
    "/batch",
  ].some((p) => pathname.startsWith(p));
  const isKomikSection = ["/komik"].some((p) => pathname.startsWith(p));

  const movePillToActive = useCallback(() => {
    let activeRef = null;
    if (isHomeSection) activeRef = homeRef.current;
    else if (isAnimeSection) activeRef = animeRef.current;
    else if (isKomikSection) activeRef = komikRef.current;
    else if (isScheduleSection) activeRef = scheduleRef.current;

    if (activeRef) {
      setPillStyle({
        left: activeRef.offsetLeft,
        width: activeRef.offsetWidth,
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [isHomeSection, isAnimeSection, isKomikSection, isScheduleSection]);

  useEffect(() => {
    const timer = setTimeout(movePillToActive, 100);
    window.addEventListener("resize", movePillToActive);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", movePillToActive);
    };
  }, [movePillToActive]);

  const handleMouseEnter = (e) => {
    setPillStyle({
      left: e.currentTarget.offsetLeft,
      width: e.currentTarget.offsetWidth,
      opacity: 1,
    });
  };

  return (
    <>
      <nav
        className={`w-full sticky z-50 transition-all duration-300 ${
          isNavVisible
            ? "top-0 translate-y-0 opacity-100"
            : "-top-24 -translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#161218]/85 backdrop-blur-2xl border-b border-[#F4B8C6]/15">
          <div className="container mx-auto px-4 md:px-8 max-w-[1400px] h-16 md:h-20 flex items-center justify-between gap-4">
            {/* KIRI: LOGO */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                prefetch={false}
                className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.03]"
              >
                <Image
                  src="/img/logo.svg"
                  alt="MangNime"
                  width={145}
                  height={38}
                  priority
                  className="h-8 md:h-9 object-contain w-auto"
                />
              </Link>
            </div>

            {/* TENGAH: MAGNETIC SLIDING CAPSULE MENU */}
            <div
              ref={menuContainerRef}
              onMouseLeave={movePillToActive}
              className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-[#211B24]/90 border border-[#F4B8C6]/20 relative shadow-vogue-card"
            >
              {/* Magnetic Sliding Pill */}
              <div
                className="absolute top-1.5 bottom-1.5 rounded-full bg-gradient-to-r from-[#F4B8C6]/20 to-[#E88D9E]/20 border border-[#F4B8C6]/40 transition-all duration-300 ease-out z-0 pointer-events-none"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                  opacity: pillStyle.opacity,
                }}
              />

              {/* BERANDA */}
              <Link
                href="/"
                prefetch={false}
                ref={homeRef}
                onMouseEnter={handleMouseEnter}
                className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-colors ${
                  isHomeSection
                    ? "text-[#FDF6F7]"
                    : "text-[#AD9CA6] hover:text-[#FDF6F7]"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${isHomeSection ? "text-[#F4B8C6]" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Beranda
              </Link>

              {/* MEGA MENU ANIME */}
              <div
                ref={animeRef}
                onMouseEnter={handleMouseEnter}
                className="relative group flex items-stretch"
              >
                <button
                  className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-colors group-hover:text-[#FDF6F7] ${
                    isAnimeSection ? "text-[#FDF6F7]" : "text-[#AD9CA6]"
                  }`}
                >
                  <svg
                    className={`w-3.5 h-3.5 ${isAnimeSection ? "text-[#F4B8C6]" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                    <polyline points="17 2 12 7 7 2" />
                  </svg>
                  Anime
                  <svg
                    className="w-3 h-3 opacity-60 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Anime */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[560px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-[#211B24]/95 backdrop-blur-2xl border border-[#F4B8C6]/25 rounded-3xl p-5 shadow-vogue-card relative overflow-hidden">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F4B8C6]/10">
                      <span className="font-serif italic text-xs text-[#F4B8C6]">
                        Katalog Streaming Anime
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#AD9CA6] font-bold">
                        Sub Indo HD
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        {
                          title: "Jadwal Rilis",
                          desc: "Kalender tayang anime mingguan",
                          href: "/schedule",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          ),
                        },
                        {
                          title: "Sedang Tayang (Ongoing)",
                          desc: "Daftar anime rilis musim ini",
                          href: "/ongoing",
                          icon: (
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                          ),
                        },
                        {
                          title: "Selesai Tayang (Completed)",
                          desc: "Kumpulan anime tamat siap maraton",
                          href: "/completed",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ),
                        },
                        {
                          title: "Eksplorasi Genre",
                          desc: "Temukan anime sesuai genre favorit",
                          href: "/genre",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          ),
                        },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={false}
                          className="group/item flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#F4B8C6]/[0.08] border border-transparent hover:border-[#F4B8C6]/20 transition-all"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#161218] border border-[#F4B8C6]/20 flex items-center justify-center shrink-0 text-[#F4B8C6] group-hover/item:bg-[#F4B8C6] group-hover/item:text-[#161218] transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              {item.icon}
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#FDF6F7] group-hover/item:text-[#F4B8C6] transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#AD9CA6] mt-0.5 leading-snug">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* MEGA MENU KOMIK */}
              <div
                ref={komikRef}
                onMouseEnter={handleMouseEnter}
                className="relative group flex items-stretch"
              >
                <button
                  className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-colors group-hover:text-[#FDF6F7] ${
                    isKomikSection ? "text-[#FDF6F7]" : "text-[#AD9CA6]"
                  }`}
                >
                  <svg
                    className={`w-3.5 h-3.5 ${isKomikSection ? "text-[#F4B8C6]" : ""}`}
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
                  <svg
                    className="w-3 h-3 opacity-60 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-[#211B24]/95 backdrop-blur-2xl border border-[#F4B8C6]/25 rounded-3xl p-5 shadow-vogue-card">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F4B8C6]/10">
                      <span className="font-serif italic text-xs text-[#F4B8C6]">
                        Arsip Manga, Manhwa &amp; Manhua
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#AD9CA6] font-bold">
                        Bahasa Indonesia
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
                      {[
                        {
                          title: "Update Terbaru",
                          desc: "Chapter komik rilis hari ini",
                          href: "/komik/latest",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ),
                        },
                        {
                          title: "Komik Populer",
                          desc: "Paling ramai dibaca minggu ini",
                          href: "/komik/popular",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                            />
                          ),
                        },
                        {
                          title: "Daftar Genre",
                          desc: "Telusuri komik per kategori",
                          href: "/komik/genres",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          ),
                        },
                        {
                          title: "Manhwa (Korea)",
                          desc: "Webtoon vertikal full color",
                          href: "/komik/advanced-search?format=manhwa",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          ),
                        },
                        {
                          title: "Manhua (China)",
                          desc: "Komik aksi & kultivasi seru",
                          href: "/komik/advanced-search?format=manhua",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                            />
                          ),
                        },
                        {
                          title: "Manga (Jepang)",
                          desc: "Komik klasik & modern Jepang",
                          href: "/komik/advanced-search?format=manga",
                          icon: (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          ),
                        },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch={false}
                          className="group/item flex items-start gap-3.5 p-3 rounded-2xl hover:bg-[#F4B8C6]/[0.08] border border-transparent hover:border-[#F4B8C6]/20 transition-all"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#161218] border border-[#B8C4D4]/25 flex items-center justify-center shrink-0 text-[#B8C4D4] group-hover/item:bg-[#F4B8C6] group-hover/item:text-[#161218] group-hover/item:border-[#F4B8C6] transition-colors">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              {item.icon}
                            </svg>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#FDF6F7] group-hover/item:text-[#F4B8C6] transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#AD9CA6] mt-0.5 leading-snug">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/komik/advanced-search"
                      prefetch={false}
                      className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#F4B8C6]/15 hover:bg-[#F4B8C6]/25 border border-[#F4B8C6]/30 text-xs font-bold text-[#F4B8C6] transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        Buka Pencarian Lanjutan (Advanced Search)
                      </span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* JADWAL */}
              <Link
                href="/schedule"
                prefetch={false}
                ref={scheduleRef}
                onMouseEnter={handleMouseEnter}
                className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-colors ${
                  isScheduleSection
                    ? "text-[#FDF6F7]"
                    : "text-[#AD9CA6] hover:text-[#FDF6F7]"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${isScheduleSection ? "text-[#F4B8C6]" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Jadwal
              </Link>
            </div>

            {/* KANAN: SEARCH, BOOKMARK, PROFIL */}
            <div className="hidden md:flex items-center gap-3 flex-1 justify-end max-w-sm">
              <SearchBar />

              <Link
                href="/bookmark"
                prefetch={false}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#211B24] hover:bg-[#F4B8C6] text-[#AD9CA6] hover:text-[#161218] transition-all border border-[#F4B8C6]/20 shrink-0"
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
                  prefetch={false}
                  className="flex items-center gap-2.5 bg-[#211B24] hover:bg-[#2B232F] border border-[#F4B8C6]/25 rounded-full pr-4 p-1 transition-all"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#F4B8C6] shrink-0">
                    <Image
                      src={
                        user.user_metadata?.avatar_url ||
                        "https://placehold.co/100x100/211B24/F4B8C6?text=U"
                      }
                      alt="Profile"
                      width={28}
                      height={28}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#FDF6F7] truncate max-w-[80px]">
                    {getFirstName(user.user_metadata?.full_name, user.email)}
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/login?next=${encodeURIComponent(pathname)}`}
                  prefetch={false}
                  className="px-5 py-2.5 bg-[#F4B8C6] hover:bg-[#f7c6d1] text-[#161218] font-extrabold text-xs rounded-full shadow-vogue-blush active:scale-95 transition-all shrink-0"
                >
                  LOGIN
                </Link>
              )}
            </div>

            {/* TOMBOL MENU MOBILE */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-[#211B24] border border-[#F4B8C6]/25 flex items-center justify-center text-[#F4B8C6]"
              aria-label="Toggle Menu"
            >
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
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE EXPANDABLE DRAWER */}
        <div
          className={`lg:hidden transition-all duration-300 bg-[#1B151E]/95 backdrop-blur-2xl border-b border-[#F4B8C6]/20 ${
            isOpen
              ? "max-h-[82vh] py-5 overflow-y-auto opacity-100"
              : "max-h-0 py-0 overflow-hidden opacity-0 border-transparent"
          }`}
        >
          <div className="container mx-auto px-4 flex flex-col gap-4 pb-6">
            <div className="md:hidden">
              <SearchBar />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Anime Ongoing", path: "/ongoing" },
                { label: "Anime Completed", path: "/completed" },
                { label: "Jadwal Rilis", path: "/schedule" },
                { label: "Genre Anime", path: "/genre" },
                { label: "Komik Terbaru", path: "/komik/latest" },
                { label: "Komik Populer", path: "/komik/popular" },
                {
                  label: "Manhwa Korea",
                  path: "/komik/advanced-search?format=manhwa",
                },
                { label: "Advanced Search", path: "/komik/advanced-search" },
              ].map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  prefetch={false}
                  className="px-3.5 py-2.5 rounded-2xl bg-[#211B24] border border-[#F4B8C6]/15 text-xs font-bold text-[#FDF6F7] flex items-center justify-between hover:border-[#F4B8C6]/40 transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[#F4B8C6]">&rarr;</span>
                </Link>
              ))}
            </div>

            <div className="sm:hidden pt-3 border-t border-[#F4B8C6]/15 flex items-center gap-3">
              {user ? (
                <Link
                  href="/profile"
                  prefetch={false}
                  className="flex-1 flex items-center gap-3 bg-[#211B24] border border-[#F4B8C6]/20 rounded-2xl p-2.5"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#F4B8C6] shrink-0">
                    <Image
                      src={
                        user.user_metadata?.avatar_url ||
                        "https://placehold.co/100"
                      }
                      alt="Profile"
                      width={32}
                      height={32}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs font-bold text-[#FDF6F7]">
                    {user.user_metadata?.full_name || user.email}
                  </div>
                </Link>
              ) : (
                <Link
                  href={`/login?next=${encodeURIComponent(pathname)}`}
                  prefetch={false}
                  className="w-full py-2.5 bg-[#F4B8C6] text-[#161218] font-extrabold text-xs rounded-full text-center shadow-vogue-blush"
                >
                  LOGIN AKUN
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE FLOATING PILL DOCK */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-around w-full max-w-sm bg-[#211B24]/95 backdrop-blur-2xl border border-[#F4B8C6]/25 rounded-full px-2 py-1.5 shadow-vogue-card">
          {[
            {
              label: "Beranda",
              href: "/",
              active: isHomeSection,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              ),
            },
            {
              label: "Anime",
              href: "/ongoing",
              active: isAnimeSection,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
            },
            {
              label: "Komik",
              href: "/komik/popular",
              active: isKomikSection,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              ),
            },
            {
              label: "Jadwal",
              href: "/schedule",
              active: isScheduleSection,
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              ),
            },
            {
              label: "Simpan",
              href: "/bookmark",
              active: pathname.startsWith("/bookmark"),
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              ),
            },
          ].map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              prefetch={false}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 ${
                tab.active
                  ? "bg-[#F4B8C6] text-[#161218] shadow-vogue-blush"
                  : "text-[#AD9CA6] hover:text-[#FDF6F7]"
              }`}
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {tab.icon}
              </svg>
              {tab.active && <span>{tab.label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
