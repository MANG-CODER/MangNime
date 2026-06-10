import AnimeCard from "@/components/anime/AnimeCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { AnimeProvider } from "@/services/providers";
import Link from "next/link";

export const metadata = {
  title: "Anime Movies - MangNime",
  description:
    "Daftar film layar lebar anime terbaru dan terbaik dari Alqanime.",
};

export default async function MoviesPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);

  const response = await AnimeProvider.Alqanime.getMovies(page);

  const movies = response?.data || [];
  const paginationData = response?.pagination || null;

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 px-4 md:px-0">
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden mt-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-celestia-lavender/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-xl">
              Anime{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-sky to-celestia-lavender">
                Movies
              </span>
            </h1>
            <p className="text-celestia-lavender/70 font-light text-sm md:text-base tracking-wide max-w-xl mx-auto md:mx-0">
              Koleksi film layar lebar anime dengan visual memukau dan cerita
              epik.
            </p>
          </div>
        </div>
      </div>

      {movies.length > 0 ? (
        <>
          <div
            key={`movies-${page}`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 animate-fade-in-up"
          >
            {movies.map((movie, idx) => (
              <ScrollReveal key={idx}>
                <AnimeCard anime={movie} index={idx} />
              </ScrollReveal>
            ))}
          </div>

          {/* GUNAKAN KOMPONEN PAGINATION URL QUERY INI */}
          {paginationData && <MoviesPagination pagination={paginationData} />}
        </>
      ) : (
        <div className="text-center py-20 text-gray-500 border border-white/5 rounded-2xl bg-white/5">
          Memuat data film atau tidak ada film tersedia...
        </div>
      )}
    </div>
  );
}

function MoviesPagination({ pagination }) {
  if (!pagination) return null;

  const {
    currentPage,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    totalPages,
  } = pagination;

  if (!hasPrevPage && !hasNextPage) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 w-full">
      {hasPrevPage ? (
        <Link
          href={`/movies?page=${prevPage}`}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-celestia-royal/20 hover:text-celestia-sky hover:border-celestia-sky/30 transition-all font-bold"
        >
          &laquo; Prev
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed font-bold"
        >
          &laquo; Prev
        </button>
      )}

      <div className="px-6 py-2 rounded-xl bg-celestia-royal/10 border border-celestia-sky/20 text-celestia-sky font-bold flex items-center shadow-glow-blue">
        Halaman {currentPage}{" "}
        {hasNextPage && (
          <>
            <span className="text-gray-500 mx-2">/</span> {totalPages}
          </>
        )}
      </div>

      {hasNextPage ? (
        <Link
          href={`/movies?page=${nextPage}`}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-celestia-royal/20 hover:text-celestia-sky hover:border-celestia-sky/30 transition-all font-bold"
        >
          Next &raquo;
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed font-bold"
        >
          Next &raquo;
        </button>
      )}
    </div>
  );
}
