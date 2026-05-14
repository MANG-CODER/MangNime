import Link from "next/link";
import Image from "next/image";

export default function KomikCard({ komik }) {
  // PENTING: Mengecek apakah data komiknya terbungkus di dalam properti "data" (seperti di endpoint popular)
  const itemData = komik.data ? komik.data : komik;

  const slug = itemData.slug || itemData.endpoint || "";
  const title = itemData.title || "Judul Tidak Diketahui";

  // Mencoba berbagai nama properti gambar dari berbagai endpoint
  const image =
    itemData.coverImage ||
    itemData.cover ||
    itemData.thumbnail ||
    "https://placehold.co/200x300/151226/8b6cff?text=No+Image";

  // Mengambil chapterIndex dari array chapters indeks ke-0 jika ada
  const latestChapter =
    itemData.chapters && itemData.chapters.length > 0
      ? itemData.chapters[0].chapterIndex
      : "";

  const score = itemData.rating || "";

  return (
    <Link href={`/komik/${slug}`} className="group flex flex-col gap-2">
      <div className="aspect-[3/4] rounded-xl overflow-hidden relative border border-white/10 bg-[#151226]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

        {/* Badge Tipe (Manga/Manhwa/Manhua) */}
        {itemData.format && (
          <span className="absolute top-2 right-2 bg-celestia-pink text-white text-[9px] font-black tracking-widest px-2 py-1 rounded uppercase shadow-lg z-10">
            {itemData.format}
          </span>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end z-10">
          {latestChapter && (
            <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
              Ch. {latestChapter}
            </span>
          )}
          {score && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-celestia-gold drop-shadow-md">
              ★ {score}
            </span>
          )}
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight group-hover:text-celestia-pink transition-colors">
          {title}
        </h3>
      </div>
    </Link>
  );
}
