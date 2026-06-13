"use client";

import { useEffect } from "react";

export default function EpisodeHistoryTracker({
  slug,
  title,
  image,
  episodeNumber,
}) {
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("mangnime_history")) || {};
      const hist = {
        anime: raw.anime || {},
        komik: raw.komik || {},
      };

      hist.anime[slug] = {
        title: title || `Episode ${episodeNumber}`,
        image: image || "https://placehold.co/300x400",
        episodeNumber: episodeNumber,
        url: window.location.pathname,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("mangnime_history", JSON.stringify(hist));
    } catch (e) {
      localStorage.removeItem("mangnime_history");
    }
  }, [slug, title, image, episodeNumber]);

  return null;
}
