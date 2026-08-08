import Link from 'next/link'
import { HeartHandshake, BookOpen, FileBarChart2, Megaphone, ArrowUpRight } from 'lucide-react'

// Cierre de página, previo al CTA final hacia /necesito-ayuda (que no se
// toca). Contenido de docs/COPY-acompanamiento-guias.md §3: un agradecimiento
// genérico (sin nombres propios, sin depender de consentimientos que
// todavía no están confirmados) y los 4 enlaces relacionados reales del
// sitio. Es un cierre cálido, no un CTA — por eso el tratamiento tipográfico
// es discreto y el fondo se mantiene blanco/neutro, separado del bloque
// navy de contacto que sigue después.
const enlaces = [
  {
    href: '/necesito-ayuda',
    label: 'Necesito ayuda',
    description: 'Ayuda inmediata',
    Icon: HeartHandshake,
  },
  {
    href: '/recursos',
    label: 'Recursos',
    description: 'Documentos y guías',
    Icon: BookOpen,
  },
  {
    href: '/nosotros/transparencia',
    label: 'Transparencia',
    description: 'Memorias y balances',
    Icon: FileBarChart2,
  },
  {
    href: '/noticias/categoria/incidencia',
    label: 'Incidencia',
    description: 'Políticas públicas',
    Icon: Megaphone,
  },
]

export function SeguiExplorando() {
  return (
    <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <p className="font-display text-h4 text-grey-700 italic leading-relaxed max-w-[640px] mb-12">
          Esto es posible gracias al trabajo de las abogadas, psicólogas y voluntarias que
          integran el equipo de Acompañamiento, y de cada especialista que comparte su
          conocimiento con las familias.
        </p>

        <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-5">
          Seguí explorando
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {enlaces.map(({ href, label, description, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-3.5 p-5 bg-white border border-grey-200 rounded-xs no-underline hover:no-underline hover:border-navy-300 transition-colors duration-base ease-out"
            >
              <span className="shrink-0 w-9 h-9 rounded-xs bg-navy-50 text-navy-600 flex items-center justify-center">
                <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 font-display font-bold text-body text-ink">
                  {label}
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-grey-400 group-hover:text-navy-600 transition-colors duration-base ease-out"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <span className="block text-body-sm text-grey-700 mt-0.5">{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
