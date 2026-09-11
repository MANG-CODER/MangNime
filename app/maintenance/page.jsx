import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Maintenance() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4 animate-fade-in">
      {/* Gambar Maskot / Icon Maintenance */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 hover:scale-105 transition-transform duration-500">
        <Image
          src="/img/404icon.png"
          alt="MangNime sedang dalam maintenance"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      {/* Bagian Teks */}
      <div className="space-y-2">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-celestia-pink to-celestia-lavender drop-shadow-lg">
          Maintenance
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white">
          MangNime Sedang Dalam Perbaikan
        </h2>
      </div>

      <p className="text-gray-400 max-w-md leading-relaxed text-sm md:text-base">
        Mohon maaf atas ketidaknyamanannya. MangNime sedang melakukan
        maintenance untuk meningkatkan sistem dan layanan. Silakan kembali lagi
        nanti.
      </p>

      {/* Status Jaringan ala Cloudflare */}
      <div className="w-full max-w-xl bg-white/[0.02] border border-white/10 rounded-2xl p-4 my-2">
        <div className="grid grid-cols-3 gap-2 text-center text-xs md:text-sm">
          <div className="flex flex-col items-center">
            <span className="text-gray-400">Browser</span>
            <span className="text-green-400 font-semibold mt-1">Working</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/10 px-2">
            <span className="text-celestia-sky font-semibold">MangNime</span>
            <span className="text-yellow-400 font-semibold mt-1">Updating</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-400">Server</span>
            <span className="text-green-400 font-semibold mt-1">Working</span>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-2 relative z-10">
        <Button href="/" variant="primary" size="md">
          Coba Kembali
        </Button>
      </div>
    </div>
  );
}
