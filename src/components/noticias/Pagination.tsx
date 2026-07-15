import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
  basePath: string
  itemLabel?: string // "artículos", "resultados", etc.
  /**
   * Constructor de URL por página. Opcional — por defecto usa `?page=N`
   * sobre basePath (comportamiento previo). Las rutas de /noticias que
   * paginan por segmento (/pagina/N) pasan la suya propia acá.
   */
  buildPageUrl?: (page: number) => string
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  basePath,
  itemLabel = 'artículos',
  buildPageUrl,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="flex justify-center mt-12">
        <p className="text-body-sm text-grey-500">
          Mostrando {total} {total === 1 ? itemLabel.replace(/s$/, '') : itemLabel}
        </p>
      </div>
    )
  }

  const maxVisible = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const endPage = Math.min(totalPages, startPage + maxVisible - 1)
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  )

  function pageUrl(page: number): string {
    if (buildPageUrl) return buildPageUrl(page)
    return page === 1 ? basePath : `${basePath}?page=${page}`
  }

  return (
    <nav
      className="flex flex-col items-center gap-4 mt-12"
      aria-label="Paginación"
    >
      <div className="flex items-center gap-2">
        {/* Anterior */}
        {currentPage > 1 ? (
          <Link
            href={pageUrl(currentPage - 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xs text-body-sm font-bold text-ink no-underline hover:bg-navy-50 hover:no-underline transition-colors duration-base ease-out"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Anterior
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-xs text-body-sm text-grey-300 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Anterior
          </span>
        )}

        {/* Primera página + elipsis */}
        {startPage > 1 && (
          <>
            <Link
              href={pageUrl(1)}
              className="w-10 h-10 flex items-center justify-center rounded-xs text-body-sm font-bold text-ink no-underline hover:bg-navy-50 hover:no-underline transition-colors duration-base ease-out"
            >
              1
            </Link>
            {startPage > 2 && <span className="text-grey-400 px-1">…</span>}
          </>
        )}

        {/* Números de página */}
        {pages.map((page) => (
          <Link
            key={page}
            href={pageUrl(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-xs text-body-sm font-bold no-underline hover:no-underline transition-colors duration-base ease-out ${
              page === currentPage
                ? 'bg-navy-600 text-white'
                : 'text-ink hover:bg-navy-50'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        ))}

        {/* Última página + elipsis */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-grey-400 px-1">…</span>
            )}
            <Link
              href={pageUrl(totalPages)}
              className="w-10 h-10 flex items-center justify-center rounded-xs text-body-sm font-bold text-ink no-underline hover:bg-navy-50 hover:no-underline transition-colors duration-base ease-out"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Siguiente */}
        {currentPage < totalPages ? (
          <Link
            href={pageUrl(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xs text-body-sm font-bold text-ink no-underline hover:bg-navy-50 hover:no-underline transition-colors duration-base ease-out"
            aria-label="Página siguiente"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-xs text-body-sm text-grey-300 cursor-not-allowed">
            Siguiente
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="text-body-sm text-grey-500">
        Página {currentPage} de {totalPages} — {total} {itemLabel} en total
      </p>
    </nav>
  )
}
