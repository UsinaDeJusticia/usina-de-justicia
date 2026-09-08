// ============================================
// src/lib/imagenes.ts
// Elección del tamaño de imagen que corresponde a cada lugar del sitio.
//
// ---------------------------------------------------------------------------
// EL PROBLEMA QUE RESUELVE
// ---------------------------------------------------------------------------
// `wpPostToArticulo` tomaba `source_url` de WordPress, que es el archivo TAL
// CUAL se subió a la biblioteca de medios: sin recortar, a resolución
// completa. De las 824 notas con imagen destacada, 440 la tienen en PNG
// (auditoría sobre docs/inventario/posts.json) — o sea fotos guardadas en el
// peor formato posible para una foto.
//
// Con `unoptimized: true` en next.config.mjs (el freno de emergencia del
// 31-ago por la cuota agotada de Image Optimization), next/image emite ese
// archivo tal cual y NO genera srcset: los `sizes` que declaran los
// componentes quedan inertes. Así, un listado de /noticias con 12 tarjetas
// descarga 12 fotos a resolución de origen para mostrarlas a ~400 px.
//
// ---------------------------------------------------------------------------
// POR QUÉ NO CUESTA NADA ARREGLARLO
// ---------------------------------------------------------------------------
// WordPress YA generó las versiones chicas de cada imagen cuando se subió, y
// YA las manda en la misma respuesta: `getArticulos` pide `_embed`, y eso
// trae `media_details.sizes` con la URL, el ancho y el alto de cada tamaño.
// Hasta ahora se ignoraban. Usarlas no agrega una request, ni una
// transformación de Vercel, ni un archivo nuevo: son archivos que ya existen
// en el servidor de WordPress.
//
// ---------------------------------------------------------------------------
// EL CUIDADO QUE NO ES OBVIO: LOS RECORTES
// ---------------------------------------------------------------------------
// No todos los tamaños de WordPress conservan la proporción del original. El
// `thumbnail` por defecto viene RECORTADO a cuadrado, y los temas suelen
// agregar los suyos con recortes propios. Elegir uno de esos cambiaría el
// encuadre de la foto, no sólo su peso. Por eso `variantesDeMedia` descarta
// toda variante cuya proporción no coincida con la del original.
// ============================================

import type { ImageAsset, ImageVariante } from '@/types'
import type { WPMedia } from '@/types/wordpress'

/**
 * Tarjeta de listado (ArticleCard): 33vw en escritorio dentro de un
 * contenedor de 1200 px (~400 px) y 100vw en celular. 768 es el punto medio
 * razonable: cubre bien el escritorio en pantallas retina y deja las fotos
 * de un listado de 12 tarjetas en un peso manejable. Pedir el ancho de un
 * celular a 3x acá significaría multiplicar por 12 el peso de la página más
 * visitada del sitio.
 */
export const ANCHO_TARJETA = 768

/**
 * Hero editorial de la Home: 460 px en escritorio, 100vw en celular. Es la
 * imagen LCP de la portada —lleva `priority` y `fetchPriority="high"`— así
 * que acá la nitidez pesa más que los bytes.
 */
export const ANCHO_HERO_HOME = 1024

/** Imagen principal de una nota: 800 px de ancho renderizado. */
export const ANCHO_HERO_NOTA = 1024

/** Cuánto puede desviarse la proporción de una variante respecto del original. */
const TOLERANCIA_PROPORCION = 0.02

/** El origen de una URL, o `null` si no es absoluta o no se puede parsear. */
function origenDe(url: string): string | null {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

/**
 * Las variantes utilizables de una imagen de WordPress, de menor a mayor
 * ancho: las que `media_details.sizes` declara con la misma proporción que
 * el original, más el original.
 */
export function variantesDeMedia(media: WPMedia): ImageVariante[] {
  const ancho = media.media_details?.width
  const alto = media.media_details?.height
  const proporcionOriginal = ancho && alto ? ancho / alto : null
  const origenOriginal = origenDe(media.source_url)

  const vistas = new Set<string>()
  const variantes: ImageVariante[] = []

  const sumar = (url: string, w: number, h: number) => {
    if (!url || !w || !h || vistas.has(url)) return
    // Sólo variantes del mismo origen que el original. WordPress las genera
    // al lado del archivo, así que en condiciones normales esto siempre se
    // cumple — pero la CSP del sitio (next.config.mjs) declara `img-src` con
    // los hosts de WordPress y nada más. Si algún plugin llegara a reescribir
    // las URLs de los tamaños hacia un CDN, el navegador las bloquearía y el
    // listado entero se vería sin fotos. Con este filtro, en ese caso se cae
    // al original —que sí está permitido— en vez de romperse.
    if (origenOriginal !== null && origenDe(url) !== origenOriginal) return
    // Descarta los recortes (thumbnail cuadrado, tamaños propios del tema):
    // cambiarían el encuadre de la foto, no sólo su peso.
    if (
      proporcionOriginal !== null &&
      Math.abs(w / h - proporcionOriginal) / proporcionOriginal > TOLERANCIA_PROPORCION
    ) {
      return
    }
    vistas.add(url)
    variantes.push({ url, width: w, height: h })
  }

  for (const tamano of Object.values(media.media_details?.sizes ?? {})) {
    if (tamano) sumar(tamano.source_url, tamano.width, tamano.height)
  }
  // El original puede no aparecer en `sizes` (WordPress no siempre agrega la
  // entrada `full`), y es el que hace de último recurso.
  if (ancho && alto) sumar(media.source_url, ancho, alto)

  return variantes.sort((a, b) => a.width - b.width)
}

/**
 * La variante más chica que llega al ancho pedido. Si ninguna llega —una
 * foto subida chica, o una imagen sin variantes— devuelve la más grande
 * disponible: agrandar un archivo no agrega detalle, así que nunca se
 * "sube" de tamaño para cumplir el objetivo.
 *
 * Devuelve `undefined` sólo si no hay imagen, para que quien llame pueda
 * decidir el fallback.
 */
export function varianteParaAncho(
  imagen: ImageAsset | undefined,
  anchoMinimo: number
): ImageVariante | undefined {
  if (!imagen) return undefined

  const variantes = imagen.variantes
  if (!variantes || variantes.length === 0) {
    return { url: imagen.url, width: imagen.width, height: imagen.height }
  }

  return variantes.find((v) => v.width >= anchoMinimo) ?? variantes[variantes.length - 1]
}

/**
 * Atajo para los componentes: la URL de la variante que corresponde, con el
 * original como último recurso.
 */
export function urlParaAncho(
  imagen: ImageAsset | undefined,
  anchoMinimo: number
): string | undefined {
  return varianteParaAncho(imagen, anchoMinimo)?.url ?? imagen?.url
}
