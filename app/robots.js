// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        // 1. Daftar bot AI, SEO & Scraper berat yang diblokir sepenuhnya
        userAgent: [
          "Reflectionbot",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-Web",
          "anthropic-ai",
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "GoogleOther",
          "CCBot",
          "meta-externalagent",
          "facebookexternalhit",
          "meta-webindexer",
          "Facebot",
          "HeadlessChrome",
          "Bytespider",
          "TikTokSpider",
          "Amazonbot",
          "Applebot-Extended",
          "PetalBot",
          "AhrefsBot",
          "SemrushBot",
          "DotBot",
          "MJ12bot",
          "BLEXBot",
          "DataForSeoBot",
          "Diffbot",
          "ImagesiftBot",
          "YouBot",
          "Scrapy",
          "YandexBot",
          "Baiduspider",
          "DuckDuckBot",
        ],
        disallow: "/",
      },
      {
        // 2. Aturan untuk mesin pencari utama (Googlebot, Bingbot)
        userAgent: "*",
        allow: "/",
        disallow: [
          "/anime/*/*", // Blokir halaman episode/streaming di dalam detail anime
          "/episode/", // Blokir jika ada route /episode/...
          "/batch/", // Blokir jika ada route /batch/...
          "/watch/", // Blokir jika ada route /watch/...
          "/komik/*/*", // Blokir halaman baca chapter komik
          "/api/",
          "/callback",
          "/profile",
          "/bookmark",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/maintenance",
        ],
      },
    ],
    sitemap: "https://mangnime.my.id/sitemap.xml",
    host: "https://mangnime.my.id",
  };
}
