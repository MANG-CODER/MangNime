"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Button from "@/components/ui/Button";
import BookmarkButton from "@/components/ui/BookmarkButton";
import CommentSection from "@/components/ui/CommentSection";
import EpisodeHistoryTracker from "@/components/anime/EpisodeHistoryTracker";
import { OtakudesuClient } from "@/services/providers/otakudesu.client";
import { useProvider } from "@/hooks/useProvider";

const PLACEHOLDER_POSTER = "https://placehold.co/300x400/211B24/F4B8C6";

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

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function EpisodeSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-8 space-y-6 pb-16">
      <div className="h-32 rounded-[28px] bg-[#211B24]/90 border border-[#F4B8C6]/20 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-5">
          <div className="w-full aspect-video bg-[#211B24] animate-pulse rounded-[26px] border border-[#F4B8C6]/20" />
          <div className="h-16 rounded-full bg-[#211B24]/90 border border-[#F4B8C6]/20 animate-pulse" />
        </div>
        <div className="h-[420px] md:h-[580px] lg:h-auto rounded-[28px] bg-[#211B24]/90 border border-[#F4B8C6]/20 animate-pulse" />
      </div>
    </div>
  );
}

function EpisodeError({ error, onRetry }) {
  const limited = error?.rateLimited || error?.status === 429;
  return (
    <div className="text-center py-32 text-[#AD9CA6] space-y-4">
      <p>
        {limited
          ? "Terlalu banyak request, tunggu sebentar lalu coba lagi."
          : "Gagal memuat data episode."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2 rounded-full bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold text-sm transition-all"
      >
        Coba Lagi
      </button>
    </div>
  );
}

export default function EpisodeClient({ slug }) {
  const cleanSlug = safeDecode(slug);

  const {
    data: epData,
    error,
    loading,
    retry,
  } = useProvider(() => OtakudesuClient.getEpisode(cleanSlug), [cleanSlug]);

  // Poster anime: request terpisah & non-kritis. URL-nya sama dengan halaman
  // detail anime, jadi hasilnya berbagi cache localStorage dengan halaman itu.
  const animeId = epData?.animeId;
  const [poster, setPoster] = useState({ id: null, url: null, done: false });

  useEffect(() => {
    if (!animeId) return;
    let alive = true;
    OtakudesuClient.getDetail(animeId)
      .then((d) => d?.poster || d?.image || null)
      .catch(() => null)
      .then((url) => alive && setPoster({ id: animeId, url, done: true }));
    return () => {
      alive = false;
    };
  }, [animeId]);

  const posterReady = !animeId || (poster.done && poster.id === animeId);
  const animePoster =
    (poster.id === animeId && poster.url) || PLACEHOLDER_POSTER;

  const title = epData?.title || "";
  const episodeMatch = title.match(/Episode\s+(\d+(\.\d+)?)/i);
  const episodeNumber = episodeMatch ? episodeMatch[1] : "Terbaru";

  // Judul tab browser (pengganti generateMetadata yang dulu fetch di server)
  useEffect(() => {
    if (!title) return;
    const animeTitle = title
      .replace(/[-–]\s*Episode\s+[\d.]+.*/i, "")
      .replace(/Episode\s+[\d.]+.*/i, "")
      .trim();
    document.title = episodeMatch
      ? `${animeTitle} Episode ${episodeNumber} Sub Indo | MangNime`
      : `${title} | MangNime`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // Pengganti server action fetchServerUrl: sekarang request dari browser user.
  const fetchServerUrl = useCallback(
    (serverId) => OtakudesuClient.getServerUrl(serverId).catch(() => null),
    [],
  );

  if (loading) return <EpisodeSkeleton />;
  if (error && error.status !== 404) {
    return <EpisodeError error={error} onRetry={retry} />;
  }
  if (!epData || !epData.title) {
    return (
      <div className="text-center py-32 text-[#AD9CA6]">
        Data episode tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 md:pt-8 space-y-6 animate-fade-in pb-16 relative overflow-x-clip">
      {/* tunggu poster selesai dimuat supaya riwayat nggak nyimpen placeholder */}
      {posterReady && (
        <EpisodeHistoryTracker
          slug={epData.animeId || slug}
          title={epData.title}
          image={animePoster}
          episodeNumber={episodeNumber}
        />
      )}

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
