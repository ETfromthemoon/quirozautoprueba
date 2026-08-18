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

import "server-only";
import { getCache } from "@vercel/functions";
import type { Car, EngineSpecs, Documentation } from "./cars";
import { cars as staticCars } from "./cars";
import cmsSnapshotData from "./cars.snapshot.json";

const cmsSnapshot = cmsSnapshotData as Car[];
const fallbackCars = cmsSnapshot.length > 0 ? cmsSnapshot : staticCars;

// ─── Configuración ──────────────────────────────────────────────────────────

const WP_API = (
  process.env.WORDPRESS_API_URL ??
  "https://www.quirozautomotriz.cl/wp-json/wp/v2"
).replace(/\/$/, "");

// Dominios alternativos para resistir bloqueos temporales del WAF/CDN.
const WP_API_CANDIDATES = Array.from(
  new Set([
    WP_API,
    ...(process.env.WORDPRESS_API_FALLBACKS ?? "")
      .split(",")
      .map((url) => url.trim().replace(/\/$/, ""))
      .filter(Boolean),
    "https://admin.quirozautomotriz.cl/wp-json/wp/v2",
  ]),
);

// WordPress puede devolver medios con la URL del dominio antiguo. Durante la
// migración, el origen de imágenes debe poder apuntar al subdominio del CMS.
const WP_MEDIA_ORIGIN = (
  process.env.WORDPRESS_MEDIA_ORIGIN ??
  "https://www.quirozautomotriz.cl"
).replace(/\/$/, "");

const REVALIDATE_SECONDS = 60; // ISR: refresca el catálogo cada 60 s → autos nuevos aparecen en ~1 min
const FETCH_TIMEOUT_MS = 10_000;
const RUNTIME_FETCH_TIMEOUT_MS = 20_000;
const SAFETY_TIMEOUT_MS = 14_000;
const RUNTIME_SAFETY_TIMEOUT_MS = 25_000;
const PER_PAGE = 100;
const RUNTIME_MAX_PAGES = 15; // tope en runtime (1.500 autos)
const BUILD_MAX_PAGES = 2;    // cubre los 117 productos actuales sin paginación incompleta
const VEHICLE_CACHE_TTL_SECONDS = 60 * 60 * 24 * 30;
// WordPress ya genera esta variante cuando la foto original lo permite. Es
// suficiente para el hero y la galería, sin entregar los originales de 2K/4K.
const CMS_IMAGE_TARGET_WIDTH = 1_600;

const isBuild = typeof process !== "undefined" && process.env.NEXT_PHASE === "phase-production-build";

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
  video_2?: string;
  /** Foto editorial opcional para usar como portada de los videos. */
  imagen_video?: string;
  /** Campo opcional recomendado para una foto optimizada para celular. */
  imagen_mobile?: string;
};

type WpTerm = { taxonomy?: string; name?: string; slug?: string };
type WpMediaSize = { source_url?: string; width?: number };
type WpMedia = {
  source_url?: string;
  media_details?: { sizes?: Record<string, WpMediaSize> };
};

type WpProduct = {
  id: number;
  slug: string;
  title?: { rendered?: string };
  acf?: WpAcf;
  product_cat?: number[];
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
  _links?: {
    "wp:attachment"?: Array<{ href?: string }>;
  };
};

type StoreImage = {
  src?: string;
  srcset?: string;
};

type StoreProduct = {
  slug?: string;
  images?: StoreImage[];
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
  "Cabrio",
  "Doble Cabina",
  "SUV Compacto",
  "Suv Compacto",
  "Moto",
];

const DRIVETRAINS = ["AWD", "4WD", "FWD", "RWD", "4x2", "4 Matic"];

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

