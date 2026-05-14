import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  // 1. Ambil parameter 'next' dan terjemahkan (Decode) %2F menjadi /
  let nextRaw = requestUrl.searchParams.get("next");
  let next = nextRaw ? decodeURIComponent(nextRaw) : "/";

  // Pastikan selalu diawali dengan slash (/) agar Next.js tidak bingung
  if (!next.startsWith("/")) next = `/${next}`;

  // 2. Proteksi Load Balancer (Vercel vs Localhost)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv
    ? requestUrl.origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : requestUrl.origin;

  // 3. Proses Tukar Code dengan Sesi Login
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
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch (error) {
              // Abaikan error di server component
            }
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ✅ SUCCESS: Redirect tepat ke halaman sebelumnya
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  // Jika gagal, kembalikan ke halaman login
  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
