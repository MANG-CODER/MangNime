const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function coreFetcher(url, options = {}) {
  const retries = options.retries || 3;

  for (let i = 1; i <= retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (i === retries) {
        console.error(
          `[Fetcher Error] Gagal fetch ${url} setelah ${retries}x percobaan:`,
          error.message,
        );
        throw error;
      }

      const delayTime = i * 1000;
      console.warn(
        `[Fetcher Warn] Gagal ambil ${url} (${error.message}). Coba lagi dalam ${delayTime}ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, delayTime));
    }
  }
}
