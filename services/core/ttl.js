// Durasi TTL dalam DETIK. Dipakai clientFetcher.
// (fetcher.js server boleh import dari sini juga supaya cuma ada satu sumber.)
export const CACHE_TTL_SECONDS_MAP = {
  "/anime/ongoing-anime": 2 * 3600,
  "/anime/complete-anime": 12 * 3600,
  "/anime/schedule": 24 * 3600,
  "/anime/genre/": 6 * 3600,
  "/anime/genre": 7 * 24 * 3600,
  "/anime/home": 2 * 3600,
  "/anime/search/": 6 * 3600,
  "/anime/episode/": 7 * 24 * 3600,
  "/anime/batch/": 7 * 24 * 3600,
  "/anime/server/": 900,
  "/anime/anime/": 12 * 3600,
  "/genres": 7 * 24 * 3600,
  "/advanced-search": 2 * 3600,
  "/chapters/": 2 * 3600,
  "/chapter/": 7 * 24 * 3600,
  "/detail/": 12 * 3600,
  "/read/": 7 * 24 * 3600,
  "/popular": 6 * 3600,
  "/latest": 3600,
  "/search": 6 * 3600,
  "/home": 2 * 3600,
  default: 2 * 3600,
};

const SORTED_TTL_KEYS = Object.keys(CACHE_TTL_SECONDS_MAP)
  .filter((k) => k !== "default")
  .sort((a, b) => b.length - a.length);

export function getTTLSeconds(url) {
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
