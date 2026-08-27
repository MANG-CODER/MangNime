export default function animeImageLoader({ src, width, quality }) {
  const bypassDomains = [
    "alqanime.net",
    "otakudesu.blog",
    "cdn.alqanime.net",
    "otakudesu.cloud",
    "komikcast.com",
    "v2.komikcast.fit",
    "cdn.komikcast.com",
    "placehold.co",
    "komiku.id",
    "cdn.komiku.id",
    "storage.googleapis.com",
    "thumbnail.komiku.org",
    "thumbnail.komiku.to",
    "img.komiku.org",
    "komiku.to",
    "komiku.org",
    "sankavollerei.web.id",
    "assets.shngm.id",
    "shinigami.id",
    "shinigami.moe",
    "omcqdhcnlykcjpxbkwpl.supabase.co",
    "lh3.googleusercontent.com",
    "giphy.com",
  ];

  const wsrvDomains = ["sv1.imgkc1.my.id", "minio.imgkc1.my.id"];

  // 1. Tangani gambar aset lokal
  if (src.startsWith("/")) {
    return src;
  }

  const isBypass = bypassDomains.some((domain) => src.includes(domain));
  const isWsrv = wsrvDomains.some((domain) => src.includes(domain));

  // 2. Tangani domain yang butuh proxy wsrv.nl
  if (isWsrv) {
    const cleanSrc = src.replace(/^https?:\/\//, "");
    return `https://wsrv.nl/?url=${encodeURIComponent(cleanSrc)}&w=${width}&q=${quality || 75}&output=webp`;
  }

  // 3. Tangani domain bypass
  if (isBypass) {
    return src;
  }

  // 4. FALLBACK AMAN: Jika ada link dari luar yang tidak terdaftar,
  if (src.startsWith("http")) {
    const cleanSrc = src.replace(/^https?:\/\//, "");
    return `https://wsrv.nl/?url=${encodeURIComponent(cleanSrc)}&w=${width}&q=${quality || 75}&output=webp`;
  }

  return src;
}
