"use client";

import { useEffect } from "react";

export default function ChapterHistoryTracker({
  slug,
  title,
  image,
  chapterIndex,
}) {
  useEffect(() => {
    // Jalankan hanya setelah komponen di-render di browser
    const hist = JSON.parse(localStorage.getItem("mangnime_history")) || {
      anime: {},
      komik: {},
    };

    hist.komik[slug] = {
      title: title || `Chapter ${chapterIndex}`,
      image: image || "https://placehold.co/300x400",
      chapterIndex: chapterIndex,
      url: window.location.pathname,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("mangnime_history", JSON.stringify(hist));
  }, [slug, title, image, chapterIndex]);

  // Komponen ini tidak me-render UI apapun secara visual, hanya logic di background
  return null;
}
