// Versión ampliada de los pasos 01/02/03 de src/components/home/QueHacer.tsx
// (ya aprobados en la Home). Se mantiene el texto base de cada paso y se
// agrega un detalle adicional, sostenido por el mismo componente o por las
// páginas WP reales de "Acompañamiento a las Víctimas" (ver
// docs/COPY-necesito-ayuda.md para el detalle fuente por fuente).
const steps = [
  {
    n: '01',
    title: 'Comunicate con nosotros',
    description:
      'Te escuchamos sin apuro. Llamanos, escribinos por WhatsApp o mandanos un correo electrónico, por el canal que prefieras.',
    detail:
      'Desde ese primer contacto te asignamos una referente de acompañamiento que sigue tu caso.',
  },
  {
    n: '02',
    title: 'Contención y primer asesoramiento',
    description:
      'Una psicóloga y una abogada del equipo te acompañan en las primeras decisiones: velatorio, pericias, expediente, medios.',
    detail: 'No hace falta que resuelvas todo esto solo ni de inmediato.',
  },
  {
    n: '03',
    title: 'Acompañamiento sostenido',
    description:
      'Te acompañamos durante todo el proceso penal y la ejecución de la pena, con asistencia jurídica y grupos de pares.',
    detail: 'Seguimos el caso con vos, tenga o no sentencia firme todavía.',
  },
]

export function PrimerosPasos() {
  return (
    <section id="primeros-pasos" className="py-20 md:py-24 bg-white scroll-mt-16">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="max-w-[720px] mb-12">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
            Si perdiste a un ser querido
          </p>
          <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5 mb-3.5">
            ¿Qué hacer en primer lugar?
          </h2>
          <p className="text-body-lg text-grey-700">
            No hay un orden obligatorio ni un plazo para pedir ayuda. Esto es lo que
            hacemos, paso a paso, cuando una familia se comunica con nosotros.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="px-7 pt-7 pb-8 bg-ivory border border-grey-200 border-t-[3px] border-t-warning"
            >
              <div className="font-display font-extrabold text-[36px] leading-none text-warning">
                {s.n}
              </div>
              <h3 className="font-display font-bold text-xl mt-3.5 mb-2">{s.title}</h3>
              <p className="text-body-sm text-grey-700 leading-relaxed m-0">{s.description}</p>
              <p className="text-body-sm text-grey-700 leading-relaxed mt-3 mb-0">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
