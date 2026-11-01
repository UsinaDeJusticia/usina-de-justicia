import { NextResponse } from 'next/server'
import { encuentroActual } from '@/data/encuentro-actual'
import { crearLimitador, procesarInscripcion } from '@/lib/encuentros-registro'
import { crearClienteZoom, credencialesDesdeEntorno } from '@/lib/zoom'

// ============================================
// POST /api/encuentros/registrar
// Inscripción a un encuentro abierto → registrante de Zoom. La lógica vive
// en src/lib/encuentros-registro.ts; acá solo van los controles HTTP.
// Documentación: docs/ENCUENTROS.md.
// ============================================

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Ninguna respuesta de este endpoint se cachea en ningún lado. */
const SIN_CACHE = { 'Cache-Control': 'no-store, max-age=0' }

/** Un formulario completo pesa ~1 KB; 8 KB es holgado. */
const MAX_BYTES = 8 * 1024

// 5 intentos por IP cada 10 minutos, por instancia. Complementa (no
// reemplaza) la regla del Firewall de Vercel: ver encuentros-registro.ts.
const permitir = crearLimitador(5, 10 * 60_000)

function responder(status: number, cuerpo: unknown) {
  return NextResponse.json(cuerpo, { status, headers: SIN_CACHE })
}

/**
 * Solo se aceptan envíos desde el propio sitio. Los navegadores modernos
 * mandan `Sec-Fetch-Site`; si falta, se compara `Origin` con el host.
 */
function mismoOrigen(request: Request): boolean {
  const sitio = request.headers.get('sec-fetch-site')
  if (sitio) return sitio === 'same-origin'
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host === request.headers.get('host')
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!mismoOrigen(request)) {
    return responder(403, { ok: false, codigo: 'invalido', error: 'Solicitud no permitida.' })
  }

  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'desconocida'
  if (!permitir(ip)) {
    return responder(429, {
      ok: false,
      codigo: 'demasiados_intentos',
      error: 'Hiciste varios intentos seguidos. Esperá unos minutos y volvé a probar.',
    })
  }

  const texto = await request.text()
  if (texto.length > MAX_BYTES) {
    return responder(413, { ok: false, codigo: 'invalido', error: 'Solicitud demasiado grande.' })
  }
  let cuerpo: unknown
  try {
    cuerpo = JSON.parse(texto)
  } catch {
    return responder(400, { ok: false, codigo: 'invalido', error: 'Solicitud inválida.' })
  }

  const credenciales = credencialesDesdeEntorno()
  const resultado = await procesarInscripcion(cuerpo, {
    encuentro: encuentroActual,
    zoom: credenciales ? crearClienteZoom(credenciales) : null,
  })
  return responder(resultado.status, resultado.cuerpo)
}

export async function GET() {
  return responder(405, { ok: false })
}
