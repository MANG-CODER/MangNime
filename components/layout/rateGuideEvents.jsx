// Penghubung kecil antara tombol "Apa ini?" (di RateLimitMeter) dan modal penjelasan
// (di RateLimitPopups). Pakai CustomEvent supaya dua komponen itu nggak perlu saling import.
export const OPEN_RATE_GUIDE_EVENT = "mangnime:open-rate-guide";

export function openRateGuide() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_RATE_GUIDE_EVENT));
  }
}
