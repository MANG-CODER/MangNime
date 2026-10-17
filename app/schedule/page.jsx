import ScheduleTabs from "@/components/schedule/ScheduleTabs";
import { AnimeProvider } from "@/services/providers";

export const metadata = {
  title: "Jadwal Rilis Anime - MangNime",
};

export default async function SchedulePage() {
  let scheduleData = [];

  try {
    const res = await AnimeProvider.Otakudesu.getSchedule();
    scheduleData = res || [];
  } catch (error) {
    console.error("Schedule Error:", error);
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 px-4 md:px-8 relative">
      <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-11 relative overflow-hidden mt-6 shadow-vogue-card">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-64 bg-[#F4B8C6]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161218] border border-[#F4B8C6]/30 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4B8C6]">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Weekly Timetable</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#FDF6F7] tracking-tight">
            Jadwal{" "}
            <span className="font-serif italic font-normal text-[#F4B8C6]">
              Rilis Anime
            </span>
          </h1>
          <p className="text-[#AD9CA6] text-xs md:text-sm max-w-xl mx-auto">
            Pantau jadwal tayang episode terbaru anime favoritmu setiap harinya.
          </p>
        </div>
      </div>

      {scheduleData.length > 0 ? (
        <ScheduleTabs scheduleData={scheduleData} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-[#F4B8C6]">
          <span className="w-9 h-9 border-[3px] border-[#F4B8C6] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-[#AD9CA6]">
            Mencari jadwal anime terbaru...
          </p>
        </div>
      )}
    </div>
  );
}
