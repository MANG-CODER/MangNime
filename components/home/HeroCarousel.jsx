"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Button from "../ui/Button";

export default function HeroCarousel({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fungsi ke slide selanjutnya
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  // Fungsi ke slide sebelumnya
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  // Auto-slide setiap 7 detik
  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    // Membersihkan timer jika komponen di-unmount atau di-render ulang
    return () => clearInterval(timer);
  }, [items, nextSlide]);

  if (!items || items.length === 0) return null;

  const currentAnime = items[currentIndex];
  const targetUrl = `/anime/${currentAnime.animeId || currentAnime.slug || currentAnime.id}`;
  const imageUrl = currentAnime.poster || currentAnime.image;

  return (
    <div className="relative w-full h-[65vh] md:h-[80vh] min-h-[550px] overflow-hidden group bg-celestia-night border-b border-white/5 shadow-2xl">
      {/* 1. Latar Belakang Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt="Background Blur"
          fill
          className="object-cover object-top opacity-40 blur-xl scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-celestia-night via-celestia-night/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-celestia-night via-celestia-night/60 to-transparent" />
      </div>

      {/* --- TOMBOL PANAH KIRI --- */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-celestia-royal hover:border-celestia-lavender hover:shadow-glow-purple opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-4 group-hover:translate-x-0"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 pr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* --- TOMBOL PANAH KANAN --- */}
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-celestia-royal hover:border-celestia-lavender hover:shadow-glow-purple opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 md:w-8 md:h-8 pl-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* 2. Konten Utama */}
      <div className="absolute inset-0 flex items-center z-10 container mx-auto px-12 md:px-24 pt-16 md:pt-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full animate-fade-in-up">
          {/* KIRI: Poster Utuh */}
          <div className="hidden md:block w-56 lg:w-72 flex-shrink-0 transform group-hover:-translate-y-2 transition-transform duration-500 ease-out">
            <div className="hidden md:block w-48 lg:w-64 flex-shrink-0 relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={imageUrl}
                alt={currentAnime.title}
                fill
                sizes="(max-width: 768px) 1px, (max-width: 1024px) 224px, 288px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>

          {/* KANAN: Teks & Tombol */}
          <div className="flex-1 max-w-4xl space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2.5 bg-celestia-pink/10 text-celestia-pink px-4 py-2 rounded-full text-xs font-black tracking-widest border border-celestia-pink/30 backdrop-blur-md uppercase shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-celestia-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-celestia-pink"></span>
              </span>
              Sedang Populer
            </div>

            {/* ✅ PERBAIKAN: Menambahkan line-clamp-2 md:line-clamp-3 pada judul */}
            <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] drop-shadow-2xl line-clamp-2 md:line-clamp-3">
              {currentAnime.title}
            </h2>

            <div className="flex items-center justify-center md:justify-start gap-5 text-sm font-medium text-gray-300">
              {currentAnime.score && (
                <span className="flex items-center gap-1.5 text-celestia-gold bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/5 shadow-glow-gold">
                  ★ {currentAnime.score}
                </span>
              )}
              {currentAnime.status && (
                <span className="opacity-70 text-celestia-lavender">
                  • {currentAnime.status}
                </span>
              )}
              {currentAnime.type && (
                <span className="opacity-70 text-celestia-sky">
                  • {currentAnime.type}
                </span>
              )}
            </div>

            <p className="text-gray-300 line-clamp-3 md:line-clamp-4 text-sm md:text-lg leading-relaxed font-light max-w-3xl mx-auto md:mx-0 drop-shadow-md">
              {currentAnime.synopsis ||
                "Saksikan anime terbaik dengan resolusi tinggi dan subtitle Indonesia, hanya di MangNime."}
            </p>

            <div className="pt-6">
              <Button
                href={targetUrl}
                variant="primary"
                size="lg"
                className="group"
              >
                <span className="mr-2">Mulai Nonton</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Indikator Slide (Titik di bawah) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-10 md:translate-x-0 flex gap-2.5 z-20 bg-black/30 p-2 rounded-full backdrop-blur-sm border border-white/5">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full h-2 ${
              currentIndex === idx
                ? "w-10 bg-celestia-lavender shadow-glow-purple"
                : "w-2.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
