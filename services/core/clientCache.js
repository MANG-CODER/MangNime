"use client";

// Pengganti core/cache.js untuk browser. API-nya sama, jadi bisa disuntik
// ke createKomikProvider(). Cache hasil "rakitan" cukup di memory; cache respons
// mentah upstream sudah ditangani clientFetcher (localStorage).
// Peta slug -> UUID manga disimpan di localStorage supaya hard-reload nggak
// perlu resolve ulang lewat search.

const store = new Map();
const flights = new Map();

export function getCache(key) {
  const e = store.get(key);
  if (!e) return null;
  if (e.exp <= Date.now()) {
    store.delete(key);
    return null;
  }
  return e.data;
}

export function setCache(key, data, ttlSeconds = 600) {
  store.delete(key);
  store.set(key, { data, exp: Date.now() + ttlSeconds * 1000 });
  if (store.size > 300) store.delete(store.keys().next().value);
}

export function withSingleflight(key, fn) {
  if (flights.has(key)) return flights.get(key);
  const p = Promise.resolve().then(fn);
  flights.set(key, p);
  p.finally(() => flights.delete(key)).catch(() => {});
  return p;
}

// ---------- slug -> UUID ----------

const SLUG_KEY = "ms:slugmap";
const SLUG_MAX = 600;
let slugMap = null;
let flushTimer = null;

function loadSlugs() {
  if (slugMap) return slugMap;
  slugMap = new Map();
  try {
    const raw = localStorage.getItem(SLUG_KEY);
    if (raw) slugMap = new Map(JSON.parse(raw));
  } catch {
    // abaikan
  }
  return slugMap;
}

function scheduleFlush() {
  if (flushTimer || typeof window === "undefined") return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    try {
      localStorage.setItem(SLUG_KEY, JSON.stringify([...slugMap]));
    } catch {
      // abaikan
    }
  }, 500);
}

export function registerMangaSlug(slug, uuid) {
  if (!slug || !uuid) return;
  const map = loadSlugs();
  if (map.get(slug) === uuid) return;
  map.delete(slug);
  map.set(slug, uuid);
  while (map.size > SLUG_MAX) map.delete(map.keys().next().value);
  scheduleFlush();
}

export function getMangaUuid(slug) {
  return loadSlugs().get(slug) || null;
}

// ---------- batas per-fitur (mis. search 20x/menit), per tab ----------
// Beda dengan limiter global di clientFetcher: ini mencegah SATU fitur
// (live search, infinite scroll) menghabiskan jatah 40/menit milik halaman lain.
const rlHits = new Map();

export function checkRateLimit(key, limit, windowMs = 60_000) {
  const now = Date.now();
  const hits = (rlHits.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    rlHits.set(key, hits);
    return false;
  }
  hits.push(now);
  rlHits.set(key, hits);
  return true;
}
