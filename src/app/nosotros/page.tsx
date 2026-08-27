import { jsonLdScript } from '@/lib/json-ld'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { Trayectoria } from '@/components/home/Trayectoria'
import { generatePageMetadata } from '@/lib/metadata'
import {
  Users,
  Target,
  ArrowRight,
  Heart,
  Handshake,
  ShieldCheck,
  Scale,
  Eye,
  Award,
} from 'lucide-react'

// generatePageMetadata siempre setea `images` — evita la trampa de herencia
// de Next (una ruta con openGraph propio sin `images` no hereda el
// opengraph-image del layout raíz). `path` nested (no Home) => sin
// appendSiteName: el título queda plano y el template del layout raíz
// agrega el sufijo " — Usina de Justicia" una sola vez.
export const metadata = generatePageMetadata({
  title: 'Nosotros',
  description:
    'Usina de Justicia es una Asociación Civil apartidaria que desde 2014 acompaña a las víctimas de homicidio y femicidio y trabaja por una justicia que contemple sus derechos.',
  path: '/nosotros',
})

// mainEntity referencia por @id al NGO consolidado del layout raíz
// (src/app/layout.tsx) en vez de declarar un segundo NGO anidado y
// duplicado — patrón estándar de JSON-LD para reusar una entidad ya
// definida en otra parte del mismo documento/sitio.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Nosotros — Usina de Justicia',
  description:
    'Historia, misión y valores de Usina de Justicia, Asociación Civil por los derechos de las víctimas de homicidio y femicidio.',
  url: 'https://www.usinadejusticia.org.ar/nosotros',
  mainEntity: {
    '@id': 'https://www.usinadejusticia.org.ar/#organization',
  },
}

// Copy aprobado en la migración previa (fuente: página WP "Nosotros", id 94).
const valores = [
  {
    nombre: 'Integridad',
    icon: ShieldCheck,
    descripcion:
      'Actuamos con honestidad y coherencia en cada acción que emprendemos.',
  },
  {
    nombre: 'Solidaridad',
    icon: Heart,
    descripcion:
      'Acompañamos a las familias con empatía, desde el dolor compartido.',
  },
  {
    nombre: 'Compromiso',
    icon: Handshake,
    descripcion:
      'Sostenemos nuestra labor con dedicación constante y voluntaria.',
  },
  {
    nombre: 'Equidad',
    icon: Scale,
    descripcion:
      'Trabajamos para que todas las víctimas tengan acceso igualitario a la justicia.',
  },
  {
    nombre: 'Transparencia',
    icon: Eye,
    descripcion:
      'Rendimos cuentas de nuestra gestión y recursos de forma abierta.',
  },
]

// Nuestra historia (origen, previo a la fundación) — fuente: página WP
// "Nosotros" (id 94), sección de texto libre debajo del image-box "Nuestra
// historia". Se completa con el dato de Emma Cibotti, cofundadora que se
// separó de la organización al año siguiente de la fundación, ausente en la
// migración previa.
const hitos = [
  {
    año: '2011',
    titulo: 'El origen',
    descripcion:
      'Usina de Justicia se gestó cuando Diana Cohen Agrest, Doctora en Filosofía (UBA) y colaboradora de medios gráficos nacionales, recibió la noticia del asesinato de su hijo Ezequiel, un joven estudiante de 26 años a punto de graduarse, en un robo. Ese dolor se transformó en la decisión de estudiar por qué el sistema penal no había podido evitarlo y en luchar por justicia.',
  },
  {
    año: '2013',
    titulo: 'La voz escrita',
    descripcion:
      'Se publica "Ausencia Perpetua. Inseguridad y Trampas de la (in)Justicia", un libro que visibiliza la realidad de las víctimas en el sistema judicial argentino y le valió a Diana el reconocimiento de profesionales del Derecho.',
  },
  {
    año: '2014',
    titulo: 'La exposición que conmovió',
    descripcion:
      'La fotógrafa Patricia Terán propone una muestra con los rostros de jóvenes muertos en democracia, olvidados y sin reconocimiento. El Centro Recoleta cobija la exposición, para la cual los padres de esos jóvenes aportaron una foto de sus hijos.',
  },
  {
    año: '2014',
    titulo: 'Fundación oficial',
    descripcion:
      'El 12 de noviembre de 2014 se funda oficialmente Usina de Justicia como Asociación Civil. En sus comienzos fue acompañada por una segunda fundadora, Emma Cibotti, madre de una víctima vial, quien al año siguiente se separó de Usina de Justicia para continuar su tarea en su propia asociación de víctimas de siniestros viales.',
  },
]

