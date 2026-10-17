"use client";
import Image from "next/image";
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
      <div className="min-h-screen bg-[#161218] flex items-center justify-center text-[#F4B8C6] text-sm font-bold">
        Memuat koleksi...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#161218] pt-8 pb-20 px-4 md:px-8">
      <div className="container mx-auto max-w-[1320px] space-y-8 animate-fade-in">
        {/* HEADER */}
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-vogue-card">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#161218] border border-[#F4B8C6]/25 text-[#F4B8C6]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-[#FDF6F7]">
                Koleksi{" "}
                <span className="font-serif italic font-normal text-[#F4B8C6]">
                  Tersimpan
                </span>
              </h1>
              <span className="bg-[#F4B8C6]/15 text-[#F4B8C6] px-3 py-1 rounded-full text-xs font-extrabold border border-[#F4B8C6]/30">
                {filteredBookmarks.length} Item
              </span>
            </div>
          </div>

          <div className="flex overflow-x-auto bg-[#161218] p-1.5 rounded-full border border-[#F4B8C6]/20 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#F4B8C6] text-[#161218] shadow-vogue-blush"
                    : "text-[#AD9CA6] hover:text-[#FDF6F7]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* LIST ITEM */}
        {filteredBookmarks.length === 0 ? (
          <div className="bg-[#211B24]/70 border border-[#F4B8C6]/15 rounded-[32px] p-14 text-center shadow-vogue-card space-y-3">
            <svg
              className="w-10 h-10 text-[#F4B8C6]/40 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.6}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h2 className="text-lg font-extrabold text-[#FDF6F7]">
              Belum ada {activeTab} tersimpan
            </h2>
            <p className="text-xs text-[#AD9CA6]">
              Klik tombol Simpan pada halaman anime atau komik untuk
              menambahkannya ke sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-7">
            {filteredBookmarks.map((item) => (
              <div key={item.slug} className="group flex flex-col">
                <div className="relative aspect-[2/3] rounded-[20px] overflow-hidden bg-[#211B24] ring-1 ring-[#F4B8C6]/15 group-hover:ring-[#F4B8C6]/50 shadow-vogue-card transition-all">
                  <Link href={item.url || `/${item.type}/${item.slug}`}>
                    <Image
                      src={
                        item.image ||
                        "https://placehold.co/300x450/211B24/F4B8C6"
                      }
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 45vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161218]/90 via-transparent to-transparent" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeBookmark(item.slug)}
                    className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-[#161218]/85 hover:bg-[#E88D9E] text-[#E88D9E] hover:text-[#161218] border border-[#E88D9E]/40 text-[10px] font-extrabold transition-all"
                  >
                    Hapus
                  </button>
                </div>

                <Link
                  href={item.url || `/${item.type}/${item.slug}`}
                  className="mt-2.5 px-1"
                >
                  <h3 className="text-sm font-bold text-[#FDF6F7] group-hover:text-[#F4B8C6] line-clamp-2 transition-colors">
                    {item.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
