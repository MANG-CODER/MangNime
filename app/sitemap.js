export default function sitemap() {
  const baseUrl = "https://mangnime.my.id";

  const staticLastModified = new Date("2026-09-11T00:00:00.000Z");

  return [
    "",
    "/ongoing",
    "/completed",
    "/search",
    "/komik/latest",
    "/komik/popular",
    "/komik/genres",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticLastModified,
    changeFrequency:
      route === "" || route.includes("/komik/") ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
