import AnimeDetailClient from "./AnimeDetailClient";

function prettifySlug(slug = "") {
  let s = slug;
  try {
    s = decodeURIComponent(slug);
  } catch {}
  return s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// Tanpa fetch: judul dari slug, canonical tetap ada. Judul asli dipasang di browser
// (AnimeDetailClient) setelah data masuk.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = `${prettifySlug(slug)} - MangNime`;
  const description = "Nonton anime subtitle Indonesia gratis di MangNime.";
  const canonicalUrl = `https://mangnime.my.id/anime/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "MangNime",
      locale: "id_ID",
      type: "video.tv_show",
    },
  };
}

export default async function AnimeDetail({ params }) {
  const { slug } = await params;
  return <AnimeDetailClient key={slug} slug={slug} />;
}
