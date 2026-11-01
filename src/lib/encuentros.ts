// ============================================
// src/lib/encuentros.ts
// Lógica pura (sin red, sin Next) de los encuentros abiertos: tipos, estado
// de la inscripción y validación del formulario. Se usa igual en el
// navegador (validación inmediata) y en el servidor (validación que manda),
// así ambas reglas no pueden divergir.
//
// Datos que se piden y por qué (Ley 25.326, art. 4: pertinentes y no
// excesivos para la finalidad):
//  - nombre, apellido, correo: identificar a la persona y enviarle su
//    enlace individual de Zoom.
//  - teléfono: contacto si hay un cambio de último momento.
//  - profesión u ocupación: conocer al público (pedido de la Comisión).
//  - institución (opcional): no es necesario representar a nadie.
//
// DNI: NO se pide. No acredita que quien completa el formulario sea su
// titular, y todavía no hay una finalidad definida que lo justifique. Ver
// docs/ENCUENTROS.md § «DNI» antes de agregarlo.
//
// Tampoco se pregunta nada sobre experiencias personales como víctima: no
// hace falta para participar.
// ============================================

export type EstadoConfigurado = 'abiertas' | 'cerradas' | 'proximamente'

export interface Encuentro {
  id: string
  expositor: string
  tema: string | null
  descripcion: string | null
  /** ISO 8601 con zona horaria explícita, p. ej. 2026-11-26T19:00:00-03:00 */
  inicio: string | null
  duracionMinutos: number
  /** ISO 8601 con zona horaria explícita, o null = cierra al terminar. */
  cierreInscripcion: string | null
  estado: EstadoConfigurado
  /** Solo servidor. Nunca se pasa al navegador. */
  zoomMeetingId: string | null
}

/** Lo único del encuentro que puede llegar al navegador. */
export type EncuentroPublico = Omit<Encuentro, 'zoomMeetingId' | 'estado' | 'cierreInscripcion'>

export type EstadoInscripcion = 'abiertas' | 'cerradas' | 'proximamente' | 'sin_encuentro'

/** Zona horaria en la que se muestran las fechas al público. */
export const ZONA_HORARIA = 'America/Argentina/Buenos_Aires'

/**
 * Plazo de conservación de los datos de inscripción, en meses después del
 * encuentro. Se publica en /legal/privacidad. Cambiarlo acá cambia la
 * política publicada: requiere decisión de la Comisión.
 */
export const CONSERVACION_MESES = 6

const ZONA_EXPLICITA = /(Z|[+-]\d{2}:\d{2})$/

function fechaValida(iso: string | null): Date | null {
  if (!iso || !ZONA_EXPLICITA.test(iso)) return null
  const fecha = new Date(iso)
  return Number.isNaN(fecha.getTime()) ? null : fecha
}

/** Momento en que deja de aceptarse la inscripción. */
export function cierreEfectivo(encuentro: Encuentro): Date | null {
  const cierre = fechaValida(encuentro.cierreInscripcion)
  if (cierre) return cierre
  const inicio = fechaValida(encuentro.inicio)
  if (!inicio) return null
  return new Date(inicio.getTime() + encuentro.duracionMinutos * 60_000)
}

/**
 * Estado real de la inscripción. «Abiertas» exige que la convocatoria esté
 * completa (fecha con zona horaria y reunión de Zoom); si falta algo, se
 * muestra como «próximamente» en vez de aceptar inscripciones que no
 * podrían procesarse.
 */
export function estadoInscripcion(
  encuentro: Encuentro | null,
  ahora: Date = new Date()
): EstadoInscripcion {
  if (!encuentro) return 'sin_encuentro'
  if (encuentro.estado === 'cerradas') return 'cerradas'
  const cierre = cierreEfectivo(encuentro)
  if (cierre && ahora.getTime() >= cierre.getTime()) return 'cerradas'
  if (encuentro.estado === 'proximamente') return 'proximamente'
  if (!fechaValida(encuentro.inicio) || !encuentro.zoomMeetingId) return 'proximamente'
  return 'abiertas'
}

export function encuentroPublico(encuentro: Encuentro): EncuentroPublico {
  return {
    id: encuentro.id,
    expositor: encuentro.expositor,
    tema: encuentro.tema,
    descripcion: encuentro.descripcion,
    inicio: encuentro.inicio,
    duracionMinutos: encuentro.duracionMinutos,
  }
}

