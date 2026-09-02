import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { SITE_SECTIONS } from '@/types/wordpress'
import type { SiteSection } from '@/types/wordpress'
import { getSectionTotalPages, pageRangeParams } from '@/lib/pagination'
import { CategoriaListView } from '../../_components/CategoriaListView'

export const revalidate = 1800

// ============================================
// GENERACIÓN ESTÁTICA: pre-generar las páginas 2..totalPages DE CADA
// categoría (page 1 vive en la ruta padre).
//
// TRAMPA CRÍTICA: acá NO alcanza con devolver `{ n }` y confiar en que Next
// combine cada valor con la `categoria` ya resuelta por el
// generateStaticParams del padre — probado en este proyecto (Next 15.5.20,
// sin PPR/cacheComponents) el `params` que llega a esta función viene VACÍO
// cuando hay un segmento estático ("pagina") entre el padre dinámico
// ([categoria]) y este. Por eso generateStaticParams devuelve acá mismo la
// combinación completa `{ categoria, n }` para las 6 secciones, calculando
// el totalPages de CADA una por separado. Si se usara el mismo totalPages
// para todas, Next generaría basura (ej. institucional/pagina/34, que no
// existe).
// ============================================

export async function generateStaticParams() {
  const results: Array<{ categoria: string; n: string }> = []

  for (const categoria of Object.keys(SITE_SECTIONS)) {
    try {
      const totalPages = await getSectionTotalPages(categoria as SiteSection)
      for (const { n } of pageRangeParams(totalPages)) {
        results.push({ categoria, n })
      }
    } catch {
      // Si falla WP para esta categoría, seguimos con las demás.
    }
  }

  return results
}

interface CategoriaPaginaPageProps {
  params: Promise<{ categoria: string; n: string }>
}

export async function generateMetadata({
  params,
}: CategoriaPaginaPageProps): Promise<Metadata> {
  const { categoria, n } = await params

  if (!(categoria in SITE_SECTIONS)) {
    return { title: 'Categoría no encontrada' }
  }

  const section = SITE_SECTIONS[categoria as SiteSection]
  return {
    title: `${section.title} — Noticias — Página ${n}`,
    description: `${section.description} — Usina de Justicia`,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/noticias/categoria/${categoria}/pagina/${n}`,
    },
  }
}

export default async function CategoriaPaginaPage({
  params,
}: CategoriaPaginaPageProps) {
  const { categoria, n } = await params

  if (!(categoria in SITE_SECTIONS)) notFound()

  const pageNum = Number(n)
  if (!Number.isInteger(pageNum) || pageNum < 1) {
    notFound()
  }
  if (pageNum === 1) {
    redirect(`/noticias/categoria/${categoria}`)
  }

  // Validar el rango ANTES de pedirle a WP la página `n`: la API devuelve
  // HTTP 400 (no un array vacío) cuando `page` excede totalPages.
  let totalPages: number | null = null
  try {
    totalPages = await getSectionTotalPages(categoria as SiteSection)
  } catch {
    // WP caído: dejamos que CategoriaListView muestre el estado de error;
    // sin poder determinar el rango válido, no forzamos un 404.
  }
  if (totalPages !== null && pageNum > totalPages) {
    notFound()
  }

  return (
    <CategoriaListView categoria={categoria as SiteSection} page={pageNum} />
  )
}
