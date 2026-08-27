export function proxyImage(originalUrl) {
  if (!originalUrl)
    return "https://placehold.co/800x1200/151226/ff6c9b?text=Image+Error";

  return originalUrl.split("?")[0];
}
