import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getWPTags } from '@/lib/wordpress'
import { getTagTotalPages } from '@/lib/pagination'
import { TagListView } from '../../_components/TagListView'

export const revalidate = 1800

// El máximo real hoy es 3 posts por tag (1 sola página) — no hay pagina/2+
// que pre-renderizar. El mecanismo igual existe: dynamicParams (default true
// en App Router) permite que Next genere estas páginas on-demand la primera
// vez que alguien las visite, y las sirva como ISR (revalidate) después.
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

interface TagPaginaPageProps {
  params: Promise<{ tag: string; n: string }>
}

export async function generateMetadata({
  params,
}: TagPaginaPageProps): Promise<Metadata> {
  const { tag, n } = await params
  const tags = await getWPTags()
  const tagData = tags.find((t) => t.slug === tag)

  if (!tagData) return { title: 'Etiqueta no encontrada' }

  return {
    title: `${tagData.nombre} — Noticias — Página ${n}`,
    description: `Artículos etiquetados con "${tagData.nombre}" — Usina de Justicia`,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/noticias/tag/${tag}/pagina/${n}`,
    },
  }
}

export default async function TagPaginaPage({ params }: TagPaginaPageProps) {
  const { tag, n } = await params
  const pageNum = Number(n)

  if (!Number.isInteger(pageNum) || pageNum < 1) {
    notFound()
  }
  if (pageNum === 1) {
    redirect(`/noticias/tag/${tag}`)
  }

  // Validar el rango ANTES de pedirle a WP la página `n`: la API devuelve
  // HTTP 400 (no un array vacío) cuando `page` excede totalPages. Esto
  // también cubre el caso de un tag inexistente: getTagTotalPages devuelve 0
  // y cualquier pageNum >= 2 pasa a notFound().
  let totalPages: number | null = null
  try {
    totalPages = await getTagTotalPages(tag)
  } catch {
    // WP caído: dejamos que TagListView muestre el estado de error; sin
    // poder determinar el rango válido, no forzamos un 404.
  }
  if (totalPages !== null && pageNum > totalPages) {
    notFound()
  }

  return <TagListView tag={tag} page={pageNum} />
}
