import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Jika next kosong, atau "/", maka arahkan ke origin (beranda)
  const nextRaw = searchParams.get("next");
  const nextTarget = !nextRaw || nextRaw === "/" ? "" : nextRaw;

  // Membaca domain asli dari Load Balancer Vercel (Sangat Penting)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  // Menentukan Base URL yang benar (Localhost vs Vercel)
  const baseUrl = isLocalEnv
    ? origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  // 1. Jika ada 'code', lakukan autentikasi session
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
      // Redirect ke target! Jika nextTarget kosong, dia akan redirect ke baseUrl (Home)
      return NextResponse.redirect(`${baseUrl}${nextTarget}`);
    }
  }

  // 2. Jika kode tidak ada atau error saat menukar token, balik ke Login
  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
