"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { searchKomikServer } from "@/services/searchAction";
import { searchAllAnime } from "@/services/animeAction";

const SEARCH_CACHE_TTL = 5 * 60 * 1000;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchContainerRef = useRef(null);
  const searchCache = useRef(new Map());

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
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSearchResults = async () => {
      const trimmed = query.trim();
      if (trimmed.length < 3) {
        setResults([]);
        return;
      }

      const cacheKey = trimmed.toLowerCase();
      const cached = searchCache.current.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_TTL) {
        setResults(cached.data);
        return;
      }

      setIsLoading(true);
      try {
        const [animeRes, komikRes] = await Promise.allSettled([
          searchAllAnime(trimmed),
          searchKomikServer(trimmed),
        ]);

        if (signal.aborted) return;

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

        if (komikRes.status === "fulfilled" && komikRes.value) {
          const kData = komikRes.value?.data || [];
          const slicedKomik = Array.isArray(kData)
            ? kData.slice(0, 5).map((item) => ({ ...item, _type: "komik" }))
            : [];
          combinedResults = [...combinedResults, ...slicedKomik];
        }

        if (combinedResults.length > 0) {
          searchCache.current.set(cacheKey, {
            data: combinedResults,
            timestamp: Date.now(),
          });
        }

        setResults(combinedResults);
      } catch {
        if (signal.aborted) return;
        setResults([]);
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSearchResults, 500);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
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
          className="w-full bg-[#211B24] border border-[#F4B8C6]/20 text-[#FDF6F7] placeholder-[#AD9CA6]/70 text-xs md:text-sm rounded-full pl-10 pr-4 py-2.5 outline-none focus:bg-[#28202C] focus:border-[#F4B8C6]/60 focus:shadow-vogue-blush transition-all"
        />
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AD9CA6] group-focus-within:text-[#F4B8C6] transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-[#F4B8C6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </form>

      {/* RENDER HASIL PENCARIAN */}
      {isFocused && query.length >= 3 && (
        <div className="absolute top-full left-0 right-0 mt-2.5 bg-[#211B24]/95 backdrop-blur-2xl border border-[#F4B8C6]/25 rounded-3xl shadow-vogue-card overflow-hidden py-2 animate-fade-in flex flex-col max-h-[55vh] md:max-h-[420px]">
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {results.length > 0 ? (
              results.map((item, idx) => {
                const isAnime = item._type === "anime";
                const href = isAnime ? item.slugHref : `/komik/${item.slug}`;
                const title = item.title;
                const image =
                  item.cover ||
                  item.poster ||
                  item.image ||
                  item.coverImage ||
                  "https://placehold.co/100x140/211B24/F4B8C6?text=Image";
                const subText = isAnime
                  ? item.type || item.status || "Anime"
                  : item.type || item.format || "Komik";

                return (
                  <Link
                    href={href}
                    key={idx}
                    onClick={clearAndClose}
                    className="flex gap-3 px-4 py-2.5 hover:bg-[#F4B8C6]/[0.08] transition-colors items-center group border-b border-[#F4B8C6]/10 last:border-0"
                  >
                    <div className="w-10 h-14 relative rounded-xl bg-[#161218] border border-[#F4B8C6]/20 flex-shrink-0 overflow-hidden group-hover:border-[#F4B8C6] transition-colors">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        unoptimized
                        sizes="40px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-[#FDF6F7] truncate group-hover:text-[#F4B8C6] transition-colors">
                        {title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-extrabold tracking-wider uppercase ${
                            isAnime
                              ? "bg-[#F4B8C6]/15 text-[#F4B8C6] border border-[#F4B8C6]/30"
                              : "bg-[#B8C4D4]/15 text-[#B8C4D4] border border-[#B8C4D4]/30"
                          }`}
                        >
                          {isAnime ? "Anime" : "Komik"}
                        </span>
                        <p className="text-[11px] text-[#AD9CA6] truncate uppercase tracking-wider">
                          {subText}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : !isLoading ? (
              <div className="px-4 py-8 text-center text-xs text-[#AD9CA6]">
                Tidak menemukan hasil untuk &ldquo;
                <span className="text-[#FDF6F7] font-bold">{query}</span>&rdquo;
              </div>
            ) : null}
          </div>
          {results.length > 0 && (
            <div className="px-3 pt-2 pb-1 border-t border-[#F4B8C6]/15 shrink-0 mt-auto">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full py-2 text-xs font-extrabold text-[#161218] bg-[#F4B8C6] hover:bg-[#f8c7d3] rounded-full transition-all"
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
