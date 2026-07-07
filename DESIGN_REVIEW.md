# Design Review: Jerarquía de títulos — Landing page (Home)

Reviewed against: sin `DESIGN_BRIEF.md` explícito. Dirección estética inferida del código (AGENTS.md + globals.css): "Premium Automotriz" — dark luxury, tipografía Syne (display) + Inter (body), acento rojo, glassmorphism, catálogo full-screen scroll-snap.
Alcance: `app/page.tsx` → `Hero.tsx`, `CarShowcase.tsx` (×66 autos), `Contact.tsx`.
Fecha: 2026-07-07

## Screenshots Capturados

**No se pudieron capturar screenshots pixel.** La herramienta de captura hizo timeout de forma consistente (30s) incluso tras confirmar `document.readyState === "complete"`, sin errores de consola ni de red, y tras desactivar animaciones/transiciones vía inyección de CSS. Es probable que el filtro SVG `feTurbulence` del `.grain-overlay` (recalculado cada frame) o el `backdrop-filter: blur()` continuo estén bloqueando el renderer headless.

En su lugar, la revisión se basa en:
- Inspección del **árbol de accesibilidad** completo (`preview_snapshot`) en desktop (1280px, breakpoint por defecto `md:flex`).
- Inspección de **todos los elementos `h1/h2/h3` del DOM real**, con verificación de renderizado efectivo (`offsetWidth/offsetHeight`, no solo `display` del propio nodo) en **desktop (1280px)** y **mobile (375px)**.
- Inspección de estilos computados del modal mobile (`role="dialog"`) para verificar si queda expuesto a lectores de pantalla en estado cerrado.
- Lectura de código fuente: [Hero.tsx](components/Hero.tsx), [CarShowcase.tsx](components/CarShowcase.tsx), [Contact.tsx](components/Contact.tsx).

## Summary

La jerarquía tiene un solo `<h1>` bien ubicado y un cierre correcto con `<h2>` en Contacto, pero el catálogo de 66 autos duplica el título de cada vehículo en dos nodos DOM distintos (`<h2>` para desktop, `<h3>` para el modal mobile) intercambiados por CSS responsive. El resultado, verificado en vivo: **en mobile la jerarquía salta de H1 directo a H3, sin H2 alguno, 66 veces**, y además ese H3 pertenece a un modal "cerrado" que sigue expuesto al árbol de accesibilidad porque solo se oculta con `opacity:0` + posición fuera de pantalla, no con `display:none` ni `aria-hidden`. Es el hallazgo más importante: no es un problema visual, es estructural y se repite en cada uno de los 66 autos.

## Must Fix

