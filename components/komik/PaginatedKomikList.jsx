"use client";

import KomikCard from "@/components/komik/KomikCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import GridSkeleton from "@/components/ui/GridSkeleton";
import FetchError from "@/components/ui/FetchError";
import { KomikClient } from "@/services/komikApi.client";
import { useProvider } from "@/hooks/useProvider";

// Dipakai bareng oleh /komik/latest, /komik/popular, dan /komik/genre/[slug].
// Server component cuma kirim string `source` (fungsi nggak bisa dilempar server -> client).
const LOADERS = {
  latest: (page) => KomikClient.getLatest(page),
  popular: (page) => KomikClient.getPopular(page),
  genre: (page, genreSlug) => KomikClient.getKomikByGenre(genreSlug, page),
};

const DEFAULT_GRID =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7";

export default function PaginatedKomikList({
  source,
  page = 1,
  genreSlug,
  basePath,
  gridClass = DEFAULT_GRID,
  emptyText = "Tidak ada komik tersedia.",
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

  const komikList = res?.data || [];
  const pagination = res?.pagination || null;

  if (loading) return <GridSkeleton className={gridClass} />;
  if (error) return <FetchError error={error} onRetry={retry} />;

  if (komikList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#AD9CA6] border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/60">
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <>
      <div key={`${source}-${genreSlug || ""}-${page}`} className={gridClass}>
        {komikList.map((komik, idx) => (
          <ScrollReveal key={komik.slug || idx}>
            <KomikCard komik={komik} />
          </ScrollReveal>
        ))}
      </div>

      <Pagination pagination={pagination} basePath={basePath} />
    </>
  );
}
