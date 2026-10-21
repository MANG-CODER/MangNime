const globalStore = globalThis.__MANGNIME_CORE_STORE__ || {
  cache: new Map(),
  inFlight: new Map(),
  ipRateLimit: new Map(),
  upstreamBuckets: new Map(),
  mangaSlugRegistry: new Map(),
};

if (!globalThis.__MANGNIME_CORE_STORE__) {
  globalThis.__MANGNIME_CORE_STORE__ = globalStore;
}

const MAX_CACHE_ENTRIES = 1500;
const RATE_LIMIT_WINDOW = 60 * 1000;
const DEFAULT_MAX_REQUESTS = 30;

// Batas aman di bawah limit Sanka (Anime: 25 RPM -> 23, Komik: 20 RPM -> 18)
const UPSTREAM_LIMITS = {
  anime: 23,
  komik: 18,
  komiku: 20,
};

export function checkRateLimit(
  ip = "global",
  maxRequests = DEFAULT_MAX_REQUESTS,
  windowMs = RATE_LIMIT_WINDOW,
) {
  const now = Date.now();
  const record = globalStore.ipRateLimit.get(ip) || {
    count: 0,
    startTime: now,
  };

  if (now - record.startTime > windowMs) {
    record.count = 1;
    record.startTime = now;
  } else {
    record.count++;
  }

  globalStore.ipRateLimit.set(ip, record);
  return record.count <= maxRequests;
}

export function acquireUpstreamSlot(bucket = "anime") {
  const now = Date.now();
  const limit = UPSTREAM_LIMITS[bucket] || 20;
  const record = globalStore.upstreamBuckets.get(bucket) || {
    count: 0,
    startTime: now,
  };

  if (now - record.startTime >= 60 * 1000) {
    record.count = 1;
    record.startTime = now;
    globalStore.upstreamBuckets.set(bucket, record);
    return true;
  }

  if (record.count >= limit) {
    console.warn(
      `🛑 [UPSTREAM GOVERNOR] Kuota ${bucket.toUpperCase()} (${limit}/menit) penuh! Mengalihkan ke Stale Cache.`,
    );
    return false;
  }

  record.count++;
  globalStore.upstreamBuckets.set(bucket, record);
  return true;
}

export function getCache(key) {
  const item = globalStore.cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) return null;
  return item.value;
}

export function getStaleCache(key) {
  const item = globalStore.cache.get(key);
  return item ? item.value : null;
}

export function setCache(key, value, ttlSeconds = 3600) {
  if (globalStore.cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = globalStore.cache.keys().next().value;
    if (oldestKey) globalStore.cache.delete(oldestKey);
  }

  const now = Date.now();
  globalStore.cache.set(key, {
    value,
    timestamp: now,
    expiry: now + ttlSeconds * 1000,
  });
}

export async function withSingleflight(key, asyncFn) {
  if (globalStore.inFlight.has(key)) {
    return globalStore.inFlight.get(key);
  }

  const promise = (async () => {
    try {
      return await asyncFn();
    } finally {
      globalStore.inFlight.delete(key);
    }
  })();

  globalStore.inFlight.set(key, promise);
  return promise;
}

export function registerMangaSlug(slug, mangaId) {
  if (!slug || !mangaId) return;
  globalStore.mangaSlugRegistry.set(slug.toLowerCase().trim(), mangaId);
}

export function getMangaUuid(slug) {
  if (!slug) return null;
  return globalStore.mangaSlugRegistry.get(slug.toLowerCase().trim()) || null;
}
