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

// Comisión Directiva confirmada por Emanuel (11-ago-2026) — primera vez que
// hay una nómina real de equipo (antes no existía en ningún WordPress
// migrado, ver docs/ESTADO.md). Fotos recibidas el 18-ago-2026 (retratos
// profesionales, mismo fondo de estudio) y ubicadas en
// public/images/equipo/ — sin bio todavía, no se inventa ninguna.
const equipo: MiembroEquipo[] = [
  {
    id: '1',
    nombre: 'Diana Cohen Agrest',
    cargo: 'Presidente',
    orden: 1,
    area: 'comision-directiva',
    foto: {
      url: '/images/equipo/diana-cohen-agrest.png',
      alt: 'Diana Cohen Agrest',
      width: 1122,
      height: 1402,
    },
  },
  {
    id: '2',
    nombre: 'Raquel Slotolow',
    cargo: 'Secretaria',
    orden: 2,
    area: 'comision-directiva',
    foto: {
      url: '/images/equipo/raquel-slotolow.png',
      alt: 'Raquel Slotolow',
      width: 1122,
      height: 1402,
    },
  },
  {
    id: '3',
    nombre: 'Guillermo Bargna',
    cargo: 'Tesorero',
    orden: 3,
    area: 'comision-directiva',
    foto: {
      url: '/images/equipo/guillermo-bargna.png',
      alt: 'Guillermo Bargna',
      width: 1122,
      height: 1402,
    },
  },
  {
    id: '4',
    nombre: 'Raquel Berthi',
    cargo: 'Vocal',
    orden: 4,
    area: 'comision-directiva',
    foto: {
      url: '/images/equipo/raquel-berthi.png',
      alt: 'Raquel Berthi',
      width: 1122,
      height: 1402,
    },
  },
  {
    id: '5',
    nombre: 'Roberto Picozzi',
    cargo: 'Vocal',
    orden: 5,
    area: 'comision-directiva',
    foto: {
      url: '/images/equipo/roberto-picozzi.png',
      alt: 'Roberto Picozzi',
      width: 1122,
      height: 1402,
    },
  },
  {
    id: '6',
    nombre: 'Mariana Romano',
    cargo: 'Vocal',
    orden: 6,
    area: 'comision-directiva',
    foto: {
      url: '/images/equipo/mariana-romano.png',
      alt: 'Mariana Romano',
      width: 1122,
      height: 1402,
    },
  },
]

// 'legal' y 'colaboradores' quedan vacías por ahora (el render las omite,
// ver `if (miembros.length === 0) return null` abajo) — a la espera de que
// Emanuel confirme si hay perfiles reales para sumar ahí además de la
// Comisión Directiva.
const areaLabels: Record<string, string> = {
  'comision-directiva': 'Comisión Directiva',
  legal: 'Equipo Legal',
  colaboradores: 'Colaboradores',
}

export default function EquipoPage() {
  const areas = ['comision-directiva', 'legal', 'colaboradores'] as const

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
                        {miembro.bio && (
                          <p className="text-body-sm text-grey-700 mt-3 leading-relaxed">
                            {miembro.bio}
                          </p>
                        )}

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
