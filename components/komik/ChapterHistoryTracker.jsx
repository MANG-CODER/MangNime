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

    const savedHistory = JSON.parse(
      localStorage.getItem("mangnime_history") || "{}",
    );

    // Simpan/Update chapter terbaru yang dibaca untuk komik ini
    savedHistory[slug] = {
      title,
      chapter: chapterIndex,
      image,
      url: `/komik/${slug}/chapter-${chapterIndex}`,
      timestamp: Date.now(),
    };

    localStorage.setItem("mangnime_history", JSON.stringify(savedHistory));
  }, [slug, chapterIndex, title, image]);

  return null; // Komponen ini tidak menampilkan apa-apa (bekerja di belakang layar)
}
