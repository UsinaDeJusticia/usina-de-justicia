import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Heart, Shield, Users, Scale, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Doná',
  description:
    'Tu donación nos permite acompañar a las familias de víctimas de homicidio y femicidio con asesoramiento legal y contención psicológica.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/donar' },
}

const impactos = [
  {
    icon: <Shield className="w-6 h-6" />,
    titulo: 'Asistencia legal gratuita',
    descripcion: 'Para víctimas que no pueden costear un abogado.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    titulo: 'Acompañamiento integral',
    descripcion: 'Apoyo psicológico y social para víctimas y familias.',
  },
  {
    icon: <Scale className="w-6 h-6" />,
    titulo: 'Reformas legislativas',
    descripcion: 'Trabajo por leyes que protejan a las víctimas.',
  },
]

export default function DonarPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Doná', href: '/donar' }]} />
      </div>

      {/* Hero */}
      <section className="bg-accent-500 text-white py-section">
        <div className="max-w-content mx-auto px-4 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h1 className="text-h1 lg:text-display">No se trata de una mera donación</h1>
          <p className="mt-4 text-body-lg text-white/80 max-w-narrow mx-auto">
            Es un compromiso con nuestra causa. Con tu aporte te convertís en socio de los proyectos que presentamos en el Congreso y nos ayudás a brindar asesoramiento legal y contención psicológica a las familias de víctimas.
          </p>
        </div>
      </section>

      {/* Impacto */}
      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <h2 className="text-h2 text-center mb-10">Tu donación permite</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {impactos.map((impacto, i) => (
              <div
                key={i}
                className="text-center p-8 bg-neutral-50 rounded-xl"
              >
                <div className="w-14 h-14 rounded-full bg-accent-500/10 text-accent-500 flex items-center justify-center mx-auto mb-5">
                  {impacto.icon}
                </div>
                <h3 className="text-h4 text-neutral-900 mb-2">{impacto.titulo}</h3>
                <p className="text-body text-neutral-600">{impacto.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Métodos de donación */}
      <section className="py-section bg-neutral-50">
        <div className="max-w-narrow mx-auto px-4">
          <h2 className="text-h2 text-center mb-10">Cómo donar</h2>

          <div className="space-y-6">
            {/* Transferencia bancaria */}
            <div className="bg-white rounded-xl p-8 border border-neutral-200">
              <h3 className="text-h3 mb-4">Transferencia bancaria</h3>
              <div className="space-y-3 text-body text-neutral-700">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Titular</span>
                  <span className="font-medium">USINA DE JUSTICIA - ARGENTINA ASOCIACIÓN</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">CUIT</span>
                  <span className="font-medium">30-71540108-4</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Banco</span>
                  <span className="font-medium">BBVA BANCO FRANCÉS</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Cuenta corriente en pesos</span>
                  <span className="font-medium">035-019044/4</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">CBU</span>
                  <span className="font-medium">0170035020000001904442</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-500">Alias</span>
                  <span className="font-medium">USINA.JUSTICIA.ARG</span>
                </div>
              </div>
            </div>

            {/* MercadoPago / Otros */}
            <div className="bg-white rounded-xl p-8 border border-neutral-200">
              <h3 className="text-h3 mb-4">Donación online con MercadoPago</h3>
              <p className="text-body text-neutral-600 mb-6">
                Si 100 personas nos acompañan con $20.000 mensuales recaudaríamos
                $2.000.000 para seguir defendiendo a las víctimas. Elegí el monto
                y la frecuencia que prefieras.
              </p>
              <a
                href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848e498e81018e5c7c5e4d0640"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#009ee3] hover:bg-[#0087c9] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Heart className="w-4 h-4" />
                Donar con MercadoPago
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Transparencia */}
      <section className="py-section">
        <div className="max-w-narrow mx-auto px-4 text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-4" />
          <h2 className="text-h2 mb-4">Transparencia</h2>
          <p className="text-body-lg text-neutral-600 mb-6">
            Usina de Justicia rinde cuentas de cada peso recibido. Consultá
            nuestros informes de gestión y estados contables.
          </p>
          <Link
            href="/sobre-nosotros/transparencia"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold transition-colors"
          >
            Ver informes de transparencia
          </Link>
        </div>
      </section>
    </>
  )
}