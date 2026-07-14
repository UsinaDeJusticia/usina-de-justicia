import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getArticulos } from '@/lib/wordpress'
import { SITE_SECTIONS } from '@/types/wordpress'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { Pagination } from '@/components/noticias/Pagination'

export const metadata: Metadata = {
  title: 'Noticias',
  description:
    'Noticias, comunicados, artículos de opinión y cobertura de prensa sobre derechos de las víctimas del delito en Argentina.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/noticias' },
}

// Secciones agrupadas para los filtros
function getSectionFilters() {
  return Object.entries(SITE_SECTIONS).map(([key, section]) => ({
    nombre: section.title,
    slug: key,
  }))
}

// Next.js 14: searchParams para paginación
interface NoticiasPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function NoticiasPage({ searchParams }: NoticiasPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1', 10))
  const perPage = 12

  const sectionFilters = getSectionFilters()

  let articulosResponse: Awaited<ReturnType<typeof getArticulos>> | null = null
  let loadError = false
  try {
    articulosResponse = await getArticulos({ page: currentPage, perPage })
  } catch {
    // Si falla la API de WordPress, mostramos un estado de error digno
    loadError = true
  }

  const {
    data: articulos,
    total,
    totalPages,
  } = articulosResponse ?? { data: [], total: 0, totalPages: 0, currentPage }

  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Noticias', href: '/noticias' }]} />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display mb-4">Noticias</h1>
          <p className="text-body-lg text-neutral-600 max-w-narrow mb-10">
            Noticias, comunicados y artículos sobre los derechos de las víctimas
            del delito en Argentina.
          </p>

          {/* Filtro de categorías */}
          <div className="flex flex-wrap gap-2 mb-12">
            <Link
              href="/noticias"
              className="px-4 py-2 rounded-full text-body-sm font-medium border border-primary-500 bg-primary-500 text-white transition-colors"
            >
              Todas
            </Link>
            {sectionFilters.map((section) => (
              <Link
                key={section.slug}
                href={`/noticias/categoria/${section.slug}`}
                className="px-4 py-2 rounded-full text-body-sm font-medium border border-neutral-200 text-neutral-600 hover:border-primary-500 hover:text-primary-500 transition-colors"
              >
                {section.nombre}
              </Link>
            ))}
          </div>

          {/* Listado de artículos */}
          {loadError ? (
            <div className="text-center py-20">
              <p className="text-body-lg text-neutral-500">
                No pudimos cargar las noticias en este momento. Por favor,
                intentá de nuevo más tarde.
              </p>
            </div>
          ) : articulos.length > 0 ? (
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
          {!loadError && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              basePath="/noticias"
            />
          )}
        </div>
      </section>
    </>
  )
}
