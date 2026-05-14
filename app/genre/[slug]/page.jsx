import AnimeCard from "@/components/anime/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import { fetchWithDelay, API_ENDPOINTS } from "@/services/api";
import ScrollReveal from "@/components/ui/ScrollReveal";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const genreName = resolvedParams.slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return { title: `Anime Genre ${genreName} - MangNime` };
}

export default async function GenreDetailPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || 1);
  const slug = resolvedParams.slug;

    const baseEndpoint = `/genre/${slug}`;
    const endpoint = page === 1 ? baseEndpoint : `${baseEndpoint}?page=${page}`;

  let animeList = [];
  let paginationData = null;

  try {
    const res = await fetchWithDelay(endpoint, 500, {
      next: { revalidate: 3600 },
    });
    animeList = res?.data?.animeList || res?.data || [];
    paginationData = res?.pagination || null;
  } catch (error) {
    console.error(`Gagal memuat genre ${slug}:`, error);
  }

  // Mengubah "action-magic" menjadi "Action Magic" untuk judul
  const displayTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 px-4 md:px-0 mt-6">
      {/* Header Celestia dengan Tombol Kembali */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-celestia-pink/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center md:text-left">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-xl">
            Genre{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-gold to-celestia-pink">
              {displayTitle}
            </span>
          </h1>
          <p className="text-celestia-lavender/70 font-light text-sm md:text-base">
            Menampilkan daftar anime dengan genre {displayTitle}.
          </p>
        </div>

        {/* Tombol Kembali ke Daftar Genre */}
        <Link
          href="/genre"
          className="relative z-10 flex items-center gap-2 bg-white/5 hover:bg-celestia-royal border border-white/10 hover:border-celestia-lavender text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 hover:shadow-glow-purple"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Kembali ke Daftar Genre
        </Link>
      </div>

      {/* Grid Kartu Anime */}
      {animeList.length > 0 ? (
        <>
          <div
            key={`genre-anime-${slug}-${page}`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 animate-fade-in-up"
          >
            {animeList.map((anime, idx) => (
              <ScrollReveal key={idx}>
                <AnimeCard anime={anime} index={idx} />
              </ScrollReveal>
            ))}
          </div>
          {/* Pagination */}
          {paginationData && (
            <Pagination
              pagination={paginationData}
              basePath={`/genre/${slug}`}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-celestia-lavender">
          <span className="w-10 h-10 border-4 border-celestia-royal border-t-transparent rounded-full animate-spin mb-4"></span>
          <p className="font-light">
            Mencari serpihan bintang di rasi {displayTitle}...
          </p>
        </div>
      )}
    </div>
  );
}
