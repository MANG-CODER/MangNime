// services/api.js

// Mengambil Base URL dari .env.local, fallback ke URL langsung jika tidak terbaca
const BASE_URL =
  process.env.SANKANIME_BASE_URL || "https://www.sankavollerei.com/anime";

// Daftar semua endpoint berdasarkan dokumentasi Anda
export const API_ENDPOINTS = {
  HOME: "/home",
  ONGOING: "/ongoing-anime/",
  COMPLETE: "/complete-anime",
  SEARCH: "/search/",
  ANIME: "/anime/", // Digunakan untuk detail
  BATCH: "/batch/",
  GENRE: "/genre",
  SCHEDULE: "/schedule",
  EPISODE: "/episode/",
  SERVER: "/server/",
};

/**
 * Fungsi pembantu untuk membuat delay (jeda waktu)
 * @param {number} ms - Milidetik (contoh: 1000 = 1 detik)
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fungsi fetch kustom dengan fitur delay bawaan
 * @param {string} endpoint - Path API (contoh: API_ENDPOINTS.ONGOING)
 * @param {number} delayMs - Waktu tunggu sebelum request dikirim (default: 1500ms)
 * @param {object} options - Opsi fetch bawaan Next.js (cache, headers, dll)
 */
export async function fetchWithDelay(endpoint, delayMs = 1500, options = {}) {
  try {
    // 1. Tahan eksekusi selama waktu yang ditentukan
    await delay(delayMs);

    // 2. Lakukan request ke server Sankanime
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(
        `Gagal memuat data dari ${endpoint} (Status: ${response.status})`,
      );
    }

    // 3. Kembalikan format JSON
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return null; // Kembalikan null jika gagal agar aplikasi tidak crash
  }
}
