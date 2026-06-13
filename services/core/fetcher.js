const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cache = new Map();

const CACHE_TTL_MAP = {
  "/home": 5 * 60 * 1000,
  "/ongoing": 10 * 60 * 1000,
  "/completed": 30 * 60 * 1000,
  "/popular": 15 * 60 * 1000,
  "/schedule": 60 * 60 * 1000,
  "/genres": 24 * 60 * 60 * 1000,
  "/genre": 24 * 60 * 60 * 1000,
  default: 60 * 1000,
};

const ENDPOINT_FALLBACK = {
  "/alqanime/home": "/home",
  "/alqanime/ongoing": "/ongoing-anime",
  "/alqanime/completed": "/complete-anime",
  "/alqanime/search/": "/search/",
  "/alqanime/detail/": "/anime/",
  "/alqanime/episode/": "/episode/",
  "/alqanime/schedule": "/schedule",
  "/alqanime/genres": "/genre",
  "/alqanime/genre/": "/genre/",
  "/alqanime/popular": "/ongoing-anime",
  "/alqanime/movie": "/complete-anime",
  "/alqanime/list": "/complete-anime",
  "/alqanime/season/": null,
};

function getTTL(url) {
  const matched = Object.keys(CACHE_TTL_MAP).find((k) => url.includes(k));
  return matched ? CACHE_TTL_MAP[matched] : CACHE_TTL_MAP["default"];
}

function getCached(key) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.timestamp < getTTL(key)) return hit.data;
  return null;
}

// Return cache lama meski expired — daripada kosong
function getStaleCache(key) {
  const hit = cache.get(key);
  if (hit) return hit.data;
  return null;
}

function buildFallbackUrl(originalUrl, baseUrl) {
  try {
    const parsed = new URL(originalUrl);
    const fullPath = parsed.pathname;
    const search = parsed.search;

    const alqPrefix = Object.keys(ENDPOINT_FALLBACK).find((prefix) =>
      fullPath.includes(prefix),
    );

    if (!alqPrefix) return null;

    const fallbackSuffix = ENDPOINT_FALLBACK[alqPrefix];
    if (fallbackSuffix === null) return null;

    const afterPrefix = fullPath.split(alqPrefix)[1] || "";
    return `${baseUrl}${fallbackSuffix}${afterPrefix}${search}`;
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function coreFetcher(url, options = {}) {
  const retries = options.retries || 3;
  const timeoutMs = options.timeout || 5000;
  const useCache = options.cache !== false;

  // Cek cache fresh
  if (useCache) {
    const cached = getCached(url);
    if (cached) {
      console.log(`[Cache HIT] ${url}`);
      return cached;
    }
  }

  // Tentukan fallback URL
  let fallbackUrl = null;
  try {
    const fullPath = new URL(url).pathname;
    const alqPrefix = Object.keys(ENDPOINT_FALLBACK).find((prefix) =>
      fullPath.includes(prefix),
    );
    if (alqPrefix) {
      const baseUrl = url.split("/alqanime/")[0];
      fallbackUrl = buildFallbackUrl(url, baseUrl);
    }
  } catch {}

  // Retry loop — primary source
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetchWithTimeout(url, options, timeoutMs);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (useCache) cache.set(url, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      const isTimeout = err.name === "AbortError";
      console.warn(
        `[Fetcher] ${isTimeout ? "Timeout" : "Error"} attempt ${i}/${retries} — ${url}: ${err.message}`,
      );

      if (i === retries) {
        // Coba fallback otakudesu
        if (fallbackUrl) {
          console.warn(`[Fetcher] Fallback ke: ${fallbackUrl}`);
          try {
            const fallbackRes = await fetchWithTimeout(
              fallbackUrl,
              options,
              timeoutMs,
            );
            if (!fallbackRes.ok)
              throw new Error(`Fallback HTTP ${fallbackRes.status}`);

            const fallbackData = await fallbackRes.json();
            if (useCache)
              cache.set(url, { data: fallbackData, timestamp: Date.now() });
            return fallbackData;
          } catch (fallbackErr) {
            console.warn(`[Fetcher] Fallback gagal: ${fallbackErr.message}`);
          }
        }

        // Semua gagal — return stale cache kalau ada
        if (useCache) {
          const stale = getStaleCache(url);
          if (stale) {
            console.warn(`[Fetcher] Return stale cache untuk: ${url}`);
            return stale;
          }
        }

        console.error(`[Fetcher] Semua opsi gagal untuk: ${url}`);
        throw err;
      }

      // Exponential backoff + jitter
      const backoff = Math.min(1000 * 2 ** (i - 1), 8000);
      const jitter = Math.random() * 300;
      await delay(backoff + jitter);
    }
  }
}
