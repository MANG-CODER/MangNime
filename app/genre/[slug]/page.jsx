import AnimeCard from "@/components/anime/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { AnimeProvider } from "@/services/providers";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const genreName = (slug || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `Anime Genre ${genreName} - MangNime`,
  };
}

export const revalidate = 1800;

export default async function GenreDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || 1);

  if (!slug) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-[#FDF6F7] text-lg font-bold">
        Parameter genre tidak ditemukan.
      </div>
    );
  }

  const displayTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  let animeList = [];
  let paginationData = null;

  try {
    const res = await AnimeProvider.Otakudesu.getAnimeByGenre(slug, page);
    animeList = res?.data || [];
    paginationData = res?.pagination || null;
  } catch (error) {
    console.error("Gagal fetch genre:", error);
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 px-4 md:px-8 mt-6">
      <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-11 relative overflow-hidden shadow-vogue-card flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative z-10 text-center md:text-left space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E88D9E]">
            Kategori Genre Anime
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7]">
            Genre{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              {displayTitle}
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm">
            Menampilkan daftar katalog anime dengan genre {displayTitle}.
          </p>
        </div>

        <Link
          href="/genre"
          className="relative z-10 flex items-center gap-2 bg-[#161218] hover:bg-[#F4B8C6] border border-[#F4B8C6]/25 text-[#FDF6F7] hover:text-[#161218] px-5 py-2.5 rounded-full text-xs font-extrabold transition-all"
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
          Semua Genre
        </Link>
      </div>

      {animeList.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-7">
            {animeList.map((anime, idx) => {
              const uniqueKey =
                anime.animeId || anime.slug || `genre-item-${idx}`;
              return (
                <ScrollReveal key={uniqueKey}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              );
            })}
          </div>

          <Pagination pagination={paginationData} basePath={`/genre/${slug}`} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[#AD9CA6] border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/60">
          <p className="text-sm">
            Memuat data genre atau genre tidak ditemukan...
          </p>
        </div>
      )}
    </div>
  );
}
