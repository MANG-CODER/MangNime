import Link from "next/link";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import BookmarkButton from "@/components/ui/BookmarkButton";
import CommentSection from "@/components/ui/CommentSection";
import EpisodeHistoryTracker from "@/components/anime/EpisodeHistoryTracker";
import { AnimeProvider } from "@/services/providers";
import { coreFetcher } from "@/services/core/fetcher";

const InteractivePlayer = dynamic(
  () => import("@/components/episode/InteractivePlayer"),
  {
    loading: () => (
      <div className="w-full aspect-video bg-[#211B24] animate-pulse rounded-[26px] flex items-center justify-center border border-[#F4B8C6]/20 text-[#AD9CA6] text-sm font-medium">
        <svg
          className="w-5 h-5 animate-spin mr-3 text-[#F4B8C6]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Memuat Player Video...
      </div>
    ),
  },
);

async function getEpisodeData(slug) {
  const cleanSlug = decodeURIComponent(slug);
  try {
    return await AnimeProvider.Otakudesu.getEpisode(cleanSlug);
  } catch (error) {
    console.error("Gagal memuat episode:", error);
    return null;
  }
}

async function getAnimePoster(animeId) {
  if (!animeId) return null;
  try {
    const animeData = await AnimeProvider.Otakudesu.getDetail(animeId);
    return animeData?.poster || animeData?.image || null;
  } catch {
    return null;
  }
}

export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const epData = await getEpisodeData(slug);
    if (!epData || !epData.title) throw new Error("Data tidak ada");

    const poster = await getAnimePoster(epData.animeId);
    const episodeMatch = epData.title.match(/Episode\s+(\d+(\.\d+)?)/i);
    const episodeNumber = episodeMatch ? episodeMatch[1] : null;

    const animeTitle = epData.title
      .replace(/[-–]\s*Episode\s+[\d.]+.*/i, "")
      .replace(/Episode\s+[\d.]+.*/i, "")
      .trim();

    const ogTitle = episodeNumber
      ? `${animeTitle} Episode ${episodeNumber} Sub Indo | MangNime`
      : `${epData.title} | MangNime`;

    const ogDescription = `Nonton ${epData.title} subtitle Indonesia gratis di MangNime. Streaming anime berkualitas HD tanpa iklan.`;
    const canonicalUrl = `https://mangnime.my.id/episode/${slug}`;

    return {
      title: ogTitle,
      description: ogDescription,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: "MangNime",
        images: poster
          ? [{ url: poster, width: 800, height: 1200, alt: epData.title }]
          : [],
        locale: "id_ID",
        type: "video.episode",
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: poster ? [poster] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    const fallbackTitle = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      title: `${fallbackTitle} | MangNime`,
      description: "Nonton anime subtitle Indonesia gratis di MangNime.",
    };
  }
}

