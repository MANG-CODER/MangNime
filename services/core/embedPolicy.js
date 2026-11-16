// Kebijakan penyematan (iframe) server video.
//
// Beberapa host video melarang disematkan di situs lain lewat header CSP
// `frame-ancestors` (contoh: desustream.com hanya mengizinkan otakudesu.blog).
// Itu ditegakkan oleh browser: nggak bisa dilewati dari sisi klien (referrer / sandbox
// tidak ngaruh) dan JS di halaman juga nggak bisa mendeteksi frame yang diblok.
// Karena itu kita cuma bisa: (1) tahu host mana yang diblok, (2) pakai server lain,
// (3) kasih tombol "buka di tab baru" (membuka langsung di tab tetap diizinkan).

// Host yang terbukti melarang disematkan. Tambahkan host baru di sini saat console
// menampilkan: Framing 'https://HOST/' violates ... "frame-ancestors ..."
export const NO_EMBED_HOSTS = ["desustream.com"];

// Urutan prioritas server pengganti (cocok sebagian, huruf kecil). Hanya "vidhide" yang
// terlihat jalan di pemakaian situs ini; sisanya mengikuti urutan dari API.
export const PREFERRED_SERVERS = ["vidhide"];

// Hanya http(s). Mencegah "javascript:" / "data:" dari data pihak ketiga dipakai sebagai src/href.
export function safeHttpUrl(url) {
  try {
    const u = new URL(String(url));
    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

export function hostOf(url) {
  try {
    return new URL(String(url)).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function isNoEmbedHost(url) {
  const host = hostOf(url);
  return NO_EMBED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

export function canEmbed(url) {
  return Boolean(safeHttpUrl(url)) && !isNoEmbedHost(url);
}

/**
 * Kandidat server pengganti dari daftar kualitas API.
 * Urutan: server yang diprioritaskan dulu, lalu kualitas tertinggi. Maks `max` kandidat
 * (tiap kandidat = 1 request, jadi dibatasi supaya hemat jatah).
 */
export function pickFallbackServers(qualities, max = 3) {
  const seen = new Set();
  const rows = [];
  for (const q of Array.isArray(qualities) ? qualities : []) {
    for (const s of Array.isArray(q?.serverList) ? q.serverList : []) {
      if (!s?.serverId || seen.has(s.serverId)) continue;
      seen.add(s.serverId);
      rows.push({
        serverId: s.serverId,
        title: s.title || "server",
        quality: parseInt(q?.title, 10) || 0,
      });
    }
  }
  const rank = (r) => {
    const i = PREFERRED_SERVERS.findIndex((p) =>
      r.title.toLowerCase().includes(p),
    );
    return i === -1 ? PREFERRED_SERVERS.length : i;
  };
  return rows
    .sort((a, b) => rank(a) - rank(b) || b.quality - a.quality)
    .slice(0, max);
}
