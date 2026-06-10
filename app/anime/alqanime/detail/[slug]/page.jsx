import Image from "next/image";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { AnimeProvider } from "@/services/providers";
import CommentSection from "@/components/ui/CommentSection";
import AnimeActionButtons from "@/components/anime/AnimeActionButtons";
import AlqanimeEpisodeList from "@/components/anime/AlqanimeEpisodeList";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const anime = await AnimeProvider.Alqanime.getDetail(slug);
    if (!anime) throw new Error("Data tidak ada");

    const shortSynopsis = anime.synopsis
      ? anime.synopsis.substring(0, 150) + "..."
      : `Download dan Nonton ${anime.title} subtitle Indonesia kualitas BD.`;

    const poster = anime.poster;

    return {
      title: `${anime.title} Sub Indo - MangNime`,
      description: shortSynopsis,
      openGraph: {
        title: `${anime.title} Sub Indo - MangNime`,
        description: shortSynopsis,
        images: [{ url: poster }],
      },
    };
  } catch (error) {
    return { title: `Detail Anime - MangNime` };
  }
}

export default async function AlqanimeDetail({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const animeData = await AnimeProvider.Alqanime.getDetail(slug);

  if (!animeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4 animate-fade-in">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-celestia-pink to-celestia-lavender drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white">
          Anime Tidak Ditemukan di Alqanime
        </h2>
        <BackButton />
      </div>
    );
  }

  const {
    info,
    genres = [],
    downloads = [],
    recommendations = [],
    trailer,
    episode_list = [],
  } = animeData;

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
          <div className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10">
              <Image
                src={animeData.poster}
                alt={animeData.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* INFO DETAILS */}
          <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl mb-4">
              {animeData.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
              {animeData.rating && (
                <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-full text-sm font-bold">
                  ★ {animeData.rating}
                </span>
              )}
              {info?.status && (
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {info.status}
                </span>
              )}
              {info?.tipe && (
                <span className="bg-white/5 text-gray-300 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {info.tipe}
                </span>
              )}
              {info?.studio && (
                <span className="text-celestia-pink text-sm font-medium px-3 py-1.5 border-l border-white/10">
                  {info.studio}
                </span>
              )}
            </div>

            {/* GENRES */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
              {genres?.map((genre, idx) => (
                <Link
                  key={idx}
                  href={`/anime/alqanime/genre/${encodeURIComponent(genre.name.toLowerCase())}`}
                  prefetch={false}
                  className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5 text-gray-300 hover:text-white border border-white/10 hover:border-celestia-pink rounded-full transition-all"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            <AnimeActionButtons
              anime={animeData}
              slug={slug}
              latestEpisode={null}
            />

            {/* INFO TAMBAHAN ALQANIME */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/10 w-full max-w-md">
              <div>
                <span className="text-white font-bold">Dirilis:</span>{" "}
                {info?.dirilis || "-"}
              </div>
              <div>
                <span className="text-white font-bold">Musim:</span>{" "}
                {info?.musim || "-"}
              </div>
              <div>
                <span className="text-white font-bold">Subtitle:</span>{" "}
                {info?.subtitle || "-"}
              </div>
              <div>
                <span className="text-white font-bold">Credit:</span>{" "}
                {info?.credit || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOWER SECTION: SYNOPSIS & DOWNLOADS */}
      <div className="container mx-auto max-w-[1200px] px-4 pt-16 md:pt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* KOLOM KIRI (SINOPSIS & DOWNLOAD) */}
          <div className="lg:col-span-2 space-y-12">
            {/* SINOPSIS */}
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-heading text-3xl font-black text-white">
                  Sinopsis
                </h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl text-gray-300 leading-relaxed whitespace-pre-line font-body text-sm md:text-[15px] backdrop-blur-xl shadow-lg">
                <p>{animeData.synopsis || "Sinopsis belum tersedia."}</p>
              </div>
            </ScrollReveal>

            {trailer && (
              <ScrollReveal>
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-heading text-3xl font-black text-white">
                      Official Trailer
                    </h2>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-xl shadow-lg">
                    <div className="aspect-video overflow-hidden rounded-2xl">
                      <iframe
                        src={trailer.replace("watch?v=", "embed/")}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </section>
              </ScrollReveal>
            )}

            {episode_list.length > 0 && (
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
                      {episode_list.length} Episode
                    </span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-8 backdrop-blur-xl shadow-lg">
                    <AlqanimeEpisodeList episodes={episode_list} />
                  </div>
                </section>
              </ScrollReveal>
            )}

            {/* DOWNLOAD LINKS (Keunggulan Alqanime) */}
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-heading text-3xl font-black text-white">
                  Link <span className="text-celestia-sky">Download</span>
                </h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>

              {downloads && downloads.length > 0 ? (
                <div
                  id="download"
                  className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-8 backdrop-blur-xl shadow-lg space-y-6"
                >
                  {downloads.map((dl, idx) => {
                    const episodeNumber = dl.title.match(/\d+/)?.[0] || idx;

                    return (
                      <div
                        id={`episode-${episodeNumber}`}
                        key={idx}
                        className="bg-black/20 border border-white/5 rounded-2xl p-5 hover:border-celestia-sky/40 transition-all"
                      >
                        <h3 className="text-lg font-bold text-celestia-pink mb-4 pb-3 border-b border-white/10">
                          {dl.title}
                        </h3>
                        <div className="space-y-4">
                          {dl.links.map((res, i) => (
                            <div
                              key={i}
                              className="flex flex-col sm:flex-row sm:items-center gap-3"
                            >
                              <span className="bg-celestia-night text-white font-black px-3 py-1.5 rounded-lg text-sm min-w-[80px] text-center border border-white/10">
                                {res.resolution}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {res.urls.map((urlObj, j) => (
                                  <a
                                    key={j}
                                    href={urlObj.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-gray-300 bg-white/5 hover:bg-celestia-royal/20 hover:text-celestia-sky hover:border-celestia-sky/30 border border-white/10 px-3 py-1.5 rounded-lg transition-all"
                                  >
                                    {urlObj.server}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center text-gray-500">
                  Link download belum tersedia.
                </div>
              )}
            </ScrollReveal>
          </div>

          {/* KOLOM KANAN (SIDEBAR REKOMENDASI) */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-celestia-gold rounded-full shadow-glow-gold"></span>
                Rekomendasi
              </h2>
              {recommendations && recommendations.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recommendations.map((rec, idx) => (
                    <Link
                      key={idx}
                      href={`/anime/alqanime/detail/${rec.slug}`}
                      className="flex gap-4 bg-white/[0.02] border border-white/5 hover:border-celestia-gold/50 hover:bg-celestia-gold/5 p-3 rounded-2xl group transition-all shadow-lg"
                    >
                      <div className="w-16 md:w-20 aspect-[3/4] shrink-0 relative rounded-xl overflow-hidden border border-white/5">
                        <Image
                          src={rec.poster}
                          alt={rec.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex flex-col justify-center py-1">
                        <h4 className="text-white font-bold text-sm line-clamp-2 group-hover:text-celestia-gold transition-colors">
                          {rec.title}
                        </h4>
                        {rec.type && (
                          <span className="text-[10px] mt-2 bg-white/10 text-gray-300 w-max px-2 py-0.5 rounded-md">
                            {rec.type}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 p-6 rounded-2xl text-center text-gray-500 text-sm">
                  Tidak ada rekomendasi.
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-[1200px] px-4 mt-16 relative z-10">
        <ScrollReveal>
          <CommentSection topicId={`alqanime-${slug}`} title="Diskusi Anime" />
        </ScrollReveal>
      </div>
    </div>
  );
}
