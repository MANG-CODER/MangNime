import { proxyImage } from "@/utils/shinigamiProxy";

const ENV_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://www.sankavollerei.web.id/comic";
let FIXED_URL = ENV_URL;
if (FIXED_URL.includes("https://sankavollerei")) {
  FIXED_URL = FIXED_URL.replace(
    "https://sankavollerei",
    "https://www.sankavollerei",
  );
}

const SHINIGAMI_BASE_URL = FIXED_URL.includes("shinigami")
  ? FIXED_URL
  : `${FIXED_URL}/shinigami`;
const KOMIKU_BASE_URL = FIXED_URL.includes("shinigami")
  ? FIXED_URL.replace("/shinigami", "")
  : FIXED_URL;

export const SHINIGAMI_ENDPOINTS = {
  HOME: "/home",
  LATEST: "/latest",
  POPULAR: "/popular",
  SEARCH: "/search/",
  DETAIL: "/detail/",
  CHAPTERS: "/chapters/",
  READ: "/read/",
  GENRES: "/genres",
  ADVANCED_SEARCH: "/advanced-search",
};

export const KOMIKU_ENDPOINTS = {
  SEARCH: "/search?q=",
  DETAIL: "/comic/",
  CHAPTER: "/chapter/",
};

// =====================================================================
// SISTEM RATE LIMITER KOMIKU (PER-IP & FAIL-FAST)
// =====================================================================
const RATE_LIMIT = 25;
const TIME_WINDOW_MS = 60 * 1000;

// Pakai Map untuk simpan hitungan per-IP!
const rateLimits = new Map(); 

function checkRateLimit(ip = "global") {
  const now = Date.now();
  let userLimit = rateLimits.get(ip);

  // Jika belum ada data untuk IP ini, atau waktunya udah lewat 1 menit, reset
  if (!userLimit || now - userLimit.startTime >= TIME_WINDOW_MS) {
    userLimit = { count: 0, startTime: now };
  }

  // Jika limit per-IP ini tercapai
  if (userLimit.count >= RATE_LIMIT) {
    console.warn(`⏳ [RATE LIMITER] Limit 25/menit tercapai untuk IP: ${ip}`);
    return false;
  }

  // Tambah hitungan IP ini
  userLimit.count++;
  rateLimits.set(ip, userLimit);
  return true;
}
// =====================================================================

// 1. SHINIGAMI FETCHER (TANPA REACT CACHE)
const fetchAPI = async (endpoint) => {
  const fullUrl = `${SHINIGAMI_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(fullUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Fetch API Error (${endpoint}):`, error.message);
    return null;
  }
};

// =====================================================================
// 2. KOMIKU FETCHER (MANUAL CACHE + FAIL-FAST LIMITER + STALE CACHE)
// =====================================================================
const komikuMemoryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // Cache fresh 5 menit

// 👈 Tambahin parameter IP di sini
const fetchKomikuAPI = async (endpoint, ip = "global") => {
  const fullUrl = `${KOMIKU_BASE_URL}${endpoint}`;
  const cached = komikuMemoryCache.get(fullUrl);

  // 1. CEK CACHE FRESH
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // 2. CEK LIMITER PER-IP
  if (!checkRateLimit(ip)) {
    // 👈 KALAU KENA LIMIT: Coba cek apa ada cache basi (stale)?
    if (cached) {
      console.log(`♻️ [STALE CACHE] Kena limit, return data lama untuk: ${endpoint}`);
      return cached.data; 
    }
    // Kalau bener-bener kosong dan kena limit, kembalikan pesan "coba lagi"
    return { error: true, message: "Terlalu banyak request, coba lagi sebentar." };
  }

  try {
    const res = await fetch(fullUrl, { next: { revalidate: 300 } });
    if (res.status === 429 || !res.ok) return null;

    const data = await res.json();

    if (data && !data.error) {
      komikuMemoryCache.set(fullUrl, { data, timestamp: Date.now() });
    }

    return data;
  } catch (error) {
    console.error(`Fetch Komiku Error (${endpoint}):`, error.message);
    // Fallback terakhir: kalau fetch error (misal network down), balikin stale cache kalau ada
    if (cached) return cached.data;
    return null;
  }
};
// =====================================================================

function normalizeKomikuSearch(item) {
  return {
    title: item.title,
    slug: `komikudetail-${item.slug}`,
    image: proxyImage(item.thumbnail),
    chapter: item.description || "",
    score: "",
    type: item.type || "Manga",
    source: "komiku",
  };
}

