"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("anime");

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
      setLoading(false);
    };
    fetchBookmarks();
    window.addEventListener("bookmarksUpdated", fetchBookmarks);
    return () => window.removeEventListener("bookmarksUpdated", fetchBookmarks);
  }, []);

  const removeBookmark = (slugToRemove) => {
    const updated = bookmarks.filter((b) => b.slug !== slugToRemove);
    localStorage.setItem("mangnime_bookmarks", JSON.stringify(updated));
    setBookmarks(updated);
    window.dispatchEvent(new Event("bookmarksUpdated"));
  };

  const filteredBookmarks = bookmarks.filter(
    (b) => (b.type || "anime") === activeTab,
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0B1A] flex items-center justify-center text-white">
        Memuat...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <svg
                className="w-8 h-8 text-celestia-gold drop-shadow-md"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Bookmarks
            </h1>
            <span className="bg-white/10 text-celestia-pink px-3 py-1 rounded-full text-sm font-bold border border-white/10">
              {filteredBookmarks.length} Item
            </span>
          </div>

          <div className="flex overflow-x-auto bg-white/5 p-1 rounded-xl border border-white/10 custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-celestia-pink text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="bg-[#151226]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-12 text-center shadow-2xl">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Belum ada {activeTab} tersimpan
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredBookmarks.map((item) => (
              <div
                key={item.slug}
                className="group relative rounded-2xl overflow-hidden bg-black/40 border border-white/5 hover:border-white/20 transition-all"
              >
                <Link href={item.url || `/${item.type}/${item.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B1A] via-[#0D0B1A]/40 to-transparent"></div>
                  </div>
                </Link>
                <div className="p-4 absolute bottom-0 left-0 w-full">
                  <h3 className="text-white font-bold text-sm line-clamp-2 mb-3 drop-shadow-md">
                    {item.title}
                  </h3>
                  <button
                    onClick={() => removeBookmark(item.slug)}
                    className="w-full py-2 bg-red-500/80 text-white text-xs font-bold rounded-lg hover:bg-red-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
