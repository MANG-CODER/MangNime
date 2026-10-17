export default function AnimeSkeleton() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative aspect-[2/3] w-full rounded-[20px] bg-[#211B24] ring-1 ring-[#F4B8C6]/10 animate-pulse overflow-hidden" />
      <div className="px-1 space-y-2">
        <div className="h-3 w-1/3 bg-[#211B24] rounded-full animate-pulse" />
        <div className="h-4 w-5/6 bg-[#211B24] rounded-full animate-pulse" />
      </div>
    </div>
  );
}
