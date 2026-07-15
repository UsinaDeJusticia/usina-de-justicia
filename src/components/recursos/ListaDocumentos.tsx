'use client'

import { useSearchParams } from 'next/navigation'
import { DocumentCard } from '@/components/documentos/DocumentCard'
import { Pagination } from '@/components/noticias/Pagination'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export interface DocumentoRecurso {
  key: string
  titulo: string
  fecha: string
  categoriaLabel: string
  url: string
}

const PER_PAGE = 15

/**
 * Client Component: recibe los ~88 documentos YA procesados (nunca el
 * posts.json completo de 708KB) y resuelve `?page=N` con useSearchParams()
 * en el cliente. Esto es lo que le permite a /recursos/page.tsx (Server
 * Component, envolviéndonos en <Suspense>) ser estático: la paginación deja
 * de depender de `searchParams` del lado del servidor, que era la única
 * causa de que la ruta se sirviera dinámica por request.
 */
export function ListaDocumentos({
  documentos,
}: {
  documentos: DocumentoRecurso[]
}) {
  const searchParams = useSearchParams()
  const totalPages = Math.max(1, Math.ceil(documentos.length / PER_PAGE))
  const currentPage = Math.min(
    totalPages,
    Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  )
  const start = (currentPage - 1) * PER_PAGE
  const pageItems = documentos.slice(start, start + PER_PAGE)

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
        currentPage={currentPage}
        totalPages={totalPages}
        total={documentos.length}
        basePath="/recursos"
        itemLabel="documentos"
      />
    </>
  )
}
