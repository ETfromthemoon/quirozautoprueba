# Capacidad de admin.quirozautomotriz.cl — 28 de septiembre de 2026

## Plan y estado

| Prioridad | Acción | Estado |
| --- | --- | --- |
| 1 | Asegurar respaldo y posibilidad de reversión | Hecho: ocho respaldos semanales en JetBackup; copia adicional de base de datos en WPvivid y copias privadas de `.htaccess` y `wp-config.php`. |
| 2 | Elevar límites de la cuenta que habían llegado al máximo | Hecho: CloudLinux `qrzadm` pasó de CPU 100 % a 150 %, memoria 1 GB a 2 GB e I/O 4 MB/s a 8 MB/s. EP 20, NPROC 100 e IOPS 1024 siguen iguales. |
| 3 | Reducir datos y trabajo del catálogo | Hecho en el repositorio: catálogo sin medios incrustados cuando WooCommerce Store API entrega imágenes; se conserva la consulta anterior si faltan imágenes. La compilación deja de consultar en ráfaga todas las fichas para imágenes sociales. |
| 4 | Mejorar entrega de imágenes | Hecho: caché de navegador LiteSpeed activada por 30 días. Se comprobó que un navegador que acepta WebP recibe una imagen de 112 KB en vez del PNG de 3,18 MB. |
| 5 | Cerrar depuración de producción | Hecho: `WP_DEBUG` y `WP_DEBUG_LOG` quedaron desactivados en `wp-config.php`; el sitio y la API respondieron 200 después del cambio. |
| 6 | Activar caché de objetos persistente | Pendiente del proveedor: las extensiones PHP Redis y Memcached existen, pero las pruebas de conexión a `localhost:6379` y `localhost:11211` fallaron. La caché permanece apagada. |
| 7 | Activar OPcache y actualizar PHP | Pendiente de una ventana de mantenimiento: WordPress usa PHP 8.2.33 por el controlador `ea-php82` de `.htaccess`; el PHP 8.3 que muestra cPanel es el valor global y no el efectivo. WordPress informa OPcache desactivado. Se requiere validar módulos y compatibilidad de plugins antes de cambiar la versión en producción. |

## Evidencia y límites

- CloudLinux registró topes de CPU, memoria e I/O en las últimas 24 horas. La nueva cuota se verificó en la lista de usuarios de CloudLinux.
- La consulta pública de 100 productos con medios incrustados transfirió alrededor de 1,13 MB y tardó alrededor de 6 segundos en la medición previa. Una consulta con campos reducidos, sin medios incrustados, transfirió alrededor de 326 KB y tardó alrededor de 3 segundos. Son mediciones puntuales, no una garantía de latencia.
- El nuevo lector del catálogo cargó 35 vehículos disponibles, todos con imagen, en una prueba local. `npm run typecheck` y `npm run build` finalizaron correctamente.
- La API REST pública aún responde con instrucciones de no almacenar en caché del servidor. No se forzó la caché de respuestas que podrían incluir campos ACF; la reducción de carga se hizo en el consumidor público del catálogo.
- La mejora de código sólo llega al sitio público cuando se despliegue el commit correspondiente en Vercel. El aumento de límites, la caché de navegador y la desactivación de depuración ya están aplicados en el servidor.

## Seguimiento

1. Vigilar en CloudLinux durante horas de uso real si vuelven a aparecer fallos de CPU, PMEM o I/O; si persisten, revisar carga global del host con el proveedor antes de seguir elevando cuotas.
2. Pedir a v2nets.com un servicio Redis o Memcached para `qrzadm` y el módulo OPcache para el PHP efectivo. Activar la caché de objetos sólo después de una prueba de conexión satisfactoria.
3. Probar PHP 8.3 con WooCommerce, ACF, LiteSpeed y los plugins activos en un entorno de pruebas o en una ventana con reversión preparada.
4. Revisar tiempos del catálogo y de las fichas después del despliegue desde Vercel.
