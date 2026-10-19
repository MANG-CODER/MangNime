import {
  acquireUpstreamSlot,
  getCache,
  getStaleCache,
  setCache,
  withSingleflight,
} from "./cache";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* const DENO_PROXY_URL = "https://mgcdanm.vestiapani.deno.net"; */
const DENO_PROXY_URL = "https://mgcanm2.mangpani.deno.net";
const NETLIFY_KOMIK_PROXY_URL = "https://mangnimeprxykmk.netlify.app";

// Durasi TTL dalam satuan DETIK berdasarkan jenis endpoint
const CACHE_TTL_SECONDS_MAP = {
  "/genres": 7 * 24 * 3600, // 7 Hari (Jarang berubah)
  "/genre": 12 * 3600, // 12 Jam
  "/schedule": 6 * 3600, // 6 Jam
  "/batch/": 24 * 3600, // 24 Jam
  "/episode/": 12 * 3600, // 12 Jam
  "/read/": 24 * 3600, // 24 Jam (Gambar chapter komik permanen)
  "/chapter/": 24 * 3600, // 24 Jam
  "/anime/": 2 * 3600, // 2 Jam (Detail anime)
  "/detail/": 2 * 3600, // 2 Jam (Detail komik)
  "/chapters/": 1800, // 30 Menit (Daftar chapter komik)
  "/complete": 2 * 3600, // 2 Jam
  "/popular": 2 * 3600, // 2 Jam
  "/home": 1800, // 30 Menit
  "/ongoing": 1800, // 30 Menit
  "/latest": 1200, // 20 Menit
  "/search": 1800, // 30 Menit
  "/server/": 300, // 5 Menit (Link embed video)
  default: 1800, // 30 Menit
};

function getTTLSeconds(url) {
  const matched = Object.keys(CACHE_TTL_SECONDS_MAP).find((k) =>
    url.includes(k),
  );
  return matched
    ? CACHE_TTL_SECONDS_MAP[matched]
    : CACHE_TTL_SECONDS_MAP.default;
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
  return `${DENO_PROXY_URL}/?url=${encodeURIComponent(targetUrl)}`;
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
];

function getHeaders(url) {
  // Gunakan User-Agent deterministik berdasarkan URL agar Next.js Data Cache tidak menganggapnya request berbeda
  const hash = url.length % USER_AGENTS.length;
  const userAgent = USER_AGENTS[hash];

  return {
    "User-Agent": userAgent,
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    Referer: "https://www.google.com/",
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(url),
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

  // 1. Cek L1 Memory Cache (0ms, 0 Kuota Proxy/Upstream)
  if (useCache) {
    const cached = getCache(url);
    if (cached) {
      return cached;
    }
  }

  // 2. Bungkus dengan Singleflight agar panggilan paralel (mis. generateMetadata + Page) hanya jalan 1x
  return withSingleflight(url, async () => {
    // Cek ulang cache jika baru saja diisi oleh flight sebelumnya
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

    // Cek Governor Kuota Upstream (23 RPM Anime / 18 RPM Komik)
    if (!acquireUpstreamSlot(bucket)) {
      const stale = getStaleCache(url);
      if (stale) return stale;
    }

    const isDev = process.env.NODE_ENV === "development";
    // Di localhost (development), coba Direct Fetch dulu agar hemat kuota Deno Deploy!
    const routeChain =
      isDev && defaultProxy === "deno" ? ["direct", "deno"] : [defaultProxy];

    const maxRetries = options.retries ?? 2;
    const timeoutMs = options.timeout || 5500;

    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const currentProxy =
        routeChain[Math.min(attempt - 1, routeChain.length - 1)];
      const targetFetchUrl = buildProxyUrl(url, currentProxy);

      try {
        const fetchOptions = {
          method: "GET",
          ...(useCache
            ? { next: { revalidate: ttlSeconds } }
            : { cache: "no-store" }),
        };

        const res = await fetchWithTimeout(
          targetFetchUrl,
          fetchOptions,
          timeoutMs,
        );

        if (!res.ok) {
          // JANGAN RETRY kalau kena 429 (Rate Limit) atau 403 (WAF) agar kuota RPM tidak makin jebol!
          if (res.status === 429 || res.status === 403) {
            const stale = getStaleCache(url);
            if (stale) {
              console.warn(
                `♻️ [HTTP ${res.status}] Mengembalikan Stale Cache untuk: ${url}`,
              );
              return stale;
            }
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

        // Jika di localhost direct fetch kena blokir WAF/timeout, langsung pindah ke Deno tanpa jeda
        if (isDev && currentProxy === "direct" && routeChain.includes("deno")) {
          continue;
        }

        if (err.noRetry || attempt === maxRetries) {
          break;
        }

        await delay(600 * attempt);
      }
    }

    // Penyelamat Terakhir: Kembalikan Stale Cache jika semua percobaan gagal
    if (useCache) {
      const stale = getStaleCache(url);
      if (stale) {
        console.warn(`♻️ [FALLBACK STALE] Menggunakan data cache lama: ${url}`);
        return stale;
      }
    }

    if (options.silentFail) return null;
    throw lastError || new Error(`Gagal fetch: ${url}`);
  });
}
