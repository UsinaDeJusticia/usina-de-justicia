// Correr con: pnpm test
// Encuentros abiertos: estado de la inscripción, validación, mapeo a Zoom,
// flujo completo con un Zoom simulado (sin credenciales reales) y cliente
// de Zoom contra un fetch falso.

import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  encuentroPublico,
  estadoInscripcion,
  formatearFechaHora,
  telefonoValido,
  validarInscripcion,
  type Encuentro,
} from '../encuentros.ts'
import { crearLimitador, procesarInscripcion } from '../encuentros-registro.ts'
import {
  _reiniciarCacheToken,
  crearClienteZoom,
  cuerpoRegistrante,
  ZoomError,
  type ClienteZoom,
} from '../zoom.ts'
import type { DatosInscripcion } from '../encuentros.ts'

const BASE: Encuentro = {
  id: '2026-11-prueba',
  expositor: 'Persona Expositora',
  tema: 'Tema',
  descripcion: null,
  inicio: '2026-11-26T19:00:00-03:00',
  duracionMinutos: 90,
  cierreInscripcion: null,
  estado: 'abiertas',
  zoomMeetingId: '81234567890',
}

const ANTES = new Date('2026-11-20T12:00:00-03:00')

const VALIDO = {
  nombre: '  Ana ',
  apellido: 'Pérez',
  email: 'Ana.Perez@Example.com',
  telefono: '+54 9 11 1234-5678',
  profesion: 'Estudiante',
  institucion: '',
  confirmacion: true,
}

// ─── Estado ─────────────────────────────────────────────────

describe('estadoInscripcion', () => {
  it('sin encuentro configurado', () => {
    assert.equal(estadoInscripcion(null, ANTES), 'sin_encuentro')
  })
  it('abiertas con convocatoria completa y antes del cierre', () => {
    assert.equal(estadoInscripcion(BASE, ANTES), 'abiertas')
  })
  it('próximamente si falta fecha o reunión de Zoom', () => {
    assert.equal(estadoInscripcion({ ...BASE, inicio: null }, ANTES), 'proximamente')
    assert.equal(estadoInscripcion({ ...BASE, zoomMeetingId: null }, ANTES), 'proximamente')
  })
  it('exige zona horaria explícita en la fecha', () => {
    assert.equal(estadoInscripcion({ ...BASE, inicio: '2026-11-26T19:00:00' }, ANTES), 'proximamente')
  })
  it('cierra al terminar el encuentro si no hay cierre explícito', () => {
    assert.equal(estadoInscripcion(BASE, new Date('2026-11-26T20:29:00-03:00')), 'abiertas')
    assert.equal(estadoInscripcion(BASE, new Date('2026-11-26T20:30:00-03:00')), 'cerradas')
  })
  it('respeta el cierre explícito de inscripción', () => {
    const e = { ...BASE, cierreInscripcion: '2026-11-25T23:59:00-03:00' }
    assert.equal(estadoInscripcion(e, new Date('2026-11-26T00:00:00-03:00')), 'cerradas')
  })
  it('cerradas manualmente', () => {
    assert.equal(estadoInscripcion({ ...BASE, estado: 'cerradas' }, ANTES), 'cerradas')
  })
})

describe('encuentroPublico', () => {
  it('nunca incluye el ID de la reunión de Zoom', () => {
    const publico = encuentroPublico(BASE)
    assert.equal('zoomMeetingId' in publico, false)
    assert.equal(JSON.stringify(publico).includes(BASE.zoomMeetingId!), false)
  })
})

describe('formatearFechaHora', () => {
  it('muestra la hora de Argentina', () => {
    const texto = formatearFechaHora('2026-11-26T22:00:00Z')
    assert.match(texto!, /26 de noviembre de 2026, 19:00 h \(hora de Argentina\)/)
  })
  it('null si no hay fecha', () => {
    assert.equal(formatearFechaHora(null), null)
  })
})

// ─── Validación ─────────────────────────────────────────────

