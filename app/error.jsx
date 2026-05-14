"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Terjadi error di aplikasi:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D0B1A] text-center px-4">
      <h2 className="text-2xl font-bold text-red-400 mb-4">
        Ups! Terjadi Kesalahan Sistem
      </h2>
      <p className="text-gray-400 mb-8">
        Gagal mengambil data dari server. Silakan coba lagi.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
      >
        Coba Muat Ulang
      </button>
    </div>
  );
}
