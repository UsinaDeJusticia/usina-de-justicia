// ============================================
// src/lib/html-to-markdown.ts
// Conversor HTML → Markdown enfocado, sin dependencias nuevas.
//
// Por qué propio y no `turndown`: solo se corre sobre el HTML que este
// mismo repo renderiza (o sobre el de WordPress ya saneado por
// `cleanWPContent`), no sobre HTML arbitrario de internet. Mismo criterio
// que se usó para no meter el SDK de Resend en /api/contact: la política de
// supply-chain del proyecto (`minimumReleaseAge: 10080`) hace que cada
// dependencia nueva tenga un costo real.
//
// Implementación: un recorrido secuencial de tokens, NO una lista blanca de
// etiquetas de bloque. La primera versión solo miraba <p>, <h1-6>, <ul>,
// <table>… y perdía todo lo que el sitio maqueta con <div>/<span> — entre
// otras cosas los datos bancarios de /donar (CBU, alias, CUIT), que son
// literalmente el contenido más importante de esa página. Un recorrido con
// pila también resuelve el anidamiento sin tener que buscar el cierre
// balanceado de cada etiqueta a mano.
// ============================================

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  laquo: '«',
  raquo: '»',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  aacute: 'á',
  eacute: 'é',
  iacute: 'í',
  oacute: 'ó',
  uacute: 'ú',
  ntilde: 'ñ',
  Aacute: 'Á',
  Eacute: 'É',
  Iacute: 'Í',
  Oacute: 'Ó',
  Uacute: 'Ú',
  Ntilde: 'Ñ',
  uuml: 'ü',
  Uuml: 'Ü',
  deg: '°',
  euro: '€',
  pound: '£',
}

/**
 * Convierte un punto de código numérico en carácter, o devuelve `null` si no
 * es uno válido.
 *
 * `String.fromCodePoint` lanza `RangeError` con cualquier valor por encima de
 * U+10FFFF. Como esta función procesa HTML que viene de WordPress, una
 * entidad como `&#x110000;` —que se escribe sola, sin ninguna herramienta
 * especial— tumbaba la conversión entera con una excepción no capturada, y
 * en `/api/md` eso era un error 500.
 */
function codePointToChar(codePoint: number): string | null {
  if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
    return null
  }
  return String.fromCodePoint(codePoint)
}

export function decodeEntities(input: string): string {
  return input
    .replace(
      /&#x([0-9a-fA-F]+);/g,
      (match, hex) => codePointToChar(Number.parseInt(hex, 16)) ?? match
    )
    .replace(
      /&#(\d+);/g,
      (match, dec) => codePointToChar(Number.parseInt(dec, 10)) ?? match
    )
    .replace(/&([a-zA-Z]+);/g, (match, name) => NAMED_ENTITIES[name] ?? match)
}

/** Etiquetas cuyo contenido completo se descarta. */
const DROPPED = new Set(['script', 'style', 'noscript', 'svg', 'template', 'iframe'])

/** No cierran: no participan del conteo de profundidad. */
const VOID_ELEMENTS = new Set([
  'br',
  'img',
  'input',
  'hr',
  'meta',
  'link',
  'source',
  'path',
  'circle',
  'area',
  'col',
  'embed',
  'track',
  'wbr',
])

/**
 * Etiquetas que cierran el párrafo en curso. `span`, `a`, `strong`, `em`,
 * `code`, `small`, `time` y `sup` quedan afuera a propósito: son inline y
 * tienen que acumularse en la misma línea.
 */
const FLUSH_ON = new Set([
  'p',
  'div',
  'section',
  'article',
  'header',
  'footer',
  'main',
  'aside',
  'nav',
  'form',
  'fieldset',
  'figure',
  'figcaption',
  'address',
  'details',
  'summary',
  'dl',
  'dt',
  'dd',
  'label',
  'button',
  'select',
  'textarea',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'td',
  'th',
  'blockquote',
  'pre',
])

export function extractMainContent(html: string): string {
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html)
  if (main) return main[1]

  const body = /<body\b[^>]*>([\s\S]*?)<\/body>/i.exec(html)
  if (body) return body[1]

  return html
}

