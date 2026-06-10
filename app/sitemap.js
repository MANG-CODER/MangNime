export default function sitemap() {
  const baseUrl = "https://mangnime.my.id";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/ongoing`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/completed`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
    },
  ];
}
