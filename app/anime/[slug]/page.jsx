import Image from "next/image";
import Link from "next/link";
import { fetchWithDelay } from "@/services/api";
import BookmarkButton from "@/components/ui/BookmarkButton";
import BackButton from "@/components/ui/BackButton";
import CommentSection from "@/components/ui/CommentSection";
import AnimeActionButtons from "@/components/anime/AnimeActionButtons";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetchWithDelay(`/anime/${slug}`, 0);
    const anime = res?.data;

    if (!anime) throw new Error("Data tidak ada");

    const shortSynopsis =
      typeof anime.synopsis === "string"
        ? anime.synopsis.substring(0, 150) + "..."
        : "Nonton episode terbaru anime ini dengan subtitle Indonesia di MangNime.";

    return {
      title: `${anime.title} Sub Indo - MangNime`,
      description: shortSynopsis,
      openGraph: {
        title: `${anime.title} Sub Indo - MangNime`,
        description: shortSynopsis,
        images: [anime.poster || anime.image],
      },
    };
  } catch (error) {
    const fallbackTitle = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return { title: `${fallbackTitle} - MangNime` };
  }
}

export default async function AnimeDetail({ params }) {
  const { slug } = await params;
  let animeData = null;

  try {
    const res = await fetchWithDelay(`/anime/${slug}`, 500);
    animeData = res?.data || null;
  } catch (error) {
    console.error("Gagal fetch detail:", error);
  }

  if (!animeData)
    return <div className="text-white text-center py-20">Memuat...</div>;

  const episodeList =
    animeData.info?.episodeList || animeData.episodeList || [];
  const genres = animeData.info?.genreList || animeData.genreList || [];

  return (
    // Tambahkan 'relative' di bungkus paling luar
    <div className="min-h-screen bg-[#0D0B1A] pb-20 animate-fade-in relative">
      {/* 1. HERO SECTION BACKGROUND (SOLUSI GAP GRADIENT) */}
      <div className="absolute top-0 left-0 w-full h-[450px] md:h-[550px] lg:h-[700px] z-0 overflow-hidden">
        <Image
          src={animeData.poster || animeData.image}
          alt="Banner"
          fill
          // scale-125 mencegah ujung blur yang putih terlihat di pinggir
          className="object-cover opacity-25 blur-[40px] scale-125 origin-top"
          priority
        />
        {/* Gradient blending dari ATAS ke BAWAH, memastikan ujung bawah solid #0D0B1A */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B1A]/10 via-[#0D0B1A]/80 to-[#0D0B1A] translate-y-[1px]" />
        {/* Lapisan ekstra tebal di bawah untuk transisi super mulus menambal kebocoran blur */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0B1A] via-[#0D0B1A] to-transparent translate-y-[1px]" />
      </div>

      {/* 2. MAIN CONTENT AREA (HAPUS MARGIN NEGATIF, GANTI PADDING TOP) */}
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px] pt-28 md:pt-36 relative z-10">
        <BackButton />
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start mt-6 md:mt-8">
          {/* POSTER */}
          <div className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0 group">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10">
              <Image
                src={animeData.poster || animeData.image}
                alt={animeData.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* INFO DETAILS */}
          <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl">
              {animeData.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              {animeData.score && (
                <span className="flex items-center gap-1.5 text-celestia-gold bg-celestia-gold/10 px-4 py-1.5 rounded-full border border-celestia-gold/20 font-bold text-sm">
                  ★ {animeData.score}
                </span>
              )}
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-bold uppercase tracking-wider">
                {animeData.status}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-bold uppercase tracking-wider">
                {animeData.type}
              </span>
              <span className="text-celestia-sky text-sm font-medium">
                {animeData.studio || animeData.studios}
              </span>
            </div>

            {/* GENRES */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
              {animeData.genre_list?.map((genre, idx) => (
                <Link
                  key={idx}
                  href={`/genre/${genre.genre_id}`}
                  className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 bg-celestia-royal/20 text-celestia-lavender border border-celestia-lavender/30 rounded-full hover:bg-celestia-lavender hover:text-white transition-all shadow-glow-purple"
                >
                  {genre.genre_name}
                </Link>
              ))}
            </div>

            {/* SYNOPSIS */}
            <div className="text-gray-300 text-sm md:text-base leading-relaxed font-light max-w-4xl space-y-4 mt-8">
              {animeData.synopsis &&
              typeof animeData.synopsis === "object" &&
              animeData.synopsis.paragraphs ? (
                animeData.synopsis.paragraphs.map((p, i) => (
                  <p key={i} className="drop-shadow-sm">
                    {p}
                  </p>
                ))
              ) : (
                <p>
                  {typeof animeData.synopsis === "string"
                    ? animeData.synopsis
                    : "Sinopsis tidak tersedia."}
                </p>
              )}
            </div>

            {/* ACTION BUTTONS (CLIENT) */}
            <AnimeActionButtons
              anime={animeData}
              slug={slug}
              latestEpisode={
                episodeList.length > 0
                  ? episodeList[episodeList.length - 1]
                  : null
              }
            />
          </div>
        </div>

        {/* 3. EPISODE LIST SECTION */}
        <section className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-heading text-3xl font-black text-white">
              Daftar{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-lavender to-celestia-sky">
                Episode
              </span>
            </h3>
            <div className="h-px flex-1 bg-white/5"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodeList.map((ep, idx) => (
              <Link
                key={idx}
                href={`/episode/${ep.episodeId}`}
                className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-celestia-pink/50 hover:bg-celestia-pink/5 hover:shadow-glow-pink transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-celestia-night flex items-center justify-center text-celestia-pink font-black text-sm border border-white/5 group-hover:border-celestia-pink/50 transition-colors shrink-0">
                    {episodeList.length - idx}
                  </div>
                  <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors line-clamp-1">
                    {ep.title}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <svg
                    className="w-4 h-4 text-celestia-pink"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4l12 6-12 6z" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 4. DOWNLOAD BATCH SECTION */}
        {animeData.batch && (
          <section className="mt-16 bg-gradient-to-br from-celestia-pink/10 to-celestia-lavender/5 border border-celestia-pink/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-celestia-sky/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-celestia-pink/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-3xl font-black text-white mb-2">
                  Download <span className="text-celestia-pink">Batch</span>
                </h3>
                <p className="text-gray-400 text-sm font-light">
                  Unduh seluruh episode sekaligus dengan kualitas terbaik.
                </p>
              </div>
              <Link
                href={`/batch/${animeData.batch.batchId || animeData.batch.batch_id || slug}`}
                className="bg-celestia-pink text-white px-8 py-3 rounded-xl font-black text-sm hover:text-celestia-lavender hover:shadow-[0_0_30px_rgba(76,201,255,0.4)] hover:scale-105 hover:bg-white transition-all flex items-center justify-center gap-2 whitespace-nowrap"
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
        )}

        <CommentSection topicId={`anime-${slug}`} title="Diskusi Anime" />
      </div>
    </div>
  );
}
