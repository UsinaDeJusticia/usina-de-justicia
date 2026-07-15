// src/app/icon.tsx
// Ícono PNG generado (512x512), reusado por manifest.ts como ícono de PWA
// además de agregarse automáticamente como <link rel="icon"> junto al
// favicon.ico existente (Next no los reemplaza, los suma). Mismo navy de
// marca que opengraph-image.tsx (#1D437D), iniciales "UJ" en blanco —
// sobrio, sin logo (el logo real no tiene variante legible a este tamaño
// sobre navy, ver src/lib/og.tsx).
import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1D437D',
          color: '#FFFFFF',
          fontSize: 260,
          fontWeight: 800,
        }}
      >
        UJ
      </div>
    ),
    { ...size }
  )
}
