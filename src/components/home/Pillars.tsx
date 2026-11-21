import Link from 'next/link'
import { ArrowRight, BookOpen, Gavel, HeartHandshake } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

const details = [
  {
    Icon: HeartHandshake,
    description: 'Contención emocional y asesoramiento jurídico para familias de víctimas de homicidio y femicidio.',
  },
  {
    Icon: Gavel,
    description: 'Propuestas legislativas e intervenciones judiciales para defender los derechos de las víctimas.',
  },
  {
    Icon: BookOpen,
    description: 'Capacitación e investigación en victimología a través de nuestro instituto, IVUJUS.',
  },
]

export function Pillars() {
  return (
    <section id="pilares" aria-labelledby="ejes-titulo" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-content px-4 py-12 md:px-10 md:py-16">
        <h2 id="ejes-titulo" className="m-0 font-display text-3xl font-extrabold tracking-tight text-navy-900 md:text-4xl">
          Qué hacemos
        </h2>
        <ul className="m-0 mt-5 grid list-none gap-x-8 p-0 md:mt-7 md:grid-cols-3">
          {siteConfig.mainNav.map(({ href, label }, index) => {
            const { Icon, description } = details[index]
            return (
              <li key={href} className="border-t border-grey-200">
                <Link
                  href={href}
                  className="group grid h-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 px-1 py-5 text-navy-900 no-underline hover:text-navy-700 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600"
                >
                  <Icon size={21} className="mt-0.5" aria-hidden />
                  <h3 className="m-0 font-display text-lg font-extrabold leading-snug group-hover:underline group-hover:underline-offset-4">{label}</h3>
                  <ArrowRight size={18} className="mt-0.5" aria-hidden />
                  <p className="col-start-2 col-end-4 m-0 max-w-[36ch] text-body-sm leading-relaxed text-grey-700">
                    {description}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
