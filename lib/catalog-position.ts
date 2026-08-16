export const CATALOG_POSITION_STORAGE_KEY = "quiroz-catalog-position";

type CatalogPosition = {
  sectionId: string;
  scrollTop: number;
};

export function saveCatalogPosition(sectionId: string) {
  if (typeof window === "undefined") return;

  const root = document.getElementById("showcase-root");
  const position: CatalogPosition = {
    sectionId,
    scrollTop: root?.scrollTop ?? 0,
  };

  try {
    window.sessionStorage.setItem(
      CATALOG_POSITION_STORAGE_KEY,
      JSON.stringify(position)
    );
  } catch {
    // El modo privado puede bloquear sessionStorage; la navegación debe continuar.
  }
}

export function readCatalogPosition(): CatalogPosition | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(CATALOG_POSITION_STORAGE_KEY);
    if (!raw) return null;

    const position = JSON.parse(raw) as Partial<CatalogPosition>;
    if (
      typeof position.sectionId !== "string" ||
      typeof position.scrollTop !== "number" ||
      !Number.isFinite(position.scrollTop)
    ) {
      return null;
    }

    return position as CatalogPosition;
  } catch {
    return null;
  }
}

export function clearCatalogPosition() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(CATALOG_POSITION_STORAGE_KEY);
  } catch {
    // No-op: sessionStorage puede no estar disponible.
  }
}
