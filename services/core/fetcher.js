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
    "https://mgcanm2.mangpani.deno.net",
  process.env.DENO_PROXY_BACKUP || "",
].filter(Boolean);

const NETLIFY_KOMIK_PROXY_URL = "https://mangnimeprxykmk.netlify.app";

// Durasi TTL dalam satuan DETIK (Sudah diperpanjang agar hemat Memory Time Deno)
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

// Urutkan key dari yang paling panjang/spesifik agar "/anime/" tidak menimpa "/anime/ongoing-anime"
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

function buildProxyUrl(targetUrl, proxyType = "deno") {
  if (proxyType === "direct") return targetUrl;
  if (proxyType === "netlify") {
    return `${NETLIFY_KOMIK_PROXY_URL}?url=${encodeURIComponent(targetUrl)}`;
  }
  if (proxyType === "deno_backup" && DENO_PROXY_LIST[1]) {
    return `${DENO_PROXY_LIST[1]}/?url=${encodeURIComponent(targetUrl)}`;
  }
  return `${DENO_PROXY_LIST[0]}/?url=${encodeURIComponent(targetUrl)}`;
}

// Header statis murni agar Next.js Data Cache (force-cache) berjalan lintas instance Vercel
const STATIC_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
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
  const useCache =
    options.cache !== false &&
    options.cache !== "no-store" &&
    !url.includes("/server/");
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
          : "deno");

    if (!acquireUpstreamSlot(bucket)) {
      const stale = getStaleCache(url);
      if (stale) return stale;
    }

    const isDev = process.env.NODE_ENV === "development";
    const hasBackupDeno = Boolean(DENO_PROXY_LIST[1]);

    const routeChain =
      isDev && defaultProxy === "deno"
        ? ["direct", "deno", ...(hasBackupDeno ? ["deno_backup"] : [])]
        : defaultProxy === "deno" && hasBackupDeno
          ? ["deno", "deno_backup"]
          : [defaultProxy];

    const maxRetries = options.retries ?? routeChain.length;
    const timeoutMs = options.timeout || 4500;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const currentProxy =
        routeChain[Math.min(attempt - 1, routeChain.length - 1)];
      const targetFetchUrl = buildProxyUrl(url, currentProxy);

      try {
        console.log("[CORE FETCH]", {
          via: currentProxy,
          url,
          ttlSeconds,
          time: new Date().toISOString(),
        });

        const fetchOptions = {
          method: "GET",
          ...(useCache
            ? {
                cache: "force-cache",
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
            const fatalErr = new Error(
              `[HTTP ${res.status}] Upstream menolak request`,
            );
            fatalErr.noRetry = true;
            throw fatalErr;
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

        if (isDev && currentProxy === "direct" && routeChain.includes("deno")) {
          continue;
        }

        if (err.noRetry || attempt === maxRetries) {
          break;
        }

        await delay(500 * attempt);
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
