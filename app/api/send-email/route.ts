import { NextResponse } from "next/server";
import { sendEmail, type FormTipo, type FormData } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tipo, datos } = body as { tipo: FormTipo; datos: FormData };

    if (!tipo || !datos) {
      return NextResponse.json({ error: "Faltan tipo o datos" }, { status: 400 });
    }

    await sendEmail(tipo, datos);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-email]", err);
    return NextResponse.json({ error: "Error al enviar email" }, { status: 500 });
  }
}
