import { NextResponse } from "next/server";

const rateLimitMap = new Map();

// 🔧 true = seluruh website dalam maintenance
const MAINTENANCE_MODE = false;

// 1. Hanya izinkan bot mesin pencari utama untuk SEO (Google & Bing)
// Catatan: GoogleOther & YandexBot dihapus karena sering nyepam request tanpa bantu ranking Google Search
const GOOD_BOTS = /googlebot|google-inspectiontool|bingbot/i;

// 2. Tangkap SEMUA jenis bot/crawler/scraper/AI (termasuk yang mengandung kata "bot" seperti Reflectionbot)
const ALL_BOTS_AND_SCRAPERS =
  /bot|crawler|spider|crawling|scraper|reflection|claude|anthropic|gpt|chatgpt|oai-search|perplexity|meta-externalagent|facebookexternalhit|facebot|ccbot|headless|google-extended|googleother|bytespider|tiktokspider|amazonbot|applebot|petalbot|ahrefs|semrush|mj12bot|dotbot|blexbot|yandex|baiduspider|duckduckbot|slurp|meta-webindexer|diffbot|imagesift|youbot|scrapy|python|curl|wget|urllib|axios|go-http-client|node-fetch|undici|httpie|postman/i;

// 3. Route berat yang memicu request ke Proxy API (Episode, Batch, Chapter Komik)
// Bot SEO (Googlebot/Bingbot) TIDAK BOLEH masuk ke route ini agar proxy tidak kena ban
function isHeavyProxyRoute(pathname) {
  return (
    pathname.includes("/episode") ||
    pathname.includes("/batch") ||
    pathname.includes("/watch") ||
    pathname.startsWith("/api/") ||
    /^\/anime\/[^/]+\/[^/]+/.test(pathname) || // Contoh: /anime/[slug]/[episode]
    (/^\/komik\/[^/]+\/[^/]+/.test(pathname) && // Contoh: /komik/[slug]/[chapter] (kecuali /komik/genre/*)
      !pathname.startsWith("/komik/genre/"))
  );
}

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent") || "";

  // =========================================================
  // 0. BYPASS MUTLAK: SITEMAP, ROBOTS.TXT, & ASET STATIS
  // (Agar Googlebot & GSC Inspection Tool tidak pernah terhalang)
  // =========================================================
  if (
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap-index.xml" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/img/") ||
    pathname.startsWith("/assets/") ||
    /\.(ico|png|jpg|jpeg|svg|webp|gif|avif|css|js|woff|woff2|ttf|xml|txt)$/i.test(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  // =========================================================
  // 1. MAINTENANCE MODE
  // =========================================================
  if (MAINTENANCE_MODE && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // =========================================================
  // 2. PROTEKSI ANTI-BOT & CRAWLER (PRIORITAS TERTINGGI)
  // =========================================================
  // Blokir request yang tidak punya User-Agent sama sekali (biasanya script bot)
  if (!userAgent || userAgent.trim().length < 10) {
    return new NextResponse(null, { status: 403 });
  }

  // Cek apakah User-Agent terindikasi sebagai Bot / Scraper
  if (ALL_BOTS_AND_SCRAPERS.test(userAgent)) {
    // A. Jika BUKAN Googlebot/Bingbot (misal Reflectionbot, ClaudeBot, dll) -> BLOKIR TOTAL!
    if (!GOOD_BOTS.test(userAgent)) {
      return new NextResponse(null, { status: 403 });
    }

    // B. Jika Googlebot/Bingbot mencoba masuk ke halaman Episode/Batch/Chapter -> BLOKIR!
    // (Cukup biarkan Google mengindeks halaman Home, Genre, dan Detail Sinopsis Anime/Komik saja)
    if (isHeavyProxyRoute(pathname)) {
      return new NextResponse("Crawling episode/chapter routes is disallowed", {
        status: 403,
        headers: { "X-Robots-Tag": "noindex, nofollow" },
      });
    }

    // C. Googlebot/Bingbot di halaman aman (Home, Detail Anime/Komik, Genre) -> IZINKAN
    return NextResponse.next();
  }

  // =========================================================
  // 3. WHITELIST & PREFETCH (HANYA UNTUK USER MANUSIA)
  // =========================================================
  // Ambil IP asli paling depan jika lewat proxy/Cloudflare
  const rawForwarded = request.headers.get("x-forwarded-for");
  const ip =
    request.ip ||
    (rawForwarded ? rawForwarded.split(",")[0].trim() : "unknown");

  // Whitelist IP Developer
  const whitelistedIps = ["125.160.210.25", "127.0.0.1", "::1"];
  if (whitelistedIps.includes(ip)) {
    return NextResponse.next();
  }

  // Bypass Next.js Prefetch (setelah dipastikan bukan bot di tahap 2)
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    return NextResponse.next();
  }

  // =========================================================
  // 4. RATE LIMITING (UNTUK MENCEGAH SPAM DARI BROWSER/FAKE UA)
  // =========================================================
  const LIMIT = 40;
  const TIME_WINDOW_MS = 60 * 1000;

  if (ip !== "unknown") {
    const currentTime = Date.now();

    // Bersihkan map jika sudah terlalu besar agar tidak bocor memori
    if (rateLimitMap.size > 5000) {
      rateLimitMap.clear();
    }

    const requestData = rateLimitMap.get(ip) || {
      count: 0,
      startTime: currentTime,
    };

    if (currentTime - requestData.startTime > TIME_WINDOW_MS) {
      requestData.count = 1;
      requestData.startTime = currentTime;
    } else {
      requestData.count++;
    }

    rateLimitMap.set(ip, requestData);

    if (requestData.count > LIMIT) {
      console.log(
        `[BLOCKED] IP ${ip} melebihi limit. Count: ${requestData.count}`,
      );

      return new NextResponse(
        JSON.stringify({
          error: "Terlalu banyak request. Silakan coba lagi nanti.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|sitemap-index.xml|robots.txt).*)",
  ],
};
