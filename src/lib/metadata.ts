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
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  languages,
}: PageSEO): Metadata {
  const url = `${siteConfig.url}${path}`
  const image = ogImage || siteConfig.ogImage

  return {
    title: `${title} — ${siteConfig.name}`,
    description,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title: `${title} — ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${siteConfig.name}`,
      description,
      images: [image],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}