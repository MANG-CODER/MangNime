import { fetchWithDelay, API_ENDPOINTS } from "@/services/api";
import ScheduleTabs from "@/components/schedule/ScheduleTabs";

export const metadata = { title: "Jadwal Rilis Anime - MangNime" };

export default async function SchedulePage() {
  const res = await fetchWithDelay(API_ENDPOINTS.SCHEDULE, 500, {
    next: { revalidate: 86400 },
  });

  // Ambil langsung array datanya berdasarkan JSON
  const scheduleData = res?.data || [];

  return (
    <div className="space-y-10 animate-fade-in max-w-[1400px] mx-auto pb-16 relative">
      {/* Header Jadwal dengan Tema Celestia */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden mt-6 shadow-2xl backdrop-blur-xl">
        {/* Cahaya Latar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-full bg-celestia-royal/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-sky to-celestia-lavender">
              Jadwal Rilis
            </span>{" "}
            Anime
          </h1>
          <p className="text-celestia-lavender/70 font-light text-sm md:text-base tracking-wide max-w-2xl mx-auto">
            Pantau jadwal tayang anime favoritmu setiap harinya. Jadwal dapat
            berubah sewaktu-waktu sesuai penayangan di Jepang.
          </p>
        </div>
      </div>

      {scheduleData.length > 0 ? (
        <ScheduleTabs scheduleData={scheduleData} />
      ) : (
        <div className="text-center py-20 text-gray-500 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-xl">
          Memuat jadwal mingguan...
        </div>
      )}
    </div>
  );
}
