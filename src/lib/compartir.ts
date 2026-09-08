// ============================================
// src/lib/compartir.ts
// Armado de los enlaces para compartir una nota en redes sociales.
//
// ---------------------------------------------------------------------------
// POR QUÉ URLS PLANAS Y NO LOS BOTONES OFICIALES DE CADA RED
// ---------------------------------------------------------------------------
// La CSP del sitio (next.config.mjs) declara `script-src 'self'
// 'unsafe-inline'` y `connect-src 'self'` más los hosts de WordPress. Un SDK
// de Facebook, el widget de X o cualquier suite tipo AddThis quedaría
// bloqueado por el navegador **sin mostrar ningún error**: el botón se vería
// bien y no haría nada. Aflojar la CSP para que entren no está sobre la mesa.
//
// Y no hace falta: las cinco vías exponen un endpoint de "intención" que
// recibe la URL por query string y se abre con un `<a href>` común. Lo que se
// gana de paso:
//
//  - Cero JavaScript de terceros y cero cookies de tracking en las notas,
//    coherente con la postura de privacidad que el sitio ya sostiene (ver el
//    comentario de Referrer-Policy en next.config.mjs).
//  - Cero costo de consumo en Vercel: son atributos href renderizados en el
//    servidor dentro del HTML que el ISR ya cachea. No agregan una función,
//    ni un fetch a WordPress, ni una transformación de imagen.
//  - Funcionan sin JavaScript en el cliente.
//
// ---------------------------------------------------------------------------
// SIN DEPENDENCIAS A PROPÓSITO
// ---------------------------------------------------------------------------
// Este módulo importa únicamente site-config.ts (que no importa nada), así
// que la suite nativa (`pnpm test`) puede ejercitarlo sin arrastrar el árbol
// de dependencias de @/lib/utils. Por eso el recorte de título de más abajo
// es local y no reutiliza `truncate()` de utils.ts — que además agrega '...'
// (tres caracteres) donde acá conviene el '…' de uno solo.
// ============================================

import { siteConfig } from './site-config.ts'

export const REDES_COMPARTIR = [
  'whatsapp',
  'facebook',
  'x',
  'linkedin',
  'email',
] as const

export type RedCompartir = (typeof REDES_COMPARTIR)[number]

export interface NotaParaCompartir {
  /**
   * URL canónica ABSOLUTA de la nota — con esquema y con el host canónico
   * (www). Tiene que ser la misma que declara el `canonical` de la página:
   * es la que va a quedar registrada en cada red y la que Google consolida.
   */
  url: string
  /**
   * Título de la nota, ya decodificado. `wpPostToArticulo` lo pasa por
   * `decodeHtml` (src/lib/wordpress.ts), así que llega como texto limpio y
   * no como `&amp;` o `&#8220;`.
   */
  titulo: string
}

/**
 * Tope del título en el texto que se le pre-carga a X.
 *
 * X cuenta 280 caracteres y le asigna 23 fijos a cualquier URL, sin importar
 * su largo real. Los títulos de este sitio son largos de verdad: sobre los
 * 841 posts migrados (docs/inventario/posts.json) el más largo tiene 273
 * caracteres y hay 15 por encima de 200. Sin recorte, el compositor de X se
 * abre ya pasado del límite y la persona tiene que editar a mano justo
 * cuando quería compartir de un toque.
 *
 * 200 deja margen cómodo: 200 + 23 (URL) + 20 ("via @UsinadeJusticia") = 243.
 */
const MAX_TITULO_X = 200

/** Recorta en el último espacio antes del tope y cierra con puntos suspensivos. */
function recortar(texto: string, max: number): string {
  if (texto.length <= max) return texto
  return texto.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

/**
 * Usuario de X de la organización, derivado de la URL del perfil que ya vive
 * en site-config en vez de repetirlo acá: si algún día cambia el perfil,
 * cambia en un solo lugar. Acepta tanto x.com como twitter.com para que un
 * cambio de dominio en la config no rompa el `via`.
 *
 * Devuelve `null` si la URL no tiene la forma esperada — en ese caso el
 * enlace se arma sin `via`, que es degradarse bien: se comparte igual.
 */
function usuarioX(): string | null {
  const match = siteConfig.social.twitter?.match(
    /(?:twitter|x)\.com\/@?([A-Za-z0-9_]{1,15})/
  )
  return match ? match[1] : null
}

/**
 * URL de "compartir en <red>" para una nota.
 *
 * Todos los parámetros van codificados: los títulos traen tildes, comillas,
 * signos de pregunta y `&` con toda normalidad.
 */
export function compartirUrl(red: RedCompartir, nota: NotaParaCompartir): string {
  const { url, titulo } = nota

  switch (red) {
    case 'whatsapp':
      // `wa.me` es el enlace universal oficial: abre la app en el celular y
      // web.whatsapp.com en escritorio, sin que haya que detectar nada. Mismo
      // esquema que ya usa el contacto del sitio (siteConfig.contact.whatsapp).
      // El salto de línea separa el título de la URL para que WhatsApp arme
      // la vista previa del enlace debajo del texto.
      return `https://wa.me/?text=${encodeURIComponent(`${titulo}\n${url}`)}`

    case 'facebook':
      // Solo `u`, deliberadamente. Facebook dejó de respetar cualquier texto
      // pre-cargado (`quote`, `description`): arma la tarjeta leyendo las
      // etiquetas Open Graph de la nota. Mandar un texto que se va a ignorar
      // solo ensucia el enlace y hace creer que se puede controlar el copy.
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

    case 'x': {
      // URLSearchParams codifica solo; los espacios salen como '+', que X
      // interpreta bien en el compositor.
      const params = new URLSearchParams({
        text: recortar(titulo, MAX_TITULO_X),
        url,
      })
      const via = usuarioX()
      if (via) params.set('via', via)
      return `https://x.com/intent/tweet?${params.toString()}`
    }

    case 'linkedin':
      // Endpoint vigente de LinkedIn (el viejo `/shareArticle?mini=true`
      // sigue andando pero está deprecado). Como Facebook, ignora título y
      // resumen pre-cargados y arma la tarjeta con las Open Graph.
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

    case 'email':
      // Sin destinatario: lo pone quien comparte. El cuerpo repite el título
      // porque muchos clientes de correo no muestran el asunto al redactar.
      return `mailto:?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(
        `${titulo}\n\n${url}`
      )}`
  }
}

/** URL canónica absoluta de una nota, la misma que declara su `canonical`. */
export function urlCanonicaNota(slug: string): string {
  return `${siteConfig.url}/noticias/${slug}`
}
