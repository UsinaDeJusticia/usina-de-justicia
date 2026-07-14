// src/types/wordpress.ts
// Tipos RAW de la WP REST API + mapeo de secciones
// NO duplica Articulo/Categoria/Tag — esos viven en types/index.ts

// ============================================
// RAW WP API RESPONSES (lo que devuelve la API tal cual)
// ============================================

export interface WPPost {
  id: number
  date: string
  date_gmt: string
  modified: string
  modified_gmt: string
  slug: string
  status: 'publish' | 'draft' | 'pending' | 'private'
  type: 'post' | 'page'
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
  format: string
  _embedded?: {
    author?: WPAuthor[]
    'wp:featuredmedia'?: WPMedia[]
    'wp:term'?: WPTerm[][]
  }
}

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  parent: number
}

export interface WPTag {
  id: number
  count: number
  name: string
  slug: string
  link: string
}

export interface WPAuthor {
  id: number
  name: string
  slug: string
  description: string
  avatar_urls: {
    '24': string
    '48': string
    '96': string
  }
}

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
  media_details: {
    width: number
    height: number
    sizes: {
      thumbnail?: WPMediaSize
      medium?: WPMediaSize
      medium_large?: WPMediaSize
      large?: WPMediaSize
      full?: WPMediaSize
      [key: string]: WPMediaSize | undefined
    }
  }
}

export interface WPMediaSize {
  source_url: string
  width: number
  height: number
  mime_type: string
}

export interface WPTerm {
  id: number
  name: string
  slug: string
  taxonomy: 'category' | 'post_tag'
}

// ============================================
// PARÁMETROS PARA QUERIES
// ============================================

export interface WPQueryParams {
  page?: number
  perPage?: number
  search?: string
  categories?: number[]
  categoriesExclude?: number[]
  tags?: number[]
  author?: number
  orderBy?: 'date' | 'modified' | 'title' | 'relevance'
  order?: 'asc' | 'desc'
  slug?: string
  status?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  totalPages: number
  currentPage: number
}

// ============================================
// MAPEO: Categorías WP → Secciones del nuevo sitio
// ============================================
//
// Fase 2 (ya ejecutada en producción de WP): los 841 posts fueron
// reasignados a 6 categorías NUEVAS y definitivas, creadas directamente en
// WP con estos slugs: historias (id 211), acompanamiento (id 253),
// incidencia (id 254), prensa (id 255), institucional (id 6), observatorio
// (id 256). Cada post ya tiene asignada su categoría nueva por slug, así
// que el mapeo correcto es identidad: el frontend consulta estas 6
// categorías directamente, sin indirección. Ver docs/MAPA-MIGRACION.md §1.

export const CATEGORY_MAP: Record<string, string | null> = {
  'historias': 'historias',
  'acompanamiento': 'acompanamiento',
  'incidencia': 'incidencia',
  'prensa': 'prensa',
  'institucional': 'institucional',
  'observatorio': 'observatorio',
}

// Referencia histórica únicamente (Fase 1/2): el mapeo viejo de las 16
// categorías originales de WP a una taxonomía intermedia de 6 secciones
// (historias/medios/incidencia/actividades/institucional/informativo).
// Ya no lo usa el frontend — queda documentado para la limpieza de
// categorías legacy en Fase 5 (ver docs/MAPA-MIGRACION.md §1).
export const LEGACY_CATEGORY_MAP: Record<string, string | null> = {
  'historias': 'historias',
  'acompanamiento-a-victimas-de-homicidio': 'historias',
  'medios-y-entrevistas': 'medios',
  'incidencia-en-politicas-publicas': 'incidencia',
  'debatesyconferencias': 'incidencia',
  'actividades': 'actividades',
  'eventos': 'actividades',
  'capacitacion': 'actividades',
  'institucional': 'institucional',
  'distinciones-premios': 'institucional',
  'historias-de-los-miembros-de-uj': 'institucional',
  'publicaciones': 'institucional',
  'boletin-informativo': 'informativo',
  'estadisticas': 'informativo',
  'ig-publicaciones': null,
  'otras': null,
}

export const SITE_SECTIONS: Record<string, {
  title: string
  slug: string
  description: string
}> = {
  historias: {
    title: 'Historias',
    slug: 'historias',
    description: 'Historias de las familias que acompañamos',
  },
  acompanamiento: {
    title: 'Acompañamiento',
    slug: 'acompanamiento',
    description: 'Acompañamiento a víctimas de homicidio y femicidio',
  },
  incidencia: {
    title: 'Incidencia',
    slug: 'incidencia',
    description: 'Incidencia en políticas públicas y reforma penal',
  },
  prensa: {
    title: 'Prensa',
    slug: 'prensa',
    description: 'Medios y entrevistas a miembros de Usina de Justicia',
  },
  institucional: {
    title: 'Institucional',
    slug: 'institucional',
    description: 'Distinciones, premios y comunicados institucionales',
  },
  observatorio: {
    title: 'Observatorio',
    slug: 'observatorio',
    description: 'Informes, publicaciones y datos',
  },
}

export type SiteSection = keyof typeof SITE_SECTIONS