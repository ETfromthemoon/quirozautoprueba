import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vehículos Disponibles — Quiroz Automotriz",
  description:
    "Catálogo completo de vehículos disponibles en Quiroz Automotriz. SUV, Sedan, Pickup, Hatchback y más. Concón y Valparaíso.",
  openGraph: {
    title: "Vehículos Disponibles — Quiroz Automotriz",
    description: "Explora nuestro catálogo completo de vehículos.",
  },
};

// Redirige al home que ya contiene el catálogo completo con slider
export default function DisponiblesPage() {
  redirect("/");
}
