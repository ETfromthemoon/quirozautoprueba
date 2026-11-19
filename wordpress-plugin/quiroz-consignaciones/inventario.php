<?php
defined('ABSPATH') || exit;

// WooCommerce normally redirects users without blog/product permissions to My Account.
add_filter('woocommerce_prevent_admin_access', function ($prevent) {
	return current_user_can('edit_qz_consignaciones') ? false : $prevent;
});

// The author drives WordPress object permissions. Original intake attribution stays in metadata.
function qz_revision_url($id) {
	return add_query_arg(array('page'=>'qz-revision','id'=>$id), admin_url('admin.php'));
}

add_filter('manage_' . QZ_CONSIGNACIONES_POST_TYPE . '_posts_columns', function ($columns) {
	$columns['qz_revision'] = 'Revisión comercial';
	return $columns;
}, 20);

add_action('manage_' . QZ_CONSIGNACIONES_POST_TYPE . '_posts_custom_column', function ($column, $id) {
	if ($column !== 'qz_revision') return;
	if (get_post_meta($id, '_qz_visible', true)) $estado = 'Publicación confirmada';
	elseif (get_post_meta($id, '_qz_aprobacion', true)) $estado = 'En inventario';
	elseif ($dictamen = qz_dictamen_actual($id)) $estado = ucfirst($dictamen['estado']);
	elseif (get_post_meta($id, '_qz_revision', true)) $estado = 'Pendiente de aprobación';
	elseif (get_post_field('post_author', $id)) $estado = 'Pendiente de revisión';
	else $estado = 'Por asignar';
	echo '<a href="' . esc_url(qz_revision_url($id)) . '">' . esc_html($estado) . '</a>';
}, 20, 2);

add_action('admin_menu', function () {
	$hook = add_submenu_page(null, 'Revisión comercial', 'Revisión comercial', 'edit_qz_consignaciones', 'qz-revision', 'qz_revision_pantalla');
	if ($hook) add_action('load-' . $hook, function () {
		if (!qz_revision_permitida(absint($_GET['id'] ?? 0))) wp_die('Acceso restringido.', '', array('response'=>403));
	});
});

add_action('add_meta_boxes_' . QZ_CONSIGNACIONES_POST_TYPE, function () {
	add_meta_box('qz-revision', 'Revisión comercial', function ($post) {
		if ($post->post_status !== 'auto-draft') {
			echo '<a class="button button-primary" href="' . esc_url(qz_revision_url($post->ID)) . '">Asignación, revisión y publicación</a>';
		}
	}, QZ_CONSIGNACIONES_POST_TYPE, 'side', 'high');
});

function qz_revision_permitida($id) {
	return get_post_type($id) === QZ_CONSIGNACIONES_POST_TYPE && !in_array(get_post_status($id), array('trash','auto-draft'), true)
		&& current_user_can('edit_post', $id);
}

function qz_revision_admin() {
	return current_user_can('manage_options') && current_user_can('publish_qz_consignaciones');
}

function qz_revision_campos($id) {
	$datos = array();
	foreach (array('marca','modelo','version','anio','kilometraje','transmision','combustible','cilindrada','color','cantidad_duenos','segmento') as $campo) {
		$datos[$campo] = (string)get_post_meta($id, '_qz_' . $campo, true);
	}
	return $datos;
}

function qz_revision_form($id, $operacion) {
	echo '<form method="post"' . ($operacion === 'corregir_foto' ? ' enctype="multipart/form-data"' : '') . ' action="' . esc_url(admin_url('admin-post.php')) . '">';
	wp_nonce_field('qz_inventario_' . $id);
	foreach (array('action'=>'qz_inventario','id'=>$id,'operacion'=>$operacion) as $name=>$value) {
		echo '<input type="hidden" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '">';
	}
}

