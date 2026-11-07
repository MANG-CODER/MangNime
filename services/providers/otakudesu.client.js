"use client";

import { clientFetch } from "../core/clientFetcher";
import { createOtakudesuProvider } from "./otakudesu.shared";

// Versi BROWSER: request keluar dari IP user. strict=true -> error dilempar
// supaya UI bisa nampilin "gagal + coba lagi", bukan "daftar kosong".
export const OtakudesuClient = createOtakudesuProvider(
  (url) => clientFetch(url),
  { strict: true },
);
