"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    text: "",
  });

  const supabase = createClient();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return setAlertInfo({
        show: true,
        type: "error",
        text: "Silakan masukkan alamat email akun Anda.",
      });
    }

    setLoading(true);
    setAlertInfo({ show: false, type: "", text: "" });

    const base = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const redirectTo = `${base}/callback?next=/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });

    if (error) {
      setAlertInfo({
        show: true,
        type: "error",
        text: error.message || "Gagal mengirim email pemulihan.",
      });
    } else {
      setAlertInfo({
        show: true,
        type: "success",
        text: "Tautan pemulihan telah dikirim! Silakan cek kotak masuk atau folder spam email Anda.",
      });
      setEmail("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[82vh] bg-[#161218] flex items-center justify-center relative px-4 py-12">
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
            Lupa{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Password?
            </span>
          </h1>
          <p className="text-xs text-[#AD9CA6] mt-1.5 leading-relaxed">
            Masukkan email akun Anda. Kami akan mengirimkan tautan untuk membuat
            password baru.
          </p>
        </div>

        {alertInfo.show && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
              alertInfo.type === "error"
                ? "bg-[#E88D9E]/10 border-[#E88D9E]/40 text-[#E88D9E]"
                : "bg-[#F4B8C6]/10 border-[#F4B8C6]/40 text-[#F4B8C6]"
            }`}
          >
            <span className="font-extrabold shrink-0">
              {alertInfo.type === "error" ? "!" : "✓"}
            </span>
            <span>{alertInfo.text}</span>
          </div>
        )}

        <form onSubmit={handleResetRequest} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AD9CA6] mb-1.5">
              Email Terdaftar
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-[#161218] border border-[#F4B8C6]/20 text-[#FDF6F7] text-sm rounded-2xl px-4 py-3 outline-none focus:border-[#F4B8C6] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold text-xs md:text-sm rounded-full shadow-vogue-blush active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "MENGIRIM TAUTAN..." : "KIRIM TAUTAN RESET"}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-bold text-[#AD9CA6] hover:text-[#F4B8C6] transition-colors"
            >
              &larr; Kembali ke Halaman Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
