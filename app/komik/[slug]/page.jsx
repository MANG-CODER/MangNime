import Image from "next/image";
import Link from "next/link";
import { KomikProvider } from "@/services/komikApi";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import KomikActionButtons from "@/components/komik/KomikActionButtons";
import CommentSection from "@/components/ui/CommentSection";
import BackButton from "@/components/ui/BackButton";
import LastReadButton from "@/components/komik/LastReadButton";
import RecommendationSidebar from "@/components/ui/RecommendationSidebar";

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const komik = await KomikProvider.getDetail(slug);
    if (!komik) throw new Error("Data tidak ada");

    const shortSynopsis = komik.synopsis
      ? komik.synopsis.substring(0, 150) + "..."
      : `Baca ${komik.title} bahasa Indonesia gratis di MangNime.`;

    const cover = komik.image;
    const canonicalUrl = `https://mangnime.my.id/komik/${slug}`;

    return {
      title: `${komik.title} - MangNime`,
      description: shortSynopsis,
      openGraph: {
        title: `${komik.title} Baca Online | MangNime`,
        description: shortSynopsis,
        url: canonicalUrl,
        siteName: "MangNime",
        images: cover
          ? [{ url: cover, width: 800, height: 1200, alt: komik.title }]
          : [],
        locale: "id_ID",
        type: "book",
      },
      twitter: {
        card: "summary_large_image",
        title: `${komik.title} Baca Online | MangNime`,
        description: shortSynopsis,
        images: cover ? [cover] : [],
      },
      alternates: { canonical: canonicalUrl },
    };
  } catch {
    const fallbackTitle = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      title: `${fallbackTitle} - MangNime`,
      description:
        "Baca komik manga manhwa manhua bahasa Indonesia di MangNime.",
    };
  }
}

export const revalidate = 3600;

