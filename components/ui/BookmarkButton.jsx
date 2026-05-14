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
      <div className="h-[48px] w-[150px] bg-white/5 rounded-xl animate-pulse"></div>
    );

  return (
    <button
      onClick={toggleBookmark}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
        isBookmarked
          ? "bg-celestia-pink text-white shadow-[0_0_15px_rgba(255,117,160,0.4)]"
          : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill={isBookmarked ? "currentColor" : "none"}
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
      {isBookmarked ? "Tersimpan" : "Simpan"}
    </button>
  );
}