function qz_revision_pantalla() {
	$id = absint($_GET['id'] ?? 0);
	if (!qz_revision_permitida($id)) wp_die('Acceso restringido.', '', array('response'=>403));
	$asignado = (int)get_post_field('post_author', $id);
	$responsable = get_userdata($asignado);
	$revision = get_post_meta($id, '_qz_revision', true);
	$dictamen = qz_dictamen_actual($id);
	$producto = (int)get_post_meta($id, '_qz_producto', true);
	$aprobada = (bool)get_post_meta($id, '_qz_aprobacion', true);
	echo '<div class="wrap"><h1>Revisión comercial · Ficha #' . $id . '</h1><p>' . esc_html(get_the_title($id)) . '</p>';
	echo '<p>Responsable: ' . esc_html($responsable ? $responsable->display_name : 'Sin asignar') . '</p>';
	if ($dictamen) {
		echo '<div class="notice notice-warning inline"><p><strong>' . esc_html(ucfirst($dictamen['estado'])) . '</strong> · ' . esc_html(wp_date('d/m/Y H:i', $dictamen['fecha'])) . '</p><p>' . nl2br(esc_html($dictamen['motivo'])) . '</p></div>';
	}
	$historial = get_post_meta($id, '_qz_historial_dictamen');
	if ($historial) {
		echo '<details><summary>Decisiones anteriores</summary><ul>';
		foreach ($historial as $evento) echo '<li>' . esc_html(wp_date('d/m/Y H:i', $evento['fecha']) . ' · ' . ucfirst($evento['estado']) . ' · ' . $evento['motivo']) . '</li>';
		echo '</ul></details>';
	}
	if ($aprobada) {
		$aprobacion = get_post_meta($id, '_qz_aprobacion', true);
		$admin = get_userdata($aprobacion['usuario']);
		echo '<p>Aprobada por ' . esc_html($admin ? $admin->display_name : 'Administrador') . ' · ' . esc_html(wp_date('d/m/Y H:i', $aprobacion['fecha'])) . '</p>';
		echo '<p>' . (get_post_meta($id, '_qz_visible', true) ? 'Publicación web confirmada.' : 'Inventario aprobado. Comprobación web pendiente.') . '</p>';
		if ($producto && get_post_status($producto) === 'publish') {
			echo '<p><a href="' . esc_url(qz_inventario_url($producto)) . '">Ver vehículo en la web</a></p>';
			if (qz_revision_admin() && !get_post_meta($id, '_qz_visible', true)) {
				qz_revision_form($id, 'comprobar'); submit_button('Comprobar publicación'); echo '</form>';
			}
		}
	} else {
		if (qz_revision_admin()) {
			qz_revision_form($id, 'asignar');
			echo '<label>Asignar a <select required name="responsable"><option value="">Selecciona un consignador</option>';
			$equipo = get_users(array('role'=>'consignador'));
			foreach ($equipo as $user) {
				echo '<option value="' . intval($user->ID) . '" ' . selected($asignado, $user->ID, false) . '>' . esc_html($user->display_name) . '</option>';
			}
			echo '</select></label>'; submit_button('Guardar responsable'); echo '</form>';
			if (!$equipo) echo '<p>Para empezar, asigna el perfil Consignador a una cuenta del equipo en <a href="' . esc_url(admin_url('users.php')) . '">Usuarios</a>.</p>';
		}
		$fotos = qz_fotos_estado($id);
		if ($fotos['enviadas']) {
			echo '<h2>Fotos recibidas</h2><div style="display:flex;gap:12px;flex-wrap:wrap">';
			foreach ($fotos['guardadas'] as $n) {
				$url = add_query_arg(array('action'=>'qz_ver_foto','ficha'=>$id,'toma'=>$n), admin_url('admin-post.php'));
				echo '<a target="_blank" rel="noopener" href="' . esc_url($url) . '"><img loading="lazy" style="display:block;object-fit:contain;background:#eee" width="110" height="76" src="' . esc_url($url) . '" alt="">Foto ' . intval($n) . '</a>';
			}
			echo '</div>';
		} else {
			echo '<p>' . count($fotos['guardadas']) . ' de 20 fotos cargadas. La revisión se habilita al finalizar el envío.</p>';
		}
		if ($fotos['enviadas'] && $asignado === get_current_user_id() && in_array('consignador', wp_get_current_user()->roles, true)) {
			if ($dictamen) {
				echo '<p><a href="' . esc_url(get_edit_post_link($id, 'raw')) . '">Corregir datos de la ficha</a></p>';
				qz_revision_form($id, 'corregir_foto');
				echo '<input type="hidden" name="anterior" value="' . esc_attr($dictamen['token']) . '">';
				echo '<p><label>Toma a reemplazar <input required name="toma" type="number" min="1" max="20"></label> <label>Foto corregida (JPEG) <input required type="file" name="foto" accept="image/jpeg"></label></p>';
				submit_button('Guardar foto corregida', 'secondary'); echo '</form>';
			}
			qz_revision_form($id, 'revisar');
			echo '<input type="hidden" name="anterior" value="' . esc_attr($dictamen['token'] ?? ($revision['token'] ?? '')) . '">';
			echo '<p><label>Precio público (CLP) <input required type="number" name="precio" min="1" max="999999999999" value="' . esc_attr($revision['precio'] ?? '') . '"></label></p>';
			echo '<p><label>Foto de portada <input required type="number" name="portada" min="1" max="20" value="' . intval($revision['portada'] ?? 1) . '"></label></p>';
			submit_button($dictamen ? 'Reenviar para aprobación' : 'Confirmar revisión y proponer precio'); echo '</form>';
		}
		if ($revision) {
			echo '<p>Revisión registrada · Precio público $' . esc_html(number_format_i18n($revision['precio'], 0)) . ' CLP · Portada: foto ' . intval($revision['portada']) . '</p>';
			if (qz_revision_admin() && !$dictamen) {
				qz_revision_form($id, 'aprobar');
				echo '<input type="hidden" name="revision" value="' . esc_attr($revision['token']) . '">';
				submit_button('Aprobar y publicar en inventario'); echo '</form>';
				echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
				wp_nonce_field('qz_inventario_' . $id);
				echo '<input type="hidden" name="action" value="qz_inventario"><input type="hidden" name="id" value="' . $id . '"><input type="hidden" name="revision" value="' . esc_attr($revision['token']) . '">';
				echo '<p><label>Motivo para el consignador<br><textarea class="large-text" required maxlength="1500" name="motivo" rows="3"></textarea></label></p>';
				echo '<button class="button" name="operacion" value="devolver">Devolver para corrección</button> <button class="button" name="operacion" value="rechazar">Rechazar ficha</button></form>';
			}
		}
	}
	echo '<p><a href="' . esc_url(get_edit_post_link($id, 'raw')) . '">Volver a la ficha</a></p></div>';
}

