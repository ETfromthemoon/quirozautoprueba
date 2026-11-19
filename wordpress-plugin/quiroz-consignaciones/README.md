# Quiroz Automotriz — Consignaciones

Plugin privado de WordPress para registrar consignaciones desde el panel de administración.

## Permisos

- **Consignador** puede crear registros y ver/editar únicamente los que llevan su usuario como autor, incluso al buscar o filtrar la lista. No puede publicar, borrar, ni editar registros ajenos.
- **Administrador** conserva el acceso completo de WordPress y recibe las capacidades del tipo de registro; puede revisar todas las consignaciones.
- Los registros son un tipo privado, sin endpoint REST ni consulta pública. Se guardan en `wp_posts` y `wp_postmeta`; `post_author` y `_qz_consignador_user_id` identifican a la persona autenticada que registró la ficha. WordPress conserva también fecha y hora del registro.
- No se crea una cuenta de consignador porque el proyecto no define a qué persona debe pertenecer. Después de instalar el plugin, un administrador puede crear o editar una cuenta en **Usuarios** y asignarle el rol **Consignador**.

## Instalación

1. Desde **Plugins > Añadir plugin > Subir plugin**, subir el ZIP del directorio `quiroz-consignaciones`.
2. Activar **Quiroz Automotriz — Consignaciones**. La activación registra el tipo y configura el rol; los Administradores reciben acceso a todas las fichas.
3. Desde **Usuarios**, crear una cuenta para cada miembro autorizado y asignar sólo el rol **Consignador**.
4. Iniciar sesión con esa cuenta y abrir **Consignaciones > Nueva consignación**.

## Verificación al instalar

1. Con una cuenta consignador, crear una ficha y guardar como pendiente. Debe verse su propio usuario y fecha de registro.
2. Con una segunda cuenta consignador, confirmar que la ficha anterior no aparece en la lista ni se puede abrir por ID.
3. Con una cuenta Administrador, confirmar que ambas fichas aparecen y que se pueden revisar.
4. Confirmar que el endpoint público `/wp-json/wp/v2/qz_consignacion` no expone el tipo.

Las fichas manuales quedan vinculadas al usuario conectado. Las solicitudes del frontend se identifican como Formulario web y quedan pendientes de revisión por administración.

## Fotos guiadas para el cliente (1.1.0)

Guarda la consignación y copia el enlace del bloque **Fotos para publicación**. El cliente puede abrirlo en su teléfono durante siete días. Al volver a abrir la ficha puedes copiar un enlace con vigencia renovada. El enlace permite consultar y reemplazar las fotos de esa ficha hasta el envío final. Compártelo sólo con su titular.

Cada paso muestra una de las veinte fotos de referencia y una indicación de encuadre. El navegador conserva la toma pendiente en IndexedDB hasta que WordPress confirma la subida. Al reabrir el mismo enlace en el mismo navegador, puede reintentar una toma pendiente. Las tomas ya subidas se recuperan también desde otro dispositivo. La selección de cámara o galería depende del navegador y el sistema operativo.

El cliente puede revisar o repetir cada toma antes de pulsar **Enviar las 20 fotos**. Después, el equipo abre los JPEG desde la ficha. La tabla privada con sufijo qz_fotos contiene los JPEG reducidos a 1800 píxeles de lado mayor. Inclúyela en el respaldo de la base de datos. WP-Cron elimina las tomas pendientes que lleven más de 30 días guardadas. Al borrar definitivamente una ficha se borran sus fotos.

## Formulario web (1.2.0)

Desde **Vender / Consignar → Consignar mi auto**, el cliente completa la ficha de vehículo y continúa en la ruta pública `/consignacion/fotos`. El frontend guarda los datos en WordPress mediante el endpoint público de creación `POST /wp-json/quiroz/v1/consignaciones`. Una clave aleatoria por solicitud y una transacción impiden duplicados en los reintentos. La instalación requiere tablas de WordPress con soporte transaccional (InnoDB). El cliente recibe un enlace de recuperación en el correo de confirmación. La recepción de la ficha es independiente de la disponibilidad del correo y de Airtable.

Las lecturas y subidas de fotos pasan por el endpoint del frontend `/api/consignacion/fotos` y requieren la firma de la ficha. El servidor usa el WordPress de producción por defecto. Para probar con una instalación local, configurar `CONSIGNACIONES_WP_ORIGIN` en el proceso de Next y `NEXT_PUBLIC_SITE_URL` con el origen del frontend de prueba.

## Asignación, revisión e inventario (1.3.0)

1. En **Consignaciones → Revisión comercial**, el administrador selecciona a un usuario con perfil **Consignador**. La ficha pasa a la bandeja de ese usuario. Una reasignación requiere una nueva revisión.
2. Tras el envío final del cliente, el responsable abre las 20 fotos, indica el precio público en pesos y el número de la portada, y confirma la revisión.
3. El administrador comprueba el precio y la portada y pulsa **Aprobar y publicar en inventario**. Si cambia la revisión, tendrá que volver a abrirla. La misma aprobación se puede reintentar tras una interrupción.
4. WooCommerce recibe un producto con precio público, portada, 19 fotos de galería y los campos comerciales del vehículo. El valor piso y los datos personales quedan en la ficha privada. Los cambios comerciales posteriores a la publicación se gestionan en el producto.
5. La ficha conserva el responsable, la revisión, la aprobación y el vínculo al producto. WP-Cron comprueba la aparición en el catálogo y la página del vehículo después de la renovación de la caché. El administrador también puede pulsar **Comprobar publicación**. En pruebas aisladas, la constante de WordPress `QZ_INVENTARIO_WEB` permite apuntar esta comprobación al frontend local.
