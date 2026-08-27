import AnimeCard from "@/components/anime/AnimeCard";
import KomikCard from "@/components/komik/KomikCard";
import { searchKomikServer } from "@/services/searchAction";
import { searchAllAnime } from "@/services/animeAction";
import ScrollReveal from "@/components/ui/ScrollReveal";

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const keyword = resolvedParams?.q || "";
  return {
    title: keyword
      ? `Pencarian "${keyword}" - MangNime`
      : "Pencarian - MangNime",
  };
}

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const keyword = resolvedParams?.q || "";
  const type = resolvedParams?.type || "all";

  if (!keyword) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4 animate-fade-in">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">
          Masukkan Kata Kunci
        </h2>
        <p className="text-gray-400 text-sm max-w-sm">
          Silakan ketik judul anime atau komik yang ingin kamu cari pada kolom
          pencarian di atas.
        </p>
      </div>
    );
  }

  let animeList = [];
  let komikList = [];

  if (type === "all" || type === "anime") {
    try {
      const animeRes = await searchAllAnime(keyword);
      animeList = Array.isArray(animeRes) ? animeRes : [];
    } catch (error) {
      console.error("Gagal fetch pencarian anime:", error);
    }
  }

  if (type === "all" || type === "komik") {
    try {
      const komikRes = await searchKomikServer(keyword);
      komikList = komikRes?.data || [];
    } catch (error) {
      console.error("Gagal fetch pencarian komik:", error);
    }
  }

  const totalResults = animeList.length + komikList.length;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1400px] mx-auto pb-20 mt-10 px-4 md:px-6">
      <div className="bg-white/[0.02] border border-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-10 text-center md:text-left shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2">
            Hasil Pencarian:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-sky to-celestia-pink">
              &quot;{keyword}&quot;
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Menemukan total{" "}
            <span className="text-white font-bold">{totalResults}</span> hasil
            yang cocok dari pencarian Anda.
          </p>
        </div>
      </div>

      {(type === "all" || type === "anime") && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <svg
              className="w-6 h-6 text-celestia-sky"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
            <h2 className="text-2xl font-black text-celestia-sky tracking-widest uppercase">
              Anime ({animeList.length})
            </h2>
          </div>

          {animeList.length > 0 ? (
            <div
              key={`anime-${keyword}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 animate-fade-in-up"
            >
              {animeList.map((anime, idx) => (
                <ScrollReveal key={idx}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 border border-white/5 rounded-3xl bg-white/[0.02] border-dashed">
              Tidak ada hasil anime untuk kata kunci ini.
            </div>
          )}
        </section>
      )}

      {(type === "all" || type === "komik") && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <svg
              className="w-6 h-6 text-celestia-pink"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h2 className="text-2xl font-black text-celestia-pink tracking-widest uppercase">
              Komik ({komikList.length})
            </h2>
          </div>

          {komikList.length > 0 ? (
            <div
              key={`komik-${keyword}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 animate-fade-in-up"
            >
              {komikList.map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 border border-white/5 rounded-3xl bg-white/[0.02] border-dashed">
              Tidak ada hasil komik untuk kata kunci ini.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
