import { AnimeProvider } from "@/services/providers";
import { getLatestKomik, getPopularKomik } from "@/services/komikApi";

export const revalidate = 86400;

// 1. TENTUKAN BERAPA BANYAK SITEMAP YANG MAU DIBUAT
export async function generateSitemaps() {
  // Misalnya, kamu ingin meng-generate data dari halaman 1 sampai halaman 50.
  // (Kamu bisa menyesuaikan angka ini, atau mengambil "total halaman" dari API kamu jika ada)
  const totalPagesToScrape = 50;

  // Ini akan menghasilkan array [{ id: 1 }, { id: 2 }, ..., { id: 50 }]
  return Array.from({ length: totalPagesToScrape }, (_, i) => ({
    id: i + 1,
  }));
}

// 2. GENERATE SITEMAP BERDASARKAN ID (Nomor Halaman)
export default async function sitemap({ id }) {
  const resolvedId = await id;

  const baseUrl = "https://mangnime.my.id";

  // Rute statis HANYA dimunculkan di sitemap pertama (id = 1) agar tidak duplikat
  let staticRoutes = [];
  if (resolvedId === 1) {
    staticRoutes = [
      "",
      "/ongoing",
      "/completed",
      "/movies",
      "/search",
      "/komik/latest",
      "/komik/popular",
      "/komik/genres",
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1.0 : 0.8,
    }));
  }

  let dynamicRoutes = [];

  try {
    // Gunakan parameter 'id' sebagai nomor halaman yang akan di-fetch
    const [
      otakuOngoing,
      otakuCompleted,
      alqOngoing,
      alqCompleted,
      komikLatest,
      komikPopular,
    ] = await Promise.allSettled([
      AnimeProvider.Otakudesu.getOngoing(resolvedId),
      AnimeProvider.Otakudesu.getCompleted(resolvedId),
      AnimeProvider.Alqanime.getOngoing(resolvedId),
      AnimeProvider.Alqanime.getCompleted(resolvedId),
      getLatestKomik(resolvedId),
      getPopularKomik(resolvedId),
    ]);
    const getAnimeData = (result) =>
      result.status === "fulfilled" ? result.value?.data || [] : [];

    // Proses gabung & dedup ANIME
    const animeMap = new Map();
    [
      ...getAnimeData(otakuOngoing),
      ...getAnimeData(otakuCompleted),
      ...getAnimeData(alqOngoing),
      ...getAnimeData(alqCompleted),
    ].forEach((anime) => {
      const identifier = anime.animeId || anime.slug;
      if (identifier && !animeMap.has(identifier)) {
        animeMap.set(identifier, {
          url: `${baseUrl}/anime/${identifier}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    });
    const animeRoutes = Array.from(animeMap.values());

    // Proses gabung & dedup KOMIK
    const getKomikData = (result) =>
      result.status === "fulfilled" ? result.value?.data?.data || [] : [];

    const komikMap = new Map();
    [...getKomikData(komikLatest), ...getKomikData(komikPopular)].forEach(
      (komik) => {
        const slug = komik.slug;
        if (slug && !komikMap.has(slug)) {
          komikMap.set(slug, {
            url: `${baseUrl}/komik/${slug}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.6,
          });
        }
      },
    );
    const komikRoutes = Array.from(komikMap.values());

    dynamicRoutes = [...animeRoutes, ...komikRoutes];
  } catch (error) {
    console.error(`Gagal generate sitemap dinamis untuk ID ${id}:`, error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
