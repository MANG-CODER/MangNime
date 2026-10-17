import Image from "next/image";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-5 px-4 animate-fade-in">
      <div className="relative w-60 h-60 md:w-72 md:h-72 hover:scale-105 transition-transform duration-500">
        <Image
          src="/img/404icon.svg"
          alt="Halaman Tidak Ditemukan"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>

      <div className="space-y-2">
        <h1 className="font-serif italic text-7xl md:text-8xl font-bold text-[#F4B8C6]">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#FDF6F7]">
          Halaman Tidak Ditemukan
        </h2>
      </div>

      <p className="text-[#AD9CA6] max-w-md leading-relaxed text-sm">
        Waduh, sepertinya kamu tersesat di isekai. Coba kembali ke beranda untuk
        menjelajahi katalog anime dan komik lainnya.
      </p>

      <div className="pt-2">
        <Button href="/" variant="primary" size="md">
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
