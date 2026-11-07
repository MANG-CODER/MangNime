import SearchResults from "./SearchResults";

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const keyword = resolvedParams?.q || "";
  return {
    title: keyword
      ? `Pencarian "${keyword}" - MangNime`
      : "Pencarian - MangNime",
  };
}

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const keyword = resolvedParams?.q || "";
  const type = resolvedParams?.type || "all";

  if (!keyword) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4 animate-fade-in">
        <div className="w-16 h-16 bg-[#211B24] border border-[#F4B8C6]/25 rounded-full flex items-center justify-center text-[#F4B8C6]">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-[#FDF6F7]">
          Masukkan Kata Kunci Pencarian
        </h2>
        <p className="text-[#AD9CA6] text-xs md:text-sm max-w-sm">
          Silakan ketik judul anime atau komik yang ingin kamu cari pada kolom
          pencarian di bagian atas.
        </p>
      </div>
    );
  }

  return (
    <SearchResults key={`${keyword}|${type}`} keyword={keyword} type={type} />
  );
}
