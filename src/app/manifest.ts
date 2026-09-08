// src/app/manifest.ts
// Web App Manifest nativo de Next.js. `icons` apunta a src/app/icon.png — el
// isotipo de Usina, el mismo que el favicon y el ícono de iOS, para que la
// marca sea una sola en la pestaña, en la pantalla de inicio y al instalar
// la app. Antes acá vivía `/icon`, la ruta que generaba un icon.tsx con las
// iniciales "UJ" dibujadas sobre un cuadrado navy; se retiró al recuperar el
// ícono real (ver el comentario de src/app/icon.png en el commit).
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
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
