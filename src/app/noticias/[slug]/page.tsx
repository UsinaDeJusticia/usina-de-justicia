import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Calendar, User, Clock, ArrowLeft, Tag as TagIcon } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import {
  getArticuloBySlug,
  getArticulos,
  cleanWPContent,
  estimateReadTime,
  extractFirstImage,
} from '@/lib/wordpress'

// ============================================
// GENERACIÓN ESTÁTICA: los 20 más recientes se pre-renderizan
// ============================================

export async function generateStaticParams() {
  try {
    const { data: articulos } = await getArticulos({ perPage: 20 })
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
      description: articulo.extracto,
      type: 'article',
      publishedTime: articulo.fechaPublicacion,
      modifiedTime: articulo.updatedAt,
      authors: [articulo.autor],
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
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
    const result = await getArticulos({
      perPage: 3,
      categories: [Number(articulo.categoria.id)],
    })
    relacionados = result.data.filter((a) => a.id !== articulo.id).slice(0, 3)
  } catch {
    // Si falla, seguimos sin relacionados
  }

  return (
    <>
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
