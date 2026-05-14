"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/ui/Button";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const getFirstName = (fullName, email) => {
    if (fullName) return fullName.split(" ")[0];
    if (email) return email.split("@")[0];
    return "User";
  };

  const isHome = pathname === "/";

  return (
    <nav className="w-full bg-[#0D0B1A]/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex-shrink-0 transition-transform hover:scale-105"
          >
            <img
              src="/img/logo.png"
              alt="MangNime"
              className="h-8 md:h-10 object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-2 text-sm font-heading font-bold">
            <Link
              href="/"
              className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all ${isHome ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Beranda
              {isHome && (
                <div className="absolute -bottom-2.5 flex justify-center w-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-celestia-pink opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-celestia-pink"></span>
                  </span>
                </div>
              )}
            </Link>

            {/* Menu Anime & Komik Tetap Seperti Kode Anda */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-5 py-2.5 text-gray-400 hover:text-white rounded-xl transition-all group-hover:bg-white/5 group-hover:text-white">
                Anime{" "}
                <span className="text-[10px] opacity-50 group-hover:rotate-180 transition-transform">
                  ▼
                </span>
              </button>
              {/* Mega Menu Content */}
            </div>

            <div className="relative group">
              <button className="flex items-center gap-2 px-5 py-2.5 text-gray-400 hover:text-white rounded-xl transition-all group-hover:bg-white/5 group-hover:text-white">
                Komik{" "}
                <span className="text-[10px] opacity-50 group-hover:rotate-180 transition-transform">
                  ▼
                </span>
              </button>
              {/* Mega Menu Content */}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 justify-end max-w-md">
            <SearchBar />
            <Link
              href="/bookmark"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-celestia-pink transition-all shrink-0"
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </Link>

            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pr-4 p-1 transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-celestia-pink shrink-0">
                  <img
                    src={
                      user.user_metadata?.avatar_url ||
                      "https://placehold.co/100"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-bold text-white truncate max-w-[80px]">
                  {getFirstName(user.user_metadata?.full_name, user.email)}
                </span>
              </Link>
            ) : (
              <Button
                href={`/login?next=${pathname}`}
                variant="primary"
                size="md"
              >
                LOGIN
              </Button>
            )}
          </div>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Content (Tetap Sama dengan perbaikan penutup tag login) */}
    </nav>
  );
}
