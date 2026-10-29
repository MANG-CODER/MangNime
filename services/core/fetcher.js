import {
  acquireUpstreamSlot,
  getCache,
  getStaleCache,
  setCache,
  withSingleflight,
} from "./cache";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DENO_PROXY_LIST = [
  process.env.DENO_PROXY_PRIMARY ||
    process.env.DENO_PROXY_URL ||
    /* "https://mgcanm2.mangpani.deno.net" */"",
  process.env.DENO_PROXY_BACKUP || "",
].filter(Boolean);

// Gunakan site Netlify khusus anime jika ada di ENV, atau fallback ke Netlify komik karena domain upstream-nya sama (sankavollerei.web.id)
const NETLIFY_KOMIK_PROXY_URL =
  process.env.NETLIFY_KOMIK_PROXY_URL || "https://mangnimeprxykmk.netlify.app";
const NETLIFY_ANIME_PROXY_URL =
  process.env.NETLIFY_ANIME_PROXY_URL ||
  "https://stately-mooncake-dec334.netlify.app";

// Durasi TTL dalam satuan DETIK
const CACHE_TTL_SECONDS_MAP = {
  "/anime/ongoing-anime": 2 * 3600, // 2 Jam
  "/anime/complete-anime": 12 * 3600, // 12 Jam
  "/anime/schedule": 24 * 3600, // 24 Jam
  "/anime/genre/": 6 * 3600, // 6 Jam
  "/anime/genre": 7 * 24 * 3600, // 7 Hari
  "/anime/home": 2 * 3600, // 2 Jam
  "/anime/search/": 6 * 3600, // 6 Jam
  "/anime/episode/": 7 * 24 * 3600, // 7 Hari
  "/anime/batch/": 7 * 24 * 3600, // 7 Hari
  "/anime/server/": 900, // 15 Menit
  "/anime/anime/": 12 * 3600, // 12 Jam
  "/genres": 7 * 24 * 3600, // 7 Hari
  "/advanced-search": 2 * 3600, // 2 Jam
  "/chapters/": 2 * 3600, // 2 Jam
  "/chapter/": 7 * 24 * 3600, // 7 Hari
  "/detail/": 12 * 3600, // 12 Jam
  "/read/": 7 * 24 * 3600, // 7 Hari
  "/popular": 6 * 3600, // 6 Jam
  "/latest": 3600, // 1 Jam
  "/search": 6 * 3600, // 6 Jam
  "/home": 2 * 3600, // 2 Jam
  default: 2 * 3600, // 2 Jam
};

const SORTED_TTL_KEYS = Object.keys(CACHE_TTL_SECONDS_MAP)
  .filter((k) => k !== "default")
  .sort((a, b) => b.length - a.length);

function getTTLSeconds(url) {
  try {
    const parsed = new URL(url);
    const fullPath = `${parsed.pathname}${parsed.search}`;
    const matched = SORTED_TTL_KEYS.find((k) => fullPath.includes(k));
    return matched
      ? CACHE_TTL_SECONDS_MAP[matched]
      : CACHE_TTL_SECONDS_MAP.default;
  } catch {
    return CACHE_TTL_SECONDS_MAP.default;
  }
}

function detectBucket(url) {
  if (url.includes("/comic/shinigami")) return "komik";
  if (url.includes("/comic/")) return "komiku";
  return "anime";
}

function buildProxyUrl(targetUrl, proxyType = "netlify_anime") {
  if (proxyType === "direct") return targetUrl;
  if (proxyType === "netlify") {
    return `${NETLIFY_KOMIK_PROXY_URL}?url=${encodeURIComponent(targetUrl)}`;
  }
  if (proxyType === "netlify_anime") {
    return `${NETLIFY_ANIME_PROXY_URL}?url=${encodeURIComponent(targetUrl)}`;
  }
  if (proxyType === "deno_backup" && DENO_PROXY_LIST[1]) {
    return `${DENO_PROXY_LIST[1]}/?url=${encodeURIComponent(targetUrl)}`;
  }
  return `${DENO_PROXY_LIST[0]}/?url=${encodeURIComponent(targetUrl)}`;
}

