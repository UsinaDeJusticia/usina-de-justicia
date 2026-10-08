import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { getArticulosBySection } from '@/lib/wordpress'
import { generatePageMetadata } from '@/lib/metadata'

const description =
  'Archivo de publicaciones históricas de Usina de Justicia sobre los derechos de las víctimas, la justicia penal y la incidencia pública.'

export const metadata = generatePageMetadata({
  title: 'Archivo de publicaciones',
  description,
  path: '/observatorio',
})

export default async function ObservatorioPage() {
  const { data: articulos, total } = await getArticulosBySection('observatorio', {
    perPage: 24,
  })

  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Archivo de publicaciones', href: '/observatorio' }]} />
      </div>

      <section className="pb-16 md:pb-20 pt-2 md:pt-4">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Archivo de publicaciones
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Publicaciones sobre los derechos de las víctimas
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Este archivo conserva publicaciones históricas de Usina de Justicia sobre los
            derechos de las víctimas, la justicia penal y la incidencia pública. Para conocer
            la actividad actual de la asociación, visitá{' '}
            <Link href="/nosotros" className="underline underline-offset-2">
              Nosotros
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="max-w-[720px] mb-11">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
              Archivo
            </p>
            <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5 mb-3.5">
              Publicaciones
            </h2>
            <p className="text-body-lg text-grey-700">
              {total} {total === 1 ? 'publicación' : 'publicaciones'} disponibles.
            </p>
          </div>

          {articulos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articulos.map((articulo) => (
                <ArticleCard key={articulo.id} articulo={articulo} />
              ))}
            </div>
          ) : (
            <p className="text-body-lg text-grey-500 py-10">
              No hay publicaciones disponibles en este archivo.
            </p>
          )}

          <div className="mt-10">
            <Link
              href="/noticias/categoria/observatorio"
              className="inline-flex items-center gap-1 text-body-sm font-bold text-navy-600 no-underline hover:underline"
            >
              Ver todas las publicaciones relacionadas
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
