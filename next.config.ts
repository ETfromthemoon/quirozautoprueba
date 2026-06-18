import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "quirozautomotriz.cl" },
      { protocol: "https", hostname: "www.quirozautomotriz.cl" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
