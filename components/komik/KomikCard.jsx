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
    "https://placehold.co/200x300/151226/8b6cff?text=No+Image";

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
      className="group flex flex-col gap-2"
    >
      <div className="aspect-[3/4] rounded-xl overflow-hidden relative border border-white/10 bg-[#151226]">
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          quality={75}
          unoptimized={true}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
          onError={() => {
            setImgSrc(
              "https://placehold.co/200x300/151226/8b6cff?text=Image+Error",
            );
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

        {type && (
          <span className="absolute top-2 right-2 bg-celestia-pink text-white text-[9px] font-black tracking-widest px-2 py-1 rounded uppercase shadow-lg z-10">
            {type}
          </span>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end z-10">
          {latestChapter && (
            <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
              {latestChapter}
            </span>
          )}
          {score && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-celestia-gold drop-shadow-md">
              ★ {score}
            </span>
          )}
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-celestia-pink transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}
