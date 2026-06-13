export default function animeImageLoader({ src, width, quality }) {
  const bypassDomains = [
    "alqanime.net",
    "otakudesu.blog",
    "cdn.alqanime.net",
    "otakudesu.cloud",
  ];

  const isBypass = bypassDomains.some((domain) => src.includes(domain));
  if (isBypass) return src;

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
