import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/lib/site-config'
import {
  HeartHandshake,
  UserCheck,
  Scale,
  Users,
  Gavel,
  MessageCircle,
  ArrowRight,
} from 'lucide-react'

// /acompanamiento — decisión D del plan (docs/plan-maestro-usina-web.md §3.1):
// sección propia de primer nivel que reemplaza a la vieja estructura
// `/programas` (ver docs/MAPA-MIGRACION.md §4, página WP 213 "no se migra:
// estructura desaparece"). Esta es la página INSTITUCIONAL del programa de
// acompañamiento (qué es, cómo se organiza, marco legal, historia), distinta
// de /necesito-ayuda (acción inmediata para quien necesita contactarse ahora
// — ver docs/COPY-necesito-ayuda.md). El copy de acá está redactado en voz
// institucional/tercera persona para no repetir el mismo texto palabra por
// palabra que la landing de ayuda, aunque comparte las mismas fuentes reales:
//
// - [WP1] acompanamiento-a-la-victima.html (WP id 103) — Ley 27.372, art. 5.
// - [WP2] acompanamos-a-las-victimas.html (WP id 44) — las dos categorías
//   reales en que el programa organiza a las familias acompañadas (con
//   sentencia firme / sin sentencia, con contención legal, emocional y
//   difusión en redes). No se listan los nombres de las familias/víctimas
//   que aparecen en WP2 (es una galería de casos individuales, sensible y en
//   permanente actualización según la propia página WP) — se describe la
//   organización del programa a nivel agregado, sin cifras ni nombres.
// - [Pillars] src/components/home/Pillars.tsx — descripción del pilar
//   "Acompañamiento a las víctimas", ya aprobada en la Home.
// - [QueHacer] src/components/home/QueHacer.tsx — los tres pasos del
//   acompañamiento, ya aprobados en la Home, reformulados en tercera persona.
// - [Nosotros] src/app/nosotros/page.tsx — historia y fundación (2014),
//   ya aprobada; acá se referencia con una sola oración y un link a
//   /nosotros para no duplicar el timeline completo.

const description =
  'El programa de acompañamiento de Usina de Justicia: cómo trabaja el equipo con las familias de víctimas de homicidio y femicidio, desde el primer contacto hasta la ejecución de la pena.'