function isSoldProduct(product: WpProduct, cat: CategoryInfo): boolean {
  if (cat.isSold) return true;

  // En el CMS, un auto sin precio o con precio $0 deja de estar disponible.
  const priceDigits = (product.acf?.precio ?? "").replace(/\D/g, "");
  if (!priceDigits || Number(priceDigits) === 0) return true;

  // En el CMS varios autos vendidos no tienen una categoria especial: el estado
  // queda escrito al comienzo de la descripcion, a veces dentro de etiquetas HTML.
  const title = decodeHtml(product.title?.rendered ?? "");
  const description = decodeHtml(product.acf?.descripcion ?? "").replace(/<[^>]*>/g, " ");
  const searchable = `${product.slug} ${title} ${description}`.replace(/\s+/g, " ");

  return /\b(vendid[oa]s?|inactiv[oa]s?|no\s+disponible)\b/i.test(searchable);
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

/** Conserva saltos y listas del texto editorial sin renderizar HTML del CMS. */
function decodeDescription(input: string): string {
  return input
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/(?:p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#0?38;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8216;|&#8217;|&#039;|&#39;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
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

  const shorts = url.match(/youtube(?:-nocookie)?\.com\/shorts\/([\w-]{11})/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;

  const nocookie = url.match(/youtube-nocookie\.com\/embed\/([\w-]{11})/);
  if (nocookie) return `https://www.youtube.com/embed/${nocookie[1]}`;

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

function extractCategoryNames(product: WpProduct, catMap?: Map<number, string>): string[] {
  // Preferir _embedded.wp:term si existe (cuando se usó _embed=wp:term)
  const groups = product._embedded?.["wp:term"] ?? [];
  if (groups.length > 0) {
    return groups
      .flat()
      .filter((t) => t?.taxonomy === "product_cat" && t.name)
      .map((t) => t.name as string);
  }
  // Fallback: usar product_cat IDs + category map
  if (catMap && product.product_cat?.length) {
    return product.product_cat.map((id) => catMap.get(id)).filter(Boolean) as string[];
  }
  return [];
}

function extractImage(product: WpProduct): string {
  const media = product._embedded?.["wp:featuredmedia"]?.[0];
  const source = selectWordPressMediaSize(media);
  if (!source) return FALLBACK_IMAGE;

  return normalizeMediaOrigin(source);
}

/**
 * El REST de WordPress incluye las sub-tallas creadas al subir el archivo.
 * Elegimos la más pequeña que cubra el uso del sitio (normalmente 1536 px),
 * antes que el original o su versión "-scaled". Así el CMS, y no Vercel,
 * asume la reducción de cada fotografía.
 */
function selectWordPressMediaSize(media?: WpMedia): string | undefined {
  const sizes = media?.media_details?.sizes;
  const candidates = Object.values(sizes ?? [])
    .map((size) => ({ src: size.source_url?.trim(), width: size.width ?? 0 }))
    .filter((size): size is { src: string; width: number } => Boolean(size.src));

  return selectBestImageCandidate(candidates) ?? media?.source_url?.trim();
}

/** Convierte el srcset de WooCommerce en alternativas de tamaño conocidas. */
function parseWordPressSrcSet(srcset?: string): Array<{ src: string; width: number }> {
  if (!srcset) return [];

  return srcset
    .split(",")
    .map((entry) => {
      const [src, descriptor] = entry.trim().split(/\s+/);
      const width = Number.parseInt(descriptor?.replace(/w$/, "") ?? "", 10);
      return { src, width };
    })
    .filter((candidate) => Boolean(candidate.src) && Number.isFinite(candidate.width) && candidate.width > 0);
}

/** Devuelve la menor imagen que alcanza el ancho objetivo; si no existe, la mayor disponible. */
function selectBestImageCandidate(
  candidates: Array<{ src: string; width: number }>,
): string | undefined {
  const ordered = [...candidates].sort((a, b) => a.width - b.width);
  return (
    ordered.find((candidate) => candidate.width >= CMS_IMAGE_TARGET_WIDTH)?.src ??
    ordered.at(-1)?.src
  );
}

function selectStoreImage(image: StoreImage): string | undefined {
  return selectBestImageCandidate(parseWordPressSrcSet(image.srcset)) ?? image.src?.trim();
}

/** Normaliza imágenes alojadas en el dominio antiguo del CMS. */
function normalizeMediaOrigin(source: string): string {

  try {
    const url = new URL(source);
    if (/^(www\.)?quirozautomotriz\.cl$/i.test(url.hostname)) {
      const mediaOrigin = new URL(WP_MEDIA_ORIGIN);
      url.protocol = mediaOrigin.protocol;
      url.hostname = mediaOrigin.hostname;
      url.port = mediaOrigin.port;
    }
    return url.toString();
  } catch {
    return source;
  }
}

/** Recupera todas las imágenes que WooCommerce tiene asociadas al producto. */
async function fetchStoreGallery(slug: string): Promise<string[]> {
  try {
    const res = await fetchWordPressPath(
      (base) => `${base.replace(/\/wp\/v2\/?$/, "")}/wc/store/v1/products?slug=${encodeURIComponent(slug)}&per_page=1`,
      {},
      { attemptsPerBase: 1, timeoutMs: 6_000, safetyMs: 8_000 },
    );
    if (!res.ok) return [];
    const products = (await res.json()) as StoreProduct[];
    return (products[0]?.images ?? [])
      .map(selectStoreImage)
      .filter((src): src is string => Boolean(src))
      .map(normalizeMediaOrigin);
  } catch (err) {
    console.warn(`[WordPress] galería no disponible para ${slug}:`, err);
    return [];
  }
}

/** Carga las galerías en bloque para que catálogo, snapshot y ficha compartan datos. */
async function fetchStoreGalleryMap(): Promise<Map<string, string[]>> {
  const galleries = new Map<string, string[]>();

  try {
    const maxPages = isBuild ? BUILD_MAX_PAGES : RUNTIME_MAX_PAGES;
    for (let page = 1; page <= maxPages; page += 1) {
      const res = await fetchWordPressPath(
        (base) => `${base.replace(/\/wp\/v2\/?$/, "")}/wc/store/v1/products?per_page=${PER_PAGE}&page=${page}`,
        {},
        { attemptsPerBase: 1, timeoutMs: 8_000, safetyMs: 10_000 },
      );
      if (res.status === 400) break;
      if (!res.ok) throw new Error(`Store API ${res.status} en page ${page}`);

      const products = (await res.json()) as StoreProduct[];
      for (const product of products) {
        if (!product.slug) continue;
        galleries.set(
          product.slug,
          (product.images ?? [])
            .map(selectStoreImage)
            .filter((src): src is string => Boolean(src))
            .map(normalizeMediaOrigin),
        );
      }
      if (products.length < PER_PAGE) break;
    }
  } catch (error) {
    // La galería no debe derribar precio, ficha técnica ni disponibilidad.
    console.warn("[WordPress] galerías masivas no disponibles:", error);
  }

  return galleries;
}

function mapProductToCar(product: WpProduct, categoryNames?: string[]): Car {
  const acf = product.acf ?? {};
  // Algunos productos en el CMS tienen prefijo "Z " para ordenarlos al fondo del admin.
  // Se lo quitamos antes de parsear el título.
  const rawTitle = (product.title?.rendered ?? product.slug).replace(/^Z\s+/i, "");
  const { brand, model, variant, year } = parseTitle(rawTitle, product.slug);

  const categories = categoryNames ?? extractCategoryNames(product);
  const cat = classifyCategories(categories);
  const price = formatPrice(acf.precio);
  const cmsCategories = categories.filter(
    (name) => !/^(activo|vendid[oa]s?|inactiv[oa]s?|no disponible)$/i.test(name.trim()),
  );

  const displacement = buildDisplacement(acf.cilindrada);
  const color = acf.color?.trim() || undefined;
  const engine: EngineSpecs | undefined = displacement
    ? { displacement }
    : undefined;

  const documentation: Documentation | undefined =
    color || cat.ownerType
      ? { color, ownerType: cat.ownerType }
      : undefined;
  const videoUrls = [acf.video, acf.video_2]
    .map(normalizeVideoUrl)
    .filter((url): url is string => Boolean(url));

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
    mobileImage: acf.imagen_mobile?.trim()
      ? normalizeMediaOrigin(acf.imagen_mobile.trim())
      : undefined,
    videoUrl: videoUrls[0],
    videoUrls: videoUrls.length > 0 ? videoUrls : undefined,
    videoPoster: acf.imagen_video?.trim()
      ? normalizeMediaOrigin(acf.imagen_video.trim())
      : undefined,
    tagline: cat.bodyType ?? "Disponible ahora",
    badge: cmsCategories.some((name) => /^nuevo$/i.test(name)) ? "Nuevo" : undefined,
    description: decodeDescription(acf.descripcion ?? ""),
    cmsCategories: cmsCategories.length > 0 ? cmsCategories : undefined,
    engine,
    documentation,
  };
}

// ─── Fetch con paginación ───────────────────────────────────────────────────

type FetchPolicy = {
  attemptsPerBase?: number;
  timeoutMs?: number;
  safetyMs?: number;
};

function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  policy: FetchPolicy = {},
): Promise<Response> {
  const timeoutMs = policy.timeoutMs ?? (isBuild ? FETCH_TIMEOUT_MS : RUNTIME_FETCH_TIMEOUT_MS);
  const safetyMs = policy.safetyMs ?? (isBuild ? SAFETY_TIMEOUT_MS : RUNTIME_SAFETY_TIMEOUT_MS);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let safetyTimerId: ReturnType<typeof setTimeout>;
  const safetyTimer = new Promise<never>((_, reject) =>
    { safetyTimerId = setTimeout(() => reject(new Error(`Safety timeout after ${safetyMs}ms`)), safetyMs); }
  );
  return Promise.race([fetch(url, { ...options, signal: controller.signal }), safetyTimer]).finally(() => {
    clearTimeout(timer);
    clearTimeout(safetyTimerId);
  });
}

async function fetchWordPressPath(
  pathForBase: (base: string) => string,
  options: RequestInit = {},
  policy: FetchPolicy = {},
): Promise<Response> {
  let lastResponse: Response | undefined;
  let lastError: unknown;
  const attemptsPerBase = policy.attemptsPerBase ?? 2;

  for (const base of WP_API_CANDIDATES) {
    for (let attempt = 0; attempt < attemptsPerBase; attempt += 1) {
      try {
        const response = await fetchWithTimeout(pathForBase(base), {
          ...options,
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (compatible; QuirozNext/1.0)",
            ...(options.headers ?? {}),
          },
        }, policy);
        lastResponse = response;
        if (response.ok || response.status === 400) return response;
        if (![403, 408, 425, 429, 500, 502, 503, 504].includes(response.status)) return response;
      } catch (error) {
        lastError = error;
      }
      if (attempt + 1 < attemptsPerBase) await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError instanceof Error ? lastError : new Error("WordPress no respondió");
}

async function fetchProductsPage(page: number): Promise<WpProduct[]> {
  // Solo embed=wp:featuredmedia (imagenes). Categorias se obtienen por separado.
  // Sin orderby porque relentiza con _embed.
  const res = await fetchWordPressPath((base) => `${base}/product?per_page=${PER_PAGE}&page=${page}&_embed=wp:featuredmedia`);

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
      if (all.length === 0) throw err;
      break;
    }
  }
  return all;
}

// ─── Cache global ────────────────────────────────────────────────────────────

let _carsCache: Car[] | null = null;
let _soldCarsCache: Car[] | null = null;
let _soldCarsCacheAt = 0;
let _catMap: Map<number, string> | null = null;
const _carDetailsCache = new Map<string, Car>();

// v2 invalida fichas v1 que no incluían galerías ni categorías completas.
const vehicleRuntimeCache = getCache({ namespace: "quiroz-vehicles-v2" });

function isCar(value: unknown): value is Car {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Car>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.brand === "string" &&
    typeof candidate.model === "string" &&
    typeof candidate.image === "string"
  );
}

