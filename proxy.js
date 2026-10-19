import { NextResponse } from "next/server";

const rateLimitMap = new Map();

// 🔧 true = seluruh website dalam maintenance
const MAINTENANCE_MODE = false;

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent") || "";
  const host = request.headers.get("host") || "";

  if (host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

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
    pathname.match(
      /\.(ico|png|jpg|jpeg|svg|webp|gif|avif|css|js|woff|woff2|ttf|xml|txt)$/i,
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
  // 2. NORMAL SECURITY LOGIC
  // =========================================================
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // Whitelist IP Developer
  const whitelistedIps = ["125.160.210.25", "127.0.0.1", "::1"];
  if (whitelistedIps.includes(ip)) {
    return NextResponse.next();
  }

  // Bypass Next.js Prefetch
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    return NextResponse.next();
  }

  // Good Bots & Google Search Console Inspection Tools
  const goodBots =
    /googlebot|google-inspectiontool|googleother|bingbot|yandexbot|slurp/i;
  if (goodBots.test(userAgent)) {
    return NextResponse.next();
  }

  // Bad Bots & Generic Scrapers
  const badBots =
    /claude-searchbot|claudebot|anthropic|gptbot|chatgpt-user|oai-searchbot|meta-externalagent|facebookexternalhit|facebot|ccbot|headlesschrome|google-extended|bytespider|amazonbot|petalbot|ahrefsbot|meta-webindexer|scraper|python|curl|wget|urllib/i;

  if (badBots.test(userAgent)) {
    return new NextResponse(null, { status: 403 });
  }

  // Rate Limit
  const LIMIT = 40;
  const TIME_WINDOW_MS = 60 * 1000;

  if (ip !== "unknown") {
    const currentTime = Date.now();
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
