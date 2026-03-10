import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getArticulos, getWPCategories } from '@/lib/wordpress'
import { CATEGORY_MAP } from '@/types/wordpress'
import type { Articulo, Categoria } from '@/types'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Noticias, comunicados, artículos de opinión y cobertura de prensa sobre derechos de las víctimas del delito en Argentina.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/blog' },
}

// Categorías que mostramos como filtros (las que no son null en CATEGORY_MAP)
async function getFilterCategories(): Promise<Categoria[]> {
  const wpCategories = await getWPCategories()
  // Filtrar solo las que están mapeadas y tienen posts
  return wpCategories.filter(
    (cat) => cat.slug in CATEGORY_MAP && CATEGORY_MAP[cat.slug] !== null
  )
}

// Next.js 14: searchParams para paginación
interface BlogPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))
  const perPage = 12

  // Fetch en paralelo: artículos + categorías para filtros
  const [articulosResponse, filterCategorias] = await Promise.all([
    getArticulos({ page: currentPage, perPage }),
    getFilterCategories(),
  ])

  const { data: articulos, total, totalPages } = articulosResponse

  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display mb-4">Blog</h1>
          <p className="text-body-lg text-neutral-600 max-w-narrow mb-10">
            Noticias, comunicados y artículos sobre los derechos de las víctimas
            del delito en Argentina.
          </p>

          {/* Filtro de categorías */}
          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full text-body-sm font-medium border border-primary-500 bg-primary-500 text-white transition-colors"
            >
              Todas
            </Link>
            {filterCategorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/categoria/${cat.slug}`}
                className="px-4 py-2 rounded-full text-body-sm font-medium border border-neutral-200 text-neutral-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                {cat.nombre}
              </Link>
            ))}
          </div>

          {/* Listado de artículos */}
          {articulos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articulos.map((articulo) => (
                <ArticleCard key={articulo.id} articulo={articulo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-body-lg text-neutral-500">
                No se encontraron artículos.
              </p>
            </div>
          )}

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            basePath="/blog"
          />
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
      {/* Imagen */}
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
        {/* Categoría + Fecha */}
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
  if (totalPages <= 1) {
    return (
      <div className="flex justify-center mt-12">
        <p className="text-body-sm text-neutral-400">
          Mostrando {total} {total === 1 ? 'artículo' : 'artículos'}
        </p>
      </div>
    )
  }

  // Calcular rango de páginas a mostrar
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
    <nav
      className="flex flex-col items-center gap-4 mt-12"
      aria-label="Paginación del blog"
    >
      <div className="flex items-center gap-2">
        {/* Anterior */}
        {currentPage > 1 ? (
          <Link
            href={pageUrl(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-300 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </span>
        )}

        {/* Números de página */}
        {startPage > 1 && (
          <>
            <Link
              href={pageUrl(1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              1
            </Link>
            {startPage > 2 && (
              <span className="text-neutral-400 px-1">…</span>
            )}
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
            {endPage < totalPages - 1 && (
              <span className="text-neutral-400 px-1">…</span>
            )}
            <Link
              href={pageUrl(totalPages)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Siguiente */}
        {currentPage < totalPages ? (
          <Link
            href={pageUrl(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Página siguiente"
          >
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
        Página {currentPage} de {totalPages} — {total} artículos en total
      </p>
    </nav>
  )
}