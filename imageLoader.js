export default function animeImageLoader({ src, width, quality }) {
  const bypassDomains = [
    "alqanime.net",
    "otakudesu.blog",
    "cdn.alqanime.net",
    "otakudesu.cloud",
    "komikcast.com",
    "cdn.komikcast.com",
    "placehold.co",
    "sv1.imgkc1.my.id",
    "minio.imgkc1.my.id",
  ];

  const isBypass = bypassDomains.some((domain) => src.includes(domain));
  if (isBypass) return src;

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
