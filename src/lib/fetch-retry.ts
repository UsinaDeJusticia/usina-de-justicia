// ============================================
// src/lib/fetch-retry.ts
// Reintentos con backoff para las llamadas a la API de WordPress.
//
// Por qué existe: dos veces en la misma sesión (13 y 21-ago-2026) un build
// de producción se cayó entero porque WordPress tuvo un hipo puntual
// mientras se generaban las páginas estáticas — una vez un timeout
// (>15000ms en /posts) y otra un 500. En ambos casos el mismo commit
// compiló bien al reintentar. Un deploy que falla al azar es inaceptable
// entrando al cutover: si el build no pasa, el sitio no se publica.
//
// Alcance deliberado: SOLO reintenta lo que es seguro reintentar.
// - Todas las llamadas a WP son GET idempotentes, así que repetirlas no
//   tiene efectos secundarios.
// - No se reintenta un 4xx: un 404 significa que el recurso no existe de
//   verdad (por ejemplo un slug que ya no está publicado) y reintentarlo
//   solo hace más lento el build sin cambiar el resultado. La única
//   excepción es 429, que es "volvé más tarde", no "no existe".
// ============================================

export interface RetryOptions {
  /** Intentos totales, no reintentos. 1 = sin reintentos. */
  attempts?: number
  /** Timeout por intento (cada intento arranca con su propio AbortController). */
  timeoutMs?: number
  /** Espera base; crece exponencialmente por intento. */
  baseDelayMs?: number
  /** Inyectables para poder testear sin esperas ni azar reales. */
  sleep?: (ms: number) => Promise<void>
  jitter?: () => number
  onRetry?: (info: { attempt: number; reason: string; delayMs: number }) => void
}

const DEFAULT_ATTEMPTS = 3
const DEFAULT_TIMEOUT_MS = 15000
const DEFAULT_BASE_DELAY_MS = 500

/**
 * Un status HTTP que vale la pena reintentar: el servidor falló o pidió
 * esperar, no dijo que el recurso no exista.
 */
export function isTransientStatus(status: number): boolean {
  return status >= 500 || status === 429
}

/**
 * Un error de red/aborto (a diferencia de un error de programación, que no
 * se arregla reintentando).
 */
export function isTransientError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  if (error.name === 'AbortError' || error.name === 'TimeoutError') return true

  // undici envuelve los errores de socket en `cause`; el mensaje "terminated"
  // con causa SocketError es el corte de conexión que ya se vio en builds
  // anteriores de este proyecto.
  const cause = (error as { cause?: unknown }).cause
  if (cause instanceof Error && /socket|econnreset|epipe|closed/i.test(cause.message)) {
    return true
  }

  return /fetch failed|terminated|network|econnreset|etimedout|enotfound|eai_again|socket/i.test(
    error.message
  )
}

/** Backoff exponencial con jitter, para no reintentar todos a la vez. */
export function retryDelayMs(
  attempt: number,
  baseDelayMs = DEFAULT_BASE_DELAY_MS,
  jitter = Math.random
): number {
  const exponential = baseDelayMs * 2 ** (attempt - 1)
  // Hasta +30%: durante un build, Next.js genera páginas en varios workers
  // en paralelo y sin jitter todos reintentarían en el mismo instante,
  // volviendo a tumbar al WordPress que justo está con problemas.
  return Math.round(exponential * (1 + 0.3 * jitter()))
}

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * `fetch` con timeout por intento y reintentos ante fallos transitorios.
 *
 * En el último intento se propaga el resultado real —la Response 5xx o el
 * error de red original— para que quien llama arme su mensaje de error como
 * siempre. En particular, un `AbortError` sale tal cual para que el
 * `wpFetch` de wordpress.ts lo siga traduciendo a "WP API Timeout".
 */
export async function fetchWithRetry(
  url: string,
  init: RequestInit & { next?: { revalidate?: number } } = {},
  options: RetryOptions = {}
): Promise<Response> {
  const {
    attempts = DEFAULT_ATTEMPTS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    baseDelayMs = DEFAULT_BASE_DELAY_MS,
    sleep = defaultSleep,
    jitter = Math.random,
    onRetry,
  } = options

  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const isLastAttempt = attempt === attempts
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, { ...init, signal: controller.signal })

      if (response.ok || !isTransientStatus(response.status) || isLastAttempt) {
        return response
      }

      const delayMs = retryDelayMs(attempt, baseDelayMs, jitter)
      onRetry?.({ attempt, reason: `HTTP ${response.status}`, delayMs })
      await sleep(delayMs)
    } catch (error) {
      lastError = error
      if (isLastAttempt || !isTransientError(error)) throw error

      const delayMs = retryDelayMs(attempt, baseDelayMs, jitter)
      onRetry?.({
        attempt,
        reason: error instanceof Error ? error.name || error.message : 'error desconocido',
        delayMs,
      })
      await sleep(delayMs)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // Inalcanzable: el último intento siempre retorna o lanza.
  throw lastError ?? new Error(`fetchWithRetry agotó ${attempts} intentos: ${url}`)
}
