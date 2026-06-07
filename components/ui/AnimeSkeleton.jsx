export default function AnimeSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl p-2.5 border border-transparent w-full">
      {/* Kerangka Poster Image */}
      <div className="relative aspect-[3/4] w-full rounded-xl bg-gray-800/40 animate-pulse overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>

      {/* Kerangka Teks */}
      <div className="px-1 space-y-2">
        {/* Kerangka Judul */}
        <div className="h-4 w-5/6 bg-gray-800/60 rounded-md animate-pulse"></div>
        {/* Kerangka Studio/Subtitle */}
        <div className="h-3 w-1/2 bg-gray-800/40 rounded-md animate-pulse mt-2"></div>
      </div>
    </div>
  );
}
