import AnimeCard from "@/components/anime/AnimeCard";
import Pagination from "@/components/ui/Pagination";
import { fetchWithDelay, API_ENDPOINTS } from "@/services/api";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Anime Completed - MangNime" };

export default async function CompletedPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);
  const baseEndpoint = API_ENDPOINTS.COMPLETE.replace(/\/$/, "");
  const endpoint = page === 1 ? baseEndpoint : `${baseEndpoint}?page=${page}`;

  let animeList = [];
  let paginationData = null;

  try {
    const res = await fetchWithDelay(endpoint, 500, {
      next: { revalidate: 3600 },
    });
    animeList = res?.data?.animeList || res?.data || [];
    paginationData = res?.pagination || null;
  } catch (error) {
    console.error("Gagal memuat Completed:", error);
  }

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
            {animeList.map((anime, idx) => (
              <ScrollReveal key={idx}>
                <AnimeCard anime={anime} index={idx} />
              </ScrollReveal>
            ))}
          </div>
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
