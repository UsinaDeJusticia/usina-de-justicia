import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Articulo } from '@/types'

interface ArticleCardProps {
  articulo: Articulo
}

export function ArticleCard({ articulo }: ArticleCardProps) {
  return (
    <article className="group bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-video bg-neutral-100 relative overflow-hidden">
        {articulo.imagenDestacada ? (
          <Image
            src={articulo.imagenDestacada.url}
            alt={articulo.imagenDestacada.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-500/5">
            <span className="text-h2 text-primary-500/20 font-bold">UJ</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500 text-body-sm font-medium">
            {articulo.categoria.nombre}
          </span>
          <span className="flex items-center gap-1 text-body-sm text-neutral-400">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(articulo.fechaPublicacion)}
          </span>
        </div>
        <h2 className="text-h4 text-neutral-900 group-hover:text-primary-500 transition-colors line-clamp-2">
          <Link href={`/blog/${articulo.slug}`}>{articulo.titulo}</Link>
        </h2>
        <p className="text-body-sm text-neutral-600 mt-2 line-clamp-3">
          {articulo.extracto}
        </p>
        <Link
          href={`/blog/${articulo.slug}`}
          className="inline-flex items-center gap-1 text-body-sm font-medium text-primary-500 mt-4"
        >
          Leer más
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  )
}
