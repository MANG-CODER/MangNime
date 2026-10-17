import Link from "next/link";

export default function Pagination({
  pagination,
  basePath = "",
  queryParams = {},
}) {
  if (!pagination) return null;

  const currentPage = Number(
    pagination.currentPage || pagination.current_page || 1,
  );
  const totalPages = Number(
    pagination.totalPages || pagination.total_pages || 1,
  );

  if (totalPages <= 1 && !pagination.hasNextPage && !pagination.hasPrevPage) {
    return null;
  }

  const hasPrevPage =
    pagination.hasPrevPage !== undefined
      ? pagination.hasPrevPage
      : currentPage > 1;
  const hasNextPage =
    pagination.hasNextPage !== undefined
      ? pagination.hasNextPage
      : currentPage < totalPages;

  const prevPage = pagination.prevPage || currentPage - 1;
  const nextPage = pagination.nextPage || currentPage + 1;

  const buildUrl = (targetPage) => {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    params.set("page", targetPage);
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2.5 mt-12">
      {hasPrevPage ? (
        <Link
          href={buildUrl(prevPage)}
          className="px-5 py-2.5 rounded-full bg-[#211B24] border border-[#F4B8C6]/20 text-xs font-bold text-[#FDF6F7] hover:bg-[#F4B8C6] hover:text-[#161218] transition-all"
        >
          &larr; Sebelumnya
        </Link>
      ) : (
        <button
          disabled
          className="px-5 py-2.5 rounded-full bg-[#211B24]/40 border border-white/5 text-xs font-bold text-[#AD9CA6]/40 cursor-not-allowed"
        >
          &larr; Sebelumnya
        </button>
      )}

      <div className="px-6 py-2.5 rounded-full bg-[#211B24] border border-[#F4B8C6]/35 text-xs font-extrabold text-[#F4B8C6] flex items-center shadow-vogue-card">
        <span>Halaman {currentPage}</span>
        {totalPages > 1 && (
          <>
            <span className="text-[#AD9CA6] mx-2">/</span>
            <span className="text-[#FDF6F7]">{totalPages}</span>
          </>
        )}
      </div>

      {hasNextPage ? (
        <Link
          href={buildUrl(nextPage)}
          className="px-5 py-2.5 rounded-full bg-[#211B24] border border-[#F4B8C6]/20 text-xs font-bold text-[#FDF6F7] hover:bg-[#F4B8C6] hover:text-[#161218] transition-all"
        >
          Selanjutnya &rarr;
        </Link>
      ) : (
        <button
          disabled
          className="px-5 py-2.5 rounded-full bg-[#211B24]/40 border border-white/5 text-xs font-bold text-[#AD9CA6]/40 cursor-not-allowed"
        >
          Selanjutnya &rarr;
        </button>
      )}
    </div>
  );
}
