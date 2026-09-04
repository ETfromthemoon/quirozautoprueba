import "server-only";

export type ReportValue = string | number | boolean;
export type InspectionDatum = ReportValue | { value?: ReportValue; observation?: string };
export type ReportImage = { url: string; caption?: string };
export type ReportModule = Record<string, InspectionDatum | ReportImage | string | undefined>;
export type VehicleReport = {
  carId: string; accessToken: string;
  signature?: { perito?: string; taller?: string; fecha?: string; folio?: string };
  identificacionLegal?: ReportModule; scannerElectronico?: ReportModule;
  motorMecanica?: ReportModule; transmision?: ReportModule;
  direccionSuspensionFrenosNeumaticos?: ReportModule; carroceriaEstructura?: ReportModule;
  interior?: ReportModule; equipamiento?: ReportModule; pruebaRuta?: ReportModule;
  galeria?: ReportImage[];
};

/** Maqueta ficticia. Los campos omitidos prueban que no se renderizan vacíos. */
export const reports: Record<string, VehicleReport> = {
  "bmw-420-grand-coupe-m-designe-2-0-at-2024": {
    carId: "bmw-420-grand-coupe-m-designe-2-0-at-2024", accessToken: "qz-8f3a1c7d92b4",
    signature: { perito: "Marco Quiroz · Perito automotriz", taller: "Quiroz Automotriz · Unidad de Peritaje", fecha: "10 de julio de 2026", folio: "QR-2026-0428" },
    identificacionLegal: {
      tipoVehiculo: "Automóvil", marca: "BMW", modelo: "420 Grand Coupé", ano: 2024,
      color: "Negro Carbono Metálico", version: "M Design 2.0 AT", transmision: "Automática",
      combustible: "Bencina", patente: "RXKF·42", numeroMotor: "B48B20A-4821973",
      vin: "WBA4J1C50KBM12345", numeroDuenos: 1, copiaLlaves: "2 copias originales",
      aseguradora: "No registra ingreso", perdidaTotal: false, prenda: "Sin prenda vigente",
      multasInscritas: "Sin multas inscritas", limitacionesDominio: "Sin limitaciones",
      observaciones: "Antecedentes contrastados con certificado CAV para esta demostración."
    },
    scannerElectronico: {
      resultadoObd2: "Sin códigos de falla activos ni históricos", testigosEncendidos: "Ninguno",
      informeImagen: { url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1400&q=85", caption: "Respaldo demostrativo del diagnóstico OBD2" }
    },
    motorMecanica: { partidaFrio: "Normal, encendido inmediato", ruidos: "Sin ruidos anómalos", humo: "Sin humo visible", fugasAceite: false, mantenciones: "Concesionario", observaciones: "Fluidos dentro de rango y compartimiento sin intervenciones recientes." },
    transmision: { tipo: "Automática", golpe: false, patina: false, tirones: false, observaciones: "Cambios progresivos en frío y a temperatura de operación." },
    direccionSuspensionFrenosNeumaticos: {
      direccionJuego: "Sin juego perceptible", direccionRuidos: "Sin ruidos al girar", cremallera: "Sin fugas ni holguras",
      amortiguadores: "Buen estado", bandejas: "Sin deformaciones", cazoletas: "Sin ruidos",
      discos: "Desgaste parejo", pastillas: "78% de vida útil estimada", neumaticos: "Michelin · desgaste parejo",
      ruedaRepuesto: "Kit de reparación original", observacionesNeumaticos: "Profundidad de dibujo entre 6,2 y 6,8 mm."
    },
    carroceriaEstructura: {
      repintado: { value: "No detectado", observation: "Lecturas entre 108 y 124 µm." }, golpeReparado: false,
      cuadratura: "Correcta", capot: "Original", techo: "Original", maletero: "Original", puertas: "Originales y alineadas",
      parachoqueDelantero: "Buen estado", parachoqueTrasero: "Buen estado", pilares: "Sin intervención",
      parabrisasDelantero: "Original, sin piquetes", focos: "Operativos, sin humedad",
      llantas: { value: "Buen estado", observation: "Marca estética menor en llanta delantera derecha." }
    },
    interior: { desgasteVolante: "Leve y coherente con kilometraje", asientos: "Cuero sin roturas", pedalesCoherentesKm: true, limpieza: "Sanitizado para entrega" },
    equipamiento: { climatizacion: "Climatizador bi-zona operativo", alzavidrios: "4 operativos", cierreCentral: "Operativo", radio: "iDrive, CarPlay y audio operativos", airbags: "Sin alertas", cinturones: "Operativos", maletero: "Apertura eléctrica operativa", gata: "Kit original presente" },
    pruebaRuta: { distancia: "5 km", ruidos: "Sin ruidos anómalos", tironeo: false, frenado: "Recto y progresivo", vibracion: "No detectada", temperatura: "Normal y estable", observaciones: "Prueba urbana con motor a temperatura de servicio." },
    galeria: [
      { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=85", caption: "Interior de demostración" },
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85", caption: "Registro mecánico de demostración" }
    ]
  }
};

export function getReportById(carId: string) { return reports[carId]; }
export function isValidAdminKey(key?: string) { const expected = process.env.INFORME_ADMIN_KEY; return Boolean(expected && key && safeEqual(expected, key)); }
export function isValidToken(carId: string, token?: string) { const report = reports[carId]; return Boolean(report && token && safeEqual(report.accessToken, token)); }
export function buildInformeUrl(baseUrl: string, carId: string) { const report = reports[carId]; return report ? `${baseUrl.replace(/\/$/, "")}/informe/${carId}?k=${report.accessToken}` : null; }
export function countReportModules(report: VehicleReport) {
  return [report.identificacionLegal, report.scannerElectronico, report.motorMecanica, report.transmision,
    report.direccionSuspensionFrenosNeumaticos, report.carroceriaEstructura, report.interior,
    report.equipamiento, report.pruebaRuta].filter(hasContent).length;
}
function hasContent(value: unknown): boolean {
  if (typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string") return Boolean(value.trim() && !/^(?:-|—|n\/?a|sin informaci[oó]n)$/i.test(value.trim()));
  if (Array.isArray(value)) return value.some(hasContent);
  return Boolean(value && typeof value === "object" && Object.values(value).some(hasContent));
}
function safeEqual(a: string, b: string) { if (a.length !== b.length) return false; let diff = 0; for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0; }
