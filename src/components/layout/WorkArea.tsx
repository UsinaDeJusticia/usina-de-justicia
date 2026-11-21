import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Breadcrumbs } from './Breadcrumbs'

interface WorkAreaProps {
  title: string
  path: string
  description: string
  links: ReadonlyArray<{ label: string; href: string; description: string }>
}

export function WorkArea({ title, path, description, links }: WorkAreaProps) {
  return (
    <div className="mx-auto max-w-content px-4 pb-16 md:px-10 md:pb-24">
      <Breadcrumbs items={[{ label: title, href: path }]} />
      <div className="border-b border-grey-200 pb-8 pt-7 md:pb-12 md:pt-12">
        <h1 className="m-0 text-balance font-display text-[clamp(2.4rem,5vw,4.25rem)] font-extrabold leading-tight tracking-tight text-navy-900">{title}</h1>
        <p className="mb-0 mt-4 max-w-[65ch] text-body-lg leading-relaxed text-grey-700">{description}</p>
      </div>
      <ul className="m-0 grid list-none gap-x-8 p-0 md:grid-cols-2">
        {links.map((link) => (
          <li key={link.href} className="border-b border-grey-200">
            <Link href={link.href} className="group block px-1 py-5 text-navy-900 no-underline hover:text-navy-700 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600">
              <h2 className="m-0 flex items-center gap-2 font-display text-xl font-extrabold group-hover:underline group-hover:underline-offset-4">
                {link.label} <ArrowRight size={17} className="shrink-0" aria-hidden />
              </h2>
              <p className="mb-0 mt-2 max-w-[48ch] text-body leading-relaxed text-grey-700">{link.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
