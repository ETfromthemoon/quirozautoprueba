/**
 * lib/brochures.ts — Informe privado de peritaje (brochure dinámico)
 *
 * QUÉ ES
 * ─────────────────────────────────────────────────────────────────
 * Capa PRIVADA sobre la ficha pública del auto. Muestra el estado real
 * del vehículo (scanner OBD-II, inspección mecánica, carrocería/pintura,
 * neumáticos/frenos, historial y fotos honestas) para que un comprador
 * potencial decida con datos, no con fe.
 *
 * ACCESO
 * ─────────────────────────────────────────────────────────────────
 * Cada informe tiene un `accessToken` secreto e impredecible. La ruta
 * /informe/[id]?k=<token> solo renderiza el contenido si el token es
 * válido. Es un "soft-gate": quien tiene el link entra, sin login.
 * Suficiente para "no disponible para todas las personas" sin backend.
 *
 * DATOS
 * ─────────────────────────────────────────────────────────────────
 * Para la demo usamos datos mock (JSON local) sobre 2 autos del catálogo
 * estático, con perfiles contrastantes:
 *   - bmw-420-coupe-2024 → "Excelente" (lado premium)
 *   - ford-ranger-2021   → "Bueno" con observaciones (transparencia honesta)
 *
 * En producción, `reports` se reemplaza por una fuente real (ACF de
 * WordPress, subida de PDF, o panel propio) manteniendo el mismo tipo.
 */

// Este módulo contiene tokens y datos confidenciales: si un componente
// cliente lo importa, el build falla en vez de filtrar todo al bundle JS.
import "server-only";

// ─── Estados y semáforo ───────────────────────────────────────────────────────

/** Estado de un sistema/ítem individual: verde / ámbar / rojo. */
export type ItemStatus = "ok" | "atencion" | "falla";

/** Veredicto cualitativo global (sin nota numérica, por decisión de negocio). */
export type OverallState = "Excelente" | "Muy bueno" | "Bueno" | "Con observaciones";

/** Estado de un panel de carrocería según lectura de pintura. */
export type PanelState = "original" | "repintado" | "observacion";

// ─── Bloques del informe ──────────────────────────────────────────────────────

export type ReportSignature = {
  perito: string;      // "Marco Quiroz — Perito automotriz"
  taller: string;      // "Quiroz Automotriz · Taller de Peritaje"
  fecha: string;       // "12 de julio de 2026"
  folio: string;       // "QR-2026-0428"
};

export type ReportIdentifiers = {
  vin: string;
  patente: string;
  numeroMotor: string;
};

export type ReportVerdict = {
  estado: OverallState;
  resumen: string;             // 1 frase de veredicto
  highlights: string[];        // por qué vale la pena
  observaciones: string[];     // qué mirar / defectos honestos (puede ir vacío)
};

export type ScannerSystem = {
  nombre: string;              // "Motor", "ABS", "Airbag", ...
  estado: ItemStatus;
  nota?: string;
};

export type ScannerCode = {
  codigo: string;              // "P0420"
  descripcion: string;         // explicación en lenguaje simple
  tipo: "activo" | "historico";
};

export type ReportScanner = {
  resumen: string;
  systems: ScannerSystem[];
  codigos: ScannerCode[];      // puede ir vacío = sin códigos
};

export type MechanicalItem = {
  label: string;
  estado: ItemStatus;
  nota?: string;
};

export type MechanicalSection = {
  area: string;                // "Frenos", "Suspensión", "Motor / Fugas", ...
  items: MechanicalItem[];
};

export type BodyPanel = {
  panel: string;               // "Capó", "Puerta del. izq.", ...
  micras: number;              // espesor de pintura
  estado: PanelState;
  nota?: string;
};

export type ReportBodywork = {
  resumen: string;
  rangoOriginal: string;       // "90–130 µm" — referencia de fábrica
  paneles: BodyPanel[];
};

export type TireReading = {
  posicion: string;            // "Del. izq.", "Tras. der.", ...
  marca: string;
  bandaMm: number;             // mm de banda de rodadura
  estado: ItemStatus;
};

export type BrakeReading = {
  eje: string;                 // "Delantero" / "Trasero"
  pastillasPct: number;        // % de vida restante
  discos: string;              // "En buen estado" / "Leve rebaba"
  estado: ItemStatus;
};

export type ReportRunning = {
  neumaticos: TireReading[];
  frenos: BrakeReading[];
  nota?: string;
};

export type MaintenanceEntry = {
  fecha: string;
  km: string;
  detalle: string;
};

