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
      <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
        <Link
          href={`/komik/${slug}`}
          prefetch={false}
          className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white/5 hover:bg-celestia-pink hover:text-white transition-all text-gray-400 group"
          title="Kembali ke Detail"
        >
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform"
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
        </Link>

        <div className="flex flex-col items-center flex-1 min-w-0">
          <h1 className="text-sm md:text-lg font-black text-white truncate text-center w-full drop-shadow-md">
            {pageTitle}
          </h1>
          {createdAt && (
            <span className="text-[11px] text-gray-500 mt-0.5">
              {formatDate(createdAt)}
            </span>
          )}
        </div>

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
