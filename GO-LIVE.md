# 🚀 Quiroz Automotriz — Runbook de Lanzamiento a Producción

> **Propósito:** Esta es la guía paso a paso para migrar `quirozautomotriz.cl` del WordPress legacy al nuevo Next.js desplegado en Vercel, sin perder el acceso a la base de datos de vehículos (WordPress API).

**Fecha del documento:** 2026-06-26  
**Branch de producción:** `main`  
**Último commit:** `9c8bf40` — feat: rebrand SEO to Quiroz Automotriz + add /disponibles route  
**Preview URL:** https://quirozautoprueba.vercel.app  

---

## 📊 Estado Actual

| Componente | Estado |
|---|---|
| Código Next.js 16 | ✅ Listo (`main`, typecheck pasa) |
| Build de producción | ✅ Pasa sin errores |
| 8 páginas | ✅ Todas construidas con contenido real |
| WordPress API | ✅ Funcionando (~6.7s fetch, ISR cada 60s) |
| Formularios SMTP | ⚠️ Código listo, credenciales pendientes en Vercel |
| SEO | ✅ Sitemap, robots, OG images, JSON-LD, metadata |
| Seguridad | ✅ Headers (X-Content-Type, X-Frame, Referrer-Policy, Permissions-Policy) |
| Vercel preview | ✅ https://quirozautoprueba.vercel.app |
| Dominio `quirozautomotriz.cl` | ❌ Apunta a WordPress legacy (Hostinger) |
| WordPress accesible post-lanzamiento | ❌ Se necesita subdominio para la API |

---

## 🎯 Objetivo del Lanzamiento

```
ANTES:  quirozautomotriz.cl  →  WordPress (Hostinger)  [frontend + backend juntos]

DESPUÉS: quirozautomotriz.cl     →  Vercel (Next.js)       [frontend rápido]
         admin.quirozautomotriz.cl →  WordPress (Hostinger)  [API de vehículos]
```

---

## 🗺️ Arquitectura Final

```
                    ┌──────────────────────────┐
  Cliente ────────► │  Vercel (gru1, São Paulo) │
                    │  Next.js 16 + ISR         │
                    └──────────┬───────────────┘
                               │ fetch cada 60s
                               ▼
                    ┌──────────────────────────┐
                    │  admin.quirozautomotriz.cl │
                    │  WordPress + WooCommerce   │
                    │  (Hostinger, mismo server) │
                    └──────────────────────────┘
```

El WordPress **no se mueve de servidor**. Solo se accede por subdominio en vez del dominio principal. La base de datos, WooCommerce, ACF, y admin de WP quedan intactos.

---

## 📋 PASO 1 — Verificación Pre-Lanzamiento (30 min)

### 1.1 ✅ TypeScript
```bash
cd quiroz-automotriz
npm run typecheck    # Debe salir sin errores ✓
```
**Status:** ✅ Pasa

### 1.2 ✅ Build de producción
```bash
npm run build        # Debe generar .next/ sin errores ✓
```
**Status:** ✅ Pasa

### 1.3 Verificar WordPress API responde
```bash
curl -s "https://quirozautomotriz.cl/wp-json/wp/v2/product?per_page=1" | head -c 200
```
Debe devolver JSON con productos. Si falla, resolver antes de continuar.

### 1.4 Verificar catálogo actual en WP
Entrar a `https://quirozautomotriz.cl/wp-admin`:
- [ ] ¿Hay vehículos publicados en Productos?
- [ ] ¿Los campos ACF están completos? (precio, kilometraje, combustible, etc.)
- [ ] ¿Las imágenes tienen featured image?
- [ ] ¿Las categorías de productos existen? (sedán, SUV, etc.)

**Si no hay vehículos reales en WP, el sitio nuevo mostrará el catálogo de fallback estático.** Esto es aceptable para el lanzamiento si el cliente todavía no ha cargado el inventario.

### 1.5 Credenciales SMTP listas
- [ ] `SMTP_HOST` — servidor SMTP del hosting (ej. `smtp.quirozautomotriz.cl` o el SMTP de Hostinger)
- [ ] `SMTP_USER` — correo que envía (ej. `contacto@quirozautomotriz.cl`)
- [ ] `SMTP_PASS` — contraseña del correo
- [ ] `SMTP_PORT` — 465 (SSL) o 587 (TLS)

---

## 📋 PASO 2 — Crear Subdominio para WordPress (15 min)

**Objetivo:** WordPress seguirá funcionando, pero en `admin.quirozautomotriz.cl` en vez del dominio principal.

### 2.1 En el panel de DNS (Hostinger / Donde esté el dominio)

Agregar un registro **A**:

```
Tipo:    A
Nombre:  admin
Valor:   [IP del servidor donde está WordPress actualmente]
TTL:     600
```

Ejemplo: Si el hosting de WordPress está en `185.xxx.xxx.xxx`:
```
admin  A  185.xxx.xxx.xxx  600
```

### 2.2 Esperar propagación (5-15 min)

