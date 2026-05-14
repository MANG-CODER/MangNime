"use client";
import { useState, useEffect } from "react";

export function useBookmark() {
  const [bookmarks, setBookmarks] = useState({ anime: [], episode: [] });

  // Mengambil data dari localStorage saat komponen dimuat
  useEffect(() => {
    const fetchBookmarks = () => {
      const stored = localStorage.getItem("mangnime_bookmarks");
      if (stored) {
        try {
          setBookmarks(JSON.parse(stored));
        } catch (error) {
          console.error("Gagal membaca bookmark:", error);
        }
      }
    };

    fetchBookmarks();

    // Mendengarkan event kustom agar Navbar langsung ter-update jika ada perubahan
    window.addEventListener("bookmarksUpdated", fetchBookmarks);
    return () => window.removeEventListener("bookmarksUpdated", fetchBookmarks);
  }, []);

  const saveToStorage = (newBookmarks) => {
    setBookmarks(newBookmarks);
    localStorage.setItem("mangnime_bookmarks", JSON.stringify(newBookmarks));
    // Memicu event agar komponen lain tahu ada perubahan
    window.dispatchEvent(new Event("bookmarksUpdated"));
  };

  const toggleAnime = (animeData) => {
    const animeId = animeData.animeId || animeData.slug || animeData.id;
    const isExist = bookmarks.anime.find(
      (a) => (a.animeId || a.slug || a.id) === animeId,
    );

    let updatedAnime = [];
    if (isExist) {
      updatedAnime = bookmarks.anime.filter(
        (a) => (a.animeId || a.slug || a.id) !== animeId,
      );
    } else {
      updatedAnime = [
        ...bookmarks.anime,
        { ...animeData, savedAt: Date.now() },
      ];
    }
    saveToStorage({ ...bookmarks, anime: updatedAnime });
  };

  const toggleEpisode = (epData) => {
    const epId = epData.episodeId || epData.slug || epData.id;
    const isExist = bookmarks.episode.find(
      (e) => (e.episodeId || e.slug || e.id) === epId,
    );

    let updatedEps = [];
    if (isExist) {
      updatedEps = bookmarks.episode.filter(
        (e) => (e.episodeId || e.slug || e.id) !== epId,
      );
    } else {
      updatedEps = [...bookmarks.episode, { ...epData, savedAt: Date.now() }];
    }
    saveToStorage({ ...bookmarks, episode: updatedEps });
  };

  const isAnimeSaved = (id) =>
    bookmarks.anime.some((a) => (a.animeId || a.slug || a.id) === id);
  const isEpisodeSaved = (id) =>
    bookmarks.episode.some((e) => (e.episodeId || e.slug || e.id) === id);

  return {
    bookmarks,
    toggleAnime,
    toggleEpisode,
    isAnimeSaved,
    isEpisodeSaved,
  };
}
