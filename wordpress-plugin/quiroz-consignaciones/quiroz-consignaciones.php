<?php
/**
 * Plugin Name: Quiroz Automotriz — Consignaciones
 * Description: Registro interno de consignaciones con acceso limitado al autor y visibilidad completa para administradores.
 * Version: 1.4.1
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Quiroz Automotriz
 * Text Domain: quiroz-consignaciones
 */

if (!defined('ABSPATH')) {
	exit;
}

const QZ_CONSIGNACIONES_POST_TYPE = 'qz_consignacion';

/**
 * Capabilities for the private consignment records.
 *
 * @return array<string, string>
 */
function qz_consignaciones_capabilities() {
	return array(
		'edit_post'              => 'edit_qz_consignacion',
		'read_post'              => 'read_qz_consignacion',
		'delete_post'            => 'delete_qz_consignacion',
		'edit_posts'             => 'edit_qz_consignaciones',
		'edit_others_posts'      => 'edit_others_qz_consignaciones',
		'publish_posts'           => 'publish_qz_consignaciones',
		'read_private_posts'      => 'read_private_qz_consignaciones',
		'delete_posts'            => 'delete_qz_consignaciones',
		'delete_private_posts'    => 'delete_private_qz_consignaciones',
		'delete_published_posts'  => 'delete_published_qz_consignaciones',
		'delete_others_posts'     => 'delete_others_qz_consignaciones',
		'edit_private_posts'      => 'edit_private_qz_consignaciones',
		'edit_published_posts'    => 'edit_published_qz_consignaciones',
		'create_posts'            => 'create_qz_consignaciones',
	);
}

/** Register a non-public post type with WordPress ownership capabilities. */
function qz_consignaciones_register_post_type() {
	register_post_type(
		QZ_CONSIGNACIONES_POST_TYPE,
		array(
			'labels'             => array(
				'name'               => 'Consignaciones',
				'singular_name'      => 'Consignación',
				'menu_name'          => 'Consignaciones',
				'add_new'            => 'Nueva consignación',
				'add_new_item'       => 'Registrar consignación',
				'edit_item'          => 'Ver consignación',
				'new_item'           => 'Nueva consignación',
				'view_item'          => 'Ver consignación',
				'search_items'       => 'Buscar consignaciones',
				'not_found'          => 'No hay consignaciones',
				'not_found_in_trash' => 'No hay consignaciones en la papelera',
			),
			'public'             => false,
			'publicly_queryable'  => false,
			'exclude_from_search' => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_rest'        => false,
			'query_var'           => false,
			'rewrite'             => false,
			'has_archive'         => false,
			'menu_icon'           => 'dashicons-clipboard',
			'supports'            => array('title'),
			'capability_type'     => array('qz_consignacion', 'qz_consignaciones'),
			'capabilities'        => qz_consignaciones_capabilities(),
			'map_meta_cap'        => true,
		)
	);
}
add_action('init', 'qz_consignaciones_register_post_type');

/**
 * Grant consignadores access to their own records and administrators full access.
 * This runs on activation and on init so updated capabilities are applied safely.
 */
function qz_consignaciones_configure_roles() {
	$consignador_caps = array(
		'read'                    => true,
		'edit_qz_consignacion'    => true,
		'read_qz_consignacion'    => true,
		'edit_qz_consignaciones'   => true,
		'create_qz_consignaciones' => true,
	);

	$role = get_role('consignador');
	if (!$role) {
		$role = add_role('consignador', 'Consignador', $consignador_caps);
	}
	if ($role) {
		foreach ($consignador_caps as $capability => $grant) {
			$role->add_cap($capability, $grant);
		}
	}

	$administrator = get_role('administrator');
	if ($administrator) {
		foreach (array_keys(qz_consignaciones_capabilities()) as $capability_key) {
			$administrator->add_cap(qz_consignaciones_capabilities()[$capability_key]);
		}
	}
}
register_activation_hook(__FILE__, 'qz_consignaciones_configure_roles');
add_action('init', 'qz_consignaciones_configure_roles', 20);

/** Keep each consignment assigned to the authenticated consignador. */
function qz_consignaciones_enforce_author($data, $postarr) {
	if (
		isset($data['post_type']) && QZ_CONSIGNACIONES_POST_TYPE === $data['post_type'] &&
		is_user_logged_in() && !current_user_can('edit_others_qz_consignaciones')
	) {
		$data['post_author'] = get_current_user_id();
		if (isset($data['post_status']) && 'publish' === $data['post_status']) {
			$data['post_status'] = 'pending';
		}
	}
	return $data;
}
add_filter('wp_insert_post_data', 'qz_consignaciones_enforce_author', 10, 2);

