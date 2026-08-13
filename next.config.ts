import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las fotos se entregan directamente desde WordPress. lib/wordpress.ts
    // prefiere sus sub-tallas; evitar /_next/image elimina el consumo de
    // Image Optimization de Vercel (Hobby).
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "quirozautomotriz.cl" },
      { protocol: "https", hostname: "www.quirozautomotriz.cl" },
      { protocol: "https", hostname: "admin.quirozautomotriz.cl" },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
