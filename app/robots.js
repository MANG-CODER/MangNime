export default function robots() {
  return {
    rules: [
      {
        // 1. Daftar bot AI & Scraper berat yang diblokir sepenuhnya
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
          "meta-webindexer",
          "Facebot",
          "HeadlessChrome",
          "Bytespider",
          "Amazonbot",
          "PetalBot",
          "AhrefsBot",
        ],
        disallow: "/",
      },
      {
        // 2. Aturan untuk mesin pencari utama (Googlebot, Bingbot, dll)
        userAgent: "*",
        allow: "/",
        disallow: [
          "/komik/*/*",
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
