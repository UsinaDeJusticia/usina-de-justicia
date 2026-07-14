import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
  basePath: string
  itemLabel?: string // "artículos", "resultados", etc.
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  basePath,
  itemLabel = 'artículos',
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="flex justify-center mt-12">
        <p className="text-body-sm text-neutral-400">
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
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-300 cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </span>
        )}

        {/* Primera página + elipsis */}
        {startPage > 1 && (
          <>
            <Link
              href={pageUrl(1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              1
            </Link>
            {startPage > 2 && (
              <span className="text-neutral-400 px-1">…</span>
            )}
          </>
        )}

        {/* Números de página */}
        {pages.map((page) => (
          <Link
            key={page}
            href={pageUrl(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-body-sm transition-colors ${
              page === currentPage
                ? 'bg-primary-500 text-white font-medium'
                : 'text-neutral-600 hover:bg-neutral-100'
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
              <span className="text-neutral-400 px-1">…</span>
            )}
            <Link
              href={pageUrl(totalPages)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Siguiente */}
        {currentPage < totalPages ? (
          <Link
            href={pageUrl(currentPage + 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Página siguiente"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg text-body-sm text-neutral-300 cursor-not-allowed">
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>

      <p className="text-body-sm text-neutral-400">
        Página {currentPage} de {totalPages} — {total} {itemLabel} en total
      </p>
    </nav>
  )
}
