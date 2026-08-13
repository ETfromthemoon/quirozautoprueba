# Imágenes del catálogo: operar fuera de Vercel

## Resultado aplicado

- `next/image` conserva su HTML responsivo, carga diferida y prevención de saltos de diseño, pero no usa `/_next/image`.
- Para las fotos de vehículos, la aplicación toma desde WordPress la sub-talla más cercana a **1600 px** (usualmente `1536x1536`) en vez del original o el archivo `-scaled`.
- En consecuencia, las optimizaciones de imagen de Vercel dejan de aumentar en los despliegues nuevos. El contador del ciclo actual no baja; se detiene el consumo nuevo una vez publicado el cambio.

WordPress ya genera las sub-tallas al cargar una foto. El endpoint de WooCommerce expone esas alternativas en `srcset` y el endpoint REST de medios las expone en `media_details.sizes`; ambos son los datos que se usan ahora.

La prueba actual del CMS respondió una foto a 1600 px y con `Cache-Control: private`. Por eso la configuración de caché indicada abajo es un paso pendiente en WordPress/hosting: no puede aplicarse desde Vercel sin volver a intermediar las imágenes.

## Configuración recomendada en WordPress

1. Antes de modificar fotos, tomar respaldo de `wp-content/uploads` y de la base de datos.
2. Definir como regla editorial: subir fotos de auto en **JPEG o WebP**, con lado largo de **2560 px como máximo**, orientación correcta y peso ideal inferior a 1.5 MB. No subir originales de cámara de 4K/8K.
3. En el hosting, comprobar que PHP tenga Imagick o GD. Al subir cada foto, WordPress debe crear `medium_large`, `large` y `1536x1536`; WooCommerce debe mantener sus miniaturas. Si se cambiaron tamaños o hay archivos antiguos, regenerar las miniaturas desde WordPress o mediante `wp media regenerate --only-missing` en el servidor.
4. Configurar en el CMS o CDN del CMS conversión a WebP (AVIF sólo si el hosting lo soporta bien), compresión con calidad aproximada 76–82 y entrega según el encabezado `Accept` del navegador. Debe transformar también las URLs que se consultan por REST/WooCommerce, no sólo las etiquetas `img` del tema de WordPress.
5. Configurar el servidor de WordPress para que los archivos bajo `/wp-content/uploads/` se entreguen con `Cache-Control: public, max-age=31536000, immutable`. Las URLs de uploads cambian al reemplazar el archivo, por lo que se pueden cachear durante un año.

## Criterios de verificación

Tras desplegar, abrir la página de inicio y una ficha de vehículo en una ventana privada:

1. En Network no debe aparecer ninguna solicitud a `/_next/image`.
2. Las fotos del catálogo deben venir de `admin.quirozautomotriz.cl/wp-content/uploads/...` y, para fotos grandes, usar una variante de unos 1536 px o menor.
3. Verificar en la pestaña Response Headers que el CMS envíe caché de larga duración y que la conversión WebP/AVIF entregue el `Content-Type` esperado cuando corresponda.
4. Revisar el uso de Image Optimization de Vercel al día siguiente: el valor ya usado no se revierte dentro del período, pero no debería seguir creciendo por visitas a este sitio.

## Importante

No activar de nuevo la optimización de Vercel mientras WordPress no esté entregando las versiones comprimidas y cacheables. Si se migra el CMS a un CDN de imágenes, se debe conservar este esquema: el CDN genera las variantes y Next.js las sirve directamente, sin pasar por `/_next/image`.
