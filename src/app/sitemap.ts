// src/app/sitemap.ts
// Sitemap nativo de Next.js (reemplaza next-sitemap, que era una
// dependencia inerte: sin postbuild ni config propia). Se genera al build
// (o en cada revalidación ISR, si el hosting la dispara) con tres bloques:
// rutas estáticas del árbol, las 6 categorías de noticias, los tags, y
// TODOS los posts publicados de WordPress.

import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { getWPTags, getAllPublishedPostSlugs } from '@/lib/wordpress'
import { SITE_SECTIONS } from '@/types/wordpress'

// Los 19 posts reasignados a "IVUJUS-301" en la Fase 2 (ver
// docs/inventario/COLA-LARGA-decisiones.md sección IVUJUS y
// docs/inventario/REASIGNACION-dryrun.json, filtrando `destino ===
// 'IVUJUS-301'` contra los slugs de docs/inventario/posts.json) no viven en
// /noticias: next.config.mjs los redirige 301 a https://ivujus.org.ar/, así
// que nunca deben aparecer en el sitemap. Lista fija (no una snapshot
// desactualizable como posts.json): es una decisión de migración ya
// ejecutada, no contenido vivo.
const IVUJUS_SLUGS = new Set<string>([
  'para-que-puedas-organizar-tu-agenda-y-aprovechar-al-maximo-cada-jornada-compartimos-el-cronograma-oficial-del-primer-simposio-americano-y-europeo-de-victimologia-penal',
  'primer-simposio-americano-y-europeo-de-victimologia-penal-inscripciones-abiertas',
  '%e2%9a%96%ef%b8%8f%f0%9f%92%bb-asi-vivimos-la-jornada-hacia-un-derecho-cientifico-en-el-cpacf',
  'hacia-un-derecho-cientifico-medicion-cualitativa-en-la-era-del-algoritmo',
  'encuentro-con-la-universidad-nacional-de-asuncion-para-conversar-sobre-la-formacion-en-victimologia',
  'hoy-ultima-jornada-donde-usina-de-justicia-participa-activamente-en-el-dictado-del-curso-sobre-victimas-en-el-colegio-publico-de-abogados-de-la-capital-federal-cpacf',
  'ministerios-publicos-fiscales-otras-entidades-y-profesionales-particulares-ya-se-sumaron-a-la-capacitacion-en-campus-virtual-de-usina-de-justicia-ley-de-victimas-en-el-marco-de-la-victimologia',
  'usina-de-justicia-lanzo-su-nuevo-campus-virtual',
  'usina-de-justicia-participa-activamente-en-la-capacitacion-en-victimas-de-delito-de-acuerdo-al-convenio-celebrado-con-el-colegio-publico-de-la-abogacia-de-la-capital-federal',
  'nota-en-agencia-universitaria-de-noticias-comenzo-una-capacitacion-inedita-para-la-proteccion-de-victimas-de-delito-el-programa-fue-lanzada-por-usina-de-justicia-en-colaboracion-con-la-facultad-de',
  'nota-en-infobae-se-lanzo-por-primera-vez-en-el-pais-un-programa-universitario-de-capacitacion-en-victimas-de-delitos',
  'usina-de-justicia-en-colaboracion-con-la-uade-comenzara-el-jueves-13-de-abril-con-el-programa-de-capacitacion-en-victimas-de-delito',
  'capacitacion-en-victimas-de-delito-colegio-publico-de-abogados-con-la-participacion-de-usina-en-el-dictado-de-la-capacitacion',
  'colegio-publico-de-la-abogacia-de-la-capital-federal-16-de-marzo-capacitacion-en-victimas-de-delito-presentadora-mariana-romano-y-participa-en-la-apertura-a-cargo-de-diana-cohen-agrest',
  'uj-dicto-clases-en-la-facultad-de-derecho-uba',
  'uj-estuvo-presente-en-la-capacitacion-de-victimas-de-la-subsecretaria-de-justicia-caba',
  'participamos-en-la-jornada-dialogando-ba-proteccion-de-victimas-en-la-facultad-de-derecho-de-la-universidad-de-buenos-aires',
  'ministerio-seguridad-la-nacion-capacitacion-fuerzas-seguridad',
  'seminario-en-la-udemm',
])

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Rutas estáticas del árbol nuevo. No incluye /noticias/pagina/N (ni las
  // variantes de categoría/tag): son duplicados de contenido ya indexado en
  // la página base, nunca la versión canónica.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteConfig.url}/necesito-ayuda`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteConfig.url}/noticias`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteConfig.url}/nosotros`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteConfig.url}/nosotros/equipo`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteConfig.url}/nosotros/distinciones`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/nosotros/transparencia`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteConfig.url}/acompanamiento`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteConfig.url}/observatorio`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteConfig.url}/recursos`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${siteConfig.url}/donar`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteConfig.url}/contacto`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${siteConfig.url}/legal/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/legal/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteConfig.url}/en`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${siteConfig.url}/galeria`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ]

  // Las 6 secciones definitivas de noticias (SITE_SECTIONS) — page 1 de cada
  // una, que es la única versión canónica (2+ vive en /pagina/N).
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(SITE_SECTIONS).map(
    (slug) => ({
      url: `${siteConfig.url}/noticias/categoria/${slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      // "historias" es la única categoría con un pilar de contenido propio
      // fuera de /noticias (ver /acompanamiento y SeguiExplorando), así que
      // queda una prioridad más alta que las otras 5.
      priority: slug === 'historias' ? 0.7 : 0.6,
    })
  )

  // Tags reales (con al menos un post), page 1 de cada uno.
  let tagRoutes: MetadataRoute.Sitemap = []
  try {
    const tags = await getWPTags()
    tagRoutes = tags.map((tag) => ({
      url: `${siteConfig.url}/noticias/tag/${tag.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.4,
    }))
  } catch {
    // Si falla WP, el sitemap sigue sin los tags (mejor incompleto que roto).
  }

  // Todos los posts publicados (menos los 19 de IVUJUS-301).
  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPublishedPostSlugs()
    postRoutes = posts
      .filter((post) => !IVUJUS_SLUGS.has(post.slug))
      .map((post) => ({
        url: `${siteConfig.url}/noticias/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
  } catch {
    // Si falla WP, el sitemap sigue con las rutas estáticas y de categoría
    // (mejor incompleto que roto).
  }

  return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...postRoutes]
}
