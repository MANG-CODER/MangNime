"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { getMoreKomikChapters } from "@/services/searchAction";

function formatReleaseDate(dateStr) {
  if (!dateStr) return "Baru saja";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ChapterListInfinite({
  komikSlug,
  mangaId,
  initialChapters = [],
  pagination = null,
}) {
  const totalPages = Number(pagination?.totalPages) || 1;
  const totalRecord = Number(pagination?.totalRecord) || initialChapters.length;

  const storageKey = `mn_chapters_${mangaId || komikSlug}`;

  const [chapters, setChapters] = useState(initialChapters);
  const [currentPage, setCurrentPage] = useState(
    Number(pagination?.currentPage) || 1,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const scrollContainerRef = useRef(null);
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Simpan/pulihkan daftar yang sudah di-scroll dari sessionStorage browser
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed.chapters) &&
          parsed.chapters.length > initialChapters.length
        ) {
          setChapters(parsed.chapters);
          setCurrentPage(parsed.currentPage || 1);
        }
      }
    } catch {}
  }, [storageKey, initialChapters.length]);

  const loadNextPage = useCallback(async () => {
    if (isFetchingRef.current || currentPage >= totalPages) return;
    const targetId = mangaId || komikSlug;
    if (!targetId || String(targetId).startsWith("komikudetail-")) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    setErrorMsg("");

    const nextPage = currentPage + 1;

    try {
      const res = await getMoreKomikChapters(targetId, nextPage);

      if (res?.rateLimited) {
        setErrorMsg("Server sibuk, gulir lagi dalam beberapa detik...");
        return;
      }

      if (Array.isArray(res?.chapters) && res.chapters.length > 0) {
        setChapters((prev) => {
          const existingIds = new Set(prev.map((c) => c.chapterId || c.slug));
          const uniqueNew = res.chapters.filter(
            (c) => !existingIds.has(c.chapterId || c.slug),
          );
          const merged = [...prev, ...uniqueNew];

          try {
            sessionStorage.setItem(
              storageKey,
              JSON.stringify({
                chapters: merged,
                currentPage: nextPage,
              }),
            );
          } catch {}

          return merged;
        });
        setCurrentPage(nextPage);
      }
    } catch {
      setErrorMsg("Gagal memuat chapter tambahan.");
    } finally {
      setTimeout(() => {
        isFetchingRef.current = false;
        setIsLoading(false);
      }, 400);
    }
  }, [currentPage, totalPages, mangaId, komikSlug, storageKey]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const sentinel = sentinelRef.current;

    if (!container || !sentinel || currentPage >= totalPages || searchQuery) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingRef.current) {
          loadNextPage();
        }
      },
      {
        root: container,
        rootMargin: "0px 0px 180px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentPage, totalPages, loadNextPage, searchQuery]);

  const filteredChapters = searchQuery.trim()
    ? chapters.filter((ch) =>
        String(ch.chapterNumber || ch.title)
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      )
    : chapters;

  const hasMore = currentPage < totalPages;

  return (
    <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[28px] p-5 md:p-7 shadow-vogue-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F4B8C6]/15">
        <div>
          <h2 className="text-lg md:text-2xl font-extrabold text-[#FDF6F7] flex items-center gap-2.5">
            <span>Daftar Chapter</span>
            <span className="px-3 py-0.5 text-xs font-bold rounded-full bg-[#F4B8C6]/15 text-[#F4B8C6] border border-[#F4B8C6]/30">
              {chapters.length} / {totalRecord}
            </span>
          </h2>
          <p className="text-xs text-[#AD9CA6] mt-0.5">
            Gulir daftar di bawah untuk memuat chapter lama secara otomatis
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari chapter (mis. 120)..."
            className="w-full px-4 py-2 rounded-full bg-[#161218] border border-[#F4B8C6]/20 text-xs text-[#FDF6F7] placeholder-[#AD9CA6]/60 focus:outline-none focus:border-[#F4B8C6]"
          />
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="max-h-[480px] overflow-y-auto custom-scrollbar pr-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5"
      >
        {filteredChapters.map((ch) => (
          <Link
            key={ch.chapterId || ch.slug}
            href={`/komik/${komikSlug}/${ch.slug}`}
            prefetch={false}
            className="group p-3.5 rounded-2xl bg-[#161218]/80 hover:bg-[#28202C] border border-[#F4B8C6]/10 hover:border-[#F4B8C6]/40 transition-all flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-xs md:text-sm font-extrabold text-[#FDF6F7] group-hover:text-[#F4B8C6] transition-colors truncate">
                {ch.title}
              </p>
              <p className="text-[11px] text-[#AD9CA6] mt-0.5">
                {formatReleaseDate(ch.createdAt)}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#211B24] group-hover:bg-[#F4B8C6] text-[10px] font-extrabold text-[#F4B8C6] group-hover:text-[#161218] transition-all shrink-0">
              Baca &rarr;
            </span>
          </Link>
        ))}

        {hasMore && !searchQuery && (
          <div
            ref={sentinelRef}
            className="col-span-full py-4 flex flex-col items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-xs font-bold text-[#F4B8C6]">
                <span className="w-4 h-4 rounded-full border-2 border-[#F4B8C6] border-t-transparent animate-spin" />
                <span>
                  Memuat halaman {currentPage + 1} dari {totalPages}...
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={loadNextPage}
                className="px-4 py-1.5 rounded-full bg-[#161218] hover:bg-[#F4B8C6]/20 border border-[#F4B8C6]/25 text-[11px] font-bold text-[#F4B8C6] transition-all"
              >
                Muat Chapter Lainnya ({chapters.length}/{totalRecord})
              </button>
            )}
            {errorMsg && (
              <p className="text-[11px] text-[#E88D9E]">{errorMsg}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
