import { ChevronDown } from 'lucide-react'

// Preguntas frecuentes de /necesito-ayuda. Cada respuesta está sostenida por
// una fuente real (ver docs/COPY-necesito-ayuda.md). Se exporta `faqItems`
// para que Fase 4 pueda generar el JSON-LD FAQPage a partir de este mismo
// arreglo, sin duplicar el copy.
export const faqItems = [
  {
    question: '¿Con quién me comunico primero?',
    answer:
      'Con el equipo de acompañamiento de Usina de Justicia, por teléfono, WhatsApp o correo electrónico. Desde ese primer contacto te asignamos una referente que sigue tu caso.',
  },
  {
    question: '¿Qué tipo de ayuda ofrece Usina de Justicia?',
    answer:
      'Contención psicológica, asesoramiento y asistencia jurídica durante el proceso penal, acompañamiento durante la ejecución de la pena y grupos de pares con otras familias.',
  },
  {
    question: '¿Me acompañan también si el caso todavía no tiene sentencia?',
    answer:
      'Sí. Acompañamos a las familias con contención legal y emocional, y con difusión en redes cuando hace falta, desde el momento del hecho y durante todo el proceso, tenga o no sentencia firme.',
  },
  {
    question: '¿Qué pasa con los primeros trámites, como el velatorio o el expediente?',
    answer:
      'En los primeros días te acompañamos en esas decisiones: una psicóloga y una abogada del equipo te ayudan con el velatorio, las pericias, la apertura del expediente y el trato con los medios.',
  },
  {
    question: '¿Qué derechos tengo como familiar de una víctima?',
    answer:
      'La Ley 27.372 reconoce derechos específicos: a que se tome la denuncia de inmediato, a un trato digno y respetuoso, a la protección de tu intimidad y tu seguridad, a ser informada o informado y escuchada o escuchado en cada etapa del proceso, y a intervenir como querellante, entre otros.',
  },
  {
    question: '¿A quién puedo recurrir si necesito asistencia oficial inmediata?',
    answer:
      'Además del acompañamiento de Usina de Justicia, existen líneas y organismos estatales: la Línea 149 (CENAVID), la Línea 144 (violencia de género), los Centros de Acceso a la Justicia (CAJ) y los Centros de Atención a la Víctima de la Ciudad de Buenos Aires y de la Provincia de Buenos Aires.',
  },
  {
    question: '¿El acompañamiento termina cuando hay condena?',
    answer:
      'No. Usina de Justicia sigue acompañando a las familias durante la ejecución de la pena, con asistencia jurídica y grupos de pares.',
  },
]

export function FAQ() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-narrow mx-auto px-4 md:px-10">
        <div className="mb-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
            Antes de escribirnos
          </p>
          <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-grey-200 border-t border-b border-grey-200">
          {faqItems.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-display font-bold text-ink text-lg marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-600 focus-visible:ring-offset-2 rounded-xs">
                <span>{question}</span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 text-navy-600 transition-transform duration-base ease-out group-open:rotate-180"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </summary>
              <p className="text-body text-grey-700 leading-relaxed mt-3 mb-0 max-w-[640px]">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
