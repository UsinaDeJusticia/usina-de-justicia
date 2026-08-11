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

// --- Guías (serie "Guías para la etapa que estás viviendo", /acompanamiento) ---
// Contenido íntegramente trazado en docs/COPY-acompanamiento-guias.md.
// El tipo modela una COLECCIÓN que va a crecer (hoy tiene un solo elemento):
// no hardcodear el contenido en la página, siempre pasar por este shape.

export interface GuiaLista {
  titulo: string
  items: string[]
}

export interface GuiaSeccion {
  id: string
  titulo: string
  parrafos: string[]
  listas?: GuiaLista[]
  notaFinal?: string
}

export interface GuiaAccion {
  id: string
  texto: string
}

export interface GuiaPregunta {
  pregunta: string
  respuesta: string
}

export interface GuiaAutor {
  nombre: string
  credencial: string
  contexto: string // de dónde sale la guía (encuentro, fecha), sin inventar una "fecha de publicación" que la fuente no da
  fotoConfirmada: boolean
}

export interface Guia {
  slug: string
  numeroSerie: number
  titulo: string
  bajada: string
  secciones: GuiaSeccion[]
  acciones: GuiaAccion[]
  preguntas: GuiaPregunta[]
  autor: GuiaAutor
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