function isCarList(value: unknown): value is Car[] {
  return Array.isArray(value) && value.every(isCar);
}

async function rememberVehicle(car: Car): Promise<void> {
  _carDetailsCache.set(car.id, car);
  try {
    await vehicleRuntimeCache.set(`vehicle:${car.id}`, car, {
      ttl: VEHICLE_CACHE_TTL_SECONDS,
      tags: ["vehicles", `vehicle:${car.id}`],
      name: `vehicle-${car.id}`,
    });
  } catch (error) {
    console.warn(`[Vehicle cache] no se pudo guardar ${car.id}:`, error);
  }
}

async function rememberCatalog(cars: Car[]): Promise<void> {
  try {
    await vehicleRuntimeCache.set("catalog", cars, {
      ttl: VEHICLE_CACHE_TTL_SECONDS,
      tags: ["vehicles", "vehicle-catalog"],
      name: "vehicle-catalog",
    });
  } catch (error) {
    console.warn("[Vehicle cache] no se pudo guardar el catálogo:", error);
  }
}

async function getRememberedVehicle(slug: string): Promise<Car | undefined> {
  const memoryHit = _carDetailsCache.get(slug) ?? _carsCache?.find((car) => car.id === slug);
  if (memoryHit) {
    console.warn(`[Vehicle cache] respaldo en memoria para ${slug}`);
    return memoryHit;
  }

  try {
    const detail = await vehicleRuntimeCache.get(`vehicle:${slug}`);
    if (isCar(detail)) {
      _carDetailsCache.set(slug, detail);
      console.warn(`[Vehicle cache] respaldo persistente de ficha para ${slug}`);
      return detail;
    }

    const catalog = await vehicleRuntimeCache.get("catalog");
    if (isCarList(catalog)) {
      const car = catalog.find((candidate) => candidate.id === slug);
      if (car) {
        _carDetailsCache.set(slug, car);
        console.warn(`[Vehicle cache] respaldo persistente de catálogo para ${slug}`);
        return car;
      }
    }
  } catch (error) {
    console.warn(`[Vehicle cache] no se pudo leer ${slug}:`, error);
  }

  const staticCar = fallbackCars.find((car) => car.id === slug);
  if (staticCar) console.warn(`[Vehicle cache] respaldo estático para ${slug}`);
  return staticCar;
}

