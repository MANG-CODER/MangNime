"use client";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function GenreFilterClient({ genreList }) {
  return (
    <div className="min-h-screen bg-[#161218] pt-8 pb-20 px-4 md:px-8">
      <div className="container mx-auto max-w-[1320px] animate-fade-in space-y-10">
        {/* Header */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-11 text-center shadow-vogue-card space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161218] border border-[#B8C4D4]/30 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8C4D4]">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>Category Index</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7] tracking-tight">
            Eksplorasi{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Genre Komik
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm max-w-md mx-auto">
            Temukan ribuan judul manga, manhwa, dan manhua berdasarkan kategori
            genre favoritmu.
          </p>
        </div>

        {/* Grid Genre */}
        <ScrollReveal>
          {genreList?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {genreList.map((genreItem, idx) => {
                const genreSlug = genreItem.slug;
                const name = genreItem.name || "Unknown";

                return (
                  <Link
                    key={idx}
                    href={`/komik/genre/${genreSlug}`}
                    className="bg-[#211B24]/90 border border-[#F4B8C6]/15 hover:border-[#F4B8C6]/50 hover:bg-[#28202C] rounded-2xl px-4 py-3.5 flex justify-between items-center group hover:-translate-y-0.5 shadow-vogue-card transition-all"
                  >
                    <span className="font-bold text-[#FDF6F7] group-hover:text-[#F4B8C6] text-xs md:text-sm transition-colors truncate pr-2">
                      {name}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-[#161218] group-hover:bg-[#F4B8C6] text-[#AD9CA6] group-hover:text-[#161218] flex items-center justify-center text-xs transition-all shrink-0">
                      &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-[#AD9CA6] bg-[#211B24]/60 rounded-3xl border border-[#F4B8C6]/15">
              Data genre tidak tersedia.
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
