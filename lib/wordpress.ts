/**
 * lib/wordpress.ts — Lector de autos desde el WordPress/WooCommerce existente
 *
 * ARQUITECTURA
 * ─────────────────────────────────────────────────────────────────
 *  WordPress + WooCommerce (sitio actual)        Next.js (Vercel)
 *  ──────────────────────────────────────        ──────────────────
 *  Autos = productos WooCommerce      ──REST──►  fetchCars()
 *  + campos ACF (precio, km, etc.)    ──REST──►  fetchCarBySlug()
 *  /wp-json/wp/v2/product             ──REST──►  fetchCarSlugs()
 *                                                  ▼
 *                                            mapProductToCar()
 *                                                  ▼
 *                                            Car (tipo de lib/cars.ts)
 *
 * IMPORTANTE
 * ─────────────────────────────────────────────────────────────────
 * - Solo LECTURA pública. No modifica nada del sitio actual.
 * - No requiere claves de API: el endpoint /wp-json/wp/v2/product es público.
 * - El sitio WordPress sigue funcionando 100% igual (tienda, formularios, etc.).
 *
 * ESTRUCTURA DE DATOS REAL (confirmada en quirozautomotriz.cl)
 * ─────────────────────────────────────────────────────────────────
 *  title.rendered : "CITROÉN C4 CACTUS 1.2 AUTOMÁTICO 2019"  (marca+modelo+año)
 *  acf.precio        : "10.580.000"
 *  acf.descripcion   : texto completo
 *  acf.kilometraje   : "55.000"
 *  acf.combustible   : "Bencina"
 *  acf.cilindrada    : "1.200"  (o "Eléctrico")
 *  acf.transmision   : "Automático"
 *  acf.color         : "Blanco"
 *  acf.video         : URL YouTube (o "")
 *  product_cat       : categorías → tipo (SUV/Hatchback), tracción (AWD), dueño
 *  featured media    : foto principal
 *
 * ENV VARS (opcional)
 * ─────────────────────────────────────────────────────────────────
 *   WORDPRESS_API_URL=https://www.quirozautomotriz.cl/wp-json/wp/v2
 *   (Si no se define, usa la URL por defecto de abajo.)
 *
 * FASE 2 (mejora futura, no bloqueante)
 * ─────────────────────────────────────────────────────────────────
 *   Galería multi-foto: WooCommerce guarda fotos extra que se pueden leer
 *   desde /wp-json/wc/store/v1/products (también público). Hoy usamos la
 *   foto principal; se puede enriquecer sin tocar el resto.
 */

import type { Car, EngineSpecs, Documentation } from "./cars";
import { cars as staticCars } from "./cars";

// ─── Configuración ──────────────────────────────────────────────────────────

const WP_API = (
  process.env.WORDPRESS_API_URL ??
  "https://www.quirozautomotriz.cl/wp-json/wp/v2"
).replace(/\/$/, "");

const REVALIDATE_SECONDS = 60; // ISR: refresca el catálogo cada 60 s → autos nuevos aparecen en ~1 min
const FETCH_TIMEOUT_MS = 10_000; // timeout por request a WP (build)
const RUNTIME_FETCH_TIMEOUT_MS = 25_000; // timeout más generoso en runtime
const SAFETY_TIMEOUT_MS = 14_000; // timeout de seguridad por si AbortController falla (build)
const RUNTIME_SAFETY_TIMEOUT_MS = 30_000; // safety timeout runtime
const PER_PAGE = 100;
const RUNTIME_MAX_PAGES = 15; // tope en runtime (1.500 autos)
const BUILD_MAX_PAGES = 1;    // tope durante build (100 autos) para no colgar

const isBuild = typeof process !== "undefined" && process.env.NEXT_PHASE === "phase-production-build";

// Saltear WP explícitamente (override de emergencia para Vercel)
const SKIP_WP = process.env.SKIP_WP === "1";

// Foto de respaldo si un producto no tiene imagen destacada.
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80";

// ─── Tipos del REST de WordPress ────────────────────────────────────────────

type WpAcf = {
  precio?: string;
  descripcion?: string;
  kilometraje?: string;
  combustible?: string;
  cilindrada?: string;
  transmision?: string;
  color?: string;
  video?: string;
};

type WpTerm = { taxonomy?: string; name?: string; slug?: string };
type WpMedia = { source_url?: string };

type WpProduct = {
  id: number;
  slug: string;
  title?: { rendered?: string };
  acf?: WpAcf;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
};

// ─── Clasificación de categorías ────────────────────────────────────────────

