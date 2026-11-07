"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRateLimitUsage } from "@/hooks/useRateLimitUsage";
import { OPEN_RATE_GUIDE_EVENT, openRateGuide } from "./rateGuideEvents";

// Dua popup, dipasang sekali di app/layout.jsx:
//  1) Modal penjelasan counter request, muncul SEKALI untuk pengunjung baru
//     (ditandai di localStorage). Bisa dibuka lagi lewat tombol "Apa ini?" di Navbar.
//  2) Toast "rehat sejenak" saat salah satu jatah (anime / komik) menyentuh ambang (default 30).

const INTRO_KEY = "ms:intro:v1";
const INTRO_DELAY_MS = 1200;
const SERVER_LIMIT = 45; // batas dari server penyedia data, per jenis per menit

const BUCKETS = [
  { id: "anime", label: "Anime" },
  { id: "komik", label: "Komik" },
];

const TONE = {
  warn: { text: "text-[#F7D6C4]", bar: "bg-[#F7D6C4]" },
  danger: { text: "text-[#E88D9E]", bar: "bg-[#E88D9E]" },
};

const secs = (ms) => Math.max(1, Math.ceil(ms / 1000));

// 0 = aman, 1 = ambang peringatan, 2 = penuh / ditahan server
const severity = (d) => (d.limited || d.cooldownMs > 0 ? 2 : d.warn ? 1 : 0);

// Jangan tampilkan overlay ke crawler / alat audit (overlay yang menutup konten bisa merugikan SEO).
const looksLikeCrawler = () =>
  typeof navigator !== "undefined" &&
  /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent || "");

/* ------------------------------------------------------------------ */
/* 1) MODAL PENJELASAN                                                  */
/* ------------------------------------------------------------------ */

