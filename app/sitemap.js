export default function sitemap() {
  const baseUrl = "https://mangnime.my.id";
  return [
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
