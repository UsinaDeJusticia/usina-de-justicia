import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { BuscadorClient } from '@/components/buscar/BuscadorClient'
import { generatePageMetadata } from '@/lib/metadata'

// /buscar — búsqueda del sitio. Shell 100% estático: la query vive en el
// cliente (useSearchParams dentro de <Suspense>, mismo patrón que
// ListaDocumentos en /recursos), así esta ruta no se vuelve dinámica por
// request. El motor está en src/lib/buscador.ts y el endpoint en
// /api/buscar; este archivo solo pone el marco de la página.
//
// noIndex: página de resultados de búsqueda interna — nunca indexable
// (regla básica de SEO; además robots.ts la excluye con disallow y la API
// manda X-Robots-Tag: noindex).

export const metadata = generatePageMetadata({
  title: 'Buscar',
  description: 'Buscá en todas las noticias, informes y páginas de Usina de Justicia.',
  path: '/buscar',
  noIndex: true,
})

export default function BuscarPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Buscar', href: '/buscar' }]} />
      </div>

      <section className="pb-16 md:pb-20 pt-2 md:pt-4">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Usina de Justicia
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Buscar en el sitio
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Encontrá noticias, informes y páginas de Usina de Justicia.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-narrow mx-auto px-4 md:px-10">
          {/* El fallback puede ser null porque la página es noindex: no hay
              crawler que necesite contenido sin JS. */}
          <Suspense fallback={null}>
            <BuscadorClient />
          </Suspense>
        </div>
      </section>
    </>
  )
}
