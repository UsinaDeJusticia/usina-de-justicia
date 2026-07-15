import Link from 'next/link'
import { FileText, ArrowUpRight } from 'lucide-react'

// Portado de design-system/home/Observatorio.jsx.
const bars = [
  { key: 'CABA', value: 82 },
  { key: 'Bs. As.', value: 100 },
  { key: 'Santa Fe', value: 64 },
  { key: 'Córdoba', value: 52 },
  { key: 'Tucumán', value: 38 },
  { key: 'Salta', value: 31 },
  { key: 'Mendoza', value: 28 },
  { key: 'Otras', value: 46 },
]
const MAX = 100

const links = [
  { title: 'Informe anual 2025', meta: 'PDF · 82 páginas', href: '/recursos' },
  { title: 'Amicus curiae presentados', meta: '14 · 2 admitidos en 2026', href: '/noticias/categoria/incidencia' },
  { title: 'Base pública de sentencias', meta: '1.204 resoluciones indexadas', href: '/recursos' },
]

export function Observatorio() {
  return (
    <section id="observatorio" className="py-20 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-content mx-auto px-4 md:px-10 grid lg:grid-cols-[1fr_1.3fr] gap-14 items-center">
        <div>
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
            Observatorio de víctimas
          </p>
          <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] mt-2.5 mb-4">
            Sin datos no hay política pública.
          </h2>
          <p className="text-body text-grey-700 leading-[1.7]">
            Relevamos, analizamos y publicamos información sobre homicidios, femicidios
            y el funcionamiento del sistema penal en las 24 jurisdicciones. Lo hacemos
            junto a las cámaras de Diputados de Santa Fe y la Ciudad de Buenos Aires.
          </p>
          <div className="flex flex-col gap-2.5 mt-6">
            {links.map((l) => (
              <Link
                key={l.title}
                href={l.href}
                className="flex items-center gap-3.5 py-3.5 px-1 border-b border-grey-200 no-underline text-ink hover:bg-navy-50 transition-colors duration-base ease-out"
              >
                <FileText className="w-[18px] h-[18px] text-navy-600 shrink-0" aria-hidden="true" />
                <span className="flex-1">
                  <span className="block font-bold text-body-sm">{l.title}</span>
                  <span className="block text-caption text-grey-600">{l.meta}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-grey-600 shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-navy-50 border border-navy-100 p-8 rounded-xs">
          <p className="text-caption font-bold tracking-[0.12em] uppercase text-navy-700">
            Homicidios dolosos por jurisdicción · 2025
          </p>
          <div
            className="grid gap-3 items-end h-[200px] mt-7"
            style={{ gridTemplateColumns: `repeat(${bars.length}, 1fr)` }}
          >
            {bars.map((b) => (
              <div key={b.key} className="flex flex-col items-center gap-2">
                <div className="text-[11px] font-bold text-navy-700">{b.value}</div>
                <div
                  className="w-full bg-navy-600 rounded-t-[2px]"
                  style={{ height: `${(b.value / MAX) * 160}px` }}
                />
                <div className="text-[11px] text-grey-700 text-center">{b.key}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-grey-600 mt-5 border-t border-navy-100 pt-3.5">
            Fuente: relevamiento propio UJ + Ministerio de Seguridad. Tasas cada 100.000
            habitantes.
          </p>
        </div>
      </div>
    </section>
  )
}
