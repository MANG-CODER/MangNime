"use client";

import { useEffect } from "react";

export default function EpisodeHistoryTracker({
  slug,
  title,
  image,
  episodeNumber,
}) {
  useEffect(() => {
    const hist = JSON.parse(localStorage.getItem("mangnime_history")) || {
      anime: {},
      komik: {},
    };

    hist.anime[slug] = {
      title: title || `Episode ${episodeNumber}`,
      image: image || "https://placehold.co/300x400",
      episodeNumber: episodeNumber,
      url: window.location.pathname,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("mangnime_history", JSON.stringify(hist));
  }, [slug, title, image, episodeNumber]);

  return null;
}
