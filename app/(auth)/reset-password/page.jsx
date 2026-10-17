"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    text: "",
  });

  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setAlertInfo({
        show: true,
        type: "error",
        text: "Password baru minimal 6 karakter!",
      });
    }
    if (password !== confirmPassword) {
      return setAlertInfo({
        show: true,
        type: "error",
        text: "Konfirmasi password tidak cocok!",
      });
    }

    setLoading(true);
    setAlertInfo({ show: false, type: "", text: "" });

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setAlertInfo({
        show: true,
        type: "error",
        text:
          error.message ||
          "Gagal memperbarui password. Silakan minta ulang tautan reset.",
      });
    } else {
      setAlertInfo({
        show: true,
        type: "success",
        text: "Password berhasil diperbarui! Mengalihkan ke Beranda...",
      });
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
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
            Atur{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Password Baru
            </span>
          </h1>
          <p className="text-xs text-[#AD9CA6] mt-1">
            Silakan masukkan password baru untuk akun MangNime Anda.
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

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AD9CA6] mb-1.5">
              Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full bg-[#161218] border border-[#F4B8C6]/20 text-[#FDF6F7] text-sm rounded-2xl px-4 py-3 outline-none focus:border-[#F4B8C6] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#AD9CA6] mb-1.5">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full bg-[#161218] border border-[#F4B8C6]/20 text-[#FDF6F7] text-sm rounded-2xl px-4 py-3 outline-none focus:border-[#F4B8C6] transition-all"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold text-xs md:text-sm rounded-full shadow-vogue-blush active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "MENYIMPAN..." : "SIMPAN PASSWORD BARU"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
