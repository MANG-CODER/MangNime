import AnimeCard from "@/components/anime/AnimeCard";
import KomikCard from "@/components/komik/KomikCard";
import Link from "next/link";
import { searchKomikServer } from "@/services/searchAction";
import { searchAllAnime } from "@/services/animeAction";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Pencarian - MangNime" };

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const keyword = resolvedParams?.q || "";
  const type = resolvedParams?.type || "all";

  if (!keyword) {
    return (
      <div className="text-center py-32 text-gray-500 font-bold text-xl animate-fade-in">
        Silakan masukkan kata kunci pencarian.
      </div>
    );
  }

  let animeList = [];
  let komikList = [];

  // PENCARIAN KOMIK
  if (type === "all" || type === "komik") {
    try {
      const komikRes = await searchKomikServer(keyword);
      komikList = komikRes?.data || [];
    } catch (error) {
      console.error("Gagal fetch pencarian komik:", error);
    }
  }

  // PENCARIAN ANIME
  if (type === "all" || type === "anime") {
    try {
      animeList = await searchAllAnime(keyword);
    } catch (error) {
      console.error("Gagal fetch pencarian anime:", error);
    }
  }

  let judulTitle = `"${keyword}"`;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1400px] mx-auto pb-10 mt-10 px-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 text-center md:text-left shadow-lg">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
          Hasil Pencarian:{" "}
          <span className="text-celestia-sky">{judulTitle}</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Menemukan{" "}
          {animeList.length > 0 && (
            <span className="text-celestia-sky font-bold">
              {animeList.length} Anime
            </span>
          )}
          {animeList.length > 0 && komikList.length > 0 && " dan "}
          {komikList.length > 0 && (
            <span className="text-celestia-pink font-bold">
              {komikList.length} Komik
            </span>
          )}
          .
        </p>
      </div>

      {/* SEGMEN ANIME */}
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
              Anime
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
            <div className="text-center py-16 text-gray-500 border border-white/5 rounded-2xl bg-white/5 border-dashed">
              Anime tidak ditemukan.
            </div>
          )}
        </section>
      )}

      {/* SEGMEN KOMIK */}
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
              Komik
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
            <div className="text-center py-16 text-gray-500 border border-white/5 rounded-2xl bg-white/5 border-dashed">
              Komik tidak ditemukan untuk pencarian ini.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
