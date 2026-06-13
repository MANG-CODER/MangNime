/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    loader: "custom",
    loaderFile: "./imageLoader.js",
  },
};

module.exports = nextConfig;
