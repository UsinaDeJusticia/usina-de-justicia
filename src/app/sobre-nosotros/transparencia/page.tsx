import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { FileText, Download, CheckCircle, BarChart3 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Transparencia',
  description:
    'Memorias y balances certificados de Usina de Justicia. Documentos institucionales de acceso público.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/sobre-nosotros/transparencia' },
}

const informes = [
  {
    id: '1',
    titulo: 'Memoria y Balance — Año 2023',
    fecha: '2024-03-01',
    url: 'https://usinadejusticia.org.ar/wp-content/uploads/2024/05/Memoria-y-Balance-2023-certificado-y-comprimido.pdf',
    tipo: 'Memoria y Balance certificado',
  },
  {
    id: '2',
    titulo: 'Memoria y Balance — Año 2022',
    fecha: '2023-03-01',
    url: 'https://usinadejusticia.org.ar/wp-content/uploads/2023/08/Memoria-y-Balance-2022-Certificado-Comprimido.pdf',
    tipo: 'Memoria y Balance certificado',
  },
  {
    id: '3',
    titulo: 'Memoria y Balance — Año 2021',
    fecha: '2022-03-01',
    url: 'https://usinadejusticia.org.ar/wp-content/uploads/2022/11/Memoria-y-Balance-Certificado-2021-Comprimido.pdf',
    tipo: 'Memoria y Balance certificado',
  },
]

export default function TransparenciaPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
            { label: 'Transparencia', href: '/sobre-nosotros/transparencia' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="bg-primary-500 text-white py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display">Transparencia</h1>
          <p className="mt-4 text-body-lg text-white/80 max-w-narrow">
            Creemos en la rendición de cuentas como pilar fundamental de nuestra organización. Acá podés consultar nuestras memorias y balances certificados.
          </p>
        </div>
      </section>

      {/* Compromisos */}
      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <h2 className="text-h2 text-center mb-10">Nuestro compromiso</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-h4 mb-2">Rendición de cuentas</h3>
              <p className="text-body text-neutral-600">
                Publicamos anualmente nuestros informes de gestión y estados
                contables auditados.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-h4 mb-2">Datos abiertos</h3>
              <p className="text-body text-neutral-600">
                Nuestros informes son de acceso público y pueden ser
                consultados por cualquier persona.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-h4 mb-2">Auditoría externa</h3>
              <p className="text-body text-neutral-600">
                Nuestros estados contables son auditados por profesionales
                independientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Informes */}
      <section className="py-section bg-neutral-50">
        <div className="max-w-narrow mx-auto px-4">
          <h2 className="text-h2 mb-8">Informes y documentos</h2>

          <div className="space-y-4">
            {informes.map((informe) => (
              <div
                key={informe.id}
                className="flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-xl hover:border-primary-500/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-body font-semibold text-neutral-900">
                      {informe.titulo}
                    </h3>
                    <p className="text-body-sm text-neutral-500">
                      {informe.tipo} · {formatDate(informe.fecha)}
                    </p>
                  </div>
                </div>
                <a
                  href={informe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-600 text-body-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}