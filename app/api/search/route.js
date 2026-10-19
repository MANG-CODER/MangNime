import { NextResponse } from "next/server";
import { searchAllAnime } from "@/services/animeAction";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || !query.trim()) {
    return NextResponse.json({ error: "Query kosong" }, { status: 400 });
  }

  const data = await searchAllAnime(query);

  return NextResponse.json({ status: "success", data });
}
