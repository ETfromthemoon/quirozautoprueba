import type { MetadataRoute } from "next";
import { cars } from "@/lib/cars";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: siteUrl,
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
  };

  const vehicles: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${siteUrl}/vehiculo/${car.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
    images: [car.image],
  }));

  return [home, ...vehicles];
}
