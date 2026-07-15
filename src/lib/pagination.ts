// src/lib/pagination.ts
// Helpers de paginación por segmento de ruta (/pagina/[n]) para /noticias,
// /noticias/categoria/[categoria] y /noticias/tag/[tag].
//
// Las funciones getXTotalPages() de acá usan EXACTAMENTE los mismos
// parámetros (page: 1, perPage: ARTICULOS_PER_PAGE) que generateStaticParams
// para poder calcular cuántas páginas existen. Como wordpress.ts pide con
// `fetch(..., { next: { revalidate: 300 } })`, Next.js cachea esa URL en su
// Data Cache durante el build: generateStaticParams pide la página 1 una
// sola vez, y la revalidación de rango que hace cada page.tsx (para decidir
// si `n` está fuera de rango) reutiliza esa misma respuesta cacheada en vez
// de disparar otra consulta a WP — de ahí la importancia de mantener los
// mismos parámetros en ambos lugares.

import {
  getArticulos,
  getArticulosBySection,
  getArticulosByTagSlug,
} from '@/lib/wordpress'
import type { SiteSection } from '@/types/wordpress'

export const ARTICULOS_PER_PAGE = 12

export async function getGeneralTotalPages(): Promise<number> {
  const { totalPages } = await getArticulos({
    page: 1,
    perPage: ARTICULOS_PER_PAGE,
  })
  return totalPages
}

export async function getSectionTotalPages(
  section: SiteSection
): Promise<number> {
  const { totalPages } = await getArticulosBySection(section, {
    page: 1,
    perPage: ARTICULOS_PER_PAGE,
  })
  return totalPages
}

export async function getTagTotalPages(tagSlug: string): Promise<number> {
  const { totalPages } = await getArticulosByTagSlug(tagSlug, {
    page: 1,
    perPage: ARTICULOS_PER_PAGE,
  })
  return totalPages
}

/** Páginas 2..totalPages a pre-generar en generateStaticParams (page 1 vive en la ruta base). */
export function pageRangeParams(totalPages: number): Array<{ n: string }> {
  const extra = Math.max(0, totalPages - 1)
  return Array.from({ length: extra }, (_, i) => ({ n: String(i + 2) }))
}
