import type { Metadata } from 'next'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Linkedin, Mail } from 'lucide-react'
import type { MiembroEquipo } from '@/types'

export const metadata: Metadata = {
  title: 'Nuestro Equipo',
  description:
    'Conocé al equipo de Usina de Justicia. Profesionales comprometidos con la defensa de los derechos de las víctimas del delito.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/nosotros/equipo' },
}

// Nota: no hay una nómina de equipo publicada en el WordPress migrado (ni en
// la página "Nosotros" ni en ninguna otra fuente descargada). Se mantiene la
// estructura de datos de la migración previa a la espera de que el equipo
// editorial confirme nombres y cargos reales — no se inventan.
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
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs
          items={[
            { label: 'Nosotros', href: '/nosotros' },
            { label: 'Equipo', href: '/nosotros/equipo' },
          ]}
        />
      </div>

      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Nosotros
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Nuestro equipo
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow mb-14">
            Profesionales comprometidos con la defensa de los derechos de las víctimas
            del delito en Argentina.
          </p>

          {areas.map((area) => {
            const miembros = equipo.filter((m) => m.area === area)
            if (miembros.length === 0) return null

            return (
              <div key={area} className="mb-16 last:mb-0">
                <h2 className="font-display font-bold text-h3 text-ink mb-8 pb-3 border-b border-grey-200">
                  {areaLabels[area]}
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {miembros
                    .sort((a, b) => a.orden - b.orden)
                    .map((miembro) => (
                      <div
                        key={miembro.id}
                        className="bg-white border border-grey-200 rounded-xs p-6 hover:shadow-md transition-shadow duration-base ease-out"
                      >
                        <div className="w-20 h-20 rounded-full bg-navy-50 flex items-center justify-center mb-4">
                          {miembro.foto ? (
                            <Image
                              src={miembro.foto.url}
                              alt={miembro.nombre}
                              width={80}
                              height={80}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <span className="font-display font-bold text-h3 text-navy-600">
                              {miembro.nombre
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-body text-ink">
                          {miembro.nombre}
                        </h3>
                        <p className="text-body-sm text-navy-600 font-bold mt-1">
                          {miembro.cargo}
                        </p>
                        <p className="text-body-sm text-grey-700 mt-3 leading-relaxed">
                          {miembro.bio}
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                          {miembro.email && (
                            <a
                              href={`mailto:${miembro.email}`}
                              className="text-grey-500 hover:text-navy-600 transition-colors duration-base ease-out"
                              aria-label={`Email de ${miembro.nombre}`}
                            >
                              <Mail className="w-4 h-4" aria-hidden="true" />
                            </a>
                          )}
                          {miembro.linkedin && (
                            <a
                              href={miembro.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-grey-500 hover:text-navy-600 transition-colors duration-base ease-out"
                              aria-label={`LinkedIn de ${miembro.nombre}`}
                            >
                              <Linkedin className="w-4 h-4" aria-hidden="true" />
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
