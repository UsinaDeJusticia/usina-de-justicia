import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Users, Eye, Target, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description:
    'Conocé la historia, misión y equipo de Usina de Justicia. Trabajamos por los derechos de las víctimas del delito en Argentina.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/sobre-nosotros' },
  openGraph: {
    title: 'Sobre Nosotros — Usina de Justicia',
    description:
      'Conocé la historia, misión y equipo de Usina de Justicia. Trabajamos por los derechos de las víctimas del delito en Argentina.',
    url: 'https://www.usinadejusticia.org.ar/sobre-nosotros',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Sobre Nosotros — Usina de Justicia',
  description:
    'Historia, misión y equipo de Usina de Justicia, ONG dedicada a la defensa de los derechos de las víctimas del delito.',
  url: 'https://www.usinadejusticia.org.ar/sobre-nosotros',
}

export default function SobreNosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Sobre Nosotros', href: '/sobre-nosotros' }]} />
      </div>

      {/* Hero */}
      <section className="bg-primary-500 text-white py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display">Sobre Usina de Justicia</h1>
          <p className="mt-4 text-body-lg text-white/80 max-w-narrow">
            Desde nuestra fundación trabajamos para que las víctimas del delito
            tengan voz, acceso a la justicia y acompañamiento integral.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section id="mision-y-vision" className="py-section">
        <div className="max-w-content mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-500" />
                </div>
                <h2 className="text-h2">Nuestra Misión</h2>
              </div>
              <p className="text-body-lg text-neutral-600 leading-relaxed">
                Defender y promover los derechos de las víctimas del delito en Argentina,
                garantizando su acceso efectivo a la justicia, acompañamiento integral
                y participación activa en el proceso penal.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary-500" />
                </div>
                <h2 className="text-h2">Nuestra Visión</h2>
              </div>
              <p className="text-body-lg text-neutral-600 leading-relaxed">
                Una Argentina donde cada víctima del delito sea escuchada, protegida
                y reparada por un sistema de justicia que priorice sus derechos
                y su dignidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="py-section bg-neutral-50">
        <div className="max-w-narrow mx-auto px-4">
          <h2 className="text-h2 mb-6">Nuestra Historia</h2>
          <div className="prose prose-lg text-neutral-600 space-y-4">
            <p>
              Usina de Justicia nació de la necesidad de dar respuesta a las víctimas
              del delito en Argentina, quienes históricamente fueron relegadas en el
              sistema de justicia penal.
            </p>
            <p>
              A lo largo de los años, hemos acompañado a miles de víctimas y sus
              familias, impulsado reformas legislativas y formado a operadores
              jurídicos en todo el país.
            </p>
            <p>
              Hoy somos una organización de referencia en la materia, reconocida
              por organismos nacionales e internacionales por nuestro compromiso
              con los derechos humanos de las víctimas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA hacia equipo */}
      <section className="py-section">
        <div className="max-w-content mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary-500" />
            <h2 className="text-h2">Nuestro Equipo</h2>
          </div>
          <p className="text-body-lg text-neutral-600 mb-6 max-w-narrow mx-auto">
            Conoce a las personas que hacen posible nuestro trabajo diario por
            los derechos de las víctimas.
          </p>
          <Link
            href="/sobre-nosotros/equipo"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Conoce al equipo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}