"use client";

import ScheduleTabs from "@/components/schedule/ScheduleTabs";
import FetchError from "@/components/ui/FetchError";
import { OtakudesuClient } from "@/services/providers/otakudesu.client";
import { useProvider } from "@/hooks/useProvider";

export default function ScheduleLoader() {
  const { data, error, loading, retry } = useProvider(
    () => OtakudesuClient.getSchedule(),
    [],
  );
  const scheduleData = data || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#F4B8C6]">
        <span className="w-9 h-9 border-[3px] border-[#F4B8C6] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-[#AD9CA6]">
          Mencari jadwal anime terbaru...
        </p>
      </div>
    );
  }
  if (error) return <FetchError error={error} onRetry={retry} />;
  if (scheduleData.length === 0) {
    return (
      <div className="text-center py-16 text-[#AD9CA6] text-sm">
        Jadwal rilis belum tersedia.
      </div>
    );
  }
  return <ScheduleTabs scheduleData={scheduleData} />;
}
