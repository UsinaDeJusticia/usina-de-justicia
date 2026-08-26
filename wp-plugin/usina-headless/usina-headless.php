<?php
/**
 * Plugin Name:       Usina Headless
 * Description:       Soporte headless para usinadejusticia.org.ar: re-habilita Application Passwords, arregla el pasaje del header Authorization a PHP (.htaccess), deshabilita XML-RPC, y avisa al sitio Next.js cuando se publica/edita un post para que se actualice en segundos (revalidación instantánea) en vez de esperar hasta 5 minutos. Parte del rebuild 2026.
 * Version:           0.4.0
 * Requires at least: 5.6
 * Requires PHP:      7.4
 * Author:            Usina de Justicia
 * License:           GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Application Passwords: algún plugin de seguridad las desactiva vía filtro
 * (la REST API devolvía authentication: []). Prioridad 999 para correr después.
 */
add_filter( 'wp_is_application_passwords_available', '__return_true', 999 );

/**
 * XML-RPC: superficie de ataque histórica, nada del sitio lo usa
 * (higiene prevista en la Fase 2 del plan maestro).
 */
add_filter( 'xmlrpc_enabled', '__return_false' );

/**
 * El hosting no pasa el header Authorization a PHP, así que la autenticación
 * Basic de las Application Passwords llega vacía (verificado: users/me con
 * credenciales válidas devuelve rest_not_logged_in). Se agrega la regla
 * estándar al .htaccess con los marcadores de WP; se limpia al desactivar.
 */
function usina_headless_htaccess_rules() {
	return array(
		'<IfModule mod_rewrite.c>',
		'RewriteEngine On',
		'RewriteCond %{HTTP:Authorization} ^(.+)$',
		'RewriteRule ^ - [E=HTTP_AUTHORIZATION:%1]',
		'</IfModule>',
		'<IfModule mod_setenvif.c>',
		'SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1',
		'</IfModule>',
	);
}

register_activation_hook( __FILE__, function () {
	require_once ABSPATH . 'wp-admin/includes/misc.php';
	$htaccess = ABSPATH . '.htaccess';
	if ( file_exists( $htaccess ) && is_writable( $htaccess ) ) {
		insert_with_markers( $htaccess, 'Usina Headless', usina_headless_htaccess_rules() );
	}
} );

register_deactivation_hook( __FILE__, function () {
	require_once ABSPATH . 'wp-admin/includes/misc.php';
	$htaccess = ABSPATH . '.htaccess';
	if ( file_exists( $htaccess ) && is_writable( $htaccess ) ) {
		insert_with_markers( $htaccess, 'Usina Headless', array() );
	}
} );

/**
 * En FastCGI/LSAPI el header Authorization llega como HTTP_AUTHORIZATION pero
 * PHP no puebla PHP_AUTH_USER/PHP_AUTH_PW, que es lo que lee la autenticación
 * de Application Passwords. Se puebla temprano si falta (idempotente).
 */
add_action( 'plugins_loaded', function () {
	if ( ! empty( $_SERVER['PHP_AUTH_USER'] ) ) {
		return;
	}
	$header = ! empty( $_SERVER['HTTP_AUTHORIZATION'] )
		? $_SERVER['HTTP_AUTHORIZATION']
		: ( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '' );
	if ( 0 !== stripos( $header, 'Basic ' ) ) {
		return;
	}
	$decoded = base64_decode( substr( $header, 6 ), true );
	if ( false === $decoded || false === strpos( $decoded, ':' ) ) {
		return;
	}
	list( $u, $p ) = explode( ':', $decoded, 2 );
	$_SERVER['PHP_AUTH_USER'] = $u;
	$_SERVER['PHP_AUTH_PW']   = $p;
}, 1 );

