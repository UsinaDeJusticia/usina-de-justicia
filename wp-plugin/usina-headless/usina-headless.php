<?php
/**
 * Plugin Name:       Usina Headless
 * Description:       Soporte headless para usinadejusticia.org.ar: re-habilita Application Passwords, arregla el pasaje del header Authorization a PHP (.htaccess), deshabilita XML-RPC y prepara el sitio para el frontend Next.js. Parte del rebuild 2026.
 * Version:           0.2.0
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
 * Endpoint de verificación: además del estado del plugin, informa si el
 * header Authorization llega a PHP y qué usuario autenticó (autodiagnóstico
 * del pipeline de credenciales, sin exponer secretos).
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'usina-headless/v1', '/status', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$user = wp_get_current_user();
			return array(
				'plugin'                   => 'usina-headless',
				'version'                  => '0.2.0',
				'app_passwords_available'  => wp_is_application_passwords_available(),
				'auth_header_received'     => ! empty( $_SERVER['HTTP_AUTHORIZATION'] ) || ! empty( $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ),
				'authenticated_user'       => $user->exists() ? $user->user_login : null,
			);
		},
	) );
} );
