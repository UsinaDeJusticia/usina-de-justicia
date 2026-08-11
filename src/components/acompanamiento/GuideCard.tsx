import type { ComponentType } from 'react'
import {
  ChevronDown,
  Calendar,
  Contact,
  Landmark,
  Lock,
  MapPin,
  Scale,
  CalendarClock,
  ClipboardCheck,
  Siren,
  TimerOff,
  BellRing,
} from 'lucide-react'
import type { Guia } from '@/types'
import { Badge } from '@/components/ui/Badge'

// GuideCard — pensado para una serie que va a crecer (hoy renderiza una sola
// guía). Todo el copy sale de `guias-data.ts` (a su vez trazado a
// docs/COPY-acompanamiento-guias.md); este componente sólo estructura y
// da forma visual, no agrega texto nuevo.
//
// Dinámica elegida para responder al feedback de Emanuel ("corto de
// contenido", "espero una dinámica mejor"):
// - Layout de dos columnas en desktop: contenido principal + índice rápido
//   con anchors, igual al patrón "TOC lateral" de una guía real.
// - Las 10 acciones ya no son una lista corrida: cada una es una tarjeta con
//   un ícono coherente con su contenido (candado para resguardo de datos,
//   balanza para oponerse formalmente, sirena para denunciar, etc.), en
//   grilla con aire.
// - La FAQ reutiliza el patrón exacto de `necesito-ayuda/FAQ.tsx`
//   (`<details>/<summary>` + ChevronDown animado).
// - El byline de autoría sigue el mismo lenguaje visual que
//   `/nosotros/equipo` (avatar con iniciales) y que la meta de
//   `/noticias/[slug]` (íconos + texto), sin convertir la nota de "foto
//   pendiente" en una advertencia grande.
type IconType = ComponentType<{
  className?: string
  strokeWidth?: number
  'aria-hidden'?: boolean | 'true' | 'false'
}>

