import AnimeCard from "@/components/anime/AnimeCard";
import KomikCard from "@/components/komik/KomikCard";
import Link from "next/link";
import { fetchKomikAPI } from "@/services/komikApi";
import { searchAllAnime } from "@/services/animeAction";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = { title: "Pencarian - MangNime" };

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const keyword = resolvedParams?.q || "";
  const page = parseInt(resolvedParams?.page || 1);
  const type = resolvedParams?.type || "all";

  const genreIds = resolvedParams?.genreIds || "";
  const formatKomik = resolvedParams?.format || "";

  if (!keyword && !genreIds && !formatKomik) {
    return (
      <div className="text-center py-32 text-gray-500 font-bold text-xl animate-fade-in">
        Silakan masukkan kata kunci atau pilih filter pencarian.
      </div>
    );
  }

  let animeList = [];
  let komikList = [];
  let komikPagination = null;

  if (type === "all" || type === "komik") {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (keyword) params.append("search", keyword);
    if (genreIds) params.append("genreIds", genreIds);
    if (formatKomik) params.append("format", formatKomik);

    try {
      const komikRes = await fetchKomikAPI(
        `/advanceSearch?${params.toString()}`,
      );
      komikList = komikRes?.data?.data || komikRes?.data || [];

      const kMeta = komikRes?.data?.meta || komikRes?.meta || null;
      if (kMeta && kMeta.lastPage) {
        const currentPageNum = Number(kMeta.page || page || 1);
        const totalPagesNum = Number(kMeta.lastPage || 1);

        komikPagination = {
          currentPage: currentPageNum,
          totalPages: totalPagesNum,
          hasNextPage: currentPageNum < totalPagesNum,
          hasPrevPage: currentPageNum > 1,
          nextPage: currentPageNum < totalPagesNum ? currentPageNum + 1 : null,
          prevPage: currentPageNum > 1 ? currentPageNum - 1 : null,
        };
      }
    } catch (error) {
      console.error("Gagal fetch pencarian komik:", error);
    }
  }

  if (
    (type === "all" || type === "anime") &&
    !genreIds &&
    !formatKomik &&
    page === 1
  ) {
    try {
      animeList = await searchAllAnime(keyword);
    } catch (error) {
      console.error("Gagal fetch pencarian anime:", error);
    }
  }

  let judulTitle = `"${keyword}"`;
  if (genreIds) judulTitle = "Kategori Genre";
  if (formatKomik) judulTitle = `Format Komik: ${formatKomik.toUpperCase()}`;

  return (
    <div className="space-y-12 animate-fade-in max-w-[1400px] mx-auto pb-10 mt-10 px-4">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 text-center md:text-left shadow-lg">
        <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
          Hasil Pencarian:{" "}
          <span className="text-celestia-sky">{judulTitle}</span>
        </h1>
        {page === 1 && (
          <p className="text-gray-400 text-sm">
            Menemukan{" "}
            {animeList.length > 0 && (
              <span className="text-celestia-sky font-bold">
                {animeList.length} Anime
              </span>
            )}
            {animeList.length > 0 && komikList.length > 0 && " dan "}
            {komikList.length > 0 && (
              <span className="text-celestia-pink font-bold">
                {komikList.length} Komik
              </span>
            )}
            .
          </p>
        )}
      </div>

      {/* SEGMEN ANIME */}
      {type === "all" && !genreIds && !formatKomik && page === 1 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <svg
              className="w-6 h-6 text-celestia-sky"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
            <h2 className="text-2xl font-black text-celestia-sky tracking-widest uppercase">
              Anime
            </h2>
          </div>

          {animeList.length > 0 ? (
            <div
              key={`anime-${keyword}-${page}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 animate-fade-in-up"
            >
              {/* SUNTIKAN SCROLL REVEAL DI SINI */}
              {animeList.map((anime, idx) => (
                <ScrollReveal key={idx}>
                  {/* AnimeCard otomatis tahu routing ke Otakudesu / Alqanime dari properti 'source' */}
                  <AnimeCard anime={anime} index={idx} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 border border-white/5 rounded-2xl bg-white/5 border-dashed">
              Anime tidak ditemukan.
            </div>
          )}
        </section>
      )}

      {/* SEGMEN KOMIK */}
      {(type === "all" || type === "komik") && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <svg
              className="w-6 h-6 text-celestia-pink"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h2 className="text-2xl font-black text-celestia-pink tracking-widest uppercase">
              Komik
            </h2>
          </div>

          {komikList.length > 0 ? (
            <>
              <div
                key={`komik-${keyword}-${genreIds}-${formatKomik}-${page}`}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 animate-fade-in-up"
              >
                {/* SUNTIKAN SCROLL REVEAL DI SINI */}
                {komikList.map((komik, idx) => (
                  <ScrollReveal key={idx}>
                    <KomikCard komik={komik} />
                  </ScrollReveal>
                ))}
              </div>

              {komikPagination && (
                <div className="mt-8 flex justify-center">
                  <CustomSearchPagination
                    pagination={komikPagination}
                    type={type}
                    keyword={keyword}
                    genreIds={genreIds}
                    format={formatKomik}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 text-gray-500 border border-white/5 rounded-2xl bg-white/5 border-dashed">
              Komik tidak ditemukan untuk pencarian ini.
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function CustomSearchPagination({
  pagination,
  type,
  keyword,
  genreIds,
  format,
}) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const {
    currentPage,
    hasPrevPage,
    prevPage,
    hasNextPage,
    nextPage,
    totalPages,
  } = pagination;

  const createUrl = (targetPage) => {
    const p = new URLSearchParams();
    if (type && type !== "all") p.append("type", type);
    if (keyword) p.append("q", keyword);
    if (genreIds) p.append("genreIds", genreIds);
    if (format) p.append("format", format);
    p.append("page", targetPage);
    return `/search?${p.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 w-full">
      {hasPrevPage ? (
        <Link
          href={createUrl(prevPage)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 hover:border-purple-500/30 transition-all"
        >
          &laquo; Prev
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed"
        >
          &laquo; Prev
        </button>
      )}

      <div className="px-6 py-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-300 font-bold flex items-center shadow-[0_0_15px_rgba(168,85,247,0.15)]">
        Halaman {currentPage} <span className="text-gray-500 mx-2">/</span>{" "}
        {totalPages}
      </div>

      {hasNextPage ? (
        <Link
          href={createUrl(nextPage)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 hover:border-purple-500/30 transition-all"
        >
          Next &raquo;
        </Link>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed"
        >
          Next &raquo;
        </button>
      )}
    </div>
  );
}
