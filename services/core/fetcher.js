const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const cache = new Map();

const DENO_PROXY_URL = "https://mgcdanm.vestiapani.deno.net";

const CACHE_TTL_MAP = {
  "/home": 60 * 60 * 1000, // 1 Jam
  "/ongoing": 60 * 60 * 1000, // 1 Jam
  "/completed": 2 * 60 * 60 * 1000, // 2 Jam
  "/popular": 2 * 60 * 60 * 1000, // 2 Jam
  "/schedule": 6 * 60 * 60 * 1000, // 6 Jam
  "/genres": 24 * 60 * 60 * 1000, // 24 Jam
  "/genre": 24 * 60 * 60 * 1000, // 24 Jam
  default: 30 * 60 * 1000, // 30 Menit
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

function getStaleCache(key) {
  const hit = cache.get(key);
  if (hit) return hit.data;
  return null;
}

function buildProxyUrl(targetUrl) {
  return `${DENO_PROXY_URL}/?url=${encodeURIComponent(targetUrl)}`;
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
];

function getRandomHeaders() {
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  let platform = '"Windows"';
  if (userAgent.includes("Mac OS")) platform = '"macOS"';

  return {
    "User-Agent": userAgent,
    Accept: "application/json, text/plain, text/html, */*",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "max-age=0",
    "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": platform,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    Referer:
      Math.random() > 0.5
        ? "https://www.google.com/"
        : "https://duckduckgo.com/",
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const fakeHeaders = {
    ...getRandomHeaders(),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers: fakeHeaders,
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
  const retries = options.retries || 3;
  const timeoutMs = options.timeout || 5000;
  const useCache = options.cache !== false;
  const isBuilding = process.env.NEXT_PHASE === "phase-production-build";

  if (useCache) {
    const cached = getCached(url);
    if (cached) {
      console.log(`[Cache HIT] ${url}`);
      return cached;
    }
  }

  for (let i = 1; i <= retries; i++) {
    try {
      const fetchOptions = {
        ...options,
        ...(isBuilding ? {} : { cache: "no-store" }),
      };

      const proxyUrl = buildProxyUrl(url);
      console.log(`[Fetcher] Attempt ${i}/${retries} via Deno: ${proxyUrl}`);
      const res = await fetchWithTimeout(proxyUrl, fetchOptions, timeoutMs);

      if (!res.ok) {
        if (res.status === 403)
          throw new Error(
            "[BLOKIR WAF] HTTP 403 - Deno Proxy diblokir upstream!",
          );
        if (res.status === 429)
          throw new Error(
            "[RATE LIMIT] HTTP 429 - Terlalu banyak request ke upstream!",
          );
        if (res.status >= 500)
          throw new Error(
            `[UPSTREAM DOWN] HTTP ${res.status} - Server tujuan error!`,
          );
        throw new Error(`[HTTP ERROR] ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error(
          "[JEBAKAN HTML] Terkena Cloudflare Captcha dari upstream!",
        );
      }

      const data = await res.json();

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error("[KOSONG] Upstream mengembalikan data JSON kosong.");
      }

      if (useCache) cache.set(url, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      const isTimeout = err.name === "AbortError";
      const errorReason = isTimeout
        ? "[TIMEOUT] Request lewat dari 5 detik"
        : err.message;

      console.error(
        `❌ [Fetch Gagal] Attempt ${i}/${retries} | Target: ${url} | Reason: ${errorReason}`,
      );

      if (i === retries) {
        // PENYELAMAT UTAMA: Kembalikan stale cache kalau semua retry gagal
        if (useCache) {
          const stale = getStaleCache(url);
          if (stale) {
            console.warn(
              `[Fetcher] Return stale cache untuk: ${url} (Bypass Error)`,
            );
            return stale;
          }
        }

        console.error(`[Fetcher] Semua opsi gagal untuk: ${url}`);
        throw err;
      }

      // Jeda sebelum retry selanjutnya (Exponential Backoff)
      const backoff = Math.min(1000 * 2 ** (i - 1), 8000);
      const jitter = Math.random() * 300;
      await delay(backoff + jitter);
    }
  }
}
