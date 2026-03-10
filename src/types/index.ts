// ============================================
// TIPOS BASE - Usina de Justicia
// Estos tipos mapean 1:1 con los Content Types de Strapi
// ============================================

export interface SEOFields {
  seoTitle?: string
  seoDescription?: string
  ogImage?: ImageAsset
}

export interface ImageAsset {
  url: string
  alt: string
  width: number
  height: number
}

export interface FileAsset {
  url: string
  name: string
  size: number // en KB
  format: string // pdf, doc, etc
}

// --- Blog / Artículos ---

export interface Articulo extends SEOFields {
  id: string
  titulo: string
  slug: string
  contenido: string // Rich text (HTML o Markdown)
  extracto: string
  imagenDestacada?: ImageAsset
  categoria: Categoria
  tags: Tag[]
  autor: string
  fechaPublicacion: string // ISO date
  publicado: boolean
  createdAt: string
  updatedAt: string
}

export interface Categoria {
  id: string
  nombre: string
  slug: string
  descripcion?: string
}

export interface Tag {
  id: string
  nombre: string
  slug: string
}

// --- Programas ---

export interface Programa extends SEOFields {
  id: string
  titulo: string
  slug: string
  descripcionCorta: string
  contenido: string
  imagen?: ImageAsset
  icono?: string // nombre de icono Lucide
  orden: number
}

// --- Recursos ---

export type TipoRecurso = 'publicacion' | 'informe' | 'guia' | 'herramienta'

export interface Recurso extends SEOFields {
  id: string
  titulo: string
  slug: string
  descripcion: string
  tipo: TipoRecurso
  archivo: FileAsset
  imagenPortada?: ImageAsset
  fechaPublicacion: string
  tags: Tag[]
}

// --- Equipo ---

export type AreaEquipo = 'direccion' | 'legal' | 'colaboradores'

export interface MiembroEquipo {
  id: string
  nombre: string
  cargo: string
  bio: string
  foto?: ImageAsset
  email?: string
  linkedin?: string
  orden: number
  area: AreaEquipo
}

// --- Galería ---

export interface Album {
  id: string
  titulo: string
  slug: string
  descripcion?: string
  fecha: string
  fotos: ImageAsset[]
  imagenPortada: ImageAsset
}

// --- Navegación ---

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface BreadcrumbItem {
  label: string
  href: string
}

// --- Formularios ---

export interface ContactFormData {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
}
