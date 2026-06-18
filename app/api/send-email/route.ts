import { NextResponse } from "next/server";
import { sendEmail, type FormTipo, type FormData } from "@/lib/email";

const RATE_LIMIT_WINDOW = 60_000; // 1 minuto
const MAX_PER_WINDOW = 5;
const ipMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
}

function validateTurnstile(token: string | null): boolean {
  if (!token) return false;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; //允许 sin secret en dev
  return true; // validación real requiere fetch a Cloudflare
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { tipo, datos, turnstileToken } = body as { tipo: FormTipo; datos: FormData; turnstileToken?: string };

    if (!validateTurnstile(turnstileToken ?? null)) {
      return NextResponse.json({ error: "Verificación de seguridad fallida." }, { status: 403 });
    }

    if (!tipo || !datos) {
      return NextResponse.json({ error: "Faltan tipo o datos" }, { status: 400 });
    }

    await sendEmail(tipo, datos);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-email]", err);
    return NextResponse.json(
      { error: "Error al enviar email. Intenta de nuevo más tarde." },
      { status: 500 }
    );
  }
}
