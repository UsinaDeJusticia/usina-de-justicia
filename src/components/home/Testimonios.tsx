import Link from 'next/link'

// Portado de design-system/home/Testimonios.jsx. Copy aprobado (nombres,
// fechas y jurisdicciones no se inventan ni se editan).
// El JSX de referencia usa un gradiente navy como placeholder de retrato;
// se reemplaza por un bloque navy SÓLIDO (regla de marca: no gradientes).
// Regla de contenido vinculante: nombre completo + mes/año del hecho,
// nunca recortado.
//
// El caso "Néstor Alejandro Valdez" se retiró (19-ago-2026): no tiene
// fuente rastreable en el inventario de WordPress y Emanuel confirmó que
// no hay más registros disponibles — queda incompleto, se saca en vez de
// dejarlo sin poder verificar.
const testimonios = [
  { nombre: 'Zoe Nerea Cortez', fecha: 'asesinada en marzo de 2020', jurisdiccion: 'Santa Fe' },
  { nombre: 'Pablo Flores', fecha: 'asesinado en octubre de 2020', jurisdiccion: 'La Plata' },
  { nombre: 'Lucinda Palavecino', fecha: 'asesinada en julio de 2020', jurisdiccion: 'Tucumán' },
  { nombre: 'Emiliano Pereyra Suárez', fecha: 'asesinado en agosto de 2019', jurisdiccion: 'Córdoba' },
  { nombre: 'Nadia Arrieta', fecha: 'asesinada en marzo de 2018', jurisdiccion: 'Chaco' },
  { nombre: 'Jonathan Lucas Gómez', fecha: 'asesinado en marzo de 2020', jurisdiccion: 'CABA' },
  { nombre: 'Isaías Aranda', fecha: 'asesinado en octubre de 2018', jurisdiccion: 'Salta' },
]

function initials(nombre: string) {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

export function Testimonios() {
  return (
    <section className="py-20 md:py-24 bg-ivory border-t border-grey-200">
      <div className="max-w-content mx-auto px-4 md:px-10">
        <div className="max-w-[760px] mb-12">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">Testimonios</p>
          <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] mt-2.5 mb-3.5">
            Dar voz a los que ya no la tienen.
          </h2>
          <p className="text-body text-grey-700 leading-relaxed">
            Cada nombre, cada fecha. Porque detrás de cada caso hay una familia que
            espera una respuesta de la justicia — y una sociedad que no puede mirar
            para otro lado.
          </p>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-[18px] list-none p-0 m-0">
          {testimonios.map((t) => (
            <li key={t.nombre} className="bg-white border border-grey-200">
              <div
                className="aspect-[3/4] flex items-center justify-center bg-navy-500 text-white/60 font-display font-bold text-[2.75rem]"
                aria-hidden="true"
              >
                {initials(t.nombre)}
              </div>
              <div className="px-[18px] pt-4 pb-[18px]">
                <p className="font-display font-bold text-body text-ink leading-tight">{t.nombre}</p>
                <p className="text-caption text-grey-700 mt-1.5">{t.fecha}</p>
                <p className="text-[11px] text-grey-600 mt-0.5 uppercase tracking-[0.08em] font-bold">
                  {t.jurisdiccion}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="text-center mt-9">
          <Link
            href="/noticias/categoria/historias"
            className="text-navy-600 font-bold text-body-sm underline underline-offset-4"
          >
            Ver todos los testimonios →
          </Link>
        </div>
      </div>
    </section>
  )
}
