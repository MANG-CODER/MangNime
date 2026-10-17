import { KomikProvider } from "@/services/komikApi";
import KomikCard from "@/components/komik/KomikCard";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const genreName = (slug || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return { title: `Komik Genre ${genreName} - MangNime` };
}

export const revalidate = 1800;

export default async function KomikGenreDetailPage({ params, searchParams }) {
  const { slug: genreSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || 1);

  const displayTitle = (genreSlug || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const res = await KomikProvider.getKomikByGenre(genreSlug, page);
  const komikList = res?.data || [];
  const pagination = res?.pagination || null;

  return (
    <div className="min-h-screen bg-[#161218] pt-8 pb-20 px-4 md:px-8">
      <div className="container mx-auto max-w-[1400px] animate-fade-in space-y-10">
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-11 relative overflow-hidden shadow-vogue-card flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative z-10 text-center md:text-left space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8C4D4]">
              Kategori Genre Komik
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7]">
              Genre{" "}
              <span className="font-serif italic font-normal text-[#F4B8C6]">
                {displayTitle}
              </span>
            </h1>
            <p className="text-[#AD9CA6] text-xs md:text-sm">
              Menampilkan daftar komik pilihan dengan genre {displayTitle}.
            </p>
          </div>

          <Link
            href="/komik/genres"
            className="relative z-10 flex items-center gap-2 bg-[#161218] hover:bg-[#F4B8C6] border border-[#F4B8C6]/25 text-[#FDF6F7] hover:text-[#161218] px-5 py-2.5 rounded-full text-xs font-extrabold transition-all"
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
            Semua Genre
          </Link>
        </div>

        {komikList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-7">
              {komikList.map((komik, idx) => (
                <ScrollReveal key={komik.slug || idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>

            <Pagination
              pagination={pagination}
              basePath={`/komik/genre/${genreSlug}`}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-[#AD9CA6] border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/60">
            <p className="text-sm">
              Tidak ada komik ditemukan untuk genre ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
