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
    <div className="min-h-[82vh] bg-[#161218] flex items-center justify-center relative px-4 overflow-hidden py-12">
      {/* FLOATING ALERT */}
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

      {/* CARD REGISTER */}
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
            Buat{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Akun Baru
            </span>
          </h1>
          <p className="text-xs text-[#AD9CA6] mt-1">
            Bergabung bersama komunitas pembaca &amp; penonton MangNime
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AD9CA6] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full bg-[#161218] border border-[#F4B8C6]/20 text-[#FDF6F7] text-sm rounded-2xl px-4 py-3 outline-none focus:border-[#F4B8C6] transition-all"
            />
          </div>

          <div className="pt-3 flex flex-col gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold text-xs md:text-sm rounded-full shadow-vogue-blush active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
            </button>

            <div className="text-center text-xs text-[#AD9CA6] mt-1">
              Sudah punya akun?{" "}
              <Link
                href={`/login${nextTarget}`}
                className="text-[#F4B8C6] font-extrabold hover:underline"
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
