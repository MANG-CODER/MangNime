"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import KomikCard from "@/components/komik/KomikCard";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function AdvancedSearchClient({
  genresList,
  initialData,
  initialPagination,
  currentFilters,
}) {
  const router = useRouter();

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
    <div className="min-h-screen bg-[#161218] pt-8 pb-20 px-4 md:px-8">
      <div className="container mx-auto max-w-[1400px] animate-fade-in">
        {/* HEADER & FILTER BOX */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-10 mb-10 relative overflow-hidden shadow-vogue-card">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161218] border border-[#F4B8C6]/30 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4B8C6] mb-2">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Archive Filter</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#FDF6F7] mb-2 tracking-tight">
              Pencarian{" "}
              <span className="font-serif italic font-normal text-[#F4B8C6]">
                Lanjutan Komik
              </span>
            </h1>
            <p className="text-[#AD9CA6] text-xs md:text-sm mb-8">
              Saring katalog komik berdasarkan format negara, status rilis, dan
              kombinasi genre favoritmu.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Format Komik */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#FDF6F7]">
                    Format Komik{" "}
                    <span className="text-[#AD9CA6] font-normal lowercase">
                      (bisa multi-pilih)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-[#161218] border border-[#F4B8C6]/15">
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
                          className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                            isSelected
                              ? "bg-[#B8C4D4] text-[#161218] border-[#B8C4D4]"
                              : "bg-[#211B24] text-[#AD9CA6] border-[#F4B8C6]/10 hover:border-[#B8C4D4]/40 hover:text-[#FDF6F7]"
                          }`}
                        >
                          {isSelected && <span className="mr-1.5">✓</span>}
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Cerita */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#FDF6F7]">
                    Status Cerita{" "}
                    <span className="text-[#AD9CA6] font-normal lowercase">
                      (bisa multi-pilih)
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3.5 rounded-2xl bg-[#161218] border border-[#F4B8C6]/15">
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
                          className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                            isSelected
                              ? "bg-[#F7D6C4] text-[#161218] border-[#F7D6C4]"
                              : "bg-[#211B24] text-[#AD9CA6] border-[#F4B8C6]/10 hover:border-[#F7D6C4]/40 hover:text-[#FDF6F7]"
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
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#FDF6F7]">
                    Pilih Genre{" "}
                    <span className="text-[#AD9CA6] font-normal lowercase">
                      (bisa multi-pilih)
                    </span>
                  </label>
                  {selectedGenres.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedGenres([])}
                      className="text-xs font-bold text-[#F4B8C6] hover:underline"
                    >
                      Reset Genre ({selectedGenres.length} dipilih)
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-[#161218] border border-[#F4B8C6]/15 max-h-52 overflow-y-auto custom-scrollbar">
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
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-[#F4B8C6] text-[#161218] border-[#F4B8C6] font-extrabold shadow-vogue-blush"
                            : "bg-[#211B24] text-[#AD9CA6] border-[#F4B8C6]/10 hover:border-[#F4B8C6]/40 hover:text-[#FDF6F7]"
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
                  className="px-6 py-2.5 rounded-full bg-[#161218] border border-[#F4B8C6]/20 text-[#AD9CA6] hover:text-[#FDF6F7] text-xs font-bold transition-all"
                >
                  Reset Filter
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-full bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] text-xs font-extrabold shadow-vogue-blush active:scale-95 transition-all"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7">
              {initialData.map((komik, idx) => (
                <ScrollReveal key={komik.slug || idx}>
                  <KomikCard komik={komik} />
                </ScrollReveal>
              ))}
            </div>

            <Pagination
              pagination={initialPagination}
              basePath="/komik/advanced-search"
              queryParams={currentFilters}
            />
          </>
        ) : (
          <div className="text-center py-24 text-[#AD9CA6] bg-[#211B24]/60 rounded-3xl border border-[#F4B8C6]/15">
            Tidak ada komik yang cocok dengan kriteria filter tersebut.
          </div>
        )}
      </div>
    </div>
  );
}