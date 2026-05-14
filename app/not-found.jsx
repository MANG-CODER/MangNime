import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4 animate-fade-in">
      {/* Gambar Maskot / Icon 404 */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 hover:scale-105 transition-transform duration-500">
        <Image
          src="/img/404icon.png"
          alt="Halaman Tersesat di Isekai"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      {/* Bagian Teks */}
      <div className="space-y-2">
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-celestia-pink to-celestia-lavender drop-shadow-lg">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Halaman Tidak Ditemukan
        </h2>
      </div>

      <p className="text-gray-400 max-w-md leading-relaxed text-sm md:text-base">
        Waduh, sepertinya kamu tersesat di isekai. Coba kembali
        ke beranda untuk mencari anime lainnya.
      </p>

      {/* Tombol Aksi */}
      <div className="pt-4 relative z-10">
        <Button href="/" variant="primary" size="md">
          Kembali ke beranda
        </Button>
      </div>
    </div>
  );
}