const iconosAcciones: Record<string, IconType> = {
  'datos-contacto': Contact,
  'presentacion-juzgado': Landmark,
  'resguardo-datos': Lock,
  'cambios-alojamiento': MapPin,
  'oponerse-formalmente': Scale,
  'pedir-audiencia': CalendarClock,
  supervisiones: ClipboardCheck,
  'denunciar-incumplimiento': Siren,
  'tiempo-no-se-descuenta': TimerOff,
  'patrocinio-letrado': BellRing,
}

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function GuideCard({ guia }: { guia: Guia }) {
  const anchorId = (base: string) => `${guia.slug}-${base}`

  const indice = [
    ...guia.secciones.map((s) => ({ id: anchorId(s.id), label: s.titulo })),
    { id: anchorId('derechos'), label: 'Tus derechos, paso a paso' },
    { id: anchorId('faq'), label: 'Preguntas frecuentes' },
  ]

  return (
    <article className="bg-white border border-grey-200">
      {/* Encabezado de la guía */}
      <div className="px-6 md:px-10 pt-9 md:pt-12 pb-8 border-b border-grey-200">
        <Badge tone="solid" className="mb-4">
          Guía {String(guia.numeroSerie).padStart(2, '0')} de la serie
        </Badge>
        <h3 className="font-display font-extrabold text-ink text-[clamp(1.5rem,2.6vw,2.125rem)] leading-tight mb-4 max-w-[820px]">
          {guia.titulo}
        </h3>
        <p className="text-body-lg text-grey-700 leading-relaxed max-w-[720px] m-0">{guia.bajada}</p>

        {/* Byline de autoría */}
        <div className="flex items-start gap-3.5 mt-7">
          <div
            className="shrink-0 w-11 h-11 rounded-full bg-navy-50 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="font-display font-bold text-body text-navy-600">
              {iniciales(guia.autor.nombre)}
            </span>
          </div>
          <div>
            <p className="font-display font-bold text-body text-ink m-0">{guia.autor.nombre}</p>
            <p className="text-body-sm text-grey-700 m-0">{guia.autor.credencial}</p>
            <p className="flex items-center gap-1.5 text-body-sm text-grey-500 mt-1 mb-0">
              <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span>{guia.autor.contexto}</span>
            </p>
            {!guia.autor.fotoConfirmada && (
              <p className="text-[12px] text-grey-500 italic mt-1 mb-0">
                Foto y biografía pendientes de confirmar.
              </p>
            )}
          </div>
        </div>

        {/* Índice rápido — versión compacta para mobile/tablet (el lg:hidden
            complementa al <aside> sticky que aparece más abajo en desktop) */}
        <nav aria-label={`Índice de la guía: ${guia.titulo}`} className="lg:hidden mt-7 -mx-1 overflow-x-auto">
          <ul className="flex gap-2 px-1 list-none m-0 p-0 min-w-max">
            {indice.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex whitespace-nowrap rounded-pill border border-grey-200 bg-ivory px-3.5 py-1.5 text-body-sm font-bold text-navy-600 no-underline hover:bg-navy-50 hover:no-underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-0">
        {/* Contenido principal */}
        <div className="px-6 md:px-10 py-10 md:py-12 lg:border-r lg:border-grey-200">
          {guia.secciones.map((seccion) => (
            <section key={seccion.id} id={anchorId(seccion.id)} className="mb-12 scroll-mt-24 last:mb-0">
              <h4 className="font-display font-bold text-h3 text-ink mb-4">{seccion.titulo}</h4>
              <div className="space-y-4 max-w-[680px]">
                {seccion.parrafos.map((p, i) => (
                  <p key={i} className="text-body text-grey-700 leading-relaxed m-0">
                    {p}
                  </p>
                ))}
              </div>

              {seccion.listas && (
                <div className="grid sm:grid-cols-2 gap-5 mt-6 max-w-[680px]">
                  {seccion.listas.map((lista) => (
                    <div key={lista.titulo} className="p-5 bg-ivory border border-grey-200 rounded-xs">
                      <p className="font-display font-bold text-body-sm text-navy-600 uppercase tracking-[0.04em] mb-3">
                        {lista.titulo}
                      </p>
                      <ul className="space-y-2.5 list-none p-0 m-0">
                        {lista.items.map((item) => (
                          <li key={item} className="text-body-sm text-grey-700 leading-relaxed pl-3.5 border-l-2 border-grey-300">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {seccion.notaFinal && (
                <p className="text-body-sm text-grey-700 leading-relaxed mt-6 max-w-[680px] border-l-4 border-warning bg-warning-bg/40 pl-4 py-3">
                  {seccion.notaFinal}
                </p>
              )}
            </section>
          ))}

          {/* Tus derechos, paso a paso — grilla de tarjetas con ícono, no
              lista corrida de 10 párrafos */}
          <section id={anchorId('derechos')} className="scroll-mt-24">
            <h4 className="font-display font-bold text-h3 text-ink mb-2">Tus derechos, paso a paso</h4>
            <p className="text-body-sm text-grey-700 mb-6 max-w-[680px]">
              Diez acciones concretas que podés tomar durante esta etapa.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {guia.acciones.map((accion, i) => {
                const Icon = iconosAcciones[accion.id]
                return (
                  <div
                    key={accion.id}
                    className="flex gap-4 p-5 bg-white border border-grey-200 rounded-xs"
                  >
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <span className="w-10 h-10 rounded-xs bg-navy-50 text-navy-600 flex items-center justify-center">
                        {Icon && <Icon className="w-4.5 h-4.5" strokeWidth={1.75} aria-hidden="true" />}
                      </span>
                      <span className="font-display font-extrabold text-body-sm text-warning">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-body-sm text-grey-700 leading-relaxed m-0">{accion.texto}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* FAQ — mismo patrón que necesito-ayuda/FAQ.tsx (details/summary +
              ChevronDown animado), embebido en la guía en vez de una sección
              propia de página */}
          <section id={anchorId('faq')} className="mt-12 scroll-mt-24">
            <h4 className="font-display font-bold text-h3 text-ink mb-2">
              Preguntas frecuentes sobre esta etapa
            </h4>
            <p className="text-body-sm text-grey-700 mb-2 max-w-[680px]">
              Dudas puntuales que suelen surgir una vez que la causa pasa a ejecución.
            </p>
            <div className="flex flex-col divide-y divide-grey-200 border-t border-b border-grey-200 mt-4 max-w-[680px]">
              {guia.preguntas.map(({ pregunta, respuesta }) => (
                <details key={pregunta} className="group py-4">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-display font-bold text-ink text-body marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 rounded-xs">
                    <span>{pregunta}</span>
                    <ChevronDown
                      className="w-4.5 h-4.5 shrink-0 text-navy-600 transition-transform duration-base ease-out group-open:rotate-180"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="text-body-sm text-grey-700 leading-relaxed mt-3 mb-0">{respuesta}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* Índice rápido — versión sticky para desktop */}
        <aside className="hidden lg:block px-8 py-12">
          <div className="sticky top-24">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-grey-500 mb-3.5">
              En esta guía
            </p>
            <nav aria-label={`Índice de la guía: ${guia.titulo}`}>
              <ul className="flex flex-col gap-1 list-none p-0 m-0 border-l border-grey-200">
                {indice.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block pl-4 py-1.5 text-body-sm text-grey-700 border-l-2 border-transparent -ml-px hover:text-navy-600 hover:border-navy-600 no-underline hover:no-underline transition-colors duration-base ease-out"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </article>
  )
}
