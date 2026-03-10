import type { Metadata } from 'next'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Linkedin, Mail } from 'lucide-react'
import type { MiembroEquipo } from '@/types'

export const metadata: Metadata = {
  title: 'Nuestro Equipo',
  description:
    'Conocé al equipo de Usina de Justicia. Profesionales comprometidos con la defensa de los derechos de las víctimas del delito.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/sobre-nosotros/equipo' },
}

const equipo: MiembroEquipo[] = [
  {
    id: '1',
    nombre: 'Nombre Apellido',
    cargo: 'Presidente',
    bio: 'Breve descripción del rol y trayectoria.',
    orden: 1,
    area: 'direccion',
  },
  {
    id: '2',
    nombre: 'Nombre Apellido',
    cargo: 'Directora Ejecutiva',
    bio: 'Breve descripción del rol y trayectoria.',
    orden: 2,
    area: 'direccion',
  },
  {
    id: '3',
    nombre: 'Nombre Apellido',
    cargo: 'Asesor Legal',
    bio: 'Breve descripción del rol y trayectoria.',
    orden: 3,
    area: 'legal',
  },
  {
    id: '4',
    nombre: 'Nombre Apellido',
    cargo: 'Coordinadora de Programas',
    bio: 'Breve descripción del rol y trayectoria.',
    orden: 4,
    area: 'colaboradores',
  },
]

const areaLabels: Record<string, string> = {
  direccion: 'Dirección',
  legal: 'Equipo Legal',
  colaboradores: 'Colaboradores',
}

export default function EquipoPage() {
  const areas = ['direccion', 'legal', 'colaboradores'] as const

  return (
    <>
      <div className="max-w-content mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
            { label: 'Equipo', href: '/sobre-nosotros/equipo' },
          ]}
        />
      </div>

      <section className="py-section">
        <div className="max-w-content mx-auto px-4">
          <h1 className="text-h1 lg:text-display mb-4">Nuestro Equipo</h1>
          <p className="text-body-lg text-neutral-600 max-w-narrow mb-12">
            Profesionales comprometidos con la defensa de los derechos de las
            víctimas del delito en Argentina.
          </p>

          {areas.map((area) => {
            const miembros = equipo.filter((m) => m.area === area)
            if (miembros.length === 0) return null

            return (
              <div key={area} className="mb-16 last:mb-0">
                <h2 className="text-h3 mb-8 pb-3 border-b border-neutral-200">
                  {areaLabels[area]}
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {miembros
                    .sort((a, b) => a.orden - b.orden)
                    .map((miembro) => (
                      <div
                        key={miembro.id}
                        className="bg-neutral-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
                          {miembro.foto ? (
                            <Image
                              src={miembro.foto.url}
                              alt={miembro.nombre}
                              width={80}
                              height={80}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-h3 text-primary-500 font-bold">
                              {miembro.nombre
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </span>
                          )}
                        </div>

                        <h3 className="text-h4 text-neutral-900">{miembro.nombre}</h3>
                        <p className="text-body-sm text-primary-500 font-medium mt-1">
                          {miembro.cargo}
                        </p>
                        <p className="text-body-sm text-neutral-600 mt-3">
                          {miembro.bio}
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                          {miembro.email && (
                            <a
                              href={`mailto:${miembro.email}`}
                              className="text-neutral-400 hover:text-primary-500 transition-colors"
                              aria-label={`Email de ${miembro.nombre}`}
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                          {miembro.linkedin && (
                            <a
                              href={miembro.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-400 hover:text-primary-500 transition-colors"
                              aria-label={`LinkedIn de ${miembro.nombre}`}
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}