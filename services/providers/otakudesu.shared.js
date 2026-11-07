// Logika provider anime (Otakudesu via Sankanime), tanpa urusan fetch.
// Fetcher disuntik, jadi bisa dipakai di server maupun browser.

const BASE_URL =
  process.env.SANKANIME_BASE_URL || "https://www.sankavollerei.web.id/anime";

export const OTAKUDESU_ENDPOINTS = {
  HOME: "/home",
  ONGOING: "/ongoing-anime/",
  COMPLETE: "/complete-anime/",
  SEARCH: "/search/",
  ANIME: "/anime/",
  BATCH: "/batch/",
  GENRE: "/genre",
  SCHEDULE: "/schedule",
  EPISODE: "/episode/",
  SERVER: "/server/",
};

/**
 * @param {(url: string) => Promise<any>} fetchJson  server: coreFetcher, browser: clientFetch
 * @param {{strict?: boolean}} opts  strict=true -> error dilempar (dipakai di browser supaya UI bisa
 *   bedain "gagal" vs "kosong"). strict=false -> perilaku lama: error ditelan, return data kosong.
 */
export function createOtakudesuProvider(fetchJson, { strict = false } = {}) {
  const OtakudesuProvider = {
    normalizeList: (data) => {
      if (!Array.isArray(data)) return [];
      return data.map((item) => ({
        ...item,
        source: "otakudesu",
        type: item.type || item.status,
      }));
    },

    normalizeDetail: (data) => {
      if (!data) return null;
      return { ...data, source: "otakudesu" };
    },

    normalizePagination: (rawPagination) => {
      if (!rawPagination) return null;
      return {
        currentPage: Number(rawPagination.currentPage) || 1,
        hasNextPage: rawPagination.hasNextPage || false,
        hasPrevPage: rawPagination.hasPrevPage || false,
        nextPage: rawPagination.hasNextPage
          ? Number(rawPagination.currentPage) + 1
          : null,
        prevPage: rawPagination.hasPrevPage
          ? Number(rawPagination.currentPage) - 1
          : null,
        totalPages:
          Number(rawPagination.totalPages) ||
          Number(rawPagination.currentPage) + 1,
      };
    },

    getHome: async () => {
      try {
        const res = await fetchJson(`${BASE_URL}${OTAKUDESU_ENDPOINTS.HOME}`);
        return {
          ongoing: OtakudesuProvider.normalizeList(
            res?.data?.ongoing?.animeList || [],
          ),
          completed: OtakudesuProvider.normalizeList(
            res?.data?.completed?.animeList || [],
          ),
        };
      } catch (err) {
        if (strict) throw err;
        return { ongoing: [], completed: [] };
      }
    },

    getOngoing: async (page = 1) => {
      try {
        const res = await fetchJson(`${BASE_URL}/ongoing-anime?page=${page}`);
        const list = res?.data?.animeList || res?.data || [];
        return {
          data: OtakudesuProvider.normalizeList(list),
          pagination: OtakudesuProvider.normalizePagination(res?.pagination),
        };
      } catch (err) {
        if (strict) throw err;
        return { data: [], pagination: null };
      }
    },

    getCompleted: async (page = 1) => {
      try {
        const res = await fetchJson(`${BASE_URL}/complete-anime?page=${page}`);
        const list = res?.data?.animeList || res?.data || [];
        return {
          data: OtakudesuProvider.normalizeList(list),
          pagination: OtakudesuProvider.normalizePagination(res?.pagination),
        };
      } catch (err) {
        if (strict) throw err;
        return { data: [], pagination: null };
      }
    },

    search: async (query) => {
      try {
        const cleanQuery = (query || "").trim().toLowerCase();
        if (!cleanQuery) return [];
        const res = await fetchJson(
          `${BASE_URL}${OTAKUDESU_ENDPOINTS.SEARCH}${encodeURIComponent(
            cleanQuery,
          )}`,
        );
        const data = res?.data?.animeList || res?.data || [];
        return OtakudesuProvider.normalizeList(data);
      } catch (err) {
        if (strict) throw err;
        return [];
      }
    },

    getDetail: async (slug) => {
      if (!slug) return null;
      try {
        const res = await fetchJson(
          `${BASE_URL}${OTAKUDESU_ENDPOINTS.ANIME}${slug}`,
        );
        return OtakudesuProvider.normalizeDetail(res?.data);
      } catch (err) {
        if (strict) throw err;
        return null;
      }
    },

    getEpisode: async (slug) => {
      if (!slug) return null;
      try {
        const res = await fetchJson(
          `${BASE_URL}${OTAKUDESU_ENDPOINTS.EPISODE}${slug}`,
        );
        return res?.data || null;
      } catch (err) {
        if (strict) throw err;
        return null;
      }
    },

    getSchedule: async () => {
      try {
        const res = await fetchJson(
          `${BASE_URL}${OTAKUDESU_ENDPOINTS.SCHEDULE}`,
        );
        return res?.data || [];
      } catch (err) {
        if (strict) throw err;
        return [];
      }
    },

    getGenres: async () => {
      try {
        const res = await fetchJson(`${BASE_URL}${OTAKUDESU_ENDPOINTS.GENRE}`);
        return res?.data || [];
      } catch (err) {
        if (strict) throw err;
        return [];
      }
    },

    getAnimeByGenre: async (slug, page = 1) => {
      try {
        const endpoint =
          page === 1
            ? `${OTAKUDESU_ENDPOINTS.GENRE}/${slug}`
            : `${OTAKUDESU_ENDPOINTS.GENRE}/${slug}?page=${page}`;

        const res = await fetchJson(`${BASE_URL}${endpoint}`);
        const data = res?.data?.animeList || res?.data || [];

        return {
          data: OtakudesuProvider.normalizeList(data),
          pagination: OtakudesuProvider.normalizePagination(res?.pagination),
        };
      } catch (err) {
        if (strict) throw err;
        return { data: [], pagination: null };
      }
    },

    getBatch: async (slug) => {
      if (!slug) return null;
      try {
        const res = await fetchJson(
          `${BASE_URL}${OTAKUDESU_ENDPOINTS.BATCH}${slug}`,
        );
        return res?.data || null;
      } catch (err) {
        if (strict) throw err;
        return null;
      }
    },

    // Pengganti server action fetchServerUrl di halaman episode.
    // TTL 15 menit diambil otomatis dari ttl.js ("/anime/server/").
    getServerUrl: async (serverId) => {
      if (!serverId) return null;
      if (String(serverId).startsWith("http")) return serverId;
      try {
        const res = await fetchJson(
          `${BASE_URL}${OTAKUDESU_ENDPOINTS.SERVER}${serverId}`,
        );
        const url =
          res?.data?.url || res?.url || (typeof res === "string" ? res : null);
        return typeof url === "string" ? url : null;
      } catch (err) {
        if (strict) throw err;
        return null;
      }
    },
  };

  return OtakudesuProvider;
}
