import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { NoticiasListView } from '../../_components/NoticiasListView'
import { getGeneralTotalPages, pageRangeParams } from '@/lib/pagination'

export const revalidate = 1800

// ============================================
// GENERACIÓN ESTÁTICA: pre-generar todas las páginas 2..totalPages
// (page 1 vive en /noticias, fuera de este segmento).
// ============================================

export async function generateStaticParams() {
  try {
    const totalPages = await getGeneralTotalPages()
    return pageRangeParams(totalPages)
  } catch {
    return []
  }
}

interface NoticiasPaginaPageProps {
  params: Promise<{ n: string }>
}

export async function generateMetadata({
  params,
}: NoticiasPaginaPageProps): Promise<Metadata> {
  const { n } = await params
  return {
    title: `Noticias — Página ${n}`,
    description:
      'Historias, acompañamiento, incidencia, prensa, institucional y observatorio: todas las noticias de Usina de Justicia sobre los derechos de las víctimas del delito en Argentina.',
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/noticias/pagina/${n}`,
    },
  }
}

export default async function NoticiasPaginaPage({
  params,
}: NoticiasPaginaPageProps) {
  const { n } = await params
  const pageNum = Number(n)

  if (!Number.isInteger(pageNum) || pageNum < 1) {
    notFound()
  }
  if (pageNum === 1) {
    redirect('/noticias')
  }

  // Validar el rango ANTES de pedirle a WP la página `n`: la API devuelve
  // HTTP 400 (no un array vacío) cuando `page` excede totalPages.
  let totalPages: number | null = null
  try {
    totalPages = await getGeneralTotalPages()
  } catch {
    // WP caído: dejamos que NoticiasListView muestre el estado de error;
    // sin poder determinar el rango válido, no forzamos un 404.
  }
  if (totalPages !== null && pageNum > totalPages) {
    notFound()
  }

  return <NoticiasListView page={pageNum} />
}
