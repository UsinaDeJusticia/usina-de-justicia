import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ChevronLeft, FolderOpen } from 'lucide-react'
import { getArticulosByCategorySlug, getWPCategories } from '@/lib/wordpress'
import { ArticleCard } from '@/components/blog/ArticleCard'
import { Pagination } from '@/components/blog/Pagination'

// ============================================
// GENERACIÓN ESTÁTICA: pre-renderizar todas las categorías
// ============================================

export async function generateStaticParams() {
  try {
    const categorias = await getWPCategories()
    return categorias.map((cat) => ({ categoria: cat.slug }))
  } catch {
    return []
  }
}

// ============================================
// METADATA DINÁMICA
// ============================================

interface CategoriaPageProps {
  params: Promise<{ categoria: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: CategoriaPageProps): Promise<Metadata> {
  const { categoria } = await params
  const categorias = await getWPCategories()
  const cat = categorias.find((c) => c.slug === categoria)

  if (!cat) return { title: 'Categoría no encontrada' }

  return {
    title: `${cat.nombre} — Blog`,
    description: `Artículos sobre ${cat.nombre.toLowerCase()} — Usina de Justicia`,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/blog/categoria/${categoria}`,
    },
  }
}

// ============================================
// PÁGINA
// ============================================

export default async function CategoriaPage({
  params,
  searchParams,
}: CategoriaPageProps) {
  const { categoria } = await params
  const sp = await searchParams
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10))
  const perPage = 12

  // Verificar que la categoría existe
  const categorias = await getWPCategories()
  const cat = categorias.find((c) => c.slug === categoria)
  if (!cat) notFound()

  // Fetch artículos de esta categoría
  const { data: articulos, total, totalPages } = await getArticulosByCategorySlug(
    categoria,
    { page: currentPage, perPage }
  )

  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: cat.nombre, href: `/blog/categoria/${categoria}` },
          ]}
        />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <FolderOpen className="w-6 h-6 text-primary-500" />
            <h1 className="text-h1 lg:text-display">{cat.nombre}</h1>
          </div>
          {cat.descripcion && (
            <p className="text-body-lg text-neutral-600 max-w-narrow mb-6">
              {cat.descripcion}
            </p>
          )}
          <p className="text-body text-neutral-500 mb-12">
            {total} {total === 1 ? 'artículo' : 'artículos'} en esta categoría
          </p>

          {/* Volver al blog */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-body-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Ver todas las categorías
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
                No hay artículos en esta categoría todavía.
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
              basePath={`/blog/categoria/${categoria}`}
            />
          )}
        </div>
      </section>
    </>
  )
}