function GuideModal({ open, onClose, limit, warnAt, windowMs }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      dialogRef.current
        ? [...dialogRef.current.querySelectorAll("button, a[href]")]
        : [];
    const items = focusables();
    if (items.length) items[items.length - 1].focus(); // tombol utama "Mengerti"

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && previouslyFocused.focus)
        previouslyFocused.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const windowSec = Math.round(windowMs / 1000);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-[#0B090D]/80 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rate-guide-title"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar p-6 md:p-8 rounded-[28px] bg-[#211B24] border border-[#F4B8C6]/20 shadow-vogue-card space-y-5 animate-fade-in"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex px-3 py-1 rounded-full bg-[#F4B8C6]/15 text-[#F4B8C6] text-xs font-extrabold uppercase tracking-wider">
              Info Penting
            </span>
            <h2
              id="rate-guide-title"
              className="text-2xl font-extrabold text-[#FDF6F7] leading-tight"
            >
              Kenalan dulu sama{" "}
              <span className="font-serif italic font-normal text-[#F4B8C6]">
                counter request
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup penjelasan"
            className="shrink-0 w-9 h-9 rounded-full bg-[#161218] hover:bg-[#F4B8C6] text-[#AD9CA6] hover:text-[#161218] border border-[#F4B8C6]/20 flex items-center justify-center transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-sm text-[#AD9CA6] leading-relaxed">
          MangNime tidak menyimpan data anime dan komik di server sendiri. Semua
          datanya diambil{" "}
          <strong className="text-[#FDF6F7]">langsung dari browser kamu</strong>{" "}
          ke server penyedia data. Counter kecil di navbar menunjukkan seberapa
          banyak jatah request kamu yang sudah terpakai.
        </p>

        <ol className="space-y-3.5 text-sm">
          {[
            [
              "Apa itu A dan K?",
              `A = Anime, K = Komik. Angkanya adalah jumlah request yang browser kamu kirim dalam ${windowSec} detik terakhir.`,
            ],
            [
              "Kenapa ada batasnya?",
              `Server penyedia membatasi ${SERVER_LIMIT} request per menit untuk tiap jenis. MangNime berhenti di ${limit} supaya ada sisa aman. Anime dan komik dihitung terpisah.`,
            ],
            [
              "Kapan angkanya reset?",
              'Otomatis. Tiap request "kedaluwarsa" 60 detik setelah dikirim, jadi angkanya turun sendiri satu per satu. Kamu nggak perlu ngapa-ngapain.',
            ],
            [
              "Apakah semua dihitung?",
              "Tidak. Halaman yang sudah pernah kamu buka biasanya dimuat dari penyimpanan browser, jadi tidak menambah angka.",
            ],
            [
              `Kalau sudah ${warnAt}?`,
              `Akan muncul peringatan untuk rehat sejenak. Kalau sampai penuh (${limit}), request berikutnya antri otomatis beberapa detik, dan kalau terlalu lama akan muncul tombol "Coba Lagi".`,
            ],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#161218] border border-[#F4B8C6]/25 text-[#F4B8C6] text-[11px] font-extrabold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-[#FDF6F7]">{title}</p>
                <p className="text-[#AD9CA6] leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 p-3.5 rounded-2xl bg-[#161218] border border-[#F4B8C6]/15 text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-[#B8C4D4]">
            <span className="w-2 h-2 rounded-full bg-[#B8C4D4]" />
            Aman (di bawah {warnAt})
          </span>
          <span className="flex items-center gap-1.5 text-[#F7D6C4]">
            <span className="w-2 h-2 rounded-full bg-[#F7D6C4]" />
            Hampir penuh ({warnAt}+)
          </span>
          <span className="flex items-center gap-1.5 text-[#E88D9E]">
            <span className="w-2 h-2 rounded-full bg-[#E88D9E]" />
            Penuh / ditahan server
          </span>
        </div>

        <p className="text-[11px] leading-snug text-[#AD9CA6]/80">
          Catatan: internet yang dipakai ramai-ramai (WiFi umum atau data
          seluler) bisa ikut berbagi jatah, jadi kadang batasnya terasa lebih
          cepat habis. Penjelasan ini bisa dibuka lagi lewat tombol &ldquo;Apa
          ini?&rdquo; saat kamu mengarahkan kursor ke counter di navbar.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full px-7 py-3 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] text-sm font-extrabold rounded-full shadow-vogue-blush transition-all active:scale-95"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2) TOAST "REHAT SEJENAK"                                             */
/* ------------------------------------------------------------------ */

function rowMessage(d) {
  if (d.cooldownMs > 0) {
    return `Server penyedia membatasi akses. Tunggu ${secs(d.cooldownMs)} detik.`;
  }
  if (d.limited) {
    return `Jatah penuh. Request baru akan antri, slot kosong dalam ${secs(d.nextSlotMs)} detik.`;
  }
  return `Aman lagi (di bawah ${d.warnAt}) dalam ${secs(d.calmInMs)} detik kalau kamu jeda sebentar.`;
}

function RestToast({ hot, usage, onDismiss }) {
  const urgent = hot.some((b) => severity(usage[b.id]) === 2);
  return (
    <div className="fixed inset-x-0 bottom-24 lg:bottom-6 z-[90] flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md p-5 rounded-3xl bg-[#211B24]/95 backdrop-blur-2xl border border-[#F4B8C6]/25 shadow-vogue-card space-y-4 animate-fade-in">
        <span className="sr-only" role="status">
          Jatah request hampir habis. Rehat sejenak.
        </span>

        <div className="flex items-start gap-3">
          <span
            className={`shrink-0 w-10 h-10 rounded-2xl bg-[#161218] border border-[#F4B8C6]/25 flex items-center justify-center ${
              urgent ? "text-[#E88D9E]" : "text-[#F7D6C4]"
            }`}
          >
            <svg
              className="w-5 h-5"
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
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#FDF6F7]">
              {urgent ? "Jatah penuh, " : "Rehat "}
              <span className="font-serif italic font-normal text-[#F4B8C6]">
                {urgent ? "tunggu sebentar" : "sejenak, ya"}
              </span>
            </h3>
            <p className="text-xs text-[#AD9CA6] leading-relaxed">
              Kamu sudah mengirim banyak request dalam 1 menit terakhir. Jeda
              beberapa detik biar tidak kena batas dari server penyedia.
              Hitungannya turun sendiri.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {hot.map((b) => {
            const d = usage[b.id];
            const tone = TONE[severity(d) === 2 ? "danger" : "warn"];
            const pct = Math.min(100, Math.round((d.used / d.limit) * 100));
            return (
              <div key={b.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#FDF6F7]">{b.label}</span>
                  <span className={tone.text}>
                    {d.used} / {d.limit}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#161218] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[11px] leading-snug text-[#AD9CA6]">
                  {rowMessage(d)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onDismiss}
            className="flex-1 px-5 py-2.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] text-xs font-extrabold rounded-full shadow-vogue-blush transition-all active:scale-95"
          >
            Oke, rehat dulu
          </button>
          <button
            type="button"
            onClick={openRateGuide}
            className="px-4 py-2.5 rounded-full bg-[#161218] hover:bg-[#2B232F] text-[#F4B8C6] border border-[#F4B8C6]/25 text-xs font-bold transition-all"
          >
            Apa ini?
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function RateLimitPopups() {
  const usage = useRateLimitUsage();
  const pathname = usePathname();
  const [guideOpen, setGuideOpen] = useState(false);

  // --- modal: sekali untuk pengunjung baru, + bisa dibuka lagi lewat event ---
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(INTRO_KEY) === "1";
    } catch {
      // localStorage diblokir -> anggap belum pernah lihat
    }
    const skip =
      looksLikeCrawler() || (pathname || "").startsWith("/maintenance");
    let timer;
    if (!seen && !skip) {
      timer = setTimeout(() => setGuideOpen(true), INTRO_DELAY_MS);
    }
    const onOpen = () => setGuideOpen(true);
    window.addEventListener(OPEN_RATE_GUIDE_EVENT, onOpen);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(OPEN_RATE_GUIDE_EVENT, onOpen);
    };
    // sengaja hanya saat mount: pindah halaman nggak memicu ulang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeGuide = useCallback(() => {
    setGuideOpen(false);
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {
      // abaikan
    }
  }, []);

  // --- toast: muncul saat naik ke tingkat lebih parah dari yang sudah di-dismiss ---
  const [seen, setSeen] = useState({ anime: 0, komik: 0 });

  useEffect(() => {
    setSeen((prev) => {
      let next = prev;
      for (const b of BUCKETS) {
        const s = severity(usage[b.id]);
        if (s < prev[b.id]) {
          if (next === prev) next = { ...prev };
          next[b.id] = s; // turun -> "dipersenjatai" lagi
        }
      }
      return next;
    });
  }, [usage]);

  const hot = BUCKETS.filter((b) => severity(usage[b.id]) > seen[b.id]);

  const dismiss = () =>
    setSeen((prev) => {
      const next = { ...prev };
      for (const b of hot) next[b.id] = severity(usage[b.id]);
      return next;
    });

  const ref = usage.anime;
  return (
    <>
      <GuideModal
        open={guideOpen}
        onClose={closeGuide}
        limit={ref.limit}
        warnAt={ref.warnAt}
        windowMs={ref.windowMs}
      />
      {hot.length > 0 && !guideOpen && (
        <RestToast hot={hot} usage={usage} onDismiss={dismiss} />
      )}
    </>
  );
}
