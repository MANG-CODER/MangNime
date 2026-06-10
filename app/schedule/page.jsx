import ScheduleTabs from "@/components/schedule/ScheduleTabs";
import { AnimeProvider } from "@/services/providers";
import { mergeScheduleLists } from "@/utils/mergeAnime";

export const metadata = {
  title: "Jadwal Rilis Anime - MangNime",
};

export default async function SchedulePage() {
  let otakuSchedule = [];
  let alqaSchedule = {};

  try {
    const [otakuRes, alqaRes] = await Promise.allSettled([
      AnimeProvider.Otakudesu.getSchedule(),
      AnimeProvider.Alqanime.getSchedule(),
    ]);

    if (otakuRes.status === "fulfilled") {
      otakuSchedule = otakuRes.value || [];
    }

    if (alqaRes.status === "fulfilled") {
      alqaSchedule = alqaRes.value || [];
    }
  } catch (error) {
    console.error("Schedule Error:", error);
  }

  const scheduleData = mergeScheduleLists(otakuSchedule, alqaSchedule);
console.log(JSON.stringify(alqaSchedule["Senin"]?.[0], null, 2));

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 relative">
      {/* Header */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden mt-6 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-full bg-celestia-royal/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-sky to-celestia-lavender">
              Jadwal Rilis
            </span>{" "}
            Anime
          </h1>

          <p className="text-celestia-lavender/70 font-light text-sm md:text-base tracking-wide max-w-2xl mx-auto">
            Pantau jadwal tayang anime favoritmu setiap harinya.
          </p>
        </div>
      </div>

      {scheduleData.length > 0 ? (
        <ScheduleTabs scheduleData={scheduleData} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-celestia-lavender">
          <span className="w-10 h-10 border-4 border-celestia-royal border-t-transparent rounded-full animate-spin mb-4"></span>
          <p className="font-light">Mencari jadwal anime terbaru...</p>
        </div>
      )}
    </div>
  );
}