export default async function EpisodePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const epData = await getEpisodeData(slug);

  if (!epData || !epData.title) {
    return (
      <div className="text-center py-32 text-[#AD9CA6]">
        Data episode tidak ditemukan.
      </div>
    );
  }

  let animePoster = "https://placehold.co/300x400/211B24/F4B8C6";

  if (epData.animeId) {
    const fetchedPoster = await getAnimePoster(epData.animeId);
    if (fetchedPoster) animePoster = fetchedPoster;
  }

  async function fetchServerUrl(serverId) {
    "use server";
    try {
      if (serverId && serverId.startsWith("http")) {
        return serverId;
      }

      const baseUrl =
        process.env.SANKANIME_BASE_URL ||
        "https://www.sankavollerei.web.id/anime";

      // Gunakan TTL 900 detik (15 menit) agar klik server yang sama dari banyak user cukup 1x fetch ke proxy
      const res = await coreFetcher(`${baseUrl}/server/${serverId}`, {
        ttlSeconds: 900,
      });

      return res?.data?.url || res?.url || res;
    } catch (error) {
      console.error("Gagal mengambil URL Server:", error);
      return null;
    }
  }

  const episodeMatch = epData.title.match(/Episode\s+(\d+(\.\d+)?)/i);
  const episodeNumber = episodeMatch ? episodeMatch[1] : "Terbaru";
  const animeTitleClean = epData.title
    .replace(/[-–]\s*Episode\s+[\d.]+.*/i, "")
    .replace(/Episode\s+[\d.]+.*/i, "")
    .trim();

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    name: epData.title,
    description: `Nonton ${epData.title} subtitle Indonesia gratis di MangNime. Streaming anime berkualitas HD tanpa iklan.`,
    image: animePoster,
    episodeNumber: episodeNumber,
    url: `https://mangnime.my.id/episode/${slug}`,
    partOfSeries: {
      "@type": "TVSeries",
      name: animeTitleClean,
      url: `https://mangnime.my.id/anime/${epData.animeId || ""}`,
    },
    potentialAction: {
      "@type": "WatchAction",
      target: `https://mangnime.my.id/episode/${slug}`,
    },
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-8 space-y-6 animate-fade-in pb-16 relative overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <EpisodeHistoryTracker
        slug={epData.animeId || slug}
        title={epData.title}
        image={animePoster}
        episodeNumber={episodeNumber}
      />

      {/* HEADER INFO EPISODE */}
      <div className="relative z-10 bg-[#211B24]/90 border border-[#F4B8C6]/20 p-5 md:p-7 rounded-[28px] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-vogue-card">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F4B8C6]">
            <Link
              href={`/anime/${epData.animeId}`}
              className="hover:underline flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali ke Detail Anime
            </Link>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold text-[#FDF6F7] leading-snug">
            {epData.title}
          </h1>
          <p className="text-xs text-[#AD9CA6] flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#E88D9E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {epData.releaseTime || "Sub Indo HD"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <BookmarkButton
            item={{
              slug: slug,
              title: epData.title,
              image: animePoster,
              status: "Tersimpan",
              type: "episode",
              url: `/episode/${slug}`,
            }}
          />
          <Button
            href={`/anime/${epData.animeId}`}
            variant="secondary"
            size="md"
          >
            Semua Episode
          </Button>
        </div>
      </div>

      {/* GRID PLAYER & PLAYLIST EPISODE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        <div className="lg:col-span-3 space-y-5">
          <InteractivePlayer
            defaultUrl={epData.defaultStreamingUrl}
            qualities={epData.server?.qualities}
            onFetchServer={fetchServerUrl}
          />

          {/* NAVIGASI PREV / NEXT EPISODE */}
          <div className="flex justify-between items-center bg-[#211B24]/90 p-3.5 md:p-4 rounded-full border border-[#F4B8C6]/20 shadow-vogue-card">
            {epData.hasPrevEpisode && epData.prevEpisode ? (
              <Link
                href={`/episode/${epData.prevEpisode.episodeId}`}
                prefetch={false}
                className="px-5 py-2 rounded-full bg-[#161218] hover:bg-[#F4B8C6] text-[#FDF6F7] hover:text-[#161218] font-bold flex items-center gap-2 transition-all text-xs md:text-sm"
              >
                <span>&larr;</span>
                <span className="hidden sm:inline">Episode Sebelumnya</span>
                <span className="sm:hidden">Prev</span>
              </Link>
            ) : (
              <span className="px-5 py-2 rounded-full bg-[#161218]/40 text-[#AD9CA6]/40 font-bold text-xs md:text-sm cursor-not-allowed">
                &larr; Pertama
              </span>
            )}

            <span className="font-serif italic text-xs md:text-sm text-[#F4B8C6]">
              Episode {episodeNumber}
            </span>

            {epData.hasNextEpisode && epData.nextEpisode ? (
              <Link
                href={`/episode/${epData.nextEpisode.episodeId}`}
                prefetch={false}
                className="px-5 py-2 rounded-full bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold flex items-center gap-2 transition-all text-xs md:text-sm shadow-vogue-blush"
              >
                <span className="hidden sm:inline">Episode Selanjutnya</span>
                <span className="sm:hidden">Next</span>
                <span>&rarr;</span>
              </Link>
            ) : (
              <span className="px-5 py-2 rounded-full bg-[#161218]/40 text-[#AD9CA6]/40 font-bold text-xs md:text-sm cursor-not-allowed">
                Terbaru &rarr;
              </span>
            )}
          </div>
        </div>

        {/* SIDEBAR DAFTAR EPISODE */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[28px] p-5 flex flex-col h-[420px] md:h-[580px] lg:h-auto shadow-vogue-card">
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#F4B8C6]/15">
            <h3 className="text-base md:text-lg font-extrabold text-[#FDF6F7] flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#F4B8C6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Daftar Episode
            </h3>
            <span className="text-[11px] font-bold text-[#F4B8C6]">
              {epData.info?.episodeList?.length || 0} Ep
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1.5 flex flex-col gap-2">
            {epData.info?.episodeList?.map((ep) => {
              const isCurrent = slug === ep.episodeId;
              return (
                <Link
                  href={`/episode/${ep.episodeId}`}
                  key={ep.episodeId}
                  prefetch={false}
                  className={`px-4 py-3 rounded-2xl border transition-all text-xs font-bold flex justify-between items-center ${
                    isCurrent
                      ? "bg-[#F4B8C6] border-[#F4B8C6] text-[#161218] shadow-vogue-blush"
                      : "bg-[#161218]/70 border-[#F4B8C6]/10 text-[#AD9CA6] hover:bg-[#161218] hover:text-[#FDF6F7] hover:border-[#F4B8C6]/35"
                  }`}
                >
                  <span className="line-clamp-1 pr-2">
                    {ep.title.split("Subtitle")[0]}
                  </span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-[#161218] text-[#F4B8C6] text-[9px] uppercase tracking-wider shrink-0">
                      Diputar
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <CommentSection topicId={`episode-${slug}`} title="Diskusi Episode" />
    </div>
  );
}
