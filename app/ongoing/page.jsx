import AnimeCard from "@/components/anime/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { AnimeProvider } from "@/services/providers";

export const metadata = { title: "Anime Ongoing - MangNime" };
export const revalidate = 1800;

const withTimeout = (promise, ms = 8000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms),
    ),
  ]);

export default async function OngoingPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);

  let otakuList = [];
  let paginationData = null;
  let fetchError = false;

  try {
    const otakuRes = await withTimeout(
      AnimeProvider.Otakudesu.getOngoing(page),
    );

    otakuList = otakuRes?.data || [];
    paginationData = otakuRes?.pagination || null;

    if (!otakuRes) fetchError = true;
  } catch (error) {
    console.error("Gagal memuat Ongoing:", error);
    fetchError = true;
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 px-4 md:px-8">
      {/* HEADER BANNER */}
      <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-11 relative overflow-hidden mt-6 shadow-vogue-card">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#F4B8C6]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161218] border border-[#F4B8C6]/30 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4B8C6]">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Simulcast Lineup</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7] tracking-tight">
              Anime{" "}
              <span className="font-serif italic font-normal text-[#F4B8C6]">
                Ongoing
              </span>
            </h1>
            <p className="text-[#AD9CA6] text-xs md:text-sm max-w-xl mx-auto md:mx-0">
              Daftar episode terbaru dari anime yang sedang tayang pada musim
              ini.
            </p>
          </div>

          {paginationData?.currentPage && (
            <div className="px-4 py-2 rounded-full bg-[#161218] border border-[#F4B8C6]/20 text-xs font-bold text-[#AD9CA6]">
              Halaman{" "}
              <span className="text-[#F4B8C6]">
                {paginationData.currentPage}
              </span>
            </div>
          )}
        </div>
      </div>

      {otakuList.length > 0 ? (
        <>
          <div
            key={`ongoing-${page}`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-7"
          >
            {otakuList.map((anime, idx) => {
              const uniqueKey = anime.animeId || anime.slug || `ong-${idx}`;
              return (
                <ScrollReveal key={uniqueKey}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              );
            })}
          </div>

          <Pagination pagination={paginationData} basePath="/ongoing" />
        </>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#AD9CA6] border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/60 text-center px-4">
          <svg
            className="w-10 h-10 text-[#E88D9E] mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="font-extrabold text-[#FDF6F7] text-base">
            Gagal memuat data
          </p>
          <p className="text-xs mt-1 text-[#AD9CA6]">
            Server sedang tidak bisa diakses, silakan coba beberapa saat lagi.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[#AD9CA6] border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/60">
          <p className="text-sm">Tidak ada anime ongoing tersedia.</p>
        </div>
      )}
    </div>
  );
}
