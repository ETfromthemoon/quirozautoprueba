import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cars, getCarById } from "@/lib/cars";
import VehicleDetail from "@/components/VehicleDetail";

type RouteParams = { id: string };

export function generateStaticParams(): RouteParams[] {
  return cars.map((car) => ({ id: car.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = getCarById(id);
  if (!car) return { title: "Vehículo no encontrado · Quiroz Redcar" };

  const title = `${car.brand} ${car.model} ${car.year} · ${car.price} · Quiroz Redcar`;
  const description = `${car.brand} ${car.model} ${car.variant ?? ""} ${car.year}. ${car.km} km · ${car.fuel} · ${car.transmission}. ${car.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: car.image, width: 1200, height: 630 }],
      type: "website",
      locale: "es_CL",
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const car = getCarById(id);
  if (!car) notFound();
  return <VehicleDetail car={car} />;
}
