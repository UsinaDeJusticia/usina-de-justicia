import { ImageResponse } from 'next/og'
import { BrandOgImage, OG_SIZE } from '@/lib/og'
import { varianteParaTarjetaOG } from '@/lib/imagenes'
import { fetchOgImageDataUri, truncateOgTitle } from '@/lib/og-card'
import { getArticuloBySlug } from '@/lib/wordpress'

export const alt = 'Usina de Justicia'
export const size = OG_SIZE
export const contentType = 'image/png'
export const revalidate = 86400

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const articulo = await getArticuloBySlug(slug).catch(() => null)
  const variante = varianteParaTarjetaOG(articulo?.imagenDestacada)
  const dataUri = variante ? await fetchOgImageDataUri(variante.url) : null

  if (!articulo || !dataUri) {
    return new ImageResponse(<BrandOgImage />, { ...size })
  }

  const title = truncateOgTitle(articulo.titulo)
  const titleFontSize = Array.from(title).length > 76 ? 40 : 46

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUri}
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          alt=""
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            backgroundColor: 'rgba(29, 67, 125, 0.9)',
            padding: '44px 56px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: titleFontSize,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
