import { getGenres } from "@/services/komikApi";
import GenreFilterClient from "@/components/komik/GenreFilterClient";

export const metadata = { title: "Eksplorasi Genre - MangNime" };

export default async function KomikGenresPage() {
  const genreList = await getGenres();
  return <GenreFilterClient genreList={genreList} />;
}
