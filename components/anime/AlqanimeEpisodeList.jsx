"use client";

export default function AlqanimeEpisodeList({ episodes }) {
  const handleScroll = (episode) => {
    const target = document.getElementById(`episode-${episode}`);

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {episodes.map((ep, idx) => (
        <button
          key={idx}
          onClick={() => handleScroll(ep.episode)}
          className="bg-black/20 border border-white/5 hover:border-celestia-sky/50 hover:bg-celestia-sky/5 p-4 rounded-2xl flex items-center gap-4 transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-celestia-night flex items-center justify-center font-black text-celestia-sky">
            EP
          </div>

          <div>
            <div className="font-bold text-gray-200">{ep.title}</div>

            <div className="text-xs text-gray-500">Episode {ep.episode}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
