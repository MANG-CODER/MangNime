import Image from "next/image";
import Link from "next/link";
import { fetchWithDelay } from "@/services/api";
import BookmarkButton from "@/components/ui/BookmarkButton";
import BackButton from "@/components/ui/BackButton";
import CommentSection from "@/components/ui/CommentSection";
import AnimeActionButtons from "@/components/anime/AnimeActionButtons";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const res = await fetchWithDelay(`/anime/${slug}`, 0);
    const anime = res?.data;

    if (!anime) throw new Error("Data tidak ada");

    const shortSynopsis =
      anime.synopsis?.paragraphs?.length > 0
        ? anime.synopsis.paragraphs[0].substring(0, 150) + "..."
        : `Nonton ${anime.title} subtitle Indonesia gratis di MangNime.`;

    const poster = anime.poster || anime.image;
    const canonicalUrl = `https://mangnime.vercel.app/anime/${slug}`;

    return {
      title: `${anime.title} Sub Indo - MangNime`,
      description: shortSynopsis,
      openGraph: {
        title: `${anime.title} Sub Indo - MangNime`,
        description: shortSynopsis,
        url: canonicalUrl,
        siteName: "MangNime",
        images: [
          {
            url: poster,
            width: 800,
            height: 1200,
            alt: anime.title,
          },
        ],
        locale: "id_ID",
        type: "video.tv_show",
      },
      twitter: {
        card: "summary_large_image",
        title: `${anime.title} Sub Indo - MangNime`,
        description: shortSynopsis,
        images: [poster],
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
      title: `${fallbackTitle} - MangNime`,
      description: "Nonton anime subtitle Indonesia gratis di MangNime.",
    };
  }
}

