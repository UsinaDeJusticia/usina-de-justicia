// src/app/robots.ts
// robots.txt nativo de Next.js (reemplaza el que hubiera generado
// next-sitemap, que no llegó a configurarse — ver src/app/sitemap.ts).

import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /buscar: resultados de búsqueda interna, nunca indexables (la página
      // además lleva noIndex en su metadata y la API X-Robots-Tag: noindex).
      disallow: ['/api/', '/buscar'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
