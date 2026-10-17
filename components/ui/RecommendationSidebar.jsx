import Image from "next/image";
import Link from "next/link";

export default function RecommendationSidebar({
  items = [],
  type = "anime",
  title = "Rekomendasi",
  subtitle = "Curated Picks",
}) {
  const isAnime = type === "anime";
  const accentColor = isAnime ? "#F4B8C6" : "#B8C4D4";

  const normalizeItem = (item) => {
    const slug = item.animeId || item.slug || item.id;
    return {
      href: isAnime ? `/anime/${slug}` : `/komik/${slug}`,
      title: item.title || "Judul Tidak Diketahui",
      image:
        item.poster ||
        item.image ||
        "https://placehold.co/300x400/211B24/F4B8C6?text=No+Image",
      badge: isAnime
        ? item.score
          ? `★ ${item.score}`
          : item.status || "Anime Pilihan"
        : item.chapter || item.type || "Komik Pilihan",
      subLabel: isAnime ? "TV Series • Sub Indo" : item.type || "Baca Online",
    };
  };

  if (!items || items.length === 0) {
    return (
      <aside className="bg-[#211B24]/60 border border-[#F4B8C6]/15 p-8 rounded-[28px] text-center text-[#AD9CA6] text-sm">
        Belum ada rekomendasi tersedia.
      </aside>
    );
  }

  const topPick = normalizeItem(items[0]);
  const chartItems = items.slice(1, 6);

  return (
    <aside className="space-y-4">
      {/* Header Editorial */}
      <div className="flex items-end justify-between pb-3.5 border-b border-[#F4B8C6]/15">
        <div>
          <span
            className="text-[10px] font-extrabold uppercase tracking-[0.2em] block mb-1"
            style={{ color: accentColor }}
          >
            {subtitle}
          </span>
          <h2 className="text-2xl font-extrabold text-[#FDF6F7] tracking-tight">
            {title}{" "}
            <span
              className="font-serif italic font-normal"
              style={{ color: accentColor }}
            >
              Pilihan
            </span>
          </h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#211B24] border border-[#F4B8C6]/20 font-serif italic text-xs text-[#F4B8C6]">
          Top 0{Math.min(items.length, 6)}
        </span>
      </div>

      {/* #01 SPOTLIGHT WIDGET CARD */}
      <Link
        href={topPick.href}
        prefetch={false}
        className="group relative block rounded-[28px] bg-[#211B24] border border-[#F4B8C6]/25 hover:border-[#F4B8C6]/60 p-4 overflow-hidden shadow-vogue-card transition-all duration-300"
      >
        {/* Ambient Blur Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={topPick.image}
            alt={topPick.title}
            fill
            unoptimized
            sizes="360px"
            className="object-cover opacity-25 blur-xl scale-110 group-hover:scale-125 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161218] via-[#161218]/75 to-[#161218]/40" />
        </div>

        <div className="relative z-10 flex items-center gap-4">
          {/* Framed Mini Poster */}
          <div className="w-24 aspect-[3/4] shrink-0 relative rounded-2xl overflow-hidden bg-[#161218] ring-1 ring-[#F4B8C6]/35 shadow-lg">
            <Image
              src={topPick.image}
              alt={topPick.title}
              fill
              unoptimized
              sizes="100px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Info & Action Pill */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F4B8C6]/15 border border-[#F4B8C6]/35">
              <span className="font-serif italic font-bold text-[11px] text-[#F4B8C6]">
                #01
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#FDF6F7]">
                Top Pick
              </span>
            </div>

            <h3 className="text-sm md:text-base font-extrabold text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors line-clamp-2 leading-snug">
              {topPick.title}
            </h3>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-bold text-[#F7D6C4] bg-[#161218]/80 px-2.5 py-1 rounded-full border border-white/10">
                {topPick.badge}
              </span>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F4B8C6] text-[#161218] text-[10px] font-extrabold shadow-sm group-hover:translate-x-0.5 transition-transform">
                <span>Buka</span>
                <span>&rarr;</span>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* #02 - #06 NUMBERED EDITORIAL LIST */}
      <div className="flex flex-col gap-2.5">
        {chartItems.map((rawItem, idx) => {
          const item = normalizeItem(rawItem);
          const rankNum = String(idx + 2).padStart(2, "0");

          return (
            <Link
              key={idx}
              href={item.href}
              prefetch={false}
              className="group flex items-center gap-3 p-2.5 rounded-2xl bg-[#211B24]/80 hover:bg-[#28202C] border border-[#F4B8C6]/12 hover:border-[#F4B8C6]/45 transition-all shadow-vogue-card"
            >
              {/* Nomor Urut Majalah */}
              <div className="w-7 text-center shrink-0">
                <span className="font-serif italic text-lg font-bold text-[#AD9CA6]/50 group-hover:text-[#F4B8C6] transition-colors">
                  {rankNum}
                </span>
              </div>

              {/* Poster Thumbnail */}
              <div className="w-12 aspect-[3/4] shrink-0 relative rounded-xl overflow-hidden bg-[#161218] ring-1 ring-white/10">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="50px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Judul & Badge */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs md:text-sm font-bold text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#161218] border border-[#F4B8C6]/20"
                    style={{ color: accentColor }}
                  >
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-[#AD9CA6] truncate">
                    {item.subLabel}
                  </span>
                </div>
              </div>

              {/* Squircle Button */}
              <div className="w-8 h-8 rounded-xl bg-[#161218] group-hover:bg-[#F4B8C6] text-[#AD9CA6] group-hover:text-[#161218] border border-[#F4B8C6]/15 flex items-center justify-center shrink-0 transition-all">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.4}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