describe('validarInscripcion', () => {
  it('acepta datos válidos y normaliza espacios y email', () => {
    const r = validarInscripcion(VALIDO)
    assert.ok(r.ok)
    assert.equal(r.datos.nombre, 'Ana')
    assert.equal(r.datos.email, 'ana.perez@example.com')
  })
  it('acepta inscripción sin institución', () => {
    assert.ok(validarInscripcion({ ...VALIDO, institucion: '   ' }).ok)
  })
  it('acepta profesiones en distintos formatos', () => {
    for (const profesion of ['estudiante', 'Abogada / docente UBA', 'Jubilado', 'Comerciante (rubro textil)', 'Lic. en Psicología']) {
      assert.ok(validarInscripcion({ ...VALIDO, profesion }).ok, profesion)
    }
  })
  it('rechaza obligatorios vacíos y falta de confirmación', () => {
    const r = validarInscripcion({})
    assert.equal(r.ok, false)
    if (r.ok) return
    for (const campo of ['nombre', 'apellido', 'email', 'telefono', 'profesion', 'confirmacion']) {
      assert.ok(r.errores[campo as keyof typeof r.errores], campo)
    }
    assert.equal(r.errores.institucion, undefined)
  })
  it('la confirmación tiene que ser exactamente true', () => {
    const r = validarInscripcion({ ...VALIDO, confirmacion: 'true' })
    assert.equal(r.ok, false)
  })
  it('rechaza email inválido, textos largos y caracteres de control', () => {
    assert.equal(validarInscripcion({ ...VALIDO, email: 'ana@' }).ok, false)
    assert.equal(validarInscripcion({ ...VALIDO, nombre: 'a'.repeat(65) }).ok, false)
    assert.equal(validarInscripcion({ ...VALIDO, profesion: 'x\u0007y' }).ok, false)
  })
  it('ignora campos extra como DNI (no se recolecta)', () => {
    const r = validarInscripcion({ ...VALIDO, dni: '12345678' })
    assert.ok(r.ok)
    assert.equal('dni' in r.datos, false)
  })
})

describe('telefonoValido', () => {
  it('acepta formatos nacionales e internacionales razonables', () => {
    for (const t of ['11 1234-5678', '+54 9 11 1234-5678', '(011) 4321-1234', '0221 15 456-7890', '+34 600 123 456', '+1 (202) 555-0143', '11.1234.5678']) {
      assert.ok(telefonoValido(t), t)
    }
  })
  it('rechaza basura y longitudes imposibles', () => {
    for (const t of ['abc', '12345', '+54 11 1234 5678 9999 99', '11-1234-5678 int. 2']) {
      assert.equal(telefonoValido(t), false, t)
    }
  })
})

// ─── Mapeo a Zoom ───────────────────────────────────────────

describe('cuerpoRegistrante', () => {
  const datos: DatosInscripcion = {
    nombre: 'Ana',
    apellido: 'Pérez',
    email: 'ana@example.com',
    telefono: '11 1234-5678',
    profesion: 'Estudiante',
    institucion: '',
  }
  it('mapea los campos acordados y omite institución vacía', () => {
    assert.deepEqual(cuerpoRegistrante(datos), {
      first_name: 'Ana',
      last_name: 'Pérez',
      email: 'ana@example.com',
      phone: '11 1234-5678',
      job_title: 'Estudiante',
    })
  })
  it('incluye org cuando hay institución', () => {
    assert.equal(cuerpoRegistrante({ ...datos, institucion: 'UBA' }).org, 'UBA')
  })
})

// ─── Flujo completo con Zoom simulado ──────────────────────

function zoomFalso(opciones: { existentes?: string[]; fallo?: ZoomError } = {}) {
  const agregados: DatosInscripcion[] = []
  const cliente: ClienteZoom = {
    async existeRegistrante(_id, email) {
      if (opciones.fallo) throw opciones.fallo
      return (opciones.existentes ?? []).includes(email) || agregados.some((d) => d.email === email)
    },
    async agregarRegistrante(_id, datos) {
      if (opciones.fallo) throw opciones.fallo
      agregados.push(datos)
    },
  }
  return { cliente, agregados }
}

const silencio = () => {}

