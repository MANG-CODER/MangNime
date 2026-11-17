"use client";

import { getTTLSeconds } from "./ttl";

// Naikkan versi prefix (cf:v2:) agar saat deploy baru, cache lama otomatis diabaikan
const LS_PREFIX = "cf:v2:";
const OLD_LS_PREFIX = "cf:";
const MEM_MAX = 300;
const COOLDOWN_MS = 60_000;

const mem = new Map(); // url -> { data, exp }
const inflight = new Map(); // url -> Promise
const cooldownUntil = { anime: 0, komik: 0 };

// Cek apakah payload dari API sebenarnya kosong (misal saat upstream maintenance)
function isEmptyPayload(res) {
  if (!res || typeof res !== "object") return true;
  const d = res.data;
  if (d == null) return false; // beberapa endpoint mungkin tidak pakai wrapper .data
  if (Array.isArray(d)) return d.length === 0;
  if (typeof d === "object") {
    // Cek khusus struktur /home (anime maupun komik)
    const keys = ["latest", "popular", "ongoing", "completed", "recommended"];
    const presentKeys = keys.filter((k) => k in d);
    if (presentKeys.length > 0) {
      return presentKeys.every(
        (k) => !Array.isArray(d[k]) || d[k].length === 0,
      );
    }
  }
  return false;
}

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
      if (!k) continue;
      // Bersihkan sekalian cache versi lama ("cf:" tanpa "v2:")
      if (k.startsWith(OLD_LS_PREFIX) && !k.startsWith(LS_PREFIX)) {
        localStorage.removeItem(k);
        removed++;
        continue;
      }
      if (!k.startsWith(LS_PREFIX)) continue;
      const raw = localStorage.getItem(k) || "";
      const exp = Number(raw.slice(0, raw.indexOf("|")));
      if (!(exp > now)) {
        localStorage.removeItem(k);
        removed++;
      } else {
        alive.push([k, exp]);
      }
    }
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
    // tetap gagal -> cukup pakai memory
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

export function subscribeRateLimit(fn) {
  listeners.add(fn);
  if (
    !storageHooked &&
    typeof window !== "undefined" &&
    window.addEventListener
  ) {
    storageHooked = true;
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
    // pakai hitungan di memory
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
    await acquireSlot(bucket);
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
        if (res.status < 500) err.noRetry = true;
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

    // Hanya simpan ke cache jika payload tidak kosong
    if (!isEmptyPayload(data)) {
      const entry = { data, exp: Date.now() + ttlSec * 1000 };
      memSet(url, entry);
      lsWrite(url, entry);
    }
    return data;
  } catch (err) {
    const stale = readEntry(url);
    if (stale && !isEmptyPayload(stale.data)) return stale.data;
    throw err;
  }
}

export function clientFetch(
  url,
  { ttl, timeout = 10000, retries = 1, force = false } = {},
) {
  const hit = force ? null : readEntry(url);
  if (hit && hit.exp > Date.now() && !isEmptyPayload(hit.data)) {
    return Promise.resolve(hit.data);
  }

  if (inflight.has(url)) return inflight.get(url);

  const p = load(url, ttl ?? getTTLSeconds(url), timeout, retries);
  inflight.set(url, p);
  p.finally(() => inflight.delete(url)).catch(() => {});
  return p;
}

export function clearUpstreamCache() {
  mem.clear();
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith(LS_PREFIX) || k.startsWith(OLD_LS_PREFIX))) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // abaikan
  }
}
