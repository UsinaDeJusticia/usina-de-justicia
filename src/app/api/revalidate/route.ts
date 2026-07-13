import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// ============================================
// POST /api/revalidate
// Webhook de revalidación on-demand para WordPress.
// El plugin de WP dispara este endpoint al publicar/editar contenido.
// ============================================

const DEFAULT_PATHS = ['/', '/blog']

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
  if (!expectedSecret || body.secret !== expectedSecret) {
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