function normalizeKomikuDetail(raw) {
  return {
    title: raw.title,
    slug: `komikudetail-${raw.slug}`,
    image: proxyImage(raw.image),
    synopsis: raw.synopsis || raw.synopsis_full || "Tidak ada sinopsis.",
    genres: raw.genres?.map((g) => g.name) || [],
    author: raw.metadata?.author || "-",
    artist: "-",
    status: raw.metadata?.status || "Unknown",
    score: "",
    type: raw.metadata?.type || "Manga",
    source: "komiku",
    chapters: (raw.chapters || []).map((ch) => {
      const chNumMatch = ch.chapter.match(/([0-9.]+)/);
      const chNum = chNumMatch ? chNumMatch[1] : ch.chapter;
      return {
        chapterId: ch.slug,
        title: ch.chapter,
        slug: ch.slug,
        chapterNumber: chNum,
        createdAt: ch.date || "",
      };
    }),
  };
}

function cleanChapterSlug(val) {
  if (!val || typeof val !== "string") return null;
  if (val === "false" || val === "null") return null;
  const parts = val.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
}

function normalizeKomikuChapter(raw) {
  const imagesList =
    raw.imagesproxy && raw.imagesproxy.length > 0
      ? raw.imagesproxy
      : raw.images || [];

  let prevRaw =
    raw.navigation?.previousChapter ||
    raw.navigation?.prev_chapter ||
    raw.prev_chapter ||
    null;
  let nextRaw =
    raw.navigation?.nextChapter ||
    raw.navigation?.next_chapter ||
    raw.next_chapter ||
    null;

  return {
    chapterTitle: raw.chapter_title || raw.manga_title || "Chapter",
    createdAt: "",
    images: imagesList,
    prevChapterSlug: cleanChapterSlug(prevRaw),
    nextChapterSlug: cleanChapterSlug(nextRaw),
  };
}

async function resolveMangaId(slugOrId) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(slugOrId)) return slugOrId;
  const keyword = slugOrId.replace(/-/g, " ");
  try {
    const searchRes = await fetchAPI(
      `${SHINIGAMI_ENDPOINTS.SEARCH}${encodeURIComponent(keyword)}`,
    );
    const items = searchRes?.data || searchRes || [];
    if (Array.isArray(items) && items.length > 0) {
      const matched =
        items.find(
          (item) =>
            item.slug === slugOrId ||
            item.title?.toLowerCase().includes(keyword.toLowerCase()),
        ) || items[0];
      return matched.manga_id || matched.slug;
    }
  } catch (e) {
    console.error("Gagal resolve manga ID:", e.message);
  }
  return slugOrId;
}

function toSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// 3. GET DETAIL (TANPA REACT CACHE)
const getDetail = async (slugOrId) => {
  if (slugOrId.startsWith("komikudetail-")) {
    const realSlug = slugOrId.replace("komikudetail-", "");
    const komikuJson = await fetchKomikuAPI(
      `${KOMIKU_ENDPOINTS.DETAIL}${realSlug}`,
    );
    if (komikuJson && !komikuJson.error) {
      return normalizeKomikuDetail(komikuJson);
    }
    return null;
  }

  const mangaId = await resolveMangaId(slugOrId);
  const [detailRes, chaptersFirstPageRes] = await Promise.all([
    fetchAPI(`${SHINIGAMI_ENDPOINTS.DETAIL}${mangaId}`),
    fetchAPI(`${SHINIGAMI_ENDPOINTS.CHAPTERS}${mangaId}?page=1`),
  ]);

  const raw = detailRes?.data;
  if (!raw) return null;

  const chaptersList = chaptersFirstPageRes?.data || [];
  let typeFormat =
    Array.isArray(raw.format) && raw.format.length > 0
      ? raw.format[0].name
      : raw.format || "Manhwa";

  return {
    title: raw.title,
    slug: raw.manga_id,
    image: proxyImage(raw.cover_portrait || raw.cover),
    synopsis: raw.description || "Tidak ada sinopsis.",
    genres: raw.genres?.map((g) => g.name) || [],
    author: raw.authors?.map((a) => a.name).join(", ") || "-",
    artist: raw.artists?.map((a) => a.name).join(", ") || "-",
    status: raw.status || "Unknown",
    score: raw.rating || "",
    type: typeFormat,
    chapters: chaptersList.map((ch) => {
      const uuid = ch.chapter_id || ch.id;
      const chNum = ch.chapter_number;
      return {
        chapterId: uuid,
        title: ch.chapter_title
          ? `Chapter ${chNum}: ${ch.chapter_title}`
          : `Chapter ${chNum}`,
        slug: `chapter-${chNum}-${uuid}`,
        chapterNumber: chNum,
        createdAt: ch.updated_at || ch.release_date || "",
      };
    }),
  };
};

