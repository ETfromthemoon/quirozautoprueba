import "server-only";

export type ReportValue = string | number | boolean;
export type InspectionDatum = ReportValue | { value?: ReportValue; observation?: string };
export type ReportImage = { url: string; caption?: string };
export type ReportModule = Record<string, InspectionDatum | ReportImage | string | undefined>;
export type VehicleReport = {
  carId: string; accessToken: string;
  signature?: { perito?: string; taller?: string; fecha?: string; folio?: string };
  /** Videos nuevos del catálogo. Se guardan como URL de YouTube en ACF. */
  videoHook?: string;
  videoPruebaRuta?: string;
  videoRevisionVisual?: string;
  /** El detalle escrito de ruta sólo existe cuando este control está activo. */
  pruebaRutaHabilitada?: boolean;
  identificacionLegal?: ReportModule; scannerElectronico?: ReportModule;
  motorMecanica?: ReportModule; transmision?: ReportModule;
  direccionSuspensionFrenosNeumaticos?: ReportModule; carroceriaEstructura?: ReportModule;
  interior?: ReportModule; equipamiento?: ReportModule; pruebaRuta?: ReportModule;
  galeria?: ReportImage[];
};

export type BrochureValidation = {
  complete: boolean;
  missing: Array<"videoHook" | "videoRevisionVisual" | "galeria">;
};

type AcfRecord = Record<string, unknown>;

/** Contrato de nombres para implementar el formulario con ACF gratuito. */
export const BROCHURE_ACF_FIELDS = {
  enabled: "catalogo_habilitado",
  accessToken: "catalogo_token",
  videoHook: "catalogo_video_hook",
  videoRoadTest: "catalogo_video_prueba_ruta",
  videoVisualReview: "catalogo_video_revision_visual",
  roadTestEnabled: "catalogo_prueba_ruta_escrita",
  gallery: "catalogo_galeria",
  gallerySlots: Array.from({ length: 12 }, (_, index) =>
    `catalogo_foto_${String(index + 1).padStart(2, "0")}`,
  ),
} as const;