export default async function AnimeDetail({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  let animeData = null;

  try {
    const res = await fetchWithDelay(`/anime/${slug}`, 500);
    animeData = res?.data || null;
  } catch (error) {
    console.error("Gagal fetch detail anime:", error);
  }

  if (!animeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4 animate-fade-in">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-celestia-pink to-celestia-lavender drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white">Anime Tidak Ditemukan</h2>
      </div>
    );
  }

  const episodeList = animeData.episodeList || [];
  const genres = animeData.genreList || [];
  const recommendations = animeData.recommendedAnimeList || [];
  const firstEpisode =
    episodeList.length > 0 ? episodeList[episodeList.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#0D0B1A] pb-20 relative animate-fade-in">
      {/* 1. HERO SECTION BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[450px] md:h-[550px] lg:h-[700px] z-0 overflow-hidden">
        <Image
          src={animeData.poster || "https://placehold.co/400x600/0d0b1a/8b6cff"}
          alt="Banner"
          fill
          className="object-cover opacity-25 blur-[40px] scale-125 origin-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B1A]/10 via-[#0D0B1A]/80 to-[#0D0B1A] translate-y-[1px]" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0B1A] via-[#0D0B1A] to-transparent translate-y-[1px]" />
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px] pt-28 md:pt-36 relative z-10">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start mt-6 md:mt-8">
          {/* POSTER */}
          <div className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0 group">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10">
              <Image
                src={animeData.poster}
                alt={animeData.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
              {animeData.duration && (
                <div className="absolute top-3 left-3 bg-celestia-royal/90 backdrop-blur-md text-white text-xs font-black tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                  {animeData.duration}
                </div>
              )}
            </div>
          </div>

          {/* INFO DETAILS */}
          <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start">
            {animeData.japanese && (
              <h3 className="text-celestia-gold/80 font-medium text-sm md:text-base mb-2 mt-4 md:mt-0">
                {animeData.japanese}
              </h3>
            )}
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl mb-4">
              {animeData.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
              {animeData.score && (
                <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                  ★ {animeData.score}
                </span>
              )}
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  animeData.status?.toLowerCase() === "ongoing"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {animeData.status}
              </span>
              <span className="bg-white/5 text-gray-300 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {animeData.type}
              </span>
              {animeData.studios && (
                <span className="text-celestia-pink text-sm font-medium px-3 py-1.5 border-l border-white/10">
                  {animeData.studios}
                </span>
              )}
            </div>

            {/* GENRES */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
              {genres.map((genre, idx) => (
                <Link
                  key={idx}
                  href={`/search?type=anime&genreIds=${genre.genreId}`}
                  prefetch={false}
                  className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5 text-gray-300 hover:text-white border border-white/10 hover:border-celestia-pink rounded-full transition-all"
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

      {/* 3. LOWER SECTION: SYNOPSIS & EPISODE LIST */}
      <div className="container mx-auto max-w-[1200px] px-4 pt-16 md:pt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* SINOPSIS */}
            <ScrollReveal>
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading text-3xl font-black text-white">
                    Sinopsis{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-pink to-celestia-lavender">
                      Cerita
                    </span>
                  </h2>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl text-gray-300 leading-relaxed whitespace-pre-line font-body text-sm md:text-[15px] backdrop-blur-xl shadow-lg space-y-4">
                  {animeData.synopsis?.paragraphs?.length > 0 ? (
                    animeData.synopsis.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))
                  ) : (
                    <p>Sinopsis untuk anime ini belum tersedia.</p>
                  )}
                </div>
              </section>
            </ScrollReveal>

            {/* DAFTAR EPISODE */}
            <ScrollReveal>
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading text-3xl font-black text-white">
                    Daftar{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-sky to-celestia-lavender">
                      Episode
                    </span>
                  </h2>
                  <div className="h-px flex-1 bg-white/5"></div>
                  <span className="text-gray-500 text-sm font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    {episodeList.length} Episode
                  </span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-8 max-h-[550px] overflow-y-auto custom-scrollbar backdrop-blur-xl shadow-lg">
                  {episodeList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pr-2">
                      {episodeList.map((ep, idx) => {
                        const isEnd = ep.title?.toLowerCase().includes("(end)");

                        return (
                          <Link
                            key={idx}
                            href={`/episode/${ep.episodeId}`}
                            prefetch={false}
                            className={`relative bg-black/20 border hover:shadow-glow-blue p-4 rounded-2xl flex items-center gap-4 group transition-all ${
                              isEnd
                                ? "border-celestia-pink/30 hover:border-celestia-pink/60 hover:bg-celestia-pink/5"
                                : "border-white/5 hover:border-celestia-sky/50 hover:bg-celestia-sky/5"
                            }`}
                          >
                            {isEnd && (
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-celestia-pink/5 to-celestia-lavender/5 pointer-events-none" />
                            )}

                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm border shrink-0 transition-colors ${
                                isEnd
                                  ? "bg-celestia-pink/10 text-celestia-pink border-celestia-pink/30 group-hover:border-celestia-pink/60"
                                  : "bg-celestia-night text-celestia-sky border-white/5 group-hover:border-celestia-sky/50"
                              }`}
                            >
                              EP {ep.eps}
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`font-bold text-sm transition-colors line-clamp-1 ${
                                    isEnd
                                      ? "text-white group-hover:text-white"
                                      : "text-gray-300 group-hover:text-white"
                                  }`}
                                >
                                  Episode {ep.eps}
                                </span>

                                {/* Badge (End) */}
                                {isEnd && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-celestia-pink/20 text-celestia-pink border border-celestia-pink/40 shadow-[0_0_8px_rgba(255,120,198,0.3)] shrink-0">
                                    <svg
                                      className="w-2.5 h-2.5"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    End
                                  </span>
                                )}
                              </div>

                              {ep.date && (
                                <span className="text-[11px] text-gray-600 mt-1">
                                  {ep.date}
                                </span>
                              )}
                            </div>

                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shrink-0 ${
                                isEnd ? "bg-celestia-pink/10" : "bg-white/5"
                              }`}
                            >
                              <svg
                                className={`w-4 h-4 ml-0.5 ${
                                  isEnd
                                    ? "text-celestia-pink"
                                    : "text-celestia-sky"
                                }`}
                                fill="currentColor"
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
                    <div className="text-center py-16 text-gray-500 bg-black/20 rounded-2xl border border-white/5">
                      Belum ada episode tersedia.
                    </div>
                  )}
                </div>
              </section>
            </ScrollReveal>
          </div>

          {/* REKOMENDASI (SIDEBAR) */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-celestia-gold rounded-full shadow-glow-gold"></span>
                Rekomendasi
              </h2>
              {recommendations.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recommendations.map((rec, idx) => (
                    <Link
                      key={idx}
                      href={`/anime/${rec.animeId}`}
                      prefetch={false}
                      className="flex gap-4 bg-white/[0.02] border border-white/5 hover:border-celestia-gold/50 hover:bg-celestia-gold/5 p-3 rounded-2xl group transition-all shadow-lg"
                    >
                      <div className="w-16 md:w-20 aspect-[3/4] shrink-0 relative rounded-xl overflow-hidden bg-black/50 border border-white/5">
                        <Image
                          src={
                            rec.poster ||
                            "https://placehold.co/200x300/151226/8b6cff"
                          }
                          alt={rec.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center py-1">
                        <h4 className="text-white font-bold text-sm line-clamp-2 leading-tight group-hover:text-celestia-gold transition-colors mb-2">
                          {rec.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl text-center text-gray-500 text-sm backdrop-blur-xl">
                  Belum ada rekomendasi.
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* 4. DOWNLOAD BATCH */}
      {animeData.batch && (
        <div className="container mx-auto max-w-[1200px] px-4 mt-12 md:mt-16 relative z-10">
          <ScrollReveal>
            <section className="bg-gradient-to-br from-celestia-pink/10 to-celestia-lavender/5 border border-celestia-pink/20 rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-80 h-80 bg-celestia-sky/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-celestia-pink/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="font-heading text-2xl md:text-3xl font-black text-white mb-2">
                    Download <span className="text-celestia-pink">Batch</span>
                  </h3>
                  <p className="text-gray-400 text-sm font-light">
                    Unduh seluruh episode sekaligus dengan kualitas terbaik.
                  </p>
                </div>
                <Link
                  href={`/batch/${animeData.batch.batchId || animeData.batch.batch_id || slug}`}
                  prefetch={false}
                  className="bg-celestia-pink text-white px-8 py-3.5 rounded-xl font-black text-sm hover:text-celestia-lavender hover:shadow-[0_0_30px_rgba(76,201,255,0.4)] hover:scale-105 hover:bg-white transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  UNDUH SEKARANG
                </Link>
              </div>
            </section>
          </ScrollReveal>
        </div>
      )}

      {/* 5. DISKUSI */}
      <div className="container mx-auto max-w-[1200px] px-4 mt-16 relative z-10">
        <ScrollReveal>
          <CommentSection topicId={`anime-${slug}`} title="Diskusi Anime" />
        </ScrollReveal>
      </div>
    </div>
  );
}
