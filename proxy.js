import { NextResponse } from "next/server";

const rateLimitMap = new Map();

// 🔧 true = seluruh website dalam maintenance
const MAINTENANCE_MODE = true;

export function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // =========================================================
  // MAINTENANCE MODE
  // Semua halaman dan API diarahkan ke /maintenance
  // kecuali halaman maintenance dan asset Next.js.
  // =========================================================

  if (
    MAINTENANCE_MODE &&
    pathname !== "/maintenance" &&
    !pathname.startsWith("/_next/")
  ) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  // =========================================================
  // BYPASS ASSET STATIS
  // Supaya halaman maintenance tetap bisa mengambil CSS,
  // JS, gambar, font, dll.
  // =========================================================

  if (
    pathname.startsWith("/_next/") ||
    pathname.match(
      /\.(ico|png|jpg|jpeg|svg|webp|gif|avif|css|js|woff|woff2|ttf)$/i,
    )
  ) {
    return NextResponse.next();
  }

  // =========================================================
  // NORMAL SECURITY LOGIC
  // Akan aktif kembali ketika MAINTENANCE_MODE = false
  // =========================================================

  const userAgent = request.headers.get("user-agent") || "";

  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // 1. WHITELIST IP DEVELOPER
  const whitelistedIps = ["125.160.210.25", "127.0.0.1", "::1"];

  if (whitelistedIps.includes(ip)) {
    return NextResponse.next();
  }

  // 2. BYPASS NEXT.JS PREFETCH
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    return NextResponse.next();
  }

  // 3. GOOD BOTS
  const goodBots = /googlebot|bingbot|yandexbot|slurp/i;

  if (goodBots.test(userAgent)) {
    return NextResponse.next();
  }

  // 4. BAD BOTS
  const badBots =
    /claude-searchbot|claudebot|anthropic|gptbot|chatgpt-user|oai-searchbot|meta-externalagent|facebookexternalhit|facebot|ccbot|headlesschrome|google-extended|bytespider|amazonbot|petalbot/i;

  if (badBots.test(userAgent)) {
    return new NextResponse(null, { status: 403 });
  }

  // 5. RATE LIMIT
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
    /*
     * Jalankan proxy untuk SEMUA request,
     * termasuk /api.
     *
     * Asset internal Next.js tetap kita bypass
     * di dalam function.
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|sitemap-index.xml|robots.txt).*)",
  ],
};
