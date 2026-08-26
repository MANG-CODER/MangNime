import { getPopularKomik } from "@/services/komikApi";
import KomikCard from "@/components/komik/KomikCard";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Komik Populer - MangNime" };

const POPULAR_FILTERS = [{ id: "all", label: "🔥 Trending" }];

export default async function PopularKomikPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);

  const res = await getPopularKomik(page, 30, {
    next: { revalidate: 3600 },
  });

  const komikList = res?.data || [];
  const pagination = res?.pagination || null;

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-[1400px] animate-fade-in">
        {/* HEADER */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-celestia-lavender/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-celestia-royal/20 border border-celestia-royal/30 text-celestia-sky text-xs font-bold uppercase tracking-widest mb-4">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Peringkat Tertinggi
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-wide">
              Komik <span className="text-celestia-lavender">Populer</span>
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              Jelajahi jajaran komik terbaik, karya terhangat yang sedang ramai
              dibicarakan, hingga komik dengan adaptasi anime paling dinantikan
              oleh para pembaca.
            </p>
          </div>
        </div>

        {/* KONTEN */}
        {komikList.length > 0 ? (
          <>
            <div
              key={`popular-${page}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 animate-fade-in-up"
            >
              {komikList.map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>

            {pagination &&
              (pagination.hasNextPage || pagination.hasPrevPage) && (
                <div className="mt-12 flex justify-center">
                  <OpenEndedPagination pagination={pagination} />
                </div>
              )}
          </>
        ) : (
          <div className="text-center py-32 text-gray-500 bg-white/5 rounded-2xl border border-white/10 border-dashed">
            Sedang mencari data komik populer...
          </div>
        )}
      </div>
    </div>
  );
}

function OpenEndedPagination({ pagination }) {
  if (!pagination) return null;

  const { currentPage, hasPrevPage, prevPage, hasNextPage, nextPage } =
    pagination;
  const createUrl = (targetPage) => `/komik/popular?page=${targetPage}`;

  return (
    <div className="flex items-center justify-center gap-2 w-full">
      {hasPrevPage ? (
        <Link
          href={createUrl(prevPage)}
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

      <div className="px-6 py-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-300 font-bold flex items-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
        Halaman {currentPage}
      </div>

      {hasNextPage ? (
        <Link
          href={createUrl(nextPage)}
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
  );
}
