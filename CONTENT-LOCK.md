# CONTENT-LOCK — Página Principal

> **Instrucción permanente:** el contenido textual de esta página NO debe modificarse.
> Ninguna adición de diseño, animación, ni componente nuevo debe alterar, mover,
> reemplazar ni eliminar estas líneas. Cambios de estilo (colores, tipografía, botones)
> son independientes del contenido. Los labels de botones que cambian capitalización
> (p.ej. "AGENDAR VISITA" → "Agendar visita") son parte del rediseño de botones, no
> son cambios de contenido.

---

## Sección Hero (`components/Hero.tsx`)

```
Overline:
  "Quiroz Redcar · Concón · Valparaíso"

Eyebrow sobre el heading:
  "Una colección"

Heading principal:
  "EXCEPCIONAL"

Tagline / cuerpo:
  "Más de 20 años seleccionando vehículos con asesoría
   personalizada, financiamiento y despacho a todo Chile."

Contador dinámico (no bloquear — viene del CMS):
  "{totalCars} vehículos en catálogo"

Scroll hint:
  "Desliza para explorar"
```

---

## Sección Catálogo (CarShowcase — dinámico desde WordPress REST API)

Los datos de cada vehículo provienen de `quirozautomotriz.cl/wp-json/wp/v2/product`.
**No hay texto fijo a bloquear aquí** — todo cambia con el inventario.

Campos que se renderizan por vehículo:
- `brand`, `model`, `variant`, `year` — del título del post WP
- `tagline` — generado en `lib/cars.ts`
- `price` — campo ACF `precio`
- `km` — campo ACF `kilometraje`
- `fuel`, `transmission`, `power`, `drivetrain`, `bodyType` — campos ACF
- `description` — del extracto del post WP
- `badge` — campo ACF `badge` (opcional)

Labels de UI (no son "contenido", son etiquetas del sistema):
- "Precio", "Año", "Kilometraje", "Combustible", "Transmisión", "Potencia", "Tracción", "Carrocería"
- "Ver vehículo", "Consultar disponibilidad", "Siguiente vehículo", "Ir a contacto", "Ver vehículo completo"

---

## Sección Contacto (`components/Contact.tsx`)

```
Overline:
  "Visítanos"

Subheading:
  "¿Listo para"

Heading principal:
  "TU PRÓXIMO VEHÍCULO?"

Cuerpo:
  "Agenda una visita personalizada o conversa con nuestros asesores.
   Más de 20 años de experiencia."

Tarjetas de contacto:
  - label: "WhatsApp"   | value: "+56 9 5906 5441"
  - label: "Teléfono"   | value: "+56 9 9343 1571"
  - label: "Ubicación"  | value: "Valparaíso · Concón"

Mensaje pre-cargado WhatsApp:
  "Hola, me gustaría agendar una visita o recibir más información del catálogo."

Sucursales:
  - "Av. Bosques de Montemar #65"
  - "Edificio OFC, oficina 203, Concón"
  - "Hontaneda 2615"
  - "Valparaíso"

Síguenos:
  - "@quirozautomotrizspa"   (Instagram — handle oficial)
  - "@quiroz.automotriz"     (TikTok)
  - "Quiroz Automotriz"      (YouTube)

Servicios:
  - "Compra y venta"
  - "Consignación"
  - "Financiamiento"
  - "Seguros automotrices"
  - "Despacho a todo Chile"
  - "Gestión de TAG"

Footer:
  - "QUIROZ REDCAR · DESDE 2004"
  - "© 2026 · Todos los derechos reservados"
```

---

## Datos factuales verificados (auditoría 2026-06-09)

Fuente de verdad: quirozautomotriz.cl (sitio original en producción).

| Dato | Valor correcto |
|------|----------------|
| Años de experiencia | **Más de 20 años** (fundado en 2004) |
| Teléfono principal | +56 9 5906 5441 |
| Teléfono secundario | +56 9 9343 1571 |
| Sucursal 1 | Av. Bosques de Montemar #65, Edif. OFC, of. 203, Concón |
| Sucursal 2 | Hontaneda 2615, Valparaíso |
| Instagram | @quirozautomotrizspa |
| TikTok | @quiroz.automotriz |
| Año de fundación | 2004 |

> La dirección "Av. Pedro Aguirre Cerda 7744, San Miguel" fue removida del sitio —
> no aparece en el sitio original y no corresponde a ninguna sucursal verificada.

---

*Última extracción: 2026-06-09 a partir de Hero.tsx, Contact.tsx y auditoría contra quirozautomotriz.cl.*
