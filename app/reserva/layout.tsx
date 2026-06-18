import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quirozautomotriz.cl";

export const metadata: Metadata = {
  title: "Reserva de Vehículo — Quiroz Redcar",
  description:
    "Reserva tu vehículo en Quiroz Redcar con $200.000. Aseguramos tu compra, retiramos la publicación de todas las plataformas y te garantizamos el precio. Concón y Valparaíso.",
  openGraph: {
    title: "Reserva de Vehículo — Quiroz Redcar",
    description:
      "Asegura tu compra ahora. Reserva tu vehículo con $200.000 y garantizamos que nadie más lo comprará mientras decides.",
    url: `${siteUrl}/reserva`,
  },
};

export default function ReservaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