// 4. GET CHAPTER (TANPA REACT CACHE)
const getChapter = async (mangaSlugOrId, chapterSlugOrNum) => {
  if (!chapterSlugOrNum) return null;

  if (
    typeof mangaSlugOrId === "string" &&
    mangaSlugOrId.startsWith("komikudetail-")
  ) {
    let targetSlug = chapterSlugOrNum.replace("komikuchapter-", "");
    const komikuRes = await fetchKomikuAPI(
      `${KOMIKU_ENDPOINTS.CHAPTER}${targetSlug}`,
    );
    if (komikuRes && !komikuRes.error) {
      return normalizeKomikuChapter(komikuRes);
    }
    return null;
  }

  const cleanChapterInput = chapterSlugOrNum;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let targetChapterId = cleanChapterInput;

  if (!uuidRegex.test(targetChapterId)) {
    try {
      const uuidMatch = targetChapterId.match(
        /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
      );
      if (uuidMatch) {
        targetChapterId = uuidMatch[1];
      } else {
        const mangaId = await resolveMangaId(mangaSlugOrId);
        const cleanNum = String(cleanChapterInput).replace(/[^0-9.]/g, "");
        const detailRes = await fetchAPI(
          `${SHINIGAMI_ENDPOINTS.CHAPTERS}${mangaId}?page=1`,
        );
        const found = (detailRes?.data || []).find(
          (ch) => String(ch.chapter_number) === cleanNum,
        );
        if (found) targetChapterId = found.chapter_id;
      }
    } catch (e) {
      console.error("Gagal mengekstrak UUID chapter:", e.message);
      return null;
    }
  }

  if (!uuidRegex.test(targetChapterId)) return null;

  const res = await fetchAPI(`${SHINIGAMI_ENDPOINTS.READ}${targetChapterId}`);
  if (!res || !res.data) return null;

  const raw = res.data;
  const rawImages = raw.images || raw.pages || [];
  const formatChSlug = (chNum, chId) =>
    chId ? `chapter-${chNum ?? "0"}-${chId}` : null;

  return {
    chapterTitle: raw.chapter_number
      ? `Chapter ${raw.chapter_number}`
      : raw.title || "",
    createdAt: raw.updated_at || raw.release_date || "",
    images: rawImages.map((img) =>
      proxyImage(typeof img === "string" ? img : img.url || img.image),
    ),
    prevChapterSlug: raw.prev_chapter_id
      ? formatChSlug(raw.prev_chapter_number, raw.prev_chapter_id)
      : null,
    nextChapterSlug: raw.next_chapter_id
      ? formatChSlug(raw.next_chapter_number, raw.next_chapter_id)
      : null,
  };
};

