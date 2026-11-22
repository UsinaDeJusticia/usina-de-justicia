'use client'

// Cliente del buscador (/buscar): input con debounce + fetch a /api/buscar.
//
// Decisiones que no son obvias a simple vista:
// - NO importa nada de src/lib/buscador.ts ni de wordpress.ts: cualquier
//   import de valor arrastraría minisearch al bundle del navegador. El shape
//   del resultado se duplica acá como interface local, a propósito.
// - La URL se sincroniza con history.replaceState, no con router.replace:
//   replaceState no re-renderiza el árbol de server components, y acá el
//   estado ya vive entero en el cliente.
// - AbortController por request: al tipear rápido, la respuesta de una query
//   vieja no debe pisar a la nueva.

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, formatDate } from '@/lib/utils'

/** Mismo shape que ResultadoBuscador en src/lib/buscador.ts (duplicado a
 *  propósito — ver el comentario de cabecera). */
interface ResultadoBuscador {
  tipo: 'post' | 'pagina'
  titulo: string
  extracto: string
  href: string
  categoria: string
  fechaPublicacion?: string
}

const MAX_MOSTRADOS = 30

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

type Estado = 'inactivo' | 'buscando' | 'ok' | 'error'

export function BuscadorClient() {
  const searchParams = useSearchParams()
  // Init una sola vez desde la URL (permite compartir /buscar?q=...).
  const [q, setQ] = useState(() => searchParams.get('q') ?? '')
  const [respuesta, setRespuesta] = useState<{ query: string; total: number; resultados: ResultadoBuscador[] } | null>(null)
  const [estado, setEstado] = useState<Estado>('inactivo')
  const [intento, setIntento] = useState(0)
  const { resultados = [], total = 0 } = respuesta ?? {}
  const muestraResultadosAnteriores = resultados.length > 0 && respuesta?.query !== q.trim()

  // Sincronización ENTRANTE: Next refleja en useSearchParams tanto la
  // navegación de next/form como los replaceState nativos (soportado desde
  // 14.1). Los cambios que produce este mismo componente al tipear llegan
  // con el mismo valor que ya está en el input (no-op); los externos —
  // buscar desde la barra del header o del pie estando YA en /buscar, donde
  // el componente no se remonta— adoptan la query nueva.
  const urlQ = searchParams.get('q') ?? ''
  useEffect(() => {
    if (urlQ.trim() !== q.trim()) setQ(urlQ)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ])

  useEffect(() => {
    const query = q.trim()

    // Reflejar la query en la URL sin re-render del árbol server.
    window.history.replaceState(
      null,
      '',
      query ? `/buscar?q=${encodeURIComponent(query)}` : '/buscar'
    )

    if (query.length < 2) {
      setEstado('inactivo')
      setRespuesta(null)
      return
    }

    setEstado('buscando')
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        const data = (await res.json()) as {
          total: number
          resultados: ResultadoBuscador[]
          error?: string
        }
        if (controller.signal.aborted) return
        if (!res.ok || data.error) {
          setEstado('error')
          return
        }
        setRespuesta({ query, total: data.total, resultados: data.resultados })
        setEstado('ok')
      } catch {
        if (controller.signal.aborted) return
        setEstado('error')
      }
    }, 250)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [q, intento])

  return (
    <div>
      <div className="relative">
        <label htmlFor="buscador-q" className="sr-only">
          Buscar en el sitio
        </label>
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id="buscador-q"
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar noticias, informes y páginas…"
          className={cn(
            'w-full bg-white border border-grey-200 rounded-xs px-4 py-3 pl-11 text-body text-ink placeholder:text-grey-500 transition-colors duration-base ease-out',
            focusRing
          )}
        />
      </div>

      <div className="mt-4 flex min-h-17 items-start gap-3 py-1">
        <p role="status" className="m-0 min-w-0 flex-1 self-center text-body-sm text-grey-700 wrap-anywhere">
          {estado === 'buscando' && 'Buscando…'}
          {estado === 'ok' &&
            total > 0 &&
            (total === 1
              ? '1 resultado para «' + respuesta?.query + '»'
              : total + ' resultados para «' + respuesta?.query + '»')}
          {estado === 'ok' && total === 0 && 'Sin resultados. Probá con otras palabras.'}
          {estado === 'error' && (
            <>
              No pudimos buscar.
              {resultados.length === 0 && (
                <>
                  {' '}
                  <Link href="/noticias" className={cn('text-navy-600 underline', focusRing)}>
                    Ver últimas noticias
                  </Link>
                </>
              )}
            </>
          )}
          {muestraResultadosAnteriores && (
            <span className="block truncate">Resultados anteriores de «{respuesta?.query}».</span>
          )}
        </p>
        {estado === 'error' && (
          <Button type="button" variant="secondary" size="sm" className="min-h-11 shrink-0 self-center" onClick={() => setIntento(value => value + 1)}>
            Reintentar
          </Button>
        )}
      </div>

      {resultados.length > 0 && (
        <>
          <ul aria-busy={estado === 'buscando'} className="mt-4 flex flex-col gap-4">
            {resultados.map((r) => (
              <li key={r.href}>
                <article className="bg-white border border-grey-200 rounded-xs p-6 hover:shadow-md transition-shadow duration-base ease-out">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge tone={r.tipo === 'pagina' ? 'neutral' : 'navy'}>{r.categoria}</Badge>
                    {r.fechaPublicacion && (
                      <span className="text-caption text-grey-500">
                        {formatDate(r.fechaPublicacion)}
                      </span>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-h4 text-ink">
                    <Link
                      href={r.href}
                      className={cn(
                        'no-underline text-ink hover:text-navy-600 hover:no-underline transition-colors duration-base ease-out rounded-xs',
                        focusRing
                      )}
                    >
                      {r.titulo}
                    </Link>
                  </h2>
                  {r.extracto && (
                    <p className="text-body-sm text-grey-700 mt-2 line-clamp-2">{r.extracto}</p>
                  )}
                </article>
              </li>
            ))}
          </ul>
          {total > MAX_MOSTRADOS && (
            <p className="text-body-sm text-grey-500 mt-6">
              Mostrando los primeros {MAX_MOSTRADOS} resultados. Afiná la búsqueda para ver más.
            </p>
          )}
        </>
      )}
    </div>
  )
}
