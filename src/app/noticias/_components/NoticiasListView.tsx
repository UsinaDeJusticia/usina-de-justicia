import Link from 'next/link'
import {
  Heart,
  HandHeart,
  Scale,
  Newspaper,
  Landmark,
  BarChart3,
  Megaphone,
  ArrowRight,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import {
  getArticulos,
  getArticulosBySection,
  getCategoryIdsBySection,
} from '@/lib/wordpress'
import { ARTICULOS_PER_PAGE } from '@/lib/pagination'
import { SITE_SECTIONS } from '@/types/wordpress'
import type { SiteSection } from '@/types/wordpress'
import { Badge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { Pagination } from '@/components/noticias/Pagination'

// Ícono por sección — decorativo, no reemplaza el copy de SITE_SECTIONS.
const sectionIcons: Record<SiteSection, React.ReactNode> = {
  historias: <Heart className="w-5 h-5" aria-hidden="true" />,
  acompanamiento: <HandHeart className="w-5 h-5" aria-hidden="true" />,
  incidencia: <Scale className="w-5 h-5" aria-hidden="true" />,
  prensa: <Newspaper className="w-5 h-5" aria-hidden="true" />,
  institucional: <Landmark className="w-5 h-5" aria-hidden="true" />,
  observatorio: <BarChart3 className="w-5 h-5" aria-hidden="true" />,
  'en-los-medios': <Megaphone className="w-5 h-5" aria-hidden="true" />,
}

// Las secciones que escribimos nosotros — la grilla de abajo NO incluye
// "En los medios" (cobertura de terceros): tiene su propia franja aparte,
// más abajo. Con las 7 mezcladas en la misma grilla de 3 columnas quedaría
// una tarjeta huérfana en una cuarta fila, y confundiría autoría propia con
// ajena en el mismo golpe de vista.
const SECCIONES_PROPIAS = Object.entries(SITE_SECTIONS).filter(
  ([, section]) => !section.externa
)

function buildNoticiasPageUrl(page: number): string {
  return page === 1 ? '/noticias' : `/noticias/pagina/${page}`
}

/**
 * Contenido compartido de /noticias y /noticias/pagina/[n]. La validación de
 * `n` (redirect si es 1, notFound si excede el total de páginas) vive en el
 * page.tsx de /pagina/[n] — acá solo se pide y renderiza la página ya
 * resuelta.
 */
export async function NoticiasListView({ page }: { page: number }) {
  // "En los medios" no entra en "Artículos recientes": es cobertura de
  // terceros, no algo que escribimos nosotros (ver `externa` en
  // SITE_SECTIONS). Falla la resolución de categoría → seguimos sin
  // excluir en vez de romper el listado entero por esto.
  let excludeIds: number[] = []
  try {
    excludeIds = await getCategoryIdsBySection('en-los-medios')
  } catch {
    // degradación aceptable, ver comentario arriba
  }

  let articulosResponse: Awaited<ReturnType<typeof getArticulos>> | null = null
  let loadError = false
  try {
    articulosResponse = await getArticulos({
      page,
      perPage: ARTICULOS_PER_PAGE,
      categoriesExclude: excludeIds,
    })
  } catch {
    // Si falla la API de WordPress, mostramos un estado de error digno
    loadError = true
  }

  const {
    data: articulos,
    total,
    totalPages,
  } = articulosResponse ?? { data: [], total: 0, totalPages: 0, currentPage: page }

  // Franja de "En los medios": solo en la página 1 (es un teaser, no un
  // listado completo — el listado completo vive en su propia categoría).
  // Si falla, la franja se oculta entera: no vale la pena mostrar un error
  // acá por algo que es secundario en esta página.
  let mediosTotal = 0
  let mediosOutlets: string[] = []
  if (page === 1) {
    try {
      const mediosResponse = await getArticulosBySection('en-los-medios', {
        perPage: 8,
      })
      mediosTotal = mediosResponse.total
      // Convención editorial: la primera etiqueta de la nota es el nombre
      // del medio (ver docs/GUIA-PUBLICAR.md). Sin esa etiqueta, la nota
      // simplemente no aporta un nombre a esta lista — no rompe nada.
      mediosOutlets = [
        ...new Set(
          mediosResponse.data
            .map((a) => a.tags[0]?.nombre)
            .filter((nombre): nombre is string => Boolean(nombre))
        ),
      ]
    } catch {
      // mediosTotal queda en 0 → la franja no se muestra (ver más abajo)
    }
  }

  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Noticias', href: '/noticias' }]} />
      </div>

      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Usina de Justicia
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Noticias
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow">
            Historias de las familias que acompañamos, nuestro trabajo de incidencia
            en políticas públicas, la cobertura de prensa y los informes del
            observatorio de víctimas.
          </p>

          {/* Grid de las 6 categorías propias — "En los medios" no entra
              acá, tiene su franja aparte debajo (ver SECCIONES_PROPIAS). */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {SECCIONES_PROPIAS.map(([slug, section]) => (
              <Link
                key={slug}
                href={`/noticias/categoria/${slug}`}
                className="group block bg-white border border-grey-200 rounded-xs p-6 no-underline hover:no-underline hover:border-navy-300 hover:shadow-md transition-all duration-base ease-out"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-navy-600">
                    {sectionIcons[slug as SiteSection]}
                  </span>
                  <Badge tone="navy">{section.title}</Badge>
                </div>
                <p className="text-body-sm text-grey-700 leading-relaxed">
                  {section.description}
                </p>
                <span className="inline-flex items-center gap-1 text-body-sm font-bold text-navy-600 mt-4">
                  Ver noticias
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-base ease-out" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          {/* Franja "En los medios": aparte de la grilla de arriba a
              propósito — es cobertura de terceros, no nuestra. Solo se
              muestra si hay al menos una nota (mediosTotal > 0). */}
          {mediosTotal > 0 && (
            <div className="mt-6 bg-navy-600 rounded-xs p-7 md:p-8 flex flex-col md:flex-row md:items-center gap-7">
              <div className="flex-1">
                <h2 className="font-display font-extrabold text-h3 text-white mb-2">
                  En los medios
                </h2>
                <p className="text-body-sm text-navy-100 max-w-[600px] mb-4">
                  {SITE_SECTIONS['en-los-medios'].description}
                </p>
                {mediosOutlets.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {mediosOutlets.map((medio) => (
                      <span
                        key={medio}
                        className="text-caption font-bold text-white border border-navy-400 rounded-pill px-3 py-1"
                      >
                        {medio}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href="/noticias/categoria/en-los-medios"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 bg-white text-navy-600 font-bold text-body-sm rounded-xs px-5 py-3 no-underline hover:no-underline hover:bg-navy-50"
              >
                Ver las {mediosTotal} apariciones
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}

          {/* Listado de artículos recientes */}
          <div className="mt-16 pt-12 border-t border-grey-200">
            <h2 className="font-display font-bold text-h2 text-ink mb-8">
              Artículos recientes
            </h2>

            {loadError ? (
              <div className="text-center py-20">
                <p className="text-body-lg text-grey-500">
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
                <p className="text-body-lg text-grey-500">
                  No se encontraron artículos.
                </p>
              </div>
            )}

            {/* Paginación */}
            {!loadError && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={total}
                basePath="/noticias"
                buildPageUrl={buildNoticiasPageUrl}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
