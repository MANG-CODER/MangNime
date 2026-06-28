import { NextResponse } from "next/server";

// PENTING: In-memory Map di Middleware (Vercel Edge) akan sering ter-reset.
// Ini cukup untuk perlindungan dasar, tapi tidak akurat untuk rate-limiting global.
const rateLimitMap = new Map();

export function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // 1. BLOKIR USER AGENT BOT NAKAL
  // Diperbarui dengan alternatif bot AI dan scraper yang umum
  const badBots =
    /claude-searchbot|claudebot|anthropic|gptbot|chatgpt-user|oai-searchbot|meta-externalagent|facebookexternalhit|facebot|ccbot|headlesschrome|google-extended|bytespider|amazonbot|petalbot/i;

  if (badBots.test(userAgent)) {
    // Kembalikan status 403 Forbidden tanpa menyentuh halaman Next.js
    return new NextResponse(null, { status: 403 });
  }

  // 2. RATE LIMITING BERDASARKAN IP
  const LIMIT = 40; // Maksimal request per IP
  const TIME_WINDOW_MS = 60 * 1000; // 1 Menit

  if (ip !== "unknown") {
    const currentTime = Date.now();
    const requestData = rateLimitMap.get(ip) || {
      count: 0,
      startTime: currentTime,
    };

    // Reset hitungan jika sudah melewati batas waktu (1 menit)
    if (currentTime - requestData.startTime > TIME_WINDOW_MS) {
      requestData.count = 1;
      requestData.startTime = currentTime;
    } else {
      requestData.count++;
    }

    // Simpan kembali data terbaru ke map
    rateLimitMap.set(ip, requestData);

    // Jika IP melebihi batas request, blokir dengan status 429
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

  // Jika aman, lanjutkan request ke halaman tujuan
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
