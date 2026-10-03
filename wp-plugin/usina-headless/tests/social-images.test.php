<?php
// Pruebas del contrato editorial sin WordPress, red ni librerías nuevas.
define( 'ABSPATH', __DIR__ . '/' );
define( 'REST_REQUEST', true );
$actions = array();
$filters = array();
$notifications = array();
$metadata = array();
$sources = array();
$mimes = array();
$editors = 0;
$editor_failure = false;
$source_size = array( 'width' => 2400, 'height' => 1600 );
$resize_calls = array();
$post_media = 1;

function add_action( $name, $callback, $priority = 10, $argc = 1 ) { global $actions; $actions[$name] = $callback; }
function add_filter( $name, $callback, $priority = 10, $argc = 1 ) { global $filters; $filters[$name] = $callback; }
function register_activation_hook( $file, $callback ) {}
function register_deactivation_hook( $file, $callback ) {}
function wp_is_post_autosave( $id ) { return false; }
function wp_is_post_revision( $id ) { return false; }
function get_post_mime_type( $id ) { global $mimes; return $mimes[$id] ?? ''; }
function get_attached_file( $id ) { global $sources; return $sources[$id] ?? ''; }
function wp_basename( $path ) { return basename( $path ); }
function is_wp_error( $value ) { return $value instanceof WP_Error; }
class WP_Error {}
function get_post_thumbnail_id( $id ) { global $post_media; return $post_media; }
function wp_get_attachment_metadata( $id ) { global $metadata; return $metadata[$id] ?? array(); }
function wp_update_attachment_metadata( $id, $value ) { global $metadata; $metadata[$id] = usina_headless_social_variant( $value, $id ); return true; }
function get_option( $name, $default ) { return array( 'endpoint' => 'https://next.test/api/revalidate', 'secret' => 'local-test-secret' ); }
function wp_parse_args( $args, $defaults ) { return array_merge( $defaults, $args ); }
function wp_json_encode( $value ) { return json_encode( $value ); }
function wp_remote_post( $url, $args ) {
  global $notifications, $post_media;
  $notifications[] = array( 'body' => json_decode( $args['body'], true ), 'image' => wp_get_attachment_metadata( $post_media ) );
  return array( 'status' => 200 );
}
function wp_remote_retrieve_response_code( $response ) { return $response['status']; }
function wp_get_image_editor( $file ) {
  global $editors, $editor_failure, $source_size;
  $editors++;
  return $editor_failure ? new WP_Error() : new TestImageEditor( $source_size );
}
class TestImageEditor {
  private $size;
  public function __construct( $size ) { $this->size = $size; }
  public function set_quality( $quality ) { check( $quality === 82, 'calidad JPEG explícita' ); }
  public function get_size() { return $this->size; }
  public function resize( $width, $height, $crop ) {
    global $resize_calls;
    $resize_calls[] = array( $width, $height, $crop );
    $scale = min( $width / $this->size['width'], $height / $this->size['height'], 1 );
    $this->size = array( 'width' => (int) floor( $this->size['width'] * $scale ), 'height' => (int) floor( $this->size['height'] * $scale ) );
    return true;
  }
  public function save( $path, $mime ) {
    check( $mime === 'image/jpeg', 'JPEG explícito, sin depender del formato de origen' );
    file_put_contents( $path, 'test-jpeg' );
    return array_merge( $this->size, array( 'path' => $path ) );
  }
}
function check( $condition, $message ) { if ( ! $condition ) { throw new RuntimeException( $message ); } }

require dirname( __DIR__ ) . '/usina-headless.php';
$temp = sys_get_temp_dir() . '/usina-social-test-' . bin2hex( random_bytes( 6 ) );
mkdir( $temp );
try {
  check( $actions['rest_after_insert_post'] === 'usina_headless_on_rest_save_post', 'hook REST posterior al guardado' );
  check( $filters['wp_update_attachment_metadata'] === 'usina_headless_social_variant', 'sólo preparar imágenes al escribir metadata' );
  $sources[1] = $temp . '/foto.webp'; $mimes[1] = 'image/webp'; file_put_contents( $sources[1], 'original-one' );
  $metadata[1] = array( 'width' => 2400, 'height' => 1600, 'sizes' => array() );
  $post = (object) array( 'ID' => 10, 'post_status' => 'publish', 'post_name' => 'una-nota' );
  usina_headless_on_save_post( 10, $post, true );
  check( count( $notifications ) === 0 && $editors === 0, 'no avisar ni convertir antes de featured_media en REST' );
  usina_headless_on_rest_save_post( $post, null, false );
  $social = $metadata[1]['sizes']['usina-social'];
  check( $social['width'] === 1200 && $social['height'] === 800, 'conservar proporción y limitar tamaño' );
  check( $resize_calls[0] === array( 1200, 1200, false ), 'sin recorte' );
  check( $social['mime-type'] === 'image/jpeg' && $social['filesize'] > 0, 'metadata de tamaño compatible con REST de WP' );
  check( $notifications[0]['body']['paths'] === array( '/', '/noticias', '/noticias/una-nota' ), 'preservar rutas del webhook' );
  check( isset( $notifications[0]['image']['sizes']['usina-social'] ), 'JPEG existe antes de invalidar Next' );
  usina_headless_on_rest_save_post( $post, null, false );
  check( $editors === 1, 'no volver a procesar una imagen que ya existe' );
  file_put_contents( $sources[1], 'original-two' );
  wp_update_attachment_metadata( 1, $metadata[1] );
  check( $metadata[1]['sizes']['usina-social']['file'] !== $social['file'], 'cambiar bytes cambia la URL pública' );
  $sources[2] = $temp . '/pequena.avif'; $mimes[2] = 'image/avif'; file_put_contents( $sources[2], 'small' );
  $source_size = array( 'width' => 536, 'height' => 584 );
  $post_media = 2;
  usina_headless_on_rest_save_post( $post, null, false );
  check( $metadata[2]['sizes']['usina-social']['width'] === 536, 'AVIF pequeño no se amplía' );
  check( $notifications[2]['image']['sizes']['usina-social']['file'] !== $social['file'], 'cambiar destacada invalida con el nuevo archivo preparado' );
  $mimes[3] = 'image/jpeg'; $before = $editors;
  check( usina_headless_social_variant( array( 'width' => 800 ), 3 ) === array( 'width' => 800 ) && $editors === $before, 'JPEG existente no se procesa' );
  $editor_failure = true;
  $sources[4] = $temp . '/invalid.webp'; $mimes[4] = 'image/webp'; file_put_contents( $sources[4], 'invalid' );
  check( usina_headless_social_variant( array(), 4 ) === array(), 'fallo de decodificación no rompe guardado editorial' );
  $before = count( $notifications ); $post->post_status = 'draft';
  usina_headless_on_rest_save_post( $post, null, false );
  check( count( $notifications ) === $before, 'borradores no disparan webhook' );
  echo "PASS: generación editorial JPEG, caché, cambio de URL, proporción, AVIF, fallo y webhook REST\n";
} finally {
  foreach ( glob( $temp . '/*' ) as $file ) { unlink( $file ); }
  rmdir( $temp );
}
