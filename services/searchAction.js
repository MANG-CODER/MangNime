"use server";

export async function searchKomikServer(keyword) {
  try {
    const res = await fetch(
      `https://komikcast-api-six.vercel.app/api/advanceSearch?search=${encodeURIComponent(keyword)}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}
