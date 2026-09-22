import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Articulo } from '@/types'

/**
 * Fila compacta para "En los medios" — deliberadamente distinta de
 * ArticleCard (sin imagen, sin grilla): es cobertura de terceros, no una
 * nota nuestra, y no debe confundirse a simple vista con las que sí
 * escribimos. El link es interno, a la nota de WordPress — el enlace real
 * a la cobertura del medio vive DENTRO del contenido de esa nota, no acá
 * (ver docs/GUIA-PUBLICAR.md).
 *
 * Convención editorial: la primera etiqueta (tag) de la nota es el nombre
 * del medio (ej. "Infobae"). Sin esa etiqueta, la fila igual se ve bien —
 * solo queda sin la columna del nombre del medio.
 */
export function MencionCard({ articulo }: { articulo: Articulo }) {
  const medio = articulo.tags[0]?.nombre

  return (
    <article className="flex flex-col sm:flex-row gap-2 sm:gap-6 sm:items-start py-[18px] border-b border-grey-100 last:border-b-0">
      {medio ? (
        <div className="sm:w-[170px] shrink-0 sm:pt-0.5">
          <div className="font-display font-extrabold text-body-sm text-navy-700 leading-tight">
            {medio}
          </div>
          <div className="text-caption text-grey-500 mt-1">
            {formatDate(articulo.fechaPublicacion)}
          </div>
        </div>
      ) : (
        <div className="sm:w-[170px] shrink-0 sm:pt-0.5">
          <div className="text-caption text-grey-500">
            {formatDate(articulo.fechaPublicacion)}
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-h4 text-ink leading-snug">
          <Link
            href={`/noticias/${articulo.slug}`}
            className="no-underline text-ink hover:text-navy-600 hover:underline"
          >
            {articulo.titulo}
          </Link>
        </h3>
        {articulo.extracto && (
          <p className="text-body-sm text-grey-600 mt-1 line-clamp-2">
            {articulo.extracto}
          </p>
        )}
      </div>
      <Link
        href={`/noticias/${articulo.slug}`}
        className="shrink-0 text-body-sm font-bold text-navy-600 no-underline hover:underline sm:pt-0.5 whitespace-nowrap"
      >
        Leer más →
      </Link>
    </article>
  )
}
