"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const searchParams = useSearchParams();
  const supabase = createClient();

  const getRedirectUrl = () => {
    const rawNext = searchParams.get("next");
    const nextParam =
      rawNext && rawNext !== "/" ? `?next=${encodeURIComponent(rawNext)}` : "";
    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    return `${base}/callback${nextParam}`;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Email dan password wajib diisi!");
    if (password.length < 6) return setError("Password minimal 6 karakter!");

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: getRedirectUrl() },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        "Berhasil mendaftar! Silakan cek email Anda untuk verifikasi sebelum masuk.",
      );
      setEmail("");
      setPassword("");
    }
    setLoading(false);
  };

  const nextTarget = searchParams.get("next")
    ? `?next=${encodeURIComponent(searchParams.get("next"))}`
    : "";

  return (
    <div className="min-h-screen bg-[#0D0B1A] flex items-center justify-center relative px-4 overflow-hidden py-12">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-celestia-sky/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-celestia-pink/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#151226]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in">
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
          Buat <span className="text-celestia-sky">Akun Baru</span>
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm px-4 py-3 rounded-xl mb-4 text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-celestia-sky focus:bg-white/5 transition-all"
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
              placeholder="Minimal 6 karakter"
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-celestia-sky focus:bg-white/5 transition-all"
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading || message}
              className="w-full py-3 bg-gradient-to-r from-celestia-sky to-celestia-royal text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
            >
              {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
            </button>

            <div className="text-center text-sm text-gray-400 mt-2">
              Sudah punya akun?{" "}
              <Link
                href={`/login${nextTarget}`}
                className="text-celestia-pink font-bold hover:underline"
              >
                Masuk di sini
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
