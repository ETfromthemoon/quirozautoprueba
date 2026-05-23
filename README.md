# Quiroz Redcar — Catálogo Premium

Landing inmersiva para Quiroz Automotriz Spa (Valparaíso, Chile). Catálogo de 8 vehículos premium con scroll-snap fullscreen, página de detalle por vehículo, video YouTube embed y ficha técnica completa.

**Stack**: Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · Syne + Inter

---

## Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno (opcional para dev)
cp .env.example .env.local
# Edita .env.local si necesitas overrides

# 3. Servidor de desarrollo
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
| `npm run lint` | Lint del proyecto |

---

## Deploy en Vercel

### Opción A — Desde el dashboard (recomendado)

1. Sube el repo a GitHub/GitLab/Bitbucket.
2. Entra a [vercel.com/new](https://vercel.com/new) e importa el repositorio.
3. Vercel detecta automáticamente Next.js — solo confirma.
4. En **Settings → Environment Variables** agrega:
   - `NEXT_PUBLIC_SITE_URL` = `https://quirozautomotriz.cl`
5. Click **Deploy**.

Vercel se encarga de:
- Build + cache automático
- Image optimization (vía `next/image`)
- Edge functions / SSR
- HTTPS y CDN global
- Deploy preview por cada commit

### Opción B — Vía Vercel CLI

```bash
# Instalar CLI
npm i -g vercel

# Login + link al proyecto
vercel login
vercel link

# Configurar env var
vercel env add NEXT_PUBLIC_SITE_URL production
# Pega: https://quirozautomotriz.cl

# Deploy preview
vercel

# Deploy a producción
vercel --prod
```

### Dominio personalizado

En **Settings → Domains** agrega `quirozautomotriz.cl`. Vercel te dará los registros DNS para configurar en tu proveedor (A: `76.76.21.21` o CNAME a `cname.vercel-dns.com`).

---

## Estructura

```
app/
  layout.tsx                # Fonts (Syne + Inter), metadata, OG
  page.tsx                  # Catálogo (Hero + 8 cars + Contact)
  globals.css               # Design system (paleta, glassmorphism, animaciones)
  vehiculo/[id]/page.tsx    # Página detalle por vehículo (SSG)

components/
  Navbar.tsx                # Pill flotante con progress dots
  Hero.tsx                  # Intro cinemática (Ken Burns + partículas)
  CarShowcase.tsx           # Scroll-snap por auto + pill mobile + modal
  Contact.tsx               # CTA + datos sucursales + RRSS
  FloatingWhatsApp.tsx      # FAB WhatsApp
  Logo.tsx                  # SVG Q + QUIROZ REDCAR (3 variantes)
  VehicleDetail.tsx         # Layout completo ficha técnica
  VideoEmbed.tsx            # YouTube embed + fallback Ken Burns

lib/
  cars.ts                   # Catálogo + types (Car, EngineSpecs, Documentation)
  whatsapp.ts               # WhatsApp URL builder + formatPriceShort

vercel.json                 # Headers de seguridad + cache + redirects
```

---

## Editar el catálogo

Todo el catálogo vive en [`lib/cars.ts`](./lib/cars.ts).

Para **agregar un auto**:

```ts
{
  id: "marca-modelo-año",       // slug único, será la URL
  brand: "Toyota",
  model: "RAV4",
  variant: "Hybrid XLE",
  year: 2024,
  price: "$28.980.000",
  priceNumeric: 28980000,
  km: "12.500",
  fuel: "Híbrido",
  transmission: "Automático",
  drivetrain: "AWD",
  power: "219 HP",
  bodyType: "SUV",
  image: "https://images.unsplash.com/photo-XXX?w=2400&q=90",
  videoUrl: "https://youtu.be/XXX",      // opcional
  tagline: "Eficiencia que inspira",
  badge: "Nuevo",                         // opcional
  description: "...",
  engine: { displacement: "2.5L", cylinders: 4, ... },
  equipment: ["AC", "Pantalla 8\"", ...],
  documentation: { ownerType: "Único dueño", color: "Plata", doors: 5, seats: 5 }
}
```

URL automática: `/vehiculo/marca-modelo-año`. Se pre-renderiza en build (SSG).

---

## Configuración Vercel — Notas

- **Region**: `gru1` (São Paulo, Brasil — más cercano a Chile)
- **Image optimization**: habilitado vía `next/image` con AVIF + WebP
- **Cache**: assets estáticos 1 año, immutable
- **Headers de seguridad**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- **Redirects legacy**: `/home` y `/catalogo` redirigen a `/`

---

## Contactos del negocio

- WhatsApp: +56 9 5906 5441
- Teléfono: +56 9 9343 1571
- Sucursales:
  - Av. Bosques de Montemar #65, oficina 203, Concón
  - Hontaneda 2615, Valparaíso
- Instagram: [@quirozautomotrizspa](https://instagram.com/quirozautomotrizspa)
- TikTok: [@quiroz.automotriz](https://tiktok.com/@quiroz.automotriz)
