export const getSearchMergeKey = (title = "") => {
  return (
    title
      .toLowerCase()
      .replace(/\(.*?\)/g, "")
      .replace(/subtitle\s*indonesia|sub\s*indo|subtitle/gi, "")
      .replace(/\b(bd|batch|uncensored|uncen)\b/gi, "")
      .replace(/[^a-z0-9]/g, "")
      .trim()
  );
};

export const getMergeKey = (title = "") => {
  return (
    title
      .toLowerCase()
      // Hapus konten dalam kurung: (TV), (End), (2024), (Dub), dll
      .replace(/\(.*?\)/g, "")
      // Hapus label subtitle
      .replace(/subtitle\s*indonesia|sub\s*indo|subtitle/gi, "")
      // Hapus label kualitas/format
      .replace(/\b(bd|batch|uncensored|uncen)\b/gi, "")
      // Hapus penanda season dalam berbagai format
      .replace(/\b(season|s)\s*\d+\b/gi, "")
      .replace(/\b\d+(st|nd|rd|th)\s*(season)?\b/gi, "")
      .replace(/\bpart\s*\d+\b/gi, "")
      // Strip partikel Jepang umum yang sering berbeda antar sumber
      // wa(は) no(の) ga(が) wo/o(を) ni(に) to(と) de(で) na(な) mo(も) ya(や) ka(か)
      .replace(/\b(wa|no|ga|wo|ni|to|de|na|mo|ya|ka|he)\b/gi, "")
      // Hapus SEMUA karakter non-alfanumerik
      .replace(/[^a-z0-9]/g, "")
      .trim()
  );
};

/**
 * Merge dua list anime (primary + secondary) dengan deduplikasi.
 *
 * @param {Array}   primaryList
 * @param {Array}   secondaryList
 * @param {object}  options
 * @param {boolean} options.skipCompletedFromSecondary
 * @returns {Array}
 */

export function mergeAnimeLists(primaryList, secondaryList, options = {}) {
  const { skipCompletedFromSecondary = false } = options;

  const animeMap = new Map();

  (primaryList || []).forEach((anime) => {
    const key = getMergeKey(anime.title);
    if (key) animeMap.set(key, anime);
  });

  (secondaryList || []).forEach((anime) => {
    if (skipCompletedFromSecondary) {
      const status = (anime.status || "").toLowerCase();
      if (status.includes("completed") || status.includes("tamat")) return;
    }

    const key = getMergeKey(anime.title);
    if (!key) return;

    if (!animeMap.has(key)) {
      animeMap.set(key, anime);
    } else {
      const existing = animeMap.get(key);
      animeMap.set(key, {
        ...existing,
        poster: existing.poster || anime.poster,
        score: existing.score || anime.score || anime.rating,
        episodes: existing.episodes || anime.episodes,
      });
    }
  });

  return Array.from(animeMap.values());
}

export function mergeSearchAnimeLists(
  primaryList,
  secondaryList,
  options = {},
) {
  const { skipCompletedFromSecondary = false } = options;

  const animeMap = new Map();

  (primaryList || []).forEach((anime) => {
    const key = getSearchMergeKey(anime.title);

    if (key) {
      animeMap.set(key, anime);
    }
  });

  (secondaryList || []).forEach((anime) => {
    if (skipCompletedFromSecondary) {
      const status = (anime.status || "").toLowerCase();

      if (status.includes("completed") || status.includes("tamat")) {
        return;
      }
    }

    const key = getSearchMergeKey(anime.title);

    if (!key) return;

    if (!animeMap.has(key)) {
      animeMap.set(key, anime);
    } else {
      const existing = animeMap.get(key);

      animeMap.set(key, {
        ...existing,
        poster: existing.poster || anime.poster,
        score: existing.score || anime.score || anime.rating,
        episodes: existing.episodes || anime.episodes,
      });
    }
  });

  return Array.from(animeMap.values());
}

export function mergeScheduleLists(otakuSchedule = [], alqaSchedule = {}) {
  const scheduleMap = new Map();

  const normalizeDay = (day = "") => {
    return day
      .replace("Jum'at", "Jumat")
      .replace("Jum‘at", "Jumat")
      .replace("Jum’at", "Jumat")
      .trim();
  };

  const otakuAnimeKeys = new Set();

  otakuSchedule.forEach((dayData) => {
    const day = normalizeDay(dayData.day);

    const animeList = (dayData.anime_list || []).map((anime) => {
      const key = getMergeKey(anime.title);

      if (key) {
        otakuAnimeKeys.add(key);
      }

      return {
        ...anime,
        source: "otakudesu",
      };
    });

    scheduleMap.set(day, {
      day,
      anime_list: animeList,
    });
  });

  Object.entries(alqaSchedule).forEach(([rawDay, animeList]) => {
    const day = normalizeDay(rawDay);

    if (!scheduleMap.has(day)) {
      scheduleMap.set(day, {
        day,
        anime_list: [],
      });
    }

    const currentDay = scheduleMap.get(day);

    animeList.forEach((anime) => {
      const key = getMergeKey(anime.title);

      if (!key) return;

      if (otakuAnimeKeys.has(key)) {
        return;
      }

      currentDay.anime_list.push({
        ...anime,
        source: "alqanime",
      });
    });

    scheduleMap.set(day, currentDay);
  });

  const dayOrder = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
    "Random",
  ];

  return Array.from(scheduleMap.values()).sort(
    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day),
  );
}