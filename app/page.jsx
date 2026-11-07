import HomeClient from "./HomeClient";

export const metadata = {
  title: "MangNime - Streaming Anime & Baca Komik Gratis",
};

// Halaman ini statis (nggak fetch apa pun di server). Data diambil di browser.
export default function Home() {
  return <HomeClient />;
}