// Lógica de selección y publicación. No depende de Next y se prueba sin credenciales.
import { createHash } from 'node:crypto'
import type { Encuentro } from './encuentros.ts'
import type { ClienteZoomAgenda, ReunionZoom } from './zoom.ts'
import { ZoomError } from './zoom.ts'

const MARCA = /^\[UJ\]\s*/i
const ZONA = /(Z|[+-]\d{2}:\d{2})$/

export function encuentroDesdeZoom(reunion: ReunionZoom, ahora = new Date()): Encuentro | null {
  if (reunion.type !== 2 || !/^\d{9,12}$/.test(reunion.id) ||
      !MARCA.test(reunion.topic ?? '') || !ZONA.test(reunion.start_time ?? '')) return null
  const inicio = new Date(reunion.start_time)
  const duracion = reunion.duration
  if (!Number.isFinite(inicio.getTime()) || !Number.isInteger(duracion) || duracion <= 0 ||
      inicio.getTime() + duracion * 60_000 <= ahora.getTime()) return null
  const tema = reunion.topic.replace(MARCA, '').trim().slice(0, 200)
  if (!tema) return null

  const lineas = (reunion.agenda ?? '').split(/\r?\n/)
  const indice = lineas.findIndex(l => /^\s*expositor(?:a|es)?\s*:/i.test(l))
  const expositor = indice < 0 ? 'Usina de Justicia' :
    lineas.splice(indice, 1)[0].replace(/^\s*expositor(?:a|es)?\s*:\s*/i, '').trim().slice(0, 200) || 'Usina de Justicia'
  const descripcion = lineas.join('\n').trim().slice(0, 5000) || null
  const settings = reunion.settings
  const abierta = settings?.approval_type === 0 && settings.use_pmi === false &&
    settings.registrants_confirmation_email === true && settings.registrants_email_notification === true
  // La versión cambia ante una edición. Una pestaña vieja nunca inscribe a otra convocatoria
  // ni acepta silenciosamente un cambio de fecha. El ID de Zoom no llega al navegador.
  const version = createHash('sha256').update(JSON.stringify([
    reunion.id, tema, expositor, descripcion, inicio.toISOString(), duracion, abierta,
  ])).digest('hex').slice(0, 24)
  return {
    id: `zoom-${version}`, expositor, tema, descripcion,
    inicio: inicio.toISOString(), duracionMinutos: duracion,
    cierreInscripcion: null, estado: abierta ? 'abiertas' : 'proximamente',
    zoomMeetingId: reunion.id,
  }
}

export async function descubrirEncuentro(
  zoom: Pick<ClienteZoomAgenda, 'listarReuniones' | 'obtenerReunion'>,
  host: string,
  ahora = new Date(),
): Promise<Encuentro | null> {
  const candidatos = (await zoom.listarReuniones(host))
    .filter(r => encuentroDesdeZoom(r, ahora) !== null)
    .sort((a, b) => Date.parse(a.start_time) - Date.parse(b.start_time) || a.id.localeCompare(b.id))
  // El listado no trae toda la descripción ni las opciones de inscripción.
  // Volver a leer detalles evita publicar una reunión eliminada o desmarcada entre llamadas.
  for (const candidato of candidatos.slice(0, 20)) {
    const actual = await zoom.obtenerReunion(candidato.id)
    if (!actual) continue
    const encuentro = encuentroDesdeZoom(actual, ahora)
    if (encuentro) return encuentro
  }
  if (candidatos.length > 20) throw new ZoomError('no_disponible', 'meetings: demasiados cambios simultáneos')
  return null
}
