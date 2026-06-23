import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export const metadata: Metadata = {
  title: "Seguros Automotrices — Quiroz Automotriz",
  description:
    "Cotiza y contrata el seguro ideal para tu vehículo. Cobertura completa, asesoría personalizada, gestión de siniestros. Concón y Valparaíso.",
  openGraph: {
    title: "Seguros Automotrices — Quiroz Automotriz",
    description:
      "Protege tu vehículo con el mejor seguro. Cobertura completa, asesoría personalizada y gestión de siniestros.",
    url: `${siteUrl}/seguros`,
  },
};

export default function SegurosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
