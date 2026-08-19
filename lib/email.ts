import nodemailer from "nodemailer";

export type FormTipo =
  | "contacto"
  | "financiamiento"
  | "seguros"
  | "reserva"
  | "compra"
  | "consignacion"
  | "formulario-compra"
  | "formulario-consignacion"
  | "formulario-vehiculos";

export type FormData = Record<string, string>;

const FROM = process.env.SMTP_FROM ?? "noreply@quirozautomotriz.cl";
const COMPRAS_TO = process.env.FORM_COMPRAS_TO ?? "compras@quirozautomotriz.cl";
const CONSIGNACIONES_TO =
  process.env.FORM_CONSIGNACIONES_TO ?? "consignaciones@quirozautomotriz.cl";

const DESTINOS: Record<FormTipo, string> = {
  contacto: "mquiroz@quirozautomotriz.cl",
  financiamiento: "mquiroz@quirozautomotriz.cl",
  seguros: "mquiroz@quirozautomotriz.cl",
  reserva: "reservas@quirozautomotriz.cl",
  compra: COMPRAS_TO,
  consignacion: CONSIGNACIONES_TO,
  "formulario-compra": COMPRAS_TO,
  "formulario-consignacion": CONSIGNACIONES_TO,
  "formulario-vehiculos": COMPRAS_TO,
};

const TITULOS: Record<FormTipo, string> = {
  contacto: "Nuevo mensaje de contacto",
  financiamiento: "Solicitud de financiamiento",
  seguros: "Solicitud de seguro automotriz",
  reserva: "Solicitud de reserva de vehiculo",
  compra: "Nueva Solicitud de Venta de Vehiculo",
  consignacion: "Nueva Consignacion",
  "formulario-compra": "Nueva Solicitud de Venta de Vehiculo",
  "formulario-consignacion": "Nueva Consignacion",
  "formulario-vehiculos": "Ficha de vehiculo recibida",
};

type VehicleFlow = "compra" | "consignacion";

const VEHICLE_FLOW_COPY: Record<VehicleFlow, { title: string; body: string }> = {
  consignacion: {
    title: "Consignacion virtual recibida",
    body:
      "Agradecemos su preferencia con Quiroz Automotriz e informamos que su vehiculo ha sido consignado virtualmente para realizar la gestion de venta a traves de nuestros canales de publicacion y redes sociales.",
  },
  compra: {
    title: "Solicitud de compra recibida",
    body:
      "Agradecemos su preferencia en Quiroz Automotriz SPA e informamos que estudiaremos el valor comercial de su vehiculo antes de comunicarle nuestra decision de compra. El valor a informar por Quiroz Automotriz Spa queda sujeto a la revision del vehiculo ofrecido.",
  },
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
    title: VEHICLE_FLOW_COPY.compra.title,
    body: VEHICLE_FLOW_COPY.compra.body,
  },
  consignacion: {
    title: VEHICLE_FLOW_COPY.consignacion.title,
    body: VEHICLE_FLOW_COPY.consignacion.body,
  },
  "formulario-compra": {
    title: VEHICLE_FLOW_COPY.compra.title,
    body: VEHICLE_FLOW_COPY.compra.body,
  },
  "formulario-consignacion": {
    title: VEHICLE_FLOW_COPY.consignacion.title,
    body: VEHICLE_FLOW_COPY.consignacion.body,
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

function contractValue(value: string | undefined) {
  return value?.trim() || "____________________________";
}

function formatContractDate(value: string | undefined) {
  if (!value?.trim()) return "____________________________";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-CL");
}

function buildConsignmentContractText(data: FormData) {
  const fullName = [data.Nombre, data.Apellido].filter(Boolean).join(" ");

  return [
    "CONTRATO DE CONSIGNACIÓN",
    "",
    "En Viña del Mar",
    `Fecha: ${formatContractDate(data["Fecha Ingreso"])}`,
    `El(la) Sr(a) ${contractValue(fullName)}.`,
    `RUT: ${contractValue(data.RUT)}`,
    `Domiciliado: ${contractValue(data.Dirección)}`,
    `Ciudad: ${contractValue(data.Ciudad)}`,
    "Quien en adelante se denominará comitente y la firma Quiroz Automotriz Ltda. Rut 76.776.021-3, que se denominará en adelante Comisionista vienen en contratar lo siguiente:",
    "",
    "PRIMERO: el comitente entrega al comisionista lo siguiente en consignación:",
    `Marca: ${contractValue(data.Marca)}`,
    `Modelo: ${contractValue(data.Modelo)}`,
    `Año: ${contractValue(data.Año)}`,
    `Kilómetros: ${contractValue(data.Kilometraje)}`,
    `Patente: ${contractValue(data.Patente)}`,
    `Copia de llave: ${contractValue(data["Copia de llave"])}`,
    "",
    "SEGUNDO: El Comisionista acepta recibir la mercadería antes indicada para venderla por cuenta del comitente.",
    "",
    "TERCERO: El comitente autoriza al comisionista para ejecutar lo que crea necesario a la mercadería entregada, con el fin de venderla en la mejor forma y también lo autoriza expresamente para que estos gastos sean por cuenta del comitente previa consulta.",
    "",
    `CUARTO: El valor piso mínimo de la mercadería entregada será de: ${contractValue(data["Valor piso mínimo"])}`,
    "",
    "QUINTO: Al finiquitar la venta de la mercadería entregada en consignación, el comisionista hará la liquidación correspondiente, según el valor dejado en consignación menos los gastos realizados al vehículo autorizados por el Comitente.",
    "",
    "SEXTO: El comitente declara que la mercadería ya indicada y entregada en consignación exclusiva al comisionista le pertenece en forma exclusiva por haberla adquirido según consta con documentación completa, por lo cual, asume toda responsabilidad derivada de su procedencia o cualquier otra causa declarando expresamente que no tiene ningún gravamen; ni prohibición de enajenar.",
    "",
    "SÉPTIMO: El comisionista recibe en este acto la mercadería ya aludida virtualmente y se responsabiliza de ella hasta el término de su gestión, a excepción de fuerza mayor.",
    "",
    "OCTAVO: El plazo mínimo de consignación en la empresa es de 90 días corridos a partir de la fecha establecida en contrato.",
    "",
    "NOVENO: Las partes fijan su domicilio en Viña del Mar para los efectos legales del caso.",
    "",
    `Observación: ${contractValue(data.Observación)}`,
  ].join("\n");
}

function buildConsignmentContractHtml(data: FormData) {
  return `<div style="margin:0 0 22px;padding:18px 20px;border:1px solid #e4e4e7;border-radius:10px;background:#fafafa">
<h2 style="margin:0 0 14px;font-size:16px;color:#18181b">Contrato de consignación</h2>
<div style="white-space:pre-line;font-size:13px;line-height:1.65;color:#3f3f46">${escapeHtml(buildConsignmentContractText(data))}</div>
</div>`;
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
    `${tipo === "formulario-consignacion" ? buildConsignmentContractHtml(data) : ""}
<p style="margin:0 0 18px;font-size:14px;color:#52525b">Nueva solicitud recibida desde el sitio web.</p>
<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>`
  );
}

