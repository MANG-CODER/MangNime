import Link from "next/link";
import { fetchWithDelay, API_ENDPOINTS } from "@/services/api";
import InteractivePlayer from "@/components/episode/InteractivePlayer";
import Button from "@/components/ui/Button";
import BookmarkButton from "@/components/ui/BookmarkButton";
import CommentSection from "@/components/ui/CommentSection";
import EpisodeHistoryTracker from "@/components/anime/EpisodeHistoryTracker";

async function getEpisodeData(slug) {
  const cleanSlug = decodeURIComponent(slug);
  const res = await fetchWithDelay(
    `${API_ENDPOINTS.EPISODE}${cleanSlug}`,
    500,
    { cache: "no-store" },
  );
  return res?.data || res || null;
}

export const revalidate = 86400;

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

  let animePoster = "https://placehold.co/300x400"; // Gambar default jika gagal

  if (epData.animeId) {
    try {
      const resAnime = await fetchWithDelay(
        `${API_ENDPOINTS.ANIME}${epData.animeId}`,
        0,
        {
          cache: "force-cache",
        },
      );
      const animeData = resAnime?.data || resAnime || null;

      if (animeData?.poster || animeData?.image) {
        animePoster = animeData.poster || animeData.image;
      }
    } catch (error) {
      console.error("Gagal mengambil poster anime:", error);
    }
  }
  // ----------------------------------------------------

  // Server Action
  async function fetchServerUrl(serverId) {
    "use server";
    const res = await fetchWithDelay(`${API_ENDPOINTS.SERVER}${serverId}`, 0, {
      cache: "no-store",
    });
    return res?.data?.url || res?.url || res;
  }

  // Ekstrak angka episode dari judul (misal "Episode 12" -> "12") untuk History
  const episodeMatch = epData.title.match(/Episode\s+(\d+(\.\d+)?)/i);
  const episodeNumber = episodeMatch ? episodeMatch[1] : "Terbaru";

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in pb-16 relative">
      {/* 1. TRACKER HISTORY (Data Asli Disuntikkan Di Sini) */}
      <EpisodeHistoryTracker
        slug={epData.animeId || slug} // Pakai ID anime agar history menumpuk di judul animenya
        title={epData.title}
        image={animePoster}
        episodeNumber={episodeNumber}
      />

      {/* Background Ornamen Kosmik Ringan */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-celestia-royal/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* 2. HEADER PLAYER */}
      <div className="relative z-10 bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col gap-6 backdrop-blur-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Bagian Kiri: Judul & Waktu Rilis */}
          <div>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-md">
              {epData.title}
            </h1>
            <p className="text-sm text-celestia-lavender font-medium mt-3 flex items-center gap-2">
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

          {/* Bagian Kanan: Tombol Bookmark & Semua Episode */}
          <div className="flex flex-wrap items-center gap-3">
            {/* PERBAIKAN BOOKMARK: Gunakan prop 'item' dan tambahkan 'url' */}
            <BookmarkButton
              item={{
                slug: slug, // Slug spesifik episode ini
                title: epData.title,
                image: animePoster,
                status: "Tersimpan",
                type: "episode",
                url: `/episode/${slug}`, // Penting agar link di halaman bookmark bekerja!
              }}
            />
            <Button
              href={`/anime/${epData.animeId}`}
              variant="secondary"
              size="md"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              Semua Episode
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* Kolom Kiri (Makan 3 Kolom): Video & Server */}
        <div className="lg:col-span-3 space-y-6">
          <Link
            href={`/anime/${epData.animeId}`}
            className="inline-flex items-center gap-2 text-celestia-lavender hover:text-white transition-colors text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 w-max backdrop-blur-md"
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

          {/* Navigasi Episode (Prev/Next) */}
          <div className="flex justify-between items-center bg-white/[0.02] p-5 rounded-2xl border border-white/5 backdrop-blur-md">
            {epData.hasPrevEpisode && epData.prevEpisode ? (
              <Link
                href={`/episode/${epData.prevEpisode.episodeId}`}
                className="text-gray-300 hover:text-celestia-pink font-bold flex items-center gap-2 transition-colors text-sm md:text-base group"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">
                  &laquo;
                </span>
                Eps Sebelumnya
              </Link>
            ) : (
              <span className="text-gray-600 font-bold text-sm md:text-base">
                &laquo; Mentok Kiri
              </span>
            )}

            {epData.hasNextEpisode && epData.nextEpisode ? (
              <Link
                href={`/episode/${epData.nextEpisode.episodeId}`}
                className="text-gray-300 hover:text-celestia-sky font-bold flex items-center gap-2 transition-colors text-sm md:text-base group"
              >
                Eps Selanjutnya
                <span className="transform group-hover:translate-x-1 transition-transform">
                  &raquo;
                </span>
              </Link>
            ) : (
              <span className="text-gray-600 font-bold text-sm md:text-base">
                Mentok Kanan &raquo;
              </span>
            )}
          </div>
        </div>

        {/* Kolom Kanan (Makan 1 Kolom): Sidebar Daftar Episode */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 flex flex-col h-[600px] lg:h-auto backdrop-blur-xl shadow-xl">
          <h3 className="font-heading text-xl font-bold text-white mb-5 flex items-center gap-3 pb-4 border-b border-white/5">
            <span className="w-2 h-6 bg-celestia-lavender rounded-full shadow-glow-purple"></span>
            Daftar Episode
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-2.5">
            {epData.info?.episodeList?.map((ep) => {
              const isCurrent = slug === ep.episodeId;
              return (
                <Link
                  href={`/episode/${ep.episodeId}`}
                  key={ep.episodeId}
                  className={`px-4 py-3.5 rounded-2xl border transition-all duration-300 text-sm font-medium flex justify-between items-center group ${
                    isCurrent
                      ? "bg-celestia-royal/20 border-celestia-lavender/50 text-white shadow-glow-purple"
                      : "bg-black/20 border-white/5 text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/10"
                  }`}
                >
                  <span>{ep.title.split("Subtitle")[0]}</span>
                  {/* Indikator Titik Bersinar untuk Episode Saat Ini */}
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-celestia-gold shadow-glow-gold animate-pulse"></span>
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