1. **Salto de nivel H1→H3 en mobile (66 veces)**: en desktop, cada auto usa `<h2>` ([CarShowcase.tsx:160](components/CarShowcase.tsx#L160)), oculto en mobile vía `hidden md:flex`. En mobile, el único título visible/expuesto de cada auto es el `<h3>` del modal ([CarShowcase.tsx:374](components/CarShowcase.tsx#L374)), sin ningún `<h2>` intermedio expuesto. Verificado con `offsetWidth/offsetHeight` en viewport 375px: el `<h2>` no se renderiza, el `<h3>` sí. Un usuario de lector de pantalla en mobile navega H1 → H3 → H3 → H3... (×66), sin nunca pasar por H2.
   _Fix: usar un único elemento de título por auto (no duplicar en dos nodos según breakpoint) y fijar su nivel de forma consistente entre mobile y desktop — idealmente `<h3>` bajo un `<h2>` de catálogo (ver punto 6)._

2. **El modal mobile "cerrado" no se oculta de la accesibilidad**: el `<div role="dialog" aria-modal="true">` ([CarShowcase.tsx:339-349](components/CarShowcase.tsx#L339-L349)) solo cambia `bottom: -100%`, `opacity: 0` y `pointerEvents: none` cuando está cerrado — nunca `display: none`, `aria-hidden="true"` ni `inert`. Verificado con estilos computados: `display: "block"`, `visibility: "visible"`, sin `aria-hidden`. Esto significa que el `<h3>` del auto y todo el contenido del modal (specs, CTAs, botón "Cerrar detalles" con `tabIndex: 0`) permanecen en el árbol de accesibilidad y en el orden de tabulación aunque el modal esté visualmente fuera de pantalla, para los 66 autos simultáneamente.
   _Fix: añadir `aria-hidden={!isExpanded}` (o el atributo `inert`) al contenedor del modal cuando `isExpanded === false`, y considerar `display: none` en vez de solo desplazamiento + opacidad para el estado cerrado._

3. **El único `<h1>` de la página mezcla dos mensajes distintos en un solo nodo de texto**: [Hero.tsx:79-84](components/Hero.tsx#L79-L84) concatena el overline "Llevamos más de 20 años en el rubro automotriz" (que visualmente es una etiqueta pequeña secundaria) con el titular real "SEGURIDAD Y EFICACIA" dentro del mismo `<h1>`, sin separación semántica. El nombre accesible resultante, confirmado en el árbol de accesibilidad, es una sola cadena de ~70 caracteres: `"LLEVAMOS MÁS DE 20 AÑOS EN EL RUBRO AUTOMOTRIZ SEGURIDAD Y EFICACIA"`. El único H1 de la página gasta su peso semántico en una frase de contexto en vez de en el titular de marca.
   _Fix: sacar el overline del `<h1>` (dejarlo como el `<p className="text-overline">` que ya usa el resto del sitio, ver línea 72 del mismo archivo) y que el `<h1>` contenga solo "SEGURIDAD Y EFICACIA"._

## Should Fix

4. **Etiquetas de sección sin semántica de encabezado**: "Sucursales", "Síguenos" y "Servicios" en el footer de contacto ([Contact.tsx:127](components/Contact.tsx#L127), [:141](components/Contact.tsx#L141), [:156](components/Contact.tsx#L156)) están estilizadas exactamente como un encabezado de sub-sección (`.text-overline`, color de acento, mayúsculas, letter-spacing) pero son `<p>`. Un usuario vidente percibe tres bloques temáticos claros; un usuario de lector de pantalla navegando por encabezados no los detecta como tal.
   _Fix: promover esos tres a `<h3>` (o `<h4>` si se agrega el `<h2>` de catálogo del punto 6), manteniendo la clase `.text-overline` para el estilo visual — el cambio es solo de tag, no de diseño._

5. **66 `<h2>` de igual peso en una sola página sin agrupador**: cada auto es hoy un `<h2>` de primer nivel directamente bajo el `<h1>`. Es válido en HTML, pero para navegación por encabezados en un lector de pantalla es una lista plana de 66 ítems indistinguibles del titular de home. Ver punto 6 para una jerarquía más clara que resuelve esto y el punto 1 al mismo tiempo.

## Could Improve

6. **Agregar un `<h2>` visualmente oculto para el catálogo**: por ejemplo `<h2 className="sr-only">Catálogo de {totalCars} vehículos disponibles</h2>` antes del `.map` de autos en [page.tsx](app/page.tsx). Esto da una jerarquía limpia y consistente entre breakpoints: `H1` → `H2 "Catálogo"` → `H3` ×66 (uno por auto, unificado desktop/mobile) → `H2 "¿Listo para tu próximo vehículo?"`. Resuelve de raíz los puntos 1 y 5 sin tocar el diseño visual actual.

## What Works Well

- Un solo `<h1>` en toda la home, correctamente en el Hero — no hay `<h1>` duplicados ni ausentes.
- El cierre de la página con `Contact.tsx:55` usa un único `<h2>` limpio, sin encabezados huérfanos después.
- El patrón desktop de `<h2>` por auto ([CarShowcase.tsx:160](components/CarShowcase.tsx#L160)) agrupa marca + modelo en un solo nodo semántico y está bien emparejado con el `aria-label` de la `<section>` — buen patrón, solo falta unificarlo con mobile.
- Escala tipográfica deliberada (Syne display / Inter body / `.text-overline`), sin tamaños arbitrarios — el problema no es de diseño visual sino de mapeo a etiquetas semánticas.
