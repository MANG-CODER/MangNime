import { KomikProvider } from "@/services/komikApi";
import KomikCard from "@/components/komik/KomikCard";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Komik Update Terbaru - MangNime" };

export default async function LatestKomikPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);

  const res = await KomikProvider.getLatest(page);
  const komikList = res?.data || [];
  const pagination = res?.pagination || null;

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-[1400px] animate-fade-in">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-celestia-pink/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-celestia-royal/20 border border-celestia-royal/30 text-celestia-pink text-xs font-bold uppercase tracking-widest mb-4">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path>
              </svg>
              Rilis Terkini
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-wide">
              Update <span className="text-celestia-pink">Terbaru</span>
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed">
              Ikuti terus perkembangan chapter terbaru dari berbagai manga,
              manhwa, dan manhua favoritmu yang baru saja dirilis.
            </p>
          </div>
        </div>

        {/* KONTEN */}
        {komikList.length > 0 ? (
          <>
            <div
              key={`latest-${page}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 animate-fade-in-up"
            >
              {komikList.map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>

            {pagination && (
              <div className="mt-12 flex justify-center">
                <OpenEndedPagination
                  pagination={pagination}
                  basePath="/komik/latest"
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 text-gray-500 bg-white/5 rounded-2xl border border-white/10 border-dashed">
            Memuat data...
          </div>
        )}
      </div>
    </div>
  );
}

function OpenEndedPagination({ pagination, basePath }) {
  if (!pagination) return null;

  const currentPage = Number(
    pagination.current_page || pagination.currentPage || 1,
  );
  const totalPages = Number(
    pagination.total_pages || pagination.totalPages || 1,
  );

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const cleanBasePath = basePath || "/komik/latest";

  return (
    <div className="flex items-center justify-center gap-2 w-full">
      {hasPrevPage ? (
        <Link
          href={`${cleanBasePath}?page=${prevPage}`}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 hover:border-purple-500/30 transition-all inline-block"
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
        Halaman {currentPage} {totalPages > 1 ? `/ ${totalPages}` : ""}
      </div>

      {hasNextPage ? (
        <Link
          href={`${cleanBasePath}?page=${nextPage}`}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 hover:border-purple-500/30 transition-all inline-block"
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
