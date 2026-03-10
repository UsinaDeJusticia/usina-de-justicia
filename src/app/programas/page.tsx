import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Shield, Scale, GraduationCap, Gavel, ArrowRight } from 'lucide-react'
import type { Programa } from '@/types'

export const metadata: Metadata = {
  title: 'Programas',
  description:
    'Conocé los programas de Usina de Justicia: asistencia a víctimas, reformas legislativas, capacitación y litigio estratégico.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/programas' },
}

const programas: (Programa & { icono: string })[] = [
  {
    id: '1',
    titulo: 'Asistencia a Víctimas',
    slug: 'asistencia-a-victimas',
    descripcionCorta:
      'Acompañamiento legal, psicológico y social para víctimas del delito y sus familias.',
    contenido: '',
    icono: 'shield',
    orden: 1,
  },
  {
    id: '2',
    titulo: 'Reformas Legislativas',
    slug: 'reformas-legislativas',
    descripcionCorta:
      'Trabajamos por leyes que reconozcan y protejan los derechos de las víctimas del delito.',
    contenido: '',
    icono: 'scale',
    orden: 2,
  },
  {
    id: '3',
    titulo: 'Capacitación y Formación',
    slug: 'capacitacion-y-formacion',
    descripcionCorta:
      'Formación para operadores jurídicos, fuerzas de seguridad y profesionales de la salud.',
    contenido: '',
    icono: 'graduation',
    orden: 3,
  },
  {
    id: '4',
    titulo: 'Litigio Estratégico',
    slug: 'litigio-estrategico',
    descripcionCorta:
      'Casos paradigmáticos que buscan sentar jurisprudencia a favor de las víctimas.',
    contenido: '',
    icono: 'gavel',
    orden: 4,
  },
]

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-6 h-6" />,
  scale: <Scale className="w-6 h-6" />,
  graduation: <GraduationCap className="w-6 h-6" />,
  gavel: <Gavel className="w-6 h-6" />,
}

export default function ProgramasPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Programas', href: '/programas' }]} />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display mb-4">Nuestros Programas</h1>
          <p className="text-body-lg text-neutral-600 max-w-narrow mb-12">
            Trabajamos en múltiples frentes para garantizar que las víctimas del
            delito tengan acceso efectivo a la justicia y acompañamiento integral.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {programas
              .sort((a, b) => a.orden - b.orden)
              .map((programa) => (
                <Link
                  key={programa.id}
                  href={`/programas/${programa.slug}`}
                  className="group block bg-white border border-neutral-200 rounded-xl p-8 hover:border-primary-500/30 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center mb-5 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                    {iconMap[programa.icono]}
                  </div>

                  <h2 className="text-h3 text-neutral-900 group-hover:text-primary-500 transition-colors">
                    {programa.titulo}
                  </h2>

                  <p className="text-body text-neutral-600 mt-3 leading-relaxed">
                    {programa.descripcionCorta}
                  </p>

                  <span className="inline-flex items-center gap-1 text-body-sm font-medium text-primary-500 mt-5">
                    Conocer más
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}