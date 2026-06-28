export default function robots() {
  return {
    rules: [
      {
        // Daftar bot yang diblokir sepenuhnya
        userAgent: [
          "ClaudeBot",
          "Claude-SearchBot", // Bot spesifik yang muncul di log kamu
          "anthropic-ai",
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "Google-Extended", // Bot AI Google
          "CCBot",
          "meta-externalagent",
          "facebookexternalhit",
          "Facebot",
          "HeadlessChrome",
          "Bytespider", // Bot scraping agresif milik Bytedance
          "Amazonbot",
          "PetalBot",
        ],
        disallow: "/",
      },
      {
        // Aturan untuk bot biasa (seperti Googlebot normal, Bingbot, dll)
        userAgent: "*",
        allow: "/",
        disallow: ["/komik/*/*", "/api/", "/_next/"],
      },
    ],
    sitemap: "https://mangnime.my.id/sitemap.xml",
  };
}