const MODULE_FIELDS = {
  identificacionLegal: {
    tipoVehiculo: "identificacion_tipo_vehiculo", marca: "identificacion_marca",
    modelo: "identificacion_modelo", ano: "identificacion_ano", color: "identificacion_color",
    version: "identificacion_version", transmision: "identificacion_transmision",
    traccion: "identificacion_traccion",
    combustible: "identificacion_combustible", patente: "identificacion_patente",
    numeroMotor: "identificacion_numero_motor", vin: "identificacion_vin",
    numeroDuenos: "identificacion_numero_duenos", copiaLlaves: "identificacion_copia_llaves",
    servicios: "identificacion_servicios", transporte: "identificacion_transporte",
    aseguradora: "identificacion_aseguradora", perdidaTotal: "identificacion_perdida_total",
    prenda: "identificacion_prenda", multasInscritas: "identificacion_multas_inscritas",
    limitacionesDominio: "identificacion_limitaciones_dominio",
    observaciones: "identificacion_observaciones",
  },
  scannerElectronico: {
    informeImagen: "scanner_informe", testigosEncendidos: "scanner_testigos_encendidos",
    observaciones: "scanner_observaciones",
  },
  motorMecanica: {
    partidaFrio: "motor_partida_frio", ruidos: "motor_ruidos", humo: "motor_humo",
    fugasAceite: "motor_fugas_aceite", observaciones: "motor_observaciones",
  },
  transmision: {
    manual: "transmision_manual", automatica: "transmision_automatica",
    marchasManual: "transmision_marchas_manual", marchasAutomatica: "transmision_marchas_automatica",
    manualElectronica: "transmision_manual_electronica",
    paddleShift: "transmision_paddle_shift", tiptronic: "transmision_tiptronic",
    observaciones: "transmision_observaciones",
  },
  direccionSuspensionFrenosNeumaticos: {
    direccion: "direccion_tipo", juego: "direccion_juego",
    ruidosAlGirar: "direccion_ruidos_al_girar", observacionesDireccion: "direccion_observaciones",
    suspension: "suspension_estado", observacionesSuspension: "suspension_observaciones",
    frenos: "frenos_estado", discos: "frenos_discos",
    neumaticos: "neumaticos_porcentaje", ruedaRepuesto: "rueda_repuesto_porcentaje",
    observaciones: "neumaticos_observaciones",
  },
  carroceriaEstructura: {
    repintado: "carroceria_repintado", golpeReparado: "carroceria_golpe_reparado",
    parabrisasDelantero: "carroceria_parabrisas_delantero",
    parabrisasTrasero: "carroceria_parabrisas_trasero", focos: "carroceria_focos",
    llantas: "carroceria_llantas", aro: "carroceria_aro",
    observaciones: "carroceria_observaciones",
  },
  interior: {
    desgasteVolante: "interior_desgaste_volante", consolaCentral: "interior_consola_central",
    asientos: "interior_asientos",
    pedalesCoherentesKm: "interior_pedales_coherentes_km", limpieza: "interior_limpieza",
    observaciones: "interior_observaciones",
  },
  equipamiento: {
    velocidadCrucero: "equipamiento_velocidad_crucero",
    comandoAudioVolante: "equipamiento_comando_audio_volante",
    bluetooth: "equipamiento_bluetooth", pantallaTouch: "equipamiento_pantalla_touch",
    carPlay: "equipamiento_carplay", camara: "equipamiento_camara",
    radioDisponible: "equipamiento_radio_disponible",
    partidaElectronica: "equipamiento_partida_electronica",
    frenoElectronico: "equipamiento_freno_electronico",
    aireAcondicionado: "equipamiento_aire_acondicionado",
    calefaccion: "equipamiento_calefaccion", climatizador: "equipamiento_climatizador",
    alzavidrios: "equipamiento_alzavidrios", cierreCentral: "equipamiento_cierre_central",
    radio: "equipamiento_radio", airbags: "equipamiento_airbags",
    cantidadAirbags: "equipamiento_cantidad_airbags",
    sensoresDelanteros: "equipamiento_sensores_delanteros",
    sensoresTraseros: "equipamiento_sensores_traseros",
    portalonTraseroElectronico: "equipamiento_portalon_trasero_electronico",
    barrasTecho: "equipamiento_barras_techo",
    cinturones: "equipamiento_cinturones", gata: "equipamiento_gata",
    llaveRueda: "equipamiento_llave_rueda", kitSeguridad: "equipamiento_kit_seguridad",
    observaciones: "equipamiento_observaciones",
  },
} as const;

const ROAD_TEST_FIELDS = {
  distancia: "prueba_ruta_distancia", ruidos: "prueba_ruta_ruidos",
  tironeo: "prueba_ruta_tironeo", frenado: "prueba_ruta_frenado",
  vibracion: "prueba_ruta_vibracion", temperatura: "prueba_ruta_temperatura",
  observaciones: "prueba_ruta_observaciones",
} as const;

/**
 * Convierte la respuesta ACF a un catálogo opcional. No exige campos para que
 * el producto siga publicándose normalmente aunque el catálogo esté vacío.
 */
export function parseVehicleReportFromAcf(carId: string, input: unknown): VehicleReport | undefined {
  const root = asRecord(input);
  const nested = asRecord(root.catalogo);
  const read = (name: string) => root[`catalogo_${name}`] ?? nested[name];
  const enabled = toBoolean(root[BROCHURE_ACF_FIELDS.enabled] ?? nested.habilitado);

  const report: VehicleReport = {
    carId,
    accessToken: toText(root[BROCHURE_ACF_FIELDS.accessToken] ?? nested.token) ?? "",
    videoHook: toYouTubeUrl(root[BROCHURE_ACF_FIELDS.videoHook] ?? nested.video_hook),
    videoPruebaRuta: toYouTubeUrl(root[BROCHURE_ACF_FIELDS.videoRoadTest] ?? nested.video_prueba_ruta),
    videoRevisionVisual: toYouTubeUrl(root[BROCHURE_ACF_FIELDS.videoVisualReview] ?? nested.video_revision_visual),
    pruebaRutaHabilitada: toBoolean(root[BROCHURE_ACF_FIELDS.roadTestEnabled] ?? nested.prueba_ruta_escrita),
  };

  for (const [moduleName, fields] of Object.entries(MODULE_FIELDS)) {
    const module = mapModule(fields, read);
    if (hasContent(module)) (report as unknown as AcfRecord)[moduleName] = module;
  }

  if (report.pruebaRutaHabilitada) {
    const roadTest = mapModule(ROAD_TEST_FIELDS, read);
    if (hasContent(roadTest)) report.pruebaRuta = roadTest;
  }

  const gallery = parseGallery(root, nested);
  // 8 a 12 fotos: una carga incompleta no se expone como galería de catálogo.
  if (gallery.length >= 8 && gallery.length <= 12) report.galeria = gallery;

  const containsCatalogData = hasContent({
    ...report,
    carId: undefined,
    accessToken: undefined,
    pruebaRutaHabilitada: report.pruebaRutaHabilitada || undefined,
  });
  return enabled || containsCatalogData ? report : undefined;
}

