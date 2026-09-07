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
    | "consult-price"
    | "non-numeric-price"
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

const NUMERIC_PRICE_PATTERN = /^\$?[\d.,\s]+$/;
const CONSULT_PRICE_PATTERN = /\bconsultar\b/i;

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
 * Un precio numérico distinto de cero, o un precio que indique "consultar",
 * señala disponibilidad. Un precio vacío, cero u otro texto no numérico indica
 * que el vehículo está vendido. Los textos y categorías del CMS no intervienen
 * en esta decisión.
 */
export function classifyVehicleAvailability(
  input: VehicleAvailabilityInput,
): VehicleAvailability {
  const price = parseVehiclePrice(input.price);
  if (CONSULT_PRICE_PATTERN.test(price.raw)) {
    return { status: "available", reason: "consult-price" };
  }
  if (price.kind === "empty") {
    return { status: "sold", reason: "empty-price" };
  }
  if (price.kind === "zero") {
    return { status: "sold", reason: "zero-price" };
  }

  if (price.kind === "label") {
    return { status: "sold", reason: "non-numeric-price" };
  }

  return {
    status: "available",
    reason: "numeric-price",
  };
}
