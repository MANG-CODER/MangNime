"use server";

import { AnimeProvider } from "./providers";
import {
  getCache,
  getStaleCache,
  setCache,
  checkRateLimit,
  withSingleflight,
} from "./core/cache";
import { headers } from "next/headers";

export async function searchAllAnime(query) {
  const cleanQuery = (query || "").trim().toLowerCase();
  if (!cleanQuery) return [];

  const cacheKey = `search_v4_${cleanQuery}`;
  const cachedData = getCache(cacheKey);
  if (cachedData && cachedData.length > 0) {
    return cachedData;
  }

  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "anonymous";

    if (!checkRateLimit(ip, 20, 60 * 1000)) {
      console.warn(
        `🛑 [Search Rate Limit] IP ${ip} melebihi batas search/menit.`,
      );
      return getStaleCache(cacheKey) || [];
    }
  } catch {}

  return withSingleflight(cacheKey, async () => {
    const otakudesuRes = await AnimeProvider.Otakudesu.search(cleanQuery);
    const results = Array.isArray(otakudesuRes) ? otakudesuRes : [];

    const finalResults = [...results].sort((a, b) => {
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

    if (finalResults.length > 0) {
      setCache(cacheKey, finalResults, 1800);
    }

    return finalResults;
  });
}