/** Los faltantes afectan sólo al catálogo; nunca al estado del producto WooCommerce. */
export function validateBrochure(report: VehicleReport | undefined): BrochureValidation {
  const missing: BrochureValidation["missing"] = [];
  if (!report?.videoHook) missing.push("videoHook");
  if (!report?.videoRevisionVisual) missing.push("videoRevisionVisual");
  if (!report?.galeria || report.galeria.length < 8 || report.galeria.length > 12) {
    missing.push("galeria");
  }
  return { complete: missing.length === 0, missing };
}

function mapModule(
  fields: Record<string, string>,
  read: (name: string) => unknown,
): ReportModule {
  return Object.fromEntries(
    Object.entries(fields)
      .map(([key, field]) => [key, normalizeAcfValue(read(field))])
      .filter(([, value]) => hasContent(value)),
  ) as ReportModule;
}

function parseGallery(root: AcfRecord, nested: AcfRecord): ReportImage[] {
  const arrayValue = root[BROCHURE_ACF_FIELDS.gallery] ?? nested.galeria;
  const candidates = Array.isArray(arrayValue)
    ? arrayValue
    : BROCHURE_ACF_FIELDS.gallerySlots.map((field, index) =>
        root[field] ?? nested[`foto_${String(index + 1).padStart(2, "0")}`],
      );
  const urls = candidates.map(toImage).filter((image): image is ReportImage => Boolean(image));
  return Array.from(new Map(urls.map((image) => [image.url, image])).values()).slice(0, 12);
}

function normalizeAcfValue(value: unknown): InspectionDatum | ReportImage | undefined {
  const image = toImage(value);
  if (image && typeof value === "object") return image;
  if (typeof value === "boolean" || typeof value === "number") return value;
  return toText(value);
}

function toImage(value: unknown): ReportImage | undefined {
  if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) return { url: value.trim() };
  const record = asRecord(value);
  const url = toText(record.url ?? record.source_url);
  if (!url || !/^https?:\/\//i.test(url)) return undefined;
  return { url, caption: toText(record.caption ?? record.alt ?? record.title) };
}

function toYouTubeUrl(value: unknown): string | undefined {
  const url = toText(value);
  return url && /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(url) ? url : undefined;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  return /^(?:1|true|si|sí|yes|on)$/i.test(toText(value) ?? "");
}

function toText(value: unknown): string | undefined {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const text = String(value).trim();
  return hasContent(text) ? text : undefined;
}

function asRecord(value: unknown): AcfRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as AcfRecord : {};
}

