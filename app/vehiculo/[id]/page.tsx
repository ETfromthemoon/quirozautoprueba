import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchCarBySlug, fetchCarSlugs } from "@/lib/wordpress";
import VehicleDetail from "@/components/VehicleDetail";

// ISR: regenerar la ficha de cada vehículo hasta cada 60 s
export const revalidate = 60;

type RouteParams = { id: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  try {
    const slugs = await fetchCarSlugs();
    // Pre-generar solo primeros 8 en build; el resto se genera on-demand (ISR)
    return slugs.slice(0, 8).map((id) => ({ id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await fetchCarBySlug(id);
  if (!car) return { title: "Vehículo no encontrado · Quiroz Automotriz" };

  const title = `${car.brand} ${car.model} ${car.year} · ${car.price} · Quiroz Automotriz`;
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
  const car = await fetchCarBySlug(id);
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
      seller: { "@type": "AutoDealer", name: "Quiroz Automotriz" },
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
