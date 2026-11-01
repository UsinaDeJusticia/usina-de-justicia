import { unstable_cache } from 'next/cache'
import { encuentroActual } from '../data/encuentro-actual'
import { descubrirEncuentro } from './encuentros-zoom'
import { crearClienteZoom, credencialesDesdeEntorno } from './zoom'

// La activación es una sola vez. Nunca editar datos ni redeployar por convocatoria.
// Solo se cachea el encuentro seleccionado, no la respuesta privada de Zoom.
const leerZoom = unstable_cache(async (host: string) => {
  const credenciales = credencialesDesdeEntorno()
  if (!credenciales) throw new Error('zoom_no_configurado')
  const encuentro = await descubrirEncuentro(crearClienteZoom(credenciales), host)
  return { encuentro, actualizado: Date.now() }
}, ['encuentro-desde-zoom-v1'], { revalidate: 60 })

export async function obtenerEncuentroVigente(fresco = false) {
  if (process.env.ZOOM_SYNC_ENABLED !== 'true') {
    return { encuentro: encuentroActual, disponible: true }
  }
  const host = process.env.ZOOM_HOST_EMAIL?.trim()
  const credenciales = credencialesDesdeEntorno()
  if (!host || !credenciales) return { encuentro: null, disponible: false }
  try {
    if (fresco) {
      // Antes de cada inscripción verificar en vivo marca, fecha, cancelación y opciones.
      return {
        encuentro: await descubrirEncuentro(crearClienteZoom(credenciales), host),
        disponible: true,
      }
    }
    const resultado = await leerZoom(host)
    // Next puede conservar un valor viejo cuando falla una revalidación. No aceptar
    // indefinidamente una convocatoria obsoleta: mostrar indisponibilidad temporal.
    if (Date.now() - resultado.actualizado > 120_000) return { encuentro: null, disponible: false }
    return { encuentro: resultado.encuentro, disponible: true }
  } catch {
    console.error('[encuentros] no se pudo consultar la agenda de Zoom')
    return { encuentro: null, disponible: false }
  }
}