/**
 * Endpoint de verificación y autodiagnóstico del pipeline de autenticación,
 * sin exponer secretos: estado de app passwords, si el header llega, si
 * PHP_AUTH_USER quedó poblado, qué usuario autenticó, el error real de
 * autenticación REST si lo hay, y qué callbacks interceptan la autenticación
 * (para identificar plugins que la bloquean).
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'usina-headless/v1', '/status', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			global $wp_filter;
			$hook_names = function ( $hook ) use ( $wp_filter ) {
				if ( empty( $wp_filter[ $hook ] ) ) {
					return array();
				}
				$out = array();
				foreach ( $wp_filter[ $hook ]->callbacks as $prio => $cbs ) {
					foreach ( $cbs as $cb ) {
						$f = $cb['function'];
						if ( is_string( $f ) ) {
							$out[] = "$f@$prio";
						} elseif ( is_array( $f ) ) {
							$out[] = ( is_object( $f[0] ) ? get_class( $f[0] ) : $f[0] ) . '::' . $f[1] . "@$prio";
						} else {
							$out[] = "closure@$prio";
						}
					}
				}
				return $out;
			};
			$user       = wp_get_current_user();
			$auth_error = apply_filters( 'rest_authentication_errors', null );
			$login      = $_SERVER['PHP_AUTH_USER'] ?? null;
			$wp_user    = $login ? get_user_by( 'login', $login ) : null;
			return array(
				'plugin'                  => 'usina-headless',
				'version'                 => '0.4.0',
				'app_passwords_available' => wp_is_application_passwords_available(),
				'auth_header_received'    => ! empty( $_SERVER['HTTP_AUTHORIZATION'] ) || ! empty( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ),
				'php_auth_user_set'       => ! empty( $_SERVER['PHP_AUTH_USER'] ),
				'user_exists'             => $wp_user instanceof WP_User,
				'app_passwords_for_user'  => $wp_user ? count( WP_Application_Passwords::get_user_application_passwords( $wp_user->ID ) ) : null,
				'available_for_user'      => $wp_user ? wp_is_application_passwords_available_for_user( $wp_user ) : null,
				'authenticated_user'      => $user->exists() ? $user->user_login : null,
				'rest_auth_error'         => is_wp_error( $auth_error ) ? $auth_error->get_error_code() . ': ' . $auth_error->get_error_message() : null,
				'hooks_determine_current_user' => $hook_names( 'determine_current_user' ),
				'hooks_authenticate'           => $hook_names( 'authenticate' ),
				'hooks_rest_authentication_errors' => $hook_names( 'rest_authentication_errors' ),
			);
		},
	) );
} );

// ============================================================
// v0.4.0 (26-ago-2026) — Revalidación instantánea del sitio Next.js
// ============================================================
// Todo lo de arriba (Application Passwords, XML-RPC, Authorization header,
// endpoint de diagnóstico) es v0.3.0 y ya está en producción — no se tocó
// nada de eso. Lo que sigue es exclusivamente nuevo: cuando se publica o
// edita un post, le avisa al endpoint /api/revalidate del sitio Next.js
// para que ese contenido se refresque en segundos en vez de esperar la
// ventana normal de hasta 5 minutos (ISR). Ver README.md de esta misma
// carpeta para instalación y docs/ESTADO.md (pendiente 11) para contexto.
//
// Nombres de función con prefijo usina_headless_ igual que el resto del
// archivo, sin colisión con ninguno de los ya existentes arriba.
// ============================================================

define( 'USINA_HEADLESS_REVALIDATE_OPTION', 'usina_headless_settings' );

/**
 * Endpoint por defecto: el dominio real del sitio. Configurable desde la
 * pantalla de ajustes para poder apuntar a un preview de Vercel mientras
 * se prueba, sin tocar código.
 */
function usina_headless_default_endpoint() {
	return 'https://www.usinadejusticia.org.ar/api/revalidate';
}

function usina_headless_get_revalidate_settings() {
	$defaults = array(
		'endpoint' => usina_headless_default_endpoint(),
		'secret'   => '',
	);
	$saved = get_option( USINA_HEADLESS_REVALIDATE_OPTION, array() );
	return wp_parse_args( $saved, $defaults );
}

/**
 * El secreto real a usar: la constante de wp-config.php gana si está
 * definida (más seguro, no vive en la base de datos); si no, el valor
 * guardado en la pantalla de ajustes.
 */