const BODY_TYPES = [
  "Hatchback",
  "SUV",
  "Sedán",
  "Sedan",
  "Pickup",
  "Coupé",
  "Coupe",
  "Van",
  "Furgón",
  "Furgon",
  "Camioneta",
  "Station Wagon",
  "Convertible",
  "City Car",
  "Deportivo",
  "4x4",
];

const DRIVETRAINS = ["AWD", "4WD", "FWD", "RWD", "4x2"];

/** Detecta la tracción dentro de un texto libre (nombre/variante). */
function detectDrivetrain(text: string): string | undefined {
  const match = text.toUpperCase().match(/\b(AWD|4WD|4X4|4X2|FWD|RWD)\b/);
  return match ? match[1].replace("X", "x") : undefined;
}

type CategoryInfo = {
  bodyType?: string;
  drivetrain?: string;
  ownerType?: string;
  isSold: boolean;
};

function classifyCategories(names: string[]): CategoryInfo {
  const lower = (s: string) => s.toLowerCase().trim();

  const bodyType = names.find((n) =>
    BODY_TYPES.some((b) => lower(b) === lower(n))
  );
  const drivetrain = names.find((n) =>
    DRIVETRAINS.some((d) => lower(d) === lower(n))
  );
  const ownerType = names.find((n) => /due[ñn]/i.test(n));
  const isSold = names.some((n) => /vendid|inactiv|no disponible/i.test(n));

  return { bodyType, drivetrain, ownerType, isSold };
}

// ─── Parseo del título (marca · modelo · variante · año) ────────────────────

const TWO_WORD_BRANDS = [
  "ALFA ROMEO",
  "LAND ROVER",
  "ASTON MARTIN",
  "GREAT WALL",
  "MERCEDES BENZ",
];

// Palabras que marcan el inicio de la "variante" (motor/equipamiento/tracción).
const SPEC_WORDS = new Set([
  "AUTOMÁTICO",
  "AUTOMATICO",
  "MANUAL",
  "MT",
  "AT",
  "CVT",
  "DSG",
  "AWD",
  "4WD",
  "4X4",
  "4X2",
  "FWD",
  "RWD",
  "FULL",
  "TURBO",
  "BITURBO",
  "DIÉSEL",
  "DIESEL",
  "TDI",
  "HDI",
  "CRDI",
  "TGDI",
  "ECOBOOST",
  "HYBRID",
  "HÍBRIDO",
  "HIBRIDO",
  "ELÉCTRICO",
  "ELECTRICO",
  "LIMITED",
  "SPORT",
]);

type TitleParts = {
  brand: string;
  model: string;
  variant?: string;
  year: number;
};

function isSpecToken(token: string): boolean {
  // Cilindrada tipo "1.2", "2.0", "1,6" → marca inicio de variante.
  if (/^\d[.,]\d$/.test(token)) return true;
  return SPEC_WORDS.has(token.toUpperCase());
}

function findYear(text: string): number | undefined {
  const matches = text.match(/\b(?:19|20)\d{2}\b/g);
  if (!matches || matches.length === 0) return undefined;
  return Number(matches[matches.length - 1]);
}

function parseTitle(rawTitle: string, slug: string): TitleParts {
  const title = decodeHtml(rawTitle).replace(/\s+/g, " ").trim();
  const upper = title.toUpperCase();

  // Marca (1 o 2 palabras).
  let brand = title.split(" ")[0] ?? "";
  for (const b of TWO_WORD_BRANDS) {
    if (upper.startsWith(b + " ")) {
      brand = title.slice(0, b.length);
      break;
    }
  }

  // Año (del título, o del slug como respaldo).
  const year = findYear(title) ?? findYear(slug) ?? 0;

  // Resto sin marca ni año.
  const rest = title
    .slice(brand.length)
    .replace(/\b(?:19|20)\d{2}\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = rest.split(" ").filter(Boolean);
  const specIndex = tokens.findIndex((t) => isSpecToken(t));

  let model: string;
  let variant: string | undefined;

  if (specIndex > 0) {
    model = tokens.slice(0, specIndex).join(" ");
    variant = tokens.slice(specIndex).join(" ");
  } else {
    model = tokens.join(" ");
    variant = undefined;
  }

  if (!model) model = brand || title;

  return { brand, model, variant, year };
}

// ─── Helpers de formato ─────────────────────────────────────────────────────

function decodeHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // quita etiquetas HTML
    .replace(/&amp;/g, "&")
    .replace(/&#0?38;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;|&#8217;|&#039;|&#39;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPrice(raw: string | undefined): {
  text: string;
  numeric: number;
} {
  const digits = (raw ?? "").replace(/\D/g, "");
  const numeric = digits ? Number(digits) : 0;
  if (!numeric) return { text: "Consultar precio", numeric: 0 };
  const text = "$" + numeric.toLocaleString("es-CL");
  return { text, numeric };
}

/** Convierte cualquier URL de YouTube a formato embed. "" → undefined. */
function normalizeVideoUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const url = raw.trim();
  if (!url) return undefined;

  const watch = url.match(/[?&]v=([\w-]{11})/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;

  const short = url.match(/youtu\.be\/([\w-]{11})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;

  const embed = url.match(/youtube\.com\/embed\/([\w-]{11})/);
  if (embed) return url;

  return undefined;
}

/**
 * Trunca un texto a `max` caracteres en el último espacio antes del límite.
 * Garantiza al menos la mitad del límite para evitar cortes demasiado cortos.
 */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max);
  return (cut > max * 0.5 ? text.slice(0, cut) : text.slice(0, max)).trimEnd() + "…";
}

