import { headers } from "next/headers";

const KOMIK_API_URL = "https://komikcastapi.vestiapani.deno.net/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchKomikAPI = async (endpoint, delayMs = 0, options = {}) => {
  try {
    if (delayMs > 0) await delay(delayMs);

    const headersList = await headers();

    const clientIp =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      "Unknown IP";

    const res = await fetch(`${KOMIK_API_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
        "x-forwarded-for": clientIp,
      },
      ...options,
    });

    if (!res.ok) {
      console.warn(
        `⚠️ Komik API gagal merespons. Status: ${res.status} | Endpoint: ${endpoint}`,
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`🚨 Komik API Error pada ${endpoint}:`, error.message);
    return null;
  }
};

export const getHomeKomik = (options = {}) =>
  fetchKomikAPI("/home", 0, options);

export const getLatestKomik = (page = 1, options = {}) =>
  fetchKomikAPI(`/latest?page=${page}`, 0, options);

export const getPopularKomik = (page = 1, options = {}) =>
  fetchKomikAPI(`/popular?page=${page}`, 0, options);

export const getKomikDetail = (slug, options = {}) =>
  fetchKomikAPI(`/komik/${slug}`, 0, options);

export const getChapterDetail = (slug, chapterId, options = {}) =>
  fetchKomikAPI(`/komik/${slug}/${chapterId}`, 0, options);

export const searchKomik = (keyword, options = {}) =>
  fetchKomikAPI(
    `/advanceSearch?search=${encodeURIComponent(keyword)}`,
    0,
    options,
  );

export const getGenres = (options = {}) => fetchKomikAPI("/genres", 0, options);
