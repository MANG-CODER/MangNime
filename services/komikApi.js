const KOMIK_API_URL = process.env.NEXT_PUBLIC_API_URL;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchKomikAPI = async (endpoint, delayMs = 0, options = {}) => {
  try {
    if (delayMs > 0) await delay(delayMs);

    // Otomatis menambahkan /api agar tidak error 404 NotFound di Cloudflare
    const res = await fetch(`${KOMIK_API_URL}/api${endpoint}`, {
      headers: {
        Accept: "application/json",
        // x-forwarded-for dan User-Agent dihapus. Biar Cloudflare yang deteksi!
        Authorization: `Bearer ${process.env.KOMIK_API_SECRET}`,
      },
      next: { revalidate: 3600},
      ...options,
    });

    if (!res.ok) {
      const errDetail = await res.json().catch(() => ({}));
      console.warn(
        `⚠️ Komik API gagal. Status: ${res.status} | Endpoint: ${endpoint}`,
      );
      console.warn(`🕵️‍♂️ Alasan Asli:`, errDetail.message || "Tidak diketahui");
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
