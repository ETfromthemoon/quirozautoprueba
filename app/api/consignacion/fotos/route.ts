import { cms } from "@/lib/consignaciones";

const limit = 1_250_000;
const error = (data: string, status: number) => Response.json({ success: false, data }, { status });

export async function POST(req: Request) {
  const type = req.headers.get("content-type") || "";
  if (!type.startsWith("multipart/form-data;") || !req.body) return error("Formato inválido.", 400);
  const reader = req.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        return error("La fotografía supera el tamaño permitido.", 413);
      }
      chunks.push(new Uint8Array(value));
    }
    const form = await new Response(new Blob(chunks), { headers: { "content-type": type } }).formData();
    const body = new FormData();
    body.set("action", "qz_fotos");
    for (const key of ["operacion", "ficha", "vence", "firma", "toma"]) {
      const value = form.get(key);
      if (typeof value !== "string" || value.length > 100) return error("Solicitud inválida.", 400);
      body.set(key, value);
    }
    const op = body.get("operacion");
    if (!["guardar", "estado", "ver", "enviar"].includes(String(op))) return error("Operación inválida.", 400);
    if (op === "guardar") {
      const file = form.get("foto");
      if (!(file instanceof Blob) || file.size > 1_200_000) return error("Foto inválida.", 400);
      body.set("foto", file, "vehiculo.jpg");
    }
    const res = await fetch(new URL("/wp-admin/admin-ajax.php", cms), {
      method: "POST", body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(25000),
    });
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("application/json") && !(op === "ver" && contentType === "image/jpeg")) {
      return error("No pudimos conectar con tu ficha. Reintenta la subida.", 502);
    }
    return new Response(res.body, { status: res.status, headers: {
      "Content-Type": contentType, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
    } });
  } catch {
    return error("No pudimos completar la solicitud. Vuelve a intentar.", 503);
  }
}
