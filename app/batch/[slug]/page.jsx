import Image from "next/image";
import Link from "next/link";
import { coreFetcher } from "@/services/core/fetcher";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return { title: `Download Batch ${title} - MangNime` };
}

export default async function BatchPage({ params }) {
  const { slug } = await params;
  let batchData = null;

  try {
    const BASE_URL =
      process.env.SANKANIME_BASE_URL ||
      "https://www.sankavollerei.web.id/anime";
    const res = await coreFetcher(`${BASE_URL}/batch/${slug}`);
    batchData = res?.data || null;
  } catch (error) {
    console.error("Error fetch batch:", error);
  }

  if (!batchData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4 bg-[#161218]">
        <h2 className="text-2xl font-extrabold text-[#FDF6F7] mb-4">
          Data Batch Tidak Ditemukan
        </h2>
        <Link
          href="/"
          className="px-6 py-2.5 bg-[#F4B8C6] rounded-full text-[#161218] text-xs font-extrabold"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161218] pb-20 animate-fade-in relative">
      {/* 1. AMBIENT HERO */}
      <div className="absolute top-0 left-0 w-full h-[450px] md:h-[550px] z-0 overflow-hidden">
        <Image
          src={
            batchData.poster ||
            batchData.image ||
            "https://placehold.co/300x400/211B24/F4B8C6"
          }
          alt="Banner"
          fill
          unoptimized
          className="object-cover opacity-25 blur-[45px] scale-125 origin-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#161218]/20 via-[#161218]/85 to-[#161218] translate-y-[1px]" />
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="container mx-auto px-4 md:px-8 max-w-[1280px] pt-10 md:pt-14 relative z-10">
        <Link
          href={`/anime/${batchData.animeId}`}
          className="inline-flex items-center gap-2 text-[#F4B8C6] hover:text-[#161218] text-xs md:text-sm font-bold transition-all mb-8 bg-[#211B24] hover:bg-[#F4B8C6] px-5 py-2.5 rounded-full border border-[#F4B8C6]/25 w-max"
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

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start mb-14">
          <div className="w-56 sm:w-64 md:w-72 flex-shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-full rounded-[24px] overflow-hidden shadow-vogue-card ring-1 ring-[#F4B8C6]/30 bg-[#211B24]">
              <Image
                src={
                  batchData.poster ||
                  "https://placehold.co/300x400/211B24/F4B8C6?text=No+Image"
                }
                alt={batchData.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 220px, 288px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start md:pt-2">
            <div className="inline-flex items-center gap-2 bg-[#F4B8C6]/15 text-[#F4B8C6] px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase border border-[#F4B8C6]/30 mb-3">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Arsip Download Batch
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7] leading-tight mb-4">
              {batchData.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs mb-5">
              {batchData.score && (
                <span className="flex items-center gap-1.5 text-[#F7D6C4] bg-[#F4B8C6]/15 px-3.5 py-1.5 rounded-full border border-[#F4B8C6]/30 font-extrabold">
                  ★ {batchData.score}
                </span>
              )}
              {batchData.type && (
                <span className="px-3.5 py-1.5 rounded-full bg-[#211B24] border border-[#F4B8C6]/20 text-[#FDF6F7] font-bold uppercase tracking-wider">
                  {batchData.type}
                </span>
              )}
              {batchData.episodes && (
                <span className="px-3.5 py-1.5 rounded-full bg-[#211B24] border border-[#F4B8C6]/20 text-[#AD9CA6] font-bold">
                  {batchData.episodes} Episode
                </span>
              )}
            </div>

            <p className="text-[#AD9CA6] text-sm md:text-base leading-relaxed max-w-2xl">
              Unduh seluruh episode sekaligus dengan berbagai pilihan resolusi
              dan server tercepat. Pastikan koneksi internet Anda stabil sebelum
              memulai unduhan.
            </p>
          </div>
        </div>

        {/* 3. LIST DOWNLOAD BATCH */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 shadow-vogue-card">
          <h3 className="text-2xl font-extrabold text-[#FDF6F7] flex items-center gap-3 mb-8 pb-4 border-b border-[#F4B8C6]/15">
            <svg
              className="w-5 h-5 text-[#F4B8C6]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Pilih Kualitas{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Resolusi
            </span>
          </h3>

          {batchData.downloadUrl?.formats &&
          batchData.downloadUrl.formats.length > 0 ? (
            <div className="space-y-10">
              {batchData.downloadUrl.formats.map((format, fIdx) => (
                <div key={fIdx}>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#E88D9E] mb-4">
                    {format.title}
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {format.qualities.map((quality, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-[#161218]/90 border border-[#F4B8C6]/15 rounded-3xl p-5 hover:border-[#F4B8C6]/45 transition-all"
                      >
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#F4B8C6]/10">
                          <span className="text-lg font-extrabold text-[#FDF6F7]">
                            {quality.title}
                          </span>
                          <span className="text-[11px] font-bold text-[#F4B8C6] bg-[#F4B8C6]/15 px-3 py-1 rounded-full border border-[#F4B8C6]/30">
                            {quality.size || "ZIP/RAR"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {quality.urls.map((link, lIdx) => (
                            <a
                              key={lIdx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold bg-[#211B24] hover:bg-[#F4B8C6] text-[#FDF6F7] hover:text-[#161218] px-3 py-2 rounded-full transition-all border border-[#F4B8C6]/15 text-center truncate"
                              title={link.title}
                            >
                              {link.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 text-[#AD9CA6] border border-[#F4B8C6]/10 rounded-2xl bg-[#161218]/50">
              Link download belum tersedia untuk batch ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