```bash
# Verificar que resuelve
nslookup admin.quirozautomotriz.cl
ping admin.quirozautomotriz.cl
```

### 2.3 Verificar que WordPress responde en el subdominio

```bash
curl -I "https://admin.quirozautomotriz.cl/wp-json/wp/v2/product?per_page=1"
```

Si el servidor WordPress no está configurado para responder en el subdominio, puede dar error. En ese caso:

1. Entrar al panel de WordPress admin
2. Ir a Ajustes → General
3. Cambiar "Dirección de WordPress (URL)" y "Dirección del sitio (URL)" a `https://admin.quirozautomotriz.cl`
4. O agregar al `.htaccess` de WordPress:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTP_HOST} ^admin\.quirozautomotriz\.cl$ [NC]
   RewriteRule ^(.*)$ https://quirozautomotriz.cl/$1 [P,L]
   ```

---

## 📋 PASO 3 — Configurar Vercel para Producción (15 min)

### 3.1 Agregar el dominio principal en Vercel

1. Ir a [vercel.com](https://vercel.com) → proyecto `quirozautoprueba`
2. **Settings → Domains**
3. Agregar: `quirozautomotriz.cl`
4. Vercel te dará instrucciones DNS (generalmente CNAME a `cname.vercel-dns.com`)

### 3.2 Configurar variables de entorno en Vercel

En **Settings → Environment Variables**, verificar que existan todas:

| Variable | Valor | Producción | Preview | Development |
|---|---|---|---|---|
| `WORDPRESS_API_URL` | `https://admin.quirozautomotriz.cl/wp-json/wp/v2` | ✅ | ✅ | ✅ |
| `NEXT_PUBLIC_SITE_URL` | `https://quirozautomotriz.cl` | ✅ | ✅ | ✅ |
| `SMTP_HOST` | `smtp.quirozautomotriz.cl` (o el de Hostinger) | ✅ | ⬜ | ⬜ |
| `SMTP_PORT` | `465` | ✅ | ⬜ | ⬜ |
| `SMTP_USER` | `contacto@quirozautomotriz.cl` | ✅ | ⬜ | ⬜ |
| `SMTP_PASS` | `[contraseña]` | ✅ | ⬜ | ⬜ |
| `SMTP_FROM` | `"Quiroz Redcar <contacto@quirozautomotriz.cl>"` | ✅ | ⬜ | ⬜ |

> **Importante:** `WORDPRESS_API_URL` debe apuntar a `admin.quirozautomotriz.cl`, NO a `quirozautomotriz.cl`. Si se deja el dominio principal, cuando el DNS cambie el fetch de WordPress fallará porque el dominio ya no apunta al servidor WP.

### 3.3 Activar el dominio

Después de agregar el dominio en Vercel, Vercel empezará a servir el Next.js. El DNS se cambia en el Paso 4.

---

## 📋 PASO 4 — Cambiar el DNS (5 min + propagación)

> ⚠️ **Momento crítico.** A partir de este paso, `quirozautomotriz.cl` dejará de mostrar el WordPress legacy y mostrará el nuevo Next.js.

### 4.1 En el panel DNS del dominio

**Opción A — CNAME (recomendada por Vercel)**

```
Tipo:    CNAME
Nombre:  @   (o dejarlo vacío según el panel)
Valor:   cname.vercel-dns.com
TTL:     600
```

**Opción B — A record (si CNAME no es posible)**

```
Tipo:    A
Nombre:  @
Valor:   76.76.21.21
TTL:     600
```

### 4.2 Eliminar o modificar el registro A anterior

Si `quirozautomotriz.cl` tenía un registro A apuntando al servidor WordPress, eliminarlo o cambiarlo.

### 4.3 Agregar también www (recomendado)

```
Tipo:    CNAME
Nombre:  www
Valor:   cname.vercel-dns.com
```

### 4.4 Esperar propagación DNS

La propagación puede tomar de 5 minutos a 24 horas (generalmente 5-15 minutos en Chile).

```bash
# Verificar que el dominio resuelve a Vercel
nslookup quirozautomotriz.cl
# Debe mostrar cname.vercel-dns.com o 76.76.21.21
```

---

## 📋 PASO 5 — Verificación Post-Lanzamiento (30 min)

Abrir el sitio en ventana incógnito (para evitar caché):

### 5.1 Páginas principales

| Página | URL | ¿Carga? | ¿Contenido correcto? |
|---|---|---|---|
| Home | `https://quirozautomotriz.cl/` | ⬜ | ⬜ |
| Vehículo detalle | `https://quirozautomotriz.cl/vehiculo/[slug]` | ⬜ | ⬜ |
| Nosotros | `https://quirozautomotriz.cl/nosotros` | ⬜ | ⬜ |
| Financiamiento | `https://quirozautomotriz.cl/financiamiento` | ⬜ | ⬜ |
| Seguros | `https://quirozautomotriz.cl/seguros` | ⬜ | ⬜ |
| Reserva | `https://quirozautomotriz.cl/reserva` | ⬜ | ⬜ |
| Vender/Consignar | `https://quirozautomotriz.cl/vender-consignar` | ⬜ | ⬜ |
| Vendidos | `https://quirozautomotriz.cl/vendidos` | ⬜ | ⬜ |

