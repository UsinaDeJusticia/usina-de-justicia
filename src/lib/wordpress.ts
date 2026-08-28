// src/lib/wordpress.ts
// Servicio de conexión a la WP REST API de usinadejusticia.org.ar
// Transforma respuestas WP → tipos Articulo/Categoria/Tag de @/types

import sanitizeHtml from 'sanitize-html'
import { fetchWithRetry } from './fetch-retry.ts'
import type { Articulo, Categoria, Tag, ImageAsset } from '@/types'
import type {
  WPPost,
  WPCategory,
  WPTag as WPTagType,
  WPQueryParams,
  PaginatedResponse,
  SiteSection,
} from '@/types/wordpress'
import { CATEGORY_MAP, SITE_SECTIONS } from '../types/wordpress.ts'

// ============================================
// CONFIGURACIÓN
// ============================================

// Host de WordPress. Misma perilla que usa next.config.mjs (WP_HOST) para
// el optimizador de imágenes, la CSP y los redirects de /wp-content — ver el
// comentario largo allá y docs/CUTOVER.md.
//
// Por qué una variable y no el dominio escrito a mano: en el cutover, el
// dominio actual pasa a servir ESTE sitio y WordPress se muda a un
// subdominio. Con la variable, ese día es un cambio de configuración en
// Vercel (reversible en un minuto borrándola), no un cambio de código.
//
// NEXT_PUBLIC_WP_API_URL se mantiene con prioridad por compatibilidad: es
// la variable que documentaba el plan maestro y permite apuntar a una
// instalación completamente distinta (por ejemplo un WordPress de staging).
const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  `https://${process.env.WP_HOST || 'usinadejusticia.org.ar'}/wp-json/wp/v2`

const FETCH_TIMEOUT = 15000

// Cache en memoria para categorías y autores (cambian poco)
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

// ============================================
// FETCH BASE
// ============================================

