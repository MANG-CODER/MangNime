"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group inline-flex items-center gap-2 text-[#F4B8C6] text-xs md:text-sm hover:text-[#161218] transition-all mb-8 font-bold bg-[#211B24] hover:bg-[#F4B8C6] px-4 py-2 rounded-full border border-[#F4B8C6]/25 backdrop-blur-md w-max"
    >
      <svg
        className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Kembali
    </button>
  );
}
