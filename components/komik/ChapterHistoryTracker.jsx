"use client";
import { useEffect } from "react";

export default function ChapterHistoryTracker({
  slug,
  title,
  chapterSlug,
  chapterLabel,
  image,
}) {
  useEffect(() => {
    if (!slug || !chapterSlug) return;

    try {
      const raw = JSON.parse(localStorage.getItem("mangnime_history")) || {};
      const hist = {
        anime: raw.anime || {},
        komik: raw.komik || {},
      };

      hist.komik[slug] = {
        title,
        chapter: chapterLabel || chapterSlug,
        chapterIndex: chapterLabel || chapterSlug,
        chapterSlug,
        image: image || "https://placehold.co/300x400",
        url: `/komik/${slug}/${chapterSlug}`,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("mangnime_history", JSON.stringify(hist));
    } catch (e) {
      localStorage.removeItem("mangnime_history");
    }
  }, [slug, chapterSlug, chapterLabel, title, image]);

  return null;
}
