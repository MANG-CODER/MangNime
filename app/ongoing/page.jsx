import PaginatedAnimeList from "@/components/anime/PaginatedAnimeList";

export const metadata = { title: "Anime Ongoing - MangNime" };

// Banner di server (ikut masuk HTML). Daftar anime diambil di browser user.
export default async function OngoingPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams?.page || 1, 10) || 1);

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

          <div className="px-4 py-2 rounded-full bg-[#161218] border border-[#F4B8C6]/20 text-xs font-bold text-[#AD9CA6]">
            Halaman <span className="text-[#F4B8C6]">{page}</span>
          </div>
        </div>
      </div>

      <PaginatedAnimeList
        key={page}
        source="ongoing"
        page={page}
        basePath="/ongoing"
        keyPrefix="ong"
        emptyText="Tidak ada anime ongoing tersedia."
      />
    </div>
  );
}
