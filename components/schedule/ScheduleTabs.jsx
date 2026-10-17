"use client";
import { useState } from "react";
import AnimeCard from "@/components/anime/AnimeCard";

export default function ScheduleTabs({ scheduleData }) {
  const todayRaw = new Date().toLocaleDateString("id-ID", { weekday: "long" });
  const today = todayRaw.charAt(0).toUpperCase() + todayRaw.slice(1);

  const daysOrder = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
    "Random",
  ];

  const initialTab = scheduleData.find((d) => d.day === today)
    ? today
    : "Senin";
  const [activeTab, setActiveTab] = useState(initialTab);

  const activeData =
    scheduleData.find((d) => d.day === activeTab)?.anime_list || [];

  return (
    <div className="space-y-8">
      {/* Day Selector Pills */}
      <div className="flex overflow-x-auto no-scrollbar pb-2 gap-2.5 snap-x">
        {daysOrder.map((day) => {
          const isActive = activeTab === day;
          const isToday = day === today;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveTab(day)}
              className={`snap-center shrink-0 px-6 py-2.5 rounded-full text-xs md:text-sm font-extrabold transition-all duration-300 border flex items-center gap-2 ${
                isActive
                  ? "bg-[#F4B8C6] text-[#161218] border-[#F4B8C6] shadow-vogue-blush"
                  : "bg-[#211B24] text-[#AD9CA6] border-[#F4B8C6]/15 hover:text-[#FDF6F7] hover:border-[#F4B8C6]/40"
              }`}
            >
              <span>{day}</span>
              {isToday && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-[#161218]" : "bg-[#F4B8C6]"
                  }`}
                  title="Hari Ini"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Konten Area Jadwal */}
      <div className="bg-[#211B24]/85 border border-[#F4B8C6]/20 rounded-[32px] p-6 md:p-8 shadow-vogue-card relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between gap-4 mb-7 pb-4 border-b border-[#F4B8C6]/15">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#161218] border border-[#F4B8C6]/25 text-[#F4B8C6]">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#FDF6F7]">
              Hari{" "}
              <span className="font-serif italic font-normal text-[#F4B8C6]">
                {activeTab}
              </span>
            </h2>

            {activeTab === today && (
              <span className="bg-[#F4B8C6]/15 border border-[#F4B8C6]/35 text-[#F4B8C6] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Hari Ini
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-[#AD9CA6]">
            {activeData.length} Judul
          </span>
        </div>

        {activeData.length > 0 ? (
          <div
            key={`schedule-${activeTab}`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-7"
          >
            {activeData.map((anime, idx) => (
              <AnimeCard key={idx} anime={anime} index={idx} hideMeta />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#AD9CA6] text-sm">
            Tidak ada jadwal rilis untuk hari {activeTab}.
          </div>
        )}
      </div>
    </div>
  );
}