### 5.2 Catálogo desde WordPress

- [ ] La home muestra vehículos (scroll-snap funciona)
- [ ] Las imágenes de los autos cargan
- [ ] Los precios, kilometraje y specs se ven correctos
- [ ] La página de detalle de cada vehículo funciona

### 5.3 Formularios

1. Ir a `/financiamiento`
2. Llenar el formulario con datos de prueba
3. Enviar
4. Verificar que llegue el email al destino configurado

Probar también: `/seguros`, `/reserva`, `/vender-consignar`

### 5.4 WordPress Admin sigue funcionando

```bash
curl -I "https://admin.quirozautomotriz.cl/wp-admin"
```

Entrar a `https://admin.quirozautomotriz.cl/wp-admin` y verificar que:
- [ ] El panel de admin carga
- [ ] Se pueden crear/editar productos (vehículos)
- [ ] Los cambios se reflejan en el sitio nuevo (esperar ~60s por ISR)

### 5.5 Mobile

Abrir en celular:
- [ ] Scroll-snap funciona con touch
- [ ] Las imágenes no se cortan
- [ ] Los formularios se ven bien en móvil
- [ ] WhatsApp FAB aparece y abre correctamente

### 5.6 SEO

```bash
# Verificar sitemap
curl -s "https://quirozautomotriz.cl/sitemap.xml" | head -20

# Verificar robots.txt
curl -s "https://quirozautomotriz.cl/robots.txt"

# Verificar OG tags
curl -s "https://quirozautomotriz.cl/" | grep -i "og:"
```

### 5.7 SSL/HTTPS

- [ ] El sitio carga con HTTPS (candado verde)
- [ ] Redirección HTTP → HTTPS funciona
- [ ] No hay mixed content (imágenes/scripts inseguros)

### 5.8 Diagnóstico WordPress

```bash
curl -s "https://quirozautomotriz.cl/api/wp-debug" | python3 -m json.tool
```
Debe mostrar conectividad OK con WordPress.

---

## 📋 PASO 6 — Monitoreo 48h Post-Lanzamiento

### Checklist a revisar diario (2 días)

| Día | Item | Status |
|---|---|---|
| Día 1 | Formularios envían email correctamente | ⬜ |
| Día 1 | Vehículos nuevos en WP aparecen en el sitio | ⬜ |
| Día 1 | Sin errores 500 en ninguna página | ⬜ |
| Día 1 | Tiempo de carga < 3s en móvil | ⬜ |
| Día 2 | Repetir verificación formularios | ⬜ |
| Día 2 | Repetir verificación catálogo | ⬜ |
| Día 2 | Sin alertas en Vercel dashboard | ⬜ |

---

## 🆘 Rollback — Si Algo Sale Mal

Si el sitio nuevo tiene problemas críticos y hay que volver al WordPress legacy:

### Rollback DNS (5-15 min)

1. En el panel DNS, cambiar el registro A de `quirozautomotriz.cl` de vuelta a la IP del servidor WordPress.
2. Esperar propagación (5-15 min).
3. El WordPress legacy vuelve a funcionar inmediatamente porque nunca se tocó.

**Los datos nunca estuvieron en riesgo.** WordPress sigue intacto en el mismo servidor.

---

## 📝 Post-Lanzamiento — Próximos Pasos (opcional, no bloqueante)

| Prioridad | Tarea | Esfuerzo |
|---|---|---|
| 🔴 Alta | **Fotos reales del concesionario** — reemplazar imágenes Unsplash por fotos reales de los vehículos y sucursal | 3-4h |
| 🟡 Media | **Google Analytics 4** — agregar measurement ID para tracking | 1h |
| 🟡 Media | **Google Search Console** — verificar propiedad y enviar sitemap | 30min |
| 🟡 Media | **Google My Business** — actualizar URL del sitio web | 15min |
| 🟢 Baja | **WhatsApp Business API** — si en el futuro se quiere chatbot | 1-2 días |

---

## 📞 Datos de Contacto del Negocio

| Canal | Dato |
|---|---|
| WhatsApp | +56 9 5906 5441 |
| Teléfono | +56 9 9343 1571 |
| Sucursal 1 | Av. Bosques de Montemar #65, oficina 203, Concón |
| Sucursal 2 | Hontaneda 2615, Valparaíso |
| Instagram | @quirozautomotrizspa |
| TikTok | @quiroz.automotriz |
| YouTube | Quiroz Automotriz |

---

## ✅ Firmas de Lanzamiento

| Rol | Nombre | Fecha | Firma |
|---|---|---|---|
| Developer | ________ | __/__/____ | ________ |
| Cliente (Marco Quiroz) | ________ | __/__/____ | ________ |

---

> **¿Preguntas?** El AGENTS.md y README.md contienen documentación técnica detallada. Este runbook es para la ejecución del lanzamiento.

*Runbook generado el 2026-06-26 por Hermes Agent.*