function buildDisplacement(cilindrada: string | undefined): string | undefined {
  if (!cilindrada) return undefined;
  const value = cilindrada.trim();
  if (!value || /el[eé]ctric/i.test(value)) return undefined;
  // Valor numérico (ej: "1.200") → "1.200 cc".
  if (/^[\d.,]+$/.test(value)) return `${value} cc`;
  return value;
}

// ─── Mapeo producto → Car ───────────────────────────────────────────────────

function extractCategoryNames(product: WpProduct): string[] {
  const groups = product._embedded?.["wp:term"] ?? [];
  return groups
    .flat()
    .filter((t) => t?.taxonomy === "product_cat" && t.name)
    .map((t) => t.name as string);
}

function extractImage(product: WpProduct): string {
  return (
    product._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? FALLBACK_IMAGE
  );
}

function mapProductToCar(product: WpProduct): Car {
  const acf = product.acf ?? {};
  // Algunos productos en el CMS tienen prefijo "Z " para ordenarlos al fondo del admin.
  // Se lo quitamos antes de parsear el título.
  const rawTitle = (product.title?.rendered ?? product.slug).replace(/^Z\s+/i, "");
  const { brand, model, variant, year } = parseTitle(rawTitle, product.slug);

  const categories = extractCategoryNames(product);
  const cat = classifyCategories(categories);
  const price = formatPrice(acf.precio);

  const displacement = buildDisplacement(acf.cilindrada);
  const engine: EngineSpecs | undefined = displacement
    ? { displacement }
    : undefined;

  const documentation: Documentation | undefined =
    acf.color || cat.ownerType
      ? { color: acf.color || undefined, ownerType: cat.ownerType }
      : undefined;

  return {
    id: product.slug,
    brand,
    model,
    variant,
    year,
    price: price.text,
    priceNumeric: price.numeric,
    km: (acf.kilometraje ?? "").trim() || "—",
    fuel: (acf.combustible ?? "").trim() || "—",
    transmission: (acf.transmision ?? "").trim() || "—",
    drivetrain:
      cat.drivetrain ?? detectDrivetrain(`${model} ${variant ?? ""}`),
    bodyType: cat.bodyType ?? "Vehículo",
    image: extractImage(product),
    videoUrl: normalizeVideoUrl(acf.video),
    tagline: cat.bodyType ?? "Disponible ahora",
    description: decodeHtml(acf.descripcion ?? ""),
    engine,
    documentation,
  };
}

// ─── Fetch con paginación ───────────────────────────────────────────────────

