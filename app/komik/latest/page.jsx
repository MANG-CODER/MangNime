import PaginatedKomikList from "@/components/komik/PaginatedKomikList";

export const metadata = { title: "Komik Update Terbaru - MangNime" };

// Banner di server (ikut masuk HTML). Daftar komik diambil di browser user.
export default async function LatestKomikPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams?.page || 1, 10) || 1);

  return (
    <div className="min-h-screen bg-[#161218] pt-6 pb-20 px-4 md:px-8">
      <div className="container mx-auto max-w-[1400px] animate-fade-in space-y-10">
        {/* HEADER */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-11 relative overflow-hidden shadow-vogue-card">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#F4B8C6]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161218] border border-[#F4B8C6]/30 text-[#F4B8C6] text-[11px] font-bold uppercase tracking-[0.18em]">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Rilis Terkini</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7] tracking-tight">
              Update{" "}
              <span className="font-serif italic font-normal text-[#F4B8C6]">
                Terbaru
              </span>
            </h1>
            <p className="text-[#AD9CA6] text-xs md:text-sm max-w-2xl leading-relaxed">
              Ikuti terus perkembangan chapter terbaru dari berbagai manga,
              manhwa, dan manhua favoritmu yang baru saja dirilis hari ini.
            </p>
          </div>
        </div>

        <PaginatedKomikList
          key={page}
          source="latest"
          page={page}
          basePath="/komik/latest"
          emptyText="Belum ada komik terbaru."
        />
      </div>
    </div>
  );
}
