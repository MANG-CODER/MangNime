const KOMIK_API_URL = "https://komikcast-api-six.vercel.app/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchKomikAPI = async (endpoint, delayMs = 1000) => {
  try {
    // Beri jeda agar API Vercel tidak marah (rate limit)
    if (delayMs > 0) await delay(delayMs);

    // Paksa no-store agar error/cache busuk tidak tersimpan
    const res = await fetch(`${KOMIK_API_URL}${endpoint}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
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

// Endpoint Helpers
export const getHomeKomik = () => fetchKomikAPI("/home");
export const getLatestKomik = (page = 1) =>
  fetchKomikAPI(`/latest?page=${page}`);
export const getKomikDetail = (slug) => fetchKomikAPI(`/komik/${slug}`);
export const getChapterDetail = (slug, chapterId) =>
  fetchKomikAPI(`/komik/${slug}/${chapterId}`);
export const searchKomik = (keyword) =>
  fetchKomikAPI(`/advanceSearch?search=${keyword}`);
