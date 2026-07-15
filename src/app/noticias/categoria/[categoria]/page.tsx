import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_SECTIONS } from '@/types/wordpress'
import type { SiteSection } from '@/types/wordpress'
import { CategoriaListView } from './_components/CategoriaListView'

// ============================================
// GENERACIÓN ESTÁTICA: pre-renderizar únicamente las 6 secciones
// definitivas del sitio (SITE_SECTIONS). Las ~14 categorías legacy de WP ya
// no se pre-generan: eran contenido duplicado indexable (mismo post bajo dos
// URLs) y ahora 301-ean a su sección nueva (ver next.config.mjs).
// ============================================

export async function generateStaticParams() {
  return Object.keys(SITE_SECTIONS).map((key) => ({ categoria: key }))
}

// Página estática (ISR): re-generada como máximo cada 5 minutos. Page 1 de
// cada categoría vive acá; las páginas 2+ están en
// /noticias/categoria/[categoria]/pagina/[n].
export const revalidate = 300

interface CategoriaPageProps {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({
  params,
}: CategoriaPageProps): Promise<Metadata> {
  const { categoria } = await params

  if (!(categoria in SITE_SECTIONS)) {
    return { title: 'Categoría no encontrada' }
  }

  const section = SITE_SECTIONS[categoria as SiteSection]
  return {
    title: `${section.title} — Noticias`,
    description: `${section.description} — Usina de Justicia`,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/noticias/categoria/${categoria}`,
    },
  }
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const { categoria } = await params

  // Solo las 6 secciones definitivas del sitio; las categorías legacy de WP
  // 301-ean antes de llegar acá (ver next.config.mjs).
  if (!(categoria in SITE_SECTIONS)) notFound()

  return <CategoriaListView categoria={categoria as SiteSection} page={1} />
}
