import { proxyImage } from "@/utils/shinigamiProxy";
import { coreFetcher } from "./core/fetcher";
import {
  getCache,
  setCache,
  withSingleflight,
  registerMangaSlug,
  getMangaUuid,
} from "./core/cache";

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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper untuk mengekstrak slug sekaligus menyimpan mapping slug -> manga_id ke memori
function extractAndRegisterSlug(item) {
  const slug = item.slug || toSlug(item.title) || item.manga_id || "";
  if (item.manga_id) {
    registerMangaSlug(slug, item.manga_id);
    if (item.title) registerMangaSlug(toSlug(item.title), item.manga_id);
  }
  return slug;
}

// Shinigami: Sekarang otomatis melewati coreFetcher (L1/L2 Cache + Singleflight + Netlify Proxy)
const fetchAPI = async (endpoint, ttlSeconds) => {
  const fullUrl = `${SHINIGAMI_BASE_URL}${endpoint}`;
  return coreFetcher(fullUrl, {
    bucket: "komik",
    proxyType: "netlify",
    ttlSeconds,
    silentFail: true,
  });
};

// Komiku: Melewati coreFetcher dengan Direct Fetch
const fetchKomikuAPI = async (endpoint, ttlSeconds = 3600) => {
  const fullUrl = `${KOMIKU_BASE_URL}${endpoint}`;
  return coreFetcher(fullUrl, {
    bucket: "komiku",
    proxyType: "direct",
    ttlSeconds,
    silentFail: true,
  });
};

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
  const prevRaw =
    raw.navigation?.previousChapter ||
    raw.navigation?.prev_chapter ||
    raw.prev_chapter ||
    null;
  const nextRaw =
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

/**
 * Resolve Slug ke UUID Shinigami dengan 0 API Call jika sudah ada di Registry!
 */
async function resolveMangaId(slugOrId) {
  if (!slugOrId) return "";
  if (UUID_REGEX.test(slugOrId)) return slugOrId;

  // 1. Cek di Registry Memori (Diisi otomatis oleh Home/Latest/Popular/Genre/Search)
  const registeredUuid = getMangaUuid(slugOrId);
  if (registeredUuid) return registeredUuid;

  // 2. Jika user masuk via direct link pada cold start, cari sekali lalu simpan permanen (7 hari)
  const keyword = slugOrId.replace(/-/g, " ");
  try {
    const searchRes = await fetchAPI(
      `${SHINIGAMI_ENDPOINTS.SEARCH}${encodeURIComponent(keyword)}`,
      7 * 24 * 3600,
    );
    const items = searchRes?.data || searchRes || [];
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((it) => extractAndRegisterSlug(it));

      const matched =
        items.find(
          (item) =>
            item.slug === slugOrId ||
            toSlug(item.title) === slugOrId ||
            item.title?.toLowerCase().includes(keyword.toLowerCase()),
        ) || items[0];

      const resolved = matched.manga_id || matched.slug;
      if (resolved) {
        registerMangaSlug(slugOrId, resolved);
        return resolved;
      }
    }
  } catch (e) {
    console.error("Gagal resolve manga ID:", e.message);
  }
  return slugOrId;
}

