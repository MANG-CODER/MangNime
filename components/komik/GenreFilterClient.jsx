"use client";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function GenreFilterClient({ genreList }) {
  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-[1200px] animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-2">
            Eksplorasi <span className="text-celestia-pink">Genre</span>
          </h1>
          <p className="text-gray-400">
            Temukan komik berdasarkan genre favoritmu.
          </p>
        </div>

        <div className="relative z-10">
          <ScrollReveal>
            {genreList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genreList.map((genreItem, idx) => {
                  const genreSlug = genreItem.slug;
                  const name = genreItem.name || "Unknown";

                  return (
                    <Link
                      key={idx}
                      href={`/komik/genre/${genreSlug}`}
                      className="bg-[#151226] border border-white/5 hover:border-celestia-sky hover:bg-celestia-sky/5 rounded-xl p-4 flex justify-between items-center group hover:-translate-y-1 shadow-lg transition-all"
                    >
                      <span className="font-bold text-gray-400 group-hover:text-white text-sm transition-colors">
                        {name}
                      </span>
                      <span className="text-gray-600 group-hover:text-celestia-sky transform group-hover:translate-x-1 transition-all">
                        &rarr;
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                Data genre tidak tersedia.
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
