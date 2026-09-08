// src/app/noticias/[slug]/opengraph-image.tsx
// OG image dinámico por post: si tiene imagen destacada, la usa de fondo con
// un panel sólido (sin gradiente, consistente con el resto de la pieza de
// marca) para el título; si no, cae al mismo diseño de marca de la raíz. No
// necesita generateStaticParams — se genera on-demand, como el resto de los
// posts fuera del top 100 pre-renderizado (ver generateStaticParams de
// page.tsx en esta misma carpeta).
//
// Nota técnica (bug verificado en este mismo commit): el motor de renderizado
// de ImageResponse (Satori/resvg, via next/og) no decodifica WebP — y TODAS
// las imágenes destacadas de WordPress acá vienen en .webp. Sin conversión,
// la imagen queda en blanco en el PNG final. Por eso se descarga el buffer y
// se convierte a PNG con `sharp` antes de pasarlo como data URI a <img>.
import { ImageResponse } from 'next/og'
import sharp from 'sharp'
import { BrandOgImage, OG_SIZE } from '@/lib/og'
import { getArticuloBySlug } from '@/lib/wordpress'

export const alt = 'Usina de Justicia'
export const size = OG_SIZE
export const contentType = 'image/png'

// ============================================
// QUIÉN PAGA ESTA IMAGEN, Y QUÉ LA PROTEGE — medido, no supuesto
//
// Componer esta imagen es la operación más cara del sitio: pedirle la nota a
// WordPress, descargar la foto destacada, convertirla con sharp y armar el
// PNG con Satori. Medido contra el build de producción: **~0,40 s por
// pedido**. Y sus clientes no son visitantes, son WhatsApp, Facebook y
// LinkedIn yendo a buscar la vista previa cuando alguien comparte una nota.
//
// Lo que la protege NO es el `revalidate` de acá abajo. Next.js le pone a
// esta respuesta `Cache-Control: public, immutable, max-age=31536000` porque
// la URL lleva un hash de contenido, y el CDN la sirve desde el borde sin
// volver a invocar la función. Comprobado: la cabecera sale igual con y sin
// `revalidate`.
//
// Y lo que el `revalidate` NO hace, también comprobado: la ruta tiene un
// segmento dinámico ([slug]) sin generateStaticParams, así que sigue marcada
// como dinámica y **se recompone entera en cada pedido que llega al
// origen**. Medido en el mismo build, cinco pedidos seguidos: 0,40 s sin
// `revalidate` y 0,41 s con él. No lo cachea. Si algún día hace falta bajar
// eso de verdad, el camino es pre-generar con generateStaticParams, no este
// export — y hay que medir antes lo que cuesta el build de 842 imágenes.
//
// Entonces, ¿por qué queda? Por el `next: { revalidate }` del fetch de más
// abajo, que sí sirve: cuando la ruta se recompone (cada deploy cambia el
// hash de la URL y vacía el caché del CDN), la foto sale del Data Cache en
// vez de volver a bajarla del WordPress de Hostinger, que es el servidor
// flojo de la cadena. Este export acompaña esa ventana para que el segmento
// no declare una más corta.
//
// Literal a propósito: Next.js no acepta una constante importada en este
// export (`Unknown identifier at "revalidate"` en build), el mismo detalle
// documentado en page.tsx de esta carpeta.
// ============================================
export const revalidate = 86400 // 24 h — igual a WP_REVALIDATE_ARCHIVO

interface Props {
  params: Promise<{ slug: string }>
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

/** Descarga la imagen destacada y la convierte a un data URI PNG. `null` si
 * falla la descarga/decodificación (la página cae al diseño de marca). */
async function fetchImageAsPngDataUri(url: string): Promise<string | null> {
  try {
    // En Next 15 un fetch sin opciones NO se cachea: cada vez que esta ruta
    // se recompone, esto volvía a bajar la foto entera del WordPress de
    // Hostinger — que no tiene CDN y es el eslabón flojo. Con la ventana
    // declarada sale del Data Cache, que además sobrevive a los deploys.
    // Esta es la parte del arreglo que sí hace trabajo; ver el comentario de
    // arriba para lo que el `revalidate` del segmento no hace.
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const png = await sharp(buffer)
      .resize(OG_SIZE.width, OG_SIZE.height, { fit: 'cover' })
      .png()
      .toBuffer()
    return `data:image/png;base64,${png.toString('base64')}`
  } catch {
    return null
  }
}

export default async function Image({ params }: Props) {
  const { slug } = await params
  const articulo = await getArticuloBySlug(slug).catch(() => null)
  const imageUrl = articulo?.imagenDestacada?.url
  const dataUri = imageUrl ? await fetchImageAsPngDataUri(imageUrl) : null

  if (articulo && dataUri) {
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
              // rgba (no gradiente) sobre la foto, para legibilidad del
              // título — mismo navy de marca (#1D437D) a un 90% de opacidad.
              backgroundColor: 'rgba(29, 67, 125, 0.9)',
              padding: '44px 56px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 46,
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.25,
              }}
            >
              {truncate(articulo.titulo, 100)}
            </div>
          </div>
        </div>
      ),
      { ...size }
    )
  }

  return new ImageResponse(<BrandOgImage />, { ...size })
}
