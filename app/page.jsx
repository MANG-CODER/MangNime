import HeroCarousel from "@/components/home/HeroCarousel";
import AnimeCard from "@/components/anime/AnimeCard";
import KomikCard from "@/components/komik/KomikCard";
import Link from "next/link";
import { KomikProvider } from "@/services/komikApi";
import { AnimeProvider } from "@/services/providers";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CommentSection from "@/components/ui/CommentSection";

export const metadata = {
  title: "MangNime - Streaming Anime & Baca Komik Gratis",
};

export const revalidate = 3600;

export default async function Home() {
  let ongoingList = [];
  let completedList = [];
  let popularKomik = [];
  let latestKomik = [];

  try {
    const [animeRes, komikRes] = await Promise.all([
      AnimeProvider.Otakudesu.getHome(),
      KomikProvider.getHome(),
    ]);

    // Parsing Anime
    ongoingList = animeRes?.ongoing || [];
    completedList = animeRes?.completed || [];

    // Parsing Komik
    popularKomik = komikRes?.popular || [];
    latestKomik = komikRes?.latest || [];
  } catch (error) {
    console.error("Gagal memuat Homepage:", error);
  }

  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      {/* Hero Carousel Anime */}
      {ongoingList.length > 0 && (
        <HeroCarousel items={ongoingList.slice(0, 5)} />
      )}

      <div className="container mx-auto px-4 md:px-6 max-w-[1400px] space-y-20 mt-10">
        <ScrollReveal>
          <div className="bg-gradient-to-r from-celestia-royal/10 via-celestia-lavender/5 to-transparent border border-celestia-sky/20 p-5 md:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_20px_rgba(76,201,255,0.05)] backdrop-blur-md relative overflow-hidden">
            {/* Aksen Dekoratif */}
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-celestia-sky/10 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-celestia-sky/10 rounded-xl flex items-center justify-center shrink-0 border border-celestia-sky/30 shadow-glow-blue">
                <svg
                  className="w-6 h-6 text-celestia-sky drop-shadow-[0_0_8px_rgba(76,201,255,0.6)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  Mencari Anime Lama atau Movie?
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Jika anime yang kamu cari tidak ada di halaman ini, silakan
                  gunakan fitur{" "}
                  <span className="text-celestia-sky font-bold">
                    Pencarian (Search)
                  </span>{" "}
                  yang kini lebih lengkap!
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Ongoing Anime */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-heading text-2xl md:text-4xl font-black flex items-center gap-4 text-white drop-shadow-lg">
              <span className="w-2 h-10 bg-celestia-lavender rounded-full shadow-glow-purple"></span>
              Anime{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-lavender to-celestia-sky">
                Ongoing
              </span>
            </h2>
            <Link
              href="/ongoing"
              className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-celestia-lavender transition-all"
            >
              Lihat Semua
              <span className="bg-white/5 group-hover:bg-celestia-royal group-hover:text-white px-2.5 py-1 rounded-lg transition-all">
                &rarr;
              </span>
            </Link>
          </div>

          {ongoingList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {ongoingList.slice(0, 10).map((anime, idx) => (
                <ScrollReveal key={idx}>
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 font-light border border-white/5 rounded-2xl bg-white/[0.02]">
              Sedang memuat tayangan...
            </div>
          )}
        </section>

        {/* Completed Anime */}
        <section>
          <div className="flex justify-between items-center mb-8 border-t border-white/5 pt-10">
            <h2 className="font-heading text-2xl md:text-4xl font-black flex items-center gap-4 text-white drop-shadow-lg">
              <span className="w-2 h-10 bg-celestia-gold rounded-full shadow-[0_0_15px_rgba(255,108,155,0.8)]"></span>
              Anime{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-gold to-celestia-pink">
                Completed
              </span>
            </h2>
            <Link
              href="/completed"
              className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-300 transition-all"
            >
              Lihat Semua
              <span className="bg-white/5 group-hover:bg-gray-500 group-hover:text-white px-2.5 py-1 rounded-lg transition-all">
                &rarr;
              </span>
            </Link>
          </div>

          {completedList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {completedList.slice(0, 10).map((anime, idx) => (
                <ScrollReveal key={idx}>
                  <AnimeCard anime={anime} index={idx + 10} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 font-light border border-white/5 rounded-2xl bg-white/[0.02]">
              Sedang memuat tayangan...
            </div>
          )}
        </section>

        {/* Populer Komik */}
        <section>
          <div className="flex justify-between items-center mb-8 border-t border-white/5 pt-10">
            <h2 className="font-heading text-2xl md:text-4xl font-black flex items-center gap-4 text-white drop-shadow-lg">
              <span className="w-2 h-10 bg-celestia-gold rounded-full shadow-glow-gold"></span>
              Komik{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-gold to-yellow-500">
                Populer
              </span>
            </h2>
            <Link
              href="/komik/popular"
              className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-celestia-gold transition-all"
            >
              Lihat Semua
              <span className="bg-white/5 group-hover:bg-celestia-gold group-hover:text-celestia-night px-2.5 py-1 rounded-lg transition-all">
                &rarr;
              </span>
            </Link>
          </div>

          {popularKomik.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {popularKomik.slice(0, 10).map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 font-light border border-white/5 rounded-2xl bg-white/[0.02]">
              Sedang memuat komik...
            </div>
          )}
        </section>

        {/* Update Terbaru Komik */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-heading text-2xl md:text-4xl font-black flex items-center gap-4 text-white drop-shadow-lg">
              <span className="w-2 h-10 bg-celestia-pink rounded-full shadow-[0_0_15px_rgba(255,108,155,0.8)]"></span>
              Komik{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-pink to-pink-500">
                Terbaru
              </span>
            </h2>
            <Link
              href="/komik/latest"
              className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-celestia-pink transition-all"
            >
              Lihat Semua
              <span className="bg-white/5 group-hover:bg-celestia-pink group-hover:text-white px-2.5 py-1 rounded-lg transition-all">
                &rarr;
              </span>
            </Link>
          </div>

          {latestKomik.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {latestKomik.slice(0, 10).map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 font-light border border-white/5 rounded-2xl bg-white/[0.02]">
              Sedang memuat komik...
            </div>
          )}
        </section>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        <CommentSection
          topicId="komunitas-homepage"
          title="💬 Komunitas MangNime"
        />
      </div>
    </div>
  );
}
