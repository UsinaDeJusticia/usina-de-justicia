import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Tag as TagIcon } from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { getWPTags, getArticulosByTagSlug } from '@/lib/wordpress'
import { ARTICULOS_PER_PAGE } from '@/lib/pagination'
import { Badge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { Pagination } from '@/components/noticias/Pagination'

/**
 * Contenido compartido de /noticias/tag/[tag] y su segmento /pagina/[n]. La
 * validación de `n` (redirect si es 1, notFound si excede el total) vive en
 * cada page.tsx; la existencia del tag se valida acá mismo (notFound si no
 * existe), ya que la necesitan ambas rutas por igual.
 */
export async function TagListView({
  tag,
  page,
}: {
  tag: string
  page: number
}) {
  const tags = await getWPTags()
  const tagData = tags.find((t) => t.slug === tag)
  if (!tagData) notFound()

  let articulosData: Awaited<ReturnType<typeof getArticulosByTagSlug>> | null =
    null
  let loadError = false
  try {
    articulosData = await getArticulosByTagSlug(tag, {
      page,
      perPage: ARTICULOS_PER_PAGE,
    })
  } catch {
    loadError = true
  }

  const { data: articulos, total, totalPages } =
    articulosData ?? { data: [], total: 0, totalPages: 0, currentPage: page }

  function buildPageUrl(p: number): string {
    return p === 1 ? `/noticias/tag/${tag}` : `/noticias/tag/${tag}/pagina/${p}`
  }

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
          {!loadError && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              total={total}
              basePath={`/noticias/tag/${tag}`}
              buildPageUrl={buildPageUrl}
            />
          )}
        </div>
      </section>
    </>
  )
}
