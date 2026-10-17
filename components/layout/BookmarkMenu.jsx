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

  useEffect(() => {
    const fetchBookmarks = () => {
      const rawData = localStorage.getItem("mangnime_bookmarks");
      setBookmarks(rawData ? JSON.parse(rawData) : []);
    };
    fetchBookmarks();
    window.addEventListener("bookmarksUpdated", fetchBookmarks);
    return () => window.removeEventListener("bookmarksUpdated", fetchBookmarks);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBookmarks = bookmarks.filter(
    (b) => (b.type || "anime") === activeTab,
  );

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#211B24] hover:bg-[#F4B8C6] text-[#AD9CA6] hover:text-[#161218] transition-all border border-[#F4B8C6]/20 relative"
        aria-label="Bookmarks"
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
            strokeWidth="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        {bookmarks.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4B8C6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F4B8C6] border-2 border-[#161218]"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#211B24]/95 backdrop-blur-2xl border border-[#F4B8C6]/25 rounded-3xl shadow-vogue-card overflow-hidden animate-fade-in flex flex-col max-h-[500px]">
          <div className="flex border-b border-[#F4B8C6]/15 overflow-x-auto no-scrollbar p-1.5 gap-1 bg-[#161218]/50">
            {tabs.map((tab) => {
              const count = bookmarks.filter(
                (b) => (b.type || "anime") === tab.id,
              ).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-3 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider rounded-full transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-[#F4B8C6] text-[#161218]"
                      : "text-[#AD9CA6] hover:text-[#FDF6F7]"
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="overflow-y-auto custom-scrollbar p-2.5 flex-1 min-h-[200px]">
            {filteredBookmarks.length > 0 ? (
              filteredBookmarks.map((item, idx) => {
                const itemUrl =
                  item.url ||
                  (item.type === "komik"
                    ? `/komik/${item.slug}`
                    : `/${item.type || "anime"}/${item.slug}`);

                const itemImage =
                  item.image ||
                  item.cover ||
                  "https://placehold.co/200x300/211B24/F4B8C6?text=No+Image";

                return (
                  <Link
                    href={itemUrl}
                    key={idx}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-3 p-2 hover:bg-[#F4B8C6]/[0.08] rounded-2xl transition-colors items-center group border-b border-[#F4B8C6]/10 last:border-0"
                  >
                    <div className="w-12 h-16 relative rounded-xl overflow-hidden bg-[#161218] flex-shrink-0 border border-[#F4B8C6]/20 group-hover:border-[#F4B8C6] transition-colors">
                      <Image
                        src={itemImage}
                        alt={item.title || "Bookmark Item"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#FDF6F7] line-clamp-2 group-hover:text-[#F4B8C6] mb-1 leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[9px] text-[#F4B8C6] bg-[#F4B8C6]/15 border border-[#F4B8C6]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest inline-block">
                        {item.status || "Tersimpan"}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="py-14 text-center text-xs text-[#AD9CA6] flex flex-col items-center gap-2">
                <svg
                  className="w-8 h-8 text-[#F4B8C6]/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span>Belum ada {activeTab} tersimpan.</span>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#F4B8C6]/15 bg-[#161218]/40">
            <Link
              href="/bookmark"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center text-xs font-extrabold text-[#161218] bg-[#F4B8C6] hover:bg-[#f8c7d3] py-2.5 rounded-full transition-colors"
            >
              Lihat Semua Koleksi &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
