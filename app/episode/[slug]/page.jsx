import Link from "next/link";
import dynamic from "next/dynamic";
import { API_ENDPOINTS, BASE_URL } from "@/services/api";
import Button from "@/components/ui/Button";
import BookmarkButton from "@/components/ui/BookmarkButton";
import CommentSection from "@/components/ui/CommentSection";
import EpisodeHistoryTracker from "@/components/anime/EpisodeHistoryTracker";
import { AnimeProvider } from "@/services/providers";

const InteractivePlayer = dynamic(
  () => import("@/components/episode/InteractivePlayer"),
  {
    loading: () => (
      <div className="w-full h-[250px] md:h-[400px] bg-white/5 animate-pulse rounded-2xl md:rounded-3xl flex items-center justify-center border border-white/10 text-gray-400 font-medium">
        <svg
          className="w-6 h-6 animate-spin mr-3 text-celestia-sky"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
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
      ? `${animeTitle} - Episode ${episodeNumber} Sub Indo | MangNime`
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
      <div className="text-center py-32 text-gray-500 font-body">
        Data episode tidak ditemukan.
      </div>
    );
  }

  let animePoster = "https://placehold.co/300x400";

  if (epData.animeId) {
    const fetchedPoster = await getAnimePoster(epData.animeId);
    if (fetchedPoster) animePoster = fetchedPoster;
  }

  async function fetchServerUrl(serverId) {
    "use server";
    try {
      const res = await fetch(`${BASE_URL}${API_ENDPOINTS.SERVER}${serverId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json?.data?.url || json?.url || json;
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
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-5 md:space-y-6 animate-fade-in pb-16 relative overflow-x-clip">
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

      <div className="absolute top-[-5%] md:top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] md:h-[400px] bg-celestia-royal/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 bg-white/[0.02] border border-white/5 p-5 md:p-8 rounded-2xl md:rounded-3xl flex flex-col gap-5 md:gap-6 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 md:gap-6">
          <div>
            <h1 className="font-heading text-xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-md">
              {epData.title}
            </h1>
            <p className="text-xs md:text-sm text-celestia-lavender font-medium mt-2 md:mt-3 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              {epData.releaseTime || "Waktu rilis tidak diketahui"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
              className="text-xs md:text-sm px-3 py-2"
            >
              <svg
                className="w-4 h-4 md:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                ></path>
              </svg>
              <span className="hidden md:inline">Semua Episode</span>
              <span className="inline md:hidden ml-2">Episode Lain</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 md:gap-6 relative z-10">
        <div className="lg:col-span-3 space-y-5 md:space-y-6">
          <Link
            href={`/anime/${epData.animeId}`}
            className="inline-flex items-center gap-2 text-celestia-lavender hover:text-white transition-colors text-xs md:text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 w-max backdrop-blur-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke Detail Anime
          </Link>

          <InteractivePlayer
            defaultUrl={epData.defaultStreamingUrl}
            qualities={epData.server?.qualities}
            onFetchServer={fetchServerUrl}
          />

          <div className="flex justify-between items-center bg-white/[0.02] p-4 md:p-5 rounded-2xl border border-white/5 backdrop-blur-md">
            {epData.hasPrevEpisode && epData.prevEpisode ? (
              <Link
                href={`/episode/${epData.prevEpisode.episodeId}`}
                className="text-gray-300 hover:text-celestia-pink font-bold flex items-center gap-1 md:gap-2 transition-colors text-xs md:text-base group"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">
                  &laquo;
                </span>
                <span className="hidden md:inline">Eps Sebelumnya</span>
                <span className="inline md:hidden">Prev</span>
              </Link>
            ) : (
              <span className="text-gray-600 font-bold text-xs md:text-base">
                &laquo; Mentok Kiri
              </span>
            )}

            {epData.hasNextEpisode && epData.nextEpisode ? (
              <Link
                href={`/episode/${epData.nextEpisode.episodeId}`}
                className="text-gray-300 hover:text-celestia-sky font-bold flex items-center gap-1 md:gap-2 transition-colors text-xs md:text-base group"
              >
                <span className="hidden md:inline">Eps Selanjutnya</span>
                <span className="inline md:hidden">Next</span>
                <span className="transform group-hover:translate-x-1 transition-transform">
                  &raquo;
                </span>
              </Link>
            ) : (
              <span className="text-gray-600 font-bold text-xs md:text-base">
                Mentok Kanan &raquo;
              </span>
            )}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col h-[400px] md:h-[600px] lg:h-auto backdrop-blur-xl shadow-xl">
          <h3 className="font-heading text-lg md:text-xl font-bold text-white mb-4 md:mb-5 flex items-center gap-3 pb-3 md:pb-4 border-b border-white/5">
            <span className="w-2 h-5 md:h-6 bg-celestia-lavender rounded-full shadow-glow-purple"></span>
            Daftar Episode
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2.5">
            {epData.info?.episodeList?.map((ep) => {
              const isCurrent = slug === ep.episodeId;
              return (
                <Link
                  href={`/episode/${ep.episodeId}`}
                  key={ep.episodeId}
                  className={`px-4 py-3 rounded-xl md:rounded-2xl border transition-all duration-300 text-xs md:text-sm font-medium flex justify-between items-center group ${
                    isCurrent
                      ? "bg-celestia-royal/20 border-celestia-lavender/50 text-white shadow-glow-purple"
                      : "bg-black/20 border-white/5 text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/10"
                  }`}
                >
                  <span className="line-clamp-1 pr-2">
                    {ep.title.split("Subtitle")[0]}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-celestia-gold shadow-glow-gold animate-pulse flex-shrink-0"></span>
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
