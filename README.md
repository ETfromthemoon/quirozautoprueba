# Quiroz Redcar — Catálogo Premium

Landing inmersiva para Quiroz Automotriz Spa (Valparaíso, Chile). Catálogo dinámico desde WordPress (WooCommerce + ACF) con scroll-snap fullscreen, páginas de detalle, formularios con email SMTP y fichas técnicas completas.

**Stack**: Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · Syne + Inter · nodemailer

**Live (Vercel)**: https://quirozautoprueba.vercel.app  
**Dominio**: quirozautomotriz.cl (apunta a WordPress legacy)

---

## Desarrollo local

```bash
npm install
cp .env.example .env.local
# Edita .env.local si necesitas overrides (SMTP para forms)
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Turbopack) |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run lint` / `npm run typecheck` | `tsc --noEmit` |

---

## Arquitectura

- **Headless WordPress**: Catálogo desde `quirozautomotriz.cl/wp-json/wp/v2/product` (WooCommerce + ACF). Fallback a datos estáticos en `lib/cars.ts` si WP no responde.
- **ISR**: Homepage y vendidos revalidan cada 60s. Detalle de vehículo usa `generateStaticParams` + ISR (60s). Páginas de formularios son estáticas.
- **Email**: Formularios envían vía SMTP (nodemailer) a través de `POST /api/send-email`. Sin base de datos.

---

## Deploy en Vercel

### Opción A — Dashboard (recomendado)

1. Sube el repo a GitHub (actual: `ETfromthemoon/quirozautoprueba`).
2. Entra a [vercel.com/new](https://vercel.com/new) e importa el repositorio.
3. Vercel detecta automáticamente Next.js.
4. En **Settings → Environment Variables** agrega:
   - `NEXT_PUBLIC_SITE_URL` = `https://quirozautomotriz.cl`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `TURNSTILE_SECRET_KEY` (opcional)
5. Click **Deploy**.

### Opción B — Vía Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add SMTP_HOST production
vercel --prod
```

### Dominio personalizado

En **Settings → Domains** agrega `quirozautomotriz.cl`. DNS: A `76.76.21.21` o CNAME a `cname.vercel-dns.com`.

---

## Estructura

```
app/
  layout.tsx                     # Fonts (Syne + Inter), metadata, OG, JSON-LD
  page.tsx                       # Homepage (ISR 60s) — scroll-snap catalog
  globals.css                    # Design system (paleta, glassmorphism, animaciones)
  not-found.tsx                  # Custom 404
  sitemap.ts                     # Sitemap dinámico con imágenes
  robots.ts                      # robots.txt
  manifest.ts                    # PWA manifest
  icon.svg / apple-icon.tsx      # Iconos
  opengraph-image.tsx            # OG image por defecto
  nosotros/page.tsx              # About page
  vendidos/page.tsx              # Sold vehicles (ISR 60s)
  financiamiento/page.tsx        # Financing form
  seguros/page.tsx               # Insurance form
  reserva/page.tsx               # Reservation form
  vender-consignar/page.tsx      # Sell/consign tabs
  formulario-vehiculos/page.tsx  # Public vehicle form
  vehiculo/[id]/page.tsx         # Vehicle detail (SSG + ISR 60s)
  vehiculo/[id]/opengraph-image.tsx  # Per-vehicle OG image
  api/send-email/route.ts        # SMTP email endpoint

components/
  Navbar.tsx                     # Homepage navbar (scroll-snap + progress dots)
  InnerNavbar.tsx                # Inner pages navbar
  InnerFooter.tsx                # Footer (todas las páginas)
  Hero.tsx                       # Intro cinemática (Ken Burns + partículas)
  CarShowcase.tsx                # Scroll-snap por auto + pill mobile + modal
  Contact.tsx                    # CTA + datos sucursales + RRSS
  ContactForm.tsx                # Inline contact form
  FloatingWhatsApp.tsx           # FAB WhatsApp
  Logo.tsx                       # SVG Q + QUIROZ REDCAR (3 variantes)
  VehicleDetail.tsx              # Layout completo ficha técnica
  VehicleGallery.tsx             # Image gallery with thumbnails
  VideoEmbed.tsx                 # YouTube embed + fallback Ken Burns
  icons.tsx                      # SVG icon library (14 icons)

lib/
  cars.ts                        # Data model (Car, EngineSpecs, Documentation) + fallback
  wordpress.ts                   # WordPress REST API integration (fetchCars, fetchCarBySlug, etc.)
  email.ts                       # SMTP email sending (nodemailer) + HTML templates
  whatsapp.ts                    # WhatsApp URL builder + formatPriceShort

vercel.json                      # Headers de seguridad + cache + redirects
```

---

## Editar el catálogo

Los vehículos se administran desde **WordPress admin** (WooCommerce + ACF). El sitio los consume vía REST API. No editar `lib/cars.ts` a menos que WP esté caído.

Campos ACF disponibles: precio, kilometraje, combustible, cilindrada, transmisión, color, descripción, video YouTube.

---

## Configuración Vercel — Notas

- **Region**: `gru1` (São Paulo, Brasil)
- **Image optimization**: AVIF + WebP vía `next/image`
- **Cache**: assets estáticos 1 año, immutable
- **Headers**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **Redirects**: `/home`, `/catalogo`, `/disponibles` → `/`

---

## Contactos del negocio

- WhatsApp: +56 9 5906 5441
- Teléfono: +56 9 9343 1571
- Sucursales:
  - Av. Bosques de Montemar #65, oficina 203, Concón
  - Hontaneda 2615, Valparaíso
- Instagram: [@quirozautomotrizspa](https://instagram.com/quirozautomotrizspa)
- TikTok: [@quiroz.automotriz](https://tiktok.com/@quiroz.automotriz)
- YouTube: [Quiroz Automotriz](https://youtube.com/channel/UC11dE4tkZPT358WO5RLHtcg)