function resolveUrl(href: string, baseUrl: string | undefined): string {
  if (!baseUrl) return href
  try {
    return new URL(href, baseUrl).toString()
  } catch {
    return href
  }
}

function attribute(attrs: string, name: string): string | null {
  const match = new RegExp(`\\b${name}=["']([^"']*)["']`, 'i').exec(attrs)
  return match ? match[1] : null
}

function tidy(text: string): string {
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/ ([.,;:!?)])/g, '$1')
    .replace(/\( /g, '(')
    .trim()
}

interface ListFrame {
  ordered: boolean
  index: number
}

/**
 * Convierte un fragmento de HTML a Markdown.
 *
 * `baseUrl` se usa para volver absolutos los enlaces relativos: un agente
 * que recibe el markdown de /acompanamiento tiene que poder seguir un
 * `/necesito-ayuda` sin reconstruir el origen a mano.
 */
export function htmlToMarkdown(html: string, baseUrl?: string): string {
  const blocks: string[] = []
  let inline = ''

  // Estado de contexto
  let headingLevel = 0
  const lists: ListFrame[] = []
  let inBlockquote = 0
  let linkHref: string | null = null
  let linkText = ''

  // Tabla en curso
  let tableDepth = 0
  let rows: string[][] = []
  let row: string[] | null = null
  let inCell = false

  /** Profundidad restante de un subárbol que hay que ignorar por completo. */
  let skipTag: string | null = null
  let skipDepth = 0

  const append = (text: string) => {
    if (linkHref !== null) linkText += text
    else inline += text
  }

  const flush = () => {
    const text = tidy(inline)
    inline = ''
    if (!text) return

    if (headingLevel > 0) {
      blocks.push(`${'#'.repeat(headingLevel)} ${text}`)
      return
    }
    if (lists.length > 0) {
      const frame = lists[lists.length - 1]
      const indent = '  '.repeat(lists.length - 1)
      frame.index += 1
      blocks.push(`${indent}${frame.ordered ? `${frame.index}.` : '-'} ${text}`)
      return
    }
    if (inBlockquote > 0) {
      blocks.push(`> ${text}`)
      return
    }
    blocks.push(text)
  }

  const emitTable = () => {
    if (rows.length === 0) return
    const width = Math.max(...rows.map((r) => r.length))
    const pad = (r: string[]) =>
      `| ${Array.from({ length: width }, (_, i) => r[i] ?? '').join(' | ')} |`
    const [header, ...body] = rows
    blocks.push(
      [
        pad(header),
        `| ${Array.from({ length: width }, () => '---').join(' | ')} |`,
        ...body.map(pad),
      ].join('\n')
    )
    rows = []
  }

  const tokens = html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)(\/?)>|([^<]+)/g)

  for (const token of tokens) {
    const [, closing, rawName, attrs = '', selfClosing, text] = token

    // --- texto ---
    if (text !== undefined) {
      if (skipTag) continue
      append(decodeEntities(text).replace(/\s+/g, ' '))
      continue
    }

    const name = rawName.toLowerCase()
    const isClose = closing === '/'

    // --- subárbol ignorado (script, svg, aria-hidden) ---
    if (skipTag) {
      if (name !== skipTag || VOID_ELEMENTS.has(name)) continue
      if (isClose) {
        skipDepth -= 1
        if (skipDepth === 0) skipTag = null
      } else if (!selfClosing) {
        skipDepth += 1
      }
      continue
    }

    if (!isClose && (DROPPED.has(name) || attribute(attrs, 'aria-hidden') === 'true')) {
      // Los íconos de lucide-react y el avatar de iniciales de Testimonios
      // llevan aria-hidden: para un agente son ruido, igual que para un
      // lector de pantalla.
      if (!selfClosing && !VOID_ELEMENTS.has(name)) {
        skipTag = name
        skipDepth = 1
      }
      continue
    }

    if (name === 'br') {
      flush()
      continue
    }
    if (VOID_ELEMENTS.has(name) || selfClosing) continue

    // --- inline ---
    if (name === 'a') {
      if (!isClose) {
        // Sin flush: el enlace es inline y tiene que quedar en la misma
        // línea que el texto que lo rodea ("Ver [ayuda](…)").
        linkHref = attribute(attrs, 'href')
        linkText = ''
      } else if (linkHref !== null) {
        const label = tidy(linkText)
        const href = linkHref
        linkHref = null
        linkText = ''
        if (label) {
          inline += href ? `[${label}](${resolveUrl(href, baseUrl)})` : label
        }
      }
      continue
    }

    if (name === 'strong' || name === 'b' || name === 'em' || name === 'i') {
      const marker = name === 'strong' || name === 'b' ? '**' : '_'
      // Solo se marca si hay texto alrededor; un marcador suelto rompería
      // el markdown más que ayudar.
      append(marker)
      continue
    }

    if (name === 'code') {
      append('`')
      continue
    }

    if (name === 'span' || name === 'time' || name === 'small' || name === 'abbr') {
      // Los pares etiqueta/valor del sitio (los datos bancarios de /donar,
      // por ejemplo) se maquetan como dos <span> adyacentes sin espacio en
      // el HTML, porque el espaciado lo da el CSS. Sin separador explícito
      // el texto sale pegado: "TitularUSINA DE JUSTICIA - ARGENTINA…".
      const current = linkHref !== null ? linkText : inline
      if (current && !/\s$/.test(current)) append(' ')
      continue
    }

    // --- bloques ---
    if (!FLUSH_ON.has(name)) continue

    // Las celdas se manejan ANTES del flush genérico: si no, el flush de
    // `</td>` se lleva puesto el texto de la celda (lo emite como párrafo
    // suelto y deja el buffer vacío para cuando la tabla va a leerlo).
    if (tableDepth > 0 && (name === 'tr' || name === 'td' || name === 'th')) {
      if (name === 'tr') {
        if (isClose) {
          if (row && row.length > 0) rows.push(row)
          row = null
        } else {
          row = []
        }
      } else if (isClose) {
        row?.push(tidy(inline).replace(/\|/g, '\\|'))
        inline = ''
        inCell = false
      } else {
        inline = ''
        inCell = true
      }
      continue
    }

    flush()

    if (/^h[1-6]$/.test(name)) {
      headingLevel = isClose ? 0 : Number(name[1])
      continue
    }

    if (name === 'ul' || name === 'ol') {
      if (isClose) lists.pop()
      else lists.push({ ordered: name === 'ol', index: 0 })
      continue
    }

    if (name === 'blockquote') {
      inBlockquote += isClose ? -1 : 1
      continue
    }

    if (name === 'table') {
      if (isClose) {
        tableDepth = Math.max(0, tableDepth - 1)
        emitTable()
      } else {
        tableDepth += 1
      }
      continue
    }

  }

  if (inCell && row) rows.push(row)
  flush()
  emitTable()

  // Limpia marcadores de énfasis que quedaron vacíos o desbalanceados, y
  // deduplica bloques idénticos consecutivos: el rotador del hero
  // (HeroRotator.tsx) renderiza sus 3 variantes y algunas comparten bajada.
  const cleaned = blocks
    .map((block) => {
      // La indentación inicial se preserva: es la que marca el nivel de las
      // sublistas, y un .trim() sobre todo el bloque la borraba.
      const indent = /^[ \t]*/.exec(block)?.[0] ?? ''
      const body = block
        .slice(indent.length)
        .replace(/\*\*\s*\*\*/g, '')
        .replace(/(^|\s)_\s*_(\s|$)/g, '$1$2')
        .replace(/`\s*`/g, '')
        .replace(/[ \t]+/g, ' ')
        .trim()
      return body ? indent + body : ''
    })
    .filter(Boolean)

  const deduped = cleaned.filter((block, i) => block !== cleaned[i - 1])

  // Los ítems de lista consecutivos van con un solo salto: separarlos con
  // línea en blanco los convierte en una "loose list" y, sobre todo, rompe
  // la relación visual de las sublistas indentadas.
  const isListItem = (block: string) => /^\s*(?:[-*]|\d+\.)\s/.test(block)

  return deduped.reduce((acc, block, i) => {
    if (i === 0) return block
    const separator = isListItem(block) && isListItem(deduped[i - 1]) ? '\n' : '\n\n'
    return acc + separator + block
  }, '')
}
