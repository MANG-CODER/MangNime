"use client";

import { useEffect, useState } from "react";
import {
  getRateLimitUsage,
  subscribeRateLimit,
} from "@/services/core/clientFetcher";

const EMPTY_BUCKET = {
  used: 0,
  limit: 40,
  windowMs: 60_000,
  limited: false,
  warnAt: 30,
  warn: false,
  calmInMs: 0,
  nextSlotMs: 0,
  clearInMs: 0,
  cooldownMs: 0,
};
const EMPTY = { anime: EMPTY_BUCKET, komik: EMPTY_BUCKET };

/**
 * Pemakaian jatah request browser ini, per endpoint (anime / komik).
 * Nilai awal selalu kosong (sama di server & client, jadi nggak ada hydration mismatch),
 * baru diisi setelah mount. Hitungan turun sendiri seiring request tua kedaluwarsa (window 60 dtk).
 */
export function useRateLimitUsage() {
  const [usage, setUsage] = useState(EMPTY);

  useEffect(() => {
    const refresh = () => setUsage(getRateLimitUsage());
    refresh();
    return subscribeRateLimit(refresh);
  }, []);

  // Tick tiap 1 detik HANYA selama masih ada request di window / cooldown aktif
  const active =
    usage.anime.used > 0 ||
    usage.komik.used > 0 ||
    usage.anime.cooldownMs > 0 ||
    usage.komik.cooldownMs > 0;

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setUsage(getRateLimitUsage()), 1000);
    return () => clearInterval(t);
  }, [active]);

  return usage;
}