const STATIC_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...STATIC_FETCH_HEADERS,
        ...options.headers,
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export async function coreFetcher(url, options = {}) {
  // Hapus !url.includes("/server/") agar TTL 900 detik (15 menit) di CACHE_TTL_SECONDS_MAP berfungsi
  const useCache = options.cache !== false && options.cache !== "no-store";
  const ttlSeconds = options.ttlSeconds || getTTLSeconds(url);

  // 1. Cek L1 Memory Cache
  if (useCache) {
    const cached = getCache(url);
    if (cached) {
      return cached;
    }
  }

  // 2. Singleflight Deduplication
  return withSingleflight(url, async () => {
    if (useCache) {
      const cachedAfterWait = getCache(url);
      if (cachedAfterWait) return cachedAfterWait;
    }

    const bucket = options.bucket || detectBucket(url);
    const defaultProxy =
      options.proxyType ||
      (bucket === "komik"
        ? "netlify"
        : bucket === "komiku"
          ? "direct"
          : "netlify_anime"); // <-- SEKARANG ANIME UTAMA KE NETLIFY

    if (!acquireUpstreamSlot(bucket)) {
      const stale = getStaleCache(url);
      if (stale) return stale;
    }

    const isDev = process.env.NODE_ENV === "development";
    const hasPrimaryDeno = Boolean(DENO_PROXY_LIST[0]);
    const hasBackupDeno = Boolean(DENO_PROXY_LIST[1]);

    // Rantai Rute: Netlify Utama -> Deno Primary (Cadangan 1) -> Deno Backup (Cadangan 2)
    let routeChain = [defaultProxy];
    if (defaultProxy === "netlify_anime") {
      routeChain = [
        ...(isDev ? ["direct"] : []),
        "netlify_anime",
        ...(hasPrimaryDeno ? ["deno"] : []),
        ...(hasBackupDeno ? ["deno_backup"] : []),
      ];
    } else if (defaultProxy === "netlify") {
      routeChain = ["netlify", ...(hasPrimaryDeno ? ["deno"] : [])];
    }

    const maxRetries = options.retries ?? routeChain.length;
    const timeoutMs = options.timeout || 5000;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const currentProxy =
        routeChain[Math.min(attempt - 1, routeChain.length - 1)];
      const targetFetchUrl = buildProxyUrl(url, currentProxy);
      const isDeno = currentProxy.startsWith("deno");

      try {
        console.log("[CORE FETCH]", {
          via: currentProxy,
          url,
          ttlSeconds,
          time: new Date().toISOString(),
        });

        const fetchOptions = {
          method: "GET",
          // Putus keep-alive jika nembak ke Deno agar isolate Deno langsung tidur & hemat Memory Time
          headers: isDeno ? { Connection: "close" } : {},
          ...(useCache
            ? {
                next: { revalidate: ttlSeconds },
              }
            : { cache: "no-store" }),
        };

        const res = await fetchWithTimeout(
          targetFetchUrl,
          fetchOptions,
          timeoutMs,
        );

        if (!res.ok) {
          if (res.status === 429 || res.status === 403) {
            const stale = getStaleCache(url);
            if (stale) return stale;
            // Jika 429/403 di proxy pertama (misal IP Netlify kena limit), izinkan lompat ke fallback Deno
            throw new Error(
              `[HTTP ${res.status}] Upstream menolak request via ${currentProxy}`,
            );
          }
          throw new Error(`[HTTP ERROR] ${res.status}`);
        }

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          throw new Error("[WAF HTML] Terkena halaman proteksi HTML upstream");
        }

        const data = await res.json();

        if (!data || (Array.isArray(data) && data.length === 0)) {
          throw new Error("[EMPTY JSON] Upstream mengembalikan data kosong");
        }

        if (useCache) {
          setCache(url, data, ttlSeconds);
        }

        return data;
      } catch (err) {
        lastError = err;

        if (isDev && currentProxy === "direct" && routeChain.length > 1) {
          continue;
        }

        if (err.noRetry || attempt === maxRetries) {
          break;
        }

        await delay(400 * attempt);
      }
    }

    if (useCache) {
      const stale = getStaleCache(url);
      if (stale) return stale;
    }

    if (options.silentFail) return null;
    throw lastError || new Error(`Gagal fetch: ${url}`);
  });
}
