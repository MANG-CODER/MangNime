"use client";

import { clientFetch } from "./core/clientFetcher";
import * as cache from "./core/clientCache";
import {
  createKomikProvider,
  SHINIGAMI_BASE_URL,
  KOMIKU_BASE_URL,
} from "./komikApi.shared";

// Versi BROWSER. Fetcher melempar error (nggak silent), jadi UI bisa bedain
// "gagal" (error.status 403/429/5xx/timeout) dari "nggak ketemu" (error.status 404).
export const KomikClient = createKomikProvider({
  fetchShinigami: (endpoint, ttl) =>
    clientFetch(`${SHINIGAMI_BASE_URL}${endpoint}`, { ttl }),
  fetchKomiku: (endpoint, ttl = 3600) =>
    clientFetch(`${KOMIKU_BASE_URL}${endpoint}`, { ttl }),
  cache,
});
