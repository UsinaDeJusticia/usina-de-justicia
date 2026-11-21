'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Form from 'next/form'
import { Menu, Search, X } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { AxisNavigation } from './AxisNavigation'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2'

export function Header() {
  const [panel, setPanel] = useState<'menu' | 'search' | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const searchButton = useRef<HTMLButtonElement>(null)
  const mobileSearch = useRef<HTMLInputElement>(null)
  const desktopSearch = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const layout = window.matchMedia('(min-width: 64rem)')
    const closePanel = () => setPanel(null)
    layout.addEventListener('change', closePanel)
    return () => layout.removeEventListener('change', closePanel)
  }, [])

  useEffect(() => {
    if (panel === 'search') desktopSearch.current?.focus()
  }, [panel])

  function closePanel() {
    setPanel(null)
  }

  function searchForm(id: string, inputRef: React.RefObject<HTMLInputElement | null>) {
    return (
      <Form action="/buscar" onSubmit={closePanel} className="flex min-w-0 gap-2">
        <label htmlFor={id} className="sr-only">Buscar en el sitio</label>
        <input
          ref={inputRef}
          id={id}
          name="q"
          type="search"
          required
          placeholder="Buscar en el sitio"
          className={cn('min-w-0 flex-1 rounded-xs border border-grey-200 bg-white px-3 py-2 text-ink', focusRing)}
        />
        <Button type="submit" size="sm">Buscar</Button>
      </Form>
    )
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-grey-200 bg-white"
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !panel) return
        const trigger = panel === 'menu' ? menuButton : searchButton
        closePanel()
        trigger.current?.focus()
      }}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-2 px-4 md:h-[72px] md:px-10">
        <Link href="/" onClick={closePanel} className={cn('inline-flex shrink-0 rounded-xs', focusRing)}>
          <Image
            src="/images/logo_uj.png"
            alt={siteConfig.name}
            width={172}
            height={75}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>

        <nav aria-label="Principal" className="hidden text-body-sm lg:block">
          <AxisNavigation mode="desktop" onNavigate={closePanel} />
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            ref={searchButton}
            type="button"
            aria-label={panel === 'search' ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
            aria-expanded={panel === 'search'}
            aria-controls="site-search"
            onClick={() => setPanel(panel === 'search' ? null : 'search')}
            className={cn('hidden size-11 place-items-center rounded-xs text-ink hover:text-navy-600 lg:grid', focusRing)}
          >
            {panel === 'search' ? <X size={20} aria-hidden /> : <Search size={20} aria-hidden />}
          </button>
          <Link
            href={siteConfig.headerCta.donate.href}
            className={cn('hidden rounded-xs px-2 py-2 text-body-sm font-bold text-navy-700 no-underline hover:underline lg:inline-flex', focusRing)}
          >
            {siteConfig.headerCta.donate.label}
          </Link>
          <Link
            href={siteConfig.headerCta.help.href}
            onClick={closePanel}
            className={cn('inline-flex min-h-11 items-center whitespace-nowrap rounded-xs bg-navy-700 px-3 text-sm font-bold text-white no-underline hover:bg-navy-900 hover:text-white hover:no-underline', focusRing)}
          >
            {siteConfig.headerCta.help.label}
          </Link>
          <button
            ref={menuButton}
            type="button"
            aria-label={panel === 'menu' ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={panel === 'menu'}
            aria-controls="mobile-nav"
            onClick={() => setPanel(panel === 'menu' ? null : 'menu')}
            className={cn('grid size-11 place-items-center rounded-xs text-ink hover:text-navy-600 lg:hidden', focusRing)}
          >
            {panel === 'menu' ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>
      </div>

      <div id="site-search" hidden={panel !== 'search'}>
        <div className="mx-auto max-w-content border-t border-grey-200 px-4 py-3 md:px-10">
          {searchForm('header-buscar', desktopSearch)}
        </div>
      </div>

      <div id="mobile-nav" hidden={panel !== 'menu'}>
        <div className="max-h-[70dvh] overflow-y-auto border-t border-grey-200 px-4 pb-5 pt-3 md:px-10 lg:hidden">
          <nav aria-label="Principal" className="flex flex-col">
            {panel === 'menu' && <AxisNavigation mode="mobile" onNavigate={closePanel} />}
            <Link
              href={siteConfig.headerCta.donate.href}
              onClick={closePanel}
              className={cn('rounded-xs px-2 py-2 font-bold text-navy-700 no-underline hover:underline', focusRing)}
            >
              {siteConfig.headerCta.donate.label}
            </Link>
          </nav>
          <div className="mt-3 border-t border-grey-200 pt-4">
            {searchForm('menu-buscar', mobileSearch)}
          </div>
        </div>
      </div>
    </header>
  )
}