async function wpFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<{ data: T; headers: Headers }> {
  const url = new URL(`${WP_API_URL}${endpoint}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })

  try {
    // Reintentos ante fallos transitorios de WordPress (5xx, 429, timeouts,
    // cortes de socket). El porqué, con las fechas de los dos builds que se
    // cayeron por esto, está en src/lib/fetch-retry.ts. El timeout por
    // intento y el AbortController los maneja fetchWithRetry.
    const response = await fetchWithRetry(
      url.toString(),
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: 300 },
      },
      {
        timeoutMs: FETCH_TIMEOUT,
        onRetry: ({ attempt, reason, delayMs }) => {
          // Que quede en los logs de Vercel: un build más lento por
          // reintentos tiene que tener explicación visible, no parecer que
          // se colgó solo.
          console.warn(
            `[WP] intento ${attempt} falló en ${endpoint} (${reason}); reintentando en ${delayMs}ms`
          )
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        `WP API Error: ${response.status} ${response.statusText} - ${endpoint}`
      )
    }

    const data = (await response.json()) as T
    return { data, headers: response.headers }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`WP API Timeout: ${endpoint} (>${FETCH_TIMEOUT}ms)`)
    }
    throw error
  }
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T
  }
  cache.delete(key)
  return null
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// ============================================
// DECODIFICACIÓN HTML
// ============================================

function decodeHtml(html: string): string {
  return html
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8230;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, '')
    .trim()
}

function stripHtmlForExcerpt(html: string, maxLength = 200): string {
  const text = decodeHtml(html)
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '…'
}

/**
 * El extracto/descripción con el que se completa `<meta name="description">`
 * y el `description` del JSON-LD `NewsArticle` de cada post — nunca vacío.
 *
 * ~98 de los 842 posts migrados (auditoría de contenido delgado, 26-ago-2026:
 * ver docs/ESTADO.md) son solo un embed de YouTube/Facebook o una imagen sin
 * ningún párrafo de texto — por ejemplo la cobertura de una entrevista de TV
 * publicada sin bajada. `wp.excerpt.rendered` para esos posts es un string
 * vacío (WordPress no tiene de qué generar un resumen automático), así que
 * sin este fallback la página queda con una meta description vacía: un bug
 * de SEO real e independiente de cualquier decisión editorial sobre si
 * indexar o no ese contenido.
 *
 * El fallback es el título del post — dato real, ya publicado, nunca
 * inventado — no un texto genérico.
 */
function excerptOrTitleFallback(excerptHtml: string, title: string, maxLength = 200): string {
  const excerpt = stripHtmlForExcerpt(excerptHtml, maxLength)
  return excerpt || title
}

// ============================================
// TRANSFORMADORES: WP → Tipos existentes
// ============================================

function wpCategoryToCategoria(wp: WPCategory): Categoria {
  return {
    id: String(wp.id),
    nombre: wp.name,
    slug: wp.slug,
    descripcion: wp.description || undefined,
  }
}

function wpPostToArticulo(
  wp: WPPost,
  categoriasMap: Map<number, Categoria>
): Articulo {
  // Autor desde _embedded
  const embeddedAuthor = wp._embedded?.author?.[0]
  const autorNombre = embeddedAuthor?.name || 'Usina de Justicia'

  // Imagen destacada desde _embedded
  const embeddedMedia = wp._embedded?.['wp:featuredmedia']?.[0]
  let imagenDestacada: ImageAsset | undefined
  if (embeddedMedia?.source_url) {
    imagenDestacada = {
      url: embeddedMedia.source_url,
      alt: embeddedMedia.alt_text || decodeHtml(wp.title.rendered),
      width: embeddedMedia.media_details?.width || 1200,
      height: embeddedMedia.media_details?.height || 630,
    }
  }

  // Categoría principal: preferir la categoría nueva (una de las 6 de
  // SITE_SECTIONS) sobre la legacy. Hasta la limpieza de Fase 5, cada post
  // trae ambas categorías asignadas en WP, y `wp.categories` no garantiza
  // ningún orden — sin este filtro, `postCategorias[0]` termina mostrando la
  // legacy (ver bug verificado en vivo con el post 22629: mostraba
  // "medios-y-entrevistas" en vez de "prensa").
  const postCategorias = wp.categories
    .map((catId) => categoriasMap.get(catId))
    .filter((cat): cat is Categoria => cat !== undefined)

  const categoria = postCategorias.find((c) => c.slug in SITE_SECTIONS) ??
    postCategorias[0] ?? {
      id: '0',
      nombre: 'Sin categoría',
      slug: 'sin-categoria',
    }

  // Tags desde _embedded
  const embeddedTerms = wp._embedded?.['wp:term'] || []
  const wpTags = embeddedTerms
    .flat()
    .filter((term) => term.taxonomy === 'post_tag')
  const tags: Tag[] = wpTags.map((t) => ({
    id: String(t.id),
    nombre: t.name,
    slug: t.slug,
  }))

  return {
    id: String(wp.id),
    titulo: decodeHtml(wp.title.rendered),
    slug: wp.slug,
    contenido: wp.content.rendered,
    // Sin fallback al título acá a propósito: `extracto` alimenta el copy
    // visible de ArticleCard.tsx debajo del título — si cayera al mismo
    // texto del título, la tarjeta mostraría el título duplicado dos veces
    // seguidas. El fallback para SEO/social va en `seoDescription`, que no
    // se muestra en pantalla.
    extracto: stripHtmlForExcerpt(wp.excerpt.rendered),
    imagenDestacada,
    categoria,
    tags,
    autor: autorNombre,
    fechaPublicacion: wp.date,
    publicado: wp.status === 'publish',
    createdAt: wp.date,
    updatedAt: wp.modified,
    // SEOFields — valores por defecto, se pueden mejorar después
    seoTitle: decodeHtml(wp.title.rendered),
    seoDescription: excerptOrTitleFallback(wp.excerpt.rendered, decodeHtml(wp.title.rendered), 160),
  }
}

// ============================================
// API: CATEGORÍAS
// ============================================

export async function getWPCategories(): Promise<Categoria[]> {
  const cacheKey = 'wp-categories'
  const cached = getCached<Categoria[]>(cacheKey)
  if (cached) return cached

  const { data } = await wpFetch<WPCategory[]>('/categories', {
    per_page: 100,
    hide_empty: true,
  })

  const categorias = data.map(wpCategoryToCategoria)
  setCache(cacheKey, categorias)
  return categorias
}

async function getCategoriasMap(): Promise<Map<number, Categoria>> {
  const { data } = await wpFetch<WPCategory[]>('/categories', {
    per_page: 100,
    hide_empty: true,
  })
  return new Map(data.map((cat) => [cat.id, wpCategoryToCategoria(cat)]))
}

// Obtener IDs de categorías WP que corresponden a una sección del sitio.
// Desde Fase 3, CATEGORY_MAP es identidad sobre las 6 categorías nuevas de
// WP (historias/acompanamiento/incidencia/prensa/institucional/observatorio),
// así que alcanza con matchear el slug de la sección directamente contra
// las categorías reales — sin indirección.
async function getCategoryIdsBySection(
  section: SiteSection
): Promise<number[]> {
  const { data: wpCats } = await wpFetch<WPCategory[]>('/categories', {
    per_page: 100,
    hide_empty: true,
  })

  const matchingSlugs = Object.entries(CATEGORY_MAP)
    .filter(([, mapped]) => mapped === section)
    .map(([wpSlug]) => wpSlug)

  return wpCats
    .filter((cat) => matchingSlugs.includes(cat.slug))
    .map((cat) => cat.id)
}

// ============================================
// API: POSTS → ARTÍCULOS
// ============================================

export async function getArticulos(
  params: WPQueryParams = {}
): Promise<PaginatedResponse<Articulo>> {
  const categoriasMap = await getCategoriasMap()

  const queryParams: Record<string, string | number | boolean | undefined> = {
    page: params.page || 1,
    per_page: params.perPage || 12,
    orderby: params.orderBy || 'date',
    order: params.order || 'desc',
    _embed: true,
    status: params.status || 'publish',
  }

  if (params.search) queryParams.search = params.search
  if (params.categories?.length)
    queryParams.categories = params.categories.join(',')
  if (params.categoriesExclude?.length)
    queryParams.categories_exclude = params.categoriesExclude.join(',')
  if (params.tags?.length) queryParams.tags = params.tags.join(',')
  if (params.author) queryParams.author = params.author
  if (params.slug) queryParams.slug = params.slug

  const { data: wpPosts, headers } = await wpFetch<WPPost[]>(
    '/posts',
    queryParams
  )

  const total = parseInt(headers.get('X-WP-Total') || '0', 10)
  const totalPages = parseInt(headers.get('X-WP-TotalPages') || '0', 10)

  const articulos = wpPosts.map((wp) => wpPostToArticulo(wp, categoriasMap))

  return {
    data: articulos,
    total,
    totalPages,
    currentPage: params.page || 1,
  }
}

export async function getArticuloBySlug(
  slug: string
): Promise<Articulo | null> {
  const result = await getArticulos({ slug, perPage: 1 })
  return result.data[0] || null
}

export async function getArticulosBySection(
  section: SiteSection,
  params: Omit<WPQueryParams, 'categories'> = {}
): Promise<PaginatedResponse<Articulo>> {
  const categoryIds = await getCategoryIdsBySection(section)
  if (categoryIds.length === 0) {
    return { data: [], total: 0, totalPages: 0, currentPage: 1 }
  }
  return getArticulos({ ...params, categories: categoryIds })
}

export async function getArticulosByCategorySlug(
  categorySlug: string,
  params: Omit<WPQueryParams, 'categories'> = {}
): Promise<PaginatedResponse<Articulo>> {
  const categorias = await getWPCategories()
  const cat = categorias.find((c) => c.slug === categorySlug)
  if (!cat) {
    return { data: [], total: 0, totalPages: 0, currentPage: 1 }
  }
  return getArticulos({ ...params, categories: [Number(cat.id)] })
}

export async function searchArticulos(
  query: string,
  params: Omit<WPQueryParams, 'search'> = {}
): Promise<PaginatedResponse<Articulo>> {
  return getArticulos({ ...params, search: query, orderBy: 'relevance' })
}

// ============================================
// API: SITEMAP (payload mínimo, todas las páginas en paralelo)
// ============================================

export interface SitemapPostEntry {
  slug: string
  modified: string
}

/**
 * Todos los posts publicados con el payload mínimo (`slug` + `modified` vía
 * `_fields`) para src/app/sitemap.ts. La primera llamada revela
 * X-WP-TotalPages; el resto de las páginas se piden en paralelo con
 * Promise.all (no secuencial) porque son ~9 llamadas con per_page=100 sobre
 * ~840 posts. No pasa por el caché en memoria de arriba (cache/getCached):
 * sitemap.ts se genera una sola vez por build/revalidate, así que no hace
 * falta memoizar entre requests.
 */
export async function getAllPublishedPostSlugs(): Promise<SitemapPostEntry[]> {
  const perPage = 100
  const baseParams = {
    per_page: perPage,
    status: 'publish',
    _fields: 'slug,modified',
    orderby: 'date',
    order: 'desc',
  } as const

  const { data: firstPage, headers } = await wpFetch<SitemapPostEntry[]>(
    '/posts',
    { ...baseParams, page: 1 }
  )

  const totalPages = parseInt(headers.get('X-WP-TotalPages') || '1', 10)
  if (totalPages <= 1) return firstPage

  const restPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      wpFetch<SitemapPostEntry[]>('/posts', { ...baseParams, page: i + 2 })
    )
  )

  return [firstPage, ...restPages.map((r) => r.data)].flat()
}

// ============================================
// API: BUSCADOR (payload mínimo, todas las páginas en paralelo)
// ============================================

/** Post recortado para el índice del buscador (src/lib/buscador.ts). */
export interface PostBuscador {
  id: number
  titulo: string
  extracto: string
  slug: string
  fechaPublicacion: string // ISO, igual que Articulo.fechaPublicacion
  categoria: string // nombre visible de la categoría principal
}

/** Shape crudo que devuelve WP con el _fields de abajo. */
interface WPPostBuscadorRaw {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  slug: string
  date: string
  categories: number[]
}

/**
 * Todos los posts publicados con el payload mínimo para el índice del
 * buscador. Mismo fan-out que getAllPublishedPostSlugs: la primera página
 * revela X-WP-TotalPages y el resto se pide en paralelo. El _fields recorta
 * la respuesta a una fracción del payload con _embed. Las categorías se
 * resuelven con getWPCategories() (memoizada 5 min) — NO con
 * getCategoriasMap, que dispara un fetch sin caché en cada llamada.
 */
export async function getAllPostsBuscador(): Promise<PostBuscador[]> {
  const baseParams = {
    per_page: 100,
    status: 'publish',
    _fields: 'id,title,excerpt,slug,date,categories',
    orderby: 'date',
    order: 'desc',
  } as const

  const [categorias, primera] = await Promise.all([
    getWPCategories(),
    wpFetch<WPPostBuscadorRaw[]>('/posts', { ...baseParams, page: 1 }),
  ])

  const catMap = new Map(categorias.map((c) => [Number(c.id), c]))

  const totalPages = parseInt(primera.headers.get('X-WP-TotalPages') || '1', 10)
  const resto =
    totalPages <= 1
      ? []
      : await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            wpFetch<WPPostBuscadorRaw[]>('/posts', { ...baseParams, page: i + 2 })
          )
        )

  const posts = [primera.data, ...resto.map((r) => r.data)].flat()

  return posts.map((wp) => {
    // Misma regla que wpPostToArticulo: preferir la categoría nueva (una de
    // las 6 de SITE_SECTIONS) sobre la legacy — ver el comentario largo allá.
    const postCategorias = wp.categories
      .map((catId) => catMap.get(catId))
      .filter((c): c is Categoria => c !== undefined)
    const categoria =
      postCategorias.find((c) => c.slug in SITE_SECTIONS) ?? postCategorias[0]

    return {
      id: wp.id,
      titulo: decodeHtml(wp.title.rendered),
      // Sin fallback al título (mismo criterio que Articulo.extracto): un
      // extracto vacío no se muestra ni se indexa duplicando el título.
      extracto: stripHtmlForExcerpt(wp.excerpt.rendered),
      slug: wp.slug,
      fechaPublicacion: wp.date,
      categoria: categoria?.nombre ?? 'Sin categoría',
    }
  })
}

// ============================================
// API: TAGS
// ============================================

export async function getWPTags(): Promise<Tag[]> {
  const cacheKey = 'wp-tags'
  const cached = getCached<Tag[]>(cacheKey)
  if (cached) return cached

  const { data } = await wpFetch<WPTagType[]>('/tags', {
    per_page: 100,
    hide_empty: true,
  })

  const tags: Tag[] = data.map((t) => ({
    id: String(t.id),
    nombre: t.name,
    slug: t.slug,
  }))

  setCache(cacheKey, tags)
  return tags
}

export async function getArticulosByTagSlug(
  tagSlug: string,
  params: Omit<WPQueryParams, 'tags'> = {}
): Promise<PaginatedResponse<Articulo>> {
  const tags = await getWPTags()
  const tag = tags.find((t) => t.slug === tagSlug)
  if (!tag) {
    return { data: [], total: 0, totalPages: 0, currentPage: 1 }
  }
  return getArticulos({ ...params, tags: [Number(tag.id)] })
}

// ============================================
// UTILIDADES DE CONTENIDO
// ============================================

// ============================================
// SANITIZACIÓN DE HTML (seguridad)
// ============================================
//
// Allowlist verificada contra contenido real de la API de WP. No agrandar
// ni achicar sin volver a auditar los posts publicados: los 5 hostnames de
// iframe y el set de estilos permitidos cubren exactamente lo que aparece
// hoy en producción (embeds de YouTube/Canva/Facebook/Yumpu, videos mp4,
// columnas/cajas de Elementor con dimensiones y sombras inline).
//
// Validadores de valor de estilo: solo números+unidades o palabras clave
// fijas — nunca url() ni expression(), que quedan excluidos por construcción
// al no matchear ninguno de los regex de abajo.
const NUM_UNIT = /^-?\d+(\.\d+)?(px|%|rem|em|vh|vw)$/
// Cuatro medidas separadas por espacios, al estilo de `padding: 8px 16px`.
//
// Reescrito el 27-ago-2026 por una vulnerabilidad de denegación de servicio
// medida, no teórica. La versión anterior era:
//
//     /^(-?\d+(\.\d+)?(px|%|rem|em|vh|vw)?\s*){1,4}$/
//
// y tenía dos ambigüedades que se combinaban mal: la unidad era opcional y el
// separador `\s*` podía matchear vacío, así que una tira de dígitos podía
// repartirse entre las cuatro repeticiones de muchísimas formas distintas.
// Ante un valor que NO matchea, el motor de expresiones regulares las prueba
// todas. Medido en este proyecto:
//
//     200 dígitos      703 ms
//     400 dígitos   10.881 ms
//     600 dígitos   54.653 ms
//
// Esto corre dentro de `cleanWPContent()`, en el render del Server Component
// de cada nota, así que bloquea el hilo: un solo post con
// `style="border-radius:111…x"` dejaba esa página en error permanente y
// quemaba CPU en cada revalidación.
//
// La versión de abajo elimina la ambigüedad: separador obligatorio entre
// medidas (`\s+`, no `\s*`), grupos no capturantes, y el primer valor fuera
// de la repetición. Con eso solo hay una manera posible de partir la entrada.
//
// El `(?=.{1,64}$)` del principio es una segunda línea de defensa: descarta
// de entrada cualquier valor absurdamente largo, antes de que el motor
// empiece a trabajar. `margin: -10.5rem 100vh 0 12px` son 27 caracteres, así
// que 64 es holgado para cualquier valor legítimo. `sanitize-html` solo
// acepta expresiones regulares acá, no funciones, por eso el tope va dentro
// del propio patrón.
const SHORTHAND_NUM_UNIT =
  /^(?=.{1,64}$)-?\d+(?:\.\d+)?(?:px|%|rem|em|vh|vw)?(?:\s+-?\d+(?:\.\d+)?(?:px|%|rem|em|vh|vw)?){0,3}$/
const ASPECT_RATIO = /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/
const POSITION_VALUE = /^(relative|absolute)$/
const OVERFLOW_VALUE = /^(visible|hidden|scroll|auto)$/
const COLOR_VALUE = /(#[0-9a-fA-F]{3,8}|rgba?\([\d.,\s%]+\)|[a-zA-Z]+)/
const BORDER_VALUE = new RegExp(
  `^\\d+(\\.\\d+)?(px|em|rem)\\s+(none|solid|dashed|dotted|double|groove|ridge|inset|outset)\\s+${COLOR_VALUE.source}$`
)
const BOX_SHADOW_VALUE = new RegExp(
  `^(inset\\s+)?-?\\d+(\\.\\d+)?(px|em|rem)?(\\s+-?\\d+(\\.\\d+)?(px|em|rem)?){1,3}\\s+${COLOR_VALUE.source}(\\s+inset)?$`
)

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'strong',
    'em',
    'b',
    'i',
    'a',
    'img',
    'figure',
    'figcaption',
    'blockquote',
    'video',
    'iframe',
    'table',
    'thead',
    'tbody',
    'tr',
    'td',
    'th',
    'div',
    'span',
  ],
  // Nunca 'script', bajo ninguna condición.
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: [
      'src',
      'srcset',
      'sizes',
      'alt',
      'width',
      'height',
      'loading',
      'decoding',
      'fetchpriority',
    ],
    video: ['src', 'controls', 'width', 'height', 'style', 'poster'],
    iframe: [
      'src',
      'title',
      'width',
      'height',
      'frameborder',
      'allow',
      'allowfullscreen',
      'referrerpolicy',
      'loading',
    ],
    // 'class' se remueve deliberadamente (comportamiento previo para
    // elementor/wp-block); 'style' e 'id' sí se preservan.
    '*': ['style', 'id'],
  },
  allowedIframeHostnames: [
    'www.youtube.com',
    'www.youtube-nocookie.com',
    'www.canva.com',
    'www.facebook.com',
    'www.yumpu.com',
  ],
  allowedStyles: {
    '*': {
      height: [NUM_UNIT],
      width: [NUM_UNIT],
      'aspect-ratio': [ASPECT_RATIO],
      position: [POSITION_VALUE],
      top: [NUM_UNIT],
      left: [NUM_UNIT],
      'padding-top': [NUM_UNIT],
      'padding-bottom': [NUM_UNIT],
      'margin-top': [NUM_UNIT],
      'margin-bottom': [NUM_UNIT],
      'border-radius': [SHORTHAND_NUM_UNIT],
      'box-shadow': [BOX_SHADOW_VALUE],
      overflow: [OVERFLOW_VALUE],
      border: [BORDER_VALUE],
      padding: [SHORTHAND_NUM_UNIT],
      margin: [SHORTHAND_NUM_UNIT],
    },
  },
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === '_blank') {
        return { tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }
      }
      return { tagName, attribs }
    },
  },
}

/**
 * Sanitiza y limpia el HTML de WordPress (Elementor/Gutenberg) para
 * renderizar de forma segura.
 *
 * 1) sanitize-html aplica la allowlist real de tags/atributos/estilos de
 *    arriba — esta es la barrera de seguridad contra XSS (scripts, atributos
 *    on*, href/src con esquemas peligrosos, iframes a hosts no confiables,
 *    estilos con url()/expression(), etc.)
 * 2) Encima se aplica la limpieza cosmética de remanentes de Elementor/
 *    Gutenberg y se decoran los <hr> con las clases de Tailwind del diseño
 *    (esto corre DESPUÉS del paso de sanitización, así que la clase que le
 *    agregamos nosotros mismos al <hr> no vuelve a pasar por el allowlist).
 *
 * Nota de comportamiento esperado: los embeds de Twitter/TikTok (patrón
 * blockquote + <script> de oEmbed) degradan a una cita con link, porque
 * <script> nunca está permitido — es el fallback previsto del formato, no
 * un bug.
 */
export function cleanWPContent(html: string): string {
  const sanitized = sanitizeHtml(html, SANITIZE_OPTIONS)

  // Acá vivían ocho sustituciones más que quitaban `class="elementor-*"`,
  // `data-elementor-*`, `data-settings`, `data-id` y `class="wp-block-*"`.
  // Se eliminaron el 27-ago-2026 porque **no hacían nada**: la lista de
  // atributos permitidos de arriba solo deja pasar `style` e `id`, así que
  // `sanitize-html` ya los había borrado en la línea anterior. Comprobado
  // ejecutándolas contra HTML real de Elementor antes de sacarlas.
  //
  // No era código muerto inofensivo, y por eso se saca en una auditoría de
  // seguridad: dos de ellas borraban la etiqueta de APERTURA de un `<div>` o
  // un `<section>` sin tocar su cierre. Si alguien alguna vez volviera a
  // permitir `class` para recuperar estilos, esas dos empezarían a dejar
  // cierres huérfanos y el contenido de la nota se escaparía de su
  // contenedor. Un problema latente esperando un cambio razonable.
  return sanitized
    .replace(
      /<hr\s*\/?>/g,
      '<hr class="my-8 border-t-2 border-gray-200" />'
    )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Extrae la primera imagen del contenido HTML (fallback si no hay featured) */
export function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^"]+)"/)
  return match?.[1] || null
}

/** Extrae videos embebidos del contenido */
export function extractVideos(
  html: string
): Array<{ type: 'youtube' | 'mp4'; url: string }> {
  const videos: Array<{ type: 'youtube' | 'mp4'; url: string }> = []

  const ytRegex =
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/g
  let match
  while ((match = ytRegex.exec(html)) !== null) {
    videos.push({
      type: 'youtube',
      url: `https://www.youtube.com/embed/${match[1]}`,
    })
  }

  const mp4Regex = /src="([^"]+\.mp4)"/g
  while ((match = mp4Regex.exec(html)) !== null) {
    videos.push({ type: 'mp4', url: match[1] })
  }

  return videos
}

/** Tiempo de lectura estimado */
export function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}