const getDetail = async (slugOrId) => {
  if (!slugOrId) return null;

  const detailCacheKey = `komik_detail_assembled_${slugOrId}`;
  const cachedDetail = getCache(detailCacheKey);
  if (cachedDetail) return cachedDetail;

  return withSingleflight(detailCacheKey, async () => {
    if (slugOrId.startsWith("komikudetail-")) {
      const realSlug = slugOrId.replace("komikudetail-", "");
      const komikuJson = await fetchKomikuAPI(
        `${KOMIKU_ENDPOINTS.DETAIL}${realSlug}`,
        7200,
      );
      if (komikuJson && !komikuJson.error) {
        const result = normalizeKomikuDetail(komikuJson);
        setCache(detailCacheKey, result, 7200);
        return result;
      }
      return null;
    }

    const mangaId = await resolveMangaId(slugOrId);
    const [detailRes, chaptersFirstPageRes] = await Promise.all([
      fetchAPI(`${SHINIGAMI_ENDPOINTS.DETAIL}${mangaId}`, 7200),
      fetchAPI(`${SHINIGAMI_ENDPOINTS.CHAPTERS}${mangaId}?page=1`, 1800),
    ]);

    const raw = detailRes?.data;
    if (!raw) return null;

    if (raw.manga_id) {
      registerMangaSlug(slugOrId, raw.manga_id);
      if (raw.title) registerMangaSlug(toSlug(raw.title), raw.manga_id);
    }

    const chaptersList = chaptersFirstPageRes?.data || [];
    const typeFormat =
      Array.isArray(raw.format) && raw.format.length > 0
        ? raw.format[0].name
        : raw.format || "Manhwa";

    const assembled = {
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

    setCache(detailCacheKey, assembled, 1800);
    return assembled;
  });
};

const getChapter = async (mangaSlugOrId, chapterSlugOrNum) => {
  if (!chapterSlugOrNum) return null;

  const chapterCacheKey = `komik_chapter_assembled_${mangaSlugOrId}_${chapterSlugOrNum}`;
  const cachedChapter = getCache(chapterCacheKey);
  if (cachedChapter) return cachedChapter;

  return withSingleflight(chapterCacheKey, async () => {
    if (
      typeof mangaSlugOrId === "string" &&
      mangaSlugOrId.startsWith("komikudetail-")
    ) {
      const targetSlug = chapterSlugOrNum.replace("komikuchapter-", "");
      const komikuRes = await fetchKomikuAPI(
        `${KOMIKU_ENDPOINTS.CHAPTER}${targetSlug}`,
        86400,
      );
      if (komikuRes && !komikuRes.error) {
        const normalized = normalizeKomikuChapter(komikuRes);
        setCache(chapterCacheKey, normalized, 86400);
        return normalized;
      }
      return null;
    }

    let targetChapterId = chapterSlugOrNum;

    if (!UUID_REGEX.test(targetChapterId)) {
      const uuidMatch = targetChapterId.match(
        /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
      );
      if (uuidMatch) {
        targetChapterId = uuidMatch[1];
      } else {
        const mangaId = await resolveMangaId(mangaSlugOrId);
        const cleanNum = String(chapterSlugOrNum).replace(/[^0-9.]/g, "");
        const detailRes = await fetchAPI(
          `${SHINIGAMI_ENDPOINTS.CHAPTERS}${mangaId}?page=1`,
          1800,
        );
        const found = (detailRes?.data || []).find(
          (ch) => String(ch.chapter_number) === cleanNum,
        );
        if (found) targetChapterId = found.chapter_id;
      }
    }

    if (!UUID_REGEX.test(targetChapterId)) return null;

    const res = await fetchAPI(
      `${SHINIGAMI_ENDPOINTS.READ}${targetChapterId}`,
      86400,
    );
    if (!res || !res.data) return null;

    const raw = res.data;
    const rawImages = raw.images || raw.pages || [];
    const formatChSlug = (chNum, chId) =>
      chId ? `chapter-${chNum ?? "0"}-${chId}` : null;
    const prevChapter = raw.prev_chapter || null;
    const nextChapter = raw.next_chapter || null;

    const result = {
      chapterTitle: raw.chapter_number
        ? `Chapter ${raw.chapter_number}`
        : raw.chapter_title || raw.title || "",
      createdAt: raw.updated_at || raw.release_date || "",
      images: rawImages.map((img) =>
        proxyImage(typeof img === "string" ? img : img.url || img.image),
      ),
      prevChapterSlug: prevChapter?.chapter_id
        ? formatChSlug(prevChapter.chapter_number, prevChapter.chapter_id)
        : null,
      nextChapterSlug: nextChapter?.chapter_id
        ? formatChSlug(nextChapter.chapter_number, nextChapter.chapter_id)
        : null,
    };

    setCache(chapterCacheKey, result, 86400);
    return result;
  });
};

export const KomikProvider = {
  getHome: async () => {
    const res = await fetchAPI(SHINIGAMI_ENDPOINTS.HOME, 1800);
    if (!res) return { latest: [], popular: [], recommendations: [] };

    const formatItems = (list) => {
      if (!Array.isArray(list)) return [];
      return list.map((item) => ({
        title: item.title,
        slug: extractAndRegisterSlug(item),
        mangaId: item.manga_id,
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
    const res = await fetchAPI(
      `${SHINIGAMI_ENDPOINTS.LATEST}?page=${page}`,
      1200,
    );
    if (!res) return { data: [], pagination: null };
    return {
      data: (res.data || []).map((item) => ({
        title: item.title,
        slug: extractAndRegisterSlug(item),
        mangaId: item.manga_id,
        image: proxyImage(item.thumbnail || item.cover),
        chapter: item.chapter || item.latest_chapter || "",
        score: item.rating || "",
      })),
      pagination: res.pagination || null,
    };
  },

  getPopular: async (page = 1) => {
    const res = await fetchAPI(
      `${SHINIGAMI_ENDPOINTS.POPULAR}?page=${page}`,
      3600,
    );
    if (!res) return { data: [], pagination: null };
    return {
      data: (res.data || []).map((item) => ({
        title: item.title,
        slug: extractAndRegisterSlug(item),
        mangaId: item.manga_id,
        image: proxyImage(item.thumbnail || item.cover),
        chapter: item.chapter || item.latest_chapter || "",
        score: item.rating || "",
      })),
      pagination: res.pagination || null,
    };
  },

  getGenres: async () => {
    const res = await fetchAPI(SHINIGAMI_ENDPOINTS.GENRES, 7 * 24 * 3600);
    if (!res || !res.data) return [];
    return res.data.map((genre) => ({
      name: genre.name || genre.title || "Unknown",
      slug: genre.slug || genre.id || "",
    }));
  },

  search: async (keyword, page = 1) => {
    const cleanKeyword = (keyword || "").trim().toLowerCase();
    if (!cleanKeyword) return { data: [], pagination: null, message: null };

    const searchCacheKey = `komik_combined_search_${cleanKeyword}_p${page}`;
    const cachedSearch = getCache(searchCacheKey);
    if (cachedSearch) return cachedSearch;

    return withSingleflight(searchCacheKey, async () => {
      const [shinigamiRes, komikuJson] = await Promise.all([
        fetchAPI(
          `${SHINIGAMI_ENDPOINTS.SEARCH}${encodeURIComponent(
            cleanKeyword,
          )}?page=${page}`,
          1800,
        ),
        fetchKomikuAPI(
          `${KOMIKU_ENDPOINTS.SEARCH}${encodeURIComponent(cleanKeyword)}`,
          1800,
        ),
      ]);

      const shinigamiList = shinigamiRes?.data || shinigamiRes || [];
      const pagination = shinigamiRes?.pagination || null;
      const komikuList =
        komikuJson?.status && Array.isArray(komikuJson.data)
          ? komikuJson.data.map(normalizeKomikuSearch)
          : [];

      const formattedShinigami = Array.isArray(shinigamiList)
        ? shinigamiList.map((item) => ({
            title: item.title,
            slug: extractAndRegisterSlug(item),
            mangaId: item.manga_id,
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
        if (!item?.title) return;
        const cleanTitle = item.title.toLowerCase().trim();
        if (!combinedMap.has(cleanTitle)) {
          combinedMap.set(cleanTitle, item);
        }
      });

      const finalOutput = {
        data: Array.from(combinedMap.values()),
        pagination,
        message: null,
      };

      if (finalOutput.data.length > 0) {
        setCache(searchCacheKey, finalOutput, 1800);
      }

      return finalOutput;
    });
  },

  getKomikByGenre: async (genreSlug, page = 1) => {
    const endpoint = `${SHINIGAMI_ENDPOINTS.ADVANCED_SEARCH}?genre_include=${genreSlug}&page=${page}`;
    const res = await fetchAPI(endpoint, 3600);
    if (!res) return { data: [], pagination: null };
    return {
      data: (res.data || []).map((item) => ({
        title: item.title,
        slug: extractAndRegisterSlug(item),
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

    const res = await fetchAPI(endpoint, 1800);
    if (!res) return { data: [], pagination: null };
    return {
      data: (res.data || []).map((item) => ({
        title: item.title,
        slug: extractAndRegisterSlug(item),
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

  getDetail,
  getChapter,
};
