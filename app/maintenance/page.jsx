"use client";

import Image from "next/image";

export default function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-6 px-4 animate-fade-in">
      <div className="relative w-56 h-56 md:w-72 md:h-72 hover:scale-105 transition-transform duration-500">
        <Image
          src="/img/404icon.svg"
          alt="MangNime sedang dalam maintenance"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif italic text-5xl md:text-6xl font-bold text-[#F4B8C6]">
          Maintenance
        </h1>
        <h2 className="text-xl md:text-3xl font-extrabold text-[#FDF6F7]">
          MangNime Sedang Dalam Pemeliharaan
        </h2>
      </div>

      <p className="text-[#AD9CA6] max-w-md leading-relaxed text-xs md:text-sm">
        Mohon maaf atas ketidaknyamanannya. Kami sedang melakukan peningkatan
        sistem dan server layanan. Silakan kembali beberapa saat lagi.
      </p>

      {/* Status Jaringan */}
      <div className="w-full max-w-lg bg-[#211B24] border border-[#F4B8C6]/20 rounded-3xl p-4 shadow-vogue-card">
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex flex-col items-center">
            <span className="text-[#AD9CA6]">Browser</span>
            <span className="text-emerald-400 font-bold mt-1">Working</span>
          </div>
          <div className="flex flex-col items-center border-x border-[#F4B8C6]/15 px-2">
            <span className="text-[#F4B8C6] font-bold">MangNime</span>
            <span className="text-[#F7D6C4] font-bold mt-1">Updating</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[#AD9CA6]">Database</span>
            <span className="text-emerald-400 font-bold mt-1">Working</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[#F4B8C6] px-6 py-3 text-sm font-bold text-[#161218] transition hover:scale-105 hover:bg-[#F7D6C4] active:scale-95"
        >
          Coba Muat Ulang
        </button>
      </div>
    </div>
  );
}
