import AnimeCard from "@/components/anime/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { AnimeProvider } from "@/services/providers";
import { mergeAnimeLists } from "@/utils/mergeAnime";

export const metadata = { title: "Anime Completed - MangNime" };

  const animeList = mergeAnimeLists(otakuList, alqaList);

export default async function CompletedPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);


  let otakuList = [];
  let alqaList = [];
  let paginationData = null;

  try {
    const promises = [AnimeProvider.Otakudesu.getCompleted(page)];

    if (page === 1) {
      promises.push(AnimeProvider.Alqanime.getCompleted(page));
    }

    const results = await Promise.allSettled(promises);
    if (results[0].status === "fulfilled" && results[0].value) {
      otakuList = results[0].value.data || [];
      paginationData = results[0].value.pagination || null;
    }

    if (page === 1 && results[1]?.status === "fulfilled" && results[1].value) {
      alqaList = results[1].value.data || results[1].value.animeList || [];
    }
  } catch (error) {
    console.error("Gagal memuat Completed:", error);
  }

  const animeMap = new Map();

  otakuList.forEach((anime) => {
    const key = getMergeKey(anime.title);
    if (key) animeMap.set(key, anime);
  });

  alqaList.forEach((anime) => {
    const status = (anime.status || "").toLowerCase();
    if (status.includes("ongoing")) return;

    const key = getMergeKey(anime.title);

    if (key && !animeMap.has(key)) {
      animeMap.set(key, anime);
    } else if (key && animeMap.has(key)) {
      const existing = animeMap.get(key);
      animeMap.set(key, {
        ...existing,
        poster: existing.poster || anime.poster,
        score: existing.score || anime.score || anime.rating,
      });
    }
  });

  const animeList = Array.from(animeMap.values());

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 px-4 md:px-0">
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden mt-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-celestia-sky/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-xl">
              Anime{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-gold to-celestia-pink">
                Completed
              </span>
            </h1>
            <p className="text-celestia-lavender/70 font-light text-sm md:text-base tracking-wide max-w-xl mx-auto md:mx-0">
              Tonton anime favoritmu sampai tamat tanpa perlu menunggu episode
              rilis setiap minggu.
            </p>
          </div>
        </div>
      </div>

      {animeList.length > 0 ? (
        <>
          <div
            key={`completed-${page}`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 animate-fade-in-up"
          >
            {animeList.map((anime, idx) => {
              const uniqueKey = anime.animeId || anime.slug || `comp-${idx}`;
              return (
                <ScrollReveal key={uniqueKey}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              );
            })}
          </div>
          {/* Pagination tetap menggunakan Otakudesu sebagai patokan nomor halaman */}
          {paginationData && (
            <Pagination pagination={paginationData} basePath="/completed" />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-celestia-lavender">
          <span className="w-10 h-10 border-4 border-celestia-royal border-t-transparent rounded-full animate-spin mb-4"></span>
          <p className="font-light">
            Mencari serpihan bintang (Memuat data)...
          </p>
        </div>
      )}
    </div>
  );
}
