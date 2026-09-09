import type { Metadata } from "next";
import { fetchBrochureBySlug, fetchCarBySlug } from "@/lib/wordpress";
import { getReportById, isValidToken } from "@/lib/brochures";
import VehicleReport from "@/components/VehicleReport";
import AccessGate from "@/components/brochure/AccessGate";

// Informe privado: nunca indexar y siempre validar acceso en cada request.
export const dynamic = "force-dynamic";

type RouteParams = { id: string };
type SearchParams = { k?: string };

export const metadata: Metadata = {
  title: "Informe privado · Quiroz Automotriz",
  robots: { index: false, follow: false, nocache: true },
};

export default async function InformePage({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { k } = await searchParams;

  const cmsReport = await fetchBrochureBySlug(id);
  const fallbackReport = getReportById(id);
  const report = cmsReport ?? fallbackReport;
  const hasValidToken = Boolean(
    report?.accessToken &&
    k &&
    (cmsReport ? report.accessToken === k : isValidToken(id, k)),
  );

  // Sin informe o token inválido → puerta de acceso (no revela datos privados).
  if (!report || !hasValidToken) {
    const car = await fetchCarBySlug(id).catch(() => undefined);
    const carName = car ? `${car.brand} ${car.model} ${car.year}` : undefined;
    return <AccessGate carName={carName} />;
  }

  const car = await fetchCarBySlug(id);
  if (!car) {
    return <AccessGate />;
  }

  return <VehicleReport car={car} report={report} />;
}
