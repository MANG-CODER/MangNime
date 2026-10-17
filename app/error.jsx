"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Terjadi error di aplikasi:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#161218] text-center px-4">
      <div className="max-w-md p-8 rounded-3xl bg-[#211B24] border border-[#F4B8C6]/20 shadow-vogue-card space-y-4">
        <span className="inline-flex px-3 py-1 rounded-full bg-[#E88D9E]/15 text-[#E88D9E] text-xs font-extrabold uppercase tracking-wider">
          System Notice
        </span>
        <h2 className="text-2xl font-extrabold text-[#FDF6F7]">
          Ups! Terjadi Kesalahan Sistem
        </h2>
        <p className="text-sm text-[#AD9CA6] leading-relaxed">
          Gagal mengambil data dari server penyedia. Silakan coba muat ulang
          halaman ini.
        </p>
        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="px-7 py-2.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] text-xs font-extrabold rounded-full shadow-vogue-blush transition-all active:scale-95"
          >
            Coba Muat Ulang
          </button>
        </div>
      </div>
    </div>
  );
}