export const metadata: Metadata = {
  title: 'Acompañamiento',
  description,
  alternates: { canonical: `${siteConfig.url}/acompanamiento` },
  openGraph: {
    title: `Acompañamiento — ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/acompanamiento`,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Acompañamiento a víctimas de homicidio y femicidio',
  name: 'Acompañamiento a las víctimas — Usina de Justicia',
  description,
  provider: {
    '@type': 'NGO',
    name: 'Usina de Justicia',
    url: siteConfig.url,
  },
  areaServed: 'AR',
}

// [QueHacer] reformulado en tercera persona / voz institucional (no en
// segunda persona imperativa, que es el registro propio de /necesito-ayuda).
const comoTrabaja = [
  {
    Icon: UserCheck,
    title: 'Primer contacto y referente asignada',
    description:
      'Cuando una familia se comunica — por teléfono, WhatsApp o correo electrónico — el equipo le asigna una referente de acompañamiento que sigue el caso de principio a fin.',
  },
  {
    Icon: HeartHandshake,
    title: 'Contención interdisciplinaria',
    description:
      'Una psicóloga y una abogada del equipo acompañan las primeras decisiones: el velatorio, las pericias, la apertura del expediente y el trato con los medios.',
  },
  {
    Icon: Scale,
    title: 'Acompañamiento durante todo el proceso',
    description:
      'La asistencia jurídica continúa durante el proceso penal y la ejecución de la pena, con encuentros de grupos de pares entre familias.',
  },
]

// [WP2] — organización agregada de las familias acompañadas, sin nombres ni
// cifras (la página fuente es una galería de casos en permanente
// actualización editorial, no un dato estadístico cerrado).
const gruposDeAcompanamiento = [
  {
    Icon: Gavel,
    title: 'Familias con sentencia firme',
    description:
      'Reciben acompañamiento legal durante la ejecución de la pena y en las instancias posteriores del proceso.',
  },
  {
    Icon: Users,
    title: 'Familias sin sentencia firme',
    description:
      'Reciben contención legal y emocional, y acompañamiento en la difusión pública del caso, mientras el proceso judicial sigue su curso.',
  },
]

// [WP1] — Derechos de las Víctimas, Ley 27.372, artículo 5 (incisos a-o,
// transcriptos de la página real). Se presenta el listado completo acá,
// como marco legal institucional; /necesito-ayuda solo resume una síntesis
// de estos incisos en una respuesta de FAQ, para no repetir el mismo texto.
const derechosLey27372 = [
  { letra: 'a', texto: 'A que se le reciba de inmediato la denuncia del delito que la afecta.' },
  {
    letra: 'b',
    texto: 'A recibir un trato digno y respetuoso y que sean mínimas las molestias derivadas del procedimiento.',
  },
  { letra: 'c', texto: 'A que se respete su intimidad en la medida que no obstruya la investigación.' },
  {
    letra: 'd',
    texto:
      'A requerir medidas de protección para su seguridad, la de sus familiares y la de los testigos que declaren en su interés, a través de los órganos competentes.',
  },
  {
    letra: 'e',
    texto:
      'A ser asistida en forma especializada con el objeto de propender a su recuperación psíquica, física y social, durante el tiempo que indiquen los profesionales intervinientes.',
  },
  {
    letra: 'f',
    texto: 'A ser informada sobre sus derechos cuando realice la denuncia o en su primera intervención en el procedimiento.',
  },
  {
    letra: 'g',
    texto:
      'A que en las causas en que se investiguen delitos contra la propiedad, las pericias y diligencias sobre las cosas sustraídas sean realizadas con la mayor celeridad posible.',
  },
  {
    letra: 'h',
    texto:
      'A intervenir como querellante o actor civil en el procedimiento penal, conforme a lo establecido por la garantía constitucional del debido proceso y las leyes de procedimiento locales.',
  },
  {
    letra: 'i',
    texto: 'A examinar documentos y actuaciones, y a ser informada verbalmente sobre el estado del proceso y la situación del imputado.',
  },
  { letra: 'j', texto: 'A aportar información y pruebas durante la investigación.' },
  {
    letra: 'k',
    texto:
      'A ser escuchada antes de cada decisión que implique la extinción o suspensión de la acción penal, y aquellas que dispongan medidas de coerción o la libertad del imputado durante el proceso, siempre que lo solicite expresamente.',
  },
  { letra: 'l', texto: 'A ser notificada de las resoluciones que puedan afectar su derecho a ser escuchada.' },
  {
    letra: 'm',
    texto:
      'A solicitar la revisión de la desestimación, el archivo o la aplicación de un criterio de oportunidad solicitado por el representante del Ministerio Público Fiscal, cuando hubiera intervenido en el procedimiento como querellante.',
  },
  {
    letra: 'n',
    texto:
      'A que se adopten prontamente las medidas de coerción o cautelares que fueren procedentes para impedir que el delito continúe en ejecución o alcance consecuencias ulteriores.',
  },
  { letra: 'ñ', texto: 'A que le sean reintegrados los bienes sustraídos con la mayor urgencia.' },
  {
    letra: 'o',
    texto:
      'Al sufragio de los gastos que demande el ejercicio de sus derechos, cuando por sus circunstancias personales se encontrare económicamente imposibilitada de solventarlos.',
  },
]

export default function AcompanamientoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Acompañamiento', href: '/acompanamiento' }]} />
      </div>

      {/* Hero */}
      <section className="pb-16 md:pb-20 pt-2 md:pt-4">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Programa de acompañamiento
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Acompañamiento a las víctimas
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Contención emocional y asesoramiento jurídico para familiares de víctimas de
            homicidio y femicidio. Es una de las tres líneas de trabajo de Usina de
            Justicia, y la que le dio origen a la organización en 2014, cuando un grupo
            de familias que había atravesado la pérdida de un ser querido por un hecho de
            violencia decidió acompañarse entre sí.{' '}
            <Link href="/nosotros" className="font-bold text-navy-600 hover:underline">
              Conocé la historia completa de Usina de Justicia.
            </Link>
          </p>
        </div>
      </section>

      {/* Cómo trabaja el equipo */}
      <section className="py-16 md:py-20 bg-navy-50 border-t border-b border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="max-w-[720px] mb-11">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
              Cómo funciona
            </p>
            <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5">
              Cómo trabaja el equipo de acompañamiento
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {comoTrabaja.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="px-7 pt-7 pb-8 bg-white border border-grey-200 border-t-[3px] border-t-warning"
              >
                <Icon className="w-7 h-7 text-navy-600" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="font-display font-bold text-xl mt-3.5 mb-2">{title}</h3>
                <p className="text-body-sm text-grey-700 leading-relaxed m-0">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo se organiza el acompañamiento (dos grupos, según WP2) */}
      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="max-w-[720px] mb-11">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
              Organización del programa
            </p>
            <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5 mb-3.5">
              Dos maneras de acompañar
            </h2>
            <p className="text-body-lg text-grey-700">
              El programa organiza el acompañamiento de las familias según el estado del
              proceso judicial de cada caso.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {gruposDeAcompanamiento.map(({ Icon, title, description }) => (
              <div key={title} className="p-7 bg-ivory border border-grey-200 rounded-xs">
                <div className="w-11 h-11 rounded-xs bg-navy-50 text-navy-600 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-2">{title}</h3>
                <p className="text-body-sm text-grey-700 leading-relaxed m-0">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marco legal: Ley 27.372 */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="max-w-[720px] mb-11">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
              Marco legal
            </p>
            <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] leading-tight mt-2.5 mb-3.5">
              Derechos de las víctimas — Ley 27.372
            </h2>
            <p className="text-body-lg text-grey-700">
              El artículo 5 de la Ley de Derechos y Garantías de las Personas Víctimas de
              Delitos (27.372) reconoce estos derechos a toda víctima:
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5 list-none p-0 m-0">
            {derechosLey27372.map((d) => (
              <li key={d.letra} className="flex gap-3.5">
                <span className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-navy-600 text-white text-body-sm font-bold uppercase">
                  {d.letra}
                </span>
                <p className="text-body-sm text-grey-700 leading-relaxed m-0">{d.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA hacia /necesito-ayuda */}
      <section className="py-20 md:py-24 bg-navy-900 text-white">
        <div className="max-w-content mx-auto px-4 md:px-10 text-center">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-300 mb-4">
            ¿Necesitás ayuda ahora?
          </p>
          <h2 className="font-display font-extrabold text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.1] max-w-[720px] mx-auto">
            Si perdiste a un ser querido por un hecho de violencia, no tenés que
            atravesarlo solo.
          </h2>
          <div className="flex flex-wrap gap-3 mt-9 justify-center">
            <Button href="/necesito-ayuda" variant="primary" size="lg">
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
              Necesito ayuda
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
