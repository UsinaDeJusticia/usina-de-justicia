import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site-config'
import { MARKDOWN_MEDIA_TYPE, MARKDOWN_PATH_HEADER } from '@/lib/agent-negotiation'
import { extractMainContent, htmlToMarkdown, decodeEntities } from '@/lib/html-to-markdown'

// ============================================
// GET /api/md?path=/alguna-ruta
//
// Sirve la representación Markdown de cualquier página del sitio. NO se
// navega directo: el middleware (middleware.ts) reescribe acá cuando una
// request pide `Accept: text/markdown`, así que la URL pública sigue siendo
// la de la página.
//
// Decisión de diseño — de dónde sale el markdown: se pide el HTML ya
// renderizado de la propia página y se convierte. La alternativa era
// mantener un registro de markdown escrito a mano por ruta, y se descartó
// por dos razones:
//   1. Una sola fuente de verdad. El copy vive en el .tsx de cada página;
//      duplicarlo acá garantiza que en la primera edición las dos versiones
//      queden desincronizadas y el agente lea algo que el sitio ya no dice.
//   2. Cobertura completa sin trabajo por ruta: las ~876 URLs del sitio
//      (posts de WordPress, categorías, tags, paginación) quedan cubiertas
//      solas, sin tocar código cuando el equipo publica algo nuevo.
// El costo es un fetch interno por request de markdown, que es tráfico raro
// (solo agentes) y queda cacheado igual que el resto del sitio.
// ============================================

/** Igual que el ISR del resto del sitio (`revalidate = 300`). */
const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=86400'

function markdownResponse(body: string, status: number) {
  return new NextResponse(body, {
    status,
    headers: {
      'Content-Type': MARKDOWN_MEDIA_TYPE,
      // Imprescindible para la convención: sin esto un CDN puede servir la
      // variante equivocada. Ver middleware.ts.
      Vary: 'Accept',
      'Cache-Control': CACHE_CONTROL,
      'X-Robots-Tag': 'noindex',
    },
  })
}

/** Índice de secciones reales del sitio, para que un agente sepa a dónde ir. */
function siteIndex(): string {
  const lines = siteConfig.mainNav
    .filter((item) => !item.external)
    .map((item) => `- [${item.label}](${siteConfig.url}${item.href})`)

  return [
    '## Secciones del sitio',
    '',
    lines.join('\n'),
    `- [${siteConfig.headerCta.help.label}](${siteConfig.url}${siteConfig.headerCta.help.href})`,
    `- [Sitemap completo](${siteConfig.url}/sitemap.xml)`,
    `- [Instrucciones para agentes](${siteConfig.url}/llms.txt)`,
  ].join('\n')
}

function notFoundMarkdown(path: string): string {
  return [
    '# 404 — Página no encontrada',
    '',
    `No existe ningún recurso en \`${path}\` dentro de ${siteConfig.name}.`,
    '',
    siteIndex(),
    '',
    '---',
    '',
    `Si buscás una nota puntual, el sitemap (${siteConfig.url}/sitemap.xml) lista todas las URLs publicadas. Contacto: ${siteConfig.contact.email}`,
  ].join('\n')
}

function extractTag(html: string, pattern: RegExp): string | null {
  const match = pattern.exec(html)
  return match ? decodeEntities(match[1]).trim() : null
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  // El header lo pone el middleware y es la vía confiable; el query param
  // queda como fallback para pegarle a este handler directo.
  const path =
    request.headers.get(MARKDOWN_PATH_HEADER) ??
    requestUrl.searchParams.get('path') ??
    '/'

  // Solo rutas internas: sin esto, `?path=https://otro-sitio` convertiría
  // este endpoint en un proxy abierto que hace fetch a cualquier origen.
  if (!path.startsWith('/') || path.startsWith('//')) {
    return markdownResponse(notFoundMarkdown(path), 404)
  }

  const target = new URL(path, requestUrl.origin)

  let pageResponse: Response
  try {
    pageResponse = await fetch(target, {
      headers: {
        // Explícito: evita que el middleware vuelva a reescribir este fetch
        // a /api/md (aunque ya se excluye /api/, no depender solo de eso).
        Accept: 'text/html',
      },
      next: { revalidate: 300 },
    })
  } catch (error) {
    console.error('[/api/md] No se pudo obtener la página a convertir:', path, error)
    return markdownResponse(
      [
        '# Error temporal',
        '',
        `No pudimos generar la versión markdown de \`${path}\` en este momento.`,
        '',
        siteIndex(),
      ].join('\n'),
      502
    )
  }

  if (pageResponse.status === 404) {
    return markdownResponse(notFoundMarkdown(path), 404)
  }

  if (!pageResponse.ok) {
    return markdownResponse(notFoundMarkdown(path), pageResponse.status)
  }

  const html = await pageResponse.text()

  const title =
    extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i) ?? siteConfig.name
  const canonical =
    extractTag(html, /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ??
    new URL(path, siteConfig.url).toString()
  const description = extractTag(
    html,
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
  )

  const body = htmlToMarkdown(extractMainContent(html), canonical)

  const document = [
    `# ${title}`,
    '',
    ...(description ? [`> ${description}`, ''] : []),
    `**URL canónica:** ${canonical}`,
    '',
    '---',
    '',
    body || '_(Esta página no tiene contenido de texto convertible.)_',
    '',
    '---',
    '',
    siteIndex(),
  ].join('\n')

  return markdownResponse(document, 200)
}
