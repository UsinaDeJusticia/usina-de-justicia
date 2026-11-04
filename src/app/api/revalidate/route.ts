import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// ============================================
// POST /api/revalidate
// Webhook de revalidación on-demand para WordPress.
// El plugin de WP dispara este endpoint al publicar/editar contenido.
// ============================================

const DEFAULT_PATHS = ['/', '/noticias']

/** Listados dinámicos que pueden mostrar una nota publicada o editada. */
const LISTING_ROUTES = [
  '/noticias/pagina/[n]',
  '/noticias/categoria/[categoria]',
  '/noticias/categoria/[categoria]/pagina/[n]',
  '/noticias/tag/[tag]',
  '/noticias/tag/[tag]/pagina/[n]',
]

interface RevalidateBody {
  secret?: string
  paths?: string[]
}

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET

  let body: RevalidateBody
  try {
    body = (await request.json()) as RevalidateBody
  } catch {
    return NextResponse.json({ revalidated: false }, { status: 401 })
  }

  // Nunca loguear el secret recibido ni el esperado.
  // Comparación timing-safe: evita filtrar por temporización cuánto del
  // secret coincide. timingSafeEqual lanza si los buffers tienen longitud
  // distinta, así que ese caso se descarta antes (también es un 401, sin
  // revelar nada sobre la longitud esperada más allá de un timing grosero).
  if (!expectedSecret || typeof body.secret !== 'string') {
    return NextResponse.json({ revalidated: false }, { status: 401 })
  }

  const providedBuffer = Buffer.from(body.secret)
  const expectedBuffer = Buffer.from(expectedSecret)

  const isValid =
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)

  if (!isValid) {
    return NextResponse.json({ revalidated: false }, { status: 401 })
  }

  const requestedPaths = Array.isArray(body.paths)
    ? body.paths.filter(
        (p): p is string => typeof p === 'string' && p.startsWith('/')
      )
    : []

  const pathsToRevalidate =
    requestedPaths.length > 0 ? requestedPaths : DEFAULT_PATHS

  // Con notas a 30 días y listados a 6 h, el webhook es la vía real de
  // frescura. WordPress manda '/', '/noticias' y '/noticias/<slug>'; si la
  // nota cambió, también pueden cambiar su categoría, sus tags, la
  // paginación y el sitemap, así que se invalidan esas rutas dinámicas
  // enteras (type 'page' = todas las instancias del segmento).
  const tocaNota = pathsToRevalidate.some((p) => /^\/noticias\/[^/]+$/.test(p))
  for (const path of pathsToRevalidate) revalidatePath(path)
  const listados = tocaNota ? LISTING_ROUTES : []
  for (const route of listados) revalidatePath(route, 'page')
  if (tocaNota) revalidatePath('/sitemap.xml')

  return NextResponse.json({
    revalidated: true,
    paths: [...pathsToRevalidate, ...listados, ...(tocaNota ? ['/sitemap.xml'] : [])],
  })
}

export async function GET() {
  return NextResponse.json({ revalidated: false }, { status: 405 })
}
