import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { FileText, Download, CheckCircle, BarChart3, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Transparencia',
  description:
    'Memorias y balances certificados de Usina de Justicia. Documentos institucionales de acceso público.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/nosotros/transparencia' },
}

// Fuente: página WP "Transparencia institucional" (id 21247), botones de
// descarga en vivo. Reemplaza a las URLs de la migración previa (que
// apuntaban a versiones más viejas de los mismos PDF) y agrega los años 2024
// y 2025, ausentes hasta ahora. El botón "Año 2026" existe en el WP fuente
// sin archivo adjunto (role="button" sin href) — se refleja igual acá como
// pendiente, sin inventar un enlace.
const informes = [
  {
    id: '2026',
    titulo: 'Memoria y Balance — Año 2026',
    url: null,
  },
  {
    id: '2025',
    titulo: 'Memoria y Balance — Año 2025',
    url: 'https://usinadejusticia.org.ar/wp-content/uploads/2026/05/USINA-DE-JUSTICIA-MEMORIA-Y-BALANCE-2025-LEGALIZADO.pdf',
  },
  {
    id: '2024',
    titulo: 'Memoria y Balance — Año 2024',
    url: 'https://usinadejusticia.org.ar/wp-content/uploads/2026/05/USINA-DE-JUSTICIA-MEMORIA-Y-BALANCE-2024-LEGALIZADO.pdf',
  },
  {
    id: '2023',
    titulo: 'Memoria y Balance — Año 2023',
    url: 'https://usinadejusticia.org.ar/wp-content/uploads/2024/09/USINA-BALANCE-CERTIFICADO-2023_compressed.pdf',
  },
  {
    id: '2022',
    titulo: 'Memoria y Balance — Año 2022',
    url: 'https://usinadejusticia.org.ar/wp-content/uploads/2024/09/USINA-BALANCE-CERTIFICADO-2022_compressed.pdf',
  },
  {
    id: '2021',
    titulo: 'Memoria y Balance — Año 2021',
    url: 'https://usinadejusticia.org.ar/wp-content/uploads/2024/09/USINA-BALANCE-CERTIFICADO-2021_compressed.pdf',
  },
] as const

export default function TransparenciaPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs
          items={[
            { label: 'Nosotros', href: '/nosotros' },
            { label: 'Transparencia', href: '/nosotros/transparencia' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="pb-16 md:pb-20 pt-2 md:pt-4">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Nosotros
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Transparencia institucional
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Creemos en la rendición de cuentas como pilar fundamental de nuestra
            organización. Acá podés consultar nuestras memorias y balances
            certificados.
          </p>
        </div>
      </section>

      {/* Compromisos */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink text-center mb-10">
            Nuestro compromiso
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="text-center p-6 bg-white border border-grey-200 rounded-xs">
              <div className="w-12 h-12 rounded-full bg-success-bg text-success flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-body text-ink mb-2">
                Rendición de cuentas
              </h3>
              <p className="text-body-sm text-grey-700 leading-relaxed">
                Publicamos anualmente nuestros informes de gestión y estados
                contables auditados.
              </p>
            </div>
            <div className="text-center p-6 bg-white border border-grey-200 rounded-xs">
              <div className="w-12 h-12 rounded-full bg-navy-50 text-navy-600 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-body text-ink mb-2">
                Datos abiertos
              </h3>
              <p className="text-body-sm text-grey-700 leading-relaxed">
                Nuestros informes son de acceso público y pueden ser consultados por
                cualquier persona.
              </p>
            </div>
            <div className="text-center p-6 bg-white border border-grey-200 rounded-xs">
              <div className="w-12 h-12 rounded-full bg-warning-bg text-warning flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-display font-bold text-body text-ink mb-2">
                Auditoría externa
              </h3>
              <p className="text-body-sm text-grey-700 leading-relaxed">
                Nuestros estados contables son auditados por profesionales
                independientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Informes */}
      <section className="py-16 md:py-20">
        <div className="max-w-narrow mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink mb-8">
            Informes y documentos
          </h2>

          <div className="space-y-4">
            {informes.map((informe) => (
              <div
                key={informe.id}
                className="flex items-center justify-between gap-4 p-5 bg-white border border-grey-200 rounded-xs hover:border-navy-300 hover:shadow-md transition-all duration-base ease-out"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xs bg-navy-50 text-navy-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-body text-ink truncate">
                      {informe.titulo}
                    </h3>
                    <p className="text-body-sm text-grey-600">Memoria y Balance certificado</p>
                  </div>
                </div>
                {informe.url ? (
                  <a
                    href={informe.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-navy-600 hover:text-navy-700 text-body-sm font-bold transition-colors duration-base ease-out shrink-0"
                  >
                    <Download className="w-4 h-4" aria-hidden="true" />
                    Descargar
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-grey-500 text-body-sm font-bold shrink-0">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    Próximamente
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
