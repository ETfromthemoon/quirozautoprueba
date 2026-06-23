import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export const metadata: Metadata = {
  title: "Financiamiento — Quiroz Automotriz",
  description:
    "Financia tu próximo vehículo. Evaluamos tu perfil crediticio, coordinamos el crédito directamente y te ofrecemos cuotas a tu medida en Concón y Valparaíso.",
  openGraph: {
    title: "Financiamiento — Quiroz Automotriz",
    description:
      "Opciones de financiamiento flexibles para que nada te detenga. Pre-aprobado rápido, sin pie obligatorio.",
    url: `${siteUrl}/financiamiento`,
  },
};

export default function FinanciamientoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
