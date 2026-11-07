"use client";

import AnimeCard from "@/components/anime/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GridSkeleton from "@/components/ui/GridSkeleton";
import FetchError from "@/components/ui/FetchError";
import { OtakudesuClient } from "@/services/providers/otakudesu.client";
import { useProvider } from "@/hooks/useProvider";

// Dipakai bareng oleh /ongoing, /completed, dan /genre/[slug].
// Server component cuma kirim string `source` (fungsi nggak bisa dilempar dari server ke client).
const LOADERS = {
  ongoing: (page) => OtakudesuClient.getOngoing(page),
  completed: (page) => OtakudesuClient.getCompleted(page),
  genre: (page, genreSlug) => OtakudesuClient.getAnimeByGenre(genreSlug, page),
};

export default function PaginatedAnimeList({
  source,
  page = 1,
  genreSlug,
  basePath,
  keyPrefix = "item",
  emptyText = "Tidak ada anime tersedia.",
}) {
  const {
    data: res,
    error,
    loading,
    retry,
  } = useProvider(
    () => LOADERS[source](page, genreSlug),
    [source, page, genreSlug],
  );

  const list = res?.data || [];
  const pagination = res?.pagination || null;

  if (loading) return <GridSkeleton />;
  if (error) return <FetchError error={error} onRetry={retry} />;

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#AD9CA6] border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/60">
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <>
      <div
        key={`${source}-${page}`}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-7"
      >
        {list.map((anime, idx) => {
          const uniqueKey =
            anime.animeId ||
            anime.slug ||
            anime.anime_id ||
            `${keyPrefix}-${idx}`;
          return (
            <ScrollReveal key={uniqueKey}>
              <AnimeCard anime={anime} index={idx} />
            </ScrollReveal>
          );
        })}
      </div>

      <Pagination pagination={pagination} basePath={basePath} />
    </>
  );
}
