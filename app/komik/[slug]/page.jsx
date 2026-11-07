import KomikDetailClient from "./KomikDetailClient";

function prettifySlug(slug = "") {
  let s = slug;
  try {
    s = decodeURIComponent(slug);
  } catch {}
  return s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// Tanpa fetch: judul dari slug, canonical tetap ada. Judul asli dipasang di browser
// (KomikDetailClient) setelah data masuk.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = `${prettifySlug(slug)} | MangNime`;
  const description =
    "Baca komik manga manhwa manhua bahasa Indonesia di MangNime.";
  const canonicalUrl = `https://mangnime.my.id/komik/${slug}`;

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
      type: "book",
    },
  };
}

export default async function DetailKomikPage({ params }) {
  const { slug } = await params;
  return <KomikDetailClient key={slug} slug={slug} />;
}
