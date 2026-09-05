export type VehiclePrice = {
  kind: "empty" | "zero" | "numeric" | "label";
  raw: string;
  text: string;
  numeric: number;
};

export type VehicleAvailability = {
  status: "available" | "sold";
  reason:
    | "numeric-price"
    | "special-price-label"
    | "explicit-unavailable-status"
    | "empty-price"
    | "zero-price";
};

type VehicleAvailabilityInput = {
  slug: string;
  title?: string;
  description?: string;
  price?: string;
  categories?: string[];
};

const UNAVAILABLE_PATTERN = /\b(vendid[oa]s?|inactiv[oa]s?|no\s+disponible)\b/i;
const NUMERIC_PRICE_PATTERN = /^\$?[\d.,\s]+$/;

function normalizeSearchText(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Interpreta el campo de precio sin confundir etiquetas comerciales con cero.
 * Ejemplos: "$12.500.000" es numérico, "EXHIBICIÓN" es una etiqueta válida.
 */
export function parseVehiclePrice(rawPrice?: string): VehiclePrice {
  const raw = (rawPrice ?? "").trim();
  if (!raw) {
    return { kind: "empty", raw, text: "Consultar precio", numeric: 0 };
  }

  if (NUMERIC_PRICE_PATTERN.test(raw)) {
    const digits = raw.replace(/\D/g, "");
    const numeric = digits ? Number(digits) : 0;
    if (!numeric) {
      return { kind: "zero", raw, text: "Consultar precio", numeric: 0 };
    }

    return {
      kind: "numeric",
      raw,
      text: `$${numeric.toLocaleString("es-CL")}`,
      numeric,
    };
  }

  return { kind: "label", raw, text: raw, numeric: 0 };
}

/**
 * Fuente única de verdad para decidir en cuál catálogo aparece cada vehículo.
 * Todo producto termina como disponible o vendido, nunca queda sin clasificar.
 */
export function classifyVehicleAvailability(
  input: VehicleAvailabilityInput,
): VehicleAvailability {
  const price = parseVehiclePrice(input.price);
  const searchable = normalizeSearchText(
    [
      input.slug,
      input.title ?? "",
      input.description ?? "",
      price.raw,
      ...(input.categories ?? []),
    ].join(" "),
  );

  if (UNAVAILABLE_PATTERN.test(searchable)) {
    return { status: "sold", reason: "explicit-unavailable-status" };
  }
  if (price.kind === "empty") {
    return { status: "sold", reason: "empty-price" };
  }
  if (price.kind === "zero") {
    return { status: "sold", reason: "zero-price" };
  }

  return {
    status: "available",
    reason: price.kind === "numeric" ? "numeric-price" : "special-price-label",
  };
}
