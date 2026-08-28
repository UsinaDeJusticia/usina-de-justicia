import Image from 'next/image'

// Portado de design-system/home/Trayectoria.jsx. Copy aprobado, no se edita.
const hitos = [
  {
    year: '2014',
    title: 'Fundación',
    description:
      'Un 12 de noviembre, tras la experiencia de Diana Cohen Agrest con el proceso por el asesinato de su hijo Ezequiel.',
  },
  {
    year: '2017',
    title: 'Ley 27.372',
    description:
      'UJ participa en la elaboración y reglamentación de la Ley de Derechos y Garantías de las Personas Víctimas de Delitos.',
  },
  {
    year: '2019',
    title: 'Ingreso a la OEA',
    description: 'Como organización civil registrada ante el organismo internacional.',
  },
  {
    year: '2020',
    title: 'Observatorio Santa Fe',
    description:
      'Participación en el Observatorio de Víctimas de la Cámara de Diputados de Santa Fe.',
  },
  {
    year: '2024',
    title: '10 años',
    description:
      'Conmemoración en el Teatro Colón. Presentación del primer libro: "Nuevos paradigmas para la justicia penal".',
  },
]

export function Trayectoria() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-4 md:px-10 grid lg:grid-cols-[1fr_1.4fr] gap-14 items-start">
        <div>
          <Image
            src="/images/10anos.png"
            alt="10 años transformando la justicia"
            width={360}
            height={158}
            className="w-full max-w-[360px] h-auto"
          />
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mt-6">
            Nuestra trayectoria
          </p>
          <h2 className="font-display font-extrabold text-ink text-[clamp(1.75rem,3vw,2.5rem)] leading-snug mt-2.5 mb-4">
            Diez años transformando la justicia.
          </h2>
          <p className="text-[15px] text-grey-700 leading-[1.7]">
            Una asociación civil sin subvenciones públicas, sostenida por
            el compromiso de víctimas, profesionales y ciudadanos.
          </p>
        </div>

        <ol className="relative pl-7 list-none m-0 p-0">
          <div className="absolute left-[6px] top-2 bottom-2 w-0.5 bg-navy-100" aria-hidden="true" />
          {hitos.map((h, i) => (
            <li key={h.year} className={`relative ${i === hitos.length - 1 ? '' : 'pb-7'}`}>
              <span className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-warning" />
              {/* Año como acento cálido ámbar: número grande, contraste AA sobrado sobre blanco */}
              <div className="font-display font-extrabold text-[22px] text-warning">{h.year}</div>
              <div className="font-bold text-base mt-0.5 mb-1.5">{h.title}</div>
              <div className="text-body-sm text-grey-700 leading-relaxed max-w-[540px]">{h.description}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
