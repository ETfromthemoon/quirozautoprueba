import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export const metadata: Metadata = {
  title: "Vender o Consignar — Quiroz Automotriz",
  description:
    "Vende o consigna tu auto. Compramos directamente o lo consignamos a tu precio. Pago inmediato, trámites incluidos, sin complicaciones. Concón y Valparaíso.",
  openGraph: {
    title: "Vender o Consignar — Quiroz Automotriz",
    description:
      "Transforma tu auto en dinero hoy. Pago inmediato al cerrar el trato, trámites de transferencia incluidos, sin comisiones ocultas.",
    url: `${siteUrl}/vender-consignar`,
  },
};

export default function VenderConsignarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
