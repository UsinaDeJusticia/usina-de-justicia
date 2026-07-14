import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ChevronLeft } from 'lucide-react'
import { getArticulosByCategorySlug, getArticulosBySection, getWPCategories } from '@/lib/wordpress'
import { SITE_SECTIONS } from '@/types/wordpress'
import type { SiteSection } from '@/types/wordpress'
import { Badge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { Pagination } from '@/components/noticias/Pagination'

// ============================================
// GENERACIÓN ESTÁTICA: pre-renderizar todas las categorías
// ============================================

export async function generateStaticParams() {
  try {
    // Pre-renderizar secciones agrupadas + categorías WP individuales
    const sectionSlugs = Object.keys(SITE_SECTIONS).map((key) => ({ categoria: key }))
    const categorias = await getWPCategories()
    const wpSlugs = categorias.map((cat) => ({ categoria: cat.slug }))
    return [...sectionSlugs, ...wpSlugs]
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

  // Verificar si es una sección agrupada
  if (categoria in SITE_SECTIONS) {
    const section = SITE_SECTIONS[categoria as SiteSection]
    return {
      title: `${section.title} — Noticias`,
      description: `${section.description} — Usina de Justicia`,
      alternates: {
        canonical: `https://www.usinadejusticia.org.ar/noticias/categoria/${categoria}`,
      },
    }
  }

  // Si no, buscar como categoría WP
  const categorias = await getWPCategories()
  const cat = categorias.find((c) => c.slug === categoria)
  if (!cat) return { title: 'Categoría no encontrada' }

  return {
    title: `${cat.nombre} — Noticias`,
    description: `Artículos sobre ${cat.nombre.toLowerCase()} — Usina de Justicia`,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/noticias/categoria/${categoria}`,
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

  // Determinar si es una de las 6 secciones definitivas o una categoría WP suelta
  const isSection = categoria in SITE_SECTIONS
  let title: string
  let description: string | undefined
  let articulosData: Awaited<ReturnType<typeof getArticulosBySection>>

  if (isSection) {
    const section = SITE_SECTIONS[categoria as SiteSection]
    title = section.title
    description = section.description
    articulosData = await getArticulosBySection(categoria as SiteSection, {
      page: currentPage,
      perPage,
    })
  } else {
    const categorias = await getWPCategories()
    const cat = categorias.find((c) => c.slug === categoria)
    if (!cat) notFound()
    title = cat.nombre
    description = cat.descripcion
    articulosData = await getArticulosByCategorySlug(categoria, {
      page: currentPage,
      perPage,
    })
  }

  const { data: articulos, total, totalPages } = articulosData

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
          {articulos.length > 0 ? (
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
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={total}
              basePath={`/noticias/categoria/${categoria}`}
            />
          )}
        </div>
      </section>
    </>
  )
}
