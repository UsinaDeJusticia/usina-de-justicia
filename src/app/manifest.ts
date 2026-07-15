// src/app/manifest.ts
// Web App Manifest nativo de Next.js. `icons` referencia la ruta que genera
// src/app/icon.tsx (512x512, navy de marca) — no hace falta un archivo
// estático nuevo en public/.
import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Usina de Justicia',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#1D437D',
    lang: 'es-AR',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
