// ============================================
// src/lib/encuentros-registro.ts
// Flujo de una inscripción, separado de Next.js para poder testearlo con
// dobles de Zoom (src/lib/__tests__/encuentros-registro.test.ts). El route
// handler (src/app/api/encuentros/registrar/route.ts) solo traduce el
// resultado a una respuesta HTTP.
//
// Regla que no se negocia: NUNCA se informa éxito si Zoom no confirmó la
// inscripción. Ante cualquier duda, error explícito.
// ============================================

import { siteConfig } from './site-config.ts'
import {
  estadoInscripcion,
  validarInscripcion,
  type Campo,
  type Encuentro,
} from './encuentros.ts'
import { ZoomError, type ClienteZoom } from './zoom.ts'

export type Resultado =
  | { status: 200; cuerpo: { ok: true; estado: 'inscripto' | 'ya_inscripto'; simulado?: true } }
  | {
      status: 400 | 409 | 429 | 502 | 503
      cuerpo: {
        ok: false
        codigo: 'invalido' | 'cerrado' | 'demasiados_intentos' | 'servicio'
        error: string
        errores?: Partial<Record<Campo | 'confirmacion', string>>
      }
    }

const CONTACTO = siteConfig.contact.email

const MENSAJE_SERVICIO =
  'No pudimos completar tu inscripción en este momento. Tus datos siguen en el formulario: ' +
  `volvé a intentarlo en unos minutos o escribinos a ${CONTACTO}.`

export interface Dependencias {
  encuentro: Encuentro | null
  /** null = faltan credenciales en el entorno. */
  zoom: ClienteZoom | null
  ahora?: Date
  /** Registra un evento operativo SIN datos personales. */
  log?: (mensaje: string) => void
}

export async function procesarInscripcion(
  entrada: unknown,
  deps: Dependencias
): Promise<Resultado> {
  const log = deps.log ?? ((m: string) => console.error(`[encuentros] ${m}`))
  const crudo = (entrada && typeof entrada === 'object' ? entrada : {}) as Record<string, unknown>

  // Campo trampa (mismo patrón que /api/contact): oculto para personas,
  // visible para robots. Se responde como si todo hubiera salido bien para
  // no darle pistas a quien automatiza el abuso — no se llama a Zoom.
  if (typeof crudo.sitioWeb === 'string' && crudo.sitioWeb.trim() !== '') {
    return { status: 200, cuerpo: { ok: true, estado: 'inscripto' } }
  }

  const estado = estadoInscripcion(deps.encuentro, deps.ahora)
  if (estado !== 'abiertas' || !deps.encuentro?.zoomMeetingId) {
    return {
      status: 409,
      cuerpo: {
        ok: false,
        codigo: 'cerrado',
        error: 'La inscripción para este encuentro no está abierta.',
      },
    }
  }

  // El id del encuentro que vio la persona tiene que ser el vigente: si el
  // sitio cambió de convocatoria mientras tenía la página abierta, no la
  // inscribimos en otra reunión sin que lo sepa.
  if (typeof crudo.encuentroId === 'string' && crudo.encuentroId !== deps.encuentro.id) {
    return {
      status: 409,
      cuerpo: {
        ok: false,
        codigo: 'cerrado',
        error: 'La convocatoria cambió. Recargá la página para ver el encuentro vigente.',
      },
    }
  }

  const validacion = validarInscripcion(entrada)
  if (!validacion.ok) {
    return {
      status: 400,
      cuerpo: {
        ok: false,
        codigo: 'invalido',
        error: 'Revisá los datos marcados.',
        errores: validacion.errores,
      },
    }
  }

  if (!deps.zoom) {
    log('faltan credenciales de Zoom (ZOOM_ACCOUNT_ID / ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET)')
    return { status: 503, cuerpo: { ok: false, codigo: 'servicio', error: MENSAJE_SERVICIO } }
  }

  const meetingId = deps.encuentro.zoomMeetingId
  try {
    if (await deps.zoom.existeRegistrante(meetingId, validacion.datos.email)) {
      return { status: 200, cuerpo: { ok: true, estado: 'ya_inscripto' } }
    }
    await deps.zoom.agregarRegistrante(meetingId, validacion.datos)
    return { status: 200, cuerpo: { ok: true, estado: 'inscripto' } }
  } catch (error) {
    if (error instanceof ZoomError) {
      log(`${error.tipo} — ${error.message}${error.status ? ` (HTTP ${error.status}${error.codigo ? `, código ${error.codigo}` : ''})` : ''}`)
      if (error.tipo === 'limite') {
        return {
          status: 429,
          cuerpo: {
            ok: false,
            codigo: 'demasiados_intentos',
            error:
              'Estamos recibiendo muchas inscripciones en este momento. Tus datos siguen en el ' +
              'formulario: volvé a intentarlo en un minuto.',
          },
        }
      }
      return {
        status: error.tipo === 'sin_configurar' ? 503 : 502,
        cuerpo: { ok: false, codigo: 'servicio', error: MENSAJE_SERVICIO },
      }
    }
    log('error inesperado al inscribir')
    return { status: 502, cuerpo: { ok: false, codigo: 'servicio', error: MENSAJE_SERVICIO } }
  }
}

// ─── Límite de frecuencia por IP (complementario) ──────────────────
//
// Memoria de la instancia: frena ráfagas desde una misma IP contra una
// instancia caliente, pero NO alcanza solo en serverless (cada instancia
// tiene su contador). La barrera efectiva en producción es la regla de
// rate limiting del Firewall de Vercel sobre /api/encuentros/registrar
// (ver docs/ENCUENTROS.md § «Protección contra abuso»), sumada a la
// deduplicación por email contra Zoom. Las IPs no se loguean.

export function crearLimitador(maximo: number, ventanaMs: number, ahora: () => number = Date.now) {
  const intentos = new Map<string, number[]>()
  return function permitir(clave: string): boolean {
    const t = ahora()
    const recientes = (intentos.get(clave) ?? []).filter((x) => t - x < ventanaMs)
    if (recientes.length >= maximo) {
      intentos.set(clave, recientes)
      return false
    }
    recientes.push(t)
    intentos.set(clave, recientes)
    // Higiene: que el mapa no crezca sin límite en una instancia longeva.
    if (intentos.size > 5000) {
      for (const [k, v] of intentos) if (v.every((x) => t - x >= ventanaMs)) intentos.delete(k)
    }
    return true
  }
}
