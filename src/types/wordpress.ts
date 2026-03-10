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

export const CATEGORY_MAP: Record<string, string | null> = {
  // → HISTORIAS (casos de víctimas)
  'historias': 'historias',
  'acompanamiento-a-victimas-de-homicidio': 'historias',

  // → MEDIOS
  'medios-y-entrevistas': 'medios',

  // → INCIDENCIA
  'incidencia-en-politicas-publicas': 'incidencia',
  'debatesyconferencias': 'incidencia',

  // → ACTIVIDADES
  'actividades': 'actividades',
  'eventos': 'actividades',
  'capacitacion': 'actividades',

  // → INSTITUCIONAL
  'institucional': 'institucional',
  'distinciones-premios': 'institucional',
  'historias-de-los-miembros-de-uj': 'institucional',
  'publicaciones': 'institucional',

  // → INFORMATIVO
  'boletin-informativo': 'informativo',
  'estadisticas': 'informativo',

  // → IGNORAR
  'ig-publicaciones': null,
  'otras': null,
}

export const SITE_SECTIONS: Record<string, {
  title: string
  slug: string
  description: string
}> = {
  historias: {
    title: 'Historias de las familias',
    slug: 'historias',
    description: 'Las historias de las familias que acompañamos en su búsqueda de justicia',
  },
  medios: {
    title: 'Medios y Entrevistas',
    slug: 'medios',
    description: 'Cobertura mediática y entrevistas a miembros de Usina de Justicia',
  },
  incidencia: {
    title: 'Incidencia en Políticas Públicas',
    slug: 'incidencia',
    description: 'Nuestra participación en debates, conferencias y políticas públicas',
  },
  actividades: {
    title: 'Actividades',
    slug: 'actividades',
    description: 'Eventos, cursos, capacitaciones y actividades de la asociación',
  },
  institucional: {
    title: 'Institucional',
    slug: 'institucional',
    description: 'Información institucional, distinciones y publicaciones',
  },
  informativo: {
    title: 'Informativo',
    slug: 'informativo',
    description: 'Boletines informativos, informes y estadísticas',
  },
}

export type SiteSection = keyof typeof SITE_SECTIONS