import { generatePageMetadata } from '@/lib/metadata'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Hero } from '@/components/necesito-ayuda/Hero'
import { PrimerosPasos } from '@/components/necesito-ayuda/PrimerosPasos'
import { QueOfrecemos } from '@/components/necesito-ayuda/QueOfrecemos'
import { FAQ, faqItems } from '@/components/necesito-ayuda/FAQ'
import { CTAFinal } from '@/components/necesito-ayuda/CTAFinal'

// /necesito-ayuda — decisión D4 del plan: la página de máxima prioridad del
// sitio, para quien llega en el peor momento (familiar de una víctima de
// homicidio o femicidio). No existía en el sitio viejo; todo el contenido
// factual sale de las páginas WP reales del programa de acompañamiento, de
// QueHacer.tsx/Pillars.tsx (Home, ya aprobados) y de site-config.ts. Ver
// docs/COPY-necesito-ayuda.md para el detalle fuente por sección.
const description =
  'Si perdiste a un ser querido por un hecho de inseguridad, Usina de Justicia te acompaña: asesoramiento jurídico, contención psicológica y grupos de pares. Comunicate con nosotros.'

// generatePageMetadata (ver src/lib/metadata.ts) siempre setea `images` en
// openGraph/twitter — evita la trampa de herencia de Next: una ruta con
// `metadata.openGraph` propio pero SIN `images` no hereda el
// opengraph-image del layout raíz, reemplaza el objeto entero. `path`
// nested (no Home) => appendSiteName default false: el título queda plano
// y el template del layout raíz agrega el sufijo una sola vez.
export const metadata = generatePageMetadata({
  title: 'Necesito ayuda',
  description,
  path: '/necesito-ayuda',
})

// FAQPage a partir de `faqItems`, ya exportado desde el propio componente
// <FAQ> — cero duplicación de copy entre el contenido visible y el JSON-LD.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
}

export default function NecesitoAyudaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Necesito ayuda', href: '/necesito-ayuda' }]} />
      </div>
      <Hero />
      <PrimerosPasos />
      <QueOfrecemos />
      <FAQ />
      <CTAFinal />
    </>
  )
}
