import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Camera, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Album } from '@/types'

export const metadata: Metadata = {
  title: 'Galería',
  description:
    'Galería de fotos de eventos, actividades y encuentros de Usina de Justicia.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/galeria' },
}

const albumes: Album[] = [
  {
    id: '1',
    titulo: 'Jornada de capacitación 2025',
    slug: 'jornada-capacitacion-2025',
    descripcion: 'Fotos de la jornada de capacitación sobre derechos de víctimas.',
    fecha: '2025-09-15',
    fotos: [],
    imagenPortada: {
      url: '',
      alt: 'Jornada de capacitación 2025',
      width: 800,
      height: 600,
    },
  },
  {
    id: '2',
    titulo: 'Encuentro anual de la red de víctimas',
    slug: 'encuentro-anual-red-victimas',
    descripcion: 'Registro fotográfico del encuentro anual de la red de víctimas.',
    fecha: '2025-06-20',
    fotos: [],
    imagenPortada: {
      url: '',
      alt: 'Encuentro anual de la red de víctimas',
      width: 800,
      height: 600,
    },
  },
]

export default function GaleriaPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Galería', href: '/galeria' }]} />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display mb-4">Galería</h1>
          <p className="text-body-lg text-neutral-600 max-w-narrow mb-12">
            Fotos de nuestros eventos, actividades y encuentros.
          </p>

          {albumes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albumes.map((album) => (
                <Link
                  key={album.id}
                  href={`/galeria/${album.slug}`}
                  className="group block rounded-xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-all"
                >
                  <div className="aspect-4/3 bg-neutral-100 relative overflow-hidden">
                    {album.imagenPortada.url ? (
                      <Image
                        src={album.imagenPortada.url}
                        alt={album.imagenPortada.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-500/5">
                        <Camera className="w-10 h-10 text-primary-500/30" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-h4 text-neutral-900 group-hover:text-primary-500 transition-colors">
                      {album.titulo}
                    </h2>
                    {album.descripcion && (
                      <p className="text-body-sm text-neutral-600 mt-2 line-clamp-2">
                        {album.descripcion}
                      </p>
                    )}
                    <p className="flex items-center gap-1.5 text-body-sm text-neutral-400 mt-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(album.fecha)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Camera className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-body-lg text-neutral-500">
                Próximamente publicaremos fotos de nuestras actividades.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}