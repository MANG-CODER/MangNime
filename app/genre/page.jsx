import Link from "next/link";
import { AnimeProvider } from "@/services/providers";

export const metadata = {
  title: "Daftar Genre Anime - MangNime",
};

export default async function GenreListPage() {
  let genreList = [];

  try {
    const [otakuGenres, alqaGenres] = await Promise.all([
      AnimeProvider.Otakudesu.getGenres(),
      AnimeProvider.Alqanime.getGenres(),
    ]);

    // Genre Otakudesu
    const otakuList = (otakuGenres?.genreList || []).map((genre) => ({
      title: genre.title,
      genreId: genre.genreId,
      source: "otakudesu",
    }));

    // Genre Alqanime
    const alqaList = (alqaGenres || []).map((genre) => ({
      title: genre.name,
      genreId: genre.slug,
      source: "alqanime",
    }));

    const genreMap = new Map();

    [...otakuList, ...alqaList].forEach((genre) => {
      const key = genre.genreId.toLowerCase();

      if (!genreMap.has(key)) {
        genreMap.set(key, genre);
      }
    });

    genreList = [...genreMap.values()].sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  } catch (error) {
    console.error("Gagal memuat daftar genre:", error);
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 px-4 md:px-0 mt-6">
      {/* Header Halaman */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-celestia-royal/20 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-xl">
            Eksplorasi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-sky to-celestia-lavender">
              Genre
            </span>
          </h1>

          <p className="text-celestia-lavender/70 font-light text-sm md:text-base tracking-wide max-w-2xl mx-auto">
            Temukan dunia dan petualangan baru berdasarkan genre favoritmu. Dari
            aksi yang mendebarkan hingga romansa yang menghangatkan hati.
          </p>
        </div>
      </div>

      {/* Grid Daftar Genre */}
      {genreList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {genreList.map((genre, idx) => (
            <Link
              href={`/genre/${genre.genreId}`}
              key={idx}
              className="group relative overflow-hidden rounded-2xl p-6 bg-white/[0.02] border border-white/5 hover:border-celestia-lavender/40 hover:shadow-glow-purple transition-all duration-300 flex items-center justify-center text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-celestia-royal/0 to-celestia-lavender/0 group-hover:from-celestia-royal/20 group-hover:to-celestia-lavender/10 transition-colors duration-500"></div>

              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-celestia-sky/30 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <h3 className="relative z-10 font-heading text-lg md:text-xl font-bold text-gray-300 group-hover:text-white transition-colors">
                {genre.title}
              </h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-celestia-lavender">
          <span className="w-10 h-10 border-4 border-celestia-royal border-t-transparent rounded-full animate-spin mb-4"></span>
          <p className="font-light mt-4">Memuat data genre...</p>
        </div>
      )}
    </div>
  );
}
