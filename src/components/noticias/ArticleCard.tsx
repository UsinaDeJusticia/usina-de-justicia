import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Articulo } from '@/types'

interface ArticleCardProps {
  articulo: Articulo
}

export function ArticleCard({ articulo }: ArticleCardProps) {
  return (
    <article className="group bg-white border border-grey-200 rounded-xs overflow-hidden hover:shadow-md transition-shadow duration-base ease-out">
      <Link href={`/noticias/${articulo.slug}`} className="block" tabIndex={-1}>
        <div className="aspect-video bg-navy-50 relative overflow-hidden">
          {articulo.imagenDestacada ? (
            <Image
              src={articulo.imagenDestacada.url}
              alt={articulo.imagenDestacada.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-slow ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-h1 text-navy-200 font-extrabold">UJ</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Badge tone="navy">{articulo.categoria.nombre}</Badge>
          <span className="flex items-center gap-1 text-caption text-grey-500">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {formatDate(articulo.fechaPublicacion)}
          </span>
        </div>
        <h3 className="font-display font-bold text-h4 text-ink group-hover:text-navy-600 transition-colors duration-base ease-out line-clamp-2">
          <Link href={`/noticias/${articulo.slug}`} className="no-underline hover:no-underline text-ink hover:text-navy-600">
            {articulo.titulo}
          </Link>
        </h3>
        <p className="text-body-sm text-grey-700 mt-2 line-clamp-3">
          {articulo.extracto}
        </p>
        <Link
          href={`/noticias/${articulo.slug}`}
          className="inline-flex items-center gap-1 text-body-sm font-bold text-navy-600 no-underline hover:underline mt-4"
        >
          Leer más
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-base ease-out" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
