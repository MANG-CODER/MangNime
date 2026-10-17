"use client";
import { useState } from "react";

export default function InteractivePlayer({
  defaultUrl,
  qualities,
  onFetchServer,
}) {
  const [iframeSrc, setIframeSrc] = useState(defaultUrl);
  const [activeServer, setActiveServer] = useState("Default Server");
  const [isLoading, setIsLoading] = useState(false);

  const handleServerClick = async (serverId, serverName) => {
    setIsLoading(true);
    setActiveServer(serverName);
    try {
      const newUrl = await onFetchServer(serverId);
      if (newUrl) setIframeSrc(newUrl);
    } catch (error) {
      console.error("Gagal mengganti server:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 w-full">
      {/* VIDEO FRAME */}
      <div className="w-full aspect-video bg-[#0B090D] rounded-[24px] md:rounded-[28px] overflow-hidden shadow-vogue-card ring-1 ring-[#F4B8C6]/25 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-[#161218]/90 flex flex-col items-center justify-center backdrop-blur-md">
            <span className="w-10 h-10 border-[3px] border-[#F4B8C6] border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-[#F4B8C6] font-bold tracking-wider text-xs animate-pulse">
              Menghubungkan ke {activeServer}...
            </span>
          </div>
        )}
        <iframe
          src={iframeSrc}
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* PILIHAN RESOLUSI & SERVER */}
      {qualities?.length > 0 && (
        <div className="bg-[#211B24]/90 border border-[#F4B8C6]/20 p-5 md:p-6 rounded-[28px] shadow-vogue-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F4B8C6]/15">
            <h3 className="text-base md:text-lg font-extrabold text-[#FDF6F7] flex items-center gap-2.5">
              <svg
                className="w-4 h-4 text-[#F4B8C6]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                />
              </svg>
              Pilih Resolusi &amp; Server
            </h3>
            <span className="text-[11px] text-[#AD9CA6]">
              Server Aktif:{" "}
              <strong className="text-[#F4B8C6]">{activeServer}</strong>
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {qualities.map((qual, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center gap-3 border-b border-[#F4B8C6]/10 pb-3.5 last:border-0 last:pb-0"
              >
                <span className="bg-[#161218] text-[#F4B8C6] font-extrabold px-4 py-1.5 rounded-full text-xs md:w-24 text-center border border-[#F4B8C6]/30 shrink-0">
                  {qual.title}
                </span>

                <div className="flex flex-wrap gap-2">
                  {qual.serverList.map((srv, sIdx) => {
                    const isCurrent = activeServer === srv.title;
                    return (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() =>
                          handleServerClick(srv.serverId, srv.title)
                        }
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                          isCurrent
                            ? "bg-[#F4B8C6] text-[#161218] border-[#F4B8C6] shadow-vogue-blush"
                            : "bg-[#161218]/60 text-[#AD9CA6] border-[#F4B8C6]/15 hover:bg-[#161218] hover:text-[#FDF6F7] hover:border-[#F4B8C6]/45"
                        }`}
                      >
                        {srv.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
