import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

let messages = 0;
const smtp = net.createServer((socket) => {
  socket.setEncoding("utf8");
  socket.write("220 localhost test SMTP\r\n");
  let pending = "";
  let data = false;
  socket.on("data", (chunk) => {
    pending += chunk;
    let end;
    while ((end = pending.indexOf("\n")) !== -1) {
      const line = pending.slice(0, end).replace(/\r$/, "");
      pending = pending.slice(end + 1);
      if (data) {
        if (line === ".") {
          data = false;
          messages++;
          socket.write("250 queued\r\n");
        }
      } else if (/^EHLO /i.test(line)) {
        socket.write("250-localhost\r\n250 AUTH PLAIN\r\n");
      } else if (/^AUTH PLAIN/i.test(line)) {
        socket.write("235 authenticated\r\n");
      } else if (/^DATA$/i.test(line)) {
        data = true;
        socket.write("354 end with dot\r\n");
      } else if (/^QUIT$/i.test(line)) {
        socket.end("221 goodbye\r\n");
      } else {
        socket.write("250 ok\r\n");
      }
    }
  });
});

const smtpPort = await listen(smtp);
const probe = net.createServer();
const appPort = await listen(probe);
await new Promise((resolve) => probe.close(resolve));

const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "-p", String(appPort)], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    SMTP_HOST: "127.0.0.1",
    SMTP_PORT: String(smtpPort),
    SMTP_USER: "test-user",
    SMTP_PASS: "test-pass",
    SMTP_FROM: "test@example.invalid",
    AIRTABLE_PERSONAL_ACCESS_TOKEN: "",
    AIRTABLE_BASE_ID: "",
    AIRTABLE_TABLE_NAME: "",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
let appOutput = "";
for (const stream of [app.stdout, app.stderr]) {
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => { appOutput = (appOutput + chunk).slice(-4_000); });
}

const base = `http://127.0.0.1:${appPort}`;
async function waitForApp() {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (app.exitCode !== null) throw new Error(`Next.js terminó antes de iniciar: ${appOutput}`);
    try {
      const response = await fetch(`${base}/financiamiento`);
      if (response.ok) return;
    } catch { /* Sigue esperando el arranque. */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Next.js no inició: ${appOutput}`);
}

let requestNumber = 0;
async function post(body, ip = `192.0.2.${++requestNumber}`) {
  return fetch(`${base}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-real-ip": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

try {
  await waitForApp();
  const valid = {
    tipo: "contacto",
    datos: { Nombre: "Prueba", Correo: "test@example.invalid", "Teléfono": "+56 9 1234 5678", Mensaje: "Prueba local" },
    spam: { website: "", startedAt: Date.now() - 5_000 },
  };

  assert.equal((await post("{invalid")).status, 400, "JSON inválido");
  assert.equal((await post({ ...valid, spam: { ...valid.spam, website: "bot" } })).status, 400, "campo trampa");
  assert.equal((await post({ ...valid, spam: { ...valid.spam, startedAt: Date.now() } })).status, 400, "envío inmediato");
  assert.equal((await post({ ...valid, datos: { Correo: valid.datos.Correo } })).status, 400, "campos requeridos");
  assert.equal((await post({ ...valid, datos: { ...valid.datos, Inesperado: "x" } })).status, 400, "campos desconocidos");
  assert.equal((await post("x".repeat(12_001))).status, 413, "cuerpo demasiado grande");

  const first = await post(valid);
  assert.equal(first.status, 200, `envío válido: ${await first.text()}`);
  assert.equal(messages, 2, "un correo interno y una confirmación al cliente");
  assert.equal((await post(valid)).status, 429, "envío duplicado");
  assert.equal(messages, 2, "el duplicado no envía correos");

  const common = { Nombre: "Prueba", Apellido: "Local", "Teléfono": "+56 9 1234 5678" };
  const vehicle = {
    ...common, RUT: "12.345.678-9", Correo: "vehicle@example.invalid",
    "Tipo de Operación": "Consignación", "Segmento Vehículo": "SUV", Participante: "",
    "Fecha Ingreso": "2026-10-20", Dirección: "Calle 1", Comuna: "Concón", Ciudad: "Concón",
    "¿Es propietario?": "Si", "Nombre propietario": "", Patente: "ABCD12", Segmento: "SUV",
    "Cantidad de dueños": "2", Marca: "Toyota", Modelo: "RAV4", Versión: "XLE", Año: "2020",
    Cilindrada: "2.0", Transmisión: "Automática", Color: "Gris", Combustible: "Bencina",
    Kilometraje: "40000", "Servicios realizados o requeridos": "", "Copia de llave": "Si",
    "Valor piso mínimo": "12000000", Observación: "",
  };
  const forms = [
    ["financiamiento", { ...common, Rut: "12.345.678-9", Empleo: "Dependiente", "Antigüedad Laboral": "2 años", Renta: "1000000" }],
    ["seguros", { ...common, Rut: "12.345.678-9", "Año vehículo": "2020", Marca: "Toyota", Modelo: "RAV4", Tipo: "Particular", "Fecha Nacimiento": "1990-01-01" }],
    ["reserva", { ...common, Rut: "12.345.678-9", "Vehículo de interés": "Toyota RAV4" }],
    ["compra", { ...common, Patente: "ABCD12", Kilometraje: "40000", Mantenciones: "Particular" }],
    ["consignacion", { ...common, Patente: "ABCD12", Kilometraje: "40000", Mantenciones: "Particular" }],
    ["formulario-compra", { ...vehicle, "Tipo de Operación": "Compra" }],
    ["formulario-consignacion", vehicle],
    ["formulario-vehiculos", vehicle],
  ];
  for (const [tipo, datos] of forms) {
    const payload = { ...valid, tipo, datos: { ...datos, Correo: `${tipo}@example.invalid` } };
    const response = await post(payload);
    assert.equal(response.status, 200, `${tipo}: ${await response.text()}`);
  }
  assert.equal(messages, 2 + forms.length * 2, "dos correos por cada tipo de formulario");

  for (let i = 0; i < 5; i++) assert.equal((await post("{invalid", "192.0.2.200")).status, 400);
  assert.equal((await post("{invalid", "192.0.2.200")).status, 429, "límite por IP");
  console.log(`Formularios: ${forms.length + 9} comprobaciones correctas; SMTP local recibió ${messages} correos.`);
} finally {
  app.kill();
  await new Promise((resolve) => smtp.close(resolve));
}
