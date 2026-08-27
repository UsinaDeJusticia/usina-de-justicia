<?php
define('ABSPATH', '/fake/');
$GLOBALS['estado'] = array('admin'=>false,'preview'=>false,'logueado'=>false,'ajax'=>false,'cron'=>false);
class Redirigido extends Exception { public $codigo; public $destino;
    function __construct($c,$u){ $this->codigo=$c; $this->destino=$u; parent::__construct('redirect'); } }
function is_admin(){ return $GLOBALS['estado']['admin']; }
function is_preview(){ return $GLOBALS['estado']['preview']; }
function is_user_logged_in(){ return $GLOBALS['estado']['logueado']; }
function wp_doing_ajax(){ return $GLOBALS['estado']['ajax']; }
function wp_doing_cron(){ return $GLOBALS['estado']['cron']; }
function add_action($a,$b,$c=10){}
function esc_url_raw($u){ return filter_var($u, FILTER_VALIDATE_URL) ? $u : ''; }
function wp_redirect($u,$c){ throw new Redirigido($c,$u); }
require __DIR__ . '/usina-frente-al-sitio-publico.php';

function probar($ruta, $estado = array()) {
    $GLOBALS['estado'] = array_merge(array('admin'=>false,'preview'=>false,'logueado'=>false,'ajax'=>false,'cron'=>false), $estado);
    $_SERVER['REQUEST_URI'] = $ruta;
    try { usina_frente_al_sitio_publico(); return null; }
    catch (Redirigido $r) { return array($r->codigo, $r->destino); }
}
$casos = array(
    array('/',                              true,  'home del frente'),
    array('/2024/11/25/alguna-noticia',      true,  'noticia vieja con fecha'),
    array('/nosotros/',                      true,  'pagina del frente'),
    array('/?s=busqueda',                    true,  'busqueda'),
    array('/feed/',                          true,  'feed (no hay suscriptores)'),
    array('/wp-admin/',                      false, 'panel'),
    array('/wp-admin/post.php?post=1',       false, 'editar un post'),
    array('/wp-login.php',                   false, 'login'),
    array('/wp-json/wp/v2/posts',            false, 'API REST'),
    array('/wp-content/uploads/foto.jpg',    false, 'imagen de una noticia'),
    array('/wp-content/uploads/memoria.pdf', false, 'PDF de transparencia'),
    array('/wp-includes/js/algo.js',         false, 'script interno'),
    array('/wp-cron.php',                    false, 'cron'),
    array('/xmlrpc.php',                     false, 'xmlrpc'),
    array('/robots.txt',                     false, 'robots.txt'),
    array('/wp-sitemap.xml',                 false, 'sitemap de WP'),
);
$fallos = 0;
foreach ($casos as $c) {
    list($ruta, $espera, $desc) = $c;
    $r = probar($ruta); $hubo = $r !== null; $ok = $hubo === $espera;
    if (!$ok) $fallos++;
    printf("%-6s %-38s %-30s %s\n", $ok?'OK':'FALLA', $ruta, $desc, $hubo ? "{$r[0]} -> {$r[1]}" : 'no redirige');
}
echo "\n--- excepciones para el equipo ---\n";
foreach (array('logueado','preview','admin') as $e) {
    $r = probar('/2024/11/25/alguna-noticia', array($e=>true));
    $ok = $r === null; if (!$ok) $fallos++;
    printf("%-6s %-38s %s\n", $ok?'OK':'FALLA', "$e", $ok ? 'no redirige (correcto)' : "redirige {$r[0]}");
}
echo "\n--- conserva ruta y query ---\n";
$r = probar('/2024/11/25/nota?utm_source=facebook');
$esperado = 'https://www.usinadejusticia.org.ar/2024/11/25/nota?utm_source=facebook';
$ok = $r && $r[1] === $esperado && $r[0] === 301; if (!$ok) $fallos++;
printf("%-6s %s\n", $ok?'OK':'FALLA', $r ? "{$r[0]} -> {$r[1]}" : 'no redirigio');
echo "\n" . ($fallos === 0 ? "TODO OK" : "$fallos FALLOS") . "\n";
