import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import {
  Users,
  Target,
  ArrowRight,
  Heart,
  Handshake,
  ShieldCheck,
  Scale,
  Eye,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description:
    'Usina de Justicia es una Asociación Civil apartidaria que desde 2014 acompaña a las víctimas de homicidio y femicidio y trabaja por una justicia que contemple sus derechos.',
  alternates: {
    canonical: 'https://www.usinadejusticia.org.ar/sobre-nosotros',
  },
  openGraph: {
    title: 'Sobre Nosotros — Usina de Justicia',
    description:
      'Asociación Civil apartidaria que desde 2014 acompaña a las víctimas de homicidio y femicidio en Argentina.',
    url: 'https://www.usinadejusticia.org.ar/sobre-nosotros',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Sobre Nosotros — Usina de Justicia',
  description:
    'Historia, misión y valores de Usina de Justicia, Asociación Civil por los derechos de las víctimas de homicidio y femicidio.',
  url: 'https://www.usinadejusticia.org.ar/sobre-nosotros',
  mainEntity: {
    '@type': 'NGO',
    name: 'Usina de Justicia',
    foundingDate: '2014-11-12',
    description:
      'Asociación Civil apartidaria que acompaña a las víctimas de homicidio y femicidio y trabaja por una justicia justa.',
    url: 'https://www.usinadejusticia.org.ar',
  },
}

const valores = [
  {
    nombre: 'Integridad',
    icon: ShieldCheck,
    descripcion:
      'Actuamos con honestidad y coherencia en cada acción que emprendemos.',
  },
  {
    nombre: 'Solidaridad',
    icon: Heart,
    descripcion:
      'Acompañamos a las familias con empatía, desde el dolor compartido.',
  },
  {
    nombre: 'Compromiso',
    icon: Handshake,
    descripcion:
      'Sostenemos nuestra labor con dedicación constante y voluntaria.',
  },
  {
    nombre: 'Equidad',
    icon: Scale,
    descripcion:
      'Trabajamos para que todas las víctimas tengan acceso igualitario a la justicia.',
  },
  {
    nombre: 'Transparencia',
    icon: Eye,
    descripcion:
      'Rendimos cuentas de nuestra gestión y recursos de forma abierta.',
  },
]

const hitos = [
  {
    año: '2011',
    titulo: 'El origen',
    descripcion:
      'Usina de Justicia se gestó cuando Diana Cohen Agrest recibió la noticia del asesinato de su hijo Ezequiel. Ese dolor se transformó en la decisión de luchar por justicia.',
  },
  {
    año: '2013',
    titulo: 'La voz escrita',
    descripcion:
      'Se publica "Ausencia Perpetua. Inseguridad y Trampas de la (in)Justicia", un libro que visibiliza la realidad de las víctimas en el sistema judicial argentino.',
  },
  {
    año: '2014',
    titulo: 'La exposición que conmovió',
    descripcion:
      'Patricia Terán propone una exposición de fotografías de jóvenes muertos, un acto de denuncia artística que movilizó conciencias.',
  },
  {
    año: '2014',
    titulo: 'Fundación oficial',
    descripcion:
      'El 12 de noviembre de 2014 se funda oficialmente Usina de Justicia como Asociación Civil, formalizando años de trabajo voluntario por las víctimas.',
  },
]

const objetivos = [
  'Acompañar a los familiares de víctimas de homicidio y femicidio, brindándoles apoyo emocional y asesoramiento legal.',
  'Promover los derechos y alentar la participación de las víctimas en el proceso penal.',
  'Impulsar políticas públicas para mejorar la prevención de conductas delictivas graves.',
]

export default function SobreNosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[{ label: 'Sobre Nosotros', href: '/sobre-nosotros' }]}
        />
      </div>

      {/* Hero */}
      <section className="bg-primary-900 text-white py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display">Sobre Usina de Justicia</h1>
          <p className="mt-4 text-body-lg text-primary-200 max-w-narrow">
            Somos un grupo de víctimas que han perdido un ser querido en
            situaciones violentas y profesionales de distintas especialidades que
            voluntariamente trabajan y apoyan nuestra labor.
          </p>
          <p className="mt-4 text-body-lg text-primary-300 max-w-narrow">
            Somos una Asociación Civil apartidaria que desde 2014 trabajamos
            para acompañar a las víctimas de homicidio y femicidio y recuperar
            una Justicia justa que contemple a estas víctimas.
          </p>
        </div>
      </section>

      {/* Objetivos */}
      <section id="objetivos" className="py-section">
        <div className="max-w-content mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-500" />
            </div>
            <h2 className="text-h2">Nuestros Objetivos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {objetivos.map((obj, i) => (
              <div
                key={i}
                className="p-6 bg-white border border-neutral-200 rounded-xl"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-500 text-white text-body-sm font-bold mb-4">
                  {i + 1}
                </span>
                <p className="text-body text-neutral-700 leading-relaxed">
                  {obj}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section id="valores" className="py-section bg-neutral-50">
        <div className="max-w-content mx-auto px-4">
          <h2 className="text-h2 text-center mb-10">Nuestros Valores</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {valores.map((valor) => {
              const Icon = valor.icon
              return (
                <div key={valor.nombre} className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-h4 text-neutral-900 mb-1">
                    {valor.nombre}
                  </h3>
                  <p className="text-body-sm text-neutral-600">
                    {valor.descripcion}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Historia / Timeline */}
      <section id="historia" className="py-section">
        <div className="max-w-narrow mx-auto px-4">
          <h2 className="text-h2 mb-10">Nuestra Historia</h2>
          <div className="relative">
            {/* Línea vertical */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-primary-200" />

            <div className="space-y-10">
              {hitos.map((hito, i) => (
                <div key={i} className="relative pl-14">
                  {/* Círculo en la línea */}
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-body-sm font-bold">
                    {hito.año.slice(-2)}
                  </div>
                  <div>
                    <span className="text-body-sm text-primary-500 font-medium">
                      {hito.año}
                    </span>
                    <h3 className="text-h3 text-neutral-900 mt-1">
                      {hito.titulo}
                    </h3>
                    <p className="text-body text-neutral-600 mt-2 leading-relaxed">
                      {hito.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Links a subpáginas */}
      <section className="py-section bg-neutral-50">
        <div className="max-w-content mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Equipo */}
            <Link
              href="/sobre-nosotros/equipo"
              className="group p-8 bg-white border border-neutral-200 rounded-xl hover:border-primary-500/30 hover:shadow-lg transition-all"
            >
              <Users className="w-8 h-8 text-primary-500 mb-4" />
              <h2 className="text-h3 text-neutral-900 group-hover:text-primary-500 transition-colors">
                Nuestro Equipo
              </h2>
              <p className="text-body text-neutral-600 mt-2">
                Conocé a las personas que hacen posible nuestro trabajo diario
                por los derechos de las víctimas.
              </p>
              <span className="inline-flex items-center gap-1 text-body-sm font-medium text-primary-500 mt-4">
                Conocer al equipo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Transparencia */}
            <Link
              href="/sobre-nosotros/transparencia"
              className="group p-8 bg-white border border-neutral-200 rounded-xl hover:border-primary-500/30 hover:shadow-lg transition-all"
            >
              <Eye className="w-8 h-8 text-primary-500 mb-4" />
              <h2 className="text-h3 text-neutral-900 group-hover:text-primary-500 transition-colors">
                Transparencia Institucional
              </h2>
              <p className="text-body text-neutral-600 mt-2">
                Memorias, balances y documentos institucionales disponibles para
                consulta pública.
              </p>
              <span className="inline-flex items-center gap-1 text-body-sm font-medium text-primary-500 mt-4">
                Ver documentos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}