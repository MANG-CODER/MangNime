"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function KomikCard({ komik }) {
  const itemData = komik.data ? komik.data : komik;

  const slug = itemData.slug || "";
  const title = itemData.title || "Judul Tidak Diketahui";
  const primaryImage =
    itemData.image ||
    "https://placehold.co/300x450/211B24/F4B8C6?text=No+Image";

  const [imgSrc, setImgSrc] = useState(primaryImage);

  useEffect(() => {
    setImgSrc(primaryImage);
  }, [primaryImage]);

  const latestChapter = itemData.chapter || "";
  const score = itemData.score || "";
  const type = itemData.type || "";

  return (
    <Link
      href={`/komik/${slug}`}
      prefetch={false}
      className="group flex flex-col select-none active:scale-[0.98] transition-transform duration-300"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[20px] bg-[#211B24] ring-1 ring-[#F4B8C6]/15 group-hover:ring-[#B8C4D4]/50 shadow-vogue-card transition-all duration-300">
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 45vw, 20vw"
          unoptimized
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => {
            setImgSrc(
              "https://placehold.co/300x450/211B24/F4B8C6?text=Image+Error",
            );
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#161218]/90 via-[#161218]/15 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        <div className="absolute inset-2 rounded-[14px] border border-[#B8C4D4]/0 group-hover:border-[#B8C4D4]/35 transition-colors duration-500 pointer-events-none z-10" />

        {type && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#161218]/80 backdrop-blur-md border border-[#B8C4D4]/35 text-[10px] font-bold uppercase tracking-wider text-[#B8C4D4]">
            {type}
          </span>
        )}

        {score && (
          <span className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#161218]/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#F7D6C4]">
            ★ {score}
          </span>
        )}

        {latestChapter && (
          <div className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded-full bg-[#F4B8C6] text-[#161218] text-[10px] font-extrabold shadow-sm">
            {latestChapter}
          </div>
        )}
      </div>

      <div className="mt-3 px-1 space-y-0.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#B8C4D4]">
          <svg
            className="w-3 h-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span>{type || "Komik"}</span>
        </div>

        <h3 className="text-sm font-bold text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
      </div>
    </Link>
  );
}
