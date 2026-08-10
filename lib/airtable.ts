import "server-only";

import type { FormData, FormTipo } from "@/lib/email";

const API_URL = "https://api.airtable.com/v0";

function firstValue(data: FormData, ...keys: string[]) {
  for (const key of keys) {
    const value = data[key]?.trim();
    if (value) return value;
  }
  return "";
}

export async function saveLead(tipo: FormTipo, data: FormData) {
  const token = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  // Airtable is optional while it is being configured. Email remains the source
  // of immediate notification, so a temporary CRM outage never loses the lead.
  if (!token || !baseId || !tableName) return { configured: false };

  const name = firstValue(data, "Nombre", "Nombre completo");
  const email = firstValue(data, "Correo", "Email");
  const phone = firstValue(data, "Teléfono", "Telefono", "Celular");
  const vehicle = firstValue(data, "Vehículo de interés", "Vehiculo de interes", "Modelo", "Marca");
  const plate = firstValue(data, "Patente");
  const leadName = name || email || "Lead sin nombre";

  const response = await fetch(`${API_URL}/${baseId}/${encodeURIComponent(tableName)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Lead: leadName,
            Fecha: new Date().toISOString(),
            Tipo: tipo,
            Estado: "Nuevo",
            Nombre: name,
            Correo: email,
            Telefono: phone,
            Vehiculo: vehicle,
            Patente: plate,
            Datos: JSON.stringify(data),
          },
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Airtable respondio ${response.status}: ${detail}`);
  }

  return { configured: true };
}
