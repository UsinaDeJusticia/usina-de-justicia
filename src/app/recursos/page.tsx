import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { FileText, Download, BookOpen, Wrench } from 'lucide-react'
import { formatDate, formatFileSize } from '@/lib/utils'
import type { Recurso } from '@/types'

export const metadata: Metadata = {
  title: 'Recursos y Publicaciones',
  description:
    'Descargá informes, guías y publicaciones de Usina de Justicia sobre derechos de las víctimas del delito.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/recursos' },
}

const recursos: Recurso[] = [
  {
    id: '1',
    titulo: 'Informe anual de gestión',
    slug: 'informe-anual-gestion',
    descripcion: 'Informe completo sobre las actividades y logros del último año.',
    tipo: 'informe',
    archivo: { url: '#', name: 'informe-anual.pdf', size: 2400, format: 'pdf' },
    fechaPublicacion: '2025-06-01',
    tags: [],
  },
  {
    id: '2',
    titulo: 'Guía de derechos para víctimas del delito',
    slug: 'guia-derechos-victimas',
    descripcion: 'Guía práctica con información sobre los derechos de las víctimas del delito en Argentina.',
    tipo: 'guia',
    archivo: { url: '#', name: 'guia-derechos.pdf', size: 1800, format: 'pdf' },
    fechaPublicacion: '2025-03-15',
    tags: [],
  },
  {
    id: '3',
    titulo: 'Publicación: La víctima en el proceso penal',
    slug: 'victima-proceso-penal',
    descripcion: 'Análisis sobre el rol de la víctima en el proceso penal argentino.',
    tipo: 'publicacion',
    archivo: { url: '#', name: 'victima-proceso-penal.pdf', size: 3200, format: 'pdf' },
    fechaPublicacion: '2024-11-10',
    tags: [],
  },
]

const tipoLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  publicacion: { label: 'Publicación', icon: <BookOpen className="w-5 h-5" /> },
  informe: { label: 'Informe', icon: <FileText className="w-5 h-5" /> },
  guia: { label: 'Guía', icon: <BookOpen className="w-5 h-5" /> },
  herramienta: { label: 'Herramienta', icon: <Wrench className="w-5 h-5" /> },
}

export default function RecursosPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Recursos', href: '/recursos' }]} />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display mb-4">Recursos y Publicaciones</h1>
          <p className="text-body-lg text-neutral-600 max-w-narrow mb-12">
            Informes, guías y publicaciones sobre derechos de las víctimas del
            delito. Todos los recursos son de acceso libre y gratuito.
          </p>

          <div className="space-y-4">
            {recursos.map((recurso) => {
              const tipo = tipoLabels[recurso.tipo]

              return (
                <div
                  key={recurso.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-neutral-200 rounded-xl hover:border-primary-500/30 hover:shadow-md transition-all"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                      {tipo.icon}
                    </div>
                    <div>
                      <span className="text-body-sm text-primary-500 font-medium">
                        {tipo.label}
                      </span>
                      <h2 className="text-h4 text-neutral-900 mt-1">{recurso.titulo}</h2>
                      <p className="text-body-sm text-neutral-600 mt-1">
                        {recurso.descripcion}
                      </p>
                      <p className="text-body-sm text-neutral-400 mt-2">
                        {formatDate(recurso.fechaPublicacion)} ·{' '}
                        {recurso.archivo.format.toUpperCase()} ·{' '}
                        {formatFileSize(recurso.archivo.size)}
                      </p>
                    </div>
                  </div>

                  <a
                    href={recurso.archivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-lg text-body-sm font-semibold transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}