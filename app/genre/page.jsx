import Link from "next/link";
import { AnimeProvider } from "@/services/providers";

export const metadata = {
  title: "Daftar Genre Anime - MangNime",
};

export const revalidate = 1800;

export default async function GenreListPage() {
  let genreList = [];

  try {
    const otakuGenres = await AnimeProvider.Otakudesu.getGenres();

    genreList = (otakuGenres?.genreList || [])
      .map((genre) => ({
        title: genre.title,
        genreId: genre.genreId,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error("Gagal memuat daftar genre:", error);
  }

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

      {/* GRID GENRE */}
      {genreList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {genreList.map((genre, idx) => (
            <Link
              href={`/genre/${genre.genreId}`}
              key={idx}
              className="group bg-[#211B24]/90 border border-[#F4B8C6]/15 hover:border-[#F4B8C6]/50 hover:bg-[#28202C] rounded-2xl px-4 py-4 flex items-center justify-between shadow-vogue-card hover:-translate-y-0.5 transition-all"
            >
              <span className="font-bold text-xs md:text-sm text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors truncate pr-2">
                {genre.title}
              </span>
              <span className="w-6 h-6 rounded-full bg-[#161218] group-hover:bg-[#F4B8C6] text-[#AD9CA6] group-hover:text-[#161218] flex items-center justify-center text-xs transition-all shrink-0">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[#F4B8C6]">
          <span className="w-9 h-9 border-[3px] border-[#F4B8C6] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-[#AD9CA6]">Memuat data genre...</p>
        </div>
      )}
    </div>
  );
}