/** Maqueta ficticia. Los campos omitidos prueban que no se renderizan vacíos. */
export const reports: Record<string, VehicleReport> = {
  "bmw-420-grand-coupe-m-designe-2-0-at-2024": {
    carId: "bmw-420-grand-coupe-m-designe-2-0-at-2024", accessToken: "qz-8f3a1c7d92b4",
    videoHook: "https://www.youtube.com/watch?v=N7vlsZbQ-jU",
    videoPruebaRuta: "https://www.youtube.com/watch?v=N7vlsZbQ-jU",
    videoRevisionVisual: "https://www.youtube.com/watch?v=N7vlsZbQ-jU",
    pruebaRutaHabilitada: true,
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
      direccion: "Eléctrica", juego: false, ruidosAlGirar: false,
      suspension: "Bueno", frenos: "Bueno", discos: "Bueno", neumaticos: "80%",
      ruedaRepuesto: "100%", observaciones: "Profundidad de dibujo entre 6,2 y 6,8 mm."
    },
    carroceriaEstructura: {
      repintado: { value: "No detectado", observation: "Lecturas entre 108 y 124 µm." }, golpeReparado: false,
      cuadratura: "Correcta", capot: "Original", techo: "Original", maletero: "Original", puertas: "Originales y alineadas",
      parachoqueDelantero: "Buen estado", parachoqueTrasero: "Buen estado", pilares: "Sin intervención",
      parabrisasDelantero: "Original, sin piquetes", focos: "Operativos, sin humedad",
      llantas: { value: "Buen estado", observation: "Marca estética menor en llanta delantera derecha." }
    },
    interior: { desgasteVolante: "Leve y coherente con kilometraje", asientos: "Cuero sin roturas", pedalesCoherentesKm: true, limpieza: "Sanitizado para entrega" },
    equipamiento: { aireAcondicionado: "Bueno", calefaccion: "Bueno", climatizador: "Bueno", alzavidrios: "Bueno", cierreCentral: "Bueno", radio: "Bueno", airbags: "Bueno", cinturones: "Bueno", gata: true, llaveRueda: true, kitSeguridad: true },
    pruebaRuta: { distancia: "5 km", ruidos: "Sin ruidos anómalos", tironeo: false, frenado: "Recto y progresivo", vibracion: "No detectada", temperatura: "Normal y estable", observaciones: "Prueba urbana con motor a temperatura de servicio." },
    galeria: [
      { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=85", caption: "Interior de demostración" },
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85", caption: "Registro mecánico de demostración" }
    ]
  }
};

// Respaldo temporal de presentación: permite revisar este único catálogo cuando
// el WAF de WordPress bloquea solicitudes salientes de Vercel. Se elimina junto
// con los datos DEMO cargados en el producto 13093.
reports["volvo-xc90-ii-t8-awd-2-0-polestar-2022"] = {
  ...reports["bmw-420-grand-coupe-m-designe-2-0-at-2024"],
  carId: "volvo-xc90-ii-t8-awd-2-0-polestar-2022",
  accessToken: "demo-volvo-xc90-temporal-2026",
  identificacionLegal: {
    tipoVehiculo: "SUV", marca: "Volvo", modelo: "XC90 T8 AWD", ano: 2022,
    color: "Azul metálico", version: "Polestar Engineered · DEMO",
    transmision: "Automática", traccion: "AWD", combustible: "Híbrido", patente: "DEMO22",
    numeroMotor: "MOTOR-DEMO-001", vin: "VIN-DEMO-NO-REAL-2026",
    numeroDuenos: 1, copiaLlaves: "Sí", servicios: "Concesionario",
    transporte: "No", aseguradora: "Sí", perdidaTotal: "No", prenda: "No",
    multasInscritas: "No", limitacionesDominio: "No",
    observaciones: "DATOS FICTICIOS DE DEMOSTRACIÓN. No corresponden al vehículo real.",
  },
  transmision: {
    manual: "No", automatica: "Sí", marchasAutomatica: 8,
    manualElectronica: "No", paddleShift: "Sí", tiptronic: "Sí",
    observaciones: "DATOS FICTICIOS DE DEMOSTRACIÓN. Transmisión verificada en prueba estática.",
  },
  carroceriaEstructura: {
    ...(reports["bmw-420-grand-coupe-m-designe-2-0-at-2024"].carroceriaEstructura ?? {}),
    aro: 21,
  },
  interior: {
    ...(reports["bmw-420-grand-coupe-m-designe-2-0-at-2024"].interior ?? {}),
    consolaCentral: "Bueno",
  },
  equipamiento: {
    ...(reports["bmw-420-grand-coupe-m-designe-2-0-at-2024"].equipamiento ?? {}),
    velocidadCrucero: "Sí", comandoAudioVolante: "Sí", bluetooth: "Sí",
    pantallaTouch: "Sí", carPlay: "Sí", camara: "360°", radioDisponible: "Sí",
    partidaElectronica: "Sí", frenoElectronico: "Sí", cantidadAirbags: 7,
    sensoresDelanteros: "Sí", sensoresTraseros: "Sí",
    portalonTraseroElectronico: "Sí", barrasTecho: "Sí",
  },
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
