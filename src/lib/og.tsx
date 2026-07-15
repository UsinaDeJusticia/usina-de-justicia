// src/lib/og.tsx
// Elemento de marca compartido entre el opengraph-image estático de la raíz
// (src/app/opengraph-image.tsx) y el fallback sin imagen destacada del
// opengraph-image dinámico de /noticias/[slug].
//
// No se embebe el logo real (logo_uj.png / logo_uj_white_bg.jpg): ambos
// archivos traen el isotipo y el wordmark en navy sobre fondo transparente
// o blanco — sin contraste si se pegan tal cual sobre un fondo navy, y no
// existe ninguna variante en blanco del logo en public/images. Se usa el
// wordmark en texto (Nunito, la misma tipografía de marca que carga
// src/app/layout.tsx), sobrio, sin gradientes.

export const OG_SIZE = { width: 1200, height: 630 }

export const NAVY = '#1D437D'

export function BrandOgImage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: NAVY,
        padding: '90px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 76,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
          }}
        >
          Usina de Justicia
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            fontWeight: 500,
            color: '#B7C9E0',
            maxWidth: 920,
            lineHeight: 1.35,
          }}
        >
          Por los derechos de las víctimas de homicidio y femicidio
        </div>
      </div>
    </div>
  )
}
