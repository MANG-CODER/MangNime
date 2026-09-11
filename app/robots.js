export default function robots() {
  return {
    rules: [
      {
        // Daftar bot yang diblokir sepenuhnya
        userAgent: [
          "ClaudeBot",
          "Claude-SearchBot",
          "anthropic-ai",
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "Google-Extended",
          "CCBot",
          "meta-externalagent",
          "facebookexternalhit",
          "meta-webindexer", // <--- Tambahan
          "Facebot",
          "HeadlessChrome",
          "Bytespider",
          "Amazonbot",
          "PetalBot",
          "AhrefsBot", // <--- Tambahan
        ],
        disallow: "/",
      },
      {
        // Aturan untuk bot biasa (Googlebot, Bingbot, dll)
        userAgent: "*",
        allow: "/",
        disallow: ["/komik/*/*", "/api/"],
      },
    ],
    sitemap: "https://mangnime.my.id/sitemap.xml",
  };
}
