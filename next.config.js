/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities:[75, 100],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
