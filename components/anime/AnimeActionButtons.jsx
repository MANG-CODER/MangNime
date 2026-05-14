"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

export default function AnimeActionButtons({ anime, slug, latestEpisode }) {
  const [history, setHistory] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const histData = JSON.parse(localStorage.getItem("mangnime_history")) || {
      anime: {},
    };
    if (histData.anime[slug]) setHistory(histData.anime[slug]);
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
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-6 relative">
      {/* Tombol Tonton */}
      <Link
        href={watchUrl}
        className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-sm transition-transform shadow-glow-purple ${
          latestEpisode
            ? "bg-gradient-to-r from-celestia-royal to-celestia-lavender text-white hover:scale-105"
            : "bg-white/5 text-gray-500 cursor-not-allowed pointer-events-none"
        }`}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
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
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-all self-stretch md:self-auto"
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
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Bagikan
      </button>

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-[#151226] border border-celestia-sky/50 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-[0_0_20px_rgba(76,201,255,0.3)] animate-fade-in-up z-50 whitespace-nowrap pointer-events-none">
          <div className="bg-celestia-sky/20 p-1 rounded-full">
            <svg
              className="w-4 h-4 text-celestia-sky"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          Tautan berhasil disalin!
        </div>
      )}
    </div>
  );
}
