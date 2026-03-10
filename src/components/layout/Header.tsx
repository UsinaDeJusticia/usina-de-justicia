'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Heart } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      {/* Top bar con email */}
      <div className="bg-primary-500 text-white text-body-sm">
        <div className="max-w-content mx-auto px-4 py-1.5 flex justify-between items-center">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="hover:text-accent-300 transition-colors"
          >
            {siteConfig.contact.email}
          </a>
          <div className="hidden sm:flex items-center gap-4">
            {Object.entries(siteConfig.social).map(([network, url]) => (
              <a
                key={network}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-300 transition-colors capitalize text-body-sm"
                aria-label={`Seguinos en ${network}`}
              >
                {network === 'twitter' ? 'X' : network.charAt(0).toUpperCase() + network.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="max-w-content mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt={siteConfig.name}
              width={180}
              height={50}
              className="h-10 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {siteConfig.mainNav.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-3 py-2 text-body-sm font-medium text-neutral-700 hover:text-primary-500 rounded-md hover:bg-neutral-50 transition-colors"
                    >
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-primary-500 transition-transform group-hover:rotate-180" />
                    </Link>

                    {/* Dropdown */}
                    <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-lg shadow-lg border border-neutral-200 py-2 min-w-[220px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-body-sm text-neutral-600 hover:text-primary-500 hover:bg-neutral-50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-body-sm font-medium text-neutral-700 hover:text-primary-500 rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* CTA Donar */}
            <Link
              href="/donar"
              className="ml-3 inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-5 py-2.5 rounded-lg text-body-sm font-semibold transition-colors"
            >
              <Heart className="w-4 h-4" />
              Doná
            </Link>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              href="/donar"
              className="inline-flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-body-sm font-semibold transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              Doná
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-neutral-700 hover:text-primary-500 transition-colors"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300',
            mobileOpen ? 'max-h-[80vh] pb-6' : 'max-h-0'
          )}
        >
          <div className="border-t border-neutral-200 pt-4 space-y-1">
            {siteConfig.mainNav.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="w-full flex items-center justify-between px-3 py-3 text-body font-medium text-neutral-700 hover:text-primary-500 rounded-md hover:bg-neutral-50 transition-colors"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-neutral-400 transition-transform',
                          openDropdown === item.label && 'rotate-180'
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-200',
                        openDropdown === item.label ? 'max-h-96' : 'max-h-0'
                      )}
                    >
                      <div className="pl-4 space-y-1 pb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2.5 text-body-sm text-neutral-600 hover:text-primary-500 rounded-md hover:bg-neutral-50 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-body font-medium text-neutral-700 hover:text-primary-500 rounded-md hover:bg-neutral-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Redes en mobile */}
            <div className="pt-4 px-3 border-t border-neutral-100">
              <p className="text-body-sm text-neutral-400 mb-3">Seguinos</p>
              <div className="flex items-center gap-4">
                {Object.entries(siteConfig.social).map(([network, url]) => (
                  <a
                    key={network}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-neutral-500 hover:text-primary-500 transition-colors capitalize"
                  >
                    {network === 'twitter' ? 'X' : network.charAt(0).toUpperCase() + network.slice(1)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}