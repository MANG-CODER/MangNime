"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import KomikCard from "@/components/komik/KomikCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AdvancedSearchClient({
  genresList,
  initialData,
  initialPagination,
  currentFilters,
}) {
  const router = useRouter();

  // State untuk menampung filter (diubah menjadi array agar bisa multi-pilih)
  const [selectedFormats, setSelectedFormats] = useState(
    currentFilters.format ? currentFilters.format.split(",") : [],
  );
  const [selectedStatuses, setSelectedStatuses] = useState(
    currentFilters.status ? currentFilters.status.split(",") : [],
  );
  const [selectedGenres, setSelectedGenres] = useState(
    currentFilters.genre ? currentFilters.genre.split(",") : [],
  );

  const FORMAT_OPTIONS = [
    { label: "Manhwa (Korea)", value: "manhwa" },
    { label: "Manhua (China)", value: "manhua" },
    { label: "Manga (Jepang)", value: "manga" },
  ];

  const STATUS_OPTIONS = [
    { label: "Ongoing", value: "Ongoing" },
    { label: "Completed", value: "Completed" },
    { label: "Hiatus", value: "Hiatus" },
  ];

  const toggleSelection = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedFormats.length > 0)
      params.set("format", selectedFormats.join(","));
    if (selectedStatuses.length > 0)
      params.set("status", selectedStatuses.join(","));
    if (selectedGenres.length > 0)
      params.set("genre", selectedGenres.join(","));

    router.push(`/komik/advanced-search?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedFormats([]);
    setSelectedStatuses([]);
    setSelectedGenres([]);
    router.push("/komik/advanced-search");
  };

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-[1400px] animate-fade-in">
        {/* HEADER & FILTER BOX */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 mb-10 relative overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-celestia-pink/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-wide">
              Pencarian <span className="text-celestia-pink">Lanjutan</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base mb-8">
              Saring komik berdasarkan format, status cerita, dan genre secara
              fleksibel (bisa pilih lebih dari satu).
            </p>

            <form onSubmit={handleSearch} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Format Komik (Pills) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Format Komik{" "}
                    <span className="text-celestia-pink font-normal">
                      (Bisa pilih lebih dari satu)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                    {FORMAT_OPTIONS.map((f, idx) => {
                      const isSelected = selectedFormats.includes(f.value);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            toggleSelection(
                              f.value,
                              selectedFormats,
                              setSelectedFormats,
                            )
                          }
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-celestia-sky text-white border-celestia-sky shadow-glow-blue scale-105"
                              : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {isSelected && <span className="mr-1.5">✓</span>}
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Cerita (Pills) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Status Cerita{" "}
                    <span className="text-celestia-pink font-normal">
                      (Bisa pilih lebih dari satu)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                    {STATUS_OPTIONS.map((s, idx) => {
                      const isSelected = selectedStatuses.includes(s.value);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            toggleSelection(
                              s.value,
                              selectedStatuses,
                              setSelectedStatuses,
                            )
                          }
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isSelected
                              ? "bg-celestia-gold text-black border-celestia-gold shadow-glow-gold scale-105"
                              : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          {isSelected && <span className="mr-1.5">✓</span>}
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* MULTI-SELECT GENRE PILLS */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Pilih Genre{" "}
                    <span className="text-celestia-pink font-normal">
                      (Bisa pilih lebih dari satu)
                    </span>
                  </label>
                  {selectedGenres.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedGenres([])}
                      className="text-xs text-celestia-pink hover:underline"
                    >
                      Reset Genre ({selectedGenres.length} dipilih)
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-black/40 border border-white/10 max-h-52 overflow-y-auto custom-scrollbar">
                  {genresList.map((g, idx) => {
                    const isSelected = selectedGenres.includes(g.slug);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          toggleSelection(
                            g.slug,
                            selectedGenres,
                            setSelectedGenres,
                          )
                        }
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-celestia-pink text-white border-celestia-pink shadow-glow-pink scale-105"
                            : "bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {isSelected && <span className="mr-1.5">✓</span>}
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 text-sm font-bold transition-all"
                >
                  Reset Semua
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-celestia-royal to-celestia-pink text-white text-sm font-bold shadow-glow-purple hover:scale-105 transition-all"
                >
                  Terapkan Filter
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* KONTEN HASIL GRID */}
        {initialData.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 animate-fade-in-up">
              {initialData.map((komik, idx) => (
                <ScrollReveal key={idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>

            {initialPagination && (
              <div className="mt-12 flex justify-center">
                <OpenEndedPagination
                  pagination={initialPagination}
                  currentFilters={currentFilters}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 text-gray-500 bg-white/5 rounded-2xl border border-white/10 border-dashed">
            Tidak ada komik yang cocok dengan kriteria filter tersebut.
          </div>
        )}
      </div>
    </div>
  );
}

function OpenEndedPagination({ pagination, currentFilters }) {
  if (!pagination) return null;
  const currentPage = Number(pagination.current_page || 1);
  const totalPages = Number(pagination.total_pages || 1);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const buildUrl = (targetPage) => {
    const params = new URLSearchParams();
    if (currentFilters.format) params.set("format", currentFilters.format);
    if (currentFilters.status) params.set("status", currentFilters.status);
    if (currentFilters.genre) params.set("genre", currentFilters.genre);
    params.set("page", targetPage);
    return `/komik/advanced-search?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 w-full">
      {hasPrevPage ? (
        <a
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 transition-all inline-block"
        >
          &laquo; Prev
        </a>
      ) : (
        <button
          disabled
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed"
        >
          &laquo; Prev
        </button>
      )}

      <div className="px-6 py-2 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-300 font-bold flex items-center">
        Halaman {currentPage} {totalPages > 1 ? `/ ${totalPages}` : ""}
      </div>

      {hasNextPage ? (
        <a
          href={buildUrl(currentPage + 1)}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-purple-600/20 hover:text-purple-400 transition-all inline-block"
        >
          Next &raquo;
        </a>
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
