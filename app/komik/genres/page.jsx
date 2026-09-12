import { KomikProvider } from "@/services/komikApi";
import GenreFilterClient from "@/components/komik/GenreFilterClient";

export const metadata = { title: "Eksplorasi Genre - MangNime" };

// 🔥 Paksa bypass build
export const dynamic = "force-dynamic";

export default async function KomikGenresPage() {
  const genreList = await KomikProvider.getGenres();
  return <GenreFilterClient genreList={genreList} />;
}