const objetivos = [
  'Acompañar a los familiares de víctimas de homicidio y femicidio, brindándoles apoyo emocional y asesoramiento legal.',
  'Promover los derechos y alentar la participación de las víctimas en el proceso penal y en la ejecución de las penas, en paridad de condiciones con las del imputado y el agente fiscal.',
  'Impulsar políticas públicas para mejorar la prevención de conductas delictivas graves.',
]

// Agradecimientos — fuente: página WP "Agradecimientos" (id 22579), sección
// "Voces de Gratitud". Por su extensión acotada (9 testimonios cortos), la
// decisión editorial (MAPA-MIGRACION.md §4) es fusionarla como sección de
// /nosotros en lugar de crear una ruta propia.
const agradecimientos = [
  {
    texto:
      'Gracias por haber acompañado en un momento del proceso judicial por el Femicidio de mi hija Chiara Páez. Que el amor y la luz de esta Navidad nos inspire a seguir luchando por un mundo más justo.',
    nombre: 'Verónica Camargo',
    rol: 'Familia de víctima',
  },
  {
    texto: 'Gracias por ser la voz de tantos ciudadanos que quedamos perplejos ante semejante injusticia.',
    nombre: 'lucylorenzogranados',
    rol: 'Seguidora',
  },
  {
    texto: '¡Que el maravilloso trabajo de Usina tenga sus merecidos frutos! Maravillosa la tarea que hacen.',
    nombre: 'Monica Haftel',
    rol: 'Ciudadana',
  },
  {
    texto:
      'La vida de las familias de víctimas es un antes y después. Un placer ser protagonistas de un cambio en esta JUSTICIA INJUSTA de este país. ¡Por un 2026 lleno de JUSTICIA JUSTA PARA TODOS!',
    nombre: 'Victoria C.',
    rol: 'Hermana de víctima',
  },
  {
    texto: 'Estimados e imprescindibles, mis bendiciones, y gracias por lo que hacen.',
    nombre: 'Graciela',
    rol: 'Comunidad',
  },
  {
    texto: 'Gracias por el gran apoyo que brindan, en nuestro caso por ELVIRA FABARO!!!',
    nombre: 'Seguidor',
    rol: 'Agradecimiento',
  },
  {
    texto: 'Gracias a vos y a todo el equipo de Usina de justicia por estar siempre.',
    nombre: 'Nora R.',
    rol: 'Viuda de víctima',
  },
  {
    texto: 'Gracias por lo que hacen.',
    nombre: 'gra_gracegra',
    rol: 'Seguidora',
  },
  {
    texto: 'Felicitaciones por su noble e inmensa tarea.',
    nombre: 'Liliana Ponte',
    rol: 'Colaboradora',
  },
]

