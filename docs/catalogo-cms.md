# Catálogo privado de venta en WordPress

El catálogo se administra como información opcional dentro de cada producto de
WooCommerce. Ningún campo de este grupo modifica los requisitos actuales para
publicar un vehículo ni participa en la importación del catálogo público.

## Importar el grupo ACF

1. En WordPress, abrir **ACF > Herramientas**.
2. En **Importar grupos de campos**, seleccionar
   `config/acf/catalogo-venta.json`.
3. Importar el grupo **Catálogo privado de venta**.
4. Confirmar que su ubicación sea **Tipo de entrada es igual a Producto**.

El archivo usa solamente campos disponibles en ACF gratuito: pestañas,
acordeones, `true_false`, URL, imagen, texto, textarea, fecha, radio y select.
No usa Group, Repeater ni Gallery.

## Comportamiento

- **Habilitar catálogo privado** determina si el producto tiene un catálogo.
- **Documentación de tránsito** agrupa padrón, revisión técnica, seguro
  obligatorio, permiso de circulación, sus vencimientos y una observación
  independiente. El bloque sólo aparece en el brochure si contiene datos.
- Los tres videos reciben enlaces de YouTube.
- La galería dispone de 12 campos individuales. El frontend sólo muestra la
  galería cuando hay entre 8 y 12 imágenes válidas.
- **Mostrar prueba de ruta escrita** habilita el módulo escrito opcional. El
  video de prueba de ruta continúa siendo independiente y opcional.
- Todos los campos son opcionales. Un producto puede publicarse normalmente
  aunque el catálogo esté vacío o incompleto.
- La ruta privada consulta primero los campos ACF del producto. Si no hay datos
  ACF, conserva el informe estático existente como compatibilidad y demo.
- Los vehículos y sus páginas públicas siguen usando el flujo existente y no
  consultan el brochure.

## Acceso privado

El campo **Token privado** se compara con el parámetro `k` de la URL:

`/informe/slug-del-vehiculo?k=token-configurado`

Si falta el token o no coincide, la ruta muestra la puerta de acceso y no
revela los datos. En la edición del vehículo el token se crea automáticamente
con 128 bits aleatorios al habilitar el catálogo. El vendedor no debe escribirlo.
El botón **Regenerar acceso** prepara una llave nueva; el enlace anterior queda
revocado únicamente después de pulsar **Actualizar**.

## Datos globales

El precio, las alternativas de pago, el valor de reserva y el enlace de pago
no se duplican en ACF. Se reutilizan desde la configuración y componentes
existentes del sitio.
