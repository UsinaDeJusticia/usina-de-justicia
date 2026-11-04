// src/app/robots.ts
// robots.txt nativo de Next.js. La política de bots vive en src/lib/bots.ts
// (compartida con el 403 del middleware).

import type { MetadataRoute } from 'next'
import { siteConfig } from '../lib/site-config.ts'
import { ALLOWED_BOTS, BLOCKED_BOTS } from '../lib/bots.ts'

// /buscar: resultados de búsqueda interna, nunca indexables (la página
// además lleva noIndex en su metadata y la API X-Robots-Tag: noindex).
const DISALLOW = ['/api/', '/buscar']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: [...ALLOWED_BOTS], allow: '/', disallow: DISALLOW },
      { userAgent: [...BLOCKED_BOTS], disallow: '/' },
      { userAgent: '*', allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
