// src/app/opengraph-image.tsx
// OG image de marca para toda ruta que no declare la suya propia. Next.js
// solo hereda este archivo cuando la ruta hija NO exporta su propio
// `metadata.openGraph` — si lo exporta sin `images`, reemplaza el objeto
// entero en vez de heredar (trampa verificada; ver commit de este mismo
// Ola C que migra observatorio/acompanamiento/nosotros/necesito-ayuda a
// generatePageMetadata, que siempre setea `images`).
import { ImageResponse } from 'next/og'
import { BrandOgImage, OG_SIZE } from '@/lib/og'

export const alt =
  'Usina de Justicia — Por los derechos de las víctimas de homicidio y femicidio'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(<BrandOgImage />, { ...size })
}
