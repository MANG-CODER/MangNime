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
          "Facebot",
          "HeadlessChrome",
          "Bytespider",
          "Amazonbot",
          "PetalBot",
        ],
        disallow: "/",
      },
      {
        // Aturan untuk bot biasa (Googlebot, Bingbot, dll)
        userAgent: "*",
        allow: "/",
        // PERHATIKAN: /_next/ sudah dihapus dari sini!
        disallow: ["/komik/*/*", "/api/"],
      },
    ],
    // PERHATIKAN: Gunakan URL publik yang lengkap
    sitemap: "https://mangnime.my.id/sitemap-index.xml",
  };
}
