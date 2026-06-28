import { NextResponse } from "next/server";

// Menyimpan data request IP secara in-memory
const rateLimitMap = new Map();

export function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // 1. BLOKIR USER AGENT BOT NAKAL
  const badBots =
    /meta-externalagent|facebookexternalhit|claudebot|gptbot|chatgpt-user|ccbot|headlesschrome/i;

  if (badBots.test(userAgent)) {
    // Kembalikan status 403 Forbidden tanpa menyentuh halaman Next.js
    return new NextResponse(null, { status: 403 });
  }

  // 2. RATE LIMITING BERDASARKAN IP
  // Konfigurasi batas request
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

    // Jika IP melebihi batas request, blokir dengan status 429 (Too Many Requests)
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

// Konfigurasi path mana saja yang akan dicek oleh middleware ini
export const config = {
  matcher: [
    /*
     * Cek semua halaman kecuali:
     * - api (jika api punya proteksi sendiri)
     * - _next/static (file statis)
     * - _next/image (optimasi gambar)
     * - favicon.ico, sitemap.xml, robots.txt (file publik standar)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
