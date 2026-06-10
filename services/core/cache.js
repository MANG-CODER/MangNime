const cache = new Map();
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 30;

export function checkRateLimit(ip) {
  const now = Date.now();
  const userRecord = rateLimit.get(ip) || { count: 0, startTime: now };

  if (now - userRecord.startTime > RATE_LIMIT_WINDOW) {
    userRecord.count = 1;
    userRecord.startTime = now;
  } else {
    userRecord.count++;
  }

  rateLimit.set(ip, userRecord);
  return userRecord.count <= MAX_REQUESTS;
}

export function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

export function setCache(key, value, ttlSeconds = 3600) {
  const expiry = Date.now() + ttlSeconds * 1000;
  cache.set(key, { value, expiry });
}
