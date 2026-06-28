export default function robots() {
  return {
    rules: [
      {
        userAgent: [
          "ClaudeBot",
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "meta-externalagent",
          "facebookexternalhit",
          "HeadlessChrome",
        ],
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/komik/*/*", "/api/", "/_next/"],
      },
    ],
    sitemap: "https://mangnime.my.id/sitemap.xml",
  };
}
