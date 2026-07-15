'use client'

import { useSearchParams } from 'next/navigation'
import { DocumentosPagina } from './DocumentosPagina'

export interface DocumentoRecurso {
  key: string
  titulo: string
  fecha: string
  categoriaLabel: string
  url: string
}

/**
 * Client Component: recibe los ~88 documentos YA procesados (nunca el
 * posts.json completo de 708KB) y resuelve `?page=N` con useSearchParams()
 * en el cliente. Esto es lo que le permite a /recursos/page.tsx (Server
 * Component, envolviéndonos en <Suspense>) ser estático: la paginación deja
 * de depender de `searchParams` del lado del servidor, que era la única
 * causa de que la ruta se sirviera dinámica por request.
 *
 * El fallback de ese <Suspense> (mientras este componente hidrata, y para
 * cualquier crawler sin JS) es <DocumentosPagina> con la página 1 fija,
 * renderizada en el servidor — ver /recursos/page.tsx.
 */
export function ListaDocumentos({
  documentos,
}: {
  documentos: DocumentoRecurso[]
}) {
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  return <DocumentosPagina documentos={documentos} currentPage={currentPage} />
}
