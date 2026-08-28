'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Form from 'next/form'
import { Menu, Search, X } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// Portado de design-system/home/Header.jsx (HeaderUJ).
// Un único renglón: logo + nav + 2 CTAs. El header viejo tenía además una
// barra superior con email/redes — el diseño nuevo la elimina (esa info
// vive en el Footer) para mantener el header liviano y sticky.
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // La barra de búsqueda vive siempre en el DOM (mismo patrón de transición
  // que el nav mobile), así que autoFocus no sirve: el foco se da al abrir.
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cerrar el menú mobile al navegar a un hash/página nueva.
  useEffect(() => {
    if (!mobileOpen) return
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mobileOpen])

  const focusRing =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

  // Abrir la barra es el aviso más temprano de que alguien está por buscar:
  // este ping hace que el servidor construya/refresque el índice mientras la
  // persona todavía está tipeando (el endpoint responde al ping al instante
  // y trabaja después — ver /api/buscar). Fire-and-forget a propósito.
  const abrirBusqueda = () => {
    // El ping va FUERA del updater de estado (los updaters deben ser puros;
    // React puede invocarlos dos veces en modo estricto).
    if (!searchOpen) fetch('/api/buscar?q=', { cache: 'no-store' }).catch(() => {})
    setSearchOpen((v) => !v)
    setMobileOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-colors duration-base ease-out',
        scrolled ? 'border-b border-grey-200' : 'border-b border-transparent'
      )}
    >
      <div className="max-w-content mx-auto px-4 md:px-10 flex items-center justify-between h-16 md:h-[72px] gap-5">
        <Link
          href="/"
          className={cn('shrink-0 inline-flex items-center no-underline rounded-xs', focusRing)}
        >
          <Image
            src="/images/logo_uj.png"
            alt={siteConfig.name}
            width={172}
            height={75}
            priority
            className="h-9 md:h-[42px] w-auto"
          />
        </Link>

        {/* Nav desktop */}
        <nav aria-label="Principal" className="hidden lg:flex items-center gap-7">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              {...('external' in item && item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className={cn(
                'text-body-sm font-bold text-ink no-underline hover:text-navy-600 hover:no-underline transition-colors duration-base ease-out rounded-xs',
                focusRing
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTAs desktop */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {/* Buscador: despliega una barra debajo del header (mismo patrón
              de panel que el nav mobile — sin modal a propósito, el repo no
              tiene primitivas de modal). El pedido de Emanuel (ago-2026) fue
              que la búsqueda sea consultable desde cualquier sección sin
              tener que descubrir la página /buscar. */}
          <button
            type="button"
            onClick={abrirBusqueda}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            aria-label={searchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
            className={cn(
              'p-2 text-ink hover:text-navy-600 transition-colors duration-base ease-out rounded-xs',
              focusRing
            )}
          >
            {searchOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Search className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          <Button href={siteConfig.headerCta.help.href} variant="secondary" size="sm">
            {siteConfig.headerCta.help.label}
          </Button>
          <Button href={siteConfig.headerCta.donate.href} variant="primary" size="sm">
            {siteConfig.headerCta.donate.label}
          </Button>
        </div>

        {/* Mobile: lupa + CTA donar + hamburguesa */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={abrirBusqueda}
            aria-expanded={searchOpen}
            aria-controls="site-search"
            aria-label={searchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
            className={cn(
              'p-2 text-ink hover:text-navy-600 transition-colors duration-base ease-out rounded-xs',
              focusRing
            )}
          >
            {searchOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Search className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
          <Button href={siteConfig.headerCta.donate.href} variant="primary" size="sm">
            {siteConfig.headerCta.donate.label}
          </Button>
          <button
            type="button"
            onClick={() => {
              setMobileOpen((v) => !v)
              setSearchOpen(false)
            }}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className={cn(
              'p-2 -mr-2 text-ink hover:text-navy-600 transition-colors duration-base ease-out rounded-xs',
              focusRing
            )}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Barra de búsqueda desplegable (desktop y mobile). El submit navega
          a /buscar?q=... con next/form; la página hace la búsqueda en vivo. */}
      <div
        id="site-search"
        className={cn(
          'overflow-hidden border-t border-grey-200 transition-[max-height] duration-base ease-out',
          searchOpen ? 'max-h-24' : 'max-h-0 border-t-0'
        )}
      >
        <Form
          action="/buscar"
          onSubmit={() => setSearchOpen(false)}
          className="max-w-content mx-auto px-4 md:px-10 py-3 flex gap-2"
        >
          <label htmlFor="header-buscar" className="sr-only">
            Buscar en el sitio
          </label>
          <input
            ref={searchInputRef}
            id="header-buscar"
            type="search"
            name="q"
            placeholder="Buscar noticias, informes y páginas…"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setSearchOpen(false)
            }}
            className={cn(
              'w-full bg-white border border-grey-200 rounded-xs px-4 py-2 text-body text-ink placeholder:text-grey-500 transition-colors duration-base ease-out',
              focusRing
            )}
          />
          <Button type="submit" variant="primary" size="sm">
            Buscar
          </Button>
        </Form>
      </div>

      {/* Nav mobile */}
      <div
        id="mobile-nav"
        className={cn(
          'lg:hidden overflow-hidden border-t border-grey-200 transition-[max-height] duration-base ease-out',
          mobileOpen ? 'max-h-[70vh]' : 'max-h-0 border-t-0'
        )}
      >
        <nav aria-label="Principal" className="max-w-content mx-auto px-4 py-4 flex flex-col gap-1">
          {siteConfig.mainNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              {...('external' in item && item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className={cn(
                'px-2 py-2.5 text-body font-bold text-ink no-underline hover:text-navy-600 hover:no-underline hover:bg-navy-50 rounded-xs transition-colors duration-base ease-out',
                focusRing
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={siteConfig.headerCta.help.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'mt-3 px-2 py-2.5 text-body-sm font-bold text-navy-600 no-underline hover:no-underline rounded-xs',
              focusRing
            )}
          >
            {siteConfig.headerCta.help.label}
          </Link>
        </nav>
      </div>
    </header>
  )
}
