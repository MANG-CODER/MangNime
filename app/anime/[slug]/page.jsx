import Image from "next/image";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import CommentSection from "@/components/ui/CommentSection";
import AnimeActionButtons from "@/components/anime/AnimeActionButtons";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RecommendationSidebar from "@/components/ui/RecommendationSidebar";
import { AnimeProvider } from "@/services/providers";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const anime = await AnimeProvider.Otakudesu.getDetail(slug);
    if (!anime) throw new Error("Data tidak ada");

    const shortSynopsis =
      anime.synopsis?.paragraphs?.length > 0
        ? anime.synopsis.paragraphs[0].substring(0, 150) + "..."
        : `Nonton ${anime.title} subtitle Indonesia gratis di MangNime.`;

    const poster = anime.poster || anime.image;
    const canonicalUrl = `https://mangnime.my.id/anime/${slug}`;

    return {
      title: `${anime.title} Sub Indo - MangNime`,
      description: shortSynopsis,
      openGraph: {
        title: `${anime.title} Sub Indo - MangNime`,
        description: shortSynopsis,
        url: canonicalUrl,
        siteName: "MangNime",
        images: [{ url: poster, width: 800, height: 1200, alt: anime.title }],
        locale: "id_ID",
        type: "video.tv_show",
      },
      twitter: {
        card: "summary_large_image",
        title: `${anime.title} Sub Indo - MangNime`,
        description: shortSynopsis,
        images: [poster],
      },
      alternates: { canonical: canonicalUrl },
    };
  } catch {
    const fallbackTitle = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      title: `${fallbackTitle} - MangNime`,
      description: "Nonton anime subtitle Indonesia gratis di MangNime.",
    };
  }
}

