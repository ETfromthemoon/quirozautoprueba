import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { sendEmail, type FormTipo, type FormData } from "@/lib/email";
import { saveLead } from "@/lib/airtable";

const RATE_WINDOW = 60_000;
const MAX_PER_WINDOW = 5;
const MAX_BODY_BYTES = 12_000;
const DUPLICATE_WINDOW = 5 * 60_000;
const ipMap = new Map<string, { count: number; resetAt: number }>();
const recentSubmissions = new Map<string, number>();
const emailMap = new Map<string, { count: number; resetAt: number }>();
let globalWindow = { count: 0, resetAt: 0 };

const vehicleFields = ["Tipo de Operación", "Segmento Vehículo", "Participante", "Fecha Ingreso", "Nombre", "Apellido", "RUT", "Dirección", "Comuna", "Ciudad", "Teléfono", "Correo", "¿Es propietario?", "Nombre propietario", "Patente", "Segmento", "Cantidad de dueños", "Marca", "Modelo", "Versión", "Año", "Cilindrada", "Transmisión", "Color", "Combustible", "Kilometraje", "Servicios realizados o requeridos", "Copia de llave", "Valor piso mínimo", "Observación"];
const vehicleRequired = ["Segmento Vehículo", "Fecha Ingreso", "Nombre", "Apellido", "RUT", "Dirección", "Comuna", "Ciudad", "Teléfono", "Correo", "¿Es propietario?", "Patente", "Marca", "Modelo", "Versión", "Año", "Cilindrada", "Transmisión", "Color", "Combustible", "Kilometraje"];

const FIELDS: Record<FormTipo, { allowed: readonly string[]; required: readonly string[] }> = {
  contacto: { allowed: ["Nombre", "Correo", "Teléfono", "Mensaje"], required: ["Nombre", "Correo", "Mensaje"] },
  financiamiento: { allowed: ["Nombre", "Apellido", "Rut", "Empleo", "Antigüedad Laboral", "Renta", "Teléfono", "Correo"], required: ["Nombre", "Apellido", "Rut", "Empleo", "Renta", "Teléfono", "Correo"] },
  seguros: { allowed: ["Año vehículo", "Marca", "Modelo", "Tipo", "Nombre", "Apellido", "Rut", "Fecha Nacimiento", "Teléfono", "Correo"], required: ["Año vehículo", "Marca", "Modelo", "Tipo", "Nombre", "Apellido", "Rut", "Fecha Nacimiento", "Teléfono", "Correo"] },
  reserva: { allowed: ["Vehículo de interés", "Nombre", "Apellido", "Rut", "Teléfono", "Correo"], required: ["Nombre", "Apellido", "Rut", "Teléfono", "Correo"] },
  compra: { allowed: ["Patente", "Kilometraje", "Mantenciones", "Nombre", "Apellido", "Teléfono", "Correo"], required: ["Patente", "Kilometraje", "Nombre", "Apellido", "Teléfono", "Correo"] },
  consignacion: { allowed: ["Patente", "Kilometraje", "Mantenciones", "Nombre", "Apellido", "Teléfono", "Correo"], required: ["Patente", "Kilometraje", "Nombre", "Apellido", "Teléfono", "Correo"] },
  "formulario-compra": { allowed: vehicleFields, required: vehicleRequired },
  "formulario-consignacion": { allowed: vehicleFields, required: [...vehicleRequired, "Copia de llave", "Valor piso mínimo"] },
  "formulario-vehiculos": { allowed: vehicleFields, required: vehicleRequired },
};

