import { UserCheck, Scale, HeartHandshake, Users, Megaphone } from 'lucide-react'

// Contenido 100% sostenido por las páginas WP reales del programa de
// acompañamiento y por QueHacer.tsx / Pillars.tsx (Home, ya aprobados).
// Ver docs/COPY-necesito-ayuda.md para el detalle fuente por sección.
const ofertas = [
  {
    Icon: UserCheck,
    title: 'Una referente de acompañamiento',
    description: 'Desde el primer contacto, alguien del equipo sigue tu caso de principio a fin.',
  },
  {
    Icon: Scale,
    title: 'Asesoramiento y asistencia jurídica',
    description: 'Durante todo el proceso penal, incluida la ejecución de la pena.',
  },
  {
    Icon: HeartHandshake,
    title: 'Contención psicológica',
    description: 'Una psicóloga del equipo te acompaña desde las primeras decisiones.',
  },
  {
    Icon: Users,
    title: 'Grupos de pares',
    description: 'Encuentro con otras familias que atravesaron la pérdida de un ser querido.',
  },
  {
    Icon: Megaphone,
    title: 'Difusión y visibilización del caso',
    description: 'Acompañamiento en la comunicación y difusión en redes, cuando la familia lo necesita.',
  },
]

// "Datos de interés" de la página WP real "Acompañamiento a las Víctimas"
// (acompanamiento-a-la-victima.html): líneas y organismos estatales de
// asistencia a víctimas, independientes de Usina de Justicia.
const recursosOficiales = [
  'Línea 149 — Centro de Asistencia a la Víctima de Delitos (CENAVID)',
  'Línea 144 — Atención por violencia de género',
  'Centro Integral de la Mujer (CIM)',
  'Centros de Acceso a la Justicia en todo el país (CAJ)',
  'Centro de Atención a la Víctima — Ciudad Autónoma de Buenos Aires (CAV)',
  'Centro de Atención a la Víctima — Provincia de Buenos Aires',
]

export function QueOfrecemos() {
  return (
    <section className="py-20 md:py-24 bg-navy-50 border-t border-b border-grey-200">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="max-w-[720px] mb-11">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
            Acompañamiento a las víctimas
          </p>
          <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5">
            Qué ofrece Usina de Justicia
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ofertas.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="bg-white border border-grey-200 rounded-xs px-6 pt-7 pb-6"
            >
              <Icon className="w-6 h-6 text-navy-600" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="font-display font-bold text-ink text-lg mt-4 mb-2">{title}</h3>
              <p className="text-body-sm text-grey-700 leading-relaxed m-0">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-grey-200">
          <h3 className="font-display font-bold text-ink text-xl mb-2">
            Otros recursos oficiales
          </h3>
          <p className="text-body-sm text-grey-700 mb-5 max-w-[640px]">
            Además del acompañamiento de Usina de Justicia, existen líneas y organismos
            estatales de asistencia a víctimas:
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-body-sm text-grey-700 list-disc list-inside">
            {recursosOficiales.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
