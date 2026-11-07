"use client";

import { KomikClient } from "./komikApi.client";
import { checkRateLimit } from "./core/clientCache";

// Nama fungsi & bentuk return SAMA dengan searchAction.js lama, jadi komponen
// cukup ganti path import. Tambahan: flag `error` / `rateLimited` di hasil.

export async function searchKomikServer(keyword) {
  try {
    const cleanKeyword = (keyword || "").trim();
    if (!cleanKeyword) return { data: [], total: 0 };

    if (!checkRateLimit("komik_search", 18, 60 * 1000)) {
      return { data: [], total: 0, rateLimited: true };
    }

    const result = await KomikClient.search(cleanKeyword, 1);
    if (!result || !result.data) return { data: [], total: 0 };

    return {
      data: result.data,
      total: result.pagination?.total_record || result.data.length || 0,
    };
  } catch (error) {
    console.error("Search Action Error:", error);
    return {
      data: [],
      total: 0,
      error: true,
      rateLimited: Boolean(error?.rateLimited || error?.status === 429),
    };
  }
}

// Infinite scroll chapter komik
export async function getMoreKomikChapters(mangaId, page = 2) {
  try {
    if (!mangaId || page < 2) return { chapters: [], pagination: null };

    if (!checkRateLimit("komik_ch_scroll", 15, 60 * 1000)) {
      return { chapters: [], pagination: null, rateLimited: true };
    }

    return await KomikClient.getChaptersPage(mangaId, page);
  } catch (error) {
    console.error("Gagal memuat halaman chapter berikutnya:", error);
    return {
      chapters: [],
      pagination: null,
      error: true,
      rateLimited: Boolean(error?.rateLimited || error?.status === 429),
    };
  }
}
