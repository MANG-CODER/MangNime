"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Jalankan fungsi async (biasanya method provider client) dan kasih state-nya.
 *
 *   const { data, error, loading, retry } = useProvider(
 *     () => OtakudesuClient.getEpisode(slug),
 *     [slug],
 *   );
 *
 * Pengganti useUpstream(path, ttl) dari versi sebelumnya.
 */
export function useProvider(loader, deps = []) {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.resolve()
      .then(loader)
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch(
        (error) => alive && setState({ data: null, error, loading: false }),
      );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