async function getRememberedCatalog(): Promise<Car[] | undefined> {
  if (_carsCache?.length) return _carsCache;
  try {
    const catalog = await vehicleRuntimeCache.get("catalog");
    if (isCarList(catalog) && catalog.length > 0) {
      _carsCache = sortCarsByName(catalog);
      return _carsCache;
    }
  } catch (error) {
    console.warn("[Vehicle cache] no se pudo leer el catálogo:", error);
  }
  return undefined;
}

/** Obtiene el mapa de ID→nombre de categorías de producto (cacheado). */
async function getCategoryMap(): Promise<Map<number, string>> {
  if (_catMap) return _catMap;
  try {
    const res = await fetchWordPressPath((base) => `${base}/product_cat?per_page=100`);
    if (!res.ok) throw new Error(`Categories API ${res.status}`);
    const cats = (await res.json()) as Array<{ id: number; name: string }>;
    _catMap = new Map(cats.map((c) => [c.id, c.name]));
    console.log(`[WordPress] getCategoryMap → ${_catMap.size} categorías`);
    return _catMap;
  } catch (err) {
    console.error("[WordPress] getCategoryMap falló:", err);
    // No memorizar el fallo: la siguiente carga debe volver a consultar el CMS.
    return new Map();
  }
}

// ─── API pública ────────────────────────────────────────────────────────────

