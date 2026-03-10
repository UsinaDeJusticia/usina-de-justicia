import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Calendar, ArrowRight, ChevronLeft, ChevronRight, Tag as TagIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getWPTags, getArticulosByTagSlug } from '@/lib/wordpress'
import type { Articulo } from '@/types'

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

// ============================================
// COMPONENTES INTERNOS
// ============================================

function ArticleCard({ articulo }: { articulo: Articulo }) {
  return (
    <article className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-video bg-neutral-100 relative overflow-hidden">
        {articulo.imagenDestacada ? (
          <Image
            src={articulo.imagenDestacada.url}
            alt={articulo.imagenDestacada.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-500/5">
            <span className="text-h2 text-primary-500/20 font-bold">UJ</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500 text-body-sm font-medium">
            {articulo.categoria.nombre}
          </span>
          <span className="flex items-center gap-1 text-body-sm text-neutral-400">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(articulo.fechaPublicacion)}
          </span>
        </div>
        <h2 className="text-h4 text-neutral-900 group-hover:text-primary-500 transition-colors line-clamp-2">
          <Link href={`/blog/${articulo.slug}`}>{articulo.titulo}</Link>
        </h2>
        <p className="text-body-sm text-neutral-600 mt-2 line-clamp-3">
          {articulo.extracto}
        </p>
        <Link
          href={`/blog/${articulo.slug}`}
          className="inline-flex items-center gap-1 text-body-sm font-medium text-primary-500 mt-4"
        >
          Leer más
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  )
}

function Pagination({
  currentPage,
  totalPages,
  total,
  basePath,
}: {
  currentPage: number
  totalPages: number
  total: number
  basePath: string
}) {
  const maxVisible = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const endPage = Math.min(totalPages, startPage + maxVisible - 1)
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )

  function pageUrl(page: number): string {
    return page === 1 ? basePath : `${basePath}?page=${page}`
  }

  return (
    <nav className="flex flex-col items-center gap-4 mt-12" aria-label="Paginación">
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link href={pageUrl(currentPage - 1)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-300 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </span>
        )}

        {startPage > 1 && (
          <>
            <Link href={pageUrl(1)} className="w-10 h-10 flex items-center justify-center rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors">1</Link>
            {startPage > 2 && <span className="text-neutral-400 px-1">…</span>}
          </>
        )}

        {pages.map((page) => (
          <Link
            key={page}
            href={pageUrl(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-body-sm transition-colors ${
              page === currentPage
                ? 'bg-primary-500 text-white font-medium'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-neutral-400 px-1">…</span>}
            <Link href={pageUrl(totalPages)} className="w-10 h-10 flex items-center justify-center rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors">{totalPages}</Link>
          </>
        )}

        {currentPage < totalPages ? (
          <Link href={pageUrl(currentPage + 1)} className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors">
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-300 cursor-not-allowed">
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
      <p className="text-body-sm text-neutral-400">
        Página {currentPage} de {totalPages} — {total} artículos
      </p>
    </nav>
  )
}
