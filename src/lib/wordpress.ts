// src/lib/wordpress.ts
// Servicio de conexión a la WP REST API de usinadejusticia.org.ar
// Transforma respuestas WP → tipos Articulo/Categoria/Tag de @/types

import type { Articulo, Categoria, Tag, ImageAsset } from '@/types'
import type {
  WPPost,
  WPCategory,
  WPQueryParams,
  PaginatedResponse,
  SiteSection,
} from '@/types/wordpress'
import { CATEGORY_MAP } from '@/types/wordpress'

// ============================================
// CONFIGURACIÓN
// ============================================

const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  'https://usinadejusticia.org.ar/wp-json/wp/v2'

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

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    })

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
  } finally {
    clearTimeout(timeoutId)
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

  // Categoría principal (la primera que encontremos en el mapeo)
  const postCategorias = wp.categories
    .map((catId) => categoriasMap.get(catId))
    .filter((cat): cat is Categoria => cat !== undefined)

  const categoria = postCategorias[0] || {
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
    seoDescription: stripHtmlForExcerpt(wp.excerpt.rendered, 160),
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

// Obtener IDs de categorías WP que corresponden a una sección del sitio
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
// UTILIDADES DE CONTENIDO
// ============================================

/** Limpia HTML de Elementor/Gutenberg para renderizar limpio */
export function cleanWPContent(html: string): string {
  return html
    .replace(/\s*class="elementor-[^"]*"/g, '')
    .replace(/\s*data-elementor-[^=]*="[^"]*"/g, '')
    .replace(/\s*data-widget_type="[^"]*"/g, '')
    .replace(/\s*data-id="[^"]*"/g, '')
    .replace(/\s*data-element_type="[^"]*"/g, '')
    .replace(/\s*data-settings='[^']*'/g, '')
    .replace(/<div[^>]*class="elementor-[^"]*"[^>]*>\s*<\/div>/g, '')
    .replace(
      /<(?:div|section)[^>]*class="[^"]*elementor[^"]*"[^>]*>/g,
      ''
    )
    .replace(/\s*class="wp-block-[^"]*"/g, '')
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