import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ChevronLeft, Tag as TagIcon } from 'lucide-react'
import { getWPTags, getArticulosByTagSlug } from '@/lib/wordpress'
import { Badge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { Pagination } from '@/components/noticias/Pagination'

// ============================================
// GENERACIÓN ESTÁTICA: pre-renderizar los tags más usados
// ============================================

export async function generateStaticParams() {
  try {
    const tags = await getWPTags()
    // Solo pre-renderizar los 30 tags más usados para no exceder límites
    return tags.slice(0, 30).map((t) => ({ tag: t.slug }))
  } catch {
    return []
  }
}

// ============================================
// METADATA DINÁMICA
// ============================================

interface TagPageProps {
  params: Promise<{ tag: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const tags = await getWPTags()
  const tagData = tags.find((t) => t.slug === tag)

  if (!tagData) return { title: 'Etiqueta no encontrada' }

  return {
    title: `${tagData.nombre} — Noticias`,
    description: `Artículos etiquetados con "${tagData.nombre}" — Usina de Justicia`,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/noticias/tag/${tag}`,
    },
  }
}

// ============================================
// PÁGINA
// ============================================

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { tag } = await params
  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10))
  const perPage = 12

  // Verificar que el tag existe
  const tags = await getWPTags()
  const tagData = tags.find((t) => t.slug === tag)
  if (!tagData) notFound()

  // Fetch artículos con este tag
  const { data: articulos, total, totalPages } = await getArticulosByTagSlug(
    tag,
    { page: currentPage, perPage }
  )

  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs
          items={[
            { label: 'Noticias', href: '/noticias' },
            { label: `Tag: ${tagData.nombre}`, href: `/noticias/tag/${tag}` },
          ]}
        />
      </div>

      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="w-5 h-5 text-navy-600" aria-hidden="true" />
            <Badge tone="neutral">{tagData.nombre}</Badge>
          </div>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            {tagData.nombre}
          </h1>
          <p className="text-body text-grey-500 mb-10">
            {total} {total === 1 ? 'artículo' : 'artículos'} con esta etiqueta
          </p>

          {/* Volver a noticias */}
          <div className="mb-8">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-1 text-body-sm font-bold text-navy-600 no-underline hover:underline"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Volver a noticias
            </Link>
          </div>

          {/* Listado */}
          {articulos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articulos.map((articulo) => (
                <ArticleCard key={articulo.id} articulo={articulo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-body-lg text-grey-500">
                No hay artículos con esta etiqueta todavía.
              </p>
              <Link
                href="/noticias"
                className="inline-flex items-center gap-1 font-bold text-navy-600 no-underline hover:underline mt-4"
              >
                Ver todos los artículos
              </Link>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              basePath={`/noticias/tag/${tag}`}
            />
          )}
        </div>
      </section>
    </>
  )
}
