import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { ArrowLeft } from 'lucide-react'

const programasData: Record<string, { titulo: string; contenido: string; descripcion: string }> = {
  'asistencia-a-victimas': {
    titulo: 'Asistencia a Víctimas',
    descripcion:
      'Programa de asistencia integral a víctimas del delito. Acompañamiento legal, psicológico y social.',
    contenido: `
      <h2>Qué hacemos</h2>
      <p>Brindamos acompañamiento integral a las víctimas del delito y sus familias, abarcando las dimensiones legal, psicológica y social de su situación.</p>
      
      <h2>A quién ayudamos</h2>
      <p>Asistimos a toda persona que haya sido víctima de un delito en Argentina, con especial atención a los sectores más vulnerables de la sociedad.</p>
      
      <h2>Cómo acceder</h2>
      <p>Podés contactarnos a través de nuestro formulario de contacto o comunicándote directamente a nuestras oficinas. La asistencia es gratuita y confidencial.</p>
      
      <h2>Resultados</h2>
      <p>Desde nuestra creación hemos acompañado a miles de víctimas en su camino hacia la justicia, logrando sentencias favorables y cambios significativos en las políticas públicas.</p>
    `,
  },
  'reformas-legislativas': {
    titulo: 'Reformas Legislativas',
    descripcion:
      'Trabajamos por leyes que reconozcan y protejan los derechos de las víctimas del delito en Argentina.',
    contenido: `
      <h2>Nuestro trabajo legislativo</h2>
      <p>Impulsamos proyectos de ley y reformas normativas que fortalezcan los derechos de las víctimas del delito en el sistema de justicia argentino.</p>
      
      <h2>Logros</h2>
      <p>Hemos participado activamente en la elaboración y debate de leyes fundamentales para la protección de las víctimas.</p>
      
      <h2>Agenda actual</h2>
      <p>Continuamos trabajando en reformas procesales que garanticen la participación efectiva de las víctimas en el proceso penal.</p>
    `,
  },
  'capacitacion-y-formacion': {
    titulo: 'Capacitación y Formación',
    descripcion:
      'Formación para operadores jurídicos, fuerzas de seguridad y profesionales sobre derechos de víctimas.',
    contenido: `
      <h2>Programas de formación</h2>
      <p>Desarrollamos programas de capacitación destinados a operadores jurídicos, fuerzas de seguridad, profesionales de la salud y la comunidad en general.</p>
      
      <h2>Modalidades</h2>
      <p>Ofrecemos cursos presenciales y virtuales, talleres, seminarios y jornadas de actualización en derechos de las víctimas del delito.</p>
      
      <h2>Alcance</h2>
      <p>Nuestros programas de formación han llegado a profesionales de todo el país, contribuyendo a mejorar la atención y el trato hacia las víctimas.</p>
    `,
  },
  'litigio-estrategico': {
    titulo: 'Litigio Estratégico',
    descripcion:
      'Casos paradigmáticos que buscan sentar jurisprudencia a favor de los derechos de las víctimas.',
    contenido: `
      <h2>Enfoque</h2>
      <p>Seleccionamos y litigamos casos paradigmáticos con el objetivo de sentar jurisprudencia favorable a los derechos de las víctimas del delito.</p>
      
      <h2>Casos emblemáticos</h2>
      <p>A lo largo de nuestra trayectoria hemos intervenido en casos de alto impacto que contribuyeron a ampliar y fortalecer los derechos de las víctimas.</p>
      
      <h2>Impacto</h2>
      <p>Nuestro trabajo en litigio estratégico ha generado precedentes jurisprudenciales que benefician no solo a las víctimas de los casos particulares sino a todas las víctimas del delito.</p>
    `,
  },
}

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const programa = programasData[params.slug]
  if (!programa) return {}

  return {
    title: `${programa.titulo} — Programas`,
    description: programa.descripcion,
    alternates: {
      canonical: `https://www.usinadejusticia.org.ar/programas/${params.slug}`,
    },
  }
}

export function generateStaticParams() {
  return Object.keys(programasData).map((slug) => ({ slug }))
}

export default function ProgramaPage({ params }: PageProps) {
  const programa = programasData[params.slug]

  if (!programa) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: programa.titulo,
    description: programa.descripcion,
    provider: {
      '@type': 'NGO',
      name: 'Usina de Justicia',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Programas', href: '/programas' },
            { label: programa.titulo, href: `/programas/${params.slug}` },
          ]}
        />
      </div>

      <article className="py-section">
        <div className="max-w-narrow mx-auto px-4">
          <Link
            href="/programas"
            className="inline-flex items-center gap-1 text-body-sm text-primary-500 hover:text-primary-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Programas
          </Link>

          <h1 className="text-h1 lg:text-display mb-8">{programa.titulo}</h1>

          <div
            className="prose prose-lg max-w-none text-neutral-700
              prose-headings:text-neutral-900 prose-headings:font-semibold
              prose-h2:text-h3 prose-h2:mt-10 prose-h2:mb-4
              prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: programa.contenido }}
          />
        </div>
      </article>
    </>
  )
}