import { NextResponse } from "next/server";
import { fetchWithDelay, API_ENDPOINTS } from "@/services/api";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query)
    return NextResponse.json({ error: "Query kosong" }, { status: 400 });

  // Panggil Search API Sankanime dengan delay 500ms
  const data = await fetchWithDelay(`${API_ENDPOINTS.SEARCH}${query}`, 500);

  if (!data) {
    return NextResponse.json(
      { error: "Data tidak ditemukan atau server timeout" },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
