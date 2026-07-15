import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import {
  ListaDocumentos,
  type DocumentoRecurso,
} from '@/components/recursos/ListaDocumentos'
import { DocumentosPagina } from '@/components/recursos/DocumentosPagina'
import { SITE_SECTIONS, type SiteSection } from '@/types/wordpress'
import postsData from '../../../docs/inventario/posts.json'

export const metadata: Metadata = {
  title: 'Recursos y Publicaciones',
  description:
    'Descargá informes, guías y publicaciones de Usina de Justicia sobre derechos de las víctimas del delito.',
  alternates: { canonical: 'https://www.usinadejusticia.org.ar/recursos' },
}

// Shape del inventario de posts migrados desde WordPress (docs/inventario/posts.json,
// generado en Fase 1/2 — ver docs/MAPA-MIGRACION.md). `categorias` usa las 16
// categorías legacy de WP, previas a la reasignación de Fase 2 a las 6
// secciones nuevas del sitio (types/wordpress.ts LEGACY_CATEGORY_MAP). Ese
// mapa es solo referencia histórica (ya no lo usa el frontend, y su
// taxonomía intermedia -medios/actividades/informativo- no coincide con
// SITE_SECTIONS) así que acá se arma un mapeo propio, directo a las 6
// secciones finales, para las 10 categorías legacy que efectivamente
// aparecen en los posts con PDF adjunto.
interface InventarioPost {
  id: number
  slug: string
  titulo: string
  fecha: string
  categorias: string[]
  pdfs: string[]
}

// v1 — sourced directo de docs/inventario/posts.json (todo post con al menos
// un PDF adjunto, uno por fila). Se reemplaza cuando el CPT "Documentos" del
// plugin usina-headless (v0.4, pendiente) esté disponible y exponga estos
// archivos como contenido propio en vez de derivarse de los posts de noticias.
const posts = postsData as InventarioPost[]

// Mapeo directo (legacy → sección final), basado en la correspondencia semántica
// de cada categoría vieja con la descripción ya aprobada de SITE_SECTIONS.
const CATEGORIA_LEGACY_A_SECCION: Record<string, SiteSection> = {
  'acompanamiento-a-victimas-de-homicidio': 'acompanamiento',
  'medios-y-entrevistas': 'prensa', // SITE_SECTIONS.prensa: "Medios y entrevistas..."
  'incidencia-en-politicas-publicas': 'incidencia',
  'debatesyconferencias': 'incidencia',
  'institucional': 'institucional',
  'capacitacion': 'institucional',
  'historias': 'historias',
  'boletin-informativo': 'observatorio', // SITE_SECTIONS.observatorio: "Informes, publicaciones y datos"
  'estadisticas': 'observatorio',
  'publicaciones': 'observatorio',
}

const documentos: DocumentoRecurso[] = posts
  .filter((post) => post.pdfs.length > 0)
  .flatMap((post) => {
    const categoriaLegacy = post.categorias[0]
    const seccion = categoriaLegacy ? CATEGORIA_LEGACY_A_SECCION[categoriaLegacy] : undefined
    const categoriaLabel = seccion ? SITE_SECTIONS[seccion].title : 'Institucional'

    return post.pdfs.map((url, i) => ({
      key: `${post.id}-${i}`,
      titulo: post.titulo,
      fecha: post.fecha,
      categoriaLabel,
      url,
    }))
  })
  .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

// Página estática: la paginación por `?page=N` ya no depende de
// searchParams del lado del servidor (única causa de que /recursos se
// sirviera dinámica por request) — se resuelve en el cliente dentro de
// <ListaDocumentos>, envuelta acá en <Suspense> porque usa useSearchParams().
//
// Fix SEO (Fase 4 / Ola C): el fallback de ese <Suspense> era `null`, así
// que un crawler sin JS (o cualquier request antes de que hidrate el
// cliente) no veía ninguno de los 88 documentos. El fallback ahora es
// <DocumentosPagina> con la página 1 (los primeros 15) renderizada en el
// servidor — HTML estático e indexable — que el cliente reemplaza sin saltos
// visuales apenas hidrata (mismo componente, misma marca).
export default function RecursosPage() {
  return (
    <>
      <div className="max-w-content mx-auto px-4 md:px-10">
        <Breadcrumbs items={[{ label: 'Recursos', href: '/recursos' }]} />
      </div>

      {/* Hero */}
      <section className="pb-16 md:pb-20 pt-2 md:pt-4">
        <div className="max-w-content mx-auto px-4 md:px-10">
          <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-navy-600 mb-2.5">
            Usina de Justicia
          </p>
          <h1 className="font-display font-extrabold text-ink text-[clamp(2rem,4vw,2.75rem)] leading-tight mb-4">
            Recursos y publicaciones
          </h1>
          <p className="text-body-lg text-grey-700 max-w-narrow leading-relaxed">
            Informes, amicus curiae, estadísticas y otros documentos publicados por
            Usina de Justicia. Todos los recursos son de acceso libre y gratuito.
          </p>
        </div>
      </section>

      {/* Documentos */}
      <section className="py-16 md:py-20 bg-ivory border-t border-grey-200">
        <div className="max-w-narrow mx-auto px-4 md:px-10">
          <Suspense
            fallback={<DocumentosPagina documentos={documentos} currentPage={1} />}
          >
            <ListaDocumentos documentos={documentos} />
          </Suspense>
        </div>
      </section>
    </>
  )
}
