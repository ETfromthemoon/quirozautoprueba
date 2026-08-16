"use client";

import { useEffect, useRef } from "react";
import {
  clearCatalogPosition,
  readCatalogPosition,
} from "@/lib/catalog-position";

export default function RestoreCatalogPosition() {
  const hasRestored = useRef(false);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    const position = readCatalogPosition();
    if (!position) return;

    // Esperar al primer frame garantiza que el contenedor y sus secciones ya
    // estén montados antes de aplicar la posición guardada.
    requestAnimationFrame(() => {
      const root = document.getElementById("showcase-root");
      if (!root) return;

      const section = document.getElementById(position.sectionId);
      if (section) {
        const rootRect = root.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();
        const sectionTop = root.scrollTop + sectionRect.top - rootRect.top;
        root.scrollTo({ top: Math.max(0, sectionTop), behavior: "auto" });
      } else {
        root.scrollTo({ top: Math.max(0, position.scrollTop), behavior: "auto" });
      }

      clearCatalogPosition();
    });
  }, []);

  return null;
}
