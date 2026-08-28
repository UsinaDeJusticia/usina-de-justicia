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

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
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
  const [resultados, setResultados] = useState<ResultadoBuscador[]>([])
  const [total, setTotal] = useState(0)
  const [estado, setEstado] = useState<Estado>('inactivo')
  const abortRef = useRef<AbortController | null>(null)

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
      setResultados([])
      setTotal(0)
      return
    }

    setEstado('buscando')
    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        const data = (await res.json()) as {
          total: number
          resultados: ResultadoBuscador[]
          error?: string
        }
        if (!res.ok || data.error) {
          setEstado('error')
          return
        }
        setResultados(data.resultados)
        setTotal(data.total)
        setEstado('ok')
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        setEstado('error')
      }
    }, 250)

    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
    }
  }, [q])

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

      <p className="text-body-sm text-grey-700 mt-4" aria-live="polite">
        {estado === 'buscando' && 'Buscando…'}
        {estado === 'ok' &&
          total > 0 &&
          (total === 1
            ? `1 resultado para «${q.trim()}»`
            : `${total} resultados para «${q.trim()}»`)}
        {estado === 'ok' && total === 0 && 'Sin resultados. Probá con otras palabras.'}
        {estado === 'error' && (
          <>
            No pudimos buscar en este momento. Probá de nuevo en unos minutos o recorré{' '}
            <Link
              href="/noticias"
              className={cn('text-navy-600 underline hover:text-navy-700', focusRing)}
            >
              las últimas noticias
            </Link>
            .
          </>
        )}
      </p>

      {estado === 'ok' && resultados.length > 0 && (
        <>
          <ul className="flex flex-col gap-4 mt-8">
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
