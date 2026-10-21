"use server";

import { KomikProvider } from "@/services/komikApi";
import { checkRateLimit } from "@/services/core/cache";
import { headers } from "next/headers";

export async function searchKomikServer(keyword) {
  try {
    const cleanKeyword = (keyword || "").trim();
    if (!cleanKeyword) return { data: [], total: 0 };

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "global-ip";

    if (!checkRateLimit(`komik_search_${ip}`, 18, 60 * 1000)) {
      return { data: [], total: 0 };
    }

    const result = await KomikProvider.search(cleanKeyword, 1);

    if (!result || !result.data) {
      return { data: [], total: 0 };
    }

    const totalRecord =
      result.pagination?.total_record || result.data.length || 0;

    return {
      data: result.data,
      total: totalRecord,
    };
  } catch (error) {
    console.error("Search Action Error:", error);
    return { data: [], total: 0 };
  }
}

// Server Action khusus Infinite Scroll Chapter Komik
export async function getMoreKomikChapters(mangaId, page = 2) {
  try {
    if (!mangaId || page < 2) return { chapters: [], pagination: null };

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "global-ip";

    if (!checkRateLimit(`komik_ch_scroll_${ip}`, 15, 60 * 1000)) {
      return {
        chapters: [],
        pagination: null,
        rateLimited: true,
      };
    }

    return await KomikProvider.getChaptersPage(mangaId, page);
  } catch (error) {
    console.error("Gagal memuat halaman chapter berikutnya:", error);
    return { chapters: [], pagination: null };
  }
}
