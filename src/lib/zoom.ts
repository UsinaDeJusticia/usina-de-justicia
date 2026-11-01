// ============================================
// src/lib/zoom.ts
// Integración con Zoom — SOLO SERVIDOR. Nunca importar desde un componente
// 'use client': usa las credenciales de la cuenta.
//
// Autenticación: app interna «Server-to-Server OAuth» autorizada por quien
// administra la cuenta de Zoom de UJ. No usa el usuario ni la contraseña de
// ninguna persona. Credenciales en variables de entorno de Vercel:
//   ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET
//
// Permisos (scopes) mínimos — ver docs/ENCUENTROS.md:
//   meeting:write:registrant:admin       (agregar inscriptos)
//   meeting:read:list_registrants:admin  (evitar inscripciones duplicadas)
//
// Endpoints usados:
//   POST https://zoom.us/oauth/token?grant_type=account_credentials
//   GET  /v2/meetings/{meetingId}/registrants
//   POST /v2/meetings/{meetingId}/registrants
//
// Privacidad: nada de lo que se loguea en este archivo incluye datos
// personales ni el cuerpo de las respuestas de Zoom (suelen repetir el
// email). El `join_url` individual que devuelve Zoom no sale de acá: el
// participante lo recibe por correo, nunca en la respuesta al navegador.
// ============================================

import type { DatosInscripcion } from './encuentros.ts'

const API = 'https://api.zoom.us/v2'
const OAUTH = 'https://zoom.us/oauth/token'
const TIMEOUT_MS = 8000
/** Tope de páginas al buscar duplicados (300 por página = 3.000 inscriptos). */
const MAX_PAGINAS = 10

export type TipoErrorZoom =
  | 'sin_configurar' // faltan credenciales en el entorno
  | 'limite' // 429: Zoom pidió esperar
  | 'rechazo' // 4xx: la reunión no existe, no tiene inscripción, cupo lleno…
  | 'no_disponible' // 5xx, timeout o error de red

export class ZoomError extends Error {
  readonly tipo: TipoErrorZoom
  readonly status?: number
  readonly codigo?: number
  constructor(tipo: TipoErrorZoom, mensaje: string, status?: number, codigo?: number) {
    super(mensaje)
    this.name = 'ZoomError'
    this.tipo = tipo
    this.status = status
    this.codigo = codigo
  }
}

export interface CredencialesZoom {
  accountId: string
  clientId: string
  clientSecret: string
}

export function credencialesDesdeEntorno(
  env: Record<string, string | undefined> = process.env
): CredencialesZoom | null {
  const accountId = env.ZOOM_ACCOUNT_ID
  const clientId = env.ZOOM_CLIENT_ID
  const clientSecret = env.ZOOM_CLIENT_SECRET
  if (!accountId || !clientId || !clientSecret) return null
  return { accountId, clientId, clientSecret }
}

export interface ClienteZoom {
  /** true si ya hay un registrante (aprobado o pendiente) con ese email. */
  existeRegistrante(meetingId: string, email: string): Promise<boolean>
  agregarRegistrante(meetingId: string, datos: DatosInscripcion): Promise<void>
}

/** Cuerpo del registrante según el mapeo acordado. El DNI no se envía. */
export function cuerpoRegistrante(datos: DatosInscripcion): Record<string, string> {
  const cuerpo: Record<string, string> = {
    first_name: datos.nombre,
    last_name: datos.apellido,
    email: datos.email,
    phone: datos.telefono,
    job_title: datos.profesion,
  }
  if (datos.institucion) cuerpo.org = datos.institucion
  return cuerpo
}

// Token en memoria de la instancia. Zoom lo emite por 1 hora; si la
// instancia serverless se recicla, se pide otro (es barato y no tiene
// efectos secundarios).
let tokenCache: { valor: string; vence: number; clave: string } | null = null

export function _reiniciarCacheToken() {
  tokenCache = null
}

function errorPorStatus(status: number, codigo: number | undefined, contexto: string): ZoomError {
  if (status === 429) return new ZoomError('limite', `${contexto}: límite de peticiones`, status, codigo)
  if (status >= 500) return new ZoomError('no_disponible', `${contexto}: error del servicio`, status, codigo)
  return new ZoomError('rechazo', `${contexto}: solicitud rechazada`, status, codigo)
}

