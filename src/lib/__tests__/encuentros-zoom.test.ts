import { beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { descubrirEncuentro, encuentroDesdeZoom } from '../encuentros-zoom.ts'
import { encuentroPublico } from '../encuentros.ts'
import { procesarInscripcion } from '../encuentros-registro.ts'
import { crearClienteZoom, _reiniciarCacheToken, ZoomError, type ReunionZoom } from '../zoom.ts'

const AHORA = new Date('2026-11-01T20:00:00Z')
const REUNION: ReunionZoom = {
  id: '82562740389', topic: '[UJ] Derechos de las víctimas', type: 2,
  start_time: '2026-11-02T20:00:00Z', duration: 60,
  agenda: 'Expositor: Carlos Pagliere\nUna conversación abierta.',
  settings: { use_pmi: false, approval_type: 0, registrants_confirmation_email: true, registrants_email_notification: true },
}

describe('publicación desde Zoom', () => {
  it('publica solo campos acordados, sin marca ni identificadores privados', () => {
    const encuentro = encuentroDesdeZoom(REUNION, AHORA)!
    assert.equal(encuentro.tema, 'Derechos de las víctimas')
    assert.equal(encuentro.expositor, 'Carlos Pagliere')
    assert.equal(encuentro.descripcion, 'Una conversación abierta.')
    assert.equal(encuentro.estado, 'abiertas')
    assert.equal(encuentro.zoomMeetingId, REUNION.id)
    const publico = JSON.stringify(encuentroPublico(encuentro))
    assert.equal(publico.includes(REUNION.id), false)
    assert.equal(publico.includes('[UJ]'), false)
  })

  it('excluye reuniones internas, marcas parciales, recurrentes, terminadas y fechas ambiguas', () => {
    for (const patch of [
      { topic: 'Comisión interna' }, { topic: 'Interna [UJ]' }, { topic: '[UJ]' },
      { type: 8 }, { type: 3 }, { id: 'malformado' },
      { start_time: '2026-10-01T20:00:00Z' }, { start_time: '2026-11-02T20:00:00' },
      { start_time: 'invalida' }, { duration: 0 }, { duration: NaN },
    ]) assert.equal(encuentroDesdeZoom({ ...REUNION, ...patch }, AHORA), null)
    assert.equal(encuentroDesdeZoom(REUNION, new Date('2026-11-02T21:00:00Z')), null)
  })

  it('mantiene el encuentro visible, pero no habilita inscripciones con opciones incompletas', () => {
    for (const settings of [undefined, {}, { ...REUNION.settings, approval_type: 2 },
      { ...REUNION.settings, approval_type: 1 }, { ...REUNION.settings, use_pmi: true },
      { ...REUNION.settings, registrants_confirmation_email: false },
      { ...REUNION.settings, registrants_email_notification: false },
    ]) assert.equal(encuentroDesdeZoom({ ...REUNION, settings }, AHORA)?.estado, 'proximamente')
  })

  it('admite descripción libre sin obligar a completar expositor', () => {
    const e = encuentroDesdeZoom({ ...REUNION, topic: '[uj] Tema', agenda: 'Descripción libre' }, AHORA)!
    assert.equal(e.expositor, 'Usina de Justicia')
    assert.equal(e.descripcion, 'Descripción libre')
    assert.equal(encuentroDesdeZoom({ ...REUNION, agenda: 'Expositora: Ana\r\nTexto' }, AHORA)?.expositor, 'Ana')
  })

  it('cambia la versión ante edición de fecha, título, descripción u opciones', () => {
    const id = encuentroDesdeZoom(REUNION, AHORA)!.id
    for (const patch of [{ start_time: '2026-11-03T20:00:00Z' }, { topic: '[UJ] Nuevo tema' },
      { agenda: 'Otro expositor' }, { settings: { ...REUNION.settings, approval_type: 1 } },
    ]) assert.notEqual(encuentroDesdeZoom({ ...REUNION, ...patch }, AHORA)!.id, id)
    assert.equal(encuentroDesdeZoom(REUNION, AHORA)!.id, id)
  })

  it('ordena por fecha y lee detalles completos en lugar de la agenda truncada del listado', async () => {
    const llamadas: string[] = []
    const resultado = await descubrirEncuentro({
      listarReuniones: async () => [
        { ...REUNION, id: '81111111111', start_time: '2026-11-05T20:00:00Z' },
        { ...REUNION, agenda: 'truncada' }, { ...REUNION, topic: 'Interna' },
      ],
      obtenerReunion: async id => { llamadas.push(id); return REUNION },
    }, 'host@example.org', AHORA)
    assert.deepEqual(llamadas, [REUNION.id])
    assert.equal(resultado?.descripcion, 'Una conversación abierta.')
  })

  it('omite reuniones borradas/desmarcadas y pasa a la siguiente convocatoria', async () => {
    const siguiente = { ...REUNION, id: '81111111111', start_time: '2026-11-05T20:00:00Z' }
    for (const borrada of [null, { ...REUNION, topic: 'Interna' }]) {
      const r = await descubrirEncuentro({
        listarReuniones: async () => [REUNION, siguiente],
        obtenerReunion: async id => id === REUNION.id ? borrada : siguiente,
      }, 'host@example.org', AHORA)
      assert.equal(r?.zoomMeetingId, siguiente.id)
    }
    assert.equal(await descubrirEncuentro({ listarReuniones: async () => [], obtenerReunion: async () => null }, 'host', AHORA), null)
  })

  it('propaga indisponibilidad o falta de permisos, sin fingir una agenda vacía', async () => {
    await assert.rejects(descubrirEncuentro({
      listarReuniones: async () => { throw new ZoomError('rechazo', 'scope', 401) },
      obtenerReunion: async () => null,
    }, 'host', AHORA), ZoomError)
  })

  it('rechaza una pestaña vieja o sin versión sin registrar a otro encuentro', async () => {
    const viejo = encuentroDesdeZoom(REUNION, AHORA)!
    const nuevo = encuentroDesdeZoom({ ...REUNION, start_time: '2026-11-03T20:00:00Z' }, AHORA)!
    let llamadas = 0
    const zoom = { existeRegistrante: async () => { llamadas++; return false }, agregarRegistrante: async () => { llamadas++ } }
    for (const encuentroId of [viejo.id, undefined]) {
      const r = await procesarInscripcion({ encuentroId }, { encuentro: nuevo, zoom, ahora: AHORA })
      assert.equal(r.status, 409)
    }
    assert.equal(llamadas, 0)
  })
})

describe('API Zoom para agenda', () => {
  beforeEach(_reiniciarCacheToken)
  const cred = { accountId: 'cuenta-prueba', clientId: 'cliente-prueba', clientSecret: 'secreto-prueba' }
  const json = (c: unknown, status = 200) => new Response(JSON.stringify(c), { status })

  it('pagina la lista, codifica el anfitrión y descarta enlaces y claves de Zoom', async () => {
    const urls: string[] = []
    const respuestas = [json({ access_token: 'token-prueba' }),
      json({ meetings: [{ ...REUNION, start_url: 'SECRETO', join_url: 'PRIVADO', password: 'clave' }], next_page_token: 'pagina 2' }),
      json({ meetings: [{ ...REUNION, id: '81111111111' }] }),
      json({ ...REUNION, start_url: 'SECRETO', password: 'clave' }),
    ]
    const f: typeof fetch = async (url) => { urls.push(String(url)); return respuestas.shift()! }
    const cliente = crearClienteZoom(cred, { fetch: f })
    const lista = await cliente.listarReuniones('diana+uj@example.org')
    assert.equal(lista.length, 2)
    assert.match(urls[1], /users\/diana%2Buj%40example.org\/meetings/)
    assert.match(urls[2], /next_page_token=pagina\+2/)
    assert.equal(JSON.stringify(lista).includes('SECRETO'), false)
    const detalle = await cliente.obtenerReunion(REUNION.id)
    assert.equal(detalle?.agenda, REUNION.agenda)
    assert.equal(JSON.stringify(detalle).includes('SECRETO'), false)
  })

  it('diferencia reunión eliminada de permisos insuficientes', async () => {
    const respuestas = [json({ access_token: 'token-prueba' }), json({}, 404), json({ code: 4711 }, 403)]
    const cliente = crearClienteZoom(cred, { fetch: async () => respuestas.shift()! })
    assert.equal(await cliente.obtenerReunion(REUNION.id), null)
    await assert.rejects(cliente.obtenerReunion(REUNION.id), (e: unknown) => e instanceof ZoomError && e.status === 403)
  })

  it('no elige con un listado incompleto y limita el número de páginas', async () => {
    let llamadas = 0
    const cliente = crearClienteZoom(cred, { fetch: async () => {
      llamadas++
      return llamadas === 1 ? json({ access_token: 'token-prueba' }) : json({ meetings: [REUNION], next_page_token: 'otra' })
    } })
    await assert.rejects(cliente.listarReuniones('host'), /listado incompleto/)
    assert.equal(llamadas, 11)
  })
})
