export default function robots() {
  return {
    rules: [
    {
        userAgent: ['ClaudeBot', 'GPTBot', 'ChatGPT-User', 'CCBot'],
        disallow: '/',
      },
      {
      userAgent: "*",
      allow: "/",
      disallow: "/komik/*/*", // Memblokir semua rute chapter
    },
    // Opsional
    // sitemap: 'https://mangnime.vercel.app/sitemap.xml',
  ]};
}
