import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
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
      canonical: `https://www.usinadejusticia.org.ar/blog/${slug}`,
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

export default async function BlogArticlePage({ params }: SlugPageProps) {
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
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            {
              label: articulo.categoria.nombre,
              href: `/blog/categoria/${articulo.categoria.slug}`,
            },
            { label: articulo.titulo, href: `/blog/${slug}` },
          ]}
        />
      </div>

      <article className="py-section">
        <div className="max-w-narrow mx-auto px-4">
          {/* Header del artículo */}
          <header className="mb-8">
            {/* Categoría */}
            <Link
              href={`/blog/categoria/${articulo.categoria.slug}`}
              className="inline-block px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-body-sm font-medium mb-4 hover:bg-primary-500/20 transition-colors"
            >
              {articulo.categoria.nombre}
            </Link>

            <h1 className="text-h1 lg:text-display text-neutral-900 mb-6">
              {articulo.titulo}
            </h1>

            {/* Meta: autor, fecha, lectura */}
            <div className="flex flex-wrap items-center gap-4 text-body-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {articulo.autor}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(articulo.fechaPublicacion)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime} min de lectura
              </span>
            </div>
          </header>

          {/* Imagen principal */}
          {heroImage && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-10">
              <Image
                src={heroImage}
                alt={articulo.imagenDestacada?.alt || articulo.titulo}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Contenido del artículo */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-neutral-900 prose-headings:font-bold
              prose-p:text-neutral-700 prose-p:leading-relaxed
              prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-lg prose-img:mx-auto
              prose-blockquote:border-l-primary-500 prose-blockquote:text-neutral-600
              prose-strong:text-neutral-900
              prose-hr:border-neutral-200"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          {/* Tags */}
          {articulo.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-neutral-200">
              <Tag className="w-4 h-4 text-neutral-400" />
              {articulo.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 rounded-full text-body-sm bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                >
                  {tag.nombre}
                </Link>
              ))}
            </div>
          )}

          {/* Volver al blog */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-body-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al blog
            </Link>
          </div>
        </div>

        {/* Artículos relacionados */}
        {relacionados.length > 0 && (
          <section className="max-w-content mx-auto px-4 mt-16 pt-16 border-t border-neutral-200">
            <h2 className="text-h2 text-neutral-900 mb-8">
              Artículos relacionados
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relacionados.map((rel) => (
                <article
                  key={rel.id}
                  className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                    {rel.imagenDestacada ? (
                      <Image
                        src={rel.imagenDestacada.url}
                        alt={rel.imagenDestacada.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-500/5">
                        <span className="text-h3 text-primary-500/20 font-bold">
                          UJ
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-body-sm text-neutral-400">
                      {formatDate(rel.fechaPublicacion)}
                    </span>
                    <h3 className="text-h4 text-neutral-900 group-hover:text-primary-500 transition-colors line-clamp-2 mt-1">
                      <Link href={`/blog/${rel.slug}`}>{rel.titulo}</Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}