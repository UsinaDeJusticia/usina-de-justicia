// Ver la nota sobre el runner en agent-negotiation.test.ts.
// Correr con: pnpm test

import { describe, it, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  fetchWithRetry,
  isTransientError,
  isTransientStatus,
  retryDelayMs,
} from '../fetch-retry.ts'

const realFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = realFetch
})

/** Encola respuestas/errores y cuenta cuántas veces se llamó a fetch. */
function stubFetch(outcomes: Array<Response | Error>) {
  const calls: string[] = []
  globalThis.fetch = (async (url: string | URL) => {
    calls.push(String(url))
    const outcome = outcomes.shift()
    if (outcome instanceof Error) throw outcome
    if (!outcome) throw new Error('stub sin respuestas encoladas')
    return outcome
  }) as typeof fetch
  return calls
}

const noSleep = async () => {}
const noJitter = () => 0

describe('isTransientStatus', () => {
  it('reintenta 5xx y 429', () => {
    assert.equal(isTransientStatus(500), true)
    assert.equal(isTransientStatus(502), true)
    assert.equal(isTransientStatus(503), true)
    assert.equal(isTransientStatus(429), true)
  })

  it('NO reintenta 4xx: un 404 es una respuesta real, no un fallo', () => {
    assert.equal(isTransientStatus(404), false)
    assert.equal(isTransientStatus(401), false)
    assert.equal(isTransientStatus(400), false)
    assert.equal(isTransientStatus(200), false)
  })
})

describe('isTransientError', () => {
  it('reconoce el aborto por timeout', () => {
    const abort = new Error('The operation was aborted')
    abort.name = 'AbortError'
    assert.equal(isTransientError(abort), true)
  })

  it('reconoce el corte de socket de undici que ya rompió builds', () => {
    // Forma real del error visto en builds anteriores del proyecto.
    const error = new Error('terminated')
    ;(error as { cause?: unknown }).cause = new Error('other side closed')
    assert.equal(isTransientError(error), true)
  })

  it('reconoce fallos de red por mensaje', () => {
    assert.equal(isTransientError(new Error('fetch failed')), true)
    assert.equal(isTransientError(new Error('ECONNRESET')), true)
  })

  it('NO reintenta un error de programación', () => {
    assert.equal(isTransientError(new TypeError('x is not a function')), false)
    assert.equal(isTransientError('no soy un Error'), false)
  })
})

describe('retryDelayMs', () => {
  it('crece exponencialmente', () => {
    assert.equal(retryDelayMs(1, 500, noJitter), 500)
    assert.equal(retryDelayMs(2, 500, noJitter), 1000)
    assert.equal(retryDelayMs(3, 500, noJitter), 2000)
  })

  it('agrega hasta 30% de jitter', () => {
    assert.equal(retryDelayMs(1, 500, () => 1), 650)
    assert.equal(retryDelayMs(1, 500, () => 0.5), 575)
  })
})

describe('fetchWithRetry', () => {
  it('no reintenta si la primera respuesta es buena', async () => {
    const calls = stubFetch([new Response('ok', { status: 200 })])
    const response = await fetchWithRetry('https://wp.test/posts', {}, { sleep: noSleep })
    assert.equal(response.status, 200)
    assert.equal(calls.length, 1)
  })

  it('reintenta un 500 y devuelve el éxito posterior', async () => {
    // Este es exactamente el fallo que tumbó el build del 21-ago.
    const calls = stubFetch([
      new Response('boom', { status: 500 }),
      new Response('ok', { status: 200 }),
    ])
    const response = await fetchWithRetry(
      'https://wp.test/posts',
      {},
      { sleep: noSleep, jitter: noJitter }
    )
    assert.equal(response.status, 200)
    assert.equal(calls.length, 2)
  })

  it('reintenta un timeout y devuelve el éxito posterior', async () => {
    const abort = new Error('aborted')
    abort.name = 'AbortError'
    const calls = stubFetch([abort, new Response('ok', { status: 200 })])
    const response = await fetchWithRetry(
      'https://wp.test/posts',
      {},
      { sleep: noSleep, jitter: noJitter }
    )
    assert.equal(response.status, 200)
    assert.equal(calls.length, 2)
  })

  it('NO reintenta un 404: devuelve la respuesta en el primer intento', async () => {
    const calls = stubFetch([new Response('nope', { status: 404 })])
    const response = await fetchWithRetry(
      'https://wp.test/posts',
      {},
      { sleep: noSleep, jitter: noJitter }
    )
    assert.equal(response.status, 404)
    assert.equal(calls.length, 1)
  })

  it('agota los intentos y devuelve la última respuesta 5xx', async () => {
    // Importante: devuelve la Response, no lanza — así wordpress.ts arma su
    // mensaje "WP API Error: 503 …" de siempre.
    const calls = stubFetch([
      new Response('a', { status: 503 }),
      new Response('b', { status: 503 }),
      new Response('c', { status: 503 }),
    ])
    const response = await fetchWithRetry(
      'https://wp.test/posts',
      {},
      { attempts: 3, sleep: noSleep, jitter: noJitter }
    )
    assert.equal(response.status, 503)
    assert.equal(calls.length, 3)
  })

  it('propaga el error original al agotar los intentos', async () => {
    const abort = new Error('aborted')
    abort.name = 'AbortError'
    const calls = stubFetch([abort, abort, abort])
    await assert.rejects(
      () =>
        fetchWithRetry(
          'https://wp.test/posts',
          {},
          { attempts: 3, sleep: noSleep, jitter: noJitter }
        ),
      // El AbortError tiene que salir tal cual: wordpress.ts lo traduce a
      // "WP API Timeout" y ese contrato de error no debe cambiar.
      (error: Error) => error.name === 'AbortError'
    )
    assert.equal(calls.length, 3)
  })

  it('un error no transitorio corta de inmediato', async () => {
    const calls = stubFetch([new TypeError('bug real'), new Response('ok', { status: 200 })])
    await assert.rejects(
      () => fetchWithRetry('https://wp.test/posts', {}, { sleep: noSleep }),
      TypeError
    )
    assert.equal(calls.length, 1)
  })

  it('informa cada reintento por onRetry', async () => {
    stubFetch([new Response('x', { status: 502 }), new Response('ok', { status: 200 })])
    const avisos: string[] = []
    await fetchWithRetry(
      'https://wp.test/posts',
      {},
      {
        sleep: noSleep,
        jitter: noJitter,
        onRetry: ({ attempt, reason, delayMs }) =>
          avisos.push(`${attempt}:${reason}:${delayMs}`),
      }
    )
    assert.deepEqual(avisos, ['1:HTTP 502:500'])
  })

  it('respeta attempts=1 (sin reintentos)', async () => {
    const calls = stubFetch([new Response('x', { status: 500 })])
    const response = await fetchWithRetry(
      'https://wp.test/posts',
      {},
      { attempts: 1, sleep: noSleep }
    )
    assert.equal(response.status, 500)
    assert.equal(calls.length, 1)
  })
})
