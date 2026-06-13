import AnimeCard from "@/components/anime/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { AnimeProvider } from "@/services/providers";
import { getMergeKey } from "@/utils/mergeAnime";

export const metadata = {
  title: "Anime Completed - MangNime",
};
export const revalidate = 7200;

const withTimeout = (promise, ms = 8000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms),
    ),
  ]);

export default async function CompletedPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);

  let otakuList = [];
  let paginationData = null;
  let alqaSlice = [];
  let fetchError = false;

  try {
    const [otakuRes, alqaRes] = await Promise.allSettled([
      withTimeout(AnimeProvider.Otakudesu.getCompleted(page)),
      withTimeout(AnimeProvider.Alqanime.getCompleted(page)),
    ]);

    // Otakudesu = primary
    if (otakuRes.status === "fulfilled" && otakuRes.value) {
      otakuList = otakuRes.value.data || [];
      paginationData = otakuRes.value.pagination || null;
    }

    // Alqanime = filler exclusive aja (yg gak ada di otakudesu)
    if (alqaRes.status === "fulfilled" && alqaRes.value) {
      const alqaItems = alqaRes.value.data || alqaRes.value.animeList || [];

      const otakuKeys = new Set(
        otakuList.map((a) => getMergeKey(a.title)).filter(Boolean),
      );

      const alqaSeen = new Set();
      const alqaExclusives = [];

      alqaItems.forEach((anime) => {
        const status = (anime.status || "").toLowerCase();
        if (status.includes("ongoing") || status.includes("tayang")) return;

        const key = getMergeKey(anime.title);
        if (!key || alqaSeen.has(key) || otakuKeys.has(key)) return;

        alqaSeen.add(key);
        alqaExclusives.push(anime);
      });

      alqaSlice = alqaExclusives.slice(0, 3);
    }

    // Kalau dua-duanya gagal, set error
    if (otakuRes.status === "rejected" && alqaRes.status === "rejected") {
      fetchError = true;
    }
  } catch (error) {
    console.error("Gagal memuat Completed:", error);
    fetchError = true;
  }

  const animeList = [...otakuList, ...alqaSlice];

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
              const uniqueKey =
                anime.animeId || anime.slug || anime.anime_id || `comp-${idx}`;
              return (
                <ScrollReveal key={uniqueKey}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              );
            })}
          </div>

          {paginationData && (
            <Pagination pagination={paginationData} basePath="/completed" />
          )}
        </>
      ) : fetchError ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-white/5 rounded-2xl bg-white/[0.02]">
          <p className="text-4xl mb-4">😵</p>
          <p className="font-bold text-white">Gagal memuat data</p>
          <p className="text-sm mt-2 text-gray-400">
            Server sedang tidak bisa diakses, coba beberapa saat lagi.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-white/5 rounded-2xl bg-white/[0.02]">
          <p className="font-light">Tidak ada anime completed tersedia.</p>
        </div>
      )}
    </div>
  );
}
