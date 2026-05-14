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
    <div className="space-y-6 w-full">
      {/* Video Iframe dengan Cosmic Glow Border */}
      <div className="w-full aspect-video bg-[#05040a] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group ring-1 ring-celestia-royal/20">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-celestia-night/90 flex flex-col items-center justify-center backdrop-blur-md">
            <span className="w-10 h-10 border-4 border-celestia-lavender border-t-transparent rounded-full animate-spin mb-4"></span>
            <span className="text-celestia-lavender font-bold tracking-widest animate-pulse text-sm">
              Menghubungkan ke {activeServer}...
            </span>
          </div>
        )}
        <iframe
          src={iframeSrc}
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        ></iframe>
      </div>

      {/* Pilihan Resolusi & Server */}
      {qualities?.length > 0 && (
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
          <h3 className="font-heading text-lg font-bold text-white mb-5 flex items-center gap-3">
            <span className="w-2 h-6 bg-celestia-sky rounded-full shadow-[0_0_15px_rgba(76,201,255,0.6)]"></span>
            Pilih Resolusi & Server
          </h3>
          <div className="flex flex-col gap-4">
            {qualities.map((qual, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0"
              >
                {/* Badge Resolusi (360p, 480p, 720p) */}
                <span className="bg-celestia-royal/20 text-celestia-lilac font-black px-4 py-2 rounded-xl text-sm md:w-24 text-center border border-celestia-royal/30 shadow-inner">
                  {qual.title}
                </span>

                {/* Daftar Tombol Server */}
                <div className="flex flex-wrap gap-2.5">
                  {qual.serverList.map((srv, sIdx) => {
                    const isCurrent = activeServer === srv.title;
                    return (
                      <button
                        key={sIdx}
                        onClick={() =>
                          handleServerClick(srv.serverId, srv.title)
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                          isCurrent
                            ? "bg-gradient-to-r from-celestia-royal to-celestia-lavender text-white border-transparent shadow-glow-purple transform scale-105"
                            : "bg-white/5 text-gray-400 border-white/10 hover:bg-celestia-royal/30 hover:text-white hover:border-celestia-lavender/50"
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
