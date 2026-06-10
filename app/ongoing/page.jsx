import AnimeCard from "@/components/anime/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { AnimeProvider } from "@/services/providers";
import { getMergeKey } from "@/utils/mergeAnime";

export const metadata = { title: "Anime Ongoing - MangNime" };
const OTAKU_SCAN_PAGES = 5;
const ALQ_SCAN_PAGES = 3;
const ALQ_PER_PAGE = 3;

export default async function OngoingPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);

  let otakuList = [];
  let paginationData = null;
  let alqaSlice = [];

  try {
    const [otakuCurrentRes, ...restResults] = await Promise.allSettled([
      AnimeProvider.Otakudesu.getOngoing(page),
      ...[...Array(OTAKU_SCAN_PAGES)].map((_, i) =>
        AnimeProvider.Otakudesu.getOngoing(i + 1),
      ),
      ...[...Array(ALQ_SCAN_PAGES)].map((_, i) =>
        AnimeProvider.Alqanime.getOngoing(i + 1),
      ),
    ]);

    const otakuAllResults = restResults.slice(0, OTAKU_SCAN_PAGES);
    const alqaAllResults = restResults.slice(OTAKU_SCAN_PAGES);

    if (otakuCurrentRes.status === "fulfilled" && otakuCurrentRes.value) {
      otakuList = otakuCurrentRes.value.data || [];
      paginationData = otakuCurrentRes.value.pagination || null;
    }

    const otakuAllKeys = new Set();
    otakuAllResults.forEach((res) => {
      if (res.status === "fulfilled" && res.value) {
        (res.value.data || []).forEach((anime) => {
          const key = getMergeKey(anime.title);
          if (key) otakuAllKeys.add(key);
        });
      }
    });

    const alqaSeen = new Set();
    const alqaExclusives = [];

    alqaAllResults.forEach((res) => {
      if (res.status !== "fulfilled" || !res.value) return;
      const items = res.value.data || res.value.animeList || [];

      items.forEach((anime) => {
        const status = (anime.status || "").toLowerCase();
        if (status.includes("completed") || status.includes("tamat")) return;

        const key = getMergeKey(anime.title);
        if (!key) return;
        if (alqaSeen.has(key)) return;
        alqaSeen.add(key);
        if (otakuAllKeys.has(key)) return;

        alqaExclusives.push(anime);
      });
    });

    const alqaStart = (page - 1) * ALQ_PER_PAGE;
    alqaSlice = alqaExclusives.slice(alqaStart, alqaStart + ALQ_PER_PAGE);
  } catch (error) {
    console.error("Gagal memuat Ongoing:", error);
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-lavender to-celestia-sky">
                Ongoing
              </span>
            </h1>
            <p className="text-celestia-lavender/70 font-light text-sm md:text-base tracking-wide max-w-xl mx-auto md:mx-0">
              Episode terbaru dari anime yang sedang tayang musim ini.
            </p>
          </div>
        </div>
      </div>

      {animeList.length > 0 ? (
        <>
          <div
            key={`ongoing-${page}`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 animate-fade-in-up"
          >
            {animeList.map((anime, idx) => {
              const uniqueKey = anime.animeId || anime.slug || `ong-${idx}`;
              return (
                <ScrollReveal key={uniqueKey}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              );
            })}
          </div>
          {paginationData && (
            <Pagination pagination={paginationData} basePath="/ongoing" />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-celestia-lavender">
          <span className="w-10 h-10 border-4 border-celestia-sky border-t-transparent rounded-full animate-spin mb-4"></span>
          <p className="font-light">Mencari tayangan terbaru...</p>
        </div>
      )}
    </div>
  );
}
