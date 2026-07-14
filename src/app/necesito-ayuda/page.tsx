import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { siteConfig } from '@/lib/site-config'
import { Hero } from '@/components/necesito-ayuda/Hero'
import { PrimerosPasos } from '@/components/necesito-ayuda/PrimerosPasos'
import { QueOfrecemos } from '@/components/necesito-ayuda/QueOfrecemos'
import { FAQ } from '@/components/necesito-ayuda/FAQ'
import { CTAFinal } from '@/components/necesito-ayuda/CTAFinal'

// /necesito-ayuda — decisión D4 del plan: la página de máxima prioridad del
// sitio, para quien llega en el peor momento (familiar de una víctima de
// homicidio o femicidio). No existía en el sitio viejo; todo el contenido
// factual sale de las páginas WP reales del programa de acompañamiento, de
// QueHacer.tsx/Pillars.tsx (Home, ya aprobados) y de site-config.ts. Ver
// docs/COPY-necesito-ayuda.md para el detalle fuente por sección.
//
// Nota: no usamos generatePageMetadata acá (ver src/app/contacto/layout.tsx)
// porque ese helper ya agrega el sufijo " — Usina de Justicia"; en una ruta
// anidada el template del layout raíz lo volvería a agregar y duplicaría el
// sufijo. Un título plano deja que el template lo agregue una sola vez.
const description =
  'Si perdiste a un ser querido por un hecho de inseguridad, Usina de Justicia te acompaña: asesoramiento jurídico, contención psicológica y grupos de pares. Comunicate con nosotros.'

export const metadata: Metadata = {
  title: 'Necesito ayuda',
  description,
  alternates: { canonical: `${siteConfig.url}/necesito-ayuda` },
  openGraph: {
    title: `Necesito ayuda — ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/necesito-ayuda`,
  },
}

export default function NecesitoAyudaPage() {
  return (
    <>
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
