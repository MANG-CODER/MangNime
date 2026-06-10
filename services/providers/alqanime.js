import { coreFetcher } from "../core/fetcher";

const BASE_URL =
  process.env.SANKANIME_BASE_URL || "https://www.sankavollerei.com/anime";

export const ALQANIME_ENDPOINTS = {
  HOME: "/alqanime/home",
  SCHEDULE: "/alqanime/schedule",
  POPULAR: "/alqanime/popular",
  LIST: "/alqanime/list",
  ONGOING: "/alqanime/ongoing",
  COMPLETED: "/alqanime/completed",
  MOVIE: "/alqanime/movie",
  SEARCH: "/alqanime/search/",
  GENRES: "/alqanime/genres",
  GENRE: "/alqanime/genre/",
  SEASON: "/alqanime/season/",
  DETAIL: "/alqanime/detail/",
  EPISODE: "/alqanime/episode/",
};

export const AlqanimeProvider = {
  // --- HELPER NORMALISASI ---
  normalizeList: (data) => {
    if (!Array.isArray(data)) return [];

    return (
      data
        .filter((item) => {
          const title = (item.title || "").toLowerCase();
          return !title.includes("uncen") && !title.includes("uncensored");
        })
        .map((item) => ({
          ...item,
          source: "alqanime",
          type: item.type || "Movie",
        }))
    );
  },

  normalizeDetail: (data) => {
    if (!data) return null;
    let safeRecommendations = [];
    if (Array.isArray(data.recommendations)) {
      safeRecommendations = data.recommendations.filter((rec) => {
        const recTitle = (rec.title || "").toLowerCase();
        return !recTitle.includes("uncen") && !recTitle.includes("uncensored");
      });
    }

    return {
      ...data,
      recommendations: safeRecommendations,
      source: "alqanime",
    };
  },

  normalizePagination: (currentPage, rawPagination, rawListLength = 0) => {
    const pageNum = Number(currentPage) || 1;

    let hasNext = false;
    if (rawPagination && typeof rawPagination.has_next === "boolean") {
      hasNext = rawPagination.has_next;
    } else if (
      rawPagination &&
      typeof rawPagination.hasNextPage === "boolean"
    ) {
      hasNext = rawPagination.hasNextPage;
    } else {
      hasNext = rawListLength >= 10;
    }

    const hasPrev = pageNum > 1;

    return {
      currentPage: pageNum,
      hasNextPage: hasNext,
      hasPrevPage: hasPrev,
      nextPage: hasNext ? pageNum + 1 : null,
      prevPage: hasPrev ? pageNum - 1 : null,
      totalPages: hasNext ? pageNum + 1 : pageNum,
    };
  },


  getHome: async (page = 1) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.HOME}?page=${page}`,
      );
      const list = res?.data || [];
      const normalizedList = AlqanimeProvider.normalizeList(list);
      return {
        data: normalizedList,
        pagination: AlqanimeProvider.normalizePagination(
          page,
          res?.pagination,
          normalizedList.length,
        ),
      };
    } catch (e) {
      return { data: [], pagination: null };
    }
  },

  getPopular: async (page = 1) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.POPULAR}?page=${page}`,
      );
      const list = res?.data || [];
      const normalizedList = AlqanimeProvider.normalizeList(list);
      return {
        data: normalizedList,
        pagination: AlqanimeProvider.normalizePagination(
          page,
          res?.pagination,
          normalizedList.length,
        ),
      };
    } catch (e) {
      return { data: [], pagination: null };
    }
  },

  getOngoing: async (page = 1) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.ONGOING}?page=${page}`,
      );
      const list = res?.data || [];
      const normalizedList = AlqanimeProvider.normalizeList(list);
      return {
        data: normalizedList,
        pagination: AlqanimeProvider.normalizePagination(
          page,
          res?.pagination,
          normalizedList.length,
        ),
      };
    } catch (e) {
      return { data: [], pagination: null };
    }
  },

  getCompleted: async (page = 1) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.COMPLETED}?page=${page}`,
      );
      const list = res?.data || [];
      const normalizedList = AlqanimeProvider.normalizeList(list);
      return {
        data: normalizedList,
        pagination: AlqanimeProvider.normalizePagination(
          page,
          res?.pagination,
          normalizedList.length,
        ),
      };
    } catch (e) {
      return { data: [], pagination: null };
    }
  },

  getMovies: async (page = 1) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.MOVIE}?page=${page}`,
      );
      // 1. Normalisasi dan filter uncen
      let list = AlqanimeProvider.normalizeList(res?.data || []);
      // 2. Filter khusus Movie
      list = list.filter(
        (item) => item.type && item.type.toLowerCase() === "movie",
      );
      return {
        data: list,
        pagination: AlqanimeProvider.normalizePagination(
          page,
          res?.pagination,
          list.length,
        ),
      };
    } catch (e) {
      return { data: [], pagination: null };
    }
  },

  search: async (query, page = 1) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.SEARCH}${encodeURIComponent(query)}?page=${page}`,
      );
      return AlqanimeProvider.normalizeList(res?.data || []);
    } catch (e) {
      return [];
    }
  },

  getDetail: async (slug) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.DETAIL}${slug}`,
      );
      return AlqanimeProvider.normalizeDetail(res?.data);
    } catch (e) {
      return null;
    }
  },

  getEpisode: async (slug) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.EPISODE}${slug}`,
      );
      return res?.data || null;
    } catch (e) {
      return null;
    }
  },

  getSchedule: async () => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.SCHEDULE}`,
      );
      return res?.data || {};
    } catch (e) {
      return {};
    }
  },

  getGenres: async () => {
    try {
      const res = await coreFetcher(`${BASE_URL}${ALQANIME_ENDPOINTS.GENRES}`);
      return res?.data || [];
    } catch (e) {
      return [];
    }
  },

  getAnimeByGenre: async (slug, page = 1) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.GENRE}${slug}?page=${page}`,
      );
      const list = res?.data || [];
      const normalizedList = AlqanimeProvider.normalizeList(list);
      return {
        data: normalizedList,
        pagination: AlqanimeProvider.normalizePagination(
          page,
          res?.pagination,
          normalizedList.length,
        ),
      };
    } catch (e) {
      return { data: [], pagination: null };
    }
  },

  getAnimeBySeason: async (slug) => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.SEASON}${slug}`,
      );
      return AlqanimeProvider.normalizeList(res?.data || []);
    } catch (e) {
      return [];
    }
  },

  getListAZ: async (show = "all") => {
    try {
      const res = await coreFetcher(
        `${BASE_URL}${ALQANIME_ENDPOINTS.LIST}?show=${show}`,
      );
      return res?.data || [];
    } catch (e) {
      return [];
    }
  },
};