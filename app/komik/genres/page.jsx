import { fetchKomikAPI } from "@/services/komikApi";
import GenreFilterClient from "@/components/komik/GenreFilterClient";

export const metadata = { title: "Eksplorasi Genre - MangNime" };

export default async function KomikGenresPage() {
  const res = await fetchKomikAPI(`/genres`);
  const genreList = res?.data || [];
  return <GenreFilterClient genreList={genreList} />;
}
