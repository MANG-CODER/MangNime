const KOMIK_API_URL =
  process.env.NEXT_PUBLIC_API_URL;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetcher dasar. Tidak ada lagi prefix /api dan tidak ada lagi Authorization
 * header — endpoint sankavollerei bersifat publik.
 */
export const fetchKomikAPI = async (endpoint, delayMs = 0, options = {}) => {
  try {
    if (delayMs > 0) await delay(delayMs);

    const res = await fetch(`${KOMIK_API_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
      ...options,
    });

    if (!res.ok) {
      console.warn(
        `⚠️ Komik API gagal. Status: ${res.status} | Endpoint: ${endpoint}`,
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`🚨 Komik API Error pada ${endpoint}:`, error.message);
    return null;
  }
};

// ─── Slug helpers ───────────────────────────────────────────────────────────
// List endpoints (terbaru/populer/genre) tidak memberi field `slug` langsung,
// hanya `link` yang berbentuk salah satu dari:
//   "/manga/some-title/"                          (terbaru, populer)
//   "https://komiku.org/manga/some-title/"         (genre)
//   "/detail-komik/some-title/"                    (search)
// Fungsi ini menyeragamkan semuanya jadi slug polos: "some-title"
function extractSlugFromLink(link) {
  if (!link) return "";
  try {
    const path = link.replace(/^https?:\/\/[^/]+/, "");
    const match = path.match(/\/(?:manga|detail-komik)\/([^/]+)\/?$/);
    if (match) return match[1];
    const segments = path.split("/").filter(Boolean);
    return segments[segments.length - 1] || "";
  } catch {
    return "";
  }
}

// ─── Normalizers ────────────────────────────────────────────────────────────

function normalizeListCard(item) {
  const slug = extractSlugFromLink(item.link);
  return {
    title: item.title || "",
    slug,
    image: item.image || "",
    chapter: item.chapter || "", // string apa adanya, mis. "Chapter 96"
    time_ago: item.time_ago || null,
    score: null,
    type: null,
    status: null,
  };
}

function normalizeGenreCard(item) {
  const slug = extractSlugFromLink(item.link);
  return {
    title: item.title || "",
    slug,
    image: item.image || "",
    chapter: item.chapter || "",
    score: item.rating || null,
    type: item.status || null,
    status: item.status || null,
  };
}

function normalizeSearchCard(item) {
  return {
    title: item.title || "",
    slug: item.slug || extractSlugFromLink(item.href),
    image: item.thumbnail || "",
    chapter: "",
    type: item.type || null,
    genreLabel: item.genre || null,
    description: item.description || null,
  };
}

function normalizeDetail(raw) {
  if (!raw) return null;
  const chapters = (raw.chapters || []).map((ch) => ({
    chapter: ch.chapter || "",
    slug: ch.slug || "",
    date: ch.date || null,
  }));

  return {
    title: raw.title || "",
    nativeTitle: raw.title_indonesian || "",
    slug: raw.slug || "",
    cover: raw.image || "",
    backgroundImage: raw.image || "",
    rating: raw.metadata?.rating || "?",
    status: raw.metadata?.status || "Unknown",
    author: raw.metadata?.author || "Unknown",
    format: raw.metadata?.type || "Manga",
    totalChapters: chapters.length,
    synopsis: raw.synopsis || raw.synopsis_full || "Sinopsis belum tersedia.",
    genres: (raw.genres || []).map((g) => ({
      id: g.slug,
      name: g.name,
      slug: g.slug,
    })),
    readChapter: chapters,
    recommended: (raw.similar_manga || []).map(normalizeListCard),
  };
}

function normalizeChapterDetail(raw, slug) {
  if (!raw) return null;
  return {
    komikTitle:
      raw.manga_title ||
      slug.replace(/-chapter-\d+.*$/i, "").replace(/-/g, " "),
    chapterTitle: raw.chapter_title || "",
    
    // ⚠️ SANGAT PENTING: Gunakan imagesproxy sebagai prioritas utama
    images: raw.imagesproxy || raw.images || [],
    
    prevChapterSlug: raw.navigation?.previousChapter || null,
    nextChapterSlug: raw.navigation?.nextChapter || null,
    chapterListSlug: raw.navigation?.chapterList || null,
    createdAt: null,
  };
}

function normalizePagination(raw, page) {
  if (!raw) return null;
  const currentPage = Number(raw.current_page || page || 1);
  const hasMore = !!raw.has_more;
  return {
    currentPage,
    hasNextPage: hasMore,
    hasPrevPage: currentPage > 1,
    nextPage: hasMore ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    totalPages: hasMore ? currentPage + 1 : currentPage,
  };
}

// ─── Public fetchers ────────────────────────────────────────────────────────

export const getLatestKomik = async (page = 1, limit = 30, options = {}) => {
  const res = await fetchKomikAPI(
    `/terbaru?page=${page}&limit=${limit}`,
    0,
    options,
  );
  const list = res?.comics || [];
  return {
    data: list.map(normalizeListCard),
    pagination: normalizePagination(res?.pagination, page),
  };
};

export const getPopularKomik = async (page = 1, limit = 30, options = {}) => {
  const res = await fetchKomikAPI(
    `/populer?page=${page}&limit=${limit}`,
    0,
    options,
  );
  const list = res?.comics || [];
  return {
    data: list.map(normalizeListCard),
    pagination: normalizePagination(res?.pagination, page),
  };
};

export const getHomeKomik = async (options = {}) => {
  const [terbaruRes, populerRes] = await Promise.all([
    fetchKomikAPI("/terbaru?page=1&limit=10", 0, options),
    fetchKomikAPI("/populer?page=1&limit=10", 0, options),
  ]);

  return {
    newest: (terbaruRes?.comics || []).map(normalizeListCard),
    popular: (populerRes?.comics || []).map(normalizeListCard),
  };
};

export const getKomikDetail = async (slug, options = {}) => {
  const res = await fetchKomikAPI(`/comic/${slug}`, 0, options);
  return normalizeDetail(res);
};

export const getChapterDetail = async (chapterSlug, options = {}) => {
  const res = await fetchKomikAPI(`/chapter/${chapterSlug}`, 0, options);
  return normalizeChapterDetail(res, chapterSlug);
};

export const searchKomik = async (keyword, limit = 30, options = {}) => {
  const res = await fetchKomikAPI(
    `/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
    0,
    options,
  );
  return {
    data: (res?.data || []).map(normalizeSearchCard),
    total: res?.total || 0,
  };
};

export const getGenres = async (options = {}) => {
  const res = await fetchKomikAPI("/genres", 0, options);
  return (res?.data || []).map((g) => ({
    id: g.value,
    data: { name: g.name },
  }));
};

export const getKomikByGenre = async (
  genreSlug,
  page = 1,
  limit = 30,
  options = {},
) => {
  const res = await fetchKomikAPI(
    `/genre/${genreSlug}?page=${page}&limit=${limit}`,
    0,
    options,
  );
  const list = res?.comics || [];
  return {
    data: list.map(normalizeGenreCard),
    pagination: normalizePagination(res?.pagination, page),
  };
};
