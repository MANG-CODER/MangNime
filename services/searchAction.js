"use server";

import { searchKomik } from "@/services/komikApi";

export async function searchKomikServer(keyword) {
  return await searchKomik(keyword, { cache: "no-store" });
}
