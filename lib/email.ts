import nodemailer from "nodemailer";

export type FormTipo =
  | "contacto"
  | "financiamiento"
  | "seguros"
  | "reserva"
  | "compra"
  | "consignacion"
  | "formulario-vehiculos";

export type FormData = Record<string, string>;

const FROM = process.env.SMTP_FROM ?? "noreply@quirozautomotriz.cl";

const DESTINOS: Record<FormTipo, string> = {
  contacto: "mquiroz@quirozautomotriz.cl",
  financiamiento: "mquiroz@quirozautomotriz.cl",
  seguros: "mquiroz@quirozautomotriz.cl",
  reserva: "reservas@quirozautomotriz.cl",
  compra: "compras@quirozautomotriz.cl",
  consignacion: "compras@quirozautomotriz.cl",
  "formulario-vehiculos": "compras@quirozautomotriz.cl",
};

const TITULOS: Record<FormTipo, string> = {
  contacto: "Nuevo mensaje de contacto",
  financiamiento: "Solicitud de financiamiento",
  seguros: "Solicitud de seguro automotriz",
  reserva: "Solicitud de reserva de vehiculo",
  compra: "Oferta de venta de vehiculo",
  consignacion: "Solicitud de consignacion",
  "formulario-vehiculos": "Ficha de vehiculo recibida",
};

const MENSAJES_CLIENTE: Record<FormTipo, { title: string; body: string }> = {
  contacto: {
    title: "Recibimos tu mensaje",
    body: "Gracias por contactarnos. Un integrante de Quiroz Automotriz te respondera a la brevedad.",
  },
  financiamiento: {
    title: "Recibimos tu solicitud de financiamiento",
    body: "Revisaremos tus antecedentes y un asesor se comunicara contigo para orientarte sobre las alternativas disponibles.",
  },
  seguros: {
    title: "Recibimos tu solicitud de seguro",
    body: "Prepararemos las alternativas de cobertura para tu vehiculo y te contactaremos dentro de un dia habil.",
  },
  reserva: {
    title: "Recibimos tu solicitud de reserva",
    body: "Un asesor confirmara la disponibilidad del vehiculo y te explicara los siguientes pasos. La reserva queda confirmada solo despues de esa validacion.",
  },
  compra: {
    title: "Recibimos los datos de tu vehiculo",
    body: "Revisaremos la informacion enviada y te contactaremos para coordinar la evaluacion de compra.",
  },
  consignacion: {
    title: "Recibimos tu solicitud de consignacion",
    body: "Revisaremos los datos de tu vehiculo y te contactaremos para coordinar la evaluacion, fotografias y publicacion.",
  },
  "formulario-vehiculos": {
    title: "Recibimos la ficha de tu vehiculo",
    body: "Gracias por completar la informacion. Nuestro equipo revisara la ficha y se comunicara contigo para coordinar los siguientes pasos.",
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fieldRow(key: string, value: string) {
  return `<tr><td style="font-weight:600;padding:4px 12px 4px 0;white-space:nowrap;color:#52525b">${escapeHtml(key)}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`;
}

function wrapEmail(title: string, content: string) {
  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;background:#f4f4f5;padding:32px 16px;color:#18181b">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7">
<div style="background:#09090b;padding:20px 28px">
<h1 style="color:#fff;font-size:18px;margin:0;font-weight:600">Quiroz Redcar</h1>
<p style="color:#a1a1aa;font-size:12px;margin:4px 0 0">${escapeHtml(title)}</p>
</div>
<div style="padding:24px 28px">${content}</div>
<div style="padding:16px 28px;background:#fafafa;border-top:1px solid #e4e4e7;font-size:11px;color:#71717a">
Quiroz Automotriz Spa · Av. Bosques de Montemar 65, oficina 203, Concon · +56 9 5906 5441 · www.quirozautomotriz.cl
</div>
</div></body></html>`;
}

function buildInternalHtml(tipo: FormTipo, data: FormData) {
  const rows = Object.entries(data)
    .filter(([, value]) => value.trim())
    .map(([key, value]) => fieldRow(key, value))
    .join("");

  return wrapEmail(
    TITULOS[tipo],
    `<p style="margin:0 0 18px;font-size:14px;color:#52525b">Nueva solicitud recibida desde el sitio web.</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>`
  );
}

function buildCustomerHtml(tipo: FormTipo, data: FormData) {
  const message = MENSAJES_CLIENTE[tipo];
  const name = escapeHtml(data.Nombre?.trim() || "");
  const vehicle = data["Vehículo de interés"] || data.Patente || data.Modelo;
  const summary = vehicle
    ? `<p style="margin:20px 0 0;padding:12px 14px;background:#f4f4f5;border-radius:8px;font-size:13px;color:#52525b"><strong style="color:#18181b">Referencia:</strong> ${escapeHtml(vehicle)}</p>`
    : "";

  return wrapEmail(
    message.title,
    `<p style="margin:0 0 14px;font-size:15px">Hola${name ? ` ${name}` : ""},</p>
<p style="margin:0;font-size:15px;line-height:1.6;color:#3f3f46">${escapeHtml(message.body)}</p>${summary}
<p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#71717a">Este es un correo automatico. Puedes responder este mensaje y llegara al equipo que gestiona tu solicitud.</p>`
  );
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  throw new Error("SMTP no configurado. Define SMTP_HOST, SMTP_USER y SMTP_PASS.");
}

export async function sendEmail(tipo: FormTipo, data: FormData) {
  const transport = createTransport();
  const destination = DESTINOS[tipo];
  const customerEmail = data.Correo?.trim();

  if (!customerEmail) {
    throw new Error("La solicitud no incluye un correo de contacto.");
  }

  await transport.sendMail({
    from: FROM,
    to: destination,
    replyTo: customerEmail,
    subject: `[Quiroz Automotriz] ${TITULOS[tipo]}`,
    html: buildInternalHtml(tipo, data),
  });

  await transport.sendMail({
    from: FROM,
    to: customerEmail,
    replyTo: destination,
    subject: `[Quiroz Automotriz] ${MENSAJES_CLIENTE[tipo].title}`,
    html: buildCustomerHtml(tipo, data),
  });
}
