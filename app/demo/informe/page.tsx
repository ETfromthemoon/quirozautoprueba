import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VehicleReport from "@/components/VehicleReport";
import { getReportById } from "@/lib/brochures";
import { getFallbackCarBySlug } from "@/lib/wordpress";

// Esta es la única ruta de muestra sin clave. Mantiene los informes reales
// protegidos en /informe/[id]?k=... y usa un vehículo publicado del CMS.
const DEMO_CAR_ID = "bmw-420-grand-coupe-m-designe-2-0-at-2024";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demo de informe de peritaje · Quiroz Automotriz",
  description:
    "Demostración pública de la experiencia de informe vehicular de Quiroz Automotriz.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PublicBrochureDemoPage() {
  const report = getReportById(DEMO_CAR_ID);
  const car = getFallbackCarBySlug(DEMO_CAR_ID);

  // Si el auto deja de estar disponible desde el CMS, la demo no revela un
  // informe asociado a una publicación retirada.
  if (!report || !car || car.priceNumeric <= 0) notFound();

  return <VehicleReport car={car} report={report} demo />;
}
