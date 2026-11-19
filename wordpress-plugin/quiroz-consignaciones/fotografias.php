<?php
defined('ABSPATH') || exit;

function qz_fotos_tabla() {
	global $wpdb;
	return $wpdb->prefix . 'qz_fotos';
}

function qz_fotos_instalar() {
	if (get_option('qz_fotos_schema') === '1') {
		return;
	}
	global $wpdb;
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	$table = qz_fotos_tabla();
	dbDelta("CREATE TABLE $table (
		ficha bigint(20) unsigned NOT NULL,
		toma tinyint unsigned NOT NULL,
		jpeg mediumblob NOT NULL,
		enviada tinyint unsigned NOT NULL DEFAULT 0,
		modificada datetime NOT NULL,
		PRIMARY KEY  (ficha,toma)
	) " . $wpdb->get_charset_collate() . ";");
	if ($wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s', $wpdb->esc_like($table))) === $table) {
		update_option('qz_fotos_schema', '1');
	}
}
add_action('admin_init', 'qz_fotos_instalar');

function qz_fotos_firma($id, $vence) {
	return hash_hmac('sha256', "fotos/$id/$vence", wp_salt('auth'));
}

function qz_fotos_estado($id) {
	global $wpdb;
	$rows = $wpdb->get_results($wpdb->prepare('SELECT toma,enviada FROM ' . qz_fotos_tabla() . ' WHERE ficha=%d ORDER BY toma', $id));
	if ($wpdb->last_error) {
		wp_send_json_error('No pudimos leer las fotos. Vuelve a intentar.', 503);
	}
	return array('guardadas' => array_map('intval', wp_list_pluck($rows, 'toma')),
		'enviadas' => count($rows) === 20 && intval($rows[0]->enviada) === 1);
}

add_action('add_meta_boxes_' . QZ_CONSIGNACIONES_POST_TYPE, function () {
	add_meta_box('qz-fotos', 'Fotos para publicación', 'qz_fotos_panel', QZ_CONSIGNACIONES_POST_TYPE);
});

function qz_fotos_panel($post) {
	if ($post->post_status === 'auto-draft') {
		echo '<p>Guarda la ficha para obtener el enlace del cliente.</p>';
		return;
	}
	$estado = qz_fotos_estado($post->ID);
	if ($estado['enviadas']) {
		echo '<p><strong>20 fotos recibidas</strong></p>';
		foreach ($estado['guardadas'] as $n) {
			$url = add_query_arg(array('action'=>'qz_ver_foto', 'ficha'=>$post->ID, 'toma'=>$n), admin_url('admin-post.php'));
			echo '<a href="' . esc_url($url) . '" target="_blank" rel="noopener">Foto ' . intval($n) . '</a> ';
		}
		return;
	}
	$vence = time() + 7 * DAY_IN_SECONDS;
	$url = add_query_arg(array('action'=>'qz_captura', 'ficha'=>$post->ID), admin_url('admin-post.php'))
		. '#' . $vence . '.' . qz_fotos_firma($post->ID, $vence);
	if (get_post_meta($post->ID, '_qz_origen', true) === 'web') {
		$url = 'https://www.quirozautomotriz.cl/consignacion/fotos?ficha=' . $post->ID . '#' . $vence . '.' . qz_fotos_firma($post->ID, $vence);
	}
	echo '<p>' . count($estado['guardadas']) . ' de 20 fotos guardadas. Comparte este enlace con el cliente. Es válido por 7 días.</p>';
	echo '<input aria-label="Enlace para tomar fotos" class="large-text" readonly onclick="this.select()" value="' . esc_attr($url) . '">';
}

function qz_fotos_pagina() {
	nocache_headers();
	header('Referrer-Policy: no-referrer');
	header('X-Robots-Tag: noindex, nofollow');
	require __DIR__ . '/captura.php';
	exit;
}
add_action('admin_post_qz_captura', 'qz_fotos_pagina');
add_action('admin_post_nopriv_qz_captura', 'qz_fotos_pagina');

