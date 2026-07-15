import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { ArticleCard } from '@/components/noticias/ArticleCard'
import { getArticulosBySection } from '@/lib/wordpress'
import { siteConfig } from '@/lib/site-config'
import { Map, ArrowUpRight, ChevronRight } from 'lucide-react'

// /observatorio — sección nueva sin página WP de origen (decisión D del plan,
// docs/plan-maestro-usina-web.md §3.1). No hay contenido institucional viejo
// para migrar acá: el copy de "qué es el observatorio" sale de
// src/components/home/Observatorio.tsx (ya aprobado en la Home) y el listado
// de publicaciones sale en vivo de la categoría WP "observatorio" (id 256,
// ver docs/MAPA-MIGRACION.md §1) vía getArticulosBySection.
//
// Nota editorial: el bloque de barras "Homicidios dolosos por jurisdicción"
// de Observatorio.tsx (Home) trae valores de ejemplo sin fuente verificable
// para este commit ("Fuente: relevamiento propio UJ + Ministerio de
// Seguridad" sin dataset citable) — no se replica acá para no publicar una
// estadística no verificada como si fuera un dato real. Ver también la regla
// del brief: "NUNCA inventes estadísticas, informes o datos que no estén en
// estas fuentes".
const description =
  'El observatorio de Usina de Justicia releva, analiza y publica información sobre homicidios, femicidios y el funcionamiento del sistema penal en las 24 jurisdicciones del país.'

export const metadata: Metadata = {
  title: 'Observatorio',
  description,
  alternates: { canonical: `${siteConfig.url}/observatorio` },
  openGraph: {
    title: `Observatorio — ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/observatorio`,
  },
}

// Proyecto hermano de Usina de Justicia, deployado en Vercel, sin dominio
// propio todavía — se linkea tal cual, con nota de que está en desarrollo.
const MAPA_DELITO_URL = 'https://mapa-delito-usina.vercel.app'

// Dataset: `creator` referencia por @id al NGO consolidado del layout raíz
// (src/app/layout.tsx). `isBasedOn` apunta a la fuente oficial de
// estadísticas criminales (SNIC, Ministerio de Seguridad de la Nación) que
// alimenta el trabajo del observatorio; `distribution` es el Mapa del
// Delito ya linkeado más abajo en esta misma página.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Observatorio de Usina de Justicia',
  description,
  creator: { '@id': `${siteConfig.url}/#organization` },
  isBasedOn: 'https://www.argentina.gob.ar/seguridad/estadisticascriminales',
  distribution: {
    '@type': 'DataDownload',
    encodingFormat: 'text/html',
    contentUrl: MAPA_DELITO_URL,
  },
}

export default async function ObservatorioPage() {
  const { data: articulos, total } = await getArticulosBySection('observatorio', {
    perPage: 24,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Observatorio', href: '/observatorio' }]} />
      </div>

      {/* Hero */}
      <section className="pb-16 md:pb-20 pt-2 md:pt-4">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Observatorio de víctimas
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Sin datos no hay política pública.
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Relevamos, analizamos y publicamos información sobre homicidios, femicidios y
            el funcionamiento del sistema penal en las 24 jurisdicciones. Lo hacemos junto
            a las cámaras de Diputados de Santa Fe y la Ciudad de Buenos Aires. Este
            trabajo alimenta, a su vez, la incidencia en políticas públicas y la
            capacitación de operadores del sistema de justicia.
          </p>
        </div>
      </section>

      {/* Mapa del Delito */}
      <section className="py-16 md:py-20 bg-navy-50 border-t border-b border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center bg-white border border-grey-200 rounded-xs p-8 md:p-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xs bg-navy-50 flex items-center justify-center shrink-0">
                  <Map className="w-5 h-5 text-navy-600" aria-hidden="true" />
                </div>
                <h2 className="font-display font-bold text-h2 text-ink">Mapa del Delito</h2>
              </div>
              <p className="text-body text-grey-700 leading-relaxed max-w-[620px]">
                Un proyecto hermano de Usina de Justicia que visualiza datos de delitos en
                el país. Todavía está en desarrollo y vive en su propio sitio, fuera de
                este dominio.
              </p>
            </div>
            <Button
              href={MAPA_DELITO_URL}
              variant="primary"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              Ver el Mapa del Delito
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* Publicaciones del observatorio */}
      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="max-w-[720px] mb-11">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
              Publicaciones
            </p>
            <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5 mb-3.5">
              Informes y publicaciones
            </h2>
            <p className="text-body-lg text-grey-700">
              {total} {total === 1 ? 'publicación' : 'publicaciones'} del observatorio.
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
              No hay publicaciones del observatorio disponibles todavía.
            </p>
          )}

          <div className="mt-10">
            <Link
              href="/noticias/categoria/observatorio"
              className="inline-flex items-center gap-1 text-body-sm font-bold text-navy-600 no-underline hover:underline"
            >
              Ver todas las publicaciones del observatorio
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
