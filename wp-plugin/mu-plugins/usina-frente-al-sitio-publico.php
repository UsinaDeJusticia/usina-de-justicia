<?php
/**
 * Plugin Name: Usina — el frente de wp. lleva al sitio público
 * Description: Manda al visitante de wp.usinadejusticia.org.ar al sitio público, sin tocar el panel, la API, los archivos ni la vista previa del equipo.
 * Version: 1.0.0
 * Author: Usina de Justicia
 *
 * ---------------------------------------------------------------------------
 * POR QUÉ EXISTE ESTE ARCHIVO
 * ---------------------------------------------------------------------------
 * Después del cutover, WordPress quedó viviendo en wp.usinadejusticia.org.ar
 * como gestor de contenido, y el sitio público pasó a ser otro. Pero el frente
 * viejo de WordPress seguía siendo visible ahí para cualquiera: una segunda
 * versión completa del sitio, en una dirección distinta.
 *
 * Eso trae dos problemas concretos. Una persona que llega por un link viejo ve
 * el sitio anterior y cree que es el actual. Y los buscadores indexan las dos
 * versiones, que compiten entre sí por las mismas búsquedas en vez de sumar.
 *
 * Este archivo manda al visitante a la dirección equivalente del sitio público,
 * conservando la ruta. Un 301 le dice además al buscador que la versión buena
 * es la nueva, y consolida ahí todo lo que el contenido tenía ganado.
 *
 * ---------------------------------------------------------------------------
 * LO QUE NO TOCA, Y POR QUÉ
 * ---------------------------------------------------------------------------
 * WordPress sigue siendo la fuente de todo el contenido del sitio nuevo, así
 * que la redirección tiene que ser quirúrgica. Quedan afuera:
 *
 *  - El panel y el login: el equipo entra a trabajar todos los días.
 *  - La API REST (/wp-json): es de donde el sitio nuevo lee las noticias.
 *    Si se redirigiera, el sitio público se quedaría sin contenido.
 *  - /wp-content y /wp-includes: las imágenes de las noticias y los PDFs de
 *    memorias y balances se sirven desde ahí. (En rigor esos archivos ni
 *    siquiera pasan por PHP, así que nunca llegarían hasta acá; están en la
 *    lista igual, para que quede explícito qué se está protegiendo.)
 *  - El cron y XML-RPC: infraestructura interna de WordPress.
 *  - robots.txt: se deja el de WordPress. Redirigirlo sería raro para los
 *    buscadores, y además tiene que seguir permitiendo el rastreo de
 *    /wp-content, porque las imágenes del sitio público viven ahí.
 *  - Los sitemaps de WordPress: las URLs que listan redirigen igual cuando
 *    el buscador las visita, así que no hace falta interceptarlos antes.
 *
 * Y dos exclusiones pensadas para el equipo, no para el público:
 *
 *  - Las vistas previas. Al redactar una noticia, "Vista previa" abre el
 *    frente de WordPress; sin esta excepción, el botón dejaría de servir.
 *  - Las personas con sesión iniciada. Quien está logueado puede seguir
 *    mirando el frente viejo si lo necesita. Los buscadores rastrean sin
 *    sesión, así que esto no afecta en nada al objetivo.
 *
 * ---------------------------------------------------------------------------
 * CÓMO SE QUITA
 * ---------------------------------------------------------------------------
 * Borrando este archivo. No tiene ajustes, no escribe en la base de datos y
 * no deja nada atrás.
 *
 * Una advertencia honesta sobre el 301: los navegadores lo guardan y no
 * vuelven a preguntar. Si algún día se quita este archivo, quien ya haya
 * sido redirigido va a seguir yendo al sitio público hasta que limpie los
 * datos de navegación. Es el comportamiento correcto para lo que se busca
 * acá, pero conviene saberlo antes de instalarlo, no después.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** Dirección del sitio público, sin barra final. */
const USINA_SITIO_PUBLICO = 'https://www.usinadejusticia.org.ar';

/**
 * Rutas que se sirven desde WordPress y no se redirigen nunca.
 * Se comparan contra el comienzo de la ruta pedida.
 */
const USINA_RUTAS_INTOCABLES = array(
    '/wp-admin',
    '/wp-login.php',
    '/wp-json',
    '/wp-content',
    '/wp-includes',
    '/wp-cron.php',
    '/xmlrpc.php',
    '/robots.txt',
    '/wp-sitemap',
);

add_action('template_redirect', 'usina_frente_al_sitio_publico', 1);

/**
 * Redirige el frente de WordPress al sitio público.
 *
 * Va enganchado a `template_redirect`, que corre solo cuando WordPress está por
 * dibujar una página del frente: ni el panel, ni la API REST, ni el login pasan
 * por acá. Las comprobaciones de abajo son la segunda línea de defensa.
 */
function usina_frente_al_sitio_publico()
{
    if (is_admin() || is_preview() || is_user_logged_in()) {
        return;
    }

    if (wp_doing_ajax() || wp_doing_cron()) {
        return;
    }

    if ((defined('REST_REQUEST') && REST_REQUEST) || (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST)) {
        return;
    }

    $ruta = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';

    // Sin la barra inicial no hay nada que comparar ni a dónde redirigir.
    if ($ruta === '' || $ruta[0] !== '/') {
        return;
    }

    foreach (USINA_RUTAS_INTOCABLES as $intocable) {
        if (strpos($ruta, $intocable) === 0) {
            return;
        }
    }

    // esc_url_raw() sanea la URL antes de mandarla en la cabecera Location.
    // La ruta viene del pedido, así que se trata como entrada externa.
    $destino = esc_url_raw(USINA_SITIO_PUBLICO . $ruta);

    if ($destino === '') {
        return;
    }

    wp_redirect($destino, 301);
    exit;
}