describe('procesarInscripcion', () => {
  it('inscripción completa con datos válidos', async () => {
    const { cliente, agregados } = zoomFalso()
    const r = await procesarInscripcion(VALIDO, { encuentro: BASE, zoom: cliente, ahora: ANTES, log: silencio })
    assert.equal(r.status, 200)
    assert.deepEqual(r.cuerpo, { ok: true, estado: 'inscripto' })
    assert.equal(agregados.length, 1)
  })

  it('la respuesta nunca incluye join_url ni el ID de la reunión', async () => {
    const { cliente } = zoomFalso()
    const r = await procesarInscripcion(VALIDO, { encuentro: BASE, zoom: cliente, ahora: ANTES, log: silencio })
    const json = JSON.stringify(r.cuerpo)
    assert.equal(json.includes('join'), false)
    assert.equal(json.includes(BASE.zoomMeetingId!), false)
  })

  it('no duplica: la segunda inscripción con el mismo email no llama a Zoom', async () => {
    const { cliente, agregados } = zoomFalso()
    const deps = { encuentro: BASE, zoom: cliente, ahora: ANTES, log: silencio }
    await procesarInscripcion(VALIDO, deps)
    const r = await procesarInscripcion({ ...VALIDO, email: 'ANA.PEREZ@example.com' }, deps)
    assert.deepEqual(r.cuerpo, { ok: true, estado: 'ya_inscripto' })
    assert.equal(agregados.length, 1)
  })

  it('rechaza datos inválidos sin llamar a Zoom', async () => {
    const { cliente, agregados } = zoomFalso()
    const r = await procesarInscripcion({ ...VALIDO, email: 'x' }, { encuentro: BASE, zoom: cliente, ahora: ANTES, log: silencio })
    assert.equal(r.status, 400)
    assert.equal(agregados.length, 0)
  })

  it('campo trampa: responde como éxito sin llamar a Zoom', async () => {
    const { cliente, agregados } = zoomFalso()
    const r = await procesarInscripcion({ ...VALIDO, sitioWeb: 'http://spam' }, { encuentro: BASE, zoom: cliente, ahora: ANTES, log: silencio })
    assert.equal(r.status, 200)
    assert.equal(agregados.length, 0)
  })

  it('inscripción cerrada por fecha, por estado o sin encuentro', async () => {
    const { cliente, agregados } = zoomFalso()
    for (const [encuentro, ahora] of [
      [BASE, new Date('2026-11-27T00:00:00-03:00')],
      [{ ...BASE, estado: 'cerradas' as const }, ANTES],
      [null, ANTES],
    ] as const) {
      const r = await procesarInscripcion(VALIDO, { encuentro, zoom: cliente, ahora, log: silencio })
      assert.equal(r.status, 409)
    }
    assert.equal(agregados.length, 0)
  })

  it('rechaza si la convocatoria cambió mientras la página estaba abierta', async () => {
    const { cliente } = zoomFalso()
    const r = await procesarInscripcion({ ...VALIDO, encuentroId: 'otro' }, { encuentro: BASE, zoom: cliente, ahora: ANTES, log: silencio })
    assert.equal(r.status, 409)
  })

  it('sin credenciales: 503, nunca éxito simulado', async () => {
    const r = await procesarInscripcion(VALIDO, { encuentro: BASE, zoom: null, ahora: ANTES, log: silencio })
    assert.equal(r.status, 503)
    assert.equal(r.cuerpo.ok, false)
  })

  it('Zoom limita peticiones → 429; caído → 502; rechazo → 502', async () => {
    const casos: Array<[ZoomError, number]> = [
      [new ZoomError('limite', 'x', 429), 429],
      [new ZoomError('no_disponible', 'x'), 502],
      [new ZoomError('rechazo', 'x', 400, 3000), 502],
      [new ZoomError('sin_configurar', 'x', 401), 503],
    ]
    for (const [fallo, status] of casos) {
      const { cliente } = zoomFalso({ fallo })
      const r = await procesarInscripcion(VALIDO, { encuentro: BASE, zoom: cliente, ahora: ANTES, log: silencio })
      assert.equal(r.status, status)
      assert.equal(r.cuerpo.ok, false)
    }
  })

  it('los logs no contienen datos personales', async () => {
    const lineas: string[] = []
    const { cliente } = zoomFalso({ fallo: new ZoomError('rechazo', 'registrants:add: solicitud rechazada', 400, 3000) })
    await procesarInscripcion(VALIDO, { encuentro: BASE, zoom: cliente, ahora: ANTES, log: (m) => lineas.push(m) })
    const todo = lineas.join('\n').toLowerCase()
    for (const dato of ['ana', 'pérez', 'example.com', '1234-5678', 'estudiante']) {
      assert.equal(todo.includes(dato), false, dato)
    }
  })
})

describe('crearLimitador', () => {
  it('bloquea al superar el máximo y libera al pasar la ventana', () => {
    let t = 0
    const permitir = crearLimitador(2, 1000, () => t)
    assert.ok(permitir('ip'))
    assert.ok(permitir('ip'))
    assert.equal(permitir('ip'), false)
    assert.ok(permitir('otra-ip'))
    t = 1001
    assert.ok(permitir('ip'))
  })
})

// ─── Cliente de Zoom contra un fetch falso ──────────────────

