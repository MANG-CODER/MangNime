"use client";

import Link from "next/link";
import FetchError from "@/components/ui/FetchError";
import { OtakudesuClient } from "@/services/providers/otakudesu.client";
import { useProvider } from "@/hooks/useProvider";

export default function GenreGrid() {
  const { data, error, loading, retry } = useProvider(
    () => OtakudesuClient.getGenres(),
    [],
  );

  const genreList = (data?.genreList || [])
    .map((genre) => ({ title: genre.title, genreId: genre.genreId }))
    .sort((a, b) => a.title.localeCompare(b.title));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#F4B8C6]">
        <span className="w-9 h-9 border-[3px] border-[#F4B8C6] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-[#AD9CA6]">Memuat data genre...</p>
      </div>
    );
  }
  if (error) return <FetchError error={error} onRetry={retry} />;
  if (genreList.length === 0) {
    return (
      <div className="text-center py-16 text-[#AD9CA6] text-sm">
        Daftar genre belum tersedia.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
      {genreList.map((genre, idx) => (
        <Link
          href={`/genre/${genre.genreId}`}
          key={idx}
          className="group bg-[#211B24]/90 border border-[#F4B8C6]/15 hover:border-[#F4B8C6]/50 hover:bg-[#28202C] rounded-2xl px-4 py-4 flex items-center justify-between shadow-vogue-card hover:-translate-y-0.5 transition-all"
        >
          <span className="font-bold text-xs md:text-sm text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors truncate pr-2">
            {genre.title}
          </span>
          <span className="w-6 h-6 rounded-full bg-[#161218] group-hover:bg-[#F4B8C6] text-[#AD9CA6] group-hover:text-[#161218] flex items-center justify-center text-xs transition-all shrink-0">
            &rarr;
          </span>
        </Link>
      ))}
    </div>
  );
}
