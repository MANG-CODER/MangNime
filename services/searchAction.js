"use server";

import { searchKomik } from "@/services/komikApi";

export async function searchKomikServer(keyword) {
  try {
    if (!keyword) {
      return { data: [], total: 0 };
    }

    const result = await searchKomik(keyword, { cache: "no-store" });

    return result || { data: [], total: 0 };
  } catch (error) {
    console.error("Error pada searchKomikServer:", error);
    return { data: [], total: 0 };
  }
}
