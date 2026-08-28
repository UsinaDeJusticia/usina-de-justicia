// ============================================
// src/lib/buscador.ts
// Motor del buscador del sitio: índice en memoria con MiniSearch.
//
// Por qué no la búsqueda nativa de WP (?search=): latencia por query contra
// un origen lento (y getArticulos dispara además un fetch sin caché a
// /categories en cada llamada), sin tolerancia a typos, folding de acentos
// dependiente de la collation de la DB (no garantizado), y HTTP 400 cuando
// page > totalPages. Acá el índice se arma como mucho cada 5 minutos y cada
// búsqueda es local, en microsegundos.
//
// Este módulo es puro a propósito: no conoce a WordPress. El que trae los
// posts es src/lib/wordpress.ts (getAllPostsBuscador) y el que compone ambos
// es el route handler src/app/api/buscar/route.ts. Así los tests de
// src/lib/__tests__/buscador.test.ts corren sin red, con fixtures.
// ============================================

import MiniSearch, { type SearchResult } from 'minisearch'

/** Documento del índice: un post de WP o una página estática del sitio. */
export interface DocBuscador {
  /** 'post:123' o 'pagina:/nosotros' — evita colisiones de id en MiniSearch. */
  id: string
  tipo: 'post' | 'pagina'
  titulo: string
  extracto: string
  /** Ruta interna lista para <Link>: '/noticias/slug' o '/nosotros'. */
  href: string
  /** Nombre visible para el badge: 'Prensa', 'Institucional', 'Página'… */
  categoria: string
  /** Solo posts (ISO). Las páginas estáticas no llevan fecha. */
  fechaPublicacion?: string
}

export const MAX_RESULTADOS = 30
export const MIN_QUERY = 2
export const MAX_QUERY = 100

/**
 * Minúsculas y sin diacríticos (NFD + strip de combining marks, que también
 * baja ñ→n). Con esto "víctima" y "victima" indexan y buscan igual — la
 * collation de la DB de WP no lo garantiza; acá lo garantizamos nosotros.
 */
