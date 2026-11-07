"use client";

import { useRateLimitUsage } from "@/hooks/useRateLimitUsage";
import { openRateGuide } from "./rateGuideEvents";

const BUCKETS = [
  { id: "anime", label: "Anime", short: "A" },
  { id: "komik", label: "Komik", short: "K" },
];

const TONE = {
  ok: { dot: "bg-[#B8C4D4]", text: "text-[#B8C4D4]", bar: "bg-[#B8C4D4]" },
  warn: { dot: "bg-[#F7D6C4]", text: "text-[#F7D6C4]", bar: "bg-[#F7D6C4]" },
  danger: { dot: "bg-[#E88D9E]", text: "text-[#E88D9E]", bar: "bg-[#E88D9E]" },
};

function levelOf(b) {
  if (b.limited || b.cooldownMs > 0) return "danger";
  if (b.used >= b.limit * 0.9) return "danger";
  if (b.used >= b.warnAt) return "warn";
  return "ok";
}

const secs = (ms) => Math.max(1, Math.ceil(ms / 1000));

function describe(b) {
  if (b.cooldownMs > 0) {
    return `Server membatasi akses. Request ditahan ${secs(b.cooldownMs)} dtk lagi.`;
  }
  if (b.limited) {
    return `Jatah penuh. Slot kosong dalam ${secs(b.nextSlotMs)} dtk, request baru akan antri.`;
  }
  if (b.warn) {
    return `Hampir penuh. Aman lagi (di bawah ${b.warnAt}) dalam ${secs(b.calmInMs)} dtk kalau kamu jeda.`;
  }
  if (b.used === 0) return "Belum ada request dalam 1 menit terakhir.";
  return `Kembali ke 0 dalam ${secs(b.clearInMs)} dtk kalau tidak ada request baru.`;
}

function Row({ bucket, data }) {
  const tone = TONE[levelOf(data)];
  const pct = Math.min(100, Math.round((data.used / data.limit) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-[#FDF6F7]">{bucket.label}</span>
        <span className={tone.text}>
          {data.used} / {data.limit}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#161218] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] leading-snug text-[#AD9CA6]">
        {describe(data)}
      </p>
    </div>
  );
}

const NOTE =
  "Hanya menghitung request dari browser kamu ke server data (hasil dari cache tidak dihitung). Batas server 45 per menit untuk tiap jenis, MangNime berhenti di 40.";

/**
 * variant="compact": pil kecil di navbar desktop & tengah navbar mobile, detail muncul saat hover/fokus.
 * variant="full":    kartu lengkap (dipakai di drawer menu mobile).
 */
export default function RateLimitMeter({ variant = "compact" }) {
  const usage = useRateLimitUsage();

  if (variant === "full") {
    return (
      <div
        data-rate-meter="full"
        className="rounded-2xl bg-[#211B24] border border-[#F4B8C6]/15 p-3.5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="font-serif italic text-xs text-[#F4B8C6]">
            Jatah request per menit
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#AD9CA6] font-bold">
            reset otomatis
          </span>
        </div>
        {BUCKETS.map((b) => (
          <Row key={b.id} bucket={b} data={usage[b.id]} />
        ))}
        <p className="text-[10px] leading-snug text-[#AD9CA6]/80">{NOTE}</p>
        <button
          type="button"
          onClick={openRateGuide}
          className="text-[11px] font-bold text-[#F4B8C6] hover:underline"
        >
          Apa ini?
        </button>
      </div>
    );
  }

  const label = BUCKETS.map(
    (b) => `${b.label} ${usage[b.id].used} dari ${usage[b.id].limit}`,
  ).join(", ");

  return (
    <div data-rate-meter="compact" className="relative group shrink-0">
      <button
        type="button"
        aria-label={`Jatah request per menit: ${label}`}
        className="h-9 md:h-10 px-3 md:px-3.5 flex items-center gap-2 md:gap-2.5 rounded-full bg-[#211B24] border border-[#F4B8C6]/20 text-[10px] font-extrabold tracking-wide"
      >
        {BUCKETS.map((b, i) => {
          const tone = TONE[levelOf(usage[b.id])];
          return (
            <span key={b.id} className="flex items-center gap-1.5">
              {i > 0 && <span className="w-px h-3 bg-[#F4B8C6]/20" />}
              <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
              <span className="text-[#AD9CA6]">{b.short}</span>
              <span className={tone.text}>{usage[b.id].used}</span>
            </span>
          );
        })}
      </button>

      <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 top-full pt-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50">
        <div className="bg-[#211B24]/95 backdrop-blur-2xl border border-[#F4B8C6]/25 rounded-3xl p-4 shadow-vogue-card space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="font-serif italic text-xs text-[#F4B8C6]">
              Jatah request per menit
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#AD9CA6] font-bold">
              reset otomatis
            </span>
          </div>
          {BUCKETS.map((b) => (
            <Row key={b.id} bucket={b} data={usage[b.id]} />
          ))}
          <p className="text-[10px] leading-snug text-[#AD9CA6]/80">{NOTE}</p>
          <button
            type="button"
            onClick={openRateGuide}
            className="text-[11px] font-bold text-[#F4B8C6] hover:underline"
          >
            Apa ini?
          </button>
        </div>
      </div>
    </div>
  );
}
