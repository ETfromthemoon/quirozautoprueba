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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const car = getCarById(id);
  if (!car) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${car.brand} ${car.model} ${car.variant ?? ""} ${car.year}`.trim(),
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleModelDate: String(car.year),
    productionDate: String(car.year),
    description: car.description,
    image: car.image,
    bodyType: car.bodyType,
    fuelType: car.fuel,
    vehicleTransmission: car.transmission,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: Number(car.km.replace(/[^\d]/g, "")) || undefined,
      unitCode: "KMT",
    },
    ...(car.documentation?.color && { color: car.documentation.color }),
    ...(car.documentation?.doors && {
      numberOfDoors: car.documentation.doors,
    }),
    offers: {
      "@type": "Offer",
      priceCurrency: "CLP",
      price: car.priceNumeric,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      url: `${siteUrl}/vehiculo/${car.id}`,
      seller: { "@type": "AutoDealer", name: "Quiroz Redcar" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <VehicleDetail car={car} />
    </>
  );
}
