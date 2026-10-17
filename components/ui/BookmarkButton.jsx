"use client";
import { useState, useEffect } from "react";

export default function BookmarkButton({ item }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const slug = item?.slug || "";

  useEffect(() => {
    if (!slug) return;
    const bookmarks =
      JSON.parse(localStorage.getItem("mangnime_bookmarks")) || [];
    setIsBookmarked(bookmarks.some((b) => b.slug === slug));
  }, [slug]);

  const toggleBookmark = () => {
    if (!slug) return;
    let bookmarks =
      JSON.parse(localStorage.getItem("mangnime_bookmarks")) || [];

    if (isBookmarked) {
      bookmarks = bookmarks.filter((b) => b.slug !== slug);
    } else {
      bookmarks.push(item);
    }

    localStorage.setItem("mangnime_bookmarks", JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
    window.dispatchEvent(new Event("bookmarksUpdated"));
  };

  if (!slug)
    return (
      <div className="h-[44px] w-[140px] bg-[#211B24] rounded-full animate-pulse" />
    );

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-extrabold transition-all active:scale-95 ${
        isBookmarked
          ? "bg-[#F4B8C6] text-[#161218] shadow-vogue-blush"
          : "bg-[#211B24] text-[#FDF6F7] hover:bg-[#2B232F] border border-[#F4B8C6]/25"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {isBookmarked ? "Tersimpan" : "Simpan"}
    </button>
  );
}
