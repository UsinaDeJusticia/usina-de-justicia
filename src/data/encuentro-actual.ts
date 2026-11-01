// ============================================
// src/data/encuentro-actual.ts
// CONFIGURACIÓN DEL ENCUENTRO ABIERTO VIGENTE — el único archivo que hay
// que tocar cada mes. Guía paso a paso: docs/ENCUENTROS.md.
//
// Qué se edita acá y qué NO:
//  - Acá: expositor, tema, descripción, fecha, estado de inscripciones,
//    cierre y el ID de la reunión de Zoom de ESA convocatoria.
//  - NO acá: credenciales de Zoom. Viven solo en variables de entorno de
//    Vercel (ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET).
//
// El ID de reunión NO llega al navegador: la página pasa al formulario solo
// los campos públicos (ver `encuentroPublico` en src/lib/encuentros.ts).
// Como el repositorio puede ser público, la reunión DEBE tener la
// inscripción obligatoria activada en Zoom: así, conocer el ID no alcanza
// para entrar sin registrarse.
//
// Sin encuentro programado: exportar `null`. La página sigue publicada con
// un mensaje institucional y sin formulario.
// ============================================

import type { Encuentro } from '../lib/encuentros.ts'

export const encuentroActual: Encuentro | null = {
  // Identificador estable y único por convocatoria (aaaa-mm-apellido).
  id: '2026-11-pagliere',
  expositor: 'Carlos Pagliere',
  // null = se muestra «A confirmar».
  tema: null,
  descripcion: null,
  // Fecha y hora SIEMPRE con zona horaria explícita (-03:00 = Argentina).
  // Ejemplo: '2026-11-26T19:00:00-03:00'. null = «A confirmar».
  inicio: null,
  duracionMinutos: 90,
  // Opcional. Si es null, la inscripción cierra al terminar el encuentro.
  cierreInscripcion: null,
  // 'abiertas' | 'cerradas' | 'proximamente'. Aunque diga 'abiertas', el
  // formulario solo se activa si también están `inicio` y `zoomMeetingId`.
  estado: 'abiertas',
  // ID numérico de la reunión de Zoom (sin espacios), con inscripción
  // obligatoria y aprobación automática. null mientras no exista.
  zoomMeetingId: null,
}
