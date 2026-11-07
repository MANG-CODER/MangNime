import BatchClient from "./BatchClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return { title: `Download Batch ${title} - MangNime` };
}

export default async function BatchPage({ params }) {
  const { slug } = await params;
  return <BatchClient key={slug} slug={slug} />;
}