function rateLimit(ip: string): boolean {
  const now = Date.now();
  // Evita que una gran cantidad de IP distintas haga crecer el mapa sin límite.
  if (ipMap.size >= 5_000) {
    for (const [key, entry] of ipMap) if (entry.resetAt <= now) ipMap.delete(key);
    if (ipMap.size >= 5_000 && !ipMap.has(ip)) return false;
  }
  const entry = ipMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

function sendLimit(): boolean {
  const now = Date.now();
  if (now >= globalWindow.resetAt) globalWindow = { count: 0, resetAt: now + RATE_WINDOW };
  if (globalWindow.count >= 30) return false;
  globalWindow.count++;
  return true;
}

function emailRateLimit(email: string): boolean {
  const now = Date.now();
  if (emailMap.size >= 5_000) {
    for (const [key, entry] of emailMap) if (entry.resetAt <= now) emailMap.delete(key);
    if (emailMap.size >= 5_000 && !emailMap.has(email)) return false;
  }
  const entry = emailMap.get(email);
  if (!entry || now >= entry.resetAt) {
    emailMap.set(email, { count: 1, resetAt: now + 60 * 60_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

function clientIp(req: Request): string {
  const candidate = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return candidate && candidate.length <= 64 ? candidate : "unknown";
}

async function readLimitedBody(req: Request): Promise<string | null> {
  if (!req.body) return null;
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(buffer);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validatePayload(body: unknown): { tipo: FormTipo; datos: FormData } | null {
  if (!isObject(body) || typeof body.tipo !== "string" || !Object.hasOwn(FIELDS, body.tipo)) return null;
  if (!isObject(body.datos) || !isObject(body.spam)) return null;
  if (body.spam.website !== "" || !Number.isSafeInteger(body.spam.startedAt)) return null;
  const age = Date.now() - (body.spam.startedAt as number);
  if (age < 3_000 || age > 24 * 60 * 60_000) return null;

  const tipo = body.tipo as FormTipo;
  const schema = FIELDS[tipo];
  const entries = Object.entries(body.datos);
  if (entries.length > schema.allowed.length) return null;
  const allowed = new Set(schema.allowed);
  const datos: FormData = {};
  for (const [key, value] of entries) {
    if (!allowed.has(key) || typeof value !== "string") return null;
    const trimmed = value.trim();
    if (trimmed.length > (["Mensaje", "Observación"].includes(key) ? 2_000 : 300)) return null;
    datos[key] = trimmed;
  }
  if (schema.required.some((key) => !datos[key])) return null;
  if (datos["¿Es propietario?"] === "No" && !datos["Nombre propietario"]) return null;
  const correo = datos.Correo;
  if (correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || /[\r\n]/.test(correo)) return null;
  if (datos["Teléfono"] && !/^[+\d\s().-]{7,25}$/.test(datos["Teléfono"])) return null;
  return { tipo, datos };
}

export async function POST(req: Request) {
  if (!rateLimit(clientIp(req))) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
  }
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "Formato de solicitud inválido." }, { status: 415 });
  }
  try {
    const raw = await readLimitedBody(req);
    if (raw === null) return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413 });
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }
    const payload = validatePayload(body);
    if (!payload) return NextResponse.json({ error: "Revisa los datos del formulario e intenta de nuevo." }, { status: 400 });

    const { tipo, datos } = payload;
    if (!emailRateLimit(datos.Correo.toLowerCase())) {
      return NextResponse.json({ error: "Demasiadas solicitudes con este correo. Intenta más tarde." }, { status: 429 });
    }
    const fingerprint = createHash("sha256").update(JSON.stringify([tipo, datos.Correo.toLowerCase(), datos])).digest("hex");
    const now = Date.now();
    for (const [key, expiresAt] of recentSubmissions) if (expiresAt <= now) recentSubmissions.delete(key);
    if (recentSubmissions.size >= 5_000 && !recentSubmissions.has(fingerprint)) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Intenta más tarde." }, { status: 429 });
    }
    if (recentSubmissions.has(fingerprint)) {
      return NextResponse.json({ error: "Esta solicitud ya fue enviada. Espera unos minutos antes de repetirla." }, { status: 429 });
    }
    if (!sendLimit()) {
      return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
    }
    recentSubmissions.set(fingerprint, now + DUPLICATE_WINDOW);
    try {
      await saveLead(tipo, datos);
    } catch (error) {
      console.error("[airtable] No se pudo guardar el lead", error);
    }
    try {
      await sendEmail(tipo, datos);
    } catch (error) {
      recentSubmissions.delete(fingerprint);
      throw error;
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[send-email]", error);
    return NextResponse.json({ error: "Error al enviar email. Intenta de nuevo más tarde." }, { status: 500 });
  }
}
