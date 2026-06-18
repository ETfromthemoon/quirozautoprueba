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
