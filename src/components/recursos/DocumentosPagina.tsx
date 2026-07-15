import { DocumentCard } from '@/components/documentos/DocumentCard'
import { Pagination } from '@/components/noticias/Pagination'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { DocumentoRecurso } from './ListaDocumentos'

export const DOCUMENTOS_PER_PAGE = 15

/**
 * Presentación pura (sin 'use client'): lista + paginación de UNA página ya
 * resuelta. La usan tanto <ListaDocumentos> (cliente, resuelve `?page=N` con
 * useSearchParams) como el fallback server-side de /recursos/page.tsx (page 1
 * fija, sin JS) — así el HTML estático y el hidratado son exactamente el
 * mismo layout, sin duplicar el JSX de la fila de documento.
 */
export function DocumentosPagina({
  documentos,
  currentPage,
}: {
  documentos: DocumentoRecurso[]
  currentPage: number
}) {
  const totalPages = Math.max(1, Math.ceil(documentos.length / DOCUMENTOS_PER_PAGE))
  const page = Math.min(totalPages, Math.max(1, currentPage))
  const start = (page - 1) * DOCUMENTOS_PER_PAGE
  const pageItems = documentos.slice(start, start + DOCUMENTOS_PER_PAGE)

  return (
    <>
      {pageItems.length > 0 ? (
        <div className="space-y-4">
          {pageItems.map((doc) => (
            <div key={doc.key}>
              <div className="flex items-center gap-2 mb-2">
                <Badge tone="navy">{doc.categoriaLabel}</Badge>
              </div>
              <DocumentCard
                titulo={doc.titulo}
                meta={formatDate(doc.fecha)}
                url={doc.url}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-body-lg text-grey-500">
            No se encontraron recursos.
          </p>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        total={documentos.length}
        basePath="/recursos"
        itemLabel="documentos"
      />
    </>
  )
}