export default async function DetailKomikPage({ params }) {
  const { slug } = await params;

  const [komik, latestRes] = await Promise.all([
    KomikProvider.getDetail(slug),
    KomikProvider.getLatest(1),
  ]);

  const recommendations = (latestRes?.data || [])
    .filter((item) => item.slug !== slug)
    .slice(0, 6);

  if (!komik) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-5 px-4 animate-fade-in">
        <div className="relative w-56 h-56">
          <Image
            src="/img/404icon.svg"
            alt="Komik Tidak Ditemukan"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif italic text-7xl font-bold text-[#F4B8C6]">
            404
          </h1>
          <h2 className="text-2xl font-extrabold text-[#FDF6F7]">
            Komik Tidak Ditemukan
          </h2>
        </div>
        <Button href="/" variant="primary" size="md">
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const chapters = komik.chapters || [];
  const firstChapter =
    chapters.length > 0 ? chapters[chapters.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#161218] pb-20 relative animate-fade-in">
      {/* AMBIENT BACKDROP */}
      <div className="absolute top-0 left-0 w-full h-[460px] md:h-[560px] z-0 overflow-hidden">
        <Image
          src={komik.image}
          alt="Background"
          fill
          unoptimized
          className="object-cover opacity-25 blur-[45px] scale-125 origin-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#161218]/20 via-[#161218]/85 to-[#161218] translate-y-[1px]" />
      </div>

      {/* HERO CONTENT */}
      <div className="container mx-auto px-4 md:px-8 max-w-[1280px] pt-10 md:pt-14 relative z-10">
        <BackButton />

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start mt-2">
          {/* COVER POSTER */}
          <div className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0 relative">
            <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[26px] border border-[#B8C4D4]/25 bg-[#211B24]/40 pointer-events-none hidden sm:block" />
            <div className="relative aspect-[2/3] w-full rounded-[24px] overflow-hidden shadow-vogue-card ring-1 ring-[#F4B8C6]/30 bg-[#211B24]">
              <Image
                src={komik.image}
                alt={komik.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 240px, 320px"
                priority
              />
              <div className="absolute inset-2.5 rounded-[16px] border border-white/15 pointer-events-none" />
              {komik.type && (
                <div className="absolute top-4 left-4 bg-[#161218]/85 backdrop-blur-md border border-[#B8C4D4]/40 text-[#B8C4D4] text-[11px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase">
                  {komik.type}
                </div>
              )}
            </div>
          </div>

          {/* METADATA KOMIK */}
          <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start">
            <span className="font-serif italic text-xs md:text-sm text-[#B8C4D4] mb-1.5">
              MangNime Reading Room
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#FDF6F7] leading-[1.1] tracking-tight mb-5">
              {komik.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              {komik.score && komik.score !== "?" && (
                <span className="flex items-center gap-1.5 bg-[#F4B8C6]/15 text-[#F7D6C4] border border-[#F4B8C6]/35 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
                  ★ {komik.score}
                </span>
              )}
              {komik.status && (
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    komik.status?.toLowerCase() === "ongoing"
                      ? "bg-[#F4B8C6]/15 text-[#F4B8C6] border-[#F4B8C6]/35"
                      : "bg-[#B8C4D4]/15 text-[#B8C4D4] border-[#B8C4D4]/35"
                  }`}
                >
                  {komik.status}
                </span>
              )}
              <span className="bg-[#211B24] text-[#FDF6F7] border border-[#F4B8C6]/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {chapters.length} Chapter
              </span>
              {komik.author && komik.author !== "-" && (
                <span className="text-[#AD9CA6] text-xs font-semibold px-3 py-1.5 border-l border-[#F4B8C6]/20">
                  Author:{" "}
                  <strong className="text-[#FDF6F7]">{komik.author}</strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-5">
              {komik.genres?.map((genreName, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 bg-[#211B24] text-[#AD9CA6] border border-[#F4B8C6]/20 rounded-full"
                >
                  {genreName}
                </span>
              ))}
            </div>

            <div className="mt-5 flex justify-center md:justify-start">
              <LastReadButton slug={slug} />
            </div>

            <KomikActionButtons
              komik={komik}
              slug={slug}
              firstChapter={firstChapter}
            />
          </div>
        </div>
      </div>

      {/* LOWER CONTENT: SINOPSIS, CHAPTERS & SIDEBAR */}
      <div className="container mx-auto max-w-[1280px] px-4 md:px-8 pt-16 md:pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-12">
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
                <div className="bg-[#211B24]/80 border border-[#F4B8C6]/15 p-6 md:p-8 rounded-[28px] text-[#FDF6F7]/85 leading-relaxed whitespace-pre-line text-sm md:text-[15px] shadow-vogue-card">
                  {komik.synopsis || "Sinopsis tidak tersedia."}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section>
                <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[#F4B8C6]/15">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-[#211B24] border border-[#B8C4D4]/30 text-[#B8C4D4]">
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#FDF6F7]">
                      Daftar{" "}
                      <span className="font-serif italic font-normal text-[#B8C4D4]">
                        Chapter
                      </span>
                    </h2>
                  </div>
                  <span className="text-[#B8C4D4] text-xs font-extrabold bg-[#B8C4D4]/15 px-3.5 py-1.5 rounded-full border border-[#B8C4D4]/30">
                    {chapters.length} Chapter
                  </span>
                </div>

                <div className="bg-[#211B24]/80 border border-[#F4B8C6]/15 rounded-[28px] p-4 md:p-6 max-h-[540px] overflow-y-auto custom-scrollbar shadow-vogue-card">
                  {chapters.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-1">
                      {chapters.map((ch, idx) => (
                        <Link
                          key={idx}
                          href={`/komik/${slug}/${ch.slug}`}
                          prefetch={false}
                          className="bg-[#161218]/80 border border-[#F4B8C6]/10 hover:border-[#F4B8C6]/45 hover:bg-[#F4B8C6]/[0.06] px-4 py-3.5 rounded-2xl flex items-center justify-between group transition-all"
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-bold text-xs md:text-sm text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors truncate">
                              {ch.title}
                            </span>
                            {ch.createdAt && (
                              <span className="text-[10px] text-[#AD9CA6]">
                                {formatDate(ch.createdAt)}
                              </span>
                            )}
                          </div>
                          <span className="text-[#AD9CA6] group-hover:text-[#F4B8C6] transform group-hover:translate-x-0.5 transition-all shrink-0 text-xs">
                            &rarr;
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-14 text-[#AD9CA6] bg-[#161218]/50 rounded-2xl border border-[#F4B8C6]/10">
                      Data chapter belum tersedia.
                    </div>
                  )}
                </div>
              </section>
            </ScrollReveal>
          </div>

          {/* REKOMENDASI KOMIK SIDEBAR */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <RecommendationSidebar
                items={recommendations}
                type="komik"
                title="Komik"
                subtitle="Trending Reads"
              />
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1280px] px-4 md:px-8 mt-16 relative z-10">
        <ScrollReveal>
          <CommentSection topicId={`komik-${slug}`} title="Diskusi Komik" />
        </ScrollReveal>
      </div>
    </div>
  );
}
