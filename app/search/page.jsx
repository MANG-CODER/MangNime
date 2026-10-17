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
        <div className="w-16 h-16 bg-[#211B24] border border-[#F4B8C6]/25 rounded-full flex items-center justify-center text-[#F4B8C6]">
          <svg
            className="w-7 h-7"
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
        <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7]">
          Masukkan Kata Kunci Pencarian
        </h2>
        <p className="text-[#AD9CA6] text-xs md:text-sm max-w-sm">
          Silakan ketik judul anime atau komik yang ingin kamu cari pada kolom
          pencarian di bagian atas.
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
    <div className="space-y-12 animate-fade-in max-w-[1400px] mx-auto pb-20 mt-8 px-4 md:px-8">
      {/* HEADER PENCARIAN */}
      <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 text-center md:text-left shadow-vogue-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E88D9E]">
            Search Results
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#FDF6F7]">
            Hasil Pencarian:{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              &ldquo;{keyword}&rdquo;
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm">
            Menemukan total{" "}
            <span className="text-[#F4B8C6] font-extrabold">
              {totalResults}
            </span>{" "}
            judul yang cocok dari katalog kami.
          </p>
        </div>
      </div>

      {/* HASIL ANIME */}
      {(type === "all" || type === "anime") && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4B8C6]/15 pb-3.5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#211B24] border border-[#F4B8C6]/25 text-[#F4B8C6]">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7]">
                Katalog Anime
              </h2>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-[#F4B8C6]/15 border border-[#F4B8C6]/30 text-xs font-extrabold text-[#F4B8C6]">
              {animeList.length} Judul
            </span>
          </div>

          {animeList.length > 0 ? (
            <div
              key={`anime-${keyword}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7"
            >
              {animeList.map((anime, idx) => (
                <ScrollReveal key={idx}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 text-[#AD9CA6] text-sm border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/50">
              Tidak ada hasil anime untuk kata kunci ini.
            </div>
          )}
        </section>
      )}

      {/* HASIL KOMIK */}
      {(type === "all" || type === "komik") && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#F4B8C6]/15 pb-3.5">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#211B24] border border-[#B8C4D4]/30 text-[#B8C4D4]">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7]">
                Katalog Komik
              </h2>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-[#B8C4D4]/15 border border-[#B8C4D4]/30 text-xs font-extrabold text-[#B8C4D4]">
              {komikList.length} Judul
            </span>
          </div>

          {komikList.length > 0 ? (
            <div
              key={`komik-${keyword}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7"
            >
              {komikList.map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 text-[#AD9CA6] text-sm border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/50">
              Tidak ada hasil komik untuk kata kunci ini.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