// MySQL releases connection-scoped locks even when a PHP request times out.
function qz_revision_accion() {
	global $wpdb;
	$id = absint($_POST['id'] ?? 0);
	if (!qz_revision_permitida($id)) wp_die('Acceso restringido.', '', array('response'=>403));
	check_admin_referer('qz_inventario_' . $id);
	$op = sanitize_key($_POST['operacion'] ?? '');
	$admin = qz_revision_admin();
	if (!in_array($op, array('revisar','corregir_foto'), true) && !$admin) wp_die('Solo administración puede realizar esta acción.', '', array('response'=>403));
	$key = 'qz_rev_' . md5(DB_NAME . '/' . $wpdb->prefix . '/' . $id);
	if ((string)$wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s,0)', $key)) !== '1') wp_die('La ficha se está procesando. Reintenta en un momento.', '', array('response'=>409));
	$error = null;
	try {
		clean_post_cache($id);
		$responsable = (int)get_post_field('post_author', $id);
		$dictamen = qz_dictamen_actual($id);
		$anterior = get_post_meta($id, '_qz_revision', true);
		if (get_post_meta($id, '_qz_aprobacion', true)) {
			if ($op === 'comprobar') qz_inventario_comprobar($id);
			elseif ($op !== 'aprobar') throw new RuntimeException('Esta ficha ya fue aprobada.');
		} elseif ($op === 'asignar') {
			$user = get_userdata(absint($_POST['responsable'] ?? 0));
			if (!$user || !in_array('consignador', $user->roles, true)) throw new RuntimeException('Selecciona un consignador activo.');
			if ($responsable !== $user->ID) {
				if ($dictamen) {
					$dictamen['token'] = wp_generate_uuid4();
					if (!update_post_meta($id, '_qz_' . $dictamen['estado'], wp_slash($dictamen))) throw new RuntimeException('No se pudo renovar la corrección.');
				}
				add_post_meta($id, '_qz_consignador_user_id', $responsable, true);
				$saved = wp_update_post(array('ID'=>$id,'post_author'=>$user->ID,'post_status'=>'pending'), true);
				if (is_wp_error($saved)) throw new RuntimeException('No se pudo asignar la ficha.');
				delete_post_meta($id, '_qz_revision');
			}
		} elseif (in_array($op, array('devolver','rechazar'), true)) {
			qz_registrar_dictamen($id, $op, $anterior, $dictamen);
		} elseif (in_array($op, array('revisar','corregir_foto'), true)) {
			if (!$responsable || $responsable !== get_current_user_id() || !in_array('consignador', wp_get_current_user()->roles, true)) throw new RuntimeException('Solo el consignador asignado puede confirmar la revisión.');
			$esperado = $dictamen['token'] ?? ($anterior['token'] ?? '');
			if (!hash_equals($esperado, sanitize_text_field($_POST['anterior'] ?? ''))) throw new RuntimeException('La ficha cambió. Recárgala para continuar.');
			if ($op === 'corregir_foto') {
				if (!$dictamen) throw new RuntimeException('Las fotos solo se corrigen en fichas devueltas o rechazadas.');
				qz_corregir_foto($id, $dictamen);
			} else {
				$precio = (string)($_POST['precio'] ?? '');
				$portada = filter_var($_POST['portada'] ?? 0, FILTER_VALIDATE_INT);
				if (!preg_match('/^[1-9][0-9]{0,11}$/D', $precio) || !$portada || $portada < 1 || $portada > 20) throw new RuntimeException('Revisa el precio en pesos y el número de portada.');
				if (!qz_fotos_estado($id)['enviadas']) throw new RuntimeException('Falta el envío final de las 20 fotos.');
				$revision = array('token'=>wp_generate_uuid4(),'usuario'=>$responsable,'fecha'=>time(),'precio'=>$precio,'portada'=>$portada,'datos'=>qz_revision_campos($id));
				qz_guardar_reenvio($id, $revision, $dictamen);
			}
		} elseif ($op === 'aprobar') {
			if ($dictamen) throw new RuntimeException('El consignador debe corregir y reenviar la ficha antes de aprobarla.');
			qz_inventario_publicar($id, $responsable, sanitize_text_field($_POST['revision'] ?? ''));
		} else {
			throw new RuntimeException('Operación desconocida.');
		}
	} catch (Throwable $e) {
		$error = $e->getMessage();
	} finally {
		$wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)', $key));
	}
	if ($error !== null) wp_die(esc_html($error), 'Revisión comercial', array('response'=>409,'back_link'=>true));
	wp_safe_redirect(qz_revision_url($id)); exit;
}
add_action('admin_post_qz_inventario', 'qz_revision_accion');

