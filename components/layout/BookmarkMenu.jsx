"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BookmarkMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState("anime");
  const menuRef = useRef(null);

  const tabs = [
    { id: "anime", label: "Anime" },
    { id: "episode", label: "Episode" },
    { id: "komik", label: "Komik" },
    { id: "chapter", label: "Chapter" },
  ];

  // Mengambil data Bookmark dari localStorage
  useEffect(() => {
    const fetchBookmarks = () => {
      const rawData = localStorage.getItem("mangnime_bookmarks");
      setBookmarks(rawData ? JSON.parse(rawData) : []);
    };
    fetchBookmarks();
    window.addEventListener("bookmarksUpdated", fetchBookmarks);
    return () => window.removeEventListener("bookmarksUpdated", fetchBookmarks);
  }, []);

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter bookmark sesuai tab aktif (fallback "anime" untuk data lama)
  const filteredBookmarks = bookmarks.filter(
    (b) => (b.type || "anime") === activeTab,
  );

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-celestia-royal transition-colors border border-white/10 hover:border-celestia-lavender relative"
        aria-label="Bookmarks"
      >
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        {bookmarks.length > 0 && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-celestia-pink opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-celestia-pink border-2 border-[#0D0B1A]"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-celestia-night/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[500px]">
          {/* Scrollable Tabs */}
          <div className="flex border-b border-white/10 overflow-x-auto custom-scrollbar">
            {tabs.map((tab) => {
              const count = bookmarks.filter(
                (b) => (b.type || "anime") === tab.id,
              ).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-celestia-pink border-b-2 border-celestia-pink bg-white/5"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          {/* List Konten */}
          <div className="overflow-y-auto custom-scrollbar p-2 flex-1 min-h-[200px]">
            {filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((item, idx) => (
                <Link
                  href={item.url || `/${item.type || "anime"}/${item.slug}`}
                  key={idx}
                  onClick={() => setIsOpen(false)}
                  className="flex gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors items-center group border-b border-white/5 last:border-0"
                >
                  <div className="w-12 h-16 relative rounded-lg overflow-hidden bg-black/50 flex-shrink-0 border border-white/5 group-hover:border-celestia-pink transition-colors">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-200 line-clamp-2 group-hover:text-celestia-sky mb-1 leading-tight">
                      {item.title}
                    </h4>
                    <span className="text-[9px] text-white bg-white/10 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                      {item.status || "Unknown"}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-16 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
                <span className="text-3xl">📭</span>
                Belum ada {activeTab} tersimpan.
              </div>
            )}
          </div>

          {/* Tombol Lihat Semua */}
          <div className="p-3 border-t border-white/10 bg-black/20">
            <Link
              href="/bookmark"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-xs font-bold text-celestia-lavender hover:text-white bg-celestia-lavender/10 hover:bg-celestia-lavender/20 py-2 rounded-lg transition-colors"
            >
              Lihat Semua Koleksi &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
