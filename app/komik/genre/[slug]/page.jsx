import { getKomikByGenre } from "@/services/komikApi";
import KomikCard from "@/components/komik/KomikCard";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const genreName = (resolvedParams?.slug || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return { title: `Komik Genre ${genreName} - MangNime` };
}

export default async function KomikGenreDetailPage({ params, searchParams }) {
  const resolvedParams = await params;
  const genreSlug = resolvedParams?.slug;

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || 1);

  const displayTitle = (genreSlug || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const res = await getKomikByGenre(genreSlug, page, 30,);
  const komikList = res?.data || [];
  const pagination = res?.pagination || null;

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-[1400px] animate-fade-in">
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-celestia-pink/15 blur-[120px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 text-center md:text-left">
            <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-2">
              Genre{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-gold to-celestia-pink">
                {displayTitle}
              </span>
            </h1>
            <p className="text-celestia-lavender/70 font-light text-sm md:text-base">
              Menampilkan daftar komik dengan genre {displayTitle}.
            </p>
          </div>

          <Link
            href="/komik/genres"
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

        {komikList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {komikList.map((komik, idx) => (
                <ScrollReveal key={komik.slug || idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>

            {pagination &&
              (pagination.hasNextPage || pagination.hasPrevPage) && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {pagination.hasPrevPage ? (
                    <Link
                      href={`/komik/genre/${genreSlug}?page=${pagination.prevPage}`}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 hover:border-purple-500/30 transition-all"
                    >
                      &laquo; Prev
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed"
                    >
                      &laquo; Prev
                    </button>
                  )}

                  <div className="px-6 py-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-300 font-bold flex items-center">
                    Halaman {pagination.currentPage}
                  </div>

                  {pagination.hasNextPage ? (
                    <Link
                      href={`/komik/genre/${genreSlug}?page=${pagination.nextPage}`}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 hover:border-purple-500/30 transition-all"
                    >
                      Next &raquo;
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed"
                    >
                      Next &raquo;
                    </button>
                  )}
                </div>
              )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-white/50 border border-white/5 rounded-2xl bg-white/5">
            <p>Tidak ada komik ditemukan untuk genre ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
