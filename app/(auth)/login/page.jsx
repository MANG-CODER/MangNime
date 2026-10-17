"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    text: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const showAlert = (type, text) => {
    setAlertInfo({ show: true, type, text });
    setTimeout(() => {
      setAlertInfo({ show: false, type: "", text: "" });
    }, 5000);
  };

  const closeAlert = () => setAlertInfo({ show: false, type: "", text: "" });

  const getRedirectUrl = () => {
    const rawNext = searchParams.get("next");
    const nextParam =
      rawNext && rawNext !== "/" ? `?next=${encodeURIComponent(rawNext)}` : "";
    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    return `${base}/callback${nextParam}`;
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    closeAlert();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getRedirectUrl() },
    });
    if (error) {
      showAlert("error", "Gagal login dengan Google.");
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return showAlert("error", "Email dan password wajib diisi!");

    setLoading(true);
    closeAlert();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        showAlert("error", "Email belum dikonfirmasi. Cek kotak masuk Anda!");
      } else {
        showAlert("error", "Email atau password salah.");
      }
    } else {
      showAlert("success", "Berhasil masuk! Mengalihkan...");
      const rawNext = searchParams.get("next");
      router.push(rawNext && rawNext !== "/" ? rawNext : "/");
      router.refresh();
    }
    setLoading(false);
  };

  const nextTarget = searchParams.get("next")
    ? `?next=${encodeURIComponent(searchParams.get("next"))}`
    : "";

  return (
    <div className="min-h-[82vh] bg-[#161218] flex items-center justify-center relative px-4 overflow-hidden py-12">
      {alertInfo.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in w-[90%] max-w-md">
          <div
            className={`flex items-start justify-between p-4 rounded-2xl border backdrop-blur-2xl shadow-vogue-card ${
              alertInfo.type === "error"
                ? "bg-[#211B24]/95 border-[#E88D9E]/60 text-[#FDF6F7]"
                : "bg-[#211B24]/95 border-[#F4B8C6]/60 text-[#FDF6F7]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#F4B8C6]/20 text-[#F4B8C6] flex items-center justify-center text-xs font-extrabold shrink-0">
                {alertInfo.type === "error" ? "!" : "✓"}
              </span>
              <p className="text-xs md:text-sm font-medium">{alertInfo.text}</p>
            </div>
            <button
              onClick={closeAlert}
              className="ml-4 text-[#AD9CA6] hover:text-[#FDF6F7]"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-[#211B24]/90 backdrop-blur-2xl border border-[#F4B8C6]/25 rounded-[32px] p-8 md:p-10 shadow-vogue-card relative z-10 animate-fade-in">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/img/logo.svg"
              alt="MangNime"
              width={160}
              height={44}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="text-center mb-7">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FDF6F7]">
            Masuk ke{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              MangNime
            </span>
          </h1>
          <p className="text-xs text-[#AD9CA6] mt-1">
            Sinkronkan komentar dan profil komunitasmu
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 bg-[#FDF6F7] text-[#161218] font-extrabold text-xs md:text-sm rounded-full hover:bg-white transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50 mb-6 active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Lanjutkan dengan Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#F4B8C6]/15" />
          <span className="text-[#AD9CA6] text-[10px] font-bold tracking-[0.2em] uppercase">
            Atau Email
          </span>
          <div className="flex-1 h-px bg-[#F4B8C6]/15" />
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AD9CA6] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-[#161218] border border-[#F4B8C6]/20 text-[#FDF6F7] text-sm rounded-2xl px-4 py-3 outline-none focus:border-[#F4B8C6] transition-all"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#AD9CA6]">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#F4B8C6] hover:underline"
              >
                Lupa Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#161218] border border-[#F4B8C6]/20 text-[#FDF6F7] text-sm rounded-2xl px-4 py-3 outline-none focus:border-[#F4B8C6] transition-all"
            />
          </div>
          <div className="pt-3 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold text-xs md:text-sm rounded-full shadow-vogue-blush active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "MEMPROSES..." : "MASUK SEKARANG"}
            </button>

            <Link
              href={`/register${nextTarget}`}
              className="w-full py-3 bg-[#161218] border border-[#F4B8C6]/20 text-[#AD9CA6] font-bold rounded-full hover:text-[#FDF6F7] hover:border-[#F4B8C6]/45 transition-all flex items-center justify-center text-xs"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
