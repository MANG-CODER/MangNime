import Image from "next/image";
import Link from "next/link";
import { fetchKomikAPI } from "@/services/komikApi";
import KomikCard from "@/components/komik/KomikCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import KomikActionButtons from "@/components/komik/KomikActionButtons";
import CommentSection from "@/components/ui/CommentSection";

// Konfigurasi Metadata SEO Otomatis
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const res = await fetchKomikAPI(`/komik/${resolvedParams.slug}`);
  const komik = res?.data || null;

  if (!komik) return { title: "Komik Tidak Ditemukan - MangNime" };
  return {
    title: `${komik.title} - MangNime`,
    description: komik.synopsis?.slice(0, 150) + "...",
  };
}

export const revalidate = 3600;

export default async function DetailKomikPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // FETCH DATA DETAIL KOMIK
  const res = await fetchKomikAPI(`/komik/${slug}`);
  const komik = res?.data || null;

  if (!komik) {
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
          Gulungan sihir komik ini tidak ditemukan.
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

  // Persiapan Variabel Data
  const bgImage = komik.backgroundImage || komik.cover;
  const chapters = komik.readChapter || [];
  const recommendations = komik.recommended || [];

  // Mencari chapter pertama (untuk tombol Mulai Membaca)
  const firstChapter =
    chapters.length > 0 ? chapters[chapters.length - 1] : null;

  return (
    // Container utama ditambahkan 'relative'
    <div className="min-h-screen bg-[#0D0B1A] pb-20 relative animate-fade-in">
      {/* 1. HERO & BACKGROUND BANNER (FORMULA ANTI-GAP) */}
      <div className="absolute top-0 left-0 w-full h-[450px] md:h-[550px] lg:h-[700px] z-0 overflow-hidden">
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover opacity-25 blur-[40px] scale-125 origin-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B1A]/10 via-[#0D0B1A]/80 to-[#0D0B1A] translate-y-[1px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0D0B1A] via-[#0D0B1A] to-transparent translate-y-[1px]"></div>
      </div>

      {/* 2. KONTEN DETAIL UTAMA */}
      <div className="container mx-auto px-4 md:px-6 max-w-[1200px] pt-28 md:pt-36 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 md:items-start mt-6 md:mt-8">
          {/* KIRI: Cover Komik */}
          <div className="w-56 sm:w-64 md:w-72 lg:w-80 flex-shrink-0 mx-auto md:mx-0 group">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10">
              <Image
                src={komik.cover}
                alt={komik.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
              {/* Badge Tipe di Sudut Kiri Atas Cover */}
              {komik.format && (
                <div className="absolute top-3 left-3 bg-celestia-royal/90 backdrop-blur-md text-white text-xs font-black tracking-widest px-3 py-1.5 rounded-lg uppercase shadow-lg">
                  {komik.format}
                </div>
              )}
            </div>
          </div>

          {/* KANAN: Informasi Komik */}
          <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start">
            {/* Native Title */}
            {komik.nativeTitle && (
              <h3 className="text-celestia-gold/80 font-medium text-sm md:text-base mb-2 mt-4 md:mt-0">
                {komik.nativeTitle}
              </h3>
            )}

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl mb-4">
              {komik.title}
            </h1>

            {/* Badges Info Cepat */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
              <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                ★ {komik.rating} / 10
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  komik.status.toLowerCase() === "ongoing"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {komik.status}
              </span>
              <span className="bg-white/5 text-gray-300 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {komik.totalChapters} Chapter
              </span>
              {komik.author && (
                <span className="text-celestia-pink text-sm font-medium px-3 py-1.5">
                  By {komik.author}
                </span>
              )}
            </div>

            {/* List Genre */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
              {komik.genres?.map((genre, idx) => (
                <Link
                  key={idx}
                  href={`/search?type=komik&genreIds=${genre.id}`}
                  className="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 bg-white/5 text-gray-300 hover:text-white border border-white/10 hover:border-celestia-pink rounded-full transition-all"
                >
                  {genre.data?.name}
                </Link>
              ))}
            </div>

            {/* ACTION BUTTONS (CLIENT) */}
            <KomikActionButtons
              komik={komik}
              slug={slug}
              firstChapter={firstChapter}
            />
          </div>
        </div>
      </div>

      {/* 3. KONTEN BAWAH: SINOPSIS & DAFTAR CHAPTER */}
      <div className="container mx-auto max-w-[1200px] px-4 pt-16 md:pt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* KOLOM KIRI (70%): SINOPSIS & CHAPTER */}
          <div className="lg:col-span-2 space-y-12">
            {/* Sinopsis */}
            <ScrollReveal>
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading text-3xl font-black text-white">
                    Sinopsis{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-pink to-celestia-lavender">
                      Cerita
                    </span>
                  </h2>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl text-gray-300 leading-relaxed whitespace-pre-line font-body text-sm md:text-[15px] backdrop-blur-xl shadow-lg">
                  {komik.synopsis || "Sinopsis tidak tersedia."}
                </div>
              </section>
            </ScrollReveal>

            {/* Daftar Chapter */}
            <ScrollReveal>
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-heading text-3xl font-black text-white">
                    Daftar{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-celestia-sky to-celestia-lavender">
                      Chapter
                    </span>
                  </h2>
                  <div className="h-px flex-1 bg-white/5"></div>
                  <span className="text-gray-500 text-sm font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                    {chapters.length} Chapter
                  </span>
                </div>

                {/* Scrollable Chapter Box */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-8 max-h-[550px] overflow-y-auto custom-scrollbar backdrop-blur-xl shadow-lg">
                  {chapters.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pr-2">
                      {chapters.map((ch, idx) => (
                        <Link
                          key={idx}
                          href={`/komik/${slug}/chapter-${ch.chapterIndex}`}
                          className="bg-black/20 border border-white/5 hover:border-celestia-sky/50 hover:bg-celestia-sky/5 hover:shadow-glow-blue px-5 py-4 rounded-2xl flex items-center justify-between group transition-all"
                        >
                          <span className="font-bold text-sm text-gray-300 group-hover:text-white transition-colors">
                            Chapter {ch.chapterIndex}
                          </span>
                          <span className="text-gray-600 group-hover:text-celestia-sky transform group-hover:translate-x-1 transition-all">
                            &rarr;
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500 bg-black/20 rounded-2xl border border-white/5">
                      Data chapter belum tersedia.
                    </div>
                  )}
                </div>
              </section>
            </ScrollReveal>
          </div>

          {/* KOLOM KANAN (30%): REKOMENDASI */}
          <div className="lg:col-span-1">
            <ScrollReveal>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-celestia-gold rounded-full shadow-glow-gold"></span>
                Rekomendasi
              </h2>

              {recommendations.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {recommendations.slice(0, 6).map((rec, idx) => (
                    <Link
                      key={idx}
                      href={`/komik/${rec.slug}`}
                      className="flex gap-4 bg-white/[0.02] border border-white/5 hover:border-celestia-gold/50 hover:bg-celestia-gold/5 p-3 rounded-2xl group transition-all shadow-lg"
                    >
                      <div className="w-16 md:w-20 aspect-[3/4] shrink-0 relative rounded-xl overflow-hidden bg-black/50 border border-white/5 group-hover:border-celestia-gold/30 transition-colors">
                        <Image
                          src={rec.cover}
                          alt={rec.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-white font-bold text-sm line-clamp-2 leading-tight group-hover:text-celestia-gold transition-colors mb-2">
                          {rec.title}
                        </h4>
                        <span className="text-xs text-gray-400 capitalize flex items-center gap-1.5 bg-black/30 w-max px-2 py-1 rounded-md border border-white/5">
                          {rec.format} •{" "}
                          <span className="text-celestia-gold font-bold">
                            ★ {rec.rating}
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl text-center text-gray-500 text-sm backdrop-blur-xl">
                  Belum ada rekomendasi.
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* 4. DISKUSI KOMIK (DI LUAR GRID, FULL WIDTH) */}
      <div className="container mx-auto max-w-[1200px] px-4 mt-16 relative z-10">
        <ScrollReveal>
          <CommentSection topicId={`komik-${slug}`} title="Diskusi Komik" />
        </ScrollReveal>
      </div>
    </div>
  );
}
