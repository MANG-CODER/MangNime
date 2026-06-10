import { coreFetcher } from "../core/fetcher";

const BASE_URL =
  process.env.SANKANIME_BASE_URL || "https://www.sankavollerei.com/anime";

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

export const OtakudesuProvider = {
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
    const res = await coreFetcher(`${BASE_URL}${OTAKUDESU_ENDPOINTS.HOME}`);
    return {
      ongoing: OtakudesuProvider.normalizeList(
        res?.data?.ongoing?.animeList || [],
      ),
      completed: OtakudesuProvider.normalizeList(
        res?.data?.completed?.animeList || [],
      ),
    };
  },

  getOngoing: async (page = 1) => {
    const res = await coreFetcher(`${BASE_URL}/ongoing-anime?page=${page}`);
    const list = res?.data?.animeList || res?.data || [];

    return {
      data: OtakudesuProvider.normalizeList(list),
      pagination: OtakudesuProvider.normalizePagination(res?.pagination),
    };
  },

  getCompleted: async (page = 1) => {
    const res = await coreFetcher(`${BASE_URL}/complete-anime?page=${page}`);
    const list = res?.data?.animeList || res?.data || [];

    return {
      data: OtakudesuProvider.normalizeList(list),
      pagination: OtakudesuProvider.normalizePagination(res?.pagination),
    };
  },

  search: async (query) => {
    const res = await coreFetcher(
      `${BASE_URL}${OTAKUDESU_ENDPOINTS.SEARCH}${encodeURIComponent(query)}`,
    );
    const data = res?.data?.animeList || res?.data || [];
    return OtakudesuProvider.normalizeList(data);
  },

  getDetail: async (slug) => {
    const res = await coreFetcher(
      `${BASE_URL}${OTAKUDESU_ENDPOINTS.ANIME}${slug}`,
    );
    return OtakudesuProvider.normalizeDetail(res?.data);
  },

  getEpisode: async (slug) => {
    const res = await coreFetcher(
      `${BASE_URL}${OTAKUDESU_ENDPOINTS.EPISODE}${slug}`,
    );
    return res?.data || null;
  },

  getSchedule: async () => {
    const res = await coreFetcher(`${BASE_URL}${OTAKUDESU_ENDPOINTS.SCHEDULE}`);
    return res?.data || [];
  },

  getGenres: async () => {
    const res = await coreFetcher(`${BASE_URL}${OTAKUDESU_ENDPOINTS.GENRE}`);
    return res?.data || [];
  },

  getAnimeByGenre: async (slug, page = 1) => {
    const endpoint =
      page === 1
        ? `${OTAKUDESU_ENDPOINTS.GENRE}/${slug}`
        : `${OTAKUDESU_ENDPOINTS.GENRE}/${slug}?page=${page}`;

    const res = await coreFetcher(`${BASE_URL}${endpoint}`);

    const data = res?.data?.animeList || res?.data || [];

    return {
      data: OtakudesuProvider.normalizeList(data),
      pagination: res?.pagination || null,
    };
  },

  getBatch: async (slug) => {
    const res = await coreFetcher(
      `${BASE_URL}${OTAKUDESU_ENDPOINTS.BATCH}${slug}`,
    );
    return res?.data || null;
  },
};
