import AdvancedSearchClient from "@/components/komik/AdvancedSearchClient";

export async function generateMetadata() {
  return { title: "Pencarian Lanjutan Komik - MangNime" };
}

// Tanpa fetch di server. Filter dibaca dari URL, datanya diambil di browser
// oleh AdvancedSearchClient. Sengaja TANPA `key` supaya panel filter nggak di-remount.
export default async function AdvancedSearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const format = resolvedParams?.format || "";
  const status = resolvedParams?.status || "";
  const genre = resolvedParams?.genre || "";
  const page = Math.max(1, parseInt(resolvedParams?.page || 1, 10) || 1);

  return (
    <AdvancedSearchClient
      currentFilters={{ format, status, genre }}
      page={page}
    />
  );
}
