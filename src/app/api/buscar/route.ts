import { NextResponse } from 'next/server'
import { getIndice, buscar, MIN_QUERY, MAX_QUERY } from '@/lib/buscador'
import { getAllPostsBuscador } from '@/lib/wordpress'

// ============================================
// GET /api/buscar?q=palabras
//
// Búsqueda del sitio: los ~842 posts de WordPress más las páginas
// institucionales, indexados en memoria con MiniSearch (ver
// src/lib/buscador.ts, donde está el porqué de no usar ?search= de WP).
// El índice se reconstruye como mucho cada 5 minutos (memo en buscador.ts)
// y los fetches a WP de por sí cachean con revalidate: 300, así que el
// costo por request es una búsqueda local en memoria.
//
// Lo consume el cliente de /buscar (src/components/buscar/BuscadorClient.tsx)
// y es también la vía programática para agentes (documentada en llms.txt).
// Nota: /buscar?q=... pedido con Accept: text/markdown pierde el query — el
// middleware reescribe a /api/md solo con el pathname — y eso es esperado:
// el agente recibe el shell de la página, y llms.txt lo manda acá.
//
// Respuesta: { total, resultados: [{ tipo, titulo, extracto, href,
// categoria, fechaPublicacion? }] } — nombres alineados con el tipo Articulo.
//
// No se declara `export const dynamic/revalidate`: leer request.url ya hace
// dinámica la ruta, y el cacheo hacia afuera lo da el Cache-Control (el CDN
// cachea por URL, query incluida, así que las búsquedas repetidas no llegan
// a la función).
// ============================================

/** Igual que el ISR del resto del sitio (revalidate = 300). */
const CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=86400'

const HEADERS = {
  'Cache-Control': CACHE_CONTROL,
  // Resultados de búsqueda interna: nunca indexables (además robots.txt ya
  // excluye /api/ y /buscar).
  'X-Robots-Tag': 'noindex',
}

export async function GET(request: Request) {
  const rawQ = new URL(request.url).searchParams.get('q') ?? ''
  const q = rawQ.trim().slice(0, MAX_QUERY)

  // Query vacía o de una letra: respuesta vacía válida (200), no un error —
  // es el estado inicial normal de la página de búsqueda.
  if (q.length < MIN_QUERY) {
    return NextResponse.json({ total: 0, resultados: [] }, { headers: HEADERS })
  }

  try {
    const index = await getIndice(getAllPostsBuscador)
    return NextResponse.json(buscar(index, q), { headers: HEADERS })
  } catch (error) {
    console.error('[/api/buscar] No se pudo construir el índice:', error)
    return NextResponse.json(
      { total: 0, resultados: [], error: 'Búsqueda no disponible en este momento' },
      { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } }
    )
  }
}
