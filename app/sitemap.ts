import type { MetadataRoute } from "next";
import { fetchCars } from "@/lib/wordpress";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

// Regenerate sitemap every hour via ISR so new WP posts appear automatically.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await fetchCars();
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
    images: car.image ? [car.image] : [],
  }));

  return [home, ...vehicles];
}