export const KomikProvider = {
  getHome: async () => {
    const res = await fetchAPI(SHINIGAMI_ENDPOINTS.HOME);
    if (!res) return { latest: [], popular: [], recommendations: [] };

    const formatItems = (list) => {
      if (!Array.isArray(list)) return [];
      return list.map((item) => ({
        title: item.title,
        slug: toSlug(item.title),
        image: proxyImage(item.thumbnail || item.cover),
        chapter: item.chapter || item.latest_chapter || "",
        score: item.rating || item.score || "",
        type: item.type || "Manhwa",
      }));
    };

    return {
      latest: formatItems(res.data?.latest || res.latest),
      popular: formatItems(res.data?.popular || res.popular),
      recommendations: formatItems(
        res.data?.recommendations || res.recommendations,
      ),
    };
  },

  getLatest: async (page = 1) => {
    const res = await fetchAPI(`${SHINIGAMI_ENDPOINTS.LATEST}?page=${page}`);
    if (!res) return { data: [], pagination: null };
    return {
      data: (res.data || []).map((item) => ({
        title: item.title,
        slug: toSlug(item.title),
        image: proxyImage(item.thumbnail || item.cover),
        chapter: item.chapter || item.latest_chapter || "",
        score: item.rating || "",
      })),
      pagination: res.pagination || null,
    };
  },

  getPopular: async (page = 1) => {
    const res = await fetchAPI(`${SHINIGAMI_ENDPOINTS.POPULAR}?page=${page}`);
    if (!res) return { data: [], pagination: null };
    return {
      data: (res.data || []).map((item) => ({
        title: item.title,
        slug: toSlug(item.title),
        image: proxyImage(item.thumbnail || item.cover),
        chapter: item.chapter || item.latest_chapter || "",
        score: item.rating || "",
      })),
      pagination: res.pagination || null,
    };
  },

  getGenres: async () => {
    const res = await fetchAPI(SHINIGAMI_ENDPOINTS.GENRES);
    if (!res || !res.data) return [];

    return res.data.map((genre) => ({
      name: genre.name || genre.title || "Unknown",
      slug: genre.slug || genre.id || "",
    }));
  },

  search: async (keyword, page = 1, ip = "global") => {
    let shinigamiList = [];
    let komikuList = [];
    let pagination = null;
    let message = null;

    try {
      const res = await fetchAPI(
        `${SHINIGAMI_ENDPOINTS.SEARCH}${encodeURIComponent(keyword)}?page=${page}`,
      );
      shinigamiList = res?.data || res || [];
      pagination = res?.pagination || null;
    } catch (e) {}

    try {
      const komikuJson = await fetchKomikuAPI(
        `${KOMIKU_ENDPOINTS.SEARCH}${encodeURIComponent(keyword)}`, ip
      );
      if (komikuJson?.error) {
        message = komikuJson.message;
      } else if (komikuJson?.status && Array.isArray(komikuJson.data)) {
        komikuList = komikuJson.data.map(normalizeKomikuSearch);
      }
    } catch (err) {}

    const formattedShinigami = Array.isArray(shinigamiList)
      ? shinigamiList.map((item) => ({
          title: item.title,
          slug: item.slug || toSlug(item.title),
          image: proxyImage(
            item.cover_portrait || item.cover || item.thumbnail,
          ),
          chapter: item.chapter || item.latest_chapter || "",
          score: item.rating || item.score || "",
          type: item.format || item.type || "Manhwa",
          source: "shinigami",
        }))
      : [];

    const combinedMap = new Map();
    [...formattedShinigami, ...komikuList].forEach((item) => {
      const cleanTitle = item.title.toLowerCase().trim();
      if (!combinedMap.has(cleanTitle)) {
        combinedMap.set(cleanTitle, item);
      }
    });

    return {
      data: Array.from(combinedMap.values()),
      pagination: pagination,
      message: message,
    };
  },

  getKomikByGenre: async (genreSlug, page = 1) => {
    const endpoint = `${SHINIGAMI_ENDPOINTS.ADVANCED_SEARCH}?genre_include=${genreSlug}&page=${page}`;
    const res = await fetchAPI(endpoint);
    if (!res) return { data: [], pagination: null };
    return {
      data: (res.data || []).map((item) => ({
        title: item.title,
        slug: toSlug(item.title) || item.manga_id || item.slug,
        mangaId: item.manga_id,
        image: proxyImage(item.cover_portrait || item.cover || item.thumbnail),
        chapter: item.latest_chapter
          ? `Chapter ${item.latest_chapter}`
          : item.chapter || "",
        score: item.rating || item.score || "",
        type: item.format || item.type || "Manhwa",
      })),
      pagination: res.pagination || null,
    };
  },

  getAdvancedSearch: async (format = "", page = 1, status = "", genre = "") => {
    let endpoint = `${SHINIGAMI_ENDPOINTS.ADVANCED_SEARCH}?page=${page}`;
    if (format) endpoint += `&format=${encodeURIComponent(format)}`;
    if (status) endpoint += `&status=${encodeURIComponent(status)}`;
    if (genre) endpoint += `&genre_include=${encodeURIComponent(genre)}`;

    const res = await fetchAPI(endpoint);
    if (!res) return { data: [], pagination: null };
    return {
      data: (res.data || []).map((item) => ({
        title: item.title,
        slug: toSlug(item.title) || item.manga_id || item.slug,
        image: proxyImage(item.cover_portrait || item.cover || item.thumbnail),
        chapter: item.latest_chapter
          ? `Chapter ${item.latest_chapter}`
          : item.chapter || "",
        score: item.rating || item.score || "",
        type: item.format || item.type || "Manhwa",
      })),
      pagination: res.pagination || null,
    };
  },

  getDetail: getDetail,
  getChapter: getChapter,
};
