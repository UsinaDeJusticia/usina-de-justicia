import Link from 'next/link'
import Image from 'next/image'
import Form from 'next/form'
import { Facebook, Instagram, Search } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

// Portado de design-system/home/Footer.jsx (FooterUJ): logo + 4 columnas de
// navegación + barra legal/social. X (ex-Twitter) no tiene ícono outline en
// lucide-react — se usa un glifo SVG propio, igual que en el JSX de
// referencia, en vez de un ícono ajeno al set.
const socialLinks: Array<{
  key: keyof typeof siteConfig.social
  label: string
  Icon?: typeof Facebook
}> = [
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'twitter', label: 'X' },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'tiktok', label: 'TikTok' },
]

const footerColumns = [
  { title: 'Institución', links: siteConfig.footerNav.institucion },
  { title: 'Acompañamiento', links: siteConfig.footerNav.acompanamiento },
  { title: 'Observatorio', links: siteConfig.footerNav.observatorio },
  { title: 'Contacto', links: siteConfig.footerNav.contacto },
]

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-grey-200">
      <div className="max-w-content mx-auto px-4 md:px-10 py-12 md:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)] gap-10">
        <div>
          <Link href="/" className={cnFocus('inline-flex no-underline rounded-xs')}>
            <Image
              src="/images/logo_uj.png"
              alt={siteConfig.name}
              width={172}
              height={75}
              className="h-11 w-auto"
            />
          </Link>
          <p className="mt-3.5 text-body-sm text-grey-700 leading-relaxed max-w-[320px]">
            Asociación Civil por los derechos de las víctimas de homicidio y femicidio.
          </p>

          {/* Búsqueda desde el pie (pedido de Emanuel, ago-2026, tras el
              estreno del buscador): el pie está en todas las páginas, así
              que la búsqueda queda consultable desde cualquier sección.
              next/form navega a /buscar?q=... del lado del cliente y no
              necesita 'use client': el pie sigue siendo server component. */}
          <Form action="/buscar" className="mt-5 flex max-w-[320px]">
            <label htmlFor="footer-buscar" className="sr-only">
              Buscar en el sitio
            </label>
            <input
              id="footer-buscar"
              type="search"
              name="q"
              placeholder="Buscar en el sitio…"
              className={cnFocus(
                'w-full bg-white border border-grey-200 rounded-xs rounded-r-none border-r-0 px-3 py-2 text-body-sm text-ink placeholder:text-grey-500 transition-colors duration-base ease-out'
              )}
            />
            <button
              type="submit"
              aria-label="Buscar"
              className={cnFocus(
                'px-3 border border-grey-200 rounded-xs rounded-l-none bg-white text-navy-700 hover:text-navy-600 hover:border-navy-600 transition-colors duration-base ease-out'
              )}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>
          </Form>
        </div>

        {footerColumns.map((col) => (
          <div key={col.title}>
            <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-navy-700 mb-3.5">
              {col.title}
            </h2>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    {...('external' in link && link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className={cnFocus(
                      'text-body-sm text-grey-700 no-underline hover:text-navy-700 hover:underline hover:underline-offset-2 rounded-xs'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left text-caption text-grey-600">
            © {currentYear} Asociación Civil Usina de Justicia · CABA, Argentina
            <span className="hidden sm:inline"> · </span>
            <br className="sm:hidden" />
            <Link
              href="/legal/privacidad"
              className={cnFocus('text-grey-600 hover:text-navy-700 rounded-xs')}
            >
              Política de Privacidad
            </Link>{' '}
            ·{' '}
            <Link
              href="/legal/terminos"
              className={cnFocus('text-grey-600 hover:text-navy-700 rounded-xs')}
            >
              Términos de Uso
            </Link>{' '}
            ·{' '}
            <Link
              href="/en"
              lang="en"
              className={cnFocus('text-grey-600 hover:text-navy-700 rounded-xs')}
            >
              English
            </Link>
          </div>

          {/*
            Íconos agrandados y con más contraste en ago-2026. La Comisión
            pidió "agregar los logos de las redes sociales" — y ya estaban
            acá. Que tres personas los hayan pedido igual significa que no
            los vieron: 16 píxeles en gris claro, dentro de la barra legal
            del fondo. El pedido era real, solo que el problema no era de
            contenido sino de visibilidad.
          */}
          <div className="flex items-center gap-5 text-navy-700">
            {socialLinks.map(({ key, label, Icon }) => (
              <a
                key={key}
                href={siteConfig.social[key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Seguinos en ${label}`}
                title={label}
                className={cnFocus('hover:text-navy-700 no-underline rounded-xs transition-colors duration-base ease-out')}
              >
                {Icon ? (
                  <Icon className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
                ) : label === 'X' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18 3h3l-7.5 8.5L22 21h-6l-4.5-6-5 6H3l8-9.2L2 3h6l4 5.5L18 3z" />
                  </svg>
                ) : (
                  // TikTok tampoco tiene ícono outline en lucide-react.
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.6 3c.4 2 1.7 3.6 3.6 4.1v3c-1.3 0-2.5-.4-3.6-1.1v6.8a5.9 5.9 0 1 1-5-5.8v3.1a2.8 2.8 0 1 0 2 2.7V3h3z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function cnFocus(base: string) {
  return `${base} ${focusRing}`
}