function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const timeoutMs = isBuild ? FETCH_TIMEOUT_MS : RUNTIME_FETCH_TIMEOUT_MS;
  const safetyMs = isBuild ? SAFETY_TIMEOUT_MS : RUNTIME_SAFETY_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const safetyTimer = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Safety timeout after ${safetyMs}ms`)), safetyMs)
  );
  return Promise.race([
    fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer)),
    safetyTimer,
  ]);
}

async function fetchProductsPage(page: number): Promise<WpProduct[]> {
  const url = `${WP_API}/product?per_page=${PER_PAGE}&page=${page}&_embed&orderby=title&order=asc`;
  const res = await fetchWithTimeout(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: {
      "Accept": "application/json",
      "User-Agent": "QuirozNext/1.0 (+https://www.quirozautomotriz.cl)",
    },
  });

  // WordPress devuelve 400 cuando se pide una página fuera de rango: fin.
  if (res.status === 400) return [];
  if (!res.ok) {
    const body = await res.text().catch(() => "(sin cuerpo)");
    throw new Error(`WordPress API ${res.status} en page ${page} — ${body.slice(0, 200)}`);
  }
  return (await res.json()) as WpProduct[];
}

async function fetchAllProducts(): Promise<WpProduct[]> {
  const maxPages = isBuild ? BUILD_MAX_PAGES : RUNTIME_MAX_PAGES;
  const all: WpProduct[] = [];
  for (let page = 1; page <= maxPages; page++) {
    try {
      const batch = await fetchProductsPage(page);
      all.push(...batch);
      if (batch.length < PER_PAGE) break;
    } catch (err) {
      console.error(`[WordPress] fetchAllProducts página ${page} falló, deteniendo paginación:`, err);
      break;
    }
  }
  return all;
}

// ─── Cache global (evita múltiples llamadas durante el build) ────────────────

let _carsCache: Car[] | null = null;
let _soldCarsCache: Car[] | null = null;

// ─── API pública ────────────────────────────────────────────────────────────

/**
 * Todos los autos disponibles, ordenados del más reciente al más antiguo.
 * Excluye los marcados como vendidos. Si WordPress falla, usa datos estáticos.
 */
export async function fetchCars(): Promise<Car[]> {
  if (_carsCache) return _carsCache;

  if (SKIP_WP) {
    console.log("[WordPress] SKIP_WP=1 — usando datos estáticos");
    _carsCache = staticCars;
    return _carsCache;
  }

  const getCarsFromWP = async () => {
    const products = await fetchAllProducts();
    const cars = products
      .map((p) => ({ product: p, cat: classifyCategories(extractCategoryNames(p)) }))
      .filter(({ cat, product }) => {
        if (cat.isSold) return false;
        const desc = (product.acf?.descripcion ?? "").trimStart();
        if (/^VENDIDO/i.test(desc)) return false;
        return true;
      })
      .map(({ product }) => mapProductToCar(product));
    if (cars.length === 0) throw new Error("WP devolvió 0 autos disponibles");
    return cars;
  };

  try {
    _carsCache = await getCarsFromWP();
    console.log(`[WordPress] fetchCars → ${_carsCache.length} autos disponibles`);
    return _carsCache;
  } catch (err) {
    const label = isBuild ? "[WordPress] Build " : "[WordPress] ";
    console.error(`${label}fetchCars falló — usando respaldo estático:`, err);
    _carsCache = staticCars;
    return _carsCache;
  }
}

/**
 * Un auto por su slug. Si WordPress falla, usa datos estáticos.
 */
export async function fetchCarBySlug(slug: string): Promise<Car | undefined> {
  try {
    const url = `${WP_API}/product?slug=${encodeURIComponent(slug)}&_embed`;
    const res = await fetchWithTimeout(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`WordPress API ${res.status} para slug ${slug}`);

    const products = (await res.json()) as WpProduct[];
    if (!products.length) {
      return staticCars.find((c) => c.id === slug);
    }
    return mapProductToCar(products[0]);
  } catch (err) {
    console.error(
      `[WordPress] fetchCarBySlug("${slug}") falló — usando respaldo estático:`,
      err
    );
    return staticCars.find((c) => c.id === slug);
  }
}

/**
 * Todos los slugs para generateStaticParams. Deriva de fetchCars para mantener
 * el mismo filtrado (sin vendidos) y una sola fuente de verdad.
 */
export async function fetchCarSlugs(): Promise<string[]> {
  const cars = await fetchCars();
  return cars.map((c) => c.id);
}

/**
 * Autos marcados como vendidos — inverso exacto del filtro de fetchCars.
 * Devuelve array vacío (nunca usa estáticos) si WordPress falla.
 */
export async function fetchSoldCars(): Promise<Car[]> {
  if (_soldCarsCache) return _soldCarsCache;

  if (SKIP_WP) {
    console.log("[WordPress] SKIP_WP=1 — sin vendidos estáticos");
    _soldCarsCache = [];
    return _soldCarsCache;
  }

  try {
    const products = await fetchAllProducts();
    _soldCarsCache = products
      .map((p) => ({ product: p, cat: classifyCategories(extractCategoryNames(p)) }))
      .filter(({ cat, product }) => {
        if (cat.isSold) return true;
        const desc = (product.acf?.descripcion ?? "").trimStart();
        if (/^VENDIDO/i.test(desc)) return true;
        return false;
      })
      .map(({ product }) => mapProductToCar(product));
    console.log(`[WordPress] fetchSoldCars → ${_soldCarsCache.length} vendidos`);
    return _soldCarsCache;
  } catch (err) {
    console.error("[WordPress] fetchSoldCars falló:", err);
    _soldCarsCache = [];
    return _soldCarsCache;
  }
}
