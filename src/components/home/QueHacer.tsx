// Portado de design-system/home/QueHacer.jsx.
const steps = [
  {
    n: '01',
    title: 'Comunicate con nosotros',
    description:
      'Te escuchamos sin apuro. Llamanos o escribinos por el canal que prefieras. Te asignamos una referente de acompañamiento.',
  },
  {
    n: '02',
    title: 'Contención y primer asesoramiento',
    description:
      'Una psicóloga y una abogada del equipo te acompañan en las primeras decisiones: velatorio, pericias, expediente, medios.',
  },
  {
    n: '03',
    title: 'Acompañamiento sostenido',
    description:
      'Te acompañamos durante todo el proceso penal y la ejecución de la pena, con asistencia jurídica y grupos de pares.',
  },
]

export function QueHacer() {
  return (
    <section id="quehacer" className="py-20 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="max-w-[720px] mb-12">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
            Si perdiste a un ser querido
          </p>
          <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5 mb-3.5">
            ¿Qué hacer en primer lugar?
          </h2>
          <p className="text-body-lg text-grey-700">
            Nadie debería enfrentar esto solo. Te acompañamos paso a paso, con tiempo y
            reserva.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="px-7 pt-7 pb-8 bg-ivory border border-grey-200 border-t-[3px] border-t-warning"
            >
              {/* Acento cálido ámbar en el borde superior + número, decorativo y de gran tamaño */}
              <div className="font-display font-extrabold text-[36px] leading-none text-warning">
                {s.n}
              </div>
              <h3 className="font-display font-bold text-xl mt-3.5 mb-2">{s.title}</h3>
              <p className="text-body-sm text-grey-700 leading-relaxed m-0">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
