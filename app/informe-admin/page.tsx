import type { Metadata } from "next";
import { reports, buildInformeUrl, countReportModules, isValidAdminKey } from "@/lib/brochures";
import { cars } from "@/lib/cars";
import BrochureAdmin, { type AdminRow } from "@/components/brochure/BrochureAdmin";
import AccessGate from "@/components/brochure/AccessGate";

// Panel interno del vendedor: validar la clave en cada request, nunca cachear.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de informes privados · Quiroz Automotriz",
  robots: { index: false, follow: false, nocache: true },
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export default async function InformeAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ k?: string }>;
}) {
  const { k } = await searchParams;

  // Sin clave válida (INFORME_ADMIN_KEY) el panel no revela nada.
  if (!isValidAdminKey(k)) {
    return <AccessGate />;
  }

  // Las filas (incluidos los links con token) se arman en el servidor:
  // solo llegan al navegador del vendedor ya autenticado.
  const rows: AdminRow[] = Object.values(reports).map((r) => {
    const car = cars.find((c) => c.id === r.carId);
    return {
      carId: r.carId,
      name: car ? `${car.brand} ${car.model} ${car.year}` : r.carId,
      modulos: countReportModules(r),
      url: buildInformeUrl(siteUrl, r.carId) ?? "",
    };
  });

  return <BrochureAdmin rows={rows} />;
}
