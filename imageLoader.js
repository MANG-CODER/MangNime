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
    "sv1.imgkc1.my.id",
    "minio.imgkc1.my.id",
  ];

  const wsrvDomains = ["sv1.imgkc1.my.id", "minio.imgkc1.my.id"];

  const isBypass = bypassDomains.some((domain) => src.includes(domain));
  const isWsrv = wsrvDomains.some((domain) => src.includes(domain));

  if (isWsrv) {
    const cleanSrc = src.replace(/^https?:\/\//, "");
    return `https://wsrv.nl/?url=${encodeURIComponent(cleanSrc)}&w=${width}&q=${quality || 75}&output=webp`;
  }

  if (isBypass) return src;

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
