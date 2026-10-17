import { KomikProvider } from "@/services/komikApi";
import GenreFilterClient from "@/components/komik/GenreFilterClient";

export const metadata = { title: "Eksplorasi Genre Komik - MangNime" };

export const revalidate = 1800;

export default async function KomikGenresPage() {
  const genreList = await KomikProvider.getGenres();
  return <GenreFilterClient genreList={genreList} />;
}
