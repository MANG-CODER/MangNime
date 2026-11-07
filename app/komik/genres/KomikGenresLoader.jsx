"use client";

import GenreFilterClient from "@/components/komik/GenreFilterClient";
import FetchError from "@/components/ui/FetchError";
import { KomikClient } from "@/services/komikApi.client";
import { useProvider } from "@/hooks/useProvider";

// Ambil daftar genre di browser, lalu serahkan ke GenreFilterClient dengan prop yang sama seperti dulu.
export default function KomikGenresLoader() {
  const { data, error, loading, retry } = useProvider(
    () => KomikClient.getGenres(),
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#161218]">
        <div className="flex flex-col items-center justify-center py-32 text-[#F4B8C6]">
          <span className="w-9 h-9 border-[3px] border-[#F4B8C6] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-[#AD9CA6]">Memuat data genre...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#161218] pt-8 px-4 md:px-8">
        <FetchError error={error} onRetry={retry} />
      </div>
    );
  }
  return <GenreFilterClient genreList={data || []} />;
}
