import { AnimeProvider } from "@/services/providers";

export default async function sitemap() {
  const baseUrl = "https://mangnime.my.id";

  const staticRoutes = ["", "/ongoing", "/completed", "/search"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1.0 : 0.8,
    }),
  );

  try {
    const [ongoingRes, completedRes] = await Promise.allSettled([
      AnimeProvider.Otakudesu.getOngoing(1),
      AnimeProvider.Otakudesu.getCompleted(1),
    ]);

    const ongoingList =
      ongoingRes.status === "fulfilled" ? ongoingRes.value?.data || [] : [];
    const completedList =
      completedRes.status === "fulfilled" ? completedRes.value?.data || [] : [];

    const dynamicRoutes = [...ongoingList, ...completedList].map((anime) => {
      const identifier = anime.animeId || anime.slug;
      return {
        url: `${baseUrl}/anime/${identifier}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      };
    });

    return [...staticRoutes, ...dynamicRoutes];
  } catch (error) {
    console.error("Gagal generate sitemap dinamis:", error);
    return staticRoutes;
  }
}
