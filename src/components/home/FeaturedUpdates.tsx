import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { urlParaAncho } from '@/lib/imagenes'
import { getArticulos, getArticulosByTagSlug, getCategoryIdsBySection } from '@/lib/wordpress'
import type { Articulo } from '@/types'
import { EditorialCarousel } from './EditorialCarousel'

const argentinaDate = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'America/Argentina/Buenos_Aires',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

async function featuredArticles() {
  const [selected, recent] = await Promise.all([
    getArticulosByTagSlug('destacado-portada', { perPage: 12 }).then((result) => result.data).catch(() => []),
    getCategoryIdsBySection('en-los-medios')
      .catch(() => [])
      .then((categoriesExclude) => getArticulos({ perPage: 12, categoriesExclude }))
      .then((result) => result.data)
      .catch(() => []),
  ])
  const today = argentinaDate.format(new Date())
  const articles = new Map<string, Articulo>()
  for (const article of [...selected, ...recent]) {
    const expires = article.tags.some(({ slug }) => {
      const date = /^destacado-hasta-(\d{4}-\d{2}-\d{2})$/.exec(slug)?.[1]
      return date !== undefined && date < today
    })
    if (!expires && !articles.has(article.slug)) articles.set(article.slug, article)
    if (articles.size === 3) break
  }
  return [...articles.values()]
}

export async function FeaturedUpdates() {
  const articles = await featuredArticles()
  if (articles.length === 0) return null

  return (
    <section aria-labelledby="destacados-titulo" className="bg-ivory">
      <div className="mx-auto grid max-w-content gap-6 px-4 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 md:px-10 md:py-16">
        <div>
          <h2 id="destacados-titulo" className="m-0 font-display text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
            Novedades
          </h2>
          <Link href="/noticias" className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-navy-700 underline-offset-4">
            Ver todas las noticias <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <div className="min-w-0">
          <EditorialCarousel count={articles.length}>
            {articles.map((article) => {
              const image = article.imagenDestacada
              const src = image && urlParaAncho(image, 640)
              return (
                <li key={article.slug} className="w-full shrink-0 snap-start pr-1">
                  <article className="grid min-h-48 overflow-hidden rounded-xl border border-grey-200 bg-white sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                    {src && image ? (
                      <div className="relative aspect-[16/8] bg-navy-50 sm:aspect-auto">
                        <Image
                          src={src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 639px) 95vw, (max-width: 1023px) 36vw, 310px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className={src ? 'flex flex-col justify-center p-5 md:p-7' : 'flex flex-col justify-center p-5 sm:col-span-2 md:p-7'}>
                      <p className="mb-2 text-body-sm font-bold text-navy-700">{article.categoria.nombre}</p>
                      <h3 className="m-0 text-balance font-display text-xl font-extrabold leading-snug text-navy-900 md:text-2xl">
                        <Link href={`/noticias/${article.slug}`} className="text-inherit no-underline underline-offset-4 hover:underline">
                          {article.titulo}
                        </Link>
                      </h3>
                    </div>
                  </article>
                </li>
              )
            })}
          </EditorialCarousel>
        </div>
      </div>
    </section>
  )
}
