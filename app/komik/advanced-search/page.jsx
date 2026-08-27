import { KomikProvider } from "@/services/komikApi";
import AdvancedSearchClient from "@/components/komik/AdvancedSearchClient";

export async function generateMetadata() {
  return { title: "Pencarian Lanjutan Komik - MangNime" };
}

export default async function AdvancedSearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const format = resolvedParams?.format || "";
  const status = resolvedParams?.status || "";
  const genre = resolvedParams?.genre || "";
  const page = parseInt(resolvedParams?.page || 1);
  const genresList = KomikProvider.getGenres
    ? await KomikProvider.getGenres()
    : [];
  const res = KomikProvider.getAdvancedSearch
    ? await KomikProvider.getAdvancedSearch(format, page, status, genre)
    : { data: [], pagination: null };

  return (
    <AdvancedSearchClient
      genresList={genresList}
      initialData={res?.data || []}
      initialPagination={res?.pagination || null}
      currentFilters={{ format, status, genre }}
    />
  );
}