export type ReportHistory = {
  kmVerificado: string;
  kmComentario: string;        // "Coherente con desgaste y registros"
  dueños: number;
  mantenciones: MaintenanceEntry[];
  legal: {
    multas: string;            // "Sin multas pendientes"
    prendas: string;           // "Sin prenda ni gravamen"
    transferencia: string;     // "Lista para transferir"
  };
};

export type ReportPhoto = {
  url: string;
  caption: string;
  tipo: "highlight" | "observacion";
};

export type VehicleReport = {
  carId: string;
  accessToken: string;
  signature: ReportSignature;
  identifiers: ReportIdentifiers;
  verdict: ReportVerdict;
  scanner: ReportScanner;
  mecanica: MechanicalSection[];
  carroceria: ReportBodywork;
  running: ReportRunning;
  historial: ReportHistory;
  fotos: ReportPhoto[];
};

// ─── Datos mock (demo) ────────────────────────────────────────────────────────

export const reports: Record<string, VehicleReport> = {
  "bmw-420-coupe-2024": {
    carId: "bmw-420-coupe-2024",
    accessToken: "qz-8f3a1c7d92b4",
    signature: {
      perito: "Marco Quiroz · Perito automotriz",
      taller: "Quiroz Automotriz — Unidad de Peritaje",
      fecha: "10 de julio de 2026",
      folio: "QR-2026-0428",
    },
    identifiers: {
      vin: "WBA4J1C50KBM12345",
      patente: "RXKF·42",
      numeroMotor: "B48B20A-4821973",
    },
    verdict: {
      estado: "Excelente",
      resumen:
        "Unidad de único dueño, sin evidencia de choques y con mantenciones al día en concesionario. Lista para entrega.",
      highlights: [
        "Carrocería 100% original — sin repintados",
        "Escáner sin códigos de falla activos ni históricos",
        "Mantenciones oficiales BMW documentadas",
        "Neumáticos sobre 80% de vida útil",
      ],
      observaciones: [
        "Desgaste estético menor en llanta delantera derecha (bordillo)",
      ],
    },
    scanner: {
      resumen:
        "Diagnóstico electrónico completo sin anomalías. Todos los módulos responden y no hay testigos encendidos.",
      systems: [
        { nombre: "Motor / Gestión", estado: "ok" },
        { nombre: "Transmisión", estado: "ok" },
        { nombre: "Frenos / ABS", estado: "ok" },
        { nombre: "Airbags / SRS", estado: "ok" },
        { nombre: "Dirección asistida", estado: "ok" },
        { nombre: "Confort / Electrónica", estado: "ok" },
      ],
      codigos: [],
    },
    mecanica: [
      {
        area: "Motor y fluidos",
        items: [
          { label: "Nivel y estado de aceite", estado: "ok" },
          { label: "Refrigerante", estado: "ok" },
          { label: "Sin fugas visibles", estado: "ok" },
          { label: "Correas / cadena", estado: "ok" },
        ],
      },
      {
        area: "Suspensión y dirección",
        items: [
          { label: "Amortiguadores", estado: "ok" },
          { label: "Rótulas y bujes", estado: "ok" },
          { label: "Alineación", estado: "ok" },
        ],
      },
      {
        area: "Frenos",
        items: [
          { label: "Pastillas delanteras", estado: "ok" },
          { label: "Discos", estado: "ok" },
          { label: "Freno de mano", estado: "ok" },
        ],
      },
    ],
    carroceria: {
      resumen:
        "Medición con calibrador de espesor en 12 puntos. Todos los paneles dentro del rango de fábrica: pintura original, sin masilla ni repintados.",
      rangoOriginal: "95–135 µm",
      paneles: [
        { panel: "Capó", micras: 118, estado: "original" },
        { panel: "Techo", micras: 121, estado: "original" },
        { panel: "Puerta del. izq.", micras: 112, estado: "original" },
        { panel: "Puerta del. der.", micras: 115, estado: "original" },
        { panel: "Costado tras. izq.", micras: 124, estado: "original" },
        { panel: "Costado tras. der.", micras: 120, estado: "original" },
        { panel: "Portalón", micras: 117, estado: "original" },
      ],
    },
    running: {
      neumaticos: [
        { posicion: "Del. izq.", marca: "Michelin Pilot Sport", bandaMm: 6.4, estado: "ok" },
        { posicion: "Del. der.", marca: "Michelin Pilot Sport", bandaMm: 6.2, estado: "ok" },
        { posicion: "Tras. izq.", marca: "Michelin Pilot Sport", bandaMm: 6.8, estado: "ok" },
        { posicion: "Tras. der.", marca: "Michelin Pilot Sport", bandaMm: 6.7, estado: "ok" },
      ],
      frenos: [
        { eje: "Delantero", pastillasPct: 78, discos: "En buen estado", estado: "ok" },
        { eje: "Trasero", pastillasPct: 85, discos: "En buen estado", estado: "ok" },
      ],
      nota: "Neumáticos de la misma marca y lote, desgaste parejo: señal de buena alineación.",
    },
    historial: {
      kmVerificado: "20.600 km",
      kmComentario: "Coherente con el desgaste general y los registros de mantención.",
      dueños: 1,
      mantenciones: [
        { fecha: "03/2024", km: "1.000 km", detalle: "Entrega y primera revisión (concesionario)" },
        { fecha: "01/2025", km: "10.500 km", detalle: "Mantención oficial BMW — aceite y filtros" },
        { fecha: "05/2026", km: "20.100 km", detalle: "Revisión pre-venta Quiroz (esta inspección)" },
      ],
      legal: {
        multas: "Sin multas ni infracciones pendientes",
        prendas: "Sin prenda ni gravamen vigente",
        transferencia: "Documentación lista para transferir",
      },
    },
    fotos: [
      {
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1280&q=80",
        caption: "Interior M Sport — sin desgaste de uso",
        tipo: "highlight",
      },
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1280&q=80",
        caption: "Motor limpio, sin rastros de fugas",
        tipo: "highlight",
      },
      {
        url: "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=1280&q=80",
        caption: "Marca de bordillo en llanta del. der. (estética)",
        tipo: "observacion",
      },
    ],
  },

  "ford-ranger-2021": {
    carId: "ford-ranger-2021",
    accessToken: "qz-2b9e46f1a0d7",
    signature: {
      perito: "Marco Quiroz · Perito automotriz",
      taller: "Quiroz Automotriz — Unidad de Peritaje",
      fecha: "08 de julio de 2026",
      folio: "QR-2026-0417",
    },
    identifiers: {
      vin: "MNBUMFE50MW512233",
      patente: "LPKT·88",
      numeroMotor: "JX6C-2021-118344",
    },
    verdict: {
      estado: "Bueno",
      resumen:
        "Pickup de trabajo sana mecánicamente y honesta en su desgaste. Requiere mantención de neumáticos a corto plazo; todo lo demás en orden.",
      highlights: [
        "Motor y transmisión sin observaciones al escáner",
        "Chasis y estructura sanos, sin corrosión relevante",
        "Historial de mantención continuo",
      ],
      observaciones: [
        "Neumáticos traseros bajo 3 mm — cambiar pronto",
        "Repintado en costado trasero derecho (reparación menor documentada)",
        "Código histórico de sensor ya resuelto",
      ],
    },
    scanner: {
      resumen:
        "Sin fallas activas. Se registra un código histórico ya corregido, informado con total transparencia.",
      systems: [
        { nombre: "Motor / Gestión", estado: "ok" },
        { nombre: "Transmisión", estado: "ok" },
        { nombre: "Frenos / ABS", estado: "ok" },
        { nombre: "Airbags / SRS", estado: "ok" },
        { nombre: "Tracción / 4x2", estado: "ok" },
        { nombre: "Sensores", estado: "atencion", nota: "Código histórico, sin falla activa" },
      ],
      codigos: [
        {
          codigo: "P0133",
          descripcion:
            "Respuesta lenta de sensor de oxígeno. Registrado en el pasado; se reemplazó el sensor y no ha vuelto a aparecer.",
          tipo: "historico",
        },
      ],
    },
    mecanica: [
      {
        area: "Motor y fluidos",
        items: [
          { label: "Nivel y estado de aceite", estado: "ok" },
          { label: "Refrigerante", estado: "ok" },
          { label: "Sin fugas visibles", estado: "ok" },
          { label: "Correa de accesorios", estado: "atencion", nota: "Desgaste normal, revisar en próxima mantención" },
        ],
      },
      {
        area: "Suspensión y dirección",
        items: [
          { label: "Amortiguadores", estado: "ok" },
          { label: "Rótulas y terminales", estado: "ok" },
          { label: "Alineación", estado: "atencion", nota: "Leve desgaste externo en neumático trasero" },
        ],
      },
      {
        area: "Frenos",
        items: [
          { label: "Pastillas delanteras", estado: "ok" },
          { label: "Discos / tambores", estado: "ok" },
          { label: "Freno de mano", estado: "ok" },
        ],
      },
      {
        area: "Estructura / chasis",
        items: [
          { label: "Largueros y travesaños", estado: "ok" },
          { label: "Sin corrosión estructural", estado: "ok" },
          { label: "Enganche / pisadera", estado: "ok" },
        ],
      },
    ],
    carroceria: {
      resumen:
        "Medición en 12 puntos. Un panel con repintado por reparación menor (documentada), el resto original. Sin señales de choque estructural.",
      rangoOriginal: "90–130 µm",
      paneles: [
        { panel: "Capó", micras: 112, estado: "original" },
        { panel: "Techo cabina", micras: 118, estado: "original" },
        { panel: "Puerta del. izq.", micras: 109, estado: "original" },
        { panel: "Puerta del. der.", micras: 114, estado: "original" },
        { panel: "Costado tras. izq.", micras: 121, estado: "original" },
        {
          panel: "Costado tras. der.",
          micras: 248,
          estado: "repintado",
          nota: "Repintado por rayón profundo. Reparación estética, sin masilla estructural.",
        },
        { panel: "Portalón", micras: 116, estado: "original" },
      ],
    },
    running: {
      neumaticos: [
        { posicion: "Del. izq.", marca: "Goodyear Wrangler", bandaMm: 5.1, estado: "ok" },
        { posicion: "Del. der.", marca: "Goodyear Wrangler", bandaMm: 4.9, estado: "ok" },
        { posicion: "Tras. izq.", marca: "Goodyear Wrangler", bandaMm: 2.8, estado: "atencion" },
        { posicion: "Tras. der.", marca: "Goodyear Wrangler", bandaMm: 2.6, estado: "atencion" },
      ],
      frenos: [
        { eje: "Delantero", pastillasPct: 62, discos: "En buen estado", estado: "ok" },
        { eje: "Trasero", pastillasPct: 70, discos: "Leve rebaba, sin urgencia", estado: "ok" },
      ],
      nota: "Neumáticos traseros bajo el límite recomendado (3 mm). Se sugiere cambio a corto plazo; presupuesto disponible en Quiroz.",
    },
    historial: {
      kmVerificado: "101.300 km",
      kmComentario: "Kilometraje real, coherente con desgaste, uso mixto ciudad/ruta.",
      dueños: 2,
      mantenciones: [
        { fecha: "06/2021", km: "0 km", detalle: "Entrega (segundo dueño desde 2023)" },
        { fecha: "09/2023", km: "62.000 km", detalle: "Distribución y frenos" },
        { fecha: "11/2024", km: "88.000 km", detalle: "Reemplazo sensor O2 (código P0133 resuelto)" },
        { fecha: "06/2026", km: "101.000 km", detalle: "Revisión pre-venta Quiroz (esta inspección)" },
      ],
      legal: {
        multas: "Sin multas ni infracciones pendientes",
        prendas: "Sin prenda ni gravamen vigente",
        transferencia: "Documentación lista para transferir",
      },
    },
    fotos: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80",
        caption: "Chasis y bajos sanos, sin corrosión estructural",
        tipo: "highlight",
      },
      {
        url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1280&q=80",
        caption: "Banda de rodadura trasera al límite (cambiar pronto)",
        tipo: "observacion",
      },
      {
        url: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1280&q=80",
        caption: "Costado tras. der. repintado — reparación menor documentada",
        tipo: "observacion",
      },
    ],
  },
};

