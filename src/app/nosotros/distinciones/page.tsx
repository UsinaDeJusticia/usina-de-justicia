import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { Award, ExternalLink, Landmark } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Distinciones',
  description:
    'Distinciones, premios y declaraciones de interés recibidos por Usina de Justicia en reconocimiento a su trabajo por los derechos de las víctimas.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/nosotros/distinciones' },
}

// Fuente: sección "Distinciones" / "Reconocimientos" incluida dentro de la
// página WP "Nosotros" (id 94). La página WP dedicada "Distinciones" (id
// 20992, slug /distinciones/) NO tiene contenido propio de Usina de
// Justicia: es una plantilla de Elementor sin publicar (copy de demo de una
// plataforma de reclutamiento, FAQ con Lorem ipsum, testimonios ficticios en
// inglés) — se descarta como fuente y se usa el contenido real de la página
// "Nosotros" en su lugar. El campo `tipo` clasifica cada título usando las
// mismas palabras del título original (no agrega datos nuevos).
const distinciones = [
  {
    titulo: 'Laurel de Plata a la Personalidad del Año',
    tipo: 'Distinción',
    detalle:
      'Otorgado a Diana Cohen Agrest por el Rotary Club de Buenos Aires en su Fiesta de los Lauros 2023.',
    url: 'https://usinadejusticia.org.ar/2023/06/15/el-rotary-club-de-buenos-aires-realizo-su-fiesta-de-los-lauros-con-entrega-de-distinciones-anuales-2023-diana-cohen-agrest-recibio-el-laurel-de-plata-a-la-personalidad-del-ano/',
  },
  {
    titulo: 'Acto de designación de Socia Honoraria',
    tipo: 'Distinción honorífica',
    detalle: null,
    url: 'https://www.youtube.com/watch?v=ZOAiL9FXrVY',
  },
  {
    titulo: 'UJ declarada de interés legislativo por el Consejo Deliberante de Tres de Febrero',
    tipo: 'Interés legislativo',
    detalle: null,
    url: 'https://usinadejusticia.org.ar/2017/10/03/uj-declarada-de-interes-legislativo-por-tres-de-febrero/',
  },
  {
    titulo:
      'UJ declarada de interés provincial y legislativo por el Senado de la Provincia de Buenos Aires',
    tipo: 'Interés provincial y legislativo',
    detalle: null,
    url: 'https://usinadejusticia.org.ar/2017/06/08/usina-de-justicia-declarada-de-interes-provincial-y-legislativo-provincia-de-buenos-aires/',
  },
  {
    titulo: 'Premio Defensor De La República',
    tipo: 'Premio',
    detalle: 'Otorgado por el Ateneo Cultural Juan Bautista Alberdi de Vicente López.',
    url: 'https://usinadejusticia.org.ar/2017/05/12/premio-defensor-de-la-republica-por-los-derechos-de-las-victimas-diana-cohen-agrest/',
  },
  {
    titulo:
      'UJ declarada de interés jurídico por la Legislatura de la Ciudad Autónoma de Buenos Aires',
    tipo: 'Interés jurídico',
    detalle: null,
    // El enlace original en la fuente WP está truncado/roto
    // ("...usina-de-justi"); se omite en vez de enlazar una URL inválida.
    url: null,
  },
]

// Reconocimientos a personas — misma sección de la página WP "Nosotros".
const reconocimientosPersonas = [
  { nombre: 'Pedro Pablo Benítez', motivo: 'Proyecto entrevistas a familiar de víctima' },
  { nombre: 'Daniel Cirigliano', motivo: 'Diseño de póster científico' },
  { nombre: 'Picú Olivera', motivo: 'Plantación de árbol conmemorativo víctimas' },
  { nombre: 'Lic. Fernanda Lo Presti', motivo: 'Acompañamiento a víctimas' },
]

// Reconocimientos a instituciones — de las cuatro columnas de la sección
// "Reconocimientos - Instituciones" en la fuente WP, solo esta tenía
// contenido de texto (las otras tres estaban vacías, probablemente logos sin
// texto alternativo capturado).
const reconocimientosInstituciones = ['Legislatura de la Ciudad Autónoma de Buenos Aires']

export default function DistincionesPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs
          items={[
            { label: 'Nosotros', href: '/nosotros' },
            { label: 'Distinciones', href: '/nosotros/distinciones' },
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
            Distinciones
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Reconocimientos institucionales, premios y declaraciones de interés
            recibidos a lo largo de nuestra trayectoria.
          </p>
        </div>
      </section>

      {/* Distinciones */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xs bg-navy-50 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-navy-600" aria-hidden="true" />
            </div>
            <h2 className="font-display font-bold text-h2 text-ink">Distinciones</h2>
          </div>

          <ul className="grid md:grid-cols-2 gap-5 list-none p-0 m-0">
            {distinciones.map((d) => (
              <li key={d.titulo} className="bg-white border border-grey-200 rounded-xs p-6">
                <Badge tone="navy" className="mb-3">
                  {d.tipo}
                </Badge>
                <h3 className="font-display font-bold text-body text-ink leading-snug">
                  {d.titulo}
                </h3>
                {d.detalle && (
                  <p className="text-body-sm text-grey-700 leading-relaxed mt-2">{d.detalle}</p>
                )}
                {d.url && (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-body-sm font-bold text-navy-600 mt-4"
                  >
                    Ver más
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reconocimientos a personas */}
      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink mb-8">
            Reconocimientos a personas
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reconocimientosPersonas.map((r) => (
              <div key={r.nombre} className="bg-white border border-grey-200 rounded-xs p-6 text-center">
                <p className="font-display font-bold text-body text-ink">{r.nombre}</p>
                <p className="text-body-sm text-grey-700 mt-2 leading-relaxed">{r.motivo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reconocimientos a instituciones */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xs bg-navy-50 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5 text-navy-600" aria-hidden="true" />
            </div>
            <h2 className="font-display font-bold text-h2 text-ink">
              Reconocimientos a instituciones
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
            {reconocimientosInstituciones.map((nombre) => (
              <li key={nombre} className="bg-white border border-grey-200 rounded-xs p-6 text-center">
                <p className="font-display font-bold text-body text-ink">{nombre}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