export function foldAccents(term: string): string {
  return term
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/**
 * Páginas institucionales del sitio, para que el buscador también encuentre
 * "transparencia" o "donar", no solo noticias. Curado a mano: título y
 * descripción copiados del metadata real de cada page.tsx — si una página
 * cambia su description, actualizar acá (son 16 líneas, no amerita
 * indirección). NUNCA agregar contenido con nombres de víctimas.
 *
 * v2 (diferida a propósito): los ~88 documentos PDF de /recursos
 * (docs/inventario/posts.json) duplican títulos de posts ya indexados y
 * linkean a PDFs externos; se suman como tipo 'documento' cuando exista el
 * CPT del plugin usina-headless.
 */
export const PAGINAS_ESTATICAS: DocBuscador[] = [
  // src/app/page.tsx
  { id: 'pagina:/', tipo: 'pagina', titulo: 'Inicio', href: '/', categoria: 'Página', extracto: 'Usina de Justicia es una asociación civil que defiende los derechos de las víctimas de homicidio y femicidio en Argentina. Acompañamos familias, promovemos reformas legislativas y trabajamos por una justicia con perspectiva de víctima.' },
  // src/app/necesito-ayuda/page.tsx
  { id: 'pagina:/necesito-ayuda', tipo: 'pagina', titulo: 'Necesito ayuda', href: '/necesito-ayuda', categoria: 'Página', extracto: 'Si perdiste a un ser querido por un hecho de inseguridad, Usina de Justicia te acompaña: asesoramiento jurídico, contención psicológica y grupos de pares. Comunicate con nosotros.' },
  // src/app/acompanamiento/page.tsx
  { id: 'pagina:/acompanamiento', tipo: 'pagina', titulo: 'Acompañamiento', href: '/acompanamiento', categoria: 'Página', extracto: 'Usina de Justicia brinda asesoramiento legal, contención emocional y difusión de los casos en forma gratuita a los familiares de víctimas de homicidio y femicidio, desde el primer contacto hasta la ejecución de la pena.' },
  // src/app/observatorio/page.tsx
  { id: 'pagina:/observatorio', tipo: 'pagina', titulo: 'Observatorio', href: '/observatorio', categoria: 'Página', extracto: 'El observatorio de Usina de Justicia releva, analiza y publica información sobre homicidios, femicidios y el funcionamiento del sistema penal en las 24 jurisdicciones del país.' },
  // src/app/noticias/page.tsx
  { id: 'pagina:/noticias', tipo: 'pagina', titulo: 'Noticias', href: '/noticias', categoria: 'Página', extracto: 'Historias, acompañamiento, incidencia, prensa, institucional y observatorio: todas las noticias de Usina de Justicia sobre los derechos de las víctimas del delito en Argentina.' },
  // src/app/recursos/page.tsx
  { id: 'pagina:/recursos', tipo: 'pagina', titulo: 'Recursos y publicaciones', href: '/recursos', categoria: 'Página', extracto: 'Descargá informes, guías y publicaciones de Usina de Justicia sobre derechos de las víctimas del delito.' },
  // src/app/nosotros/page.tsx
  { id: 'pagina:/nosotros', tipo: 'pagina', titulo: 'Nosotros', href: '/nosotros', categoria: 'Página', extracto: 'Usina de Justicia es una Asociación Civil que desde 2014 acompaña a las víctimas de homicidio y femicidio y trabaja por una justicia que contemple sus derechos.' },
  // src/app/nosotros/equipo/page.tsx
  { id: 'pagina:/nosotros/equipo', tipo: 'pagina', titulo: 'Nuestro equipo', href: '/nosotros/equipo', categoria: 'Página', extracto: 'Conocé al equipo de Usina de Justicia. Profesionales comprometidos con la defensa de los derechos de las víctimas del delito.' },
  // src/app/nosotros/transparencia/page.tsx
  { id: 'pagina:/nosotros/transparencia', tipo: 'pagina', titulo: 'Transparencia', href: '/nosotros/transparencia', categoria: 'Página', extracto: 'Memorias y balances certificados de Usina de Justicia. Documentos institucionales de acceso público.' },
  // src/app/nosotros/distinciones/page.tsx
  { id: 'pagina:/nosotros/distinciones', tipo: 'pagina', titulo: 'Distinciones', href: '/nosotros/distinciones', categoria: 'Página', extracto: 'Distinciones, premios y declaraciones de interés recibidos por Usina de Justicia en reconocimiento a su trabajo por los derechos de las víctimas.' },
  // src/app/donar/page.tsx
  { id: 'pagina:/donar', tipo: 'pagina', titulo: 'Doná', href: '/donar', categoria: 'Página', extracto: 'Tu donación nos permite acompañar a las familias de víctimas de homicidio y femicidio con asesoramiento legal y contención psicológica.' },
  // src/app/contacto/layout.tsx (sin el email, que allá se interpola)
  { id: 'pagina:/contacto', tipo: 'pagina', titulo: 'Contacto', href: '/contacto', categoria: 'Página', extracto: '¿Sos víctima de un delito o necesitás orientación? Escribinos o completá el formulario y te responderemos a la brevedad.' },
  // src/app/galeria/page.tsx
  { id: 'pagina:/galeria', tipo: 'pagina', titulo: 'Galería', href: '/galeria', categoria: 'Página', extracto: 'Galería de fotos de eventos, actividades y encuentros de Usina de Justicia.' },
  // src/app/legal/privacidad/page.tsx
  { id: 'pagina:/legal/privacidad', tipo: 'pagina', titulo: 'Política de Privacidad', href: '/legal/privacidad', categoria: 'Página', extracto: 'Política de privacidad y protección de datos personales de Usina de Justicia.' },
  // src/app/legal/terminos/page.tsx
  { id: 'pagina:/legal/terminos', tipo: 'pagina', titulo: 'Términos de Uso', href: '/legal/terminos', categoria: 'Página', extracto: 'Términos y condiciones de uso del sitio web de Usina de Justicia.' },
  // src/app/en/page.tsx
  { id: 'pagina:/en', tipo: 'pagina', titulo: 'About Usina de Justicia (English)', href: '/en', categoria: 'Página', extracto: 'Usina de Justicia is an Argentine civil association that has accompanied families of homicide and femicide victims since 2014.' },
]

/** Arma el índice MiniSearch sobre título + extracto. */
export function buildIndex(docs: DocBuscador[]): MiniSearch<DocBuscador> {
  const index = new MiniSearch<DocBuscador>({
    fields: ['titulo', 'extracto'],
    storeFields: ['tipo', 'titulo', 'extracto', 'href', 'categoria', 'fechaPublicacion'],
    // Aplica al indexar Y (default de MiniSearch) a los términos de la query.
    processTerm: (term) => foldAccents(term) || null,
  })
  index.addAll(docs)
  return index
}

/** Un resultado ya listo para serializar en la API (sin score ni match). */
export interface ResultadoBuscador {
  tipo: 'post' | 'pagina'
  titulo: string
  extracto: string
  href: string
  categoria: string
  fechaPublicacion?: string
}

export interface RespuestaBuscador {
  total: number
  resultados: ResultadoBuscador[]
}

/**
 * Busca en el índice. Estrategia: AND estricto primero (todas las palabras),
 * y si no hay ningún resultado, reintento con OR — mejor devolver resultados
 * parciales que una pantalla vacía. prefix permite matchear mientras se
 * tipea ("justi" → "justicia") y fuzzy 0.2 tolera un typo cada ~5 letras.
 */
export function buscar(index: MiniSearch<DocBuscador>, q: string): RespuestaBuscador {
  const query = q.trim().slice(0, MAX_QUERY)
  if (query.length < MIN_QUERY) return { total: 0, resultados: [] }

  const opciones = { prefix: true, fuzzy: 0.2, boost: { titulo: 3 } }
  let hits: SearchResult[] = index.search(query, { ...opciones, combineWith: 'AND' })
  if (hits.length === 0) {
    hits = index.search(query, { ...opciones, combineWith: 'OR' })
  }

  return {
    total: hits.length,
    resultados: hits.slice(0, MAX_RESULTADOS).map((h) => ({
      tipo: h.tipo,
      titulo: h.titulo,
      extracto: h.extracto,
      href: h.href,
      categoria: h.categoria,
      ...(h.fechaPublicacion ? { fechaPublicacion: h.fechaPublicacion } : {}),
    })),
  }
}

// ============================================
// Memo del índice: stale-while-revalidate en proceso + deduplicación.
//
// En Vercel el module scope persiste entre invocaciones calientes de la
// función. El diseño anterior (memo simple con TTL) tenía dos costos que se
// sentían como "la búsqueda demora": la primera búsqueda después de cada
// vencimiento esperaba ~10 requests a un WordPress lento ANTES de responder,
// y mientras tanto cada tecleo concurrente disparaba SU PROPIA
// reconstrucción. Con esto, nadie espera nunca una reconstrucción salvo la
// primerísima de una instancia fría, y nunca corre más de una a la vez.
// ============================================

const INDEX_TTL = 5 * 60 * 1000
let indexMemo: { index: MiniSearch<DocBuscador>; timestamp: number } | null = null
let buildEnCurso: Promise<MiniSearch<DocBuscador>> | null = null

type CargarPosts = () => Promise<
  Array<{
    id: number
    titulo: string
    extracto: string
    slug: string
    fechaPublicacion: string
    categoria: string
  }>
>

async function construir(cargarPosts: CargarPosts): Promise<MiniSearch<DocBuscador>> {
  const posts = await cargarPosts()
  const docs: DocBuscador[] = [
    ...posts.map((p) => ({
      id: `post:${p.id}`,
      tipo: 'post' as const,
      titulo: p.titulo,
      extracto: p.extracto,
      href: `/noticias/${p.slug}`,
      categoria: p.categoria,
      fechaPublicacion: p.fechaPublicacion,
    })),
    ...PAGINAS_ESTATICAS,
  ]
  indexMemo = { index: buildIndex(docs), timestamp: Date.now() }
  return indexMemo.index
}

/**
 * Devuelve el índice con estrategia stale-while-revalidate:
 * - Fresco → se devuelve.
 * - Vencido → se devuelve IGUAL (viejo de a lo sumo unos minutos, sobre
 *   contenido que cambia poco) y la reconstrucción corre de fondo.
 * - Inexistente (instancia fría) → una sola construcción compartida por
 *   todas las requests concurrentes, en vez de una por tecleo.
 *
 * El loader llega por inyección para que este módulo no dependa de
 * wordpress.ts y los tests pasen fixtures; el route handler pasa
 * getAllPostsBuscador. Si una reconstrucción de fondo falla, se sigue
 * sirviendo el índice viejo (mejor stale que caído).
 * `opts.ttlMs` existe solo para los tests.
 */
export async function getIndice(
  cargarPosts: CargarPosts,
  opts?: { ttlMs?: number }
): Promise<MiniSearch<DocBuscador>> {
  const ttl = opts?.ttlMs ?? INDEX_TTL
  if (indexMemo && Date.now() - indexMemo.timestamp < ttl) return indexMemo.index

  if (!buildEnCurso) {
    buildEnCurso = construir(cargarPosts).finally(() => {
      buildEnCurso = null
    })
    // Catch sobre una REFERENCIA al promise (no reasigna buildEnCurso): en
    // el camino stale nadie espera este promise, y un fallo sin catch sería
    // un unhandled rejection. Quien sí lo espera (camino frío) recibe el
    // rechazo original igual.
    buildEnCurso.catch(() => {})
  }

  // Camino stale: hay índice viejo → responder ya con el viejo.
  if (indexMemo) return indexMemo.index
  // Primera vez de la instancia: no hay nada para servir, se espera.
  return buildEnCurso
}

/** Solo para tests: resetea el memo entre casos. */
export function _resetIndiceParaTests(): void {
  indexMemo = null
  buildEnCurso = null
}
