import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Calendar, ArrowLeft, User, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'

// PLACEHOLDER — Reemplazar con fetch desde Strapi
const articulosData: Record<
  string,
  {
    titulo: string
    extracto: string
    contenido: string
    categoria: string
    categoriaSlug: string
    autor: string
    fecha: string
    tags: { nombre: string; slug: string }[]
  }
> = {
  'nuevas-medidas-proteccion-victimas': {
    titulo: 'Nuevas medidas de protección para víctimas',
    extracto:
      'Se aprobaron nuevas medidas que buscan fortalecer la protección de las víctimas del delito durante el proceso penal.',
    contenido: `
      <p>Contenido completo del artículo. Este es un placeholder que será reemplazado con el contenido real scrapeado del sitio actual.</p>
      <p>El artículo completo incluirá toda la información relevante sobre las nuevas medidas de protección para las víctimas del delito.</p>
    `,
    categoria: 'Noticias',
    categoriaSlug: 'noticias',
    autor: 'Usina de Justicia',
    fecha: '2025-12-15',
    tags: [{ nombre: 'Legislación', slug: 'legislacion' }],
  },
  'jornada-capacitacion-derechos-victimas': {
    titulo: 'Jornada de capacitación en derechos de víctimas',
    extracto:
      'Se realizó una jornada de capacitación destinada a operadores jurídicos sobre los derechos de las víctimas del delito.',
    contenido: `
      <p>Contenido completo del artículo. Placeholder para reemplazar con contenido real.</p>
    `,
    categoria: 'Eventos',
    categoriaSlug: 'eventos',
    autor: 'Usina de Justicia',
    fecha: '2025-11-20',
    tags: [{ nombre: 'Capacitación', slug: 'capacitacion' }],
  },
  'comunicado-acceso-justicia': {
    titulo: 'Comunicado sobre el acceso a justicia',
    extracto:
      'Usina de Justicia se pronuncia sobre la situación actual del acceso a justicia para las víctimas del delito en Argentina.',
    contenido: `
      <p>Contenido completo del comunicado. Placeholder para reemplazar con contenido real.</p>
    `,
    categoria: 'Comunicados',
    categoriaSlug: 'comunicados',
    autor: 'Usina de Justicia',
    fecha: '2025-10-05',
    tags: [{ nombre: 'Justicia', slug: 'justicia' }],
  },
}

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const art = articulosData[params.slug]
  if (!art) return {}

  return {
    title: art.titulo,
    description: art.extracto,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/blog/${params.slug}`,
    },
    openGraph: {
      title: `${art.titulo} — Usina de Justicia`,
      description: art.extracto,
      type: 'article',
      publishedTime: art.fecha,
      authors: [art.autor],
    },
  }
}

export function generateStaticParams() {
  return Object.keys(articulosData).map((slug) => ({ slug }))
}

export default function ArticuloPage({ params }: PageProps) {
  const art = articulosData[params.slug]

  if (!art) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: art.titulo,
    description: art.extracto,
    datePublished: art.fecha,
    author: { '@type': 'Organization', name: art.autor },
    publisher: { '@type': 'NGO', name: 'Usina de Justicia' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: art.titulo, href: `/blog/${params.slug}` },
          ]}
        />
      </div>

      <article className="py-section">
        <div className="max-w-narrow mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-body-sm text-primary-500 hover:text-primary-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Blog
          </Link>

          {/* Categoría */}
          <Link
            href={`/blog/categoria/${art.categoriaSlug}`}
            className="inline-block px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-body-sm font-medium mb-4"
          >
            {art.categoria}
          </Link>

          <h1 className="text-h1 lg:text-display mb-6">{art.titulo}</h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-body-sm text-neutral-500 mb-10 pb-8 border-b border-neutral-200">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {art.autor}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(art.fecha)}
            </span>
          </div>

          {/* Contenido */}
          <div
            className="prose prose-lg max-w-none text-neutral-700
              prose-headings:text-neutral-900 prose-headings:font-semibold
              prose-h2:text-h3 prose-h2:mt-10 prose-h2:mb-4
              prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: art.contenido }}
          />

          {/* Tags */}
          {art.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-neutral-200">
              <Tag className="w-4 h-4 text-neutral-400" />
              {art.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-body-sm hover:bg-primary-500/10 hover:text-primary-500 transition-colors"
                >
                  {tag.nombre}
                </Link>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  )
}