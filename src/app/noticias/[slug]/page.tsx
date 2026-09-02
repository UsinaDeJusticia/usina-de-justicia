import { jsonLdScript } from '@/lib/json-ld'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Calendar, User, Clock, ArrowLeft, Tag as TagIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { siteConfig } from '@/lib/site-config'
import {
  getArticuloBySlug,
  getArticulos,
  cleanWPContent,
  estimateReadTime,
  extractFirstImage,
  WP_REVALIDATE_ARCHIVO,
} from '@/lib/wordpress'
import type { Articulo } from '@/types'

// ============================================
// Una nota publicada no cambia sola: 24h de ventana ISR en vez de los 5 min
// que se heredaban antes. Las 842 notas son la superficie que un rastreador
// barre de punta a punta, y con 5 min NUNCA encontraba caché válido: cada
// visita disparaba un re-render completo. Eso fue lo que llevó la CPU activa
// de Vercel al 100% de la cuota (2-sep-2026, ver el comentario largo en
// src/lib/wordpress.ts).
//
// Las ediciones NO esperan estas 24h: el plugin de WordPress avisa por
// webhook con la ruta puntual de la nota y se refresca al instante.
//
// Los fetches de esta ruta también van a 24h: el revalidate efectivo es el
// MÍNIMO entre el del segmento y el de cada fetch, así que dejar uno corto
// anularía todo esto.
// ============================================

// Literal a propósito: Next.js exige que este export sea un número que pueda
// leer sin ejecutar el módulo, así que no acepta la constante importada
// (`Unknown identifier at "revalidate"` en build). Tiene que seguir igual a
// WP_REVALIDATE_ARCHIVO de src/lib/wordpress.ts — si cambia una, cambiar la otra.
export const revalidate = 86400 // 24 h — igual a WP_REVALIDATE_ARCHIVO

// ============================================
// GENERACIÓN ESTÁTICA: los 100 más recientes se pre-renderizan (1 sola
// llamada a WP con perPage 100 — el resto se genera on-demand vía ISR).
// ============================================

export async function generateStaticParams() {
  try {
    const { data: articulos } = await getArticulos(
      { perPage: 100 },
      WP_REVALIDATE_ARCHIVO
    )
    return articulos.map((articulo) => ({ slug: articulo.slug }))
  } catch {
    return []
  }
}

// ============================================
// METADATA DINÁMICA PARA SEO
// ============================================

interface SlugPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const articulo = await getArticuloBySlug(slug)

  if (!articulo) {
    return { title: 'Artículo no encontrado' }
  }

  const ogImage = articulo.imagenDestacada?.url || undefined

  return {
    title: articulo.seoTitle || articulo.titulo,
    description: articulo.seoDescription || articulo.extracto,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/noticias/${slug}`,
    },
    openGraph: {
      title: articulo.titulo,
      // seoDescription primero: nunca queda vacío (cae al título cuando el
      // post no tiene excerpt — ver comentario en wpPostToArticulo). Auditoría
      // de contenido delgado, 26-ago-2026, ver docs/ESTADO.md.
      description: articulo.seoDescription || articulo.extracto,
      type: 'article',
      publishedTime: articulo.fechaPublicacion,
      modifiedTime: articulo.updatedAt,
      authors: [articulo.autor],
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  }
}

// ============================================
// JSON-LD: NewsArticle
// ============================================

// El autor por defecto de wordpress.ts (wpPostToArticulo) cuando WP no trae
// un autor embebido es exactamente el nombre de la organización — se usa
// ese mismo valor como heurística para decidir Person vs Organization, sin
// necesitar un campo nuevo en el tipo Articulo.
function buildNewsArticleJsonLd(articulo: Articulo, slug: string) {
  const url = `${siteConfig.url}/noticias/${slug}`
  const esOrganizacion = articulo.autor === siteConfig.name

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: articulo.titulo,
    // Mismo fallback que generateMetadata arriba: seoDescription nunca
    // queda vacío.
    description: articulo.seoDescription || articulo.extracto,
    datePublished: articulo.fechaPublicacion,
    dateModified: articulo.updatedAt,
    articleSection: articulo.categoria.nombre,
    author: esOrganizacion
      ? { '@id': `${siteConfig.url}/#organization` }
      : { '@type': 'Person', name: articulo.autor },
    publisher: { '@id': `${siteConfig.url}/#organization` },
    ...(articulo.imagenDestacada && {
      image: [articulo.imagenDestacada.url],
    }),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isAccessibleForFree: true,
  }
}

// ============================================
// PÁGINA
// ============================================

export default async function NoticiaArticlePage({ params }: SlugPageProps) {
  const { slug } = await params
  const articulo = await getArticuloBySlug(slug)

  if (!articulo) {
    notFound()
  }

  const readTime = estimateReadTime(articulo.contenido)
  const cleanContent = cleanWPContent(articulo.contenido)

  // Imagen: featured o la primera del contenido
  const heroImage =
    articulo.imagenDestacada?.url || extractFirstImage(articulo.contenido)

  // Artículos relacionados (misma categoría, excluyendo el actual)
  let relacionados: Awaited<ReturnType<typeof getArticulos>>['data'] = []
  try {
    const result = await getArticulos(
      {
        perPage: 3,
        categories: [Number(articulo.categoria.id)],
      },
      WP_REVALIDATE_ARCHIVO
    )
    relacionados = result.data.filter((a) => a.id !== articulo.id).slice(0, 3)
  } catch {
    // Si falla, seguimos sin relacionados
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(buildNewsArticleJsonLd(articulo, slug)),
        }}
      />

      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs
          items={[
            { label: 'Noticias', href: '/noticias' },
            {
              label: articulo.categoria.nombre,
              href: `/noticias/categoria/${articulo.categoria.slug}`,
            },
            { label: articulo.titulo, href: `/noticias/${slug}` },
          ]}
        />
      </div>

      <article className="py-16 md:py-20">
        <div className="max-w-narrow mx-auto px-4">
          {/* Header del artículo */}
          <header className="mb-8">
            {/* Categoría */}
            <Link
              href={`/noticias/categoria/${articulo.categoria.slug}`}
              className="inline-block no-underline hover:no-underline mb-4"
            >
              <Badge tone="navy">{articulo.categoria.nombre}</Badge>
            </Link>

            <h1 className="font-display font-extrabold text-ink text-[clamp(1.875rem,4vw,2.75rem)] leading-tight mb-6">
              {articulo.titulo}
            </h1>

            {/* Meta: autor, fecha, lectura */}
            <div className="flex flex-wrap items-center gap-4 text-body-sm text-grey-600">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" aria-hidden="true" />
                {articulo.autor}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {formatDate(articulo.fechaPublicacion)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" aria-hidden="true" />
                {readTime} min de lectura
              </span>
            </div>
          </header>

          {/* Imagen principal */}
          {heroImage && (
            <div className="relative aspect-video rounded-xs overflow-hidden mb-10 bg-navy-50">
              <Image
                src={heroImage}
                alt={articulo.imagenDestacada?.alt || articulo.titulo}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Contenido del artículo */}
          <div
            className="prose prose-lg max-w-none font-body
              prose-headings:font-display prose-headings:text-ink prose-headings:font-bold
              prose-p:text-grey-800 prose-p:leading-relaxed
              prose-a:text-navy-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xs prose-img:mx-auto
              prose-blockquote:border-l-navy-600 prose-blockquote:text-grey-700
              prose-strong:text-ink
              prose-hr:border-grey-200"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          {/* Tags */}
          {articulo.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-grey-200">
              <TagIcon className="w-4 h-4 text-grey-400" aria-hidden="true" />
              {articulo.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/noticias/tag/${tag.slug}`}
                  className="no-underline hover:no-underline"
                >
                  <Badge tone="neutral">{tag.nombre}</Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Volver a noticias */}
          <div className="mt-10">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-body-sm font-bold text-navy-600 no-underline hover:underline"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Volver a noticias
            </Link>
          </div>
        </div>

        {/* Artículos relacionados */}
        {relacionados.length > 0 && (
          <section className="max-w-content mx-auto px-4 md:px-10 mt-16 pt-16 border-t border-grey-200">
            <h2 className="font-display font-bold text-h2 text-ink mb-8">
              Artículos relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relacionados.map((rel) => (
                <ArticleCard key={rel.id} articulo={rel} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
