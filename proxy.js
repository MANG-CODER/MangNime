import { NextResponse } from "next/server";

const rateLimitMap = new Map();

export function proxy(request) {
  // 0. BYPASS ASET STATIS & GAMBAR DI AWAL (Agar log bersih)
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/_next/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|gif|avif)$/i)
  ) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // 1. WHITELIST IP DEVELOPER (Jalur VIP)
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

  // Pengecualian untuk bot mesin pencari yang sah
  const goodBots = /googlebot|bingbot|yandexbot|slurp/i;

  if (goodBots.test(userAgent)) {
    return NextResponse.next();
  }

  // 3. BLOKIR USER AGENT BOT NAKAL
  const badBots =
    /claude-searchbot|claudebot|anthropic|gptbot|chatgpt-user|oai-searchbot|meta-externalagent|facebookexternalhit|facebot|ccbot|headlesschrome|google-extended|bytespider|amazonbot|petalbot/i;

  if (badBots.test(userAgent)) {
    return new NextResponse(null, { status: 403 });
  }

  // 4. RATE LIMITING BERDASARKAN IP
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
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|sitemap-index.xml|robots.txt).*)",
  ],
};
