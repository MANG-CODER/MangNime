"use server";

import { searchKomik } from "@/services/komikApi";

export async function searchKomikServer(keyword) {
  try {
    if (!keyword) return { data: [], total: 0 };

    const result = await searchKomik(keyword, 30, {
      next: { revalidate: 43200 },
    });

    return result || { data: [], total: 0 };
  } catch (error) {
    return { data: [], total: 0 };
  }
}
