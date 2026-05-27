import Link from "next/link";
import { fetchKomikAPI } from "@/services/komikApi";
import CommentSection from "@/components/ui/CommentSection";
import BookmarkButton from "@/components/ui/BookmarkButton";
import ChapterHistoryTracker from "@/components/komik/ChapterHistoryTracker";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  const currentChapter = resolvedParams?.chapterslug || "";
  return {
    title: `Membaca ${slug.replace(/-/g, " ")} - ${currentChapter.replace(/-/g, " ")} | MangNime`,
  };
}

export const revalidate = 86400;

export default async function ReadChapterPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const currentChapter = resolvedParams?.chapterslug || "";

  const chapterIndexStr = currentChapter.toLowerCase().replace("chapter-", "");

  const res = await fetchKomikAPI(`/komik/${slug}/${chapterIndexStr}`);
  const chapterData = res?.data ?? null;

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
            (Endpoint: /komik/{slug}/{chapterIndexStr})
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

  const images = chapterData.images ?? [];
  const komikTitle = chapterData.komikTitle ?? slug.replace(/-/g, " ");
  const chapterIndex = chapterData.chapterIndex;
  const pageTitle = `${komikTitle} - Chapter ${chapterIndex}`;

  const prevChapterUrl =
    chapterData.prevChapterId != null
      ? `/komik/${slug}/chapter-${chapterData.prevChapterId}`
      : null;
  const nextChapterUrl =
    chapterData.nextChapterId != null
      ? `/komik/${slug}/chapter-${chapterData.nextChapterId}`
      : null;

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-20 md:pt-24 pb-20 animate-fade-in relative">
      <ChapterHistoryTracker
        slug={slug}
        title={komikTitle}
        image={images[0] ?? ""}
        chapterIndex={chapterIndex}
      />

      <div className="sticky top-[64px] md:top-[72px] z-40 bg-[#0D0B1A]/80 backdrop-blur-2xl border-y border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-8 transition-all">
        <div className="container mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
          <Link
            href={`/komik/${slug}`}
            prefetch={false}
            className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-white/5 hover:bg-celestia-pink hover:text-white transition-all text-gray-400 group"
            title="Kembali ke Detail"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>

          <h1 className="text-sm md:text-lg font-black text-white truncate text-center flex-1 drop-shadow-md">
            {pageTitle}
          </h1>

          <div className="shrink-0 scale-75 origin-right md:scale-90">
            <BookmarkButton
              item={{
                slug: currentChapter,
                title: pageTitle,
                image: images[0] ?? "",
                status: "Tersimpan",
                type: "chapter",
                url: `/komik/${slug}/${currentChapter}`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-0 sm:px-4 flex flex-col items-center">
        {images.length > 0 ? (
          <div className="w-full flex flex-col items-center sm:rounded-xl overflow-hidden sm:shadow-[0_0_40px_rgba(0,0,0,0.5)] sm:border border-white/5 bg-black">
            {images.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`Page ${idx + 1}`}
                loading="lazy"
                className="w-full h-auto block m-0 p-0 animate-fade-in-up"
              />
            ))}
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
              Chapter {chapterData.prevChapterId}
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
              Chapter {chapterData.nextChapterId}
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
          topicId={`chapter-${slug}-${currentChapter}`}
          title="Diskusi Chapter Ini"
        />
      </div>
    </div>
  );
}
