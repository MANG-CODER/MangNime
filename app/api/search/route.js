import { NextResponse } from "next/server";
import { coreFetcher } from "@/services/core/fetcher";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query)
    return NextResponse.json({ error: "Query kosong" }, { status: 400 });

  const BASE_URL =
    process.env.SANKANIME_BASE_URL || "https://www.sankavollerei.web.id/anime";
  const data = await coreFetcher(`${BASE_URL}/search/${query}`);

  if (!data) {
    return NextResponse.json(
      { error: "Data tidak ditemukan atau server timeout" },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
