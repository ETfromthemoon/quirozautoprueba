# Quiroz Redcar — AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know
Next.js 16 has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands
- `npm run dev` — Turbopack dev server (http://localhost:3000)
- `npm run typecheck` (or `npm run lint`) — `tsc --noEmit` only
- `npm run build` — production build
- No test runner is configured.

## Architecture
- **Headless WordPress**: Vehicle catalog reads from `https://quirozautomotriz.cl/wp-json/wp/v2/product` (WooCommerce). Falls back to static data in `lib/cars.ts` if WP is unreachable.
- **ISR**: Homepage revalidates every 60s. Vehicle detail pages use `generateStaticParams` + ISR (60s). Form pages are fully static.
- **No database or API backend** except `/api/send-email` (SMTP via nodemailer).

## Data model
- `Car` type defined in `lib/cars.ts` — fields: id, brand, model, variant, year, price, km, fuel, transmission, bodyType, image, description, etc.
- Vehicle data flows: WordPress REST → `lib/wordpress.ts` `mapProductToCar()` → `Car` type.
- Add/edit vehicles via WordPress admin (WooCommerce + ACF fields). Do NOT edit `lib/cars.ts` unless WP is down.

## Forms & Email
- All forms (`/financiamiento`, `/seguros`, `/reserva`, `/vender-consignar`, `/formulario-vehiculos`) submit via `POST /api/send-email` using SMTP (nodemailer).
- Email destinations by form type in `lib/email.ts`: `DESTINOS` object.
- WhatsApp auto-implementation is explicitly excluded per client instruction.

## Styling
- **Tailwind CSS v4** with `@import "tailwindcss"` syntax (no `tailwind.config.js`).
- Design tokens in `app/globals.css`: `--color-ink-*` (neutrals), `--color-accent-*` (red), `--color-silver-*` (metallic).
- Use `@/*` path alias for imports (e.g. `@/components/Navbar`).
- Glassmorphism utility classes: `.glass-panel`, `.glass-light`, `.glass-dark`.
- Button system: `.btn-base` + `.btn-primary` / `.btn-silver` / `.btn-secondary` / `.btn-ghost`.

## Pages & Routes
| Route | Type | Description |
|---|---|---|
| `/` | ISR (60s) | Homepage — full-screen scroll-snap catalog |
| `/vehiculo/[id]` | SSG + ISR | Vehicle detail with tech sheet, gallery, service banners |
| `/nosotros` | Static | About page |
| `/financiamiento` | Static | Financing info + form |
| `/seguros` | Static | Insurance quote form |
| `/reserva` | Static | Car reservation form |
| `/vender-consignar` | Static | Sell/consign tabs with forms |
| `/formulario-vehiculos` | Static | Public buy/consign form |

## Environment
- `WORDPRESS_API_URL` — default: `https://www.quirozautomotriz.cl/wp-json/wp/v2`
- `NEXT_PUBLIC_SITE_URL` — default: `http://localhost:3000`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — SMTP credentials for form email sending (nodemailer)
- `TURNSTILE_SECRET_KEY` — optional, Cloudflare Turnstile for form spam protection
- `.env*` files are gitignored. Configure in Vercel dashboard.

## Deployment
- **Platform**: Vercel, region `gru1` (São Paulo).
- No CMS or backend deployment needed — just push to `main`.
- After deploy, verify SMTP env vars in Vercel dashboard.

## Image sources
- `next.config.ts` allows remote images from: unsplash.com, pexels.com, i.ytimg.com, quirozautomotriz.cl.
- Product images come from WordPress (WooCommerce featured media).

---

## Progress & Launch Status (2026-06-23) — FINAL: LIVE & WORKING

### Content population (from old site quirozautomotriz.cl)
| Page | Status | Source |
|---|---|---|
| `/nosotros` | Done | Historia Marco Quiroz, modelo innovador, misión/visión exacta, servicios, direcciones |
| `/financiamiento` | Done | Hero text real: "Conseguimos financiamiento para ti" |
| `/vender-consignar` | Done | Hero + proceso real 4 pasos (visita, fotos/video, publicar RRSS, pago antes de entregar) |
| `Hero.tsx` (home) | Done | Tagline real: "Quiroz Automotriz Spa · Llevamos más de 20 años..." |
| `/seguros` | Done | New page, no old equivalent |
| `/reserva` | Done | New page, no old equivalent |
| `/vendidos` | Done | Dynamic from WP via ISR |
| `/formulario-vehiculos` | Done | New page, no old equivalent |

### WordPress fetch fix (critical — 3 bugs resolved)
1. **`_embed` con 100 productos tomaba >30s** → Fix: usar `_embed=wp:featuredmedia` solo (5.3s) + categorías por `/wp-json/wp/v2/product_cat` separado (1.4s). Total: 6.7s.
2. **`_carsCache` cacheaba el fallback estático** → Warm serverless nunca reintentaba WP. Fix: cache solo guarda éxitos, fallos no se cachean.
3. **`next: { revalidate }` en fetch cacheaba fallos** → Fix: removido del fetch, ISR solo a nivel página.
4. User-Agent custom `QuirozNext/1.0` → cambiado a `Mozilla/5.0 (compatible; QuirozNext/1.0)`.

### Architecture (final)
- Build: detecta `NEXT_PHASE=phase-production-build` → datos estáticos (1.8s build)
- Runtime/ISR: fetch WP con `_embed=wp:featuredmedia` + `getCategoryMap()` en paralelo (~7s)
- Fallback: si WP no responde → staticCars, reintenta en el próximo request (no cachea fallos)
- Diagnóstico: `/api/wp-debug` muestra conectividad WP en vivo

### Vercel env vars (no cambiar lo que funciona)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` — formularios
- `NEXT_PUBLIC_SITE_URL` — recomendada
- **NO** `SKIP_WP`, `FORCE_STATIC`, `TURNSTILE_SECRET_KEY`
