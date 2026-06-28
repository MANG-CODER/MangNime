import { NextResponse } from "next/server";

const rateLimitMap = new Map();

// Ubah nama fungsi menjadi proxy
export function proxy(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // Pengecualian untuk bot mesin pencari yang sah (Good Bots)
  const goodBots = /googlebot|bingbot|yandexbot|slurp/i;

  if (goodBots.test(userAgent)) {
    return NextResponse.next();
  }

  // 1. BLOKIR USER AGENT BOT NAKAL
  const badBots =
    /claude-searchbot|claudebot|anthropic|gptbot|chatgpt-user|oai-searchbot|meta-externalagent|facebookexternalhit|facebot|ccbot|headlesschrome|google-extended|bytespider|amazonbot|petalbot/i;

  if (badBots.test(userAgent)) {
    return new NextResponse(null, { status: 403 });
  }

  // 2. RATE LIMITING BERDASARKAN IP
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
