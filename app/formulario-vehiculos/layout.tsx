import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export const metadata: Metadata = {
  title: "Formulario de Vehículo — Quiroz Redcar",
  description:
    "Vende tu auto de forma segura o consigna tu vehículo con Quiroz Redcar. Respuesta rápida, pago al instante, trámites incluidos. Concón y Valparaíso.",
  openGraph: {
    title: "Formulario de Vehículo — Quiroz Redcar",
    description:
      "Compra o consigna tu vehículo. Venta segura, transparente y con pago al instante.",
    url: `${siteUrl}/formulario-vehiculos`,
  },
};

export default function FormularioVehiculosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
