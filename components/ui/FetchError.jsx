"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Kotak error untuk halaman yang datanya diambil di browser.
// Membedakan jenis error supaya pesannya berguna, dan untuk kasus rate limit
// menampilkan hitungan mundur + mencoba lagi otomatis saat waktunya habis.

function classify(error) {
  const status = error?.status;
  if (error?.rateLimited || status === 429) return "rate";
  if (status === 403) return "forbidden";
  if (status === 404) return "notfound";
  if (typeof status === "number" && status >= 500) return "server";
  if (error?.name === "AbortError") return "timeout";
  if (
    error instanceof TypeError ||
    /failed to fetch|networkerror|load failed/i.test(error?.message || "")
  ) {
    return "network";
  }
  return "unknown";
}

const COPY = {
  rate: {
    chip: "Rehat Sejenak",
    title: "Terlalu banyak request",
    body: (bucket) =>
      `Jatah request ${bucket || "data"} kamu per menit sedang penuh. Tunggu sebentar, nanti dicoba lagi otomatis.`,
    hint: null,
  },
  forbidden: {
    chip: "Akses Ditolak",
    title: "Server penyedia menolak akses",
    body: () =>
      "Koneksi internet kamu mungkin sedang dibatasi oleh penyedia data.",
    hint: "Coba ganti jaringan (misalnya dari WiFi ke data seluler) atau tunggu beberapa menit.",
  },
  server: {
    chip: "Server Bermasalah",
    title: "Server penyedia sedang bermasalah",
    body: () =>
      "Ini bukan salah kamu. Server data sedang error atau kelebihan beban.",
    hint: "Tunggu beberapa saat lalu coba lagi.",
  },
  timeout: {
    chip: "Terlalu Lama",
    title: "Permintaan terlalu lama",
    body: () => "Server penyedia tidak menjawab tepat waktu.",
    hint: "Periksa koneksi internet kamu, lalu coba lagi.",
  },
  network: {
    chip: "Koneksi Terputus",
    title: "Tidak bisa terhubung ke server data",
    body: () => "Periksa koneksi internet kamu.",
    hint: "Kalau koneksi normal, bisa jadi penyedia data sedang down atau memblokir jaringan kamu.",
  },
  notfound: {
    chip: "Tidak Ditemukan",
    title: "Data tidak ditemukan",
    body: () => "Data yang kamu cari tidak ada di server penyedia.",
    hint: null,
  },
  unknown: {
    chip: "System Notice",
    title: "Gagal memuat data",
    body: () => "Terjadi kesalahan saat mengambil data. Silakan coba lagi.",
    hint: null,
  },
};

export default function FetchError({ error, onRetry, compact = false }) {
  const kind = classify(error);
  const copy = COPY[kind];
  const waitMs = kind === "rate" ? Number(error?.retryAfterMs) || 0 : 0;
  const [left, setLeft] = useState(Math.ceil(waitMs / 1000));
  const fired = useRef(false);

  // Hitung mundur; saat habis, coba lagi otomatis (sekali per error).
  useEffect(() => {
    fired.current = false;
    if (!waitMs) {
      setLeft(0);
      return;
    }
    const end = Date.now() + waitMs;
    setLeft(Math.ceil(waitMs / 1000));
    const timer = setInterval(() => {
      const rest = Math.max(0, end - Date.now());
      setLeft(Math.ceil(rest / 1000));
      if (rest <= 0) {
        clearInterval(timer);
        if (onRetry && !fired.current) {
          fired.current = true;
          onRetry();
        }
      }
    }, 250);
    return () => clearInterval(timer);
    // sengaja hanya bergantung pada `error`: satu hitung mundur per error
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const warm = kind === "rate";
  const detail = [
    typeof error?.status === "number" ? `HTTP ${error.status}` : null,
    error?.bucket || null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        compact ? "py-10" : "py-20"
      } text-[#AD9CA6] border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/60 text-center px-4`}
    >
      <div className="max-w-md space-y-3">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
            warm
              ? "bg-[#F7D6C4]/15 text-[#F7D6C4]"
              : "bg-[#E88D9E]/15 text-[#E88D9E]"
          }`}
        >
          {copy.chip}
        </span>

        <h3 className="text-lg font-extrabold text-[#FDF6F7]">{copy.title}</h3>

        <p className="text-xs leading-relaxed text-[#AD9CA6]">
          {copy.body(error?.bucket)}
        </p>

        {copy.hint && (
          <p className="text-xs leading-relaxed text-[#F4B8C6]">{copy.hint}</p>
        )}

        {kind === "rate" && left > 0 && (
          <p className="text-xs font-bold text-[#F7D6C4]">
            Mencoba lagi otomatis dalam {left} detik...
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={kind === "rate" && left > 0}
              className="px-5 py-2 rounded-full bg-[#F4B8C6] hover:bg-[#f8c7d3] disabled:opacity-50 disabled:cursor-not-allowed text-[#161218] font-extrabold text-xs transition-all active:scale-95"
            >
              {kind === "rate" && left > 0
                ? `Coba Lagi (${left})`
                : "Coba Lagi"}
            </button>
          )}
          {!compact && (
            <Link
              href="/"
              prefetch={false}
              className="px-5 py-2 rounded-full bg-[#161218] hover:bg-[#2B232F] border border-[#F4B8C6]/25 text-[#F4B8C6] font-bold text-xs transition-all"
            >
              Ke Beranda
            </Link>
          )}
        </div>

        {detail && (
          <p className="text-[10px] uppercase tracking-widest text-[#AD9CA6]/60">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}
