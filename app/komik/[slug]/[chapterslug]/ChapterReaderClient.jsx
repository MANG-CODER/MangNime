"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CommentSection from "@/components/ui/CommentSection";
import ChapterHistoryTracker from "@/components/komik/ChapterHistoryTracker";
import ReaderStickyBar from "@/components/komik/ReaderStickyBar";
import FetchError from "@/components/ui/FetchError";
import { KomikClient } from "@/services/komikApi.client";
import { useProvider } from "@/hooks/useProvider";

function ReaderSkeleton() {
  return (
    <div className="min-h-screen bg-[#161218] pb-20">
      <div className="container mx-auto max-w-3xl px-0 sm:px-4">
        <div className="w-full aspect-[2/3] bg-[#211B24] animate-pulse sm:rounded-2xl" />
      </div>
    </div>
  );
}

export default function ChapterReaderClient({ slug, chapterSlug }) {
  // Chapter = data kritis. Judul/cover komik = pelengkap (buat sticky bar & riwayat baca),
  // jadi diambil terpisah supaya gambar chapter bisa tampil duluan.
  const {
    data: chapterData,
    error,
    loading,
    retry,
  } = useProvider(
    () => KomikClient.getChapter(slug, chapterSlug),
    [slug, chapterSlug],
  );
  const meta = useProvider(
    () => KomikClient.getDetail(slug).catch(() => null),
    [slug],
  );
  const komikData = meta.data;
  const metaReady = !meta.loading;

  // Judul tab (pengganti generateMetadata yang dulu fetch di server)
  useEffect(() => {
    if (!chapterData || !metaReady) return;
    const komikTitle = komikData?.title || slug.replace(/-/g, " ");
    document.title = `${komikTitle} ${chapterData.chapterTitle || ""} Bahasa Indonesia | MangNime`;
  }, [chapterData, metaReady, komikData, slug]);

  if (loading) return <ReaderSkeleton />;
  if (error && error.status !== 404) {
    return <FetchError error={error} onRetry={retry} />;
  }

  if (!chapterData) {
    return (
      <div className="min-h-[70vh] bg-[#161218] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#F4B8C6] mb-3">
          Chapter Tidak Ditemukan
        </h1>
        <p className="text-[#AD9CA6] text-sm mb-6">
          Lembaran komik ini mungkin belum rilis atau terjadi kesalahan.
          <span className="text-xs text-[#AD9CA6]/60 mt-1 block">
            (ID: {chapterSlug})
          </span>
        </p>
        <Link
          href={`/komik/${slug}`}
          prefetch={false}
          className="bg-[#F4B8C6] px-6 py-2.5 rounded-full font-extrabold text-xs text-[#161218] shadow-vogue-blush"
        >
          Kembali ke Detail Komik
        </Link>
      </div>
    );
  }

  const images = chapterData.images || [];
  const komikTitle = komikData?.title || "Judul Tidak Diketahui";
  const chapterTitle = chapterData.chapterTitle || "";
  const pageTitle = `${komikTitle} — ${chapterTitle}`;
  const komikCover = komikData?.image || images[0] || "";

  const prevChapterUrl = chapterData.prevChapterSlug
    ? `/komik/${slug}/${chapterData.prevChapterSlug}`
    : null;
  const nextChapterUrl = chapterData.nextChapterSlug
    ? `/komik/${slug}/${chapterData.nextChapterSlug}`
    : null;

  return (
    <div className="min-h-screen bg-[#161218] pb-20 animate-fade-in relative">
      {/* tunggu judul/cover komik selesai dimuat (gambar chapter nggak ditahan) */}
      {metaReady && (
        <>
          <ChapterHistoryTracker
            slug={slug}
            title={komikTitle}
            image={komikCover}
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
        </>
      )}

      {/* READER CANVAS */}
      <div className="container mx-auto max-w-3xl px-0 sm:px-4 flex flex-col items-center">
        {images.length > 0 ? (
          <div className="w-full flex flex-col items-center sm:rounded-2xl overflow-hidden shadow-vogue-card sm:border border-[#F4B8C6]/15 bg-[#0B090D]">
            {images.map((imgUrl, idx) => (
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
                className="w-full h-auto block m-0 p-0"
                style={{ width: "100%", height: "auto" }}
                unoptimized={true}
              />
            ))}
          </div>
        ) : (
          <div className="py-28 text-center text-[#AD9CA6] bg-[#211B24] rounded-3xl w-full border border-[#F4B8C6]/15">
            Gambar gagal dimuat dari server. Coba muat ulang halaman.
          </div>
        )}
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="container mx-auto max-w-3xl px-4 py-8 mt-8 border-t border-[#F4B8C6]/15 flex flex-col sm:flex-row items-center justify-between gap-3.5">
        {prevChapterUrl ? (
          <Link
            href={prevChapterUrl}
            prefetch={false}
            className="w-full sm:w-auto px-6 py-3 bg-[#211B24] border border-[#F4B8C6]/20 text-[#FDF6F7] hover:bg-[#F4B8C6] hover:text-[#161218] text-xs font-extrabold rounded-full transition-all text-center flex items-center justify-center gap-2"
          >
            <span>&larr;</span>
            <span>Chapter Sebelumnya</span>
          </Link>
        ) : (
          <button
            disabled
            className="w-full sm:w-auto px-6 py-3 bg-[#211B24]/40 border border-white/5 text-[#AD9CA6]/40 text-xs font-bold rounded-full cursor-not-allowed text-center"
          >
            &larr; Chapter Pertama
          </button>
        )}

        <Link
          href={`/komik/${slug}`}
          prefetch={false}
          className="w-full sm:w-auto px-7 py-3 bg-[#211B24] hover:bg-[#2B232F] text-[#F4B8C6] border border-[#F4B8C6]/35 text-xs font-extrabold rounded-full transition-all text-center"
        >
          Daftar Chapter
        </Link>

        {nextChapterUrl ? (
          <Link
            href={nextChapterUrl}
            prefetch={false}
            className="w-full sm:w-auto px-6 py-3 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] text-xs font-extrabold rounded-full shadow-vogue-blush transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Chapter Selanjutnya</span>
            <span>&rarr;</span>
          </Link>
        ) : (
          <button
            disabled
            className="w-full sm:w-auto px-6 py-3 bg-[#211B24]/40 border border-white/5 text-[#AD9CA6]/40 text-xs font-bold rounded-full cursor-not-allowed text-center"
          >
            Chapter Terbaru &rarr;
          </button>
        )}
      </div>

      <div className="container mx-auto max-w-4xl px-4 mt-6">
        <CommentSection
          topicId={`chapter-${slug}-${chapterSlug}`}
          title="Diskusi Chapter Ini"
        />
      </div>
    </div>
  );
}
