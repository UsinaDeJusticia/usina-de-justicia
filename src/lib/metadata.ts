// ============================================
// src/lib/metadata.ts
// Helpers para generar metadata SEO dinámico
// ============================================

import type { Metadata } from 'next'
import { siteConfig } from './site-config'

interface PageSEO {
  title: string
  description: string
  path: string
  ogImage?: string
  noIndex?: boolean
  /** hreflang recíproco, ej. { en: '/en' } en la Home apuntando a la landing en inglés. */
  languages?: Record<string, string>
  /**
   * El layout raíz (src/app/layout.tsx) define `title.template: '%s — Usina
   * de Justicia'`. Next.js aplica ese template a los títulos de los
   * segmentos HIJOS, pero NO al page.tsx que convive en el mismo segmento
   * que el layout que lo define (ver
   * https://nextjs.org/docs/app/api-reference/functions/generate-metadata#template-object) —
   * por eso Home (src/app/page.tsx, mismo segmento que el layout raíz) es la
   * única ruta que necesita el sufijo agregado acá manualmente. Cualquier
   * otra ruta que use este helper vive en un segmento anidado, así que el
   * template ya le agrega el sufijo una sola vez — pasar `appendSiteName:
   * true` ahí duplicaría "— Usina de Justicia — Usina de Justicia".
   * Default: false (el caso normal, nested).
   */
  appendSiteName?: boolean
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  languages,
  appendSiteName = false,
}: PageSEO): Metadata {
  const url = `${siteConfig.url}${path}`
  const image = ogImage || siteConfig.ogImage
  const fullTitle = appendSiteName ? `${title} — ${siteConfig.name}` : title

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}