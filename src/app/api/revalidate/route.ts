import { timingSafeEqual } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// ============================================
// POST /api/revalidate
// Webhook de revalidación on-demand para WordPress.
// El plugin de WP dispara este endpoint al publicar/editar contenido.
// ============================================

const DEFAULT_PATHS = ['/', '/noticias']

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

  for (const path of pathsToRevalidate) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, paths: pathsToRevalidate })
}

export async function GET() {
  return NextResponse.json({ revalidated: false }, { status: 405 })
}
