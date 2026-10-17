"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LastReadButton({ slug }) {
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("mangnime_history")) || {};
    const komikHistory = savedHistory.komik || {};

    if (komikHistory[slug]) {
      setLastRead(komikHistory[slug]);
    }
  }, [slug]);

  if (!lastRead) return null;

  return (
    <Link
      href={lastRead.url}
      prefetch={false}
      className="w-full sm:w-auto px-5 py-2.5 bg-[#F7D6C4]/10 border border-[#F7D6C4]/35 text-[#F7D6C4] text-xs font-extrabold rounded-full hover:bg-[#F7D6C4]/20 transition-all flex items-center justify-center gap-2 group"
    >
      <svg
        className="w-4 h-4 group-hover:scale-110 transition-transform"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clipRule="evenodd"
        />
      </svg>
      Terakhir Dibaca: Ch. {lastRead.chapterIndex || lastRead.chapter}
    </Link>
  );
}
