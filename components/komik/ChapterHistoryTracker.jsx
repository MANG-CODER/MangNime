"use client";
import { useEffect } from "react";

export default function ChapterHistoryTracker({
  slug,
  title,
  chapterIndex,
  image,
}) {
  useEffect(() => {
    if (!slug || !chapterIndex) return;

    try {
      const raw = JSON.parse(localStorage.getItem("mangnime_history")) || {};
      const hist = {
        anime: raw.anime || {},
        komik: raw.komik || {},
      };

      hist.komik[slug] = {
        title,
        chapter: chapterIndex,
        chapterIndex,
        image: image || "https://placehold.co/300x400",
        url: `/komik/${slug}/chapter-${chapterIndex}`,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("mangnime_history", JSON.stringify(hist));
    } catch (e) {
      localStorage.removeItem("mangnime_history");
    }
  }, [slug, chapterIndex, title, image]);

  return null;
}
