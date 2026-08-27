// ============================================
// src/lib/agent-negotiation.ts
// Negociación de contenido para agentes: decide si una request pide
// markdown en vez de HTML, siguiendo la convención de
// acceptmarkdown.com (Accept: text/markdown + Vary: Accept).
//
// Funciones puras, sin dependencias de Next.js: se usan tanto desde el
// middleware (runtime edge) como desde el route handler, y se testean
// directo en src/lib/__tests__/agent-negotiation.test.ts.
// ============================================

/** Tipo de medio que se sirve como markdown. RFC 7764 §2. */
export const MARKDOWN_MEDIA_TYPE = 'text/markdown; charset=utf-8'

/**
 * Header con el que el middleware le pasa a /api/md la ruta original que
 * pidió el cliente. Hace falta porque, después de un rewrite, el
 * `request.url` que ve un route handler es el de la request ORIGINAL: los
 * searchParams que agrega el middleware no llegan.
 */
export const MARKDOWN_PATH_HEADER = 'x-markdown-path'

interface AcceptEntry {
  type: string
  q: number
  /** Posición original: desempata cuando dos entradas tienen la misma q. */
  index: number
}

/**
 * Parsea un header `Accept` a entradas con su factor de calidad.
 *
 * Sigue RFC 9110 §12.5.1: el valor por defecto de `q` es 1, los valores
 * fuera de [0,1] o no numéricos se descartan cayendo a 1, y los parámetros
 * que no son `q` (por ejemplo el `variant=GFM` de RFC 7764) se ignoran para
 * el ordenamiento pero no invalidan la entrada.
 */
export function parseAcceptHeader(header: string | null): AcceptEntry[] {
  if (!header) return []

  return header
    .split(',')
    .map((part, index) => {
      const segments = part.trim().split(';')
      const type = segments[0]?.trim().toLowerCase() ?? ''
      if (!type) return null

      let q = 1
      for (const segment of segments.slice(1)) {
        const [rawKey, rawValue] = segment.split('=')
        if (rawKey?.trim().toLowerCase() !== 'q') continue
        const parsed = Number.parseFloat(rawValue ?? '')
        if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) q = parsed
      }

      return { type, q, index }
    })
    .filter((entry): entry is AcceptEntry => entry !== null)
}

/**
 * Devuelve la q efectiva con la que el cliente acepta `mediaType`,
 * considerando los comodines (`text/*`, `*​/*`). Un match exacto gana
 * sobre el comodín de subtipo, que a su vez gana sobre `*​/*` — así una
 * request con `Accept: text/markdown, *​/*;q=0.1` resuelve markdown en 1
 * y no en 0.1.
 */
function qualityFor(entries: AcceptEntry[], mediaType: string): number {
  const [group] = mediaType.split('/')

  const candidates: Array<{ q: number; specificity: number; index: number }> = []
  for (const entry of entries) {
    if (entry.type === mediaType) candidates.push({ ...entry, specificity: 3 })
    else if (entry.type === `${group}/*`) candidates.push({ ...entry, specificity: 2 })
    else if (entry.type === '*/*') candidates.push({ ...entry, specificity: 1 })
  }

  if (candidates.length === 0) return 0

  candidates.sort(
    (a, b) => b.specificity - a.specificity || b.q - a.q || a.index - b.index
  )
  return candidates[0].q
}

/**
 * `true` si el cliente prefiere markdown antes que HTML.
 *
 * Requiere que markdown gane estrictamente: un navegador manda
 * `text/html,...,*​/*;q=0.8`, donde markdown solo matchea vía `*​/*` y queda
 * por debajo de HTML — así que sigue recibiendo HTML, que es exactamente lo
 * que pide la convención (misma URL, representación según el consumidor).
 * El empate también va a HTML: sin una señal clara de preferencia, la
 * representación por defecto del sitio es la visual.
 */
export function prefersMarkdown(acceptHeader: string | null): boolean {
  const entries = parseAcceptHeader(acceptHeader)
  if (entries.length === 0) return false

  const markdownQ = qualityFor(entries, 'text/markdown')
  if (markdownQ === 0) return false

  return markdownQ > qualityFor(entries, 'text/html')
}

/**
 * Resuelve una ruta pedida por el cliente contra el origen del sitio, y
 * devuelve `null` si el resultado apunta a cualquier otro lado.
 *
 * Existe como función aparte, y no como un `if` dentro del handler, por dos
 * razones: es el único control de seguridad de `/api/md`, y necesita tests
 * propios que fijen los casos de evasión.
 *
 * **La validación es sobre el resultado, no sobre el texto de entrada.** Esa
 * es la parte que importa. La versión anterior comparaba el string
 * (`!path.startsWith('/') || path.startsWith('//')`) y era evadible: el
 * parser de URL del estándar trata la barra invertida como equivalente a la
 * barra en los esquemas http y https, y además descarta tabuladores y saltos
 * de línea en cualquier posición del input antes de parsear.
 *
 * Con eso, `/\ejemplo-ajeno.test` empieza con una sola barra y no empieza con
 * dos —o sea, pasaba el control— y sin embargo resuelve a un host arbitrario.
 * El endpoint quedaba convertido en un proxy abierto que devolvía contenido
 * de terceros bajo nuestro dominio. Lo mismo con `/<TAB>/otro-host`.
 *
 * Preguntar por `origin` cierra todas esas variantes de una sola vez, porque
 * no intenta adivinar las formas que puede tomar la entrada: mira dónde
 * terminó apuntando.
 */
export function resolveInternalUrl(path: string, origin: string): URL | null {
  let target: URL
  try {
    target = new URL(path, origin)
  } catch {
    return null
  }

  return target.origin === new URL(origin).origin ? target : null
}
