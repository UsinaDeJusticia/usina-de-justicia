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
      disallow: '/api/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