// ─── API ──────────────────────────────────────────────────────────────────────

/** Devuelve el informe de un auto por su id, o undefined si no existe. */
export function getReportById(carId: string): VehicleReport | undefined {
  return reports[carId];
}

/**
 * Valida la clave del panel interno /informe-admin contra la variable de
 * entorno INFORME_ADMIN_KEY. Sin la variable configurada, el panel queda
 * cerrado (fail-closed): nunca se abre por accidente en producción.
 */
export function isValidAdminKey(key: string | undefined): boolean {
  const adminKey = process.env.INFORME_ADMIN_KEY;
  if (!adminKey || !key) return false;
  return safeEqual(adminKey, key);
}

/**
 * Valida el token de acceso de un informe.
 * Comparación de longitud constante para no filtrar el token por timing.
 */
export function isValidToken(carId: string, token: string | undefined): boolean {
  const report = reports[carId];
  if (!report || !token) return false;
  return safeEqual(report.accessToken, token);
}

/** Arma la URL privada del informe (para el panel del vendedor). */
export function buildInformeUrl(baseUrl: string, carId: string): string | null {
  const report = reports[carId];
  if (!report) return null;
  const root = baseUrl.replace(/\/$/, "");
  return `${root}/informe/${carId}?k=${report.accessToken}`;
}

/** Comparación de strings resistente a timing attacks (sin dependencias). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
