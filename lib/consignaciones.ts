import "server-only";
import type { FormData as VehicleData } from "./email";

export const cms = process.env.CONSIGNACIONES_WP_ORIGIN || "https://admin.quirozautomotriz.cl";

export async function crearConsignacion(solicitud: string, datos: VehicleData, spam: unknown) {
  const res = await fetch(new URL("/wp-json/quiroz/v1/consignaciones", cms), {
    method: "POST", cache: "no-store", redirect: "error",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ solicitud, datos, spam }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error("No se pudo guardar la consignación.");
  const { id, vence, firma, nueva } = await res.json();
  if (!Number.isSafeInteger(id) || id < 1 || !Number.isSafeInteger(vence)
    || typeof firma !== "string" || !/^[a-f0-9]{64}$/.test(firma) || typeof nueva !== "boolean") {
    throw new Error("Respuesta de consignación inválida.");
  }
  return { id: id as number, nueva, ruta: `/consignacion/fotos?ficha=${id}#${vence}.${firma}` };
}
