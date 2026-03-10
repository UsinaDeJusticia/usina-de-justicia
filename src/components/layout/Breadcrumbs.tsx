import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import type { BreadcrumbItem } from '@/types'

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://www.usinadejusticia.org.ar',
      },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        item: `https://www.usinadejusticia.org.ar${item.href}`,
      })),
    ],
  }

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex items-center flex-wrap gap-1 text-body-sm text-neutral-500">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-primary-500 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
              {isLast ? (
                <span className="text-neutral-800 font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary-500 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}