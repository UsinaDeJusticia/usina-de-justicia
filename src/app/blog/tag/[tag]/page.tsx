import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const tagsValidos: Record<string, string> = {
  legislacion: 'Legislación',
  capacitacion: 'Capacitación',
  justicia: 'Justicia',
}

const articulosPorTag: Record<
  string,
  { titulo: string; slug: string; extracto: string; fecha: string; categoria: string }[]
> = {
  legislacion: [
    {
      titulo: 'Nuevas medidas de protección para víctimas',
      slug: 'nuevas-medidas-proteccion-victimas',
      extracto:
        'Se aprobaron nuevas medidas que buscan fortalecer la protección de las víctimas del delito durante el proceso penal.',
      fecha: '2025-12-15',
      categoria: 'Noticias',
    },
  ],
  capacitacion: [
    {
      titulo: 'Jornada de capacitación en derechos de víctimas',
      slug: 'jornada-capacitacion-derechos-victimas',
      extracto:
        'Se realizó una jornada de capacitación destinada a operadores jurídicos sobre los derechos de las víctimas del delito.',
      fecha: '2025-11-20',
      categoria: 'Eventos',
    },
  ],
  justicia: [
    {
      titulo: 'Comunicado sobre el acceso a justicia',
      slug: 'comunicado-acceso-justicia',
      extracto:
        'Usina de Justicia se pronuncia sobre la situación actual del acceso a justicia para las víctimas del delito en Argentina.',
      fecha: '2025-10-05',
      categoria: 'Comunicados',
    },
  ],
}

interface PageProps {
  params: { tag: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const nombre = tagsValidos[params.tag]
  if (!nombre) return {}

  return {
    title: `${nombre} — Blog`,
    description: `Artículos etiquetados con "${nombre}" sobre derechos de las víctimas del delito.`,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/blog/tag/${params.tag}`,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(tagsValidos).map((tag) => ({ tag }))
}

export default function TagPage({ params }: PageProps) {
  const nombreTag = tagsValidos[params.tag]

  if (!nombreTag) notFound()

  const articulos = articulosPorTag[params.tag] || []

  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: `Tag: ${nombreTag}`, href: `/blog/tag/${params.tag}` },
          ]}
        />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-6 h-6 text-primary-500" />
            <h1 className="text-h1 lg:text-display">{nombreTag}</h1>
          </div>
          <p className="text-body-lg text-neutral-600 max-w-narrow mb-12">
            Artículos etiquetados con &quot;{nombreTag}&quot;
          </p>

          {articulos.length > 0 ? (
            <div className="space-y-6">
              {articulos.map((art) => (
                <article
                  key={art.slug}
                  className="group p-6 bg-white border border-neutral-200 rounded-xl hover:border-primary-500/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500 text-body-sm font-medium">
                      {art.categoria}
                    </span>
                    <span className="flex items-center gap-1 text-body-sm text-neutral-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(art.fecha)}
                    </span>
                  </div>
                  <h2 className="text-h3 text-neutral-900 group-hover:text-primary-500 transition-colors">
                    <Link href={`/blog/${art.slug}`}>{art.titulo}</Link>
                  </h2>
                  <p className="text-body text-neutral-600 mt-2">{art.extracto}</p>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="inline-flex items-center gap-1 text-body-sm font-medium text-primary-500 mt-4"
                  >
                    Leer más
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-body-lg text-neutral-500">
                No hay artículos con esta etiqueta todavía.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 font-medium mt-4 transition-colors"
              >
                Ver todos los artículos
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}