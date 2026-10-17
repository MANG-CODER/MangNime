"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

export default function KomikActionButtons({ komik, slug, firstChapter }) {
  const [history, setHistory] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const histData = JSON.parse(localStorage.getItem("mangnime_history")) || {};
    const komikHistory = histData.komik || {};
    if (komikHistory[slug]) {
      setHistory(komikHistory[slug]);
    }
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const readUrl = history
    ? history.url
    : firstChapter?.slug
      ? `/komik/${slug}/${firstChapter.slug}`
      : "#";

  const readText = history
    ? `Lanjut ${history.chapter || ""}`
    : firstChapter?.title
      ? `Mulai ${firstChapter.title}`
      : "Belum Ada Chapter";

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-6 relative">
      <Link
        href={readUrl}
        className={`flex items-center gap-2.5 px-8 py-3.5 rounded-full font-extrabold text-xs md:text-sm transition-all ${
          firstChapter
            ? "bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] shadow-vogue-blush active:scale-95"
            : "bg-[#211B24] text-[#AD9CA6]/50 cursor-not-allowed pointer-events-none"
        }`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        {readText}
      </Link>

      <BookmarkButton
        item={{
          slug: slug,
          title: komik.title,
          image: komik.image,
          status: komik.status,
          type: "komik",
          url: `/komik/${slug}`,
        }}
      />

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