function qz_inventario_web() {
	return defined('QZ_INVENTARIO_WEB') ? untrailingslashit(QZ_INVENTARIO_WEB) : 'https://www.quirozautomotriz.cl';
}

function qz_inventario_url($producto) {
	return qz_inventario_web() . '/vehiculo/' . get_post_field('post_name', $producto);
}

// Reuse completed photos after a timeout. Filenames only identify the inventory product and angle.
function qz_inventario_imagen($id, $producto, $toma) {
	global $wpdb;
	$nombre = 'vehiculo-' . $producto . '-foto-' . $toma;
	$jpeg = $wpdb->get_var($wpdb->prepare('SELECT jpeg FROM ' . qz_fotos_tabla() . ' WHERE ficha=%d AND toma=%d AND enviada=1', $id, $toma));
	$bytes = $jpeg ? base64_decode($jpeg, true) : false;
	if (!$bytes) throw new RuntimeException('No se pudo recuperar la foto ' . $toma . '.');
	// A failed publication may have staged the previous version of this angle.
	$nombre .= '-' . substr(hash('sha256', $bytes), 0, 16);
	$existente = get_posts(array('post_parent'=>$producto,'post_type'=>'attachment','post_status'=>'inherit','name'=>$nombre,'fields'=>'ids','numberposts'=>1));
	if ($existente) return (int)$existente[0];
	$archivo = wp_upload_bits($nombre . '.jpg', null, $bytes);
	if ($archivo['error']) throw new RuntimeException('No se pudo guardar la foto ' . $toma . ' en Medios.');
	$adjunto = wp_insert_attachment(array('post_title'=>$nombre,'post_name'=>$nombre,'post_mime_type'=>'image/jpeg','post_status'=>'inherit'), $archivo['file'], $producto, true);
	if (is_wp_error($adjunto)) {
		wp_delete_file($archivo['file']);
		throw new RuntimeException('No se pudo registrar la foto ' . $toma . '.');
	}
	require_once ABSPATH . 'wp-admin/includes/image.php';
	wp_update_attachment_metadata($adjunto, wp_generate_attachment_metadata($adjunto, $archivo['file']));
	return $adjunto;
}

