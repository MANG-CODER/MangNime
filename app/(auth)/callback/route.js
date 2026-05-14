import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/"; // Default ke beranda

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // =================================================================
      // KUNCI PERBAIKAN VERCEL: Gunakan X-Forwarded-Host
      // Memastikan domain dan HTTPS tetap aman saat melewati Load Balancer
      // =================================================================
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        // Jika jalan di localhost PC Anda
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // Jika jalan di Vercel (Produksi)
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        // Fallback terakhir
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // JIKA ERROR ATAU TIDAK ADA CODE (Misal: User batal login)
  // Terapkan keamanan Vercel di sini juga
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
