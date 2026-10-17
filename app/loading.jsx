import Image from "next/image";

export default function Loading() {
  const skeletonCards = Array(10).fill(null);

  return (
    <div className="relative min-h-screen bg-[#161218] overflow-hidden">
      {/* BACKGROUND SKELETON */}
      <div className="absolute inset-0 z-0 opacity-45">
        <div className="w-full h-[45vh] bg-[#211B24] animate-pulse" />

        <div className="container mx-auto px-4 md:px-8 max-w-[1400px] mt-10">
          <div className="w-52 h-8 bg-[#211B24] rounded-full mb-7 animate-pulse" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {skeletonCards.map((_, index) => (
              <div key={index} className="w-full">
                <div className="aspect-[2/3] w-full bg-[#211B24] rounded-[20px] animate-pulse mb-3" />
                <div className="w-3/4 h-4 bg-[#211B24] rounded-full mb-2 animate-pulse" />
                <div className="w-1/2 h-3 bg-[#211B24] rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOREGROUND SPINNER */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#161218]/60 backdrop-blur-md gap-4">
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 border-[3px] border-transparent border-t-[#F4B8C6] border-b-[#E88D9E] rounded-full animate-spin" />
          <div className="relative w-12 h-12">
            <Image
              src="/img/Icon.svg"
              alt="Loading Icon"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        <span className="font-serif italic text-xs tracking-widest text-[#F4B8C6] animate-pulse">
          Memuat halaman...
        </span>
      </div>
    </div>
  );
}