/** Limit the admin list itself, including searches and filters, to the signed-in author. */
function qz_consignaciones_limit_admin_list($query) {
	if (
		is_admin() && $query->is_main_query() &&
		QZ_CONSIGNACIONES_POST_TYPE === $query->get('post_type') &&
		!current_user_can('edit_others_qz_consignaciones')
	) {
		$query->set('author', get_current_user_id());
	}
}
add_action('pre_get_posts', 'qz_consignaciones_limit_admin_list');

/** Fields shown on an internal consignment record. */
function qz_consignaciones_fields() {
	return array(
		'owner' => array(
			'label' => 'Datos del propietario',
			'fields' => array(
				'nombre' => array('Nombre', 'text'),
				'apellido' => array('Apellido', 'text'),
				'rut' => array('RUT', 'text'),
				'direccion' => array('Dirección', 'text'),
				'comuna' => array('Comuna', 'text'),
				'ciudad' => array('Ciudad', 'text'),
				'telefono' => array('Teléfono', 'tel'),
				'correo' => array('Correo', 'email'),
				'es_propietario' => array('¿Es propietario?', 'text'),
				'nombre_propietario' => array('Nombre del propietario', 'text'),
			),
		),
		'vehicle' => array(
			'label' => 'Datos del vehículo',
			'fields' => array(
				'fecha_ingreso' => array('Fecha de ingreso', 'date'),
				'participante' => array('Participante', 'text'),
				'segmento_vehiculo' => array('Segmento del vehículo', 'text'),
				'patente' => array('Patente', 'text'),
				'segmento' => array('Segmento', 'text'),
				'cantidad_duenos' => array('Cantidad de dueños', 'number'),
				'marca' => array('Marca', 'text'),
				'modelo' => array('Modelo', 'text'),
				'version' => array('Versión', 'text'),
				'anio' => array('Año', 'number'),
				'cilindrada' => array('Cilindrada', 'text'),
				'transmision' => array('Transmisión', 'text'),
				'color' => array('Color', 'text'),
				'combustible' => array('Combustible', 'text'),
				'kilometraje' => array('Kilometraje', 'number'),
				'servicios' => array('Servicios realizados o requeridos', 'textarea'),
				'copia_llave' => array('Copia de llave', 'text'),
				'valor_piso_minimo' => array('Valor piso mínimo (CLP)', 'number'),
				'observacion' => array('Observación', 'textarea'),
			),
		),
	);
}

/** Add the owner and vehicle data form to the private editor. */
function qz_consignaciones_add_meta_boxes() {
	add_meta_box(
		'qz-consignacion-details',
		'Ficha de consignación',
		'qz_consignaciones_render_meta_box',
		QZ_CONSIGNACIONES_POST_TYPE,
		'normal',
		'high'
	);
}
add_action('add_meta_boxes_' . QZ_CONSIGNACIONES_POST_TYPE, 'qz_consignaciones_add_meta_boxes');

function qz_consignaciones_render_meta_box($post) {
	wp_nonce_field('qz_save_consignacion', 'qz_consignacion_nonce');
	$author = get_userdata((int) $post->post_author);
	$author_label = $author ? $author->display_name . ' (' . $author->user_email . ')' : 'Sin asignar';
	$created_at = get_post_time('d/m/Y H:i', false, $post);
	?>
	<p><strong>Responsable actual:</strong> <?php echo esc_html($author_label); ?>
		<?php if (get_post_meta($post->ID, '_qz_origen', true) === 'web') : ?><span> · Formulario web</span><?php endif; ?>
		<span style="margin-left:12px"><strong>Fecha de registro:</strong> <?php echo esc_html($created_at); ?></span>
	</p>
	<?php foreach (qz_consignaciones_fields() as $section) : ?>
		<h3><?php echo esc_html($section['label']); ?></h3>
		<table class="form-table" role="presentation"><tbody>
		<?php foreach ($section['fields'] as $key => $field) :
			$value = get_post_meta($post->ID, '_qz_' . $key, true);
			$input_id = 'qz-consignacion-' . $key;
			?>
			<tr>
				<th scope="row"><label for="<?php echo esc_attr($input_id); ?>"><?php echo esc_html($field[0]); ?></label></th>
				<td>
					<?php if ('textarea' === $field[1]) : ?>
						<textarea id="<?php echo esc_attr($input_id); ?>" name="qz_consignacion[<?php echo esc_attr($key); ?>]" rows="3" class="large-text"><?php echo esc_textarea($value); ?></textarea>
					<?php else : ?>
						<input id="<?php echo esc_attr($input_id); ?>" name="qz_consignacion[<?php echo esc_attr($key); ?>]" type="<?php echo esc_attr($field[1]); ?>" value="<?php echo esc_attr($value); ?>" class="regular-text" <?php echo 'number' === $field[1] ? 'min="0" step="1"' : ''; ?>>
					<?php endif; ?>
				</td>
			</tr>
		<?php endforeach; ?>
		</tbody></table>
	<?php endforeach;
}

