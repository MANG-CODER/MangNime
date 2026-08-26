import Link from "next/link";
import { getChapterDetail, getKomikDetail } from "@/services/komikApi";
import CommentSection from "@/components/ui/CommentSection";
import ChapterHistoryTracker from "@/components/komik/ChapterHistoryTracker";
import ReaderStickyBar from "@/components/komik/ReaderStickyBar";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  const chapterSlug = resolvedParams?.chapterslug || "";

  try {
    const chapterData = await getChapterDetail(chapterSlug);

    if (!chapterData) throw new Error("Data tidak ada");

    const komikTitle =
      chapterData.komikTitle ||
      slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const chapterTitle = chapterData.chapterTitle || "";

    const ogTitle = `${komikTitle} ${chapterTitle} Bahasa Indonesia | MangNime`;
    const ogDescription = `Baca ${komikTitle} ${chapterTitle} bahasa Indonesia gratis di MangNime. Update chapter terbaru setiap hari.`;

    const coverImage = chapterData.images?.[0] || null;

    let komikCover = coverImage;
    if (!komikCover) {
      try {
        const komik = await getKomikDetail(slug);
        komikCover = komik?.cover || null;
      } catch {}
    }

    const canonicalUrl = `https://mangnime.my.id/komik/${slug}/${chapterSlug}`;

    return {
      title: ogTitle,
      description: ogDescription,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: "MangNime",
        images: komikCover
          ? [
              {
                url: komikCover,
                width: 800,
                height: 1200,
                alt: `${komikTitle} ${chapterTitle}`,
              },
            ]
          : [],
        locale: "id_ID",
        type: "book",
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: komikCover ? [komikCover] : [],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    const komikTitle = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      title: `${komikTitle} | MangNime`,
      description: "Baca komik bahasa Indonesia gratis di MangNime.",
    };
  }
}

export const revalidate = 604800;

export default async function ReadChapterPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const chapterSlug = resolvedParams?.chapterslug || "";

  const chapterData = await getChapterDetail(chapterSlug);

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-[#0D0B1A] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <h1 className="text-4xl font-black text-celestia-pink mb-4">
          Chapter Tidak Ditemukan
        </h1>
        <p className="text-gray-400 mb-6">
          Lembaran komik ini mungkin belum rilis atau terjadi kesalahan.
          <br />
          <span className="text-xs text-gray-600 mt-2 block">
            (Chapter slug: {chapterSlug})
          </span>
        </p>
        <Link
          href={`/komik/${slug}`}
          prefetch={false}
          className="bg-white/10 px-6 py-2 rounded-full font-bold text-white hover:bg-white/20 transition-all"
        >
          Kembali ke Detail Komik
        </Link>
      </div>
    );
  }

  const images = chapterData.images || [];
  const komikTitle = chapterData.komikTitle ?? slug.replace(/-/g, " ");
  const chapterTitle = chapterData.chapterTitle || "";
  const pageTitle = `${komikTitle} - ${chapterTitle}`;

  const prevChapterUrl = chapterData.prevChapterSlug
    ? `/komik/${slug}/${chapterData.prevChapterSlug}`
    : null;
  const nextChapterUrl = chapterData.nextChapterSlug
    ? `/komik/${slug}/${chapterData.nextChapterSlug}`
    : null;

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-20 md:pt-24 pb-20 animate-fade-in relative">
      <ChapterHistoryTracker
        slug={slug}
        title={komikTitle}
        image={images[0] ?? ""}
        chapterSlug={chapterSlug}
        chapterLabel={chapterTitle}
      />
      <ReaderStickyBar
        slug={slug}
        currentChapter={chapterSlug}
        pageTitle={pageTitle}
        createdAt={chapterData.createdAt}
        firstImage={images[0] ?? ""}
        prevChapterSlug={chapterData.prevChapterSlug}
        nextChapterSlug={chapterData.nextChapterSlug}
      />

      <div className="container mx-auto max-w-3xl px-0 sm:px-4 flex flex-col items-center">
        {images.length > 0 ? (
          <div className="w-full flex flex-col items-center sm:rounded-xl overflow-hidden sm:shadow-[0_0_40px_rgba(0,0,0,0.5)] sm:border border-white/5 bg-black">
            {images.map((imgUrl, idx) => {

              return (
                <Image
                  key={idx}
                  src={imgUrl}
                  alt={`Page ${idx + 1}`}
                  width={800}
                  height={1200}
                  quality={75}
                  sizes="(max-width: 768px) 100vw, 768px"
                  loading={idx === 0 ? "eager" : "lazy"}
                  priority={idx === 0}
                  className="w-full h-auto block m-0 p-0 animate-fade-in-up"
                  style={{ width: "100%", height: "auto" }}
                  unoptimized={true}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-32 text-center text-gray-500 bg-white/5 rounded-2xl w-full border border-white/10">
            Gambar gagal dimuat dari server. Coba muat ulang halaman.
          </div>
        )}
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-10 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevChapterUrl ? (
          <Link
            href={prevChapterUrl}
            prefetch={false}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-celestia-sky/50 transition-all text-center flex items-center justify-center gap-2 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform text-celestia-sky">
              &laquo;
            </span>
            <span className="group-hover:text-celestia-sky transition-colors">
              Chapter Sebelumnya
            </span>
          </Link>
        ) : (
          <button
            disabled
            className="w-full sm:w-auto px-6 py-3.5 bg-black/20 border border-white/5 text-gray-600 font-bold rounded-2xl cursor-not-allowed text-center"
          >
            &laquo; Pertama
          </button>
        )}

        <Link
          href={`/komik/${slug}`}
          prefetch={false}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-celestia-royal to-celestia-lavender text-white font-black rounded-2xl hover:scale-105 hover:shadow-glow-purple transition-all text-center"
        >
          Daftar Chapter
        </Link>

        {nextChapterUrl ? (
          <Link
            href={nextChapterUrl}
            prefetch={false}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-celestia-pink/50 transition-all text-center flex items-center justify-center gap-2 group"
          >
            <span className="group-hover:text-celestia-pink transition-colors">
              Chapter Selanjutnya
            </span>
            <span className="transform group-hover:translate-x-1 transition-transform text-celestia-pink">
              &raquo;
            </span>
          </Link>
        ) : (
          <button
            disabled
            className="w-full sm:w-auto px-6 py-3.5 bg-black/20 border border-white/5 text-gray-600 font-bold rounded-2xl cursor-not-allowed text-center"
          >
            Terbaru &raquo;
          </button>
        )}
      </div>

      <div className="container mx-auto max-w-4xl px-4 mt-8">
        <CommentSection
          topicId={`chapter-${slug}-${chapterSlug}`}
          title="Diskusi Chapter Ini"
        />
      </div>
    </div>
  );
}
