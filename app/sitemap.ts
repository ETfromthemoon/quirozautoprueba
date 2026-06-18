import type { MetadataRoute } from "next";
import { fetchCars } from "@/lib/wordpress";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export const revalidate = 3600;

const STATIC_PAGES = [
  { url: siteUrl, priority: 1 },
  { url: `${siteUrl}/nosotros`, priority: 0.7 },
  { url: `${siteUrl}/financiamiento`, priority: 0.8 },
  { url: `${siteUrl}/seguros`, priority: 0.7 },
  { url: `${siteUrl}/reserva`, priority: 0.7 },
  { url: `${siteUrl}/vender-consignar`, priority: 0.8 },
  { url: `${siteUrl}/formulario-vehiculos`, priority: 0.6 },
  { url: `${siteUrl}/vendidos`, priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await fetchCars();
  const lastModified = new Date();

  const vehicles: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${siteUrl}/vehiculo/${car.id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
    images: car.image ? [car.image] : [],
  }));

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: p.url,
    lastModified,
    changeFrequency: "monthly",
    priority: p.priority,
  }));

  return [...staticEntries, ...vehicles];
}
