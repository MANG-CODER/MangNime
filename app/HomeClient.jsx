"use client";

import HeroCarousel from "@/components/home/HeroCarousel";
import AnimeCard from "@/components/anime/AnimeCard";
import KomikCard from "@/components/komik/KomikCard";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CommentSection from "@/components/ui/CommentSection";
import FetchError from "@/components/ui/FetchError";
import { OtakudesuClient } from "@/services/providers/otakudesu.client";
import { KomikClient } from "@/services/komikApi.client";
import { useProvider } from "@/hooks/useProvider";

function SectionHeader({
  issue,
  tag,
  title,
  italicWord,
  href,
  icon,
  accentColor = "#F4B8C6",
}) {
  return (
    <div className="flex items-end justify-between mb-7 pb-4 border-b border-[#F4B8C6]/15">
      <div className="space-y-1.5">
        <div
          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ color: accentColor }}
        >
          <span className="p-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
            {icon}
          </span>
          <span>{issue}</span>
          <span className="text-[#AD9CA6]">{tag}</span>
        </div>
        <h2 className="text-2xl md:text-4xl font-extrabold text-[#FDF6F7] tracking-tight">
          {title}{" "}
          <span
            className="font-serif italic font-normal"
            style={{ color: accentColor }}
          >
            {italicWord}
          </span>
        </h2>
      </div>

      <Link
        href={href}
        prefetch={false}
        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#211B24] hover:bg-[#F4B8C6] text-xs font-bold text-[#FDF6F7] hover:text-[#161218] border border-[#F4B8C6]/25 transition-all shrink-0"
      >
        <span>Lihat Semua</span>
        <svg
          className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

const EMPTY_BOX =
  "text-center py-12 text-[#AD9CA6] text-sm border border-[#F4B8C6]/15 rounded-3xl bg-[#211B24]/50";

// Satu baris kartu (loading / error / kosong / berisi). Markup kartunya sama dengan versi lama.
function Rail({ state, items, loadingText, emptyText, render }) {
  if (state.loading) return <div className={EMPTY_BOX}>{loadingText}</div>;
  if (state.error) {
    return <FetchError error={state.error} onRetry={state.retry} compact />;
  }
  if (items.length === 0) return <div className={EMPTY_BOX}>{emptyText}</div>;

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 md:overflow-visible">
      {items.slice(0, 10).map((item, idx) => (
        <div
          key={idx}
          className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] md:w-auto shrink-0 snap-start"
        >
          <ScrollReveal>{render(item, idx)}</ScrollReveal>
        </div>
      ))}
    </div>
  );
}

export default function HomeClient() {
  // Dua request terpisah: kalau komik gagal, anime tetap tampil (dan sebaliknya).
  const animeHome = useProvider(() => OtakudesuClient.getHome(), []);
  const komikHome = useProvider(() => KomikClient.getHome(), []);

  const ongoingList = animeHome.data?.ongoing || [];
  const completedList = animeHome.data?.completed || [];
  const popularKomik = komikHome.data?.popular || [];
  const latestKomik = komikHome.data?.latest || [];

  return (
    <div className="space-y-16 pb-20 animate-fade-in">
      {ongoingList.length > 0 && (
        <HeroCarousel items={ongoingList.slice(0, 5)} />
      )}

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px] space-y-20 mt-8">
        <ScrollReveal>
          <div className="relative rounded-[28px] bg-gradient-to-r from-[#211B24] via-[#28202C] to-[#211B24] border border-[#F4B8C6]/25 p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-vogue-card overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#F4B8C6]/15 border border-[#F4B8C6]/35 text-[#F4B8C6] flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[#FDF6F7] font-extrabold text-base md:text-lg">
                    Mencari Judul Lainnya?
                  </h3>
                  <span className="font-serif italic text-xs text-[#E88D9E]">
                    Catalog Explorer
                  </span>
                </div>
                <p className="text-[#AD9CA6] text-xs md:text-sm mt-0.5">
                  Jika judul yang kamu cari tidak ada di daftar Terbaru atau
                  Populer, silakan gunakan fitur{" "}
                  <span className="text-[#F4B8C6] font-bold">
                    Pencarian (Search)
                  </span>{" "}
                  untuk hasil yang jauh lebih lengkap!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto relative z-10 shrink-0">
              <Link
                href="/komik/advanced-search"
                prefetch={false}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] text-xs font-extrabold transition-all shadow-vogue-blush"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter Komik
              </Link>
              <Link
                href="/genre"
                prefetch={false}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#161218]/80 hover:bg-[#161218] text-[#FDF6F7] border border-[#F4B8C6]/25 text-xs font-bold transition-all"
              >
                Genre Anime
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <section>
          <SectionHeader
            issue="01"
            tag="SIMULCAST SEASON"
            title="Anime"
            italicWord="Ongoing"
            href="/ongoing"
            accentColor="#F4B8C6"
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            }
          />

          <Rail
            state={animeHome}
            items={ongoingList}
            loadingText="Sedang memuat tayangan..."
            emptyText="Belum ada anime ongoing."
            render={(item, idx) => <AnimeCard anime={item} index={idx} />}
          />
        </section>

        <section>
          <SectionHeader
            issue="02"
            tag="FULL EPISODES"
            title="Anime"
            italicWord="Completed"
            href="/completed"
            accentColor="#F7D6C4"
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          <Rail
            state={animeHome}
            items={completedList}
            loadingText="Sedang memuat tayangan..."
            emptyText="Belum ada anime completed."
            render={(item, idx) => <AnimeCard anime={item} index={idx + 10} />}
          />
        </section>

        <section>
          <SectionHeader
            issue="03"
            tag="TRENDING READS"
            title="Komik"
            italicWord="Populer"
            href="/komik/popular"
            accentColor="#B8C4D4"
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
              </svg>
            }
          />

          <Rail
            state={komikHome}
            items={popularKomik}
            loadingText="Sedang memuat komik..."
            emptyText="Belum ada komik populer."
            render={(item, idx) => <KomikCard komik={item} />}
          />
        </section>

        <section>
          <SectionHeader
            issue="04"
            tag="FRESH CHAPTERS"
            title="Komik"
            italicWord="Terbaru"
            href="/komik/latest"
            accentColor="#E88D9E"
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            }
          />

          <Rail
            state={komikHome}
            items={latestKomik}
            loadingText="Sedang memuat komik..."
            emptyText="Belum ada komik terbaru."
            render={(item, idx) => <KomikCard komik={item} />}
          />
        </section>
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        <CommentSection
          topicId="komunitas-homepage"
          title="Komunitas MangNime"
        />
      </div>
    </div>
  );
}
