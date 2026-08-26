"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import BookmarkButton from "@/components/ui/BookmarkButton";

export default function ReaderStickyBar({
  slug,
  currentChapter,
  pageTitle,
  createdAt,
  firstImage,
  prevChapterSlug,
  nextChapterSlug,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`sticky z-40 bg-[#0D0B1A]/80 backdrop-blur-2xl border-y border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-8 transition-all duration-300 ease-in-out ${
        isVisible
          ? "top-[64px] md:top-[72px] translate-y-0 opacity-100"
          : "top-0 -translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-2 md:gap-4">
        {/* Tombol Kembali ke Detail Komik */}
        <Link
          href={`/komik/${slug}`}
          prefetch={false}
          className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 hover:bg-celestia-pink hover:text-white transition-all text-gray-400 group"
          title="Kembali ke Detail"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>

        {/* Bagian Tengah (Prev + Judul + Next) */}
        <div className="flex items-center justify-center gap-2 md:gap-4 flex-1 min-w-0">
          {/* Tombol Prev Chapter */}
          {prevChapterSlug ? (
            <Link
              href={`/komik/${slug}/${prevChapterSlug}`}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-celestia-pink hover:border-celestia-pink/30 hover:bg-celestia-pink/10 transition-all text-xs font-bold shadow-sm"
              title="Chapter Sebelumnya"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Prev</span>
            </Link>
          ) : (
            <button
              disabled
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed text-xs font-bold"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Prev</span>
            </button>
          )}

          {/* Info Judul Tengah */}
          <div className="flex flex-col items-center flex-1 min-w-0 px-1">
            <h1 className="text-[13px] md:text-base font-black text-white truncate text-center w-full drop-shadow-md">
              {pageTitle}
            </h1>
            {createdAt && (
              <span className="text-[10px] md:text-[11px] text-gray-500 mt-0.5 hidden md:block">
                {formatDate(createdAt)}
              </span>
            )}
          </div>

          {/* Tombol Next Chapter */}
          {nextChapterSlug ? (
            <Link
              href={`/komik/${slug}/${nextChapterSlug}`}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-celestia-sky hover:border-celestia-sky/30 hover:bg-celestia-sky/10 transition-all text-xs font-bold shadow-sm"
              title="Chapter Selanjutnya"
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <button
              disabled
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed text-xs font-bold"
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Tombol Bookmark */}
        <div className="shrink-0 scale-75 origin-right md:scale-90">
          <BookmarkButton
            item={{
              slug: currentChapter,
              title: pageTitle,
              image: firstImage,
              status: "Tersimpan",
              type: "chapter",
              url: `/komik/${slug}/${currentChapter}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