async function leerCodigo(respuesta: Response): Promise<number | undefined> {
  try {
    const cuerpo = (await respuesta.json()) as { code?: unknown }
    return typeof cuerpo.code === 'number' ? cuerpo.code : undefined
  } catch {
    return undefined
  }
}

export function crearClienteZoom(
  credenciales: CredencialesZoom,
  opciones: { fetch?: typeof fetch; ahora?: () => number } = {}
): ClienteZoom {
  const f = opciones.fetch ?? fetch
  const ahora = opciones.ahora ?? Date.now

  async function pedir(url: string, init: RequestInit, contexto: string): Promise<Response> {
    try {
      return await f(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' })
    } catch {
      throw new ZoomError('no_disponible', `${contexto}: sin respuesta`)
    }
  }

  async function token(): Promise<string> {
    const clave = `${credenciales.accountId}:${credenciales.clientId}`
    if (tokenCache && tokenCache.clave === clave && tokenCache.vence > ahora()) {
      return tokenCache.valor
    }
    const basic = Buffer.from(`${credenciales.clientId}:${credenciales.clientSecret}`).toString('base64')
    const url = `${OAUTH}?grant_type=account_credentials&account_id=${encodeURIComponent(credenciales.accountId)}`
    const respuesta = await pedir(url, { method: 'POST', headers: { Authorization: `Basic ${basic}` } }, 'token')
    if (!respuesta.ok) {
      // 400/401 acá = credenciales mal cargadas o app desactivada: es un
      // problema de configuración, no del participante.
      const error = errorPorStatus(respuesta.status, await leerCodigo(respuesta), 'token')
      if (error.tipo === 'rechazo') {
        throw new ZoomError('sin_configurar', 'token: credenciales rechazadas', respuesta.status)
      }
      throw error
    }
    const cuerpo = (await respuesta.json()) as { access_token?: string; expires_in?: number }
    if (!cuerpo.access_token) throw new ZoomError('no_disponible', 'token: respuesta sin access_token')
    // Margen de 5 minutos antes del vencimiento real.
    const vigencia = Math.max(60, (cuerpo.expires_in ?? 3600) - 300) * 1000
    tokenCache = { valor: cuerpo.access_token, vence: ahora() + vigencia, clave }
    return cuerpo.access_token
  }

  async function api(ruta: string, init: RequestInit, contexto: string): Promise<Response> {
    const respuesta = await pedir(
      `${API}${ruta}`,
      {
        ...init,
        headers: {
          ...(init.headers as Record<string, string>),
          Authorization: `Bearer ${await token()}`,
          'Content-Type': 'application/json',
        },
      },
      contexto
    )
    if (respuesta.status === 401) tokenCache = null
    return respuesta
  }

  const idSeguro = (meetingId: string) => {
    if (!/^\d{9,12}$/.test(meetingId)) {
      throw new ZoomError('sin_configurar', 'zoomMeetingId inválido en la configuración')
    }
    return meetingId
  }

  return {
    async existeRegistrante(meetingId, email) {
      const id = idSeguro(meetingId)
      const buscado = email.toLowerCase()
      for (const status of ['approved', 'pending'] as const) {
        let pagina = ''
        for (let i = 0; i < MAX_PAGINAS; i++) {
          const query = new URLSearchParams({ status, page_size: '300' })
          if (pagina) query.set('next_page_token', pagina)
          const respuesta = await api(`/meetings/${id}/registrants?${query}`, { method: 'GET' }, 'registrants:list')
          if (!respuesta.ok) {
            throw errorPorStatus(respuesta.status, await leerCodigo(respuesta), 'registrants:list')
          }
          const cuerpo = (await respuesta.json()) as {
            registrants?: Array<{ email?: string }>
            next_page_token?: string
          }
          if (cuerpo.registrants?.some((r) => r.email?.toLowerCase() === buscado)) return true
          pagina = cuerpo.next_page_token ?? ''
          if (!pagina) break
        }
      }
      return false
    },

    async agregarRegistrante(meetingId, datos) {
      const id = idSeguro(meetingId)
      const respuesta = await api(
        `/meetings/${id}/registrants`,
        { method: 'POST', body: JSON.stringify(cuerpoRegistrante(datos)) },
        'registrants:add'
      )
      if (!respuesta.ok) {
        throw errorPorStatus(respuesta.status, await leerCodigo(respuesta), 'registrants:add')
      }
      // La respuesta trae `join_url` y `registrant_id`: se descartan a
      // propósito. Zoom envía el enlace al participante por correo.
    },
  }
}
