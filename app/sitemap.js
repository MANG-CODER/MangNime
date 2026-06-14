import { AnimeProvider } from "@/services/providers";
import { getLatestKomik, getPopularKomik } from "@/services/komikApi";

export const revalidate = 86400; // cache 24 jam

export default async function sitemap() {
  const baseUrl = "https://mangnime.my.id";

  const staticRoutes = [
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

  let dynamicRoutes = [];

  try {
    const [
      otakuOngoing,
      otakuCompleted,
      alqOngoing,
      alqCompleted,
      komikLatest,
      komikPopular,
    ] = await Promise.allSettled([
      AnimeProvider.Otakudesu.getOngoing(1),
      AnimeProvider.Otakudesu.getCompleted(1),
      AnimeProvider.Alqanime.getOngoing(1),
      AnimeProvider.Alqanime.getCompleted(1),
      getLatestKomik(1),
      getPopularKomik(1),
    ]);

    const getAnimeData = (result) =>
      result.status === "fulfilled" ? result.value?.data || [] : [];

    // ANIME (Otakudesu + Alqanime, gabung & dedup by animeId/slug)
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

    // KOMIK (struktur: value.data.data adalah array)
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
    console.error("Gagal generate sitemap dinamis:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
