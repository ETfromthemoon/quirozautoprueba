import { Resend } from "resend";

export type FormTipo =
  | "financiamiento"
  | "seguros"
  | "reserva"
  | "compra"
  | "consignacion"
  | "formulario-vehiculos";

export type FormData = Record<string, string>;

const FROM = "Quiroz Redcar <noreply@quirozautomotriz.cl>";

const DESTINOS: Record<FormTipo, string> = {
  financiamiento: "mquiroz@quirozautomotriz.cl",
  seguros: "mquiroz@quirozautomotriz.cl",
  reserva: "reservas@quirozautomotriz.cl",
  compra: "compras@quirozautomotriz.cl",
  consignacion: "compras@quirozautomotriz.cl",
  "formulario-vehiculos": "compras@quirozautomotriz.cl",
};

function fieldRow(k: string, v: string) {
  return `<tr><td style="font-weight:600;padding:4px 12px 4px 0;white-space:nowrap;color:#52525b">${k}</td><td style="padding:4px 0">${v}</td></tr>`;
}

function buildHtml(tipo: FormTipo, data: FormData): string {
  const rows = Object.entries(data).map(([k, v]) => fieldRow(k, v)).join("");

  const titulos: Record<string, string> = {
    financiamiento: "Solicitud de Financiamiento",
    seguros: "Solicitud de Seguro Automotriz",
    reserva: "Reserva de Vehículo",
    compra: "Oferta de Venta — Compramos tu Auto",
    consignacion: "Solicitud de Consignación",
    "formulario-vehiculos": "Formulario de Vehículo",
  };

  let extra = "";

  if (tipo === "reserva") {
    extra = `<tr><td colspan="2" style="padding-top:20px"><hr style="border:none;border-top:1px solid #e4e4e7"></td></tr>
<tr><td colspan="2" style="padding-top:12px;font-size:13px;color:#52525b;line-height:1.6">
Muchas felicidades, hemos recibido conforme su reserva y con gusto esperamos la fecha que usted nos comunique para la entrega del vehículo.<br><br>
La publicación de venta del vehículo será eliminada de todas las plataformas contratadas exceptuando la publicación en web empresa la cual será modificada como reservada a su nombre.<br><br>
De todas formas informamos que si el vehículo no se encuentra en las condiciones informadas, la reserva de $200.000 se devuelve en su totalidad.<br><br>
Agradecemos su confianza y seguimos a su disposición.
</td></tr>`;
  }

  if (tipo === "consignacion" || tipo === "formulario-vehiculos") {
    const intro = data["Marca"] || data["Patente"]
      ? `Estimado MARCO QUIROZ<br><br>Agradecemos su preferencia con Quiroz Automotriz e Informamos que su vehículo ha sido consignado virtualmente para realizar la gestión de venta a través de nuestros canales de publicación y redes sociales.<br><br>Al momento de la venta el auto se le pagará mediante transferencia electrónica según el valor acordado entre las partes.<br><br>`
      : "";
    extra = `<tr><td colspan="2" style="padding-top:16px;font-size:14px;color:#09090b;line-height:1.6">${intro}</td></tr>
<tr><td colspan="2" style="padding-top:12px"><hr style="border:none;border-top:1px solid #e4e4e7"></td></tr>
<tr><td colspan="2" style="padding-top:12px;font-size:13px;color:#52525b;line-height:1.6">
<strong>Cláusula de exclusividad.</strong> El propietario se compromete a vender el vehículo a través de la empresa Quiroz Automotriz; Los plazos de exclusividad son de 45 días continuos, renovables automáticamente a no ser que una de las partes avise con 7 días de anticipación.<br><br>
Agradeciendo nuevamente su preferencia.
</td></tr>`;
  }

  return `<!DOCTYPE html>
<html><body style="font-family:Inter,system-ui,sans-serif;background:#f4f4f5;padding:32px 16px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06)">
<div style="background:#09090b;padding:20px 28px">
<h1 style="color:#fff;font-size:18px;margin:0;font-weight:600">Quiroz Redcar</h1>
<p style="color:#a1a1aa;font-size:12px;margin:4px 0 0">${titulos[tipo]}</p>
</div>
<div style="padding:24px 28px">
<table style="width:100%;border-collapse:collapse;font-size:14px">${rows}${extra}</table>
</div>
<div style="padding:16px 28px;background:#fafafa;border-top:1px solid #e4e4e7;font-size:11px;color:#a1a1aa">
Quiroz Automotriz Spa · Av Bosques de Montemar 65, Edificio OFC Of 203, Concón · F: +56 9 5906 5441 · www.quirozautomotriz.cl
</div>
</div></body></html>`;
}

export async function sendEmail(tipo: FormTipo, data: FormData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY no configurada");

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: FROM,
    to: DESTINOS[tipo],
    subject: `[Quiroz Redcar] Nueva solicitud — ${tipo}`,
    html: buildHtml(tipo, data),
  });

  if (error) throw error;
}
