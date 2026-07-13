<?php
/**
 * Plugin Name:       Usina Headless
 * Description:       Soporte headless para usinadejusticia.org.ar: re-habilita Application Passwords, arregla el pasaje del header Authorization a PHP (.htaccess), deshabilita XML-RPC y prepara el sitio para el frontend Next.js. Parte del rebuild 2026.
 * Version:           0.3.0
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
				'version'                 => '0.3.0',
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