/** Persist only allowlisted fields; the author is stored by WordPress as post_author. */
function qz_consignaciones_save_meta($post_id, $post) {
	if (
		!isset($_POST['qz_consignacion_nonce']) ||
		!wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['qz_consignacion_nonce'])), 'qz_save_consignacion') ||
		(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) ||
		wp_is_post_revision($post_id) ||
		!current_user_can('edit_post', $post_id)
	) {
		return;
	}

	$submitted = isset($_POST['qz_consignacion']) && is_array($_POST['qz_consignacion'])
		? wp_unslash($_POST['qz_consignacion'])
		: array();
	$fields = qz_consignaciones_fields();

	foreach ($fields as $section) {
		foreach ($section['fields'] as $key => $field) {
			if (!array_key_exists($key, $submitted) || is_array($submitted[$key])) {
				continue;
			}
			$value = 'textarea' === $field[1]
				? sanitize_textarea_field($submitted[$key])
				: sanitize_text_field($submitted[$key]);
			if ('email' === $field[1]) {
				$value = sanitize_email($submitted[$key]);
			}
			update_post_meta($post_id, '_qz_' . $key, $value);
		}
	}

	if (!metadata_exists('post', $post_id, '_qz_consignador_user_id')) {
		add_post_meta($post_id, '_qz_consignador_user_id', (int) $post->post_author, true);
	}

	$plate = get_post_meta($post_id, '_qz_patente', true);
	$vehicle = trim(implode(' ', array_filter(array(
		get_post_meta($post_id, '_qz_marca', true),
		get_post_meta($post_id, '_qz_modelo', true),
	))));
	$title = trim(implode(' — ', array_filter(array($plate, $vehicle))));
	if ('' === $title) {
		$title = 'Consignación #' . $post_id;
	}
	if ($title !== $post->post_title) {
		remove_action('save_post_' . QZ_CONSIGNACIONES_POST_TYPE, 'qz_consignaciones_save_meta', 10);
		wp_update_post(array('ID' => $post_id, 'post_title' => $title));
		add_action('save_post_' . QZ_CONSIGNACIONES_POST_TYPE, 'qz_consignaciones_save_meta', 10, 2);
	}
}
add_action('save_post_' . QZ_CONSIGNACIONES_POST_TYPE, 'qz_consignaciones_save_meta', 10, 2);

/** Show the consignment owner and plate in the admin list. */
function qz_consignaciones_columns($columns) {
	return array(
		'cb'                   => isset($columns['cb']) ? $columns['cb'] : '',
		'title'                => 'Vehículo',
		'qz_patente'           => 'Patente',
		'author'               => 'Consignador',
		'date'                 => 'Fecha',
	);
}
add_filter('manage_' . QZ_CONSIGNACIONES_POST_TYPE . '_posts_columns', 'qz_consignaciones_columns');

function qz_consignaciones_column_content($column, $post_id) {
	if ('qz_patente' === $column) {
		echo esc_html(get_post_meta($post_id, '_qz_patente', true));
	} elseif ('author' === $column) {
		$author = get_userdata((int) get_post_field('post_author', $post_id));
		echo $author ? esc_html($author->display_name) : '—';
	}
}
add_action('manage_' . QZ_CONSIGNACIONES_POST_TYPE . '_posts_custom_column', 'qz_consignaciones_column_content', 10, 2);

require_once __DIR__ . '/fotografias.php';
require_once __DIR__ . '/solicitudes.php';
require_once __DIR__ . '/inventario.php';
require_once __DIR__ . '/bandeja.php';

register_deactivation_hook(__FILE__, function () {
	wp_clear_scheduled_hook('qz_fotos_limpiar');
});
