"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

export default function AnimeActionButtons({ anime, slug, latestEpisode }) {
  const [history, setHistory] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    try {
      const histData =
        JSON.parse(localStorage.getItem("mangnime_history")) || {};
      const animeHistory = histData.anime || {};
      if (animeHistory[slug]) setHistory(animeHistory[slug]);
    } catch {}
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const watchUrl = history
    ? history.url
    : latestEpisode
      ? `/episode/${latestEpisode.episodeId}`
      : "#";
  const watchText = history
    ? `Lanjut Ep. ${history.episodeNumber}`
    : "Tonton Sekarang";

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-6 relative">
      {/* Tombol Tonton */}
      <Link
        href={watchUrl}
        prefetch={false}
        className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-extrabold text-xs md:text-sm transition-all ${
          latestEpisode
            ? "bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] shadow-vogue-blush active:scale-95"
            : "bg-[#211B24] text-[#AD9CA6]/50 cursor-not-allowed pointer-events-none"
        }`}
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M4 4l12 6-12 6z" />
        </svg>
        {watchText}
      </Link>

      {/* Tombol Bookmark */}
      <BookmarkButton
        item={{
          slug: slug,
          title: anime.title,
          image: anime.poster || anime.image,
          status: anime.status,
          type: "anime",
          url: `/anime/${slug}`,
        }}
      />

      {/* Tombol Share */}
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-bold bg-[#211B24] text-[#FDF6F7] hover:bg-[#2B232F] border border-[#F4B8C6]/25 transition-all active:scale-95"
      >
        <svg
          className="w-4 h-4 text-[#F4B8C6]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Bagikan
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-max">
          <div className="flex items-center gap-2 bg-[#211B24] border border-[#F4B8C6]/50 text-[#FDF6F7] px-4 py-2.5 rounded-full text-xs font-bold shadow-vogue-card animate-fade-in">
            <span className="w-4 h-4 rounded-full bg-[#F4B8C6] text-[#161218] flex items-center justify-center text-[10px] font-extrabold">
              ✓
            </span>
            Tautan berhasil disalin!
          </div>
        </div>
      )}
    </div>
  );
}
