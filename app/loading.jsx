import Image from "next/image";

export default function Loading() {
  // Membuat array kosong berisi 8 item untuk di-looping menjadi skeleton cards
  const skeletonCards = Array(8).fill(null);

  return (
    <div className="relative min-h-screen bg-[#0D0B1A] overflow-hidden">
      {/* =========================================
          BACKGROUND: SKELETON FRAMEWORK (CARD KOSONG)
          ========================================= */}
      <div className="absolute inset-0 z-0 opacity-60">
        {/* Skeleton Hero Banner (Bagian atas) */}
        <div className="w-full h-[35vh] md:h-[50vh] bg-white/5 animate-pulse"></div>

        {/* Skeleton Grid Cards (Bagian bawah) */}
        <div className="container mx-auto px-4 md:px-8 mt-10">
          {/* Judul Skeleton */}
          <div className="w-48 h-8 bg-white/5 rounded-lg mb-6 animate-pulse"></div>

          {/* Grid Layout (Sama seperti halaman Beranda/List) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {skeletonCards.map((_, index) => (
              <div key={index} className="w-full">
                {/* Kotak Poster */}
                <div className="aspect-[3/4] w-full bg-white/5 rounded-2xl animate-pulse mb-3"></div>
                {/* Garis Teks Judul */}
                <div className="w-3/4 h-4 bg-white/5 rounded mb-2 animate-pulse"></div>
                {/* Garis Teks Genre/Status */}
                <div className="w-1/2 h-3 bg-white/5 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          FOREGROUND: OVERLAY BLUR & SPINNER ANDA
          ========================================= */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0B1A]/40 backdrop-blur-sm">
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Ring yang berputar */}
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-b-purple-500 rounded-full animate-spin"></div>

          {/* Icon diam di tengah */}
          <div className="relative w-12 h-12">
            <Image
              src="/img/icon.png"
              alt="Loading Icon"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
