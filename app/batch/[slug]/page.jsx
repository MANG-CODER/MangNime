import Image from "next/image";
import Link from "next/link";
import { fetchWithDelay } from "@/services/api";

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
    const res = await fetchWithDelay(`/batch/${slug}`, 500);
    batchData = res?.data || null;
  } catch (error) {
    console.error("Error fetch batch:", error);
  }

  if (!batchData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-celestia-sky bg-[#0D0B1A]">
        <h2 className="text-2xl font-bold mb-4">Data Batch Tidak Ditemukan</h2>
        <Link
          href="/"
          className="px-6 py-2 bg-celestia-royal rounded-full text-white"
        >
          Kembali ke Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0B1A] pb-20 animate-fade-in relative">
      {/* 1. HERO SECTION (FORMULA ANTI-GAP) */}
      <div className="absolute top-0 left-0 w-full h-[450px] md:h-[550px] lg:h-[700px] z-0 overflow-hidden">
        <Image
          src={
            batchData.poster ||
            batchData.image ||
            "https://placehold.co/300x400"
          }
          alt="Banner"
          fill
          className="object-cover opacity-25 blur-[40px] scale-125 origin-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B1A]/10 via-[#0D0B1A]/80 to-[#0D0B1A] translate-y-[1px]" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0B1A] via-[#0D0B1A] to-transparent translate-y-[1px]" />
      </div>

      {/* 2. MAIN CONTENT AREA (TANPA MARGIN NEGATIF) */}
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px] pt-28 md:pt-36 relative z-10">
        <Link
          href={`/anime/${batchData.animeId}`}
          className="inline-flex items-center gap-2 text-white hover:text-[#0D0B1A] text-sm transition-colors mb-8 font-medium bg-white/5 hover:bg-celestia-pink px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-glow-pink w-max"
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

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start mb-16">
          {/* POSTER BATCH */}
          <div className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0 group">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10">
              <Image
                src={
                  batchData.poster ||
                  "https://placehold.co/300x400/0d0b1a/8b6cff?text=No+Image"
                }
                alt={batchData.title}
                fill
                sizes="(max-width: 768px) 192px, 224px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* DETAIL INFO BATCH */}
          <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start md:pt-4">
            <div className="inline-block bg-celestia-lavender/20 text-celestia-lavender px-3 py-1 rounded-md text-[10px] font-black tracking-widest uppercase border border-celestia-lavender/30 mb-4 shadow-glow-purple">
              Download Batch
            </div>

            <h1 className="font-heading text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-xl mb-4">
              {batchData.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm mb-6">
              {batchData.score && (
                <span className="flex items-center gap-1.5 text-celestia-gold bg-celestia-gold/10 px-3 py-1.5 rounded-lg border border-celestia-gold/20 font-bold">
                  ★ {batchData.score}
                </span>
              )}
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-bold uppercase tracking-wider">
                {batchData.type}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-bold">
                {batchData.episodes} Episode
              </span>
              {batchData.studios && (
                <span className="text-celestia-sky font-medium">
                  {batchData.studios}
                </span>
              )}
            </div>

            <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-2xl text-center md:text-left drop-shadow-sm">
              Unduh seluruh episode sekaligus dengan berbagai pilihan resolusi
              dan server tercepat. Pastikan koneksi internet Anda stabil sebelum
              memulai unduhan.
            </p>
          </div>
        </div>

        {/* 3. LIST DOWNLOAD BATCH */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-celestia-pink/10 blur-[120px] rounded-full pointer-events-none"></div>

          <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-10 relative z-10">
            <span className="w-1.5 h-8 bg-celestia-pink rounded-full shadow-glow-blue"></span>
            Pilih Kualitas <span className="text-celestia-pink">Resolusi</span>
          </h3>

          {/* MAPPING DATA DOWNLOAD */}
          {batchData.downloadUrl?.formats &&
          batchData.downloadUrl.formats.length > 0 ? (
            <div className="space-y-12 relative z-10">
              {batchData.downloadUrl.formats.map((format, fIdx) => (
                <div key={fIdx}>
                  <h4 className="text-sm font-bold text-gray-400 border-b border-white/10 pb-3 mb-6">
                    {format.title}
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {format.qualities.map((quality, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-[#0D0B1A]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-celestia-pink/40 transition-all group shadow-lg"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-xl font-black text-white group-hover:text-celestia-pink transition-colors">
                            {quality.title}
                          </span>
                          <span className="text-[11px] font-bold text-celestia-pink bg-celestia-pink/10 px-3 py-1.5 rounded-lg border border-celestia-pink/20 uppercase tracking-widest shadow-glow-pink">
                            {quality.size || "Unknown Size"}
                          </span>
                        </div>

                        {/* Link File Hosting */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                          {quality.urls.map((link, lIdx) => (
                            <a
                              key={lIdx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold bg-white/5 hover:bg-celestia-pink hover:text-[#0D0B1A] px-3 py-2.5 rounded-xl transition-all border border-white/5 text-center uppercase truncate"
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
            <div className="text-center py-16 text-gray-500 font-light relative z-10 border border-white/5 rounded-2xl bg-black/20">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              Link download belum tersedia untuk batch ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
