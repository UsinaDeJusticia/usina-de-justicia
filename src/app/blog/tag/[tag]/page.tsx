import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ChevronLeft, Tag as TagIcon } from 'lucide-react'
import { getWPTags, getArticulosByTagSlug } from '@/lib/wordpress'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { Pagination } from '@/components/blog/Pagination'

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
    title: `${tagData.nombre} — Blog`,
    description: `Artículos etiquetados con "${tagData.nombre}" — Usina de Justicia`,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/blog/tag/${tag}`,
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
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: `Tag: ${tagData.nombre}`, href: `/blog/tag/${tag}` },
          ]}
        />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <TagIcon className="w-6 h-6 text-primary-500" />
            <h1 className="text-h1 lg:text-display">{tagData.nombre}</h1>
          </div>
          <p className="text-body text-neutral-500 mb-12">
            {total} {total === 1 ? 'artículo' : 'artículos'} con esta etiqueta
          </p>

          {/* Volver al blog */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-body-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver al blog
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
              <p className="text-body-lg text-neutral-500">
                No hay artículos con esta etiqueta todavía.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium mt-4 transition-colors"
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
              basePath={`/blog/tag/${tag}`}
            />
          )}
        </div>
      </section>
    </>
  )
}

