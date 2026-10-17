import { KomikProvider } from "@/services/komikApi";
import KomikCard from "@/components/komik/KomikCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const revalidate = 1800;
export const metadata = { title: "Komik Populer - MangNime" };

export default async function PopularKomikPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams?.page || 1);
  const res = await KomikProvider.getPopular(page);
  const komikList = res?.data || [];
  const pagination = res?.pagination || null;

  return (
    <div className="min-h-screen bg-[#161218] pt-6 pb-20 px-4 md:px-8">
      <div className="container mx-auto max-w-[1400px] animate-fade-in space-y-10">
        {/* HEADER */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-11 relative overflow-hidden shadow-vogue-card">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#B8C4D4]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161218] border border-[#B8C4D4]/30 text-[#B8C4D4] text-[11px] font-bold uppercase tracking-[0.18em]">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
              </svg>
              <span>Peringkat Tertinggi</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7] tracking-tight">
              Komik{" "}
              <span className="font-serif italic font-normal text-[#B8C4D4]">
                Terpopuler
              </span>
            </h1>
            <p className="text-[#AD9CA6] text-xs md:text-sm max-w-2xl leading-relaxed">
              Jelajahi jajaran komik terbaik, karya terhangat yang sedang ramai
              dibicarakan, hingga komik dengan adaptasi anime paling dinantikan.
            </p>
          </div>
        </div>

        {/* KONTEN */}
        {komikList.length > 0 ? (
          <>
            <div
              key={`popular-${page}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7"
            >
              {komikList.map((komik, idx) => (
                <ScrollReveal key={komik.slug || idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>

            <Pagination pagination={pagination} basePath="/komik/popular" />
          </>
        ) : (
          <div className="text-center py-24 text-[#AD9CA6] bg-[#211B24]/60 rounded-3xl border border-[#F4B8C6]/15">
            Sedang mencari data komik populer...
          </div>
        )}
      </div>
    </div>
  );
}