function getVehicleFlow(tipo: FormTipo): VehicleFlow | null {
  if (tipo === "consignacion" || tipo === "formulario-consignacion") {
    return "consignacion";
  }
  if (tipo === "compra" || tipo === "formulario-compra") {
    return "compra";
  }
  return null;
}

function buildVehicleCustomerHtml(data: FormData, flow: VehicleFlow) {
  const message = VEHICLE_FLOW_COPY[flow];
  const name = escapeHtml(data.Nombre?.trim() || "");
  const vehicleRows = [
    ["Marca", data.Marca],
    ["Modelo", data.Modelo],
    ["Año", data.Año],
    ["Patente", data.Patente],
  ]
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => fieldRow(key, value ?? ""))
    .join("");
  const vehicleTable = vehicleRows
    ? `<table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">${vehicleRows}</table>`
    : "";
  const closing =
    flow === "consignacion"
      ? `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#3f3f46">Al momento de la venta el auto se pagara mediante transferencia electronica segun el valor acordado entre las partes.</p>
<p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#3f3f46"><strong>Clausula de exclusividad.</strong><br />El propietario se compromete a vender el vehiculo a traves de Quiroz Automotriz. En caso de incumplimiento, debera pagar un cargo de $25.000 por concepto de gastos generados por la gestion. Los plazos de exclusividad son de 45 dias continuos, renovables automaticamente, salvo aviso de cualquiera de las partes con 7 dias de anticipacion.</p>`
      : `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:#3f3f46">Llegando a un acuerdo entre las partes, el propietario debera contar con su Cedula de Identidad vigente. Si es empresa, debera presentar Constitucion, Vigencia y RUT del representante legal. El vehiculo se pagara de inmediato mediante transferencia electronica del Banco Santander; inmediatamente despues el propietario debera dejar firmados los contratos de compraventa para realizar posteriormente la transferencia del vehiculo en Notaria Gervasio de Vina del Mar.</p>`;

  return wrapEmail(
    message.title,
    `<p style="margin:0 0 14px;font-size:15px">Estimado${name ? ` ${name}` : ""},</p>
<p style="margin:0;font-size:14px;line-height:1.6;color:#3f3f46">${escapeHtml(message.body)}</p>
${vehicleTable}${closing}
<p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#71717a">Puedes responder este correo para continuar la coordinacion con nuestro equipo.</p>`
  );
}

function buildCustomerHtml(tipo: FormTipo, data: FormData) {
  if (tipo === "formulario-consignacion") {
    return wrapEmail(
      "Contrato de consignación recibido",
      `<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#3f3f46">Estimado(a) ${escapeHtml([data.Nombre, data.Apellido].filter(Boolean).join(" "))}, hemos recibido tu ficha de consignación. A continuación encontrarás el contrato generado con la información ingresada:</p>
${buildConsignmentContractHtml(data)}
<p style="margin:0;font-size:13px;line-height:1.6;color:#71717a">Este documento corresponde a la información enviada a través del formulario web. Nuestro equipo se comunicará contigo para coordinar los siguientes pasos.</p>`
    );
  }

  const vehicleFlow = getVehicleFlow(tipo);
  if (vehicleFlow) return buildVehicleCustomerHtml(data, vehicleFlow);

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
