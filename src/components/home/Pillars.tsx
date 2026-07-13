import Link from 'next/link'
import { HeartHandshake, Gavel, BookOpen, ArrowRight } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

// Portado de design-system/home/Pillars.jsx.
const pillars = [
  {
    Icon: HeartHandshake,
    title: 'Acompañamiento a las víctimas',
    description:
      'Contención emocional y asesoramiento jurídico para familiares de víctimas de homicidio y femicidio.',
    label: 'Conocer el programa',
    href: '/programas/asistencia-a-victimas',
  },
  {
    Icon: Gavel,
    title: 'Incidencia en políticas públicas',
    description:
      'Amicus curiae, proyectos de ley y participación activa en la aplicación de la Ley 27.372.',
    label: 'Ver incidencia',
    href: '/programas/reformas-legislativas',
  },
  {
    Icon: BookOpen,
    title: 'Capacitación e investigación',
    description:
      'A través de IVUJUS, el único curso de Victimología Penal del país y formación a magistrados.',
    label: 'Ir a IVUJUS',
    href: siteConfig.externalLinks.ivujus,
  },
]

export function Pillars() {
  return (
    <section className="py-20 md:py-24 bg-navy-50 border-t border-b border-grey-200">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="mb-11 flex flex-wrap items-end justify-between gap-10">
          <div className="max-w-[600px]">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
              Nuestros tres pilares
            </p>
            <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] mt-2.5">
              Acompañar, incidir, formar.
            </h2>
          </div>
          <p className="text-body text-grey-700 max-w-[420px] leading-relaxed">
            Tres líneas de trabajo que se sostienen entre sí: la asistencia directa
            alimenta el diagnóstico, el diagnóstico alimenta la política pública, y la
            formación garantiza el cambio en el tiempo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {pillars.map(({ Icon, title, description, label, href }) => {
            const external = href.startsWith('http')
            return (
              <Link
                key={title}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex flex-col bg-white border border-grey-200 rounded-xs px-7 pt-8 pb-7 no-underline text-inherit transition-[box-shadow,transform] duration-base ease-out hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2"
              >
                <Icon className="w-7 h-7 text-navy-600" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="font-display font-bold text-navy-800 text-xl mt-5 mb-2.5">{title}</h3>
                <p className="text-body-sm text-grey-700 leading-relaxed mb-5 flex-1">{description}</p>
                <span className="inline-flex items-center gap-1.5 text-body-sm font-bold text-navy-600">
                  {label}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
