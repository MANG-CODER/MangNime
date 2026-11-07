"use client";

// Fetcher khusus browser: request keluar dari IP USER, bukan IP server Vercel.
//  - cache 2 lapis: memory (per tab) + localStorage (antar kunjungan)
//  - dedupe request identik yang lagi jalan
//  - stale-while-error: kalau upstream gagal, pakai data lama (walau expired)
//  - RATE LIMIT TERPISAH per endpoint: anime dan komik masing-masing maks 40 request/menit
//    (upstream membatasi 45/menit per endpoint per IP). Sliding window di localStorage per bucket,
//    jadi dibagi antar TAB. Kalau jatah habis, request ANTRI (maks 15 detik), bukan langsung gagal.
//    Cache hit nggak makan jatah; yang dihitung cuma request jaringan sungguhan (termasuk retry).
//  - cooldown 60 detik PER endpoint setelah upstream balas 429, supaya user nggak makin di-throttle
//  - getRateLimitUsage()/subscribeRateLimit() dipakai Navbar buat nampilin pemakaian jatah
//  - nggak kirim header custom -> "simple request", nggak kena preflight CORS
//
// Module ini sengaja "use client": kalau nyasar dipanggil dari server component,
// Next akan error, bukan diam-diam nembak dari IP server.

import { getTTLSeconds } from "./ttl";

const LS_PREFIX = "cf:";
const MEM_MAX = 300;
const COOLDOWN_MS = 60_000;

const mem = new Map(); // url -> { data, exp }
const inflight = new Map(); // url -> Promise
const cooldownUntil = { anime: 0, komik: 0 };

// ---------- localStorage: format "<exp>|<json>" supaya exp bisa dibaca tanpa parse JSON ----------

function lsRead(url) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + url);
    if (!raw) return null;
    const i = raw.indexOf("|");
    return { exp: Number(raw.slice(0, i)), data: JSON.parse(raw.slice(i + 1)) };
  } catch {
    return null;
  }
}

function lsPrune() {
  try {
    const now = Date.now();
    const alive = [];
    let removed = 0;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(LS_PREFIX)) continue;
      const raw = localStorage.getItem(k) || "";
      const exp = Number(raw.slice(0, raw.indexOf("|")));
      if (!(exp > now)) {
        localStorage.removeItem(k);
        removed++;
      } else {
        alive.push([k, exp]);
      }
    }
    // nggak ada yang expired tapi tetap penuh -> buang 25% yang paling cepat habis
    if (removed === 0) {
      alive.sort((a, b) => a[1] - b[1]);
      alive
        .slice(0, Math.ceil(alive.length * 0.25))
        .forEach(([k]) => localStorage.removeItem(k));
    }
  } catch {
    // abaikan
  }
}

function lsWrite(url, entry) {
  const value = `${entry.exp}|${JSON.stringify(entry.data)}`;
  try {
    localStorage.setItem(LS_PREFIX + url, value);
    return;
  } catch {
    // kemungkinan quota penuh
  }
  lsPrune();
  try {
    localStorage.setItem(LS_PREFIX + url, value);
  } catch {
    // tetap gagal (mode private, dll) -> cukup pakai memory
  }
}

// ---------- cache ----------

function readEntry(url) {
  const m = mem.get(url);
  if (m) return m;
  const l = lsRead(url);
  if (l) memSet(url, l);
  return l;
}

function memSet(url, entry) {
  mem.delete(url);
  mem.set(url, entry);
  if (mem.size > MEM_MAX) mem.delete(mem.keys().next().value);
}

// ---------- rate limiter: TERPISAH per endpoint (anime / komik), sliding window ----------

// Upstream: 45 req/menit PER ENDPOINT per IP (anime dan komik masing-masing sendiri).
// Sengaja dipasang 40 sebagai margin, karena (1) hitungan antar tab bisa meleset sedikit,
// (2) IP bisa dipakai bareng orang lain (CGNAT operator seluler) yang nggak keliatan dari sini.
const RL = { limit: 40, warnAt: 30, windowMs: 60_000, maxWaitMs: 15_000 };
const BUCKETS = ["anime", "komik"];
const rlKey = (bucket) => `ms:rl:${bucket}`;
const rlMem = { anime: [], komik: [] };
const listeners = new Set();
let storageHooked = false;

export function configureRateLimit(opts = {}) {
  Object.assign(RL, opts);
  notify();
}

// /comic/... = komik, selain itu (/anime/...) = anime
export function bucketOf(url) {
  try {
    return new URL(url).pathname.startsWith("/comic") ? "komik" : "anime";
  } catch {
    return "anime";
  }
}

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // abaikan
    }
  });
}

// Dipakai hook useRateLimitUsage. Mengembalikan fungsi unsubscribe.
export function subscribeRateLimit(fn) {
  listeners.add(fn);
  if (
    !storageHooked &&
    typeof window !== "undefined" &&
    window.addEventListener
  ) {
    storageHooked = true;
    // tab lain menulis hitungan ke localStorage -> tab ini ikut diperbarui
    window.addEventListener("storage", (e) => {
      if (!e.key || e.key.startsWith("ms:rl:")) notify();
    });
  }
  return () => listeners.delete(fn);
}

function rlRead(bucket, now) {
  let list = rlMem[bucket];
  try {
    const raw = localStorage.getItem(rlKey(bucket));
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) list = parsed;
  } catch {
    // localStorage nggak bisa dipakai -> pakai hitungan di memory
  }
  return list.filter(
    (t) => typeof t === "number" && t <= now + 1000 && now - t < RL.windowMs,
  );
}

