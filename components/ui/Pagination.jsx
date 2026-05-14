import Link from "next/link";

export default function Pagination({ pagination, basePath }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const {
    currentPage,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    totalPages,
  } = pagination;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Tombol Previous */}
      {hasPrevPage ? (
        <Link
          href={`${basePath}?page=${prevPage}`}
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

      {/* Indikator Halaman */}
      <div className="px-6 py-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-300 font-bold flex items-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
        Halaman {currentPage} <span className="text-gray-500 mx-2">/</span>{" "}
        {totalPages}
      </div>

      {/* Tombol Next */}
      {hasNextPage ? (
        <Link
          href={`${basePath}?page=${nextPage}`}
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
