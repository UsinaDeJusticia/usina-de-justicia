'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2'

interface AxisNavigationProps {
  mode: 'desktop' | 'mobile'
  onNavigate: () => void
}

interface Disclosure {
  href: string
  openedBy: 'hover' | 'button'
}

export function AxisNavigation({ mode, onNavigate }: AxisNavigationProps) {
  const pathname = usePathname()
  const nav = useRef<HTMLUListElement>(null)
  const [disclosure, setDisclosure] = useState<Disclosure | null>(null)
  const desktop = mode === 'desktop'

  useEffect(() => {
    if (!desktop || !disclosure) return

    function closeWhenOutside(event: PointerEvent) {
      if (event.target instanceof Node && !nav.current?.contains(event.target)) {
        setDisclosure(null)
      }
    }

    function dismissHover(event: KeyboardEvent) {
      if (event.key === 'Escape' && !nav.current?.contains(document.activeElement)) {
        setDisclosure(null)
      }
    }

    const layout = window.matchMedia('(min-width: 64rem)')
    const close = () => setDisclosure(null)
    document.addEventListener('pointerdown', closeWhenOutside)
    document.addEventListener('keydown', dismissHover)
    layout.addEventListener('change', close)
    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside)
      document.removeEventListener('keydown', dismissHover)
      layout.removeEventListener('change', close)
    }
  }, [desktop, disclosure])

  function navigate() {
    setDisclosure(null)
    onNavigate()
  }

  return (
    <ul
      ref={nav}
      className={cn('m-0 flex list-none p-0', desktop ? 'items-center gap-1 xl:gap-4' : 'flex-col divide-y divide-grey-200')}
    >
      {siteConfig.mainNav.map(({ href, label, children }, index) => {
        const current = pathname === href
        const childIsCurrent = children.some((item) => item.href === pathname)
        const open = disclosure?.href === href
        const subnavId = `${mode}-axis-${index}`

        return (
          <li
            key={href}
            className={cn(desktop && 'relative')}
            onPointerEnter={(event) => {
              if (!desktop || event.pointerType !== 'mouse') return
              const focusedSubnav = document.activeElement?.closest('[data-axis-subnav]')
              if (focusedSubnav && nav.current?.contains(focusedSubnav)) return

              setDisclosure((currentDisclosure) =>
                currentDisclosure?.href === href ? currentDisclosure : { href, openedBy: 'hover' }
              )
            }}
            onPointerLeave={(event) => {
              if (!desktop || event.pointerType !== 'mouse') return
              if (event.currentTarget.contains(document.activeElement)) return

              setDisclosure((currentDisclosure) =>
                currentDisclosure?.href === href && currentDisclosure.openedBy === 'hover' ? null : currentDisclosure
              )
            }}
            onBlur={(event) => {
              if (event.currentTarget.contains(event.relatedTarget)) return
              setDisclosure((currentDisclosure) => currentDisclosure?.href === href ? null : currentDisclosure)
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Escape' || !open) return
              event.preventDefault()
              event.stopPropagation()
              setDisclosure(null)
              event.currentTarget.querySelector('button')?.focus()
            }}
          >
            <div className={cn('flex items-center', !desktop && 'justify-between')}>
              <Link
                href={href}
                onClick={navigate}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'rounded-xs py-2.5 pl-2 font-bold no-underline hover:text-navy-600 hover:no-underline',
                  desktop ? 'whitespace-nowrap' : 'min-w-0 flex-1 pr-2',
                  current || childIsCurrent ? 'text-navy-700 underline underline-offset-4' : 'text-ink',
                  focusRing
                )}
              >
                {label}
              </Link>
              <button
                type="button"
                aria-label={`Opciones de ${label}`}
                aria-expanded={open}
                aria-controls={subnavId}
                className={cn(
                  'grid h-11 shrink-0 place-items-center rounded-xs text-navy-700 hover:bg-navy-50',
                  desktop ? 'w-8' : 'w-11',
                  focusRing
                )}
                onClick={() => setDisclosure((currentDisclosure) =>
                  currentDisclosure?.href === href && currentDisclosure.openedBy === 'button'
                    ? null
                    : { href, openedBy: 'button' }
                )}
              >
                <ChevronDown size={17} aria-hidden className={cn(open && 'rotate-180')} />
              </button>
            </div>
            <div
              id={subnavId}
              data-axis-subnav
              hidden={!open}
              className={cn(desktop ? 'absolute left-0 top-full z-10 w-72 pt-1' : 'pb-2 pl-2')}
            >
              <ul className={cn(
                'm-0 list-none text-body-sm',
                desktop
                  ? 'rounded-xl border border-grey-200 bg-white p-2'
                  : 'border-l border-grey-200 py-0 pl-2 pr-0'
              )}>
                {children.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={navigate}
                      aria-current={item.href === pathname ? 'page' : undefined}
                      className={cn(
                        'flex min-h-11 items-center rounded-xs px-3 py-2 font-semibold leading-snug text-navy-800 no-underline hover:bg-navy-50 hover:no-underline',
                        focusRing
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
