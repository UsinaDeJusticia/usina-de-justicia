import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Heart, Shield, Users, Scale, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Doná',
  description:
    'Tu donación ayuda a defender los derechos de las víctimas del delito en Argentina. Doná de forma segura.',
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
          <h1 className="text-h1 lg:text-display">Colaborá con Usina de Justicia</h1>
          <p className="mt-4 text-body-lg text-white/80 max-w-narrow mx-auto">
            Tu aporte nos permite continuar defendiendo los derechos de las
            víctimas del delito en Argentina. Cada contribución hace la diferencia.
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
                {/* PLACEHOLDER — Reemplazar con datos bancarios reales */}
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Titular</span>
                  <span className="font-medium">Asociación Civil Usina de Justicia</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">CUIT</span>
                  <span className="font-medium">XX-XXXXXXXX-X</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Banco</span>
                  <span className="font-medium">Banco Nación / A definir</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">CBU</span>
                  <span className="font-medium">XXXX XXXX XXXX XXXX XXXX XX</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-neutral-500">Alias</span>
                  <span className="font-medium">USINA.JUSTICIA.DONAR</span>
                </div>
              </div>
            </div>

            {/* MercadoPago / Otros */}
            <div className="bg-white rounded-xl p-8 border border-neutral-200">
              <h3 className="text-h3 mb-4">Donación online</h3>
              <p className="text-body text-neutral-600 mb-6">
                {/* PLACEHOLDER — Integrar MercadoPago o pasarela de pagos */}
                Próximamente vas a poder donar de forma segura a través de nuestra
                plataforma online con tarjeta de crédito, débito o MercadoPago.
              </p>
              <button
                disabled
                className="inline-flex items-center gap-2 bg-neutral-200 text-neutral-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                <Heart className="w-4 h-4" />
                Próximamente
              </button>
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