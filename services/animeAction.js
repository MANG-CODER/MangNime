"use server";

import { AnimeProvider } from "./providers";
import { getCache, setCache, checkRateLimit } from "./core/cache";
import { headers } from "next/headers";
import { mergeAnimeLists, mergeSearchAnimeLists } from "@/utils/mergeAnime";

export async function searchAllAnime(query) {
  if (!query) return [];

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "anonymous";

  try {
    if (!checkRateLimit(ip)) {
      console.warn("Rate Limit tercapai:", ip);
    }
  } catch (e) {}

  const cacheKey = `search_v3_${query.toLowerCase()}`;
  const cachedData = getCache(cacheKey);

  if (cachedData && cachedData.length > 0) {
    return cachedData;
  }

  const [otakudesuRes, alqanimeRes] = await Promise.allSettled([
    AnimeProvider.Otakudesu.search(query),
    AnimeProvider.Alqanime.search(query),
  ]);

  const otakuData =
    otakudesuRes.status === "fulfilled"
      ? Array.isArray(otakudesuRes.value)
        ? otakudesuRes.value
        : []
      : [];

  const alqaData =
    alqanimeRes.status === "fulfilled"
      ? Array.isArray(alqanimeRes.value)
        ? alqanimeRes.value
        : []
      : [];

let finalResults = mergeSearchAnimeLists(otakuData, alqaData);

  finalResults.sort((a, b) => {
    const titleA = (a.title || "").toLowerCase();
    const titleB = (b.title || "").toLowerCase();
    const q = query.toLowerCase();

    const aStarts = titleA.startsWith(q) ? 1 : 0;
    const bStarts = titleB.startsWith(q) ? 1 : 0;

    if (aStarts !== bStarts) {
      return bStarts - aStarts;
    }

    const aContains = titleA.includes(q) ? 1 : 0;
    const bContains = titleB.includes(q) ? 1 : 0;

    if (aContains !== bContains) {
      return bContains - aContains;
    }

    return titleA.length - titleB.length;
  });

  console.log(
    `[Search: ${query}] Otakudesu: ${otakuData.length} hasil | Alqanime: ${alqaData.length} hasil | Final: ${finalResults.length} hasil`,
  );

  if (finalResults.length > 0) {
    setCache(cacheKey, finalResults, 1800);
  }

  return finalResults;
}
