"use client";

import { OtakudesuClient } from "./providers/otakudesu.client";
import { checkRateLimit } from "./core/clientCache";

// Pengganti searchAllAnime() server action + route /api/search.
// Dipanggil langsung dari komponen client (SearchBar, halaman /search).
// - return: array hasil (sudah diurutkan, logika sama dengan versi server)
// - batas per-fitur 20x/menit (sama seperti server), lewat batas -> []
// - kalau upstream gagal: error DILEMPAR (error.status 403/429/dll), supaya UI
//   bisa bedain "gagal" dari "nggak ketemu". Cache hasil mentah (6 jam) diurus clientFetcher.
export async function searchAllAnime(query) {
  const cleanQuery = (query || "").trim().toLowerCase();
  if (!cleanQuery) return [];

  if (!checkRateLimit("anime_search", 20, 60 * 1000)) return [];

  const res = await OtakudesuClient.search(cleanQuery);
  const results = Array.isArray(res) ? res : [];

  return [...results].sort((a, b) => {
    const titleA = (a.title || "").toLowerCase();
    const titleB = (b.title || "").toLowerCase();

    const aStarts = titleA.startsWith(cleanQuery) ? 1 : 0;
    const bStarts = titleB.startsWith(cleanQuery) ? 1 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;

    const aContains = titleA.includes(cleanQuery) ? 1 : 0;
    const bContains = titleB.includes(cleanQuery) ? 1 : 0;
    if (aContains !== bContains) return bContains - aContains;

    return titleA.length - titleB.length;
  });
}
