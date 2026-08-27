"use server";
import { KomikProvider } from "@/services/komikApi";

export async function searchKomikServer(keyword) {
  try {
    if (!keyword) return { data: [], total: 0 };

    const result = await KomikProvider.search(keyword, 1);

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