export default async function AnimeDetail({ params }) {
  const { slug } = await params;
  let animeData = null;

  try {
    animeData = await AnimeProvider.Otakudesu.getDetail(slug);
  } catch (error) {
    console.error("Gagal fetch detail anime:", error);
  }

  if (!animeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4 px-4 animate-fade-in">
        <h1 className="font-serif italic text-7xl font-bold text-[#F4B8C6]">
          404
        </h1>
        <h2 className="text-2xl font-extrabold text-[#FDF6F7]">
          Anime Tidak Ditemukan
        </h2>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-[#F4B8C6] text-[#161218] text-xs font-extrabold"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const episodeList = animeData.episodeList || [];
  const genres = animeData.genreList || [];
  const recommendations = animeData.recommendedAnimeList || [];
  const firstEpisode =
    episodeList.length > 0 ? episodeList[episodeList.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#161218] pb-20 relative animate-fade-in">
      {/* 1. AMBIENT HERO BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[460px] md:h-[560px] lg:h-[680px] z-0 overflow-hidden">
        <Image
          src={
            animeData.poster ||
            "https://placehold.co/400x600/211B24/F4B8C6?text=No+Poster"
          }
          alt="Banner"
          fill
          unoptimized
          className="object-cover opacity-25 blur-[45px] scale-125 origin-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#161218]/20 via-[#161218]/85 to-[#161218] translate-y-[1px]" />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 md:px-8 max-w-[1280px] pt-10 md:pt-14 relative z-10">
        <BackButton />

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start mt-2">
          {/* POSTER FRAME */}
          <div className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0 relative">
            <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[26px] border border-[#F4B8C6]/20 bg-[#211B24]/40 pointer-events-none hidden sm:block" />
            <div className="relative aspect-[2/3] w-full rounded-[24px] overflow-hidden shadow-vogue-card ring-1 ring-[#F4B8C6]/30 bg-[#211B24]">
              <Image
                src={animeData.poster}
                alt={animeData.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 240px, 320px"
                priority
              />
              <div className="absolute inset-2.5 rounded-[16px] border border-white/15 pointer-events-none" />
              {animeData.duration && (
                <div className="absolute top-4 left-4 bg-[#161218]/80 backdrop-blur-md border border-[#F4B8C6]/30 text-[#FDF6F7] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-[#F4B8C6]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {animeData.duration}
                </div>
              )}
            </div>
          </div>

          {/* INFO DETAILS */}
          <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start">
            {animeData.japanese && (
              <span className="font-serif italic text-xs md:text-sm text-[#E88D9E] mb-2 tracking-wide">
                {animeData.japanese}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#FDF6F7] leading-[1.1] tracking-tight mb-5">
              {animeData.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              {animeData.score && (
                <span className="flex items-center gap-1.5 bg-[#F4B8C6]/15 text-[#F7D6C4] border border-[#F4B8C6]/35 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
                  ★ {animeData.score}
                </span>
              )}
              {animeData.status && (
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                    animeData.status?.toLowerCase() === "ongoing"
                      ? "bg-[#F4B8C6]/15 text-[#F4B8C6] border-[#F4B8C6]/35"
                      : "bg-[#B8C4D4]/15 text-[#B8C4D4] border-[#B8C4D4]/35"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {animeData.status}
                </span>
              )}
              {animeData.type && (
                <span className="bg-[#211B24] text-[#FDF6F7] border border-[#F4B8C6]/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {animeData.type}
                </span>
              )}
              {animeData.studios && (
                <span className="text-[#AD9CA6] text-xs font-semibold px-3 py-1.5 border-l border-[#F4B8C6]/20">
                  Studio:{" "}
                  <strong className="text-[#FDF6F7]">
                    {animeData.studios}
                  </strong>
                </span>
              )}
            </div>

            {/* GENRES */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-5">
              {genres.map((genre, idx) => (
                <Link
                  key={idx}
                  href={`/genre/${genre.genreId}`}
                  prefetch={false}
                  className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 bg-[#211B24] text-[#AD9CA6] hover:text-[#161218] hover:bg-[#F4B8C6] border border-[#F4B8C6]/20 rounded-full transition-all"
                >
                  {genre.title}
                </Link>
              ))}
            </div>

            <AnimeActionButtons
              anime={animeData}
              slug={slug}
              latestEpisode={firstEpisode}
            />
          </div>
        </div>
      </div>

      {/* 3. LOWER SECTION: SYNOPSIS, EPISODE LIST & REUSABLE SIDEBAR */}
      <div className="container mx-auto max-w-[1280px] px-4 md:px-8 pt-16 md:pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* SINOPSIS */}
            <ScrollReveal>
              <section>
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#F4B8C6]/15">
                  <span className="p-2 rounded-xl bg-[#211B24] border border-[#F4B8C6]/25 text-[#F4B8C6]">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#FDF6F7]">
                    Sinopsis{" "}
                    <span className="font-serif italic font-normal text-[#F4B8C6]">
                      Cerita
                    </span>
                  </h2>
                </div>
                <div className="bg-[#211B24]/80 border border-[#F4B8C6]/15 p-6 md:p-8 rounded-[28px] text-[#FDF6F7]/85 leading-relaxed whitespace-pre-line text-sm md:text-[15px] shadow-vogue-card space-y-4">
                  {animeData.synopsis?.paragraphs?.length > 0 ? (
                    animeData.synopsis.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))
                  ) : (
                    <p className="text-[#AD9CA6]">
                      Sinopsis untuk anime ini belum tersedia.
                    </p>
                  )}
                </div>
              </section>
            </ScrollReveal>

            {/* DAFTAR EPISODE */}
            <ScrollReveal>
              <section>
                <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[#F4B8C6]/15">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-[#211B24] border border-[#F4B8C6]/25 text-[#F4B8C6]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <rect
                          x="2"
                          y="7"
                          width="20"
                          height="15"
                          rx="2"
                          ry="2"
                        />
                        <polyline points="17 2 12 7 7 2" />
                      </svg>
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#FDF6F7]">
                      Daftar{" "}
                      <span className="font-serif italic font-normal text-[#F4B8C6]">
                        Episode
                      </span>
                    </h2>
                  </div>
                  <span className="text-[#F4B8C6] text-xs font-extrabold bg-[#F4B8C6]/15 px-3.5 py-1.5 rounded-full border border-[#F4B8C6]/30">
                    {episodeList.length} Episode
                  </span>
                </div>

                <div className="bg-[#211B24]/80 border border-[#F4B8C6]/15 rounded-[28px] p-4 md:p-6 max-h-[540px] overflow-y-auto custom-scrollbar shadow-vogue-card">
                  {episodeList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
                      {episodeList.map((ep, idx) => {
                        const isEnd = ep.title?.toLowerCase().includes("(end)");

                        return (
                          <Link
                            key={idx}
                            href={`/episode/${ep.episodeId}`}
                            prefetch={false}
                            className={`relative bg-[#161218]/80 border p-3.5 rounded-2xl flex items-center gap-3.5 group transition-all ${
                              isEnd
                                ? "border-[#E88D9E]/40 hover:border-[#F4B8C6] hover:bg-[#F4B8C6]/10"
                                : "border-[#F4B8C6]/10 hover:border-[#F4B8C6]/45 hover:bg-[#F4B8C6]/[0.06]"
                            }`}
                          >
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-xs border shrink-0 transition-colors ${
                                isEnd
                                  ? "bg-[#F4B8C6] text-[#161218] border-[#F4B8C6]"
                                  : "bg-[#211B24] text-[#F4B8C6] border-[#F4B8C6]/25 group-hover:bg-[#F4B8C6] group-hover:text-[#161218]"
                              }`}
                            >
                              EP {ep.eps}
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors line-clamp-1">
                                  Episode {ep.eps}
                                </span>
                                {isEnd && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#E88D9E]/20 text-[#F4B8C6] border border-[#F4B8C6]/40 shrink-0">
                                    END
                                  </span>
                                )}
                              </div>
                              {ep.date && (
                                <span className="text-[11px] text-[#AD9CA6] mt-0.5">
                                  {ep.date}
                                </span>
                              )}
                            </div>

                            <span className="w-8 h-8 rounded-full bg-[#211B24] group-hover:bg-[#F4B8C6] text-[#AD9CA6] group-hover:text-[#161218] flex items-center justify-center transition-all shrink-0">
                              <svg
                                className="w-3.5 h-3.5 ml-0.5 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M4 4l12 6-12 6z" />
                              </svg>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-14 text-[#AD9CA6] text-sm bg-[#161218]/50 rounded-2xl border border-[#F4B8C6]/10">
                      Belum ada episode tersedia.
                    </div>
                  )}
                </div>
              </section>
            </ScrollReveal>
          </div>

          {/* REKOMENDASI SIDEBAR */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <RecommendationSidebar
                items={recommendations}
                type="anime"
                title="Rekomendasi"
                subtitle="Curated Anime"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* 4. DOWNLOAD BATCH */}
      {animeData.batch && (
        <div className="container mx-auto max-w-[1280px] px-4 md:px-8 mt-14 relative z-10">
          <ScrollReveal>
            <section className="bg-gradient-to-r from-[#211B24] via-[#2B2230] to-[#211B24] border border-[#F4B8C6]/30 rounded-[30px] p-6 md:p-9 relative overflow-hidden shadow-vogue-card">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start md:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4B8C6]/15 border border-[#F4B8C6]/35 flex items-center justify-center text-[#F4B8C6] shrink-0">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7]">
                      Download Paket{" "}
                      <span className="font-serif italic font-normal text-[#F4B8C6]">
                        Batch
                      </span>
                    </h3>
                    <p className="text-[#AD9CA6] text-xs md:text-sm mt-0.5">
                      Unduh seluruh episode sekaligus dalam satu file arsip
                      berkualitas HD.
                    </p>
                  </div>
                </div>
                <Link
                  href={`/batch/${animeData.batch.batchId || animeData.batch.batch_id || slug}`}
                  prefetch={false}
                  className="bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] px-7 py-3.5 rounded-full font-extrabold text-xs md:text-sm shadow-vogue-blush active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  UNDUH BATCH
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </div>
      )}

      {/* 5. DISKUSI */}
      <div className="container mx-auto max-w-[1280px] px-4 md:px-8 mt-16 relative z-10">
        <ScrollReveal>
          <CommentSection topicId={`anime-${slug}`} title="Diskusi Anime" />
        </ScrollReveal>
      </div>
    </div>
  );
}
