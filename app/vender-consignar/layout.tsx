import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Vender o Consignar — Quiroz Redcar · Quiroz Redcar" },
  description:
    "Vende o consigna tu auto con Quiroz Redcar. Compramos directamente o lo consignamos a tu precio. Pago inmediato, trámites incluidos, sin complicaciones. San Miguel, Santiago.",
  openGraph: {
    title: "Vender o Consignar — Quiroz Redcar",
    description:
      "Transforma tu auto en dinero hoy. Pago inmediato al cerrar el trato, trámites de transferencia incluidos, sin comisiones ocultas.",
    url: "https://quirozredcar.cl/vender-consignar",
  },
};

export default function VenderConsignarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