function qz_inventario_publicar($id, $responsable, $token) {
	global $wpdb;
	$r = get_post_meta($id, '_qz_revision', true);
	$user = get_userdata($responsable);
	if (!$r || !hash_equals($r['token'], $token)) throw new RuntimeException('La revisión cambió. Recarga para comprobar el precio y la portada actuales.');
	if (!$r || !$user || !in_array('consignador', $user->roles, true) || $r['usuario'] !== $responsable || $r['datos'] !== qz_revision_campos($id)) {
		throw new RuntimeException('El responsable debe confirmar la revisión de los datos actuales antes de publicar.');
	}
	if (!class_exists('WC_Product_Simple') || !post_type_exists('product')) throw new RuntimeException('WooCommerce debe estar activo.');
	if (!qz_fotos_estado($id)['enviadas']) throw new RuntimeException('Se necesitan las 20 fotos finalizadas.');
	$d = $r['datos'];
	if (!$d['marca'] || !$d['modelo'] || !preg_match('/^(19|20)[0-9]{2}$/D', $d['anio'])) throw new RuntimeException('Revisa marca, modelo y año en la ficha y vuelve a confirmar la revisión.');
	$titulo = implode(' ', array_filter(array($d['marca'],$d['modelo'],$d['version'],$d['anio'])));
	$producto = (int)get_post_meta($id, '_qz_producto', true);
	if (!$producto) {
		$anteriores = get_posts(array('post_type'=>'product','post_status'=>'any','meta_key'=>'_qz_ficha_origen','meta_value'=>$id,'fields'=>'ids','numberposts'=>1));
		$producto = $anteriores ? (int)$anteriores[0] : wp_insert_post(wp_slash(array('post_type'=>'product','post_status'=>'draft','post_title'=>$titulo,'meta_input'=>array('_qz_ficha_origen'=>$id))), true);
		if (!$producto || is_wp_error($producto)) throw new RuntimeException('No se pudo preparar el producto.');
		update_post_meta($id, '_qz_producto', $producto);
	}
	if (get_post_type($producto) !== 'product' || get_post_status($producto) === 'trash' || (int)get_post_meta($producto, '_qz_ficha_origen', true) !== $id) throw new RuntimeException('Revisa el producto vinculado antes de volver a publicar.');
	$wc = new WC_Product_Simple($producto);
	$imagenes = array();
	foreach (range(1,20) as $n) $imagenes[$n] = qz_inventario_imagen($id, $producto, $n);
	// Discard superseded imports from this workflow before making the draft public.
	if (get_post_status($producto) === 'draft') {
		$adjuntos = get_posts(array('post_parent'=>$producto,'post_type'=>'attachment','post_status'=>'inherit','posts_per_page'=>-1));
		foreach ($adjuntos as $adjunto) {
			if (!in_array($adjunto->ID, $imagenes, true) && preg_match('/^vehiculo-' . $producto . '-foto-(?:[1-9]|1[0-9]|20)(?:-[a-f0-9]{16})?$/D', $adjunto->post_name)
				&& !wp_delete_attachment($adjunto->ID, true)) throw new RuntimeException('No se pudo retirar una toma anterior del borrador.');
		}
	}
	$wc->set_image_id($imagenes[$r['portada']]);
	unset($imagenes[$r['portada']]);
	$wc->set_gallery_image_ids(array_values($imagenes));
	$wc->set_name($titulo);
	$wc->set_regular_price($r['precio']);
	$wc->set_price($r['precio']);
	$wc->set_stock_status('instock');
	$wc->set_catalog_visibility('visible');
	if ($d['segmento']) {
		$categoria = get_term_by('name', $d['segmento'], 'product_cat');
		if ($categoria) $wc->set_category_ids(array($categoria->term_id));
	}
	$publicos = array('precio'=>(string)$r['precio']);
	foreach (array('kilometraje','combustible','transmision','cilindrada','color','cantidad_duenos') as $campo) $publicos[$campo] = $d[$campo];
	// Use this site's active ACF keys when present, including on newly created products.
	$claves = array();
	if (function_exists('acf_get_field_groups')) {
		foreach (acf_get_field_groups(array('post_type'=>'product','post_id'=>$producto)) as $grupo) {
			foreach ((array)acf_get_fields($grupo) as $campo) {
				if (isset($publicos[$campo['name']])) $claves[$campo['name']] = $campo['key'];
			}
		}
	}
	foreach ($publicos as $campo=>$valor) {
		if (isset($claves[$campo])) update_field($claves[$campo], $valor, $producto);
		else update_post_meta($producto, $campo, wp_slash($valor));
		if ((string)get_post_meta($producto, $campo, true) !== (string)$valor) throw new RuntimeException('No se pudo guardar el campo ' . $campo . '.');
	}
	// Keep the audit record and WooCommerce visibility together across failed requests.
	if ($wpdb->query('START TRANSACTION') === false) throw new RuntimeException('No se pudo iniciar la publicación.');
	try {
		$wc->set_status('publish');
		if (!$wc->save() || get_post_status($producto) !== 'publish') throw new RuntimeException('Falta confirmar la publicación en WooCommerce.');
		if (!add_post_meta($id, '_qz_aprobacion', array('usuario'=>get_current_user_id(),'fecha'=>time()), true)) throw new RuntimeException('No se pudo registrar la aprobación.');
		if ($wpdb->query('COMMIT') === false) throw new RuntimeException('No se pudo confirmar la publicación.');
	} catch (Throwable $error) {
		$wpdb->query('ROLLBACK');
		clean_post_cache($producto);
		clean_post_cache($id);
		wc_delete_product_transients($producto);
		throw $error;
	}
	if (!wp_next_scheduled('qz_comprobar_catalogo', array($id))) wp_schedule_single_event(time()+90, 'qz_comprobar_catalogo', array($id));
}

