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
    <div className="space-y-10">
      <div className="flex overflow-x-auto custom-scrollbar pb-4 gap-4 snap-x px-2">
        {daysOrder.map((day) => {
          const isActive = activeTab === day;
          return (
            <button
              key={day}
              onClick={() => setActiveTab(day)}
              className={`snap-center shrink-0 px-8 py-3 rounded-full font-bold transition-all duration-300 border ${
                isActive
                  ? "bg-gradient-to-r from-celestia-royal to-celestia-lavender text-white border-transparent shadow-glow-purple transform scale-105"
                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-celestia-sky hover:border-celestia-sky/30"
              }`}
            >
              {day}{" "}
              {isActive && (
                <span className="ml-1 text-celestia-gold drop-shadow-md">
                  ✨
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Konten Area Jadwal */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-celestia-pink/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-4 mb-8 pb-4 border-b border-white/5">
          <span className="w-2 h-8 bg-celestia-sky rounded-full shadow-[0_0_15px_rgba(76,201,255,0.6)]"></span>
          <h2 className="font-heading text-3xl font-black text-white tracking-wide">
            {activeTab}
          </h2>

          {activeTab === today && (
            <span className="bg-celestia-pink/10 border border-celestia-pink/30 text-celestia-pink text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(255,120,198,0.4)] ml-2">
              Hari Ini
            </span>
          )}
        </div>

        {activeData.length > 0 ? (
          <div
            key={`schedule-${activeTab}`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 animate-fade-in-up"
          >
            {activeData.map((anime, idx) => (
              <AnimeCard key={idx} anime={anime} index={idx} hideMeta />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-light">
            Tidak ada jadwal rilis untuk hari {activeTab}.
          </div>
        )}
      </div>
    </div>
  );
}
