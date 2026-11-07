// Placeholder grid kartu saat data masih diambil di browser.
export default function GridSkeleton({
  count = 10,
  className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-7",
}) {
  return (
    <div className={className} aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="aspect-[2/3] rounded-[24px] bg-[#211B24] border border-[#F4B8C6]/10" />
          <div className="h-3 w-3/4 rounded bg-[#211B24]" />
          <div className="h-3 w-1/2 rounded bg-[#211B24]" />
        </div>
      ))}
    </div>
  );
}