/** «Jueves 26 de noviembre de 2026, 19:00 h (hora de Argentina)» */
export function formatearFechaHora(iso: string | null): string | null {
  const fecha = fechaValida(iso)
  if (!fecha) return null
  const dia = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: ZONA_HORARIA,
  }).format(fecha)
  const hora = new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ZONA_HORARIA,
  }).format(fecha)
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)}, ${hora} h (hora de Argentina)`
}

// ─── Formulario ─────────────────────────────────────────────

export const CAMPOS = [
  'nombre',
  'apellido',
  'email',
  'telefono',
  'profesion',
  'institucion',
] as const

export type Campo = (typeof CAMPOS)[number]

export interface DatosInscripcion {
  nombre: string
  apellido: string
  email: string
  telefono: string
  profesion: string
  institucion: string
}

/**
 * Topes de longitud. Respetan los máximos de los campos de registrante de
 * Zoom (nombre/apellido 64, email 128) con margen.
 */
export const LIMITES: Record<Campo, number> = {
  nombre: 64,
  apellido: 64,
  email: 128,
  telefono: 30,
  profesion: 100,
  institucion: 120,
}

const OBLIGATORIOS: Campo[] = ['nombre', 'apellido', 'email', 'telefono', 'profesion']

const ETIQUETAS: Record<Campo, string> = {
  nombre: 'el nombre',
  apellido: 'el apellido',
  email: 'el correo electrónico',
  telefono: 'el teléfono',
  profesion: 'la profesión u ocupación',
  institucion: 'la institución',
}

// Caracteres de control (incluye saltos de línea): nunca son legítimos en
// estos campos de una línea.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001F\u007F]/

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Teléfono tolerante: acepta +54 9 11 1234-5678, (011) 4321-1234,
 * 11.1234.5678, +34 600 123 456… Solo exige entre 6 y 15 dígitos (15 es
 * el máximo de E.164) y caracteres habituales de separación.
 */
export function telefonoValido(valor: string): boolean {
  if (!/^\+?[\d\s().\-/]+$/.test(valor)) return false
  const digitos = valor.replace(/\D/g, '').length
  return digitos >= 6 && digitos <= 15
}

function limpiar(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim().replace(/\s+/g, ' ') : ''
}

export type ResultadoValidacion =
  | { ok: true; datos: DatosInscripcion }
  | { ok: false; errores: Partial<Record<Campo | 'confirmacion', string>> }

/**
 * Valida y normaliza una inscripción. Recibe `unknown` porque en el
 * servidor el cuerpo viene de afuera y no se confía en su forma.
 */
export function validarInscripcion(entrada: unknown): ResultadoValidacion {
  const crudo = (entrada && typeof entrada === 'object' ? entrada : {}) as Record<string, unknown>
  const datos = Object.fromEntries(
    CAMPOS.map((campo) => [campo, limpiar(crudo[campo])])
  ) as unknown as DatosInscripcion
  datos.email = datos.email.toLowerCase()

  const errores: Partial<Record<Campo | 'confirmacion', string>> = {}

  for (const campo of CAMPOS) {
    const valor = datos[campo]
    if (!valor) {
      if (OBLIGATORIOS.includes(campo)) errores[campo] = `Completá ${ETIQUETAS[campo]}.`
      continue
    }
    if (valor.length > LIMITES[campo]) {
      errores[campo] = `Revisá ${ETIQUETAS[campo]}: admite hasta ${LIMITES[campo]} caracteres.`
    } else if (CONTROL.test(valor)) {
      errores[campo] = `Revisá ${ETIQUETAS[campo]}: tiene caracteres no válidos.`
    }
  }

  if (!errores.email && datos.email && !EMAIL.test(datos.email)) {
    errores.email = 'Revisá el correo electrónico: no parece válido.'
  }
  if (!errores.telefono && datos.telefono && !telefonoValido(datos.telefono)) {
    errores.telefono = 'Revisá el teléfono: incluí la característica (por ejemplo, 11 1234-5678).'
  }
  if (crudo.confirmacion !== true) {
    errores.confirmacion = 'Confirmá tus datos y tu participación para continuar.'
  }

  return Object.keys(errores).length > 0 ? { ok: false, errores } : { ok: true, datos }
}
