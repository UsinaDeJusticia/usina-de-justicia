import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Heart, Shield, Users, Scale, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Doná',
  description:
    'Tu donación nos permite acompañar a las familias de víctimas de homicidio y femicidio con asesoramiento legal y contención psicológica.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/donar' },
}

const impactos = [
  {
    icon: Shield,
    titulo: 'Asistencia legal gratuita',
    descripcion: 'Para víctimas que no pueden costear un abogado.',
  },
  {
    icon: Users,
    titulo: 'Acompañamiento integral',
    descripcion: 'Apoyo psicológico y social para víctimas y familias.',
  },
  {
    icon: Scale,
    titulo: 'Reformas legislativas',
    descripcion: 'Trabajo por leyes que protejan a las víctimas.',
  },
]

export default function DonarPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Doná', href: '/donar' }]} />
      </div>

      {/* Hero */}
      <section className="bg-navy-900 text-white py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 text-navy-300" aria-hidden="true" />
          <h1 className="font-display font-extrabold text-[clamp(2rem,4vw,2.75rem)] leading-tight">
            No se trata de una mera donación
          </h1>
          <p className="mt-4 text-body-lg text-navy-200 max-w-narrow mx-auto leading-relaxed">
            Es un compromiso con nuestra causa. Con tu aporte te convertís en socio de
            los proyectos que presentamos en el Congreso y nos ayudás a brindar
            asesoramiento legal y contención psicológica a las familias de víctimas.
          </p>
        </div>
      </section>

      {/* Impacto */}
      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink text-center mb-10">
            Tu donación permite
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {impactos.map((impacto) => (
              <div
                key={impacto.titulo}
                className="text-center p-7 bg-white border border-grey-200 rounded-xs"
              >
                <div className="w-14 h-14 rounded-full bg-navy-50 text-navy-600 flex items-center justify-center mx-auto mb-5">
                  <impacto.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-body text-ink mb-2">
                  {impacto.titulo}
                </h3>
                <p className="text-body-sm text-grey-700 leading-relaxed">
                  {impacto.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Métodos de donación */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-narrow mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink text-center mb-10">
            Cómo donar
          </h2>

          <div className="space-y-6">
            {/* Transferencia bancaria */}
            <div className="bg-white rounded-xs p-7 border border-grey-200">
              <h3 className="font-display font-bold text-h3 text-ink mb-4">
                Transferencia bancaria
              </h3>
              <div className="space-y-3 text-body text-grey-700">
                <div className="flex justify-between py-2 border-b border-grey-200">
                  <span className="text-grey-500">Titular</span>
                  <span className="font-bold text-ink">USINA DE JUSTICIA - ARGENTINA ASOCIACIÓN</span>
                </div>
                <div className="flex justify-between py-2 border-b border-grey-200">
                  <span className="text-grey-500">CUIT</span>
                  <span className="font-bold text-ink">30-71540108-4</span>
                </div>
                <div className="flex justify-between py-2 border-b border-grey-200">
                  <span className="text-grey-500">Banco</span>
                  <span className="font-bold text-ink">BBVA BANCO FRANCÉS</span>
                </div>
                <div className="flex justify-between py-2 border-b border-grey-200">
                  <span className="text-grey-500">Cuenta corriente en pesos</span>
                  <span className="font-bold text-ink">035-019044/4</span>
                </div>
                <div className="flex justify-between py-2 border-b border-grey-200">
                  <span className="text-grey-500">CBU</span>
                  <span className="font-bold text-ink">0170035020000001904442</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-grey-500">Alias</span>
                  <span className="font-bold text-ink">USINA.JUSTICIA.ARG</span>
                </div>
              </div>
            </div>

            {/* MercadoPago / Otros */}
            <div className="bg-white rounded-xs p-7 border border-grey-200">
              <h3 className="font-display font-bold text-h3 text-ink mb-4">
                Donación online con MercadoPago
              </h3>
              <p className="text-body text-grey-700 mb-6 leading-relaxed">
                Si 100 personas nos acompañan con $20.000 mensuales recaudaríamos
                $2.000.000 para seguir defendiendo a las víctimas. Elegí el monto
                y la frecuencia que prefieras.
              </p>
              <Button
                href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848e498e81018e5c7c5e4d0640"
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
              >
                <Heart className="w-4 h-4" aria-hidden="true" />
                Donar con MercadoPago
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Transparencia */}
      <section className="py-16 md:py-20">
        <div className="max-w-narrow mx-auto px-4 md:px-10 text-center">
          <div className="w-12 h-12 rounded-full bg-success-bg text-success flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display font-bold text-h2 text-ink mb-4">Transparencia</h2>
          <p className="text-body-lg text-grey-700 mb-6 leading-relaxed">
            Usina de Justicia rinde cuentas de cada peso recibido. Consultá
            nuestros informes de gestión y estados contables.
          </p>
          <Button href="/nosotros/transparencia" variant="ghost">
            Ver informes de transparencia
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </section>
    </>
  )
}
