"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { searchKomikServer } from "@/services/searchAction";
import { searchAllAnime } from "@/services/animeAction";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim().length < 3) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const [animeRes, komikRes] = await Promise.allSettled([
          searchAllAnime(query),
          searchKomikServer(query),
        ]);

        let combinedResults = [];

        if (animeRes.status === "fulfilled" && Array.isArray(animeRes.value)) {
          const slicedAnime = animeRes.value.slice(0, 8).map((item) => ({
            ...item,
            _type: "anime",
            slugHref:
              item.source === "alqanime"
                ? `/anime/alqanime/detail/${item.slug}`
                : `/anime/${item.animeId || item.id || item.slug}`,
          }));
          combinedResults = [...combinedResults, ...slicedAnime];
        }

        // 2. Olah Hasil Komik (Tetap sama seperti aslinya)
        if (komikRes.status === "fulfilled" && komikRes.value) {
          const kData = komikRes.value?.data?.data || [];
          const slicedKomik = Array.isArray(kData)
            ? kData.slice(0, 3).map((item) => ({ ...item, _type: "komik" }))
            : [];
          combinedResults = [...combinedResults, ...slicedKomik];
        }

        setResults(combinedResults);
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const clearAndClose = () => {
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div className="relative w-full z-50" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="relative group">
        <input
          type="text"
          placeholder="Cari anime atau komik..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-full pl-12 pr-4 py-2.5 outline-none focus:bg-white/10 focus:border-celestia-lavender/50 focus:shadow-glow-purple transition-all"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-celestia-lavender"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-celestia-lavender border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </form>

      {/* RENDER HASIL PENCARIAN */}
      {isFocused && query.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#120F24]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 animate-fade-in flex flex-col max-h-[50vh] md:max-h-[400px]">
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {results.length > 0 ? (
              results.map((item, idx) => {
                const isAnime = item._type === "anime";
                // Gunakan slugHref yang sudah diracik di atas
                const href = isAnime ? item.slugHref : `/komik/${item.slug}`;
                const title = item.title;
                const image =
                  item.cover ||
                  item.poster ||
                  item.image ||
                  item.coverImage ||
                  "https://placehold.co/100x140/151226/ff6c9b?text=Image";
                const subText = isAnime
                  ? item.type || item.status || "Anime"
                  : item.format || "Komik";

                return (
                  <Link
                    href={href}
                    key={idx}
                    onClick={clearAndClose}
                    className="flex gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors items-center group border-b border-white/5 last:border-0"
                  >
                    <div className="w-10 h-14 relative rounded bg-celestia-deep border border-white/10 flex-shrink-0 overflow-hidden shadow-lg group-hover:border-celestia-lavender transition-colors">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="40px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-celestia-sky transition-colors">
                        {title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase ${isAnime ? "bg-celestia-sky/20 text-celestia-sky" : "bg-celestia-pink/20 text-celestia-pink"}`}
                        >
                          {isAnime ? "📺 Anime" : "📖 Komik"}
                        </span>
                        <p className="text-[11px] text-gray-500 truncate uppercase tracking-wider">
                          {subText}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : !isLoading ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500 font-light">
                Tidak menemukan hasil untuk "
                <span className="text-white font-medium">{query}</span>"
              </div>
            ) : null}
          </div>
          {results.length > 0 && (
            <div className="px-3 pt-2 pb-1 border-t border-white/5 shrink-0 mt-auto">
              <button
                onClick={handleSearchSubmit}
                className="w-full py-2 text-xs font-bold text-celestia-lavender hover:text-white bg-celestia-royal/10 hover:bg-celestia-royal rounded-xl transition-all"
              >
                Lihat Semua Hasil &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
