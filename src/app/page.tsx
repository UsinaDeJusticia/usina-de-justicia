import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart, Scale, Users, Megaphone, BookOpen, BarChart3 } from 'lucide-react'
import { getArticulos } from '@/lib/wordpress'
import { SITE_SECTIONS } from '@/types/wordpress'
import { ArticleCard } from '@/components/blog/ArticleCard'

export const metadata = generatePageMetadata({
  title: 'Asociación Civil por los derechos de las víctimas de homicidio y femicidio',
  description:
    'Usina de Justicia es una asociación civil que defiende los derechos de las víctimas de homicidio y femicidio en Argentina. Acompañamos familias, promovemos reformas legislativas y trabajamos por una justicia con perspectiva de víctima.',
  path: '/',
})

// Iconos para cada sección
const sectionIcons: Record<string, React.ReactNode> = {
  historias: <Heart className="w-6 h-6" />,
  medios: <Megaphone className="w-6 h-6" />,
  incidencia: <Scale className="w-6 h-6" />,
  actividades: <Users className="w-6 h-6" />,
  institucional: <BookOpen className="w-6 h-6" />,
  informativo: <BarChart3 className="w-6 h-6" />,
}

export default async function Home() {
  // Traer los 6 artículos más recientes desde WP
  let latestArticles: Awaited<ReturnType<typeof getArticulos>>['data'] = []
  try {
    const response = await getArticulos({ perPage: 6 })
    latestArticles = response.data
  } catch {
    // Si falla la API, la home sigue funcionando sin noticias
  }

  return (
    <>
      {/* ============================================ */}
      {/* HERO */}
      {/* ============================================ */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-linear-to-br from-primary-900 via-primary-800 to-primary-900" />
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />

        <div className="relative max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-primary-300 font-medium text-body-lg mb-4">
              Asociación Civil
            </p>
            <h1 className="text-display lg:text-[3.5rem] lg:leading-tight font-bold mb-6">
              Por los derechos de las víctimas de homicidio y femicidio
            </h1>
            <p className="text-xl text-primary-100 leading-relaxed mb-10 max-w-2xl">
              Acompañamos a las familias en su búsqueda de justicia, promovemos
              reformas legislativas y trabajamos para que cada víctima tenga voz
              en el sistema judicial argentino.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/sobre-nosotros"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                Conocé nuestra historia
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/donar"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Doná ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* QUÉ HACEMOS — Secciones del sitio */}
      {/* ============================================ */}
      <section className="py-section bg-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-h1 mb-4">Qué hacemos</h2>
            <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
              Trabajamos en múltiples frentes para defender los derechos de las
              víctimas y acompañar a sus familias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(SITE_SECTIONS).map(([key, section]) => (
              <Link
                key={key}
                href={`/blog/categoria/${key}`}
                className="group p-6 bg-white border border-neutral-200 rounded-xl hover:border-primary-500/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                  {sectionIcons[key]}
                </div>
                <h3 className="text-h4 text-neutral-900 group-hover:text-primary-500 transition-colors mb-2">
                  {section.title}
                </h3>
                <p className="text-body-sm text-neutral-600">
                  {section.description}
                </p>
                <span className="inline-flex items-center gap-1 text-body-sm font-medium text-primary-500 mt-4">
                  Ver más
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ÚLTIMAS NOTICIAS */}
      {/* ============================================ */}
      {latestArticles.length > 0 && (
        <section className="py-section bg-neutral-50">
          <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-h1 mb-2">Últimas noticias</h2>
                <p className="text-body-lg text-neutral-600">
                  Lo más reciente de nuestra actividad y cobertura mediática.
                </p>
              </div>
              <Link
                href="/blog"
                className="hidden md:inline-flex items-center gap-1 text-primary-500 font-medium hover:text-primary-600 transition-colors"
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Artículo destacado + 2 secundarios en desktop */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Artículo principal (el más reciente) */}
              {latestArticles[0] && (
                <article className="group bg-white rounded-xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-all">
                  <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                    {latestArticles[0].imagenDestacada ? (
                      <Image
                        src={latestArticles[0].imagenDestacada.url}
                        alt={latestArticles[0].imagenDestacada.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-500/5">
                        <span className="text-h1 text-primary-500/20 font-bold">UJ</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-500 text-body-sm font-medium">
                      {latestArticles[0].categoria.nombre}
                    </span>
                    <h3 className="text-h2 text-neutral-900 group-hover:text-primary-500 transition-colors mt-3 line-clamp-2">
                      <Link href={`/blog/${latestArticles[0].slug}`}>
                        {latestArticles[0].titulo}
                      </Link>
                    </h3>
                    <p className="text-body text-neutral-600 mt-2 line-clamp-3">
                      {latestArticles[0].extracto}
                    </p>
                  </div>
                </article>
              )}

              {/* 2 artículos secundarios */}
              <div className="flex flex-col gap-6">
                {latestArticles.slice(1, 3).map((articulo) => (
                  <ArticleCard key={articulo.id} articulo={articulo} />
                ))}
              </div>
            </div>

            {/* 3 artículos más en fila */}
            {latestArticles.length > 3 && (
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {latestArticles.slice(3, 6).map((articulo) => (
                  <ArticleCard key={articulo.id} articulo={articulo} />
                ))}
              </div>
            )}

            {/* Link mobile */}
            <div className="text-center mt-10 md:hidden">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-primary-500 font-medium"
              >
                Ver todas las noticias
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* NÚMEROS / IMPACTO */}
      {/* ============================================ */}
      <section className="py-section bg-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { number: '120+', label: 'Familias acompañadas' },
              { number: '400+', label: 'Apariciones en medios' },
              { number: '10+', label: 'Años de trabajo' },
              { number: '825+', label: 'Publicaciones' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-display text-primary-500 font-bold">
                  {stat.number}
                </p>
                <p className="text-body text-neutral-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA DONACIÓN */}
      {/* ============================================ */}
      <section className="py-section bg-primary-900 text-white">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-10 h-10 text-accent-400 mx-auto mb-6" />
          <h2 className="text-h1 mb-4">Tu aporte hace la diferencia</h2>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto mb-10">
            Con tu donación nos ayudás a seguir acompañando a las familias de
            víctimas de homicidio y femicidio en su camino hacia la justicia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/donar"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Doná ahora
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Contactanos
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
