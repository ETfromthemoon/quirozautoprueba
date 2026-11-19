<?php
defined('ABSPATH') || exit;

function qz_dictamen_actual($id) {
	foreach (array('devuelta','rechazada') as $estado) {
		$dictamen = get_post_meta($id, '_qz_' . $estado, true);
		if ($dictamen) return $dictamen;
	}
	return null;
}

function qz_bandejas() {
	return array('pendientes'=>'Pendientes','aprobadas'=>'Aprobadas','devueltas'=>'Devueltas','rechazadas'=>'Rechazadas');
}

add_action('restrict_manage_posts', function ($tipo, $posicion) {
	if ($tipo !== QZ_CONSIGNACIONES_POST_TYPE || $posicion !== 'top') return;
	$actual = sanitize_key($_GET['qz_estado'] ?? '');
	echo '<label class="screen-reader-text" for="qz-estado">Estado comercial</label><select name="qz_estado" id="qz-estado"><option value="">Todos los estados comerciales</option>';
	foreach (qz_bandejas() as $valor=>$label) {
		echo '<option value="' . esc_attr($valor) . '"' . selected($actual, $valor, false) . '>' . esc_html($label) . '</option>';
	}
	echo '</select>';
}, 10, 2);

add_action('pre_get_posts', function ($query) {
	global $pagenow;
	if (!is_admin() || $pagenow !== 'edit.php' || !$query->is_main_query() || $query->get('post_type') !== QZ_CONSIGNACIONES_POST_TYPE) return;
	$estado = sanitize_key($_GET['qz_estado'] ?? '');
	if (!isset(qz_bandejas()[$estado])) return;
	$condiciones = array('relation'=>'AND');
	if ($query->get('meta_query')) $condiciones[] = $query->get('meta_query');
	$condiciones[] = array('key'=>'_qz_aprobacion','compare'=>$estado === 'aprobadas' ? 'EXISTS' : 'NOT EXISTS');
	if ($estado === 'pendientes' || $estado === 'devueltas') {
		$condiciones[] = array('key'=>'_qz_devuelta','compare'=>$estado === 'devueltas' ? 'EXISTS' : 'NOT EXISTS');
	}
	if ($estado === 'pendientes' || $estado === 'rechazadas') {
		$condiciones[] = array('key'=>'_qz_rechazada','compare'=>$estado === 'rechazadas' ? 'EXISTS' : 'NOT EXISTS');
	}
	$query->set('meta_query', $condiciones);
});

function qz_registrar_dictamen($id, $op, $revision, $actual) {
	$token = sanitize_text_field($_POST['revision'] ?? '');
	if ($actual || !$revision || !hash_equals($revision['token'], $token)) throw new RuntimeException('La revisión cambió. Recarga la ficha antes de decidir.');
	$motivo = trim(sanitize_textarea_field(wp_unslash($_POST['motivo'] ?? '')));
	if ($motivo === '' || mb_strlen($motivo, 'UTF-8') > 1500) throw new RuntimeException('Indica el motivo de la decisión (máximo 1500 caracteres).');
	$estado = $op === 'devolver' ? 'devuelta' : 'rechazada';
	$decision = array('estado'=>$estado,'token'=>wp_generate_uuid4(),'motivo'=>$motivo,'usuario'=>get_current_user_id(),'fecha'=>time());
	if (!add_post_meta($id, '_qz_' . $estado, wp_slash($decision), true)) throw new RuntimeException('No se pudo guardar la decisión.');
}

function qz_corregir_foto($id, $dictamen) {
	global $wpdb;
	$toma = filter_var($_POST['toma'] ?? 0, FILTER_VALIDATE_INT);
	$file = $_FILES['foto'] ?? array();
	if (!$toma || $toma < 1 || $toma > 20 || ($file['error'] ?? -1) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) throw new RuntimeException('Selecciona una toma y una foto JPEG.');
	$info = wp_getimagesize($file['tmp_name']);
	if (!$info || $info[2] !== IMAGETYPE_JPEG || $file['size'] > 12000000 || $info[0] * $info[1] > 32000000) throw new RuntimeException('Usa una imagen JPEG de hasta 12 MB y 32 megapíxeles.');
	$editor = wp_get_image_editor($file['tmp_name']);
	if (is_wp_error($editor)) throw new RuntimeException('No se pudo procesar la fotografía.');
	$editor->maybe_exif_rotate();
	if (max($info[0], $info[1]) > 1800 && is_wp_error($editor->resize(1800, 1800, false))) throw new RuntimeException('No se pudo reducir la fotografía.');
	$editor->set_quality(78);
	$destino = $file['tmp_name'] . '-qz.jpg';
	try {
		$saved = $editor->save($destino, 'image/jpeg');
		if (is_wp_error($saved)) throw new RuntimeException('No se pudo guardar la fotografía.');
		if ($editor instanceof WP_Image_Editor_Imagick) {
			// GD writes only pixels. Imagick can preserve camera/location profiles on save.
			$imagen = new Imagick($destino);
			$imagen->stripImage();
			$bytes = $imagen->getImageBlob();
			$imagen->clear();
		} else {
			$bytes = file_get_contents($destino);
		}
	} finally {
		if (is_file($destino)) wp_delete_file($destino);
	}
	if (!$bytes || strlen($bytes) > 1200000) throw new RuntimeException('La foto sigue siendo demasiado grande. Prueba con un JPEG más pequeño.');
	if (!qz_fotos_estado($id)['enviadas']) throw new RuntimeException('Se requieren las 20 tomas finalizadas.');
	if ($wpdb->query('START TRANSACTION') === false) throw new RuntimeException('No se pudo iniciar la corrección.');
	try {
		$dictamen['token'] = wp_generate_uuid4();
		if ($wpdb->update(qz_fotos_tabla(), array('jpeg'=>base64_encode($bytes),'modificada'=>current_time('mysql', true)), array('ficha'=>$id,'toma'=>$toma,'enviada'=>1)) === false
			|| !update_post_meta($id, '_qz_' . $dictamen['estado'], wp_slash($dictamen))
			|| $wpdb->query('COMMIT') === false) throw new RuntimeException('No se pudo reemplazar la toma.');
	} catch (Throwable $error) {
		$wpdb->query('ROLLBACK');
		clean_post_cache($id);
		throw $error;
	}
}

function qz_guardar_reenvio($id, $revision, $dictamen) {
	global $wpdb;
	if (!$dictamen) {
		if (!update_post_meta($id, '_qz_revision', wp_slash($revision))) throw new RuntimeException('No se pudo registrar la revisión.');
		return;
	}
	if ($wpdb->query('START TRANSACTION') === false) throw new RuntimeException('No se pudo iniciar el reenvío.');
	try {
		if (!update_post_meta($id, '_qz_revision', wp_slash($revision))
			|| !add_post_meta($id, '_qz_historial_dictamen', wp_slash($dictamen))
			|| !delete_post_meta($id, '_qz_' . $dictamen['estado'])
			|| $wpdb->query('COMMIT') === false) throw new RuntimeException('No se pudo completar el reenvío.');
	} catch (Throwable $error) {
		$wpdb->query('ROLLBACK');
		clean_post_cache($id);
		throw $error;
	}
}