function usina_headless_get_revalidate_secret() {
	if ( defined( 'USINA_HEADLESS_REVALIDATE_SECRET' ) && USINA_HEADLESS_REVALIDATE_SECRET !== '' ) {
		return USINA_HEADLESS_REVALIDATE_SECRET;
	}
	$settings = usina_headless_get_revalidate_settings();
	return $settings['secret'];
}

function usina_headless_revalidate_secret_from_constant() {
	return defined( 'USINA_HEADLESS_REVALIDATE_SECRET' ) && USINA_HEADLESS_REVALIDATE_SECRET !== '';
}

/**
 * `save_post_post` solo se dispara para el post type 'post' (no páginas,
 * no adjuntos) — evita registrar el hook genérico `save_post` y tener que
 * filtrar el tipo a mano.
 */
add_action( 'save_post_post', 'usina_headless_on_save_post', 20, 3 );

function usina_headless_on_save_post( $post_id, $post, $update ) {
	// Autosaves, revisiones y guardados en papelera/borrador no deben
	// disparar un aviso: solo importa cuando el contenido que ve el
	// público realmente cambió.
	if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
		return;
	}
	if ( 'publish' !== $post->post_status ) {
		return;
	}

	$paths = array( '/', '/noticias', '/noticias/' . $post->post_name );

	usina_headless_send_revalidate( $paths );
}

/**
 * Hace el POST a /api/revalidate. `blocking = true` con timeout corto: se
 * espera la respuesta (para poder loguear un fallo real), pero sin demorar
 * el guardado del post más de lo tolerable — 5s es el mismo timeout que
 * usa src/lib/wordpress.ts del lado de Next.js para pedirle a esta misma
 * API, así que es un valor ya probado en este proyecto.
 *
 * Nunca lanza ni bloquea el flujo de publicación: cualquier fallo (sitio
 * caído, secreto sin configurar, timeout) se loguea y se sigue — el peor
 * caso es que ese contenido se actualiza solo con la demora normal de ISR
 * (hasta 5 minutos), no que el post deje de guardarse.
 */
function usina_headless_send_revalidate( $paths ) {
	$settings = usina_headless_get_revalidate_settings();
	$endpoint = $settings['endpoint'];
	$secret   = usina_headless_get_revalidate_secret();

	if ( empty( $endpoint ) || empty( $secret ) ) {
		error_log( '[usina-headless] endpoint o secreto sin configurar — no se avisa al sitio. Ver Ajustes → Usina Headless.' );
		return false;
	}

	$response = wp_remote_post(
		$endpoint,
		array(
			'timeout' => 5,
			'headers' => array( 'Content-Type' => 'application/json' ),
			// Nunca loguear $secret ni el body completo: podría filtrarse
			// a los logs del servidor.
			'body'    => wp_json_encode(
				array(
					'secret' => $secret,
					'paths'  => array_values( $paths ),
				)
			),
		)
	);

	if ( is_wp_error( $response ) ) {
		error_log( '[usina-headless] fallo de red al avisar al sitio: ' . $response->get_error_message() );
		return false;
	}

	$status = wp_remote_retrieve_response_code( $response );
	if ( 200 !== $status ) {
		// 401 = el secreto no coincide con REVALIDATE_SECRET en Vercel.
		error_log( '[usina-headless] el sitio respondió ' . $status . ' — revisar que el secreto coincida con el de Vercel.' );
		return false;
	}

	return true;
}

// ============================================================
// Pantalla de ajustes (Ajustes → Usina Headless)
// ============================================================

add_action( 'admin_menu', 'usina_headless_add_settings_page' );

function usina_headless_add_settings_page() {
	add_options_page(
		'Usina Headless',
		'Usina Headless',
		'manage_options',
		'usina-headless',
		'usina_headless_render_settings_page'
	);
}

add_action( 'admin_init', 'usina_headless_register_revalidate_settings' );

function usina_headless_register_revalidate_settings() {
	register_setting( 'usina_headless_group', USINA_HEADLESS_REVALIDATE_OPTION, 'usina_headless_sanitize_revalidate_settings' );
}

