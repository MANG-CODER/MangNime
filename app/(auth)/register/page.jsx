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
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    text: "",
  });

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

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password)
      return showAlert("error", "Email dan password wajib diisi!");
    if (password.length < 6)
      return showAlert("error", "Password minimal 6 karakter!");

    setLoading(true);
    closeAlert();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: getRedirectUrl() },
    });

    if (error) {
      showAlert("error", error.message);
    } else {
      showAlert(
        "success",
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

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#4CC9FF]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FF78C6]/10 blur-[150px] rounded-full pointer-events-none"></div>

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

        <h2 className="text-2xl font-black text-white text-center mb-8">
          Buat <span className="text-[#4CC9FF]">Akun Baru</span>
        </h2>

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
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[#4CC9FF] focus:bg-white/5 transition-all"
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
              className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[#4CC9FF] focus:bg-white/5 transition-all"
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#4CC9FF] to-[#5538A8] text-white font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50"
            >
              {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
            </button>

            <div className="text-center text-sm text-gray-400 mt-2">
              Sudah punya akun?{" "}
              <Link
                href={`/login${nextTarget}`}
                className="text-[#FF78C6] font-bold hover:underline"
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
