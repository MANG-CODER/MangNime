const KOMIK_API_URL = "https://komikcast-api-six.vercel.app/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ Tambahkan parameter 'options' di akhir
export const fetchKomikAPI = async (endpoint, delayMs = 1000, options = {}) => {
  try {
    // Beri jeda agar API Vercel tidak marah (rate limit)
    if (delayMs > 0) await delay(delayMs);

    // ✅ Hapus "no-store" dan sebarkan 'options' dari parameter
    const res = await fetch(`${KOMIK_API_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
      },
      ...options, // Ini yang akan menerima perintah caching dari halaman
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

// ✅ Update Endpoint Helpers agar bisa meneruskan 'options'
export const getHomeKomik = (options = {}) =>
  fetchKomikAPI("/home", 1000, options);
export const getLatestKomik = (page = 1, options = {}) =>
  fetchKomikAPI(`/latest?page=${page}`, 1000, options);
export const getKomikDetail = (slug, options = {}) =>
  fetchKomikAPI(`/komik/${slug}`, 1000, options);
export const getChapterDetail = (slug, chapterId, options = {}) =>
  fetchKomikAPI(`/komik/${slug}/${chapterId}`, 1000, options);
export const searchKomik = (keyword, options = {}) =>
  fetchKomikAPI(`/advanceSearch?search=${keyword}`, 1000, options);
