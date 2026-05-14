import { fetchKomikAPI } from "@/services/komikApi";
import KomikCard from "@/components/komik/KomikCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Komik Update Terbaru - MangNime" };


export default async function LatestKomikPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);

  const res = await getLatestKomik(page, {
    next: { revalidate: 3600 },
  });
  const komikList = res?.data?.data || res?.data || [];
  const meta = res?.data?.meta || res?.meta || null;

  let paginationData = null;
  if (meta) {
    const currentPageNum = Number(meta.page || page || 1);
    const totalPagesNum = Number(meta.lastPage || 1);

    paginationData = {
      currentPage: currentPageNum,
      totalPages: totalPagesNum,
      hasNextPage: currentPageNum < totalPagesNum,
      hasPrevPage: currentPageNum > 1,
      // TAMBAHAN WAJIB AGAR KOMPONEN ANDA TIDAK UNDEFINED
      nextPage: currentPageNum < totalPagesNum ? currentPageNum + 1 : null,
      prevPage: currentPageNum > 1 ? currentPageNum - 1 : null,
    };
  }

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <svg
            className="w-8 h-8 text-celestia-pink"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path>
          </svg>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
            Update <span className="text-celestia-pink">Terbaru</span>
          </h1>
        </div>

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
            {paginationData && (
              <Pagination
                pagination={paginationData}
                basePath="/komik/latest"
              />
            )}
          </>
        ) : (
          <div className="text-center py-32 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
            Memuat data...
          </div>
        )}
      </div>
    </div>
  );
}
