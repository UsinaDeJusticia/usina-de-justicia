// ============================================
// middleware.ts
// Negociación de contenido para agentes (convención de
// acceptmarkdown.com): la MISMA URL sirve HTML a un navegador y Markdown a
// un agente que lo pide por el header `Accept`.
//
// Responsabilidad única: si el cliente prefiere `text/markdown`, reescribe
// internamente a /api/md. La URL pública no cambia (sigue siendo
// /acompanamiento, no /api/md?path=/acompanamiento) porque es otra
// representación del MISMO recurso, no un recurso distinto.
//
// La otra mitad de la convención — `Vary: Accept`, para que ningún cache
// intermedio sirva la variante equivocada — NO se hace acá: el middleware
// corre antes de que Next.js agregue su propio `Vary` de router, así que lo
// que setee termina sobrescrito (verificado con curl contra el build de
// producción). Se resuelve en el bloque `headers()` de next.config.mjs.
// ============================================

import { NextResponse, type NextRequest } from 'next/server'
import { prefersMarkdown, MARKDOWN_PATH_HEADER } from '@/lib/agent-negotiation'

/**
 * Rutas que ya son legibles por máquina y se sirven tal cual: convertirlas
 * a markdown sería degradarlas (un agente que pide /sitemap.xml quiere el
 * XML, y llms.txt ya ES markdown).
 */
const PASSTHROUGH_PATHS = new Set([
  '/llms.txt',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPassthrough =
    PASSTHROUGH_PATHS.has(pathname) ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/.well-known/')

  if (
    !isPassthrough &&
    request.method === 'GET' &&
    prefersMarkdown(request.headers.get('accept'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/api/md'
    url.search = ''
    // Se manda también como query para poder pegarle al handler directo
    // (útil para debug y para los chequeos con curl), pero el header es la
    // vía real: después de un rewrite, el `request.url` que ve el route
    // handler es el ORIGINAL, así que los searchParams que se agregan acá no
    // le llegan. Verificado: sin el header, /nosotros devolvía el markdown
    // de la Home porque `path` venía null y caía al default '/'.
    url.searchParams.set('path', pathname)

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(MARKDOWN_PATH_HEADER, pathname)

    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }

  return NextResponse.next()
}

export const config = {
  // Solo rutas de documento: se excluyen los assets internos de Next y
  // cualquier archivo con extensión (imágenes, fuentes, PDFs), que no
  // tienen una representación markdown ni necesitan Vary: Accept.
  matcher: ['/((?!_next/static|_next/image|images/).*)'],
}