function rlWrite(bucket, list) {
  rlMem[bucket] = list;
  try {
    localStorage.setItem(rlKey(bucket), JSON.stringify(list));
  } catch {
    // abaikan
  }
  notify();
}

function setCooldown(bucket) {
  cooldownUntil[bucket] = Date.now() + COOLDOWN_MS;
  notify();
}

/**
 * Pemakaian jatah saat ini, per endpoint. Cuma menghitung request dari browser INI
 * (semua tab); request orang lain di IP yang sama nggak keliatan dari sini.
 *  used        jumlah request jaringan dalam window terakhir
 *  nextSlotMs  sisa waktu sampai 1 slot kosong (request tertua kedaluwarsa)
 *  clearInMs   sisa waktu sampai hitungan kembali 0 (kalau nggak ada request baru)
 *  cooldownMs  sisa waktu cooldown setelah upstream balas 429
 *  warnAt      ambang peringatan "rehat sejenak" (default 30)
 *  warn        true kalau used >= warnAt
 *  calmInMs    sisa waktu sampai used turun di bawah warnAt (0 kalau belum di ambang)
 */
export function getRateLimitUsage() {
  const now = Date.now();
  const out = {};
  for (const bucket of BUCKETS) {
    const list = rlRead(bucket, now);
    const oldest = list.length ? Math.min(...list) : null;
    const newest = list.length ? Math.max(...list) : null;
    const sorted = [...list].sort((a, b) => a - b);
    const warn = list.length >= RL.warnAt;
    out[bucket] = {
      used: list.length,
      limit: RL.limit,
      windowMs: RL.windowMs,
      limited: list.length >= RL.limit,
      warnAt: RL.warnAt,
      warn,
      // setelah (n - warnAt + 1) request tertua kedaluwarsa, sisanya < warnAt
      calmInMs: warn
        ? Math.max(0, sorted[list.length - RL.warnAt] + RL.windowMs - now)
        : 0,
      nextSlotMs: oldest == null ? 0 : Math.max(0, oldest + RL.windowMs - now),
      clearInMs: newest == null ? 0 : Math.max(0, newest + RL.windowMs - now),
      cooldownMs: Math.max(0, cooldownUntil[bucket] - now),
    };
  }
  return out;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Ambil 1 slot request di bucket tertentu. Baca+tulis dilakukan tanpa await
// di antaranya, jadi atomik di dalam satu tab.
async function acquireSlot(bucket) {
  const startedAt = Date.now();
  for (;;) {
    const now = Date.now();
    const list = rlRead(bucket, now);
    if (list.length < RL.limit) {
      list.push(now);
      rlWrite(bucket, list);
      return;
    }
    const wait = Math.min(...list) + RL.windowMs - now + 50;
    if (now - startedAt + wait > RL.maxWaitMs) {
      const err = new Error("Batas request tercapai, coba lagi sebentar lagi");
      err.status = 429;
      err.rateLimited = true;
      err.retryAfterMs = wait;
      err.bucket = bucket;
      err.noRetry = true;
      throw err;
    }
    await sleep(wait);
  }
}

// ---------- request ----------

async function request(url, bucket, timeout, retries) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    await acquireSlot(bucket); // antri dulu kalau jatah menit ini habis
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.status = res.status;
        if (res.status === 429) {
          setCooldown(bucket);
          err.rateLimited = true;
          err.retryAfterMs = COOLDOWN_MS;
          err.bucket = bucket;
        }
        if (res.status < 500) err.noRetry = true; // 4xx nggak ada gunanya diulang
        throw err;
      }
      const data = await res.json();
      if (data == null) {
        const err = new Error("Respons kosong");
        err.noRetry = true;
        throw err;
      }
      return data;
    } catch (err) {
      lastErr = err;
      if (err.noRetry || attempt === retries) break;
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

async function load(url, ttlSec, timeout, retries) {
  const bucket = bucketOf(url);
  try {
    const cooldownLeft = cooldownUntil[bucket] - Date.now();
    if (cooldownLeft > 0) {
      const err = new Error("Terlalu banyak request, coba lagi sebentar lagi");
      err.status = 429;
      err.rateLimited = true;
      err.retryAfterMs = cooldownLeft;
      err.bucket = bucket;
      throw err;
    }
    const data = await request(url, bucket, timeout, retries);
    const entry = { data, exp: Date.now() + ttlSec * 1000 };
    memSet(url, entry);
    lsWrite(url, entry);
    return data;
  } catch (err) {
    const stale = readEntry(url); // stale-while-error
    if (stale) return stale.data;
    throw err;
  }
}

/**
 * @param {string} url  URL absolut upstream
 * @param {{ttl?: number, timeout?: number, retries?: number, force?: boolean}} opts  ttl dalam detik
 */
export function clientFetch(
  url,
  { ttl, timeout = 8000, retries = 1, force = false } = {},
) {
  const hit = force ? null : readEntry(url);
  if (hit && hit.exp > Date.now()) return Promise.resolve(hit.data);

  if (inflight.has(url)) return inflight.get(url);

  const p = load(url, ttl ?? getTTLSeconds(url), timeout, retries);
  inflight.set(url, p);
  p.finally(() => inflight.delete(url)).catch(() => {});
  return p;
}

// Buat debugging / tombol "bersihkan cache" di halaman profile.
export function clearUpstreamCache() {
  mem.clear();
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS_PREFIX)) localStorage.removeItem(k);
    }
  } catch {
    // abaikan
  }
}
