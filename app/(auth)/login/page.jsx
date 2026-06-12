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
    <div className="min-h-screen bg-[#0D0B1A] flex items-center justify-center relative px-4 overflow-hidden py-12">
      {/* --- FLOATING ALERT (Lolos dari halangan Navbar) --- */}
      {alertInfo.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in w-[90%] max-w-md">
          <div
            className={`flex items-start justify-between p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${alertInfo.type === "error" ? "bg-red-500/10 border-red-500/50" : "bg-green-500/10 border-green-500/50"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${alertInfo.type === "error" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}
              >
                {alertInfo.type === "error" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
              </div>
              <p
                className={`text-sm font-medium ${alertInfo.type === "error" ? "text-red-200" : "text-green-200"}`}
              >
                {alertInfo.text}
              </p>
            </div>
            <button
              onClick={closeAlert}
              className={`ml-4 p-1.5 rounded-lg transition-colors ${alertInfo.type === "error" ? "text-red-400 hover:bg-red-500/20" : "text-green-400 hover:bg-green-500/20"}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-[#151226]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in mt-4">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/img/logo.png"
              alt="MangNime"
              width={180}
              height={50}
              className="object-contain"
            />
          </Link>
        </div>

        <h2 className="text-2xl font-black text-white text-center mb-6">
          Masuk ke <span className="text-[#FF78C6]">Anak Tangga</span>
        </h2>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-500 text-xs font-bold tracking-widest">
            ATAU EMAIL
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[#8B6CFF] focus:bg-white/5 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[#8B6CFF] focus:bg-white/5 transition-all"
            />
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#5538A8] to-[#8B6CFF] text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
            >
              {loading ? "MEMPROSES..." : "MASUK"}
            </button>

            <Link
              href={`/register${nextTarget}`}
              className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 font-bold rounded-xl hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center text-sm"
            >
              DAFTAR AKUN BARU
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
