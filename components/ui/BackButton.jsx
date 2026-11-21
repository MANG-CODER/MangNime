"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STACK_KEY = "mn:nav_stack";
const MAX_STACK = 25;

function normalizePath(url) {
  if (!url) return "";
  return url.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
}

// Route baca/nonton yang nggak boleh masuk stack & nggak boleh jadi tujuan "Kembali"
function isPlayerOrReader(url) {
  const pathname = normalizePath(url);
  if (
    pathname.startsWith("/episode/") ||
    pathname.startsWith("/batch/") ||
    pathname.startsWith("/watch/") ||
    /^\/anime\/[^/]+\/[^/]+/.test(pathname)
  ) {
    return true;
  }
  if (
    /^\/komik\/[^/]+\/[^/]+/.test(pathname) &&
    !pathname.startsWith("/komik/genre/")
  ) {
    return true;
  }
  return false;
}

function getFallbackUrl(pathname, customFallback) {
  if (customFallback) return customFallback;
  const chapterMatch = pathname.match(/^\/komik\/([^/]+)\/[^/]+/);
  if (chapterMatch && !pathname.startsWith("/komik/genre/")) {
    return `/komik/${chapterMatch[1]}`;
  }
  return "/";
}

function readStack() {
  try {
    const raw = sessionStorage.getItem(STACK_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Bersihkan sekalian kalau ada sisa entry episode/chapter lama di sessionStorage
    return parsed.filter((u) => typeof u === "string" && !isPlayerOrReader(u));
  } catch {
    return [];
  }
}

function writeStack(stack) {
  try {
    sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-MAX_STACK)));
  } catch {
    // abaikan
  }
}

function pushNavHistory(url) {
  // Halaman nonton/baca JANGAN pernah dimasukkan ke stack
  if (isPlayerOrReader(url)) return;

  const stack = readStack();
  const existingIdx = stack.lastIndexOf(url);
  if (existingIdx !== -1) {
    writeStack(stack.slice(0, existingIdx + 1));
    return;
  }
  stack.push(url);
  writeStack(stack);
}

function popSafePrevUrl(currentUrl) {
  const stack = readStack();
  let idx = stack.length - 1;

  if (stack[idx] === currentUrl) idx--;

  while (idx >= 0) {
    const candidate = stack[idx];
    if (!isPlayerOrReader(candidate) && candidate !== currentUrl) {
      writeStack(stack.slice(0, idx + 1));
      return candidate;
    }
    idx--;
  }

  writeStack([]);
  return null;
}

function isTopOfNavStack(targetHref) {
  const stack = readStack();
  if (stack.length === 0) return false;
  return normalizePath(stack[stack.length - 1]) === normalizePath(targetHref);
}

function NavHistoryInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    pushNavHistory(qs ? `${pathname}?${qs}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

// Sudah dipasang di app/layout.jsx
export function NavHistoryTracker() {
  return (
    <Suspense fallback={null}>
      <NavHistoryInner />
    </Suspense>
  );
}

// Pakai ini untuk tombol "Kembali ke Detail Anime/Komik" di halaman Episode & Chapter.
// Kalau user memang datang dari halaman detail tsb -> router.back() (entry nonton/baca terhapus).
// Kalau user datang langsung dari Home/Google -> replace (entry nonton/baca ditimpa detail).
export function DetailBackLink({ href, className, title, children }) {
  const router = useRouter();

  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    if (
      typeof window !== "undefined" &&
      isTopOfNavStack(href) &&
      window.history.length > 1
    ) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href={href}
      replace
      prefetch={false}
      onClick={handleClick}
      className={className}
      title={title}
    >
      {children}
    </Link>
  );
}

export default function BackButton({ href, fallback, label = "Kembali" }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const qs = typeof window !== "undefined" ? window.location.search : "";
    const currentUrl = `${pathname}${qs}`;
    const target =
      href || popSafePrevUrl(currentUrl) || getFallbackUrl(pathname, fallback);

    if (isPlayerOrReader(pathname)) {
      router.replace(target);
    } else {
      router.push(target);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
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
      {label}
    </button>
  );
}
