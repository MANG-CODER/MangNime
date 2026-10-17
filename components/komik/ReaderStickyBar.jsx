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
      className={`sticky z-40 bg-[#161218]/85 backdrop-blur-2xl border-b border-[#F4B8C6]/15 shadow-vogue-card mb-6 transition-all duration-300 ${
        isVisible
          ? "top-[64px] md:top-[80px] translate-y-0 opacity-100"
          : "top-0 -translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto max-w-4xl px-4 py-2.5 flex items-center justify-between gap-2 md:gap-4">
        <Link
          href={`/komik/${slug}`}
          prefetch={false}
          className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-[#211B24] hover:bg-[#F4B8C6] text-[#AD9CA6] hover:text-[#161218] border border-[#F4B8C6]/20 transition-all group"
          title="Kembali ke Detail"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
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

        <div className="flex items-center justify-center gap-2 md:gap-3 flex-1 min-w-0">
          {prevChapterSlug ? (
            <Link
              href={`/komik/${slug}/${prevChapterSlug}`}
              className="shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#211B24] border border-[#F4B8C6]/20 text-[#FDF6F7] hover:bg-[#F4B8C6] hover:text-[#161218] transition-all text-xs font-bold"
              title="Chapter Sebelumnya"
            >
              <span>&larr;</span>
              <span className="hidden sm:inline">Prev</span>
            </Link>
          ) : (
            <button
              disabled
              className="shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#211B24]/40 border border-white/5 text-[#AD9CA6]/40 cursor-not-allowed text-xs font-bold"
            >
              <span>&larr;</span>
              <span className="hidden sm:inline">Prev</span>
            </button>
          )}

          <div className="flex flex-col items-center flex-1 min-w-0 px-2">
            <h1 className="text-xs md:text-sm font-extrabold text-[#FDF6F7] truncate text-center w-full">
              {pageTitle}
            </h1>
            {createdAt && (
              <span className="text-[10px] text-[#AD9CA6] hidden md:block">
                {formatDate(createdAt)}
              </span>
            )}
          </div>

          {nextChapterSlug ? (
            <Link
              href={`/komik/${slug}/${nextChapterSlug}`}
              className="shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#F4B8C6] text-[#161218] hover:bg-[#f8c7d3] transition-all text-xs font-extrabold"
              title="Chapter Selanjutnya"
            >
              <span className="hidden sm:inline">Next</span>
              <span>&rarr;</span>
            </Link>
          ) : (
            <button
              disabled
              className="shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#211B24]/40 border border-white/5 text-[#AD9CA6]/40 cursor-not-allowed text-xs font-bold"
            >
              <span className="hidden sm:inline">Next</span>
              <span>&rarr;</span>
            </button>
          )}
        </div>

        <div className="shrink-0 scale-90 origin-right">
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
