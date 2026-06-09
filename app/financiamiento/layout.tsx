import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Financiamiento — Quiroz Redcar · Quiroz Redcar" },
  description:
    "Financia tu próximo vehículo con Quiroz Redcar. Evaluamos tu perfil crediticio, coordinamos el crédito directamente y te ofrecemos cuotas a tu medida en San Miguel, Santiago.",
  openGraph: {
    title: "Financiamiento — Quiroz Redcar",
    description:
      "Opciones de financiamiento flexibles para que nada te detenga. Pre-aprobado rápido, sin pie obligatorio.",
    url: "https://quirozredcar.cl/financiamiento",
  },
};

export default function FinanciamientoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
