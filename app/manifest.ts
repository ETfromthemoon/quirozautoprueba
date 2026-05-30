import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quiroz Redcar — Colección Premium",
    short_name: "Quiroz Redcar",
    description:
      "Catálogo de vehículos premium en Valparaíso, Chile. Más de 20 años seleccionando automóviles excepcionales.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    lang: "es-CL",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
