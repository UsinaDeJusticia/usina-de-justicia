import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getArticulosBySection } from '@/lib/wordpress'
import { ARTICULOS_PER_PAGE } from '@/lib/pagination'
import { SITE_SECTIONS } from '@/types/wordpress'
import type { SiteSection } from '@/types/wordpress'
import { Badge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { Pagination } from '@/components/noticias/Pagination'

/**
 * Contenido compartido de /noticias/categoria/[categoria] y su segmento
 * /pagina/[n]. La validación de `categoria` (notFound si no es una de las 6
 * secciones) y de `n` (redirect si es 1, notFound si excede el total) vive
 * en cada page.tsx — acá solo se pide y renderiza la página ya resuelta.
 */
export async function CategoriaListView({
  categoria,
  page,
}: {
  categoria: SiteSection
  page: number
}) {
  const section = SITE_SECTIONS[categoria]
  const title = section.title
  const description = section.description

  let articulosData: Awaited<ReturnType<typeof getArticulosBySection>> | null =
    null
  let loadError = false
  try {
    articulosData = await getArticulosBySection(categoria, {
      page,
      perPage: ARTICULOS_PER_PAGE,
    })
  } catch {
    loadError = true
  }

  const { data: articulos, total, totalPages } =
    articulosData ?? { data: [], total: 0, totalPages: 0, currentPage: page }

  function buildPageUrl(p: number): string {
    return p === 1
      ? `/noticias/categoria/${categoria}`
      : `/noticias/categoria/${categoria}/pagina/${p}`
  }

  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs
          items={[
            { label: 'Noticias', href: '/noticias' },
            { label: title, href: `/noticias/categoria/${categoria}` },
          ]}
        />
      </div>

      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="mb-4">
            <Badge tone="navy">{title}</Badge>
          </div>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-body-lg text-grey-700 max-w-narrow mb-6">
              {description}
            </p>
          )}
          <p className="text-body text-grey-500 mb-10">
            {total} {total === 1 ? 'artículo' : 'artículos'} en esta categoría
          </p>

          {/* Volver a noticias */}
          <div className="mb-8">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-1 text-body-sm font-bold text-navy-600 no-underline hover:underline"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Ver todas las categorías
            </Link>
          </div>

          {/* Listado */}
          {loadError ? (
            <div className="text-center py-20">
              <p className="text-body-lg text-grey-500">
                No pudimos cargar los artículos en este momento. Por favor,
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
              <p className="text-body-lg text-grey-500">
                No hay artículos en esta categoría todavía.
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
          {!loadError && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              total={total}
              basePath={`/noticias/categoria/${categoria}`}
              buildPageUrl={buildPageUrl}
            />
          )}
        </div>
      </section>
    </>
  )
}
