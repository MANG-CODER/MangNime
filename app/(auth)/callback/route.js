import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  // 1. Ambil parameter 'next' dan terjemahkan (Decode) %2F menjadi /
  // Jika tipe adalah 'recovery' (lupa password) dan 'next' kosong, arahkan otomatis ke /reset-password
  let nextRaw = requestUrl.searchParams.get("next");
  let defaultNext = type === "recovery" ? "/reset-password" : "/";
  let next = nextRaw ? decodeURIComponent(nextRaw) : defaultNext;
  if (!next.startsWith("/")) next = `/${next}`;

  // 2. Proteksi Load Balancer (Vercel vs Localhost)
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv
    ? requestUrl.origin
    : process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  // 3. Proses Tukar Code (OAuth / PKCE) atau Token Hash (Email Recovery) dengan Sesi Login
  if (code || (token_hash && type)) {
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
              // Abaikan jika dipanggil dari Server Component
            }
          },
        },
      },
    );

    // Jalur A: Login Google / Register / Reset Password via PKCE Code
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${baseUrl}${next}`);
      }
    }

    // Jalur B: Reset Password / Verifikasi Email via Token Hash
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });
      if (!error) {
        return NextResponse.redirect(`${baseUrl}${next}`);
      }
    }
  }

  // Jika gagal, kembalikan ke halaman login
  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`);
}
