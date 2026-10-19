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