describe('crearClienteZoom', () => {
  beforeEach(() => _reiniciarCacheToken())

  const cred = { accountId: 'acc', clientId: 'id', clientSecret: 'secret' }
  const datos: DatosInscripcion = {
    nombre: 'Ana', apellido: 'Pérez', email: 'ana@example.com',
    telefono: '11 1234-5678', profesion: 'Estudiante', institucion: '',
  }

  function fetchFalso(respuestas: Array<(url: string, init?: RequestInit) => Response>) {
    const llamadas: Array<{ url: string; init?: RequestInit }> = []
    const f = (async (url: string, init?: RequestInit) => {
      llamadas.push({ url, init })
      const siguiente = respuestas.shift()
      if (!siguiente) throw new Error('llamada inesperada')
      return siguiente(url, init)
    }) as unknown as typeof fetch
    return { f, llamadas }
  }

  const json = (cuerpo: unknown, status = 200) =>
    new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } })

  it('pide token con Basic auth y agrega el registrante con el mapeo acordado', async () => {
    const { f, llamadas } = fetchFalso([
      () => json({ access_token: 'tok', expires_in: 3600 }),
      () => json({ id: 1, join_url: 'https://zoom.us/w/privado', registrant_id: 'r' }, 201),
    ])
    await crearClienteZoom(cred, { fetch: f }).agregarRegistrante('81234567890', datos)
    assert.match(llamadas[0].url, /grant_type=account_credentials&account_id=acc/)
    assert.equal((llamadas[0].init!.headers as Record<string, string>).Authorization, `Basic ${Buffer.from('id:secret').toString('base64')}`)
    assert.equal(llamadas[1].url, 'https://api.zoom.us/v2/meetings/81234567890/registrants')
    assert.equal((llamadas[1].init!.headers as Record<string, string>).Authorization, 'Bearer tok')
    assert.deepEqual(JSON.parse(llamadas[1].init!.body as string), cuerpoRegistrante(datos))
  })

  it('reutiliza el token mientras está vigente', async () => {
    const { f, llamadas } = fetchFalso([
      () => json({ access_token: 'tok', expires_in: 3600 }),
      () => json({ registrants: [] }),
      () => json({ registrants: [] }),
      () => json({}, 201),
    ])
    const zoom = crearClienteZoom(cred, { fetch: f })
    assert.equal(await zoom.existeRegistrante('81234567890', datos.email), false)
    await zoom.agregarRegistrante('81234567890', datos)
    assert.equal(llamadas.filter((l) => l.url.includes('oauth')).length, 1)
  })

  it('detecta duplicados recorriendo páginas, sin distinguir mayúsculas', async () => {
    const { f } = fetchFalso([
      () => json({ access_token: 'tok', expires_in: 3600 }),
      () => json({ registrants: [{ email: 'otra@x.com' }], next_page_token: 'p2' }),
      (url) => {
        assert.match(url, /next_page_token=p2/)
        return json({ registrants: [{ email: 'ANA@example.com' }] })
      },
    ])
    assert.equal(await crearClienteZoom(cred, { fetch: f }).existeRegistrante('81234567890', datos.email), true)
  })

  it('traduce errores: 429 → limite, 404 → rechazo, 500 → no_disponible, red → no_disponible', async () => {
    const casos: Array<[() => Response, string]> = [
      [() => json({ code: 429, message: 'x' }, 429), 'limite'],
      [() => json({ code: 3001, message: 'x' }, 404), 'rechazo'],
      [() => json({}, 500), 'no_disponible'],
      [() => { throw new TypeError('fetch failed') }, 'no_disponible'],
    ]
    for (const [respuesta, tipo] of casos) {
      _reiniciarCacheToken()
      const { f } = fetchFalso([() => json({ access_token: 'tok' }), respuesta])
      await assert.rejects(
        crearClienteZoom(cred, { fetch: f }).agregarRegistrante('81234567890', datos),
        (e: unknown) => e instanceof ZoomError && e.tipo === tipo
      )
    }
  })

  it('credenciales rechazadas → sin_configurar', async () => {
    const { f } = fetchFalso([() => json({ reason: 'Invalid client_id or client_secret' }, 400)])
    await assert.rejects(
      crearClienteZoom(cred, { fetch: f }).agregarRegistrante('81234567890', datos),
      (e: unknown) => e instanceof ZoomError && e.tipo === 'sin_configurar'
    )
  })

  it('rechaza un ID de reunión mal configurado sin llamar a Zoom', async () => {
    const { f, llamadas } = fetchFalso([])
    await assert.rejects(
      crearClienteZoom(cred, { fetch: f }).agregarRegistrante('812 3456', datos),
      (e: unknown) => e instanceof ZoomError && e.tipo === 'sin_configurar'
    )
    assert.equal(llamadas.length, 0)
  })
})
