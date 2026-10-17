import Image from "next/image";
import Link from "next/link";

export default function AnimeCard({ anime, index = 0, hideMeta = false }) {
  const targetUrl =
    anime.source === "alqanime"
      ? `/anime/alqanime/detail/${anime.slug}`
      : `/anime/${anime.animeId || anime.slug || anime.id}`;

  const imageUrl =
    anime.poster ||
    anime.image ||
    anime.thumb ||
    "https://placehold.co/300x450/211B24/F4B8C6?text=No+Image";

  const typeOrDay = anime.releaseDay || anime.type || anime.status;
  const score = anime.score || anime.rating;
  const episodes = anime.episodes || anime.episode;

  return (
    <Link
      href={targetUrl}
      prefetch={false}
      className="group flex flex-col select-none active:scale-[0.98] transition-transform duration-300"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[20px] bg-[#211B24] ring-1 ring-[#F4B8C6]/15 group-hover:ring-[#F4B8C6]/50 shadow-vogue-card transition-all duration-300">
        <Image
          src={imageUrl}
          alt={anime.title || "Anime Poster"}
          fill
          unoptimized
          sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          priority={index < 4}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#161218]/90 via-[#161218]/15 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        <div className="absolute inset-2 rounded-[14px] border border-[#F4B8C6]/0 group-hover:border-[#F4B8C6]/35 transition-colors duration-500 pointer-events-none z-10" />

        {!hideMeta && (
          <>
            {episodes && episodes !== "?" && (
              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#161218]/80 backdrop-blur-md border border-[#F4B8C6]/30 text-[10px] font-bold text-[#FDF6F7] tracking-wide">
                {String(episodes).toLowerCase().includes("ep")
                  ? episodes
                  : `Ep ${episodes}`}
              </div>
            )}

            {score && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#161218]/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#F7D6C4]">
                <span>★</span>
                <span>{score}</span>
              </div>
            )}
          </>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <div className="px-4 py-2 rounded-full bg-[#F4B8C6]/95 text-[#161218] font-extrabold text-xs flex items-center gap-1.5 shadow-vogue-blush transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M4 4l12 6-12 6z" />
            </svg>
            <span>Tonton</span>
          </div>
        </div>
      </div>

      <div className="mt-3 px-1 space-y-0.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#E88D9E]">
          <svg
            className="w-3 h-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
            <polyline points="17 2 12 7 7 2" />
          </svg>
          <span className="truncate">
            {typeOrDay || anime.studios || anime.studio || "Anime"}
          </span>
        </div>

        <h3 className="text-sm font-bold text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors line-clamp-2 leading-snug">
          {anime.title}
        </h3>
      </div>
    </Link>
  );
}
