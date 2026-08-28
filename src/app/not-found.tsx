import type { Metadata } from 'next'
import Link from 'next/link'
import Form from 'next/form'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/lib/site-config'

// ============================================
// 404 propio.
//
// Next.js ya devolvía un 404 real (status HTTP correcto) sin este archivo,
// con su pantalla por defecto. Lo que agrega esta página es la parte de
// recuperación: a dónde ir cuando la URL no existe — importa para las URLs
// viejas de WordPress que no quedaron cubiertas por la tabla de redirects
// de next.config.ts, y para un agente que llegó a un link roto.
//
// La versión markdown de este mismo 404 (con el índice de secciones y el
// puntero al sitemap) la sirve /api/md cuando la request pide
// `Accept: text/markdown` — ver middleware.ts.
// ============================================

export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const destinos = [
    ...siteConfig.mainNav.filter((item) => !item.external),
    siteConfig.headerCta.help,
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
          Error 404
        </p>
        <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
          No encontramos esta página
        </h1>
        <p className="text-body-lg text-grey-700 max-w-narrow mb-8 leading-relaxed">
          Puede que el enlace esté roto o que la página haya cambiado de dirección.
          Si llegaste buscando ayuda urgente, entrá directamente a{' '}
          <Link
            href={siteConfig.headerCta.help.href}
            className="text-navy-600 font-bold hover:text-navy-700 transition-colors duration-base ease-out"
          >
            Necesito ayuda
          </Link>
          .
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Button href="/" variant="primary" size="lg">
            Volver al inicio
          </Button>
          <Button href="/contacto" variant="secondary" size="lg">
            Escribinos
          </Button>
        </div>

        {/* Quien cae acá suele venir de un link viejo a una nota concreta —
            la búsqueda ahí mismo es el camino más corto para recuperarla.
            next/form navega a /buscar?q=... sin volver esta página cliente. */}
        <div className="mb-14 max-w-narrow">
          <h2 className="font-display font-bold text-h3 text-ink mb-3">
            ¿Buscabas una nota?
          </h2>
          <Form action="/buscar" className="flex">
            <label htmlFor="notfound-buscar" className="sr-only">
              Buscar en el sitio
            </label>
            <input
              id="notfound-buscar"
              type="search"
              name="q"
              placeholder="Buscar noticias, informes y páginas…"
              className="w-full bg-white border border-grey-200 rounded-xs rounded-r-none border-r-0 px-4 py-3 text-body text-ink placeholder:text-grey-500 transition-colors duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="px-4 border border-grey-200 rounded-xs rounded-l-none bg-white text-navy-700 hover:text-navy-600 hover:border-navy-600 transition-colors duration-base ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
          </Form>
        </div>

        <div className="border-t border-grey-200 pt-8">
          <h2 className="font-display font-bold text-h3 text-ink mb-5">
            Secciones del sitio
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
            {destinos.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 rounded-xs border border-grey-200 text-body text-grey-700 hover:border-navy-600 hover:text-navy-600 transition-colors duration-base ease-out"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
