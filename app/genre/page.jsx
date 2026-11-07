import GenreGrid from "./GenreGrid";

export const metadata = {
  title: "Daftar Genre Anime - MangNime",
};

export default function GenreListPage() {
  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 px-4 md:px-8 mt-6">
      {/* HEADER BANNER */}
      <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-11 relative overflow-hidden shadow-vogue-card">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#F4B8C6]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161218] border border-[#F4B8C6]/30 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4B8C6]">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>Anime Category</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7] tracking-tight">
            Eksplorasi{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Genre Anime
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm max-w-xl mx-auto">
            Temukan dunia dan petualangan baru berdasarkan genre favoritmu, dari
            aksi mendebarkan hingga kisah slice of life yang hangat.
          </p>
        </div>
      </div>

      {/* GRID GENRE (diambil di browser user) */}
      <GenreGrid />
    </div>
  );
}
