import { fetchKomikAPI } from "@/services/komikApi";
import KomikCard from "@/components/komik/KomikCard";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Komik Populer - MangNime" };

const POPULAR_FILTERS = [
  { id: "all", label: "🔥 Trending" },
  { id: "manga", label: "Best Manga" },
  { id: "manhwa", label: "Best Manhwa" },
  { id: "manhua", label: "Best Manhua" },
];

export default async function PopularKomikPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);
  const category = resolvedParams?.category || "all";

  const res = await fetchKomikAPI(
    `/popular?category=${category}&page=${page}&take=20`,
    0,
    { next: { revalidate: 3600 } },
  );

  // ✅ Data dari Deno sudah dinormalisasi — langsung pakai, tidak perlu unwrap lagi
  const komikList = res?.data?.data || res?.data || [];
  const meta = res?.data?.meta || res?.meta || null;

  // Pagination
  let paginationData = null;
  if (meta?.lastPage) {
    const currentPageNum = Number(meta.page || page || 1);
    const totalPagesNum = Number(meta.lastPage || 1);
    paginationData = {
      currentPage: currentPageNum,
      totalPages: totalPagesNum,
      hasNextPage: currentPageNum < totalPagesNum,
      hasPrevPage: currentPageNum > 1,
      nextPage: currentPageNum < totalPagesNum ? currentPageNum + 1 : null,
      prevPage: currentPageNum > 1 ? currentPageNum - 1 : null,
    };
  }

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

        {/* FILTER KATEGORI */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 mb-8 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2 text-gray-400 pr-4 md:border-r border-white/10 shrink-0">
            <svg
              className="w-5 h-5 text-celestia-pink"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="font-bold text-sm uppercase tracking-wider">
              Filter Kategori:
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {POPULAR_FILTERS.map((filter) => (
              <Link
                key={filter.id}
                href={`/komik/popular?category=${filter.id}`}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  category === filter.id
                    ? "bg-celestia-lavender text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    : "bg-transparent text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>

        {/* KONTEN */}
        {komikList.length > 0 ? (
          <>
            <div
              key={`popular-${category}-${page}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 animate-fade-in-up"
            >
              {komikList.map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>

            {paginationData && (
              <div className="mt-12 flex justify-center">
                <PopularPagination
                  pagination={paginationData}
                  category={category}
                />
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

function PopularPagination({ pagination, category }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const {
    currentPage,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    totalPages,
  } = pagination;
  const createUrl = (targetPage) =>
    `/komik/popular?category=${category}&page=${targetPage}`;

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
        Halaman {currentPage} <span className="text-gray-500 mx-2">/</span>{" "}
        {totalPages}
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