function initials(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export default function NosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Nosotros', href: '/nosotros' }]} />
      </div>

      {/* Hero */}
      <section className="pb-16 md:pb-20 pt-2 md:pt-4">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Usina de Justicia
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Nosotros
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Somos un grupo de víctimas que han perdido un ser querido en situaciones
            violentas y profesionales de distintas especialidades que voluntariamente
            trabajan y apoyan nuestra labor.
          </p>
          <p className="mt-4 text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Somos una Asociación Civil apartidaria que desde 2014 trabajamos para
            acompañar a las víctimas de homicidio y femicidio y recuperar una Justicia
            justa que contemple a estas víctimas.
          </p>
        </div>
      </section>

      {/* Objetivos */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xs bg-navy-50 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-navy-600" aria-hidden="true" />
            </div>
            <h2 className="font-display font-bold text-h2 text-ink">Nuestros objetivos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {objetivos.map((obj, i) => (
              <div key={i} className="p-6 bg-white border border-grey-200 rounded-xs">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-navy-600 text-white text-body-sm font-bold mb-4">
                  {i + 1}
                </span>
                <p className="text-body-sm text-grey-700 leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink text-center mb-10">
            Nuestros valores
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {valores.map((valor) => {
              const Icon = valor.icon
              return (
                <div key={valor.nombre} className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-bold text-body text-ink mb-1">
                    {valor.nombre}
                  </h3>
                  <p className="text-body-sm text-grey-700">{valor.descripcion}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nuestra historia (origen) */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-narrow mx-auto px-4 md:px-10">
          <h2 className="font-display font-bold text-h2 text-ink mb-10">Nuestra historia</h2>
          <ol className="relative pl-7 list-none m-0 p-0">
            <div className="absolute left-[6px] top-2 bottom-2 w-0.5 bg-navy-100" aria-hidden="true" />
            {hitos.map((hito, i) => (
              <li key={`${hito.año}-${hito.titulo}`} className={`relative ${i === hitos.length - 1 ? '' : 'pb-9'}`}>
                <span className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-warning" />
                <div className="font-display font-extrabold text-[22px] text-warning">{hito.año}</div>
                <div className="font-display font-bold text-body text-ink mt-0.5 mb-1.5">{hito.titulo}</div>
                <div className="text-body-sm text-grey-700 leading-relaxed">{hito.descripcion}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Timeline institucional (mismo componente que en Home) */}
      <Trayectoria />

      {/* Voces de gratitud (agradecimientos) */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="max-w-[760px] mb-11">
            <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600">
              Agradecimientos
            </p>
            <h2 className="font-display font-extrabold text-ink text-[clamp(1.875rem,3.2vw,2.75rem)] mt-2.5 mb-3.5">
              Voces de gratitud.
            </h2>
            <p className="text-body text-grey-700 leading-relaxed">
              Palabras que nos inspiran a seguir construyendo una justicia más humana.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
            {agradecimientos.map((a) => (
              <li
                key={`${a.nombre}-${a.texto.slice(0, 12)}`}
                className="bg-white border border-grey-200 rounded-xs p-6 flex flex-col"
              >
                <p className="text-body-sm text-grey-800 leading-relaxed flex-1">“{a.texto}”</p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-grey-100">
                  <div
                    className="w-9 h-9 rounded-full bg-navy-600 text-white flex items-center justify-center font-display font-bold text-[13px] shrink-0"
                    aria-hidden="true"
                  >
                    {initials(a.nombre)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-caption text-navy-700 truncate">{a.nombre}</p>
                    <p className="text-[11px] text-grey-600 uppercase tracking-[0.06em] font-bold">{a.rol}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Links a subpáginas */}
      <section className="py-16 md:py-20">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <div className="grid md:grid-cols-3 gap-5">
            <Link
              href="/nosotros/equipo"
              className="group block bg-white border border-grey-200 rounded-xs p-7 no-underline hover:no-underline hover:border-navy-300 hover:shadow-md transition-all duration-base ease-out"
            >
              <Users className="w-7 h-7 text-navy-600 mb-4" strokeWidth={1.75} aria-hidden="true" />
              <h2 className="font-display font-bold text-navy-800 text-xl mb-2">Nuestro equipo</h2>
              <p className="text-body-sm text-grey-700 leading-relaxed">
                Conocé a las personas que hacen posible nuestro trabajo diario por los
                derechos de las víctimas.
              </p>
              <span className="inline-flex items-center gap-1.5 text-body-sm font-bold text-navy-600 mt-5">
                Conocer al equipo
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-base ease-out" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/nosotros/distinciones"
              className="group block bg-white border border-grey-200 rounded-xs p-7 no-underline hover:no-underline hover:border-navy-300 hover:shadow-md transition-all duration-base ease-out"
            >
              <Award className="w-7 h-7 text-navy-600 mb-4" strokeWidth={1.75} aria-hidden="true" />
              <h2 className="font-display font-bold text-navy-800 text-xl mb-2">Distinciones</h2>
              <p className="text-body-sm text-grey-700 leading-relaxed">
                Reconocimientos institucionales, premios y declaraciones de interés
                recibidos por Usina de Justicia.
              </p>
              <span className="inline-flex items-center gap-1.5 text-body-sm font-bold text-navy-600 mt-5">
                Ver distinciones
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-base ease-out" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/nosotros/transparencia"
              className="group block bg-white border border-grey-200 rounded-xs p-7 no-underline hover:no-underline hover:border-navy-300 hover:shadow-md transition-all duration-base ease-out"
            >
              <Eye className="w-7 h-7 text-navy-600 mb-4" strokeWidth={1.75} aria-hidden="true" />
              <h2 className="font-display font-bold text-navy-800 text-xl mb-2">Transparencia institucional</h2>
              <p className="text-body-sm text-grey-700 leading-relaxed">
                Memorias y balances certificados, disponibles para consulta pública.
              </p>
              <span className="inline-flex items-center gap-1.5 text-body-sm font-bold text-navy-600 mt-5">
                Ver documentos
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-base ease-out" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
