import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Los informes privados NO se listan aquí: un disallow publicaría las
      // rutas en robots.txt. Se protegen con token/clave + metadata noindex.
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
