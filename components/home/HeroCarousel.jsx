"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HeroCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [items, nextSlide]);

  if (!items || items.length === 0) return null;

  const currentAnime = items[currentIndex];
  const targetUrl = `/anime/${currentAnime.animeId || currentAnime.slug || currentAnime.id}`;
  const imageUrl = currentAnime.poster || currentAnime.image;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) prevSlide();
    else if (deltaX < -50) nextSlide();
    touchStartX.current = null;
  };

  const slideNum = String(currentIndex + 1).padStart(2, "0");
  const totalNum = String(items.length).padStart(2, "0");

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full min-h-[540px] md:h-[78vh] max-h-[740px] overflow-hidden bg-[#161218] border-b border-[#F4B8C6]/15 select-none flex items-center"
    >
      {/* 1. Ambient Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={currentAnime.title || "Hero Background"}
          fill
          unoptimized
          priority={currentIndex === 0}
          className="object-cover object-center opacity-30 blur-2xl scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161218] via-[#161218]/75 to-[#161218]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#161218] via-[#161218]/70 to-transparent" />
      </div>

      {/* 2. Outlined Masthead Watermark */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-serif text-[75px] sm:text-[130px] lg:text-[175px] font-bold tracking-[0.14em] text-stroke-vogue pointer-events-none select-none leading-none z-0 opacity-75">
        MANGNIME
      </div>

      {/* 3. Konten Utama */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 max-w-[1400px] py-12 md:py-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* KIRI: Editorial Typography & Controls */}
          <div className="flex-1 max-w-2xl space-y-4 md:space-y-5">
            {/* Editorial Issue Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#211B24]/90 border border-[#F4B8C6]/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4B8C6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4B8C6]"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4B8C6]">
                Spotlight #{slideNum} • Sedang Populer
              </span>
            </div>

            {/* Judul Utama */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#FDF6F7] leading-[1.08] tracking-tight line-clamp-2 md:line-clamp-3">
              {currentAnime.title}
            </h1>

            {/* Metadata Pills dengan Ikon Fungsional */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold pt-1">
              {currentAnime.score && (
                <span className="px-3 py-1 rounded-full bg-[#F4B8C6]/15 border border-[#F4B8C6]/35 text-[#F7D6C4] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {currentAnime.score}
                </span>
              )}
              {currentAnime.status && (
                <span className="px-3 py-1 rounded-full bg-[#211B24] border border-[#E88D9E]/30 text-[#F4B8C6]">
                  {currentAnime.status}
                </span>
              )}
              {currentAnime.type && (
                <span className="px-3 py-1 rounded-full bg-[#211B24] border border-[#B8C4D4]/30 text-[#B8C4D4]">
                  {currentAnime.type}
                </span>
              )}
              {(currentAnime.episodes || currentAnime.episode) && (
                <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#FDF6F7]">
                  Ep {currentAnime.episodes || currentAnime.episode}
                </span>
              )}
            </div>

            {/* Sinopsis */}
            <p className="text-xs sm:text-sm md:text-base text-[#AD9CA6] line-clamp-2 md:line-clamp-3 leading-relaxed max-w-xl">
              {currentAnime.synopsis ||
                "Saksikan anime terbaik dengan resolusi tinggi dan subtitle Indonesia, hanya di MangNime."}
            </p>

            {/* Tombol CTA + Navigasi Panah Kiri & Kanan */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <Link
                href={targetUrl}
                className="inline-flex items-center justify-center gap-2.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold text-xs md:text-sm px-7 py-3.5 rounded-full shadow-vogue-blush active:scale-95 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Mulai Nonton
              </Link>

              <Link
                href={targetUrl}
                className="inline-flex items-center justify-center gap-2 bg-[#211B24]/90 hover:bg-[#2B232F] text-[#FDF6F7] border border-[#F4B8C6]/25 font-bold text-xs md:text-sm px-6 py-3.5 rounded-full active:scale-95 transition-all"
              >
                <span>Detail Anime</span>
                <svg
                  className="w-4 h-4 text-[#F4B8C6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              {/* PANAH KIRI & KANAN HORIZONTAL */}
              <div className="flex items-center gap-2 ml-auto md:ml-4 bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-full p-1">
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full hover:bg-[#F4B8C6] text-[#FDF6F7] hover:text-[#161218] flex items-center justify-center transition-all active:scale-90"
                  aria-label="Slide Sebelumnya"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <span className="font-serif italic text-xs text-[#F4B8C6] px-2">
                  {slideNum} / {totalNum}
                </span>

                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full hover:bg-[#F4B8C6] text-[#FDF6F7] hover:text-[#161218] flex items-center justify-center transition-all active:scale-90"
                  aria-label="Slide Selanjutnya"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* KANAN: Editorial Magazine Cover Poster */}
          <div className="hidden md:block relative shrink-0 mr-4">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[26px] border border-[#F4B8C6]/25 bg-[#211B24]/40 pointer-events-none" />

            <div className="relative w-60 lg:w-68 aspect-[2/3] rounded-[24px] overflow-hidden bg-[#211B24] ring-1 ring-[#F4B8C6]/35 shadow-vogue-card">
              <Image
                src={imageUrl}
                alt={currentAnime.title}
                fill
                unoptimized
                priority={currentIndex === 0}
                className="object-cover"
              />
              <div className="absolute inset-2.5 rounded-[16px] border border-white/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161218]/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-[11px] text-[#FDF6F7]/90 font-serif italic">
                <span>MangNime Featured</span>
                <span>#{slideNum}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Indikator Bar Bawah */}
      <div className="absolute bottom-4 left-4 md:left-8 flex items-center gap-2 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              currentIndex === idx
                ? "w-9 bg-[#F4B8C6]"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