// Verify both public pages after their ISR refresh. Manual checking also works with WP-Cron disabled.
function qz_inventario_comprobar($id, $intento=1) {
	$producto = (int)get_post_meta($id, '_qz_producto', true);
	if (!$producto || !get_post_meta($id, '_qz_aprobacion', true) || get_post_status($producto) !== 'publish') return;
	$url = qz_inventario_url($producto);
	$ruta = wp_parse_url($url, PHP_URL_PATH);
	$opciones = array('timeout'=>15,'redirection'=>0);
	$home = wp_remote_get(qz_inventario_web() . '/', $opciones);
	if (wp_remote_retrieve_response_code($home) === 200 && strpos(wp_remote_retrieve_body($home), 'href="' . $ruta . '"') !== false) {
		$detalle = wp_remote_get($url, $opciones);
		$html = wp_remote_retrieve_body($detalle);
		if (wp_remote_retrieve_response_code($detalle) === 200 && strpos($html, '"@type":"Car"') !== false && strpos($html, $ruta) !== false) {
			update_post_meta($id, '_qz_visible', time());
			return;
		}
	}
	if ($intento < 5 && !wp_next_scheduled('qz_comprobar_catalogo', array($id,$intento+1))) {
		wp_schedule_single_event(time()+120, 'qz_comprobar_catalogo', array($id,$intento+1));
	}
}
add_action('qz_comprobar_catalogo', 'qz_inventario_comprobar', 10, 2);
