"use client";

import AnimeCard from "@/components/anime/AnimeCard";
import KomikCard from "@/components/komik/KomikCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GridSkeleton from "@/components/ui/GridSkeleton";
import FetchError from "@/components/ui/FetchError";
import { searchAllAnime } from "@/services/animeAction.client";
import { searchKomikServer } from "@/services/searchAction.client";
import { useProvider } from "@/hooks/useProvider";

export default function SearchResults({ keyword, type }) {
  const wantAnime = type === "all" || type === "anime";
  const wantKomik = type === "all" || type === "komik";

  // Dua request terpisah: kalau salah satu gagal, yang lain tetap tampil.
  const {
    data: animeRes,
    error: animeError,
    loading: animeLoading,
    retry: animeRetry,
  } = useProvider(
    () => (wantAnime ? searchAllAnime(keyword) : []),
    [keyword, wantAnime],
  );
  const {
    data: komikRes,
    error: komikThrown,
    loading: komikLoading,
    retry: komikRetry,
  } = useProvider(
    () => (wantKomik ? searchKomikServer(keyword) : { data: [], total: 0 }),
    [keyword, wantKomik],
  );

  const animeList = Array.isArray(animeRes) ? animeRes : [];
  const komikList = komikRes?.data || [];
  // searchKomikServer nggak melempar error; dia ngasih flag `error` di hasilnya
  const komikError =
    komikThrown ||
    (komikRes?.error ? { rateLimited: komikRes.rateLimited } : null);

  const totalResults = animeList.length + komikList.length;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1400px] mx-auto pb-20 mt-8 px-4 md:px-8">
      {/* HEADER PENCARIAN */}
      <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 text-center md:text-left shadow-vogue-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E88D9E]">
            Search Results
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#FDF6F7]">
            Hasil Pencarian:{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              &ldquo;{keyword}&rdquo;
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm">
            Menemukan total{" "}
            <span className="text-[#F4B8C6] font-extrabold">
              {totalResults}
            </span>{" "}
            judul yang cocok dari katalog kami.
          </p>
        </div>
      </div>

      {/* HASIL ANIME */}
      {(type === "all" || type === "anime") && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4B8C6]/15 pb-3.5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#211B24] border border-[#F4B8C6]/25 text-[#F4B8C6]">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7]">
                Katalog Anime
              </h2>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-[#F4B8C6]/15 border border-[#F4B8C6]/30 text-xs font-extrabold text-[#F4B8C6]">
              {animeLoading ? "…" : animeList.length} Judul
            </span>
          </div>

          {animeLoading ? (
            <GridSkeleton
              count={5}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7"
            />
          ) : animeError ? (
            <FetchError error={animeError} onRetry={animeRetry} compact />
          ) : animeList.length > 0 ? (
            <div
              key={`anime-${keyword}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7"
            >
              {animeList.map((anime, idx) => (
                <ScrollReveal key={idx}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 text-[#AD9CA6] text-sm border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/50">
              Tidak ada hasil anime untuk kata kunci ini.
            </div>
          )}
        </section>
      )}

      {/* HASIL KOMIK */}
      {(type === "all" || type === "komik") && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4B8C6]/15 pb-3.5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#211B24] border border-[#B8C4D4]/30 text-[#B8C4D4]">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7]">
                Katalog Komik
              </h2>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-[#B8C4D4]/15 border border-[#B8C4D4]/30 text-xs font-extrabold text-[#B8C4D4]">
              {komikLoading ? "…" : komikList.length} Judul
            </span>
          </div>

          {komikLoading ? (
            <GridSkeleton
              count={5}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7"
            />
          ) : komikError ? (
            <FetchError error={komikError} onRetry={komikRetry} compact />
          ) : komikList.length > 0 ? (
            <div
              key={`komik-${keyword}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7"
            >
              {komikList.map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 text-[#AD9CA6] text-sm border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/50">
              Tidak ada hasil komik untuk kata kunci ini.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