function usina_headless_sanitize_revalidate_settings( $input ) {
	$existing = usina_headless_get_revalidate_settings();
	return array(
		'endpoint' => isset( $input['endpoint'] ) ? esc_url_raw( trim( $input['endpoint'] ) ) : $existing['endpoint'],
		// Si el campo llega vacío al guardar (por ejemplo porque se dejó en
		// blanco a propósito) no se pisa el valor existente con '' — evita
		// perder el secreto por accidente al tocar "Guardar" sin querer
		// cambiarlo.
		'secret'   => isset( $input['secret'] ) && '' !== trim( $input['secret'] )
			? trim( $input['secret'] )
			: $existing['secret'],
	);
}

function usina_headless_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Acción del botón "Probar conexión" — nonce propio, no interfiere con
	// el guardado normal de ajustes.
	$test_result = null;
	if (
		isset( $_POST['usina_headless_test'] ) &&
		check_admin_referer( 'usina_headless_test_action', 'usina_headless_test_nonce' )
	) {
		$ok          = usina_headless_send_revalidate( array( '/' ) );
		$test_result = $ok ? 'ok' : 'error';
	}

	$settings      = usina_headless_get_revalidate_settings();
	$secret_locked = usina_headless_revalidate_secret_from_constant();
	?>
	<div class="wrap">
		<h1>Usina Headless</h1>
		<p>
			Avisa al sitio en Next.js cuando se publica o edita un post, para
			que se actualice en segundos en vez de esperar hasta 5 minutos.
			No afecta la publicación normal de WordPress si falla.
		</p>

		<?php if ( 'ok' === $test_result ) : ?>
			<div class="notice notice-success"><p>Conexión OK — el sitio respondió correctamente.</p></div>
		<?php elseif ( 'error' === $test_result ) : ?>
			<div class="notice notice-error"><p>No se pudo conectar o el secreto no coincide. Revisá el registro de errores de PHP (busca líneas que empiezan con <code>[usina-headless]</code>) para más detalle — nunca se loguea el secreto en sí.</p></div>
		<?php endif; ?>

		<form method="post" action="options.php">
			<?php settings_fields( 'usina_headless_group' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="usina_headless_endpoint">URL del endpoint</label></th>
					<td>
						<input
							type="url"
							id="usina_headless_endpoint"
							name="<?php echo esc_attr( USINA_HEADLESS_REVALIDATE_OPTION ); ?>[endpoint]"
							value="<?php echo esc_attr( $settings['endpoint'] ); ?>"
							class="regular-text"
							placeholder="<?php echo esc_attr( usina_headless_default_endpoint() ); ?>"
						/>
						<p class="description">Normalmente <code><?php echo esc_html( usina_headless_default_endpoint() ); ?></code>. Cambialo solo si estás probando contra un preview de Vercel.</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="usina_headless_secret">Secreto compartido</label></th>
					<td>
						<?php if ( $secret_locked ) : ?>
							<p><em>Definido en <code>wp-config.php</code> (<code>USINA_HEADLESS_REVALIDATE_SECRET</code>) — este campo queda sin usar mientras esa constante exista. Es la forma más segura, no hace falta tocar nada acá.</em></p>
						<?php else : ?>
							<input
								type="password"
								id="usina_headless_secret"
								name="<?php echo esc_attr( USINA_HEADLESS_REVALIDATE_OPTION ); ?>[secret]"
								value="<?php echo esc_attr( $settings['secret'] ); ?>"
								class="regular-text"
								autocomplete="off"
							/>
							<p class="description">
								Tiene que ser EXACTAMENTE el mismo valor que la variable de
								entorno <code>REVALIDATE_SECRET</code> en Vercel (Project
								Settings → Environment Variables). Si esa variable no existe
								todavía, generarla ahí primero.
							</p>
						<?php endif; ?>
					</td>
				</tr>
			</table>
			<?php submit_button( 'Guardar cambios' ); ?>
		</form>

		<hr />

		<form method="post">
			<?php wp_nonce_field( 'usina_headless_test_action', 'usina_headless_test_nonce' ); ?>
			<input type="hidden" name="usina_headless_test" value="1" />
			<?php submit_button( 'Probar conexión', 'secondary' ); ?>
		</form>
	</div>
	<?php
}
