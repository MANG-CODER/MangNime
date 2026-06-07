"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function GenreFilterClient({ genreList }) {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isOpenGenre, setIsOpenGenre] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenGenre(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleGenre = (genreId) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) return prev.filter((id) => id !== genreId);
      return [...prev, genreId];
    });
  };

  const handleSearch = () => {
    let searchUrl = `/search?type=komik`;
    if (selectedCategory !== "all") searchUrl += `&format=${selectedCategory}`;
    if (selectedGenres.length > 0)
      searchUrl += `&genreIds=${selectedGenres.join(",")}`;
    router.push(searchUrl);
  };

  const categories = [
    { id: "all", name: "Semua Kategori" },
    { id: "manga", name: "Manga" },
    { id: "manhwa", name: "Manhwa" },
    { id: "manhua", name: "Manhua" },
    { id: "webtoon", name: "Webtoon" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-[1200px] animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white uppercase tracking-widest mb-2">
            Eksplorasi <span className="text-celestia-pink">Genre</span>
          </h1>
          <p className="text-gray-400">
            Temukan komik berdasarkan kategori dan kombinasi genre favoritmu.
          </p>
        </div>

        {/* =========================================
            BAGIAN 1: FILTER LANJUTAN
        ========================================== */}
        <div className="relative z-50">
          <ScrollReveal>
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 mb-16 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-celestia-pink/5 blur-[80px] rounded-full pointer-events-none"></div>

              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-celestia-pink rounded-full shadow-glow-pink"></span>
                Pencarian Spesifik
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 1. Filter Kategori */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    1. Pilih Kategori
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 border ${
                          selectedCategory === cat.id
                            ? "bg-celestia-sky text-white border-celestia-sky shadow-[0_0_15px_rgba(76,201,255,0.4)]"
                            : "bg-black/30 text-gray-400 border-white/10 hover:border-celestia-sky/50 hover:text-white"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Filter Genre (Dropdown Style) */}
                <div className="relative" ref={dropdownRef}>
                  <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    2. Pilih Genre
                  </h3>

                  {/* Tombol Utama Dropdown */}
                  <button
                    type="button"
                    onClick={() => setIsOpenGenre(!isOpenGenre)}
                    className="w-full flex items-center justify-between bg-black/30 border border-white/10 hover:border-celestia-pink rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-all text-left"
                  >
                    <span className="truncate">
                      {selectedGenres.length === 0
                        ? "Pilih Genre..."
                        : `${selectedGenres.length} Genre Terpilih`}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpenGenre ? "transform rotate-180 text-celestia-pink" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* ✨ KONTEN MENU DROPDOWN DENGAN FADE IN & FADE OUT */}
                  <div
                    className={`absolute left-0 mt-2 w-full bg-[#151226] border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[100] p-4 transition-all duration-300 ease-in-out origin-top ${
                      isOpenGenre
                        ? "opacity-100 scale-y-100 translate-y-0 visible"
                        : "opacity-0 scale-y-95 -translate-y-2 invisible pointer-events-none"
                    }`}
                  >
                    {genreList.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        {genreList.map((genreItem) => {
                          const genreId = genreItem.id;
                          const name = genreItem.data?.name || "Unknown";
                          const isChecked = selectedGenres.includes(genreId);

                          return (
                            <label
                              key={genreId}
                              className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer text-xs font-semibold select-none transition-all ${
                                isChecked
                                  ? "bg-celestia-pink/10 text-celestia-pink border border-celestia-pink/20"
                                  : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleGenre(genreId)}
                                className="w-4 h-4 rounded accent-celestia-pink cursor-pointer shrink-0"
                              />
                              <span className="truncate">{name}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 text-xs">
                        Genre tidak tersedia.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tombol Eksekusi */}
              <button
                onClick={handleSearch}
                disabled={
                  selectedCategory === "all" && selectedGenres.length === 0
                }
                className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-celestia-pink to-celestia-lavender text-white font-black rounded-xl hover:scale-[1.02] hover:shadow-glow-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                CARI GABUNGAN KOMIK
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* =========================================
            BAGIAN 2: DAFTAR GENRE SATUAN (CLASSIC)
        ========================================== */}
        <div className="relative z-10">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-black text-white">
                Atau Jelajahi{" "}
                <span className="text-celestia-sky">Genre Satuan</span>
              </h2>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {genreList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {genreList.map((genreItem, idx) => {
                  const genreId = genreItem.id;
                  const name = genreItem.data?.name || "Unknown";

                  return (
                    <Link
                      key={idx}
                      href={`/search?type=komik&genreIds=${genreId}`}
                      className="bg-[#151226] border border-white/5 hover:border-celestia-sky hover:bg-celestia-sky/5 rounded-xl p-4 flex justify-between items-center group hover:-translate-y-1 shadow-lg transition-all"
                    >
                      <span className="font-bold text-gray-400 group-hover:text-white text-sm transition-colors">
                        {name}
                      </span>
                      <span className="text-gray-600 group-hover:text-celestia-sky transform group-hover:translate-x-1 transition-all">
                        &rarr;
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                Data genre tidak tersedia.
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
