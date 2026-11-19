<?php
defined('ABSPATH') || exit;

// Public intake accepts only application data. Ownership and status are assigned here.
add_action('rest_api_init', function () {
	register_rest_route('quiroz/v1', '/consignaciones', array(
		'methods' => 'POST', 'permission_callback' => '__return_true', 'callback' => 'qz_web_crear',
	));
});

function qz_web_crear($request) {
	global $wpdb;
	if (strlen($request->get_body()) > 12000) {
		return new WP_Error('tamano', 'Ficha demasiado grande.', array('status'=>413));
	}
	$body = $request->get_json_params();
	$key = $body['solicitud'] ?? null;
	$datos = $body['datos'] ?? null;
	$spam = $body['spam'] ?? null;
	if (!is_string($key) || !preg_match('/^[a-f0-9]{64}$/D', $key) || !is_array($datos)
		|| !is_array($spam) || ($spam['website'] ?? null) !== '' || !is_numeric($spam['startedAt'] ?? null)) {
		return new WP_Error('datos', 'Solicitud inválida.', array('status'=>400));
	}
	$age = microtime(true)*1000 - $spam['startedAt'];
	$map = array('Segmento Vehículo'=>'segmento_vehiculo','Participante'=>'participante','Fecha Ingreso'=>'fecha_ingreso',
		'Nombre'=>'nombre','Apellido'=>'apellido','RUT'=>'rut','Dirección'=>'direccion','Comuna'=>'comuna','Ciudad'=>'ciudad',
		'Teléfono'=>'telefono','Correo'=>'correo','¿Es propietario?'=>'es_propietario','Nombre propietario'=>'nombre_propietario',
		'Patente'=>'patente','Segmento'=>'segmento','Cantidad de dueños'=>'cantidad_duenos','Marca'=>'marca','Modelo'=>'modelo',
		'Versión'=>'version','Año'=>'anio','Cilindrada'=>'cilindrada','Transmisión'=>'transmision','Color'=>'color',
		'Combustible'=>'combustible','Kilometraje'=>'kilometraje','Servicios realizados o requeridos'=>'servicios',
		'Copia de llave'=>'copia_llave','Valor piso mínimo'=>'valor_piso_minimo','Observación'=>'observacion');
	$optional = array('participante','nombre_propietario','segmento','cantidad_duenos','servicios','observacion');
	$meta = array();
	foreach ($map as $label=>$field) {
		$value = $datos[$label] ?? '';
		if (!is_string($value) || strlen($value) > ($field === 'observacion' ? 8000 : 1200)) {
			return new WP_Error('campo', 'Campo inválido.', array('status'=>400));
		}
		$value = sanitize_textarea_field($value);
		if ($value === '' && !in_array($field, $optional, true)) {
			return new WP_Error('campo', 'Faltan datos requeridos.', array('status'=>400));
		}
		$meta['_qz_'.$field] = $value;
	}
	if ($age < 3000 || $age > DAY_IN_SECONDS*1000 || !is_email($meta['_qz_correo'])
		|| ($datos['Tipo de Operación'] ?? '') !== 'Consignación'
		|| ($meta['_qz_es_propietario'] === 'No' && !$meta['_qz_nombre_propietario'])) {
		return new WP_Error('datos', 'Revisa los datos de la ficha.', array('status'=>400));
	}
	// The unique option row serializes simultaneous retries in the same transaction.
	$name = 'qz_web_' . hash('sha256', $key);
	$fingerprint = hash('sha256', wp_json_encode($meta));
	$failure = new WP_Error('guardar', 'No pudimos guardar la ficha. Vuelve a intentar.', array('status'=>503));
	if (false === $wpdb->query('START TRANSACTION')) return $failure;
	try {
		$insert = $wpdb->query($wpdb->prepare("INSERT INTO $wpdb->options (option_name,option_value,autoload)
			VALUES (%s,'pending','no') ON DUPLICATE KEY UPDATE option_name=option_name", $name));
		if ($insert === false) throw new RuntimeException();
		$record = $wpdb->get_var($wpdb->prepare("SELECT option_value FROM $wpdb->options WHERE option_name=%s", $name));
		if ($record === null) throw new RuntimeException();
		$new = $record === 'pending';
		if ($new) {
			// Bound direct public writes as well as requests from the frontend.
			$bucket = 'qz_web_minute_' . gmdate('YmdHi');
			$count = (int)get_transient($bucket);
			if ($count >= 30) {
				$wpdb->query('ROLLBACK');
				return new WP_Error('limite','Intenta en un minuto.',array('status'=>429));
			}
			set_transient($bucket,$count+1,120);
			$meta['_qz_origen'] = 'web';
			$id = wp_insert_post(wp_slash(array('post_type'=>QZ_CONSIGNACIONES_POST_TYPE,'post_status'=>'pending',
				'post_author'=>0,'post_title'=>$meta['_qz_patente'].' — '.$meta['_qz_marca'].' '.$meta['_qz_modelo'],
				'meta_input'=>$meta)), true);
			if (is_wp_error($id) || !$id) throw new RuntimeException();
			foreach ($meta as $field=>$value) {
				if (get_post_meta($id,$field,true) !== $value) throw new RuntimeException();
			}
			$vence = time()+7*DAY_IN_SECONDS;
			if (!$wpdb->update($wpdb->options,array('option_value'=>wp_json_encode(array($id,$vence,$fingerprint))),array('option_name'=>$name))) throw new RuntimeException();
		} else {
			list($id,$vence,$original) = json_decode($record,true);
			if (!hash_equals($original,$fingerprint) || $vence < time() || !in_array(get_post_status($id),array('draft','pending','private','publish'),true)) {
				$wpdb->query('ROLLBACK');
				return new WP_Error('conflicto','Esta solicitud ya no está disponible.',array('status'=>409));
			}
		}
		if (false === $wpdb->query('COMMIT')) throw new RuntimeException();
	} catch (Throwable $e) {
		$wpdb->query('ROLLBACK');
		return $failure;
	}
	$response = new WP_REST_Response(array('id'=>(int)$id,'vence'=>$vence,'firma'=>qz_fotos_firma($id,$vence),'nueva'=>$new),$new ? 201 : 200);
	$response->header('Cache-Control','private, no-store');
	return $response;
}