function qz_fotos_api() {
	global $wpdb;
	$id = absint($_POST['ficha'] ?? 0);
	$vence = absint($_POST['vence'] ?? 0);
	$firma = $_POST['firma'] ?? '';
	if ($vence < time() || !is_string($firma) || !hash_equals(qz_fotos_firma($id, $vence), $firma)
		|| get_post_type($id) !== QZ_CONSIGNACIONES_POST_TYPE || in_array(get_post_status($id), array('trash','auto-draft'), true)) {
		wp_send_json_error('Solicita un enlace vigente al equipo de consignaciones.', 403);
	}
	$op = $_POST['operacion'] ?? '';
	$table = qz_fotos_tabla();
	if ($op === 'estado') {
		wp_send_json_success(qz_fotos_estado($id));
	}
	$n = absint($_POST['toma'] ?? 0);
	if ($op === 'ver' && $n >= 1 && $n <= 20) {
		$data = $wpdb->get_var($wpdb->prepare("SELECT jpeg FROM $table WHERE ficha=%d AND toma=%d", $id, $n));
		if (!$data) {
			wp_send_json_error('La foto no está disponible.', 404);
		}
		nocache_headers();
		header('Content-Type: image/jpeg');
		header('X-Content-Type-Options: nosniff');
		echo base64_decode($data);
		exit;
	}
	if ($op === 'enviar') {
		$estado = qz_fotos_estado($id);
		if (count($estado['guardadas']) !== 20) {
			wp_send_json_error('Faltan fotos antes del envío.', 409);
		}
		// Count and seal atomically if a stale draft expires concurrently.
		$result = $wpdb->query($wpdb->prepare("UPDATE $table SET enviada=1 WHERE ficha=%d
			AND 20=(SELECT total FROM (SELECT COUNT(*) AS total FROM $table WHERE ficha=%d) AS fotos)", $id, $id));
	} elseif ($op === 'guardar' && $n >= 1 && $n <= 20) {
		$file = $_FILES['foto'] ?? array();
		if (($file['error'] ?? -1) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name']) || $file['size'] > 1200000) {
			wp_send_json_error('La foto supera el tamaño permitido o llegó incompleta.', 400);
		}
		$info = @getimagesize($file['tmp_name']);
		if (!$info || $info[2] !== IMAGETYPE_JPEG || max($info[0], $info[1]) > 2000) {
			wp_send_json_error('Selecciona una fotografía JPEG válida.', 400);
		}
		$jpeg = base64_encode(file_get_contents($file['tmp_name']));
		// One row per angle. A retry replaces a draft and cannot overwrite a delivered photo.
		$result = $wpdb->query($wpdb->prepare("INSERT INTO $table (ficha,toma,jpeg,modificada) VALUES (%d,%d,%s,UTC_TIMESTAMP())
			ON DUPLICATE KEY UPDATE jpeg=IF(enviada=0,VALUES(jpeg),jpeg), modificada=IF(enviada=0,VALUES(modificada),modificada)", $id, $n, $jpeg));
	} else {
		wp_send_json_error('Operación desconocida.', 400);
	}
	if ($result === false) {
		wp_send_json_error('No pudimos guardar el cambio. Vuelve a intentar.', 503);
	}
	$estado = qz_fotos_estado($id);
	if ($op === 'enviar' && !$estado['enviadas']) {
		wp_send_json_error('El borrador cambió. Recarga la página para revisar las tomas pendientes.', 409);
	}
	wp_send_json_success($estado);
}
add_action('wp_ajax_qz_fotos', 'qz_fotos_api');
add_action('wp_ajax_nopriv_qz_fotos', 'qz_fotos_api');

add_action('admin_post_qz_ver_foto', function () {
	global $wpdb;
	$id = absint($_GET['ficha'] ?? 0);
	if (get_post_type($id) !== QZ_CONSIGNACIONES_POST_TYPE || !current_user_can('edit_post', $id)) {
		wp_die('Acceso restringido.', '', array('response'=>403));
	}
	$n = absint($_GET['toma'] ?? 0);
	$data = $wpdb->get_var($wpdb->prepare('SELECT jpeg FROM ' . qz_fotos_tabla() . ' WHERE ficha=%d AND toma=%d AND enviada=1', $id, $n));
	if (!$data) {
		wp_die('Foto no disponible.', '', array('response'=>404));
	}
	nocache_headers();
	header('X-Content-Type-Options: nosniff');
	header('Content-Type: image/jpeg');
	header('Content-Disposition: inline; filename="consignacion-' . $id . '-' . $n . '.jpg"');
	echo base64_decode($data);
	exit;
});

add_action('before_delete_post', function ($id) {
	if (get_post_type($id) === QZ_CONSIGNACIONES_POST_TYPE) {
		global $wpdb;
		$wpdb->delete(qz_fotos_tabla(), array('ficha'=>$id));
	}
});

add_action('admin_init', function () {
	if (!wp_next_scheduled('qz_fotos_limpiar')) {
		wp_schedule_event(time() + DAY_IN_SECONDS, 'daily', 'qz_fotos_limpiar');
	}
});
add_action('qz_fotos_limpiar', function () {
	global $wpdb;
	$limite = gmdate('Y-m-d H:i:s', time() - 30 * DAY_IN_SECONDS);
	$wpdb->query($wpdb->prepare('DELETE FROM ' . qz_fotos_tabla() . ' WHERE enviada=0 AND modificada < %s', $limite));
});
