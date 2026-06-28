import { NextResponse } from "next/server";

export async function GET() {
  // Samakan angka ini dengan total halaman di sitemap.js kamu
  const totalSitemaps = 50;
  const baseUrl = "https://mangnime.my.id";

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (let i = 1; i <= totalSitemaps; i++) {
    xml += `
  <sitemap>
    <loc>${baseUrl}/sitemap/${i}.xml</loc>
  </sitemap>`;
  }

  xml += `\n</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
