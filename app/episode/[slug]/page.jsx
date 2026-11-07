import EpisodeClient from "./EpisodeClient";

// Server component ini SENGAJA tidak fetch data apa pun. Semua data diambil
// di browser (EpisodeClient) lewat IP user.

function prettifySlug(slug = "") {
  let s = slug;
  try {
    s = decodeURIComponent(slug);
  } catch {}
  return s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${prettifySlug(slug)} | MangNime`,
    description: "Nonton anime subtitle Indonesia gratis di MangNime.",
    // konsisten dengan proxy.js yang sudah melarang bot masuk ke route episode
    robots: { index: false, follow: false },
  };
}

export default async function EpisodePage({ params }) {
  const { slug } = await params;
  // key=slug -> state di-reset tiap pindah episode (nggak ada kedip data episode lama)
  return <EpisodeClient key={slug} slug={slug} />;
}