/**
 * Todos los autos disponibles, ordenados del más reciente al más antiguo.
 * Excluye los marcados como vendidos. Si WordPress falla, usa datos estáticos.
 */
/** Obtiene autos desde WordPress (función extraída para reutilizar en build y runtime). */
/** Ordena el catálogo por marca, modelo y año. */
function sortCarsByName(list: Car[]): Car[] {
  return [...list].sort((a, b) => {
    const byName = `${a.brand} ${a.model}`.localeCompare(
      `${b.brand} ${b.model}`,
      "es",
      { sensitivity: "base" },
    );
    return byName !== 0 ? byName : a.year - b.year;
  });
}

async function getCarsFromWP(): Promise<Car[]> {
  const [products, catMap, galleryMap] = await Promise.all([
    fetchAllProducts(),
    getCategoryMap(),
    fetchStoreGalleryMap(),
  ]);
  if (catMap.size === 0) {
    throw new Error("WP no devolvió categorías; se conserva el último catálogo completo");
  }
  const cars = products
    .map((product) => {
      const liveCategories = extractCategoryNames(product, catMap);
      const fallback = fallbackCars.find((car) => car.id === product.slug);
      const categories = liveCategories.length > 0
        ? liveCategories
        : (fallback?.cmsCategories ?? []);
      return { product, categories, cat: classifyCategories(categories) };
    })
    .filter(({ cat, product }) => !isSoldProduct(product, cat))
    .map(({ product, categories }) => {
      const car = mapProductToCar(product, categories);
      const fallback = fallbackCars.find((candidate) => candidate.id === product.slug);
      const liveGallery = galleryMap.get(product.slug) ?? [];
      const gallery = liveGallery.length > 0
        ? liveGallery
        : (fallback?.gallery ?? []);
      return {
        ...car,
        gallery: Array.from(
          new Set([car.image, ...gallery]),
        ),
      };
    });
  if (cars.length === 0) throw new Error("WP devolvió 0 autos disponibles");
  return sortCarsByName(cars);
}

/** Uso de mantenimiento: exige datos vivos del CMS y nunca acepta fallback. */
export async function fetchCarsForSnapshot(): Promise<Car[]> {
  return getCarsFromWP();
}

