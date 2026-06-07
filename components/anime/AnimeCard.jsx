import Image from "next/image";
import Link from "next/link";

export default function AnimeCard({ anime, index = 0 }) {
  const targetUrl = `/anime/${anime.animeId || anime.slug || anime.id}`;
  const imageUrl =
    anime.poster ||
    anime.image ||
    anime.thumb ||
    "https://placehold.co/300x400/0d0b1a/8b6cff?text=No+Image";

  return (
    <Link
      href={targetUrl}
      className="group relative flex flex-col gap-3 rounded-2xl p-2.5 transition-all duration-500 hover:bg-white/[0.02] border border-transparent hover:border-celestia-lavender/30 hover:shadow-glow-purple"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-celestia-deep shadow-lg">
        <Image
          src={imageUrl}
          alt={anime.title || "Anime Poster"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          quality={100}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={index < 8}
        />

        {/* Latar Belakang Blur Cosmic saat Hover */}
        <div className="absolute inset-0 bg-celestia-night/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
          {anime.releaseDay && (
          <div className="bg-celestia-royal/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md border border-celestia-sky/20 uppercase shadow-glow-blue tracking-wider">
            {anime.releaseDay}
          </div>
        )}
          {anime.score && (
            <div className="bg-celestia-night/90 backdrop-blur-md text-celestia-gold text-[10px] font-black px-2 py-1 rounded-md border border-celestia-gold/20 flex items-center gap-1 shadow-glow-gold">
              ★ {anime.score}
            </div>
          )}
          {anime.episodes && (
            <div className="bg-celestia-night/90 backdrop-blur-md text-celestia-pink text-[10px] font-bold px-2 py-1 rounded-md border border-celestia-pink/20">
              Ep {anime.episodes}
            </div>
          )}
        </div>

        {/* Tombol Play Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-celestia-royal to-celestia-lavender flex items-center justify-center shadow-glow-purple transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <svg
              className="w-5 h-5 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 4l12 6-12 6z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-bold text-gray-200 group-hover:text-celestia-sky transition-colors line-clamp-2 leading-snug">
          {anime.title}
        </h3>
        {anime.studios && (
          <p className="text-[11px] text-celestia-lavender/70 mt-1.5 line-clamp-1">
            {anime.studios}
          </p>
        )}
      </div>
    </Link>
  );
}
