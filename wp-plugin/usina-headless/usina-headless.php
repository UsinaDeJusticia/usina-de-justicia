<?php
/**
 * Plugin Name:       Usina Headless
 * Description:       Soporte headless para usinadejusticia.org.ar: re-habilita Application Passwords (algún plugin de seguridad las desactiva), deshabilita XML-RPC y prepara el sitio para el frontend Next.js. Parte del rebuild 2026.
 * Version:           0.1.0
 * Requires at least: 5.6
 * Requires PHP:      7.4
 * Author:            Usina de Justicia
 * License:           GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Application Passwords: WordPress las trae activas desde 5.6, pero en este
 * sitio algún plugin las desactiva vía filtro (la REST API devuelve
 * authentication: []). Prioridad 999 para correr después de quien las apaga.
 * Se usan para autenticar al usuario agente-migracion durante la migración;
 * al terminar, revocar la clave desde el perfil (el filtro puede quedar).
 */
add_filter( 'wp_is_application_passwords_available', '__return_true', 999 );

/**
 * XML-RPC: superficie de ataque histórica, nada del sitio lo usa
 * (higiene prevista en la Fase 2 del plan maestro).
 */
add_filter( 'xmlrpc_enabled', '__return_false' );

/**
 * Cabecera para verificar rápido que el plugin está activo,
 * sin exponer información sensible.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'usina-headless/v1', '/status', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return array(
				'plugin'  => 'usina-headless',
				'version' => '0.1.0',
				'app_passwords_available' => wp_is_application_passwords_available(),
			);
		},
	) );
} );