export async function fetchCars(): Promise<Car[]> {
  // Solo devuelve cache si tiene datos reales (no fallback)
  if (_carsCache) return _carsCache;

  // Build: intenta WP con timeout corto, fallback si no responde a tiempo
  if (isBuild) {
    console.log("[WordPress] Build — intentando WP...");
    try {
      const cars = await getCarsFromWP();
      _carsCache = cars;
      await rememberCatalog(cars);
      console.log(`[WordPress] Build → ${cars.length} autos desde WP`);
      return cars;
    } catch (err) {
      const remembered = await getRememberedCatalog();
      console.log(
        `[WordPress] Build → WP no disponible, usando ${remembered ? "último catálogo válido" : "datos estáticos"}`,
      );
      return remembered ?? sortCarsByName(fallbackCars);
    }
  }

  // Runtime: siempre intenta WP
  try {
    const cars = await getCarsFromWP();
    // Solo cachear éxitos
    _carsCache = cars;
    await rememberCatalog(cars);
    console.log(`[WordPress] fetchCars → ${cars.length} autos disponibles`);
    return cars;
  } catch (err) {
    console.error("[WordPress] fetchCars falló — buscando último catálogo válido:", err);
    const remembered = await getRememberedCatalog();
    // NO cachear el fallback estático — el próximo request reintentará WP.
    return remembered ?? sortCarsByName(fallbackCars);
  }
}

/**
 * Un auto por su slug. Si WordPress falla, usa datos estáticos.
 */
export async function fetchCarBySlug(slug: string): Promise<Car | undefined> {
  try {
    const res = await fetchWordPressPath(
      (base) => `${base}/product?slug=${encodeURIComponent(slug)}&_embed`,
      {},
      { attemptsPerBase: 1, timeoutMs: 8_000, safetyMs: 10_000 },
    );
    if (!res.ok) throw new Error(`WordPress API ${res.status} para slug ${slug}`);

    const products = (await res.json()) as WpProduct[];
    if (!products.length) {
      return getRememberedVehicle(slug);
    }
    const product = products[0];
    const categories = extractCategoryNames(product);
    const fallback = fallbackCars.find((candidate) => candidate.id === slug);
    const car = mapProductToCar(
      product,
      categories.length > 0 ? categories : fallback?.cmsCategories,
    );
    const gallery = await fetchStoreGallery(slug);
    const completeCar = {
      ...car,
      gallery: Array.from(
        new Set([car.image, ...(gallery.length > 0 ? gallery : (fallback?.gallery ?? []))]),
      ),
    };
    await rememberVehicle(completeCar);
    return completeCar;
  } catch (err) {
    console.error(
      `[WordPress] fetchCarBySlug("${slug}") falló — usando último dato válido:`,
      err
    );
    const remembered = await getRememberedVehicle(slug);
    if (remembered) return remembered;

    // Un error de red/WAF no demuestra que el vehículo no exista. Lanzar el
    // error permite que la ruta muestre su estado recuperable en vez de
    // convertir una caída temporal de WordPress en un 404 incorrecto.
    throw new Error(`Vehículo temporalmente no disponible: ${slug}`, { cause: err });
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
  if (_soldCarsCache && Date.now() - _soldCarsCacheAt < REVALIDATE_SECONDS * 1000) {
    return _soldCarsCache;
  }

  // Build: intenta WP, fallback a array vacío
  if (isBuild) {
    console.log("[WordPress] Build — intentando fetchSoldCars...");
    try {
      const [products, catMap] = await Promise.all([
        fetchAllProducts(),
        getCategoryMap(),
      ]);
      const sold = products
        .map((product) => {
          const categories = extractCategoryNames(product, catMap);
          return { product, categories, cat: classifyCategories(categories) };
        })
        .filter(({ cat, product }) => isSoldProduct(product, cat))
        .map(({ product, categories }) => mapProductToCar(product, categories));
      console.log(`[WordPress] Build → ${sold.length} vendidos desde WP`);
      return sold;
    } catch (err) {
      console.log("[WordPress] Build → WP no disponible para vendidos");
      return [];
    }
  }

  try {
    const [products, catMap] = await Promise.all([
      fetchAllProducts(),
      getCategoryMap(),
    ]);
    const sold = products
      .map((product) => {
        const categories = extractCategoryNames(product, catMap);
        return { product, categories, cat: classifyCategories(categories) };
      })
      .filter(({ cat, product }) => isSoldProduct(product, cat))
      .map(({ product, categories }) => mapProductToCar(product, categories));
    _soldCarsCache = sold;
    _soldCarsCacheAt = Date.now();
    console.log(`[WordPress] fetchSoldCars → ${sold.length} vendidos`);
    return sold;
  } catch (err) {
    console.error("[WordPress] fetchSoldCars falló:", err);
    return [];
  }
}
