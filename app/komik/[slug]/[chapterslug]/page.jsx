import ChapterReaderClient from "./ChapterReaderClient";

function prettifySlug(slug = "") {
  let s = slug;
  try {
    s = decodeURIComponent(slug);
  } catch {}
  return s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// Tanpa fetch. Judul asli dipasang di browser (ChapterReaderClient) setelah data masuk.
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  return {
    title: `${prettifySlug(slug)} | MangNime Reader`,
    description: "Baca komik bahasa Indonesia gratis di MangNime.",
    // konsisten dengan proxy.js yang sudah melarang bot masuk ke route chapter
    robots: { index: false, follow: false },
  };
}

export default async function ReadChapterPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || "";
  const chapterSlug = resolvedParams?.chapterslug || "";
  return (
    <ChapterReaderClient
      key={`${slug}/${chapterSlug}`}
      slug={slug}
      chapterSlug={chapterSlug}
    />
  );
}
