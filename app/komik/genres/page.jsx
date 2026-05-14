import { fetchKomikAPI } from "@/services/komikApi";
import Link from "next/link";
// 1. IMPORT SCROLL REVEAL
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Daftar Genre - MangNime" };

export default async function KomikGenresPage() {
  const res = await fetchKomikAPI(`/genres`);
  const genreList = res?.data || [];

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-[1200px] animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-2">
            Eksplorasi <span className="text-celestia-pink">Genre</span>
          </h1>
          <p className="text-gray-400">
            Temukan genre Manga, Manhwa, dan Manhua favoritmu.
          </p>
        </div>

        {genreList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genreList.map((genreItem, idx) => {
              const genreId = genreItem.id;
              const name = genreItem.data?.name || "Unknown";

              return (
                // 2. BUNGKUS DENGAN SCROLL REVEAL
                <ScrollReveal key={idx}>
                  <Link
                    href={`/search?type=komik&genreIds=${genreId}`}
                    className="bg-[#151226] border border-white/10 hover:border-celestia-pink rounded-xl p-5 flex justify-between items-center group hover:-translate-y-1 shadow-lg transition-all h-full"
                  >
                    <span className="font-bold text-gray-300 group-hover:text-white text-sm">
                      {name}
                    </span>
                    <span className="text-gray-600 group-hover:text-celestia-pink transition-colors">
                      &rarr;
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
            Data genre tidak tersedia.
          </div>
        )}
      </div>
    </div>
  );
}
