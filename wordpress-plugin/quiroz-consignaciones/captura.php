<?php defined('ABSPATH') || exit; ?>
<!doctype html>
<html lang="es-CL"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fotos de tu vehículo · Quiroz Automotriz</title><link rel="stylesheet" href="<?php echo esc_url(plugins_url('captura.css', __FILE__)); ?>"></head>
<body><main id="captura" data-api="<?php echo esc_url(admin_url('admin-ajax.php')); ?>" data-ficha="<?php echo absint($_GET['ficha'] ?? 0); ?>" data-ref="<?php echo esc_url(plugins_url('referencias/', __FILE__)); ?>">
<header><b>QUIROZ</b> Automotriz</header>
<h1>Fotos de tu vehículo</h1>
<p id="estado" role="status" aria-live="polite">Cargando tu consignación…</p>
<section id="paso" hidden>
<label for="indice">Toma</label> <select id="indice"></select>
<h2 id="titulo"></h2><p id="guia"></p>
<figure><img id="ejemplo" alt=""><figcaption>Foto de referencia</figcaption></figure>
<figure id="vista" hidden><img id="preview" alt="Tu fotografía"><figcaption>Tu fotografía</figcaption></figure>
<div class="acciones"><button id="camara">Tomar foto</button><button class="sec" id="galeria">Elegir de la galería</button></div>
<input hidden id="archivoCamara" type="file" accept="image/*" capture="environment">
<input hidden id="archivoGaleria" type="file" accept="image/*">
<button class="sec" id="siguiente" hidden>Siguiente toma</button>
</section>
<button type="button" id="reintentar" hidden>Reintentar</button>
<button type="button" id="enviar" hidden>Enviar las 20 fotos</button>
<noscript>Activa JavaScript para guardar tus fotos.</noscript>
</main><script src="<?php echo esc_url(add_query_arg('v', '1.4.1', plugins_url('captura.js', __FILE__))); ?>" defer></script></body></html>
