#!/usr/bin/env node
// scripts/inventario.mjs
// Inventario completo del WordPress de Usina de Justicia vía REST API pública.
// Uso: node scripts/inventario.mjs
// Salida: docs/inventario/{posts.json, pages.json, media-resumen.json, resumen.json}
//
// Solo lectura: no requiere credenciales ni escribe nada en WP.
// Requiere Node 18+ (fetch nativo) y acceso de red a usinadejusticia.org.ar.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const API = process.env.WP_API_URL || 'https://usinadejusticia.org.ar/wp-json/wp/v2'
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'inventario')

// El fetch nativo de Node ignora HTTP(S)_PROXY; en entornos con proxy obligatorio
// (ej. Claude Code remoto) usamos undici si está instalado. Sin proxy no hace falta.
if (process.env.HTTPS_PROXY || process.env.https_proxy) {
  try {
    const { setGlobalDispatcher, EnvHttpProxyAgent } = await import('undici')
    setGlobalDispatcher(new EnvHttpProxyAgent())
  } catch {
    console.warn('HTTPS_PROXY seteado pero undici no está instalado (pnpm add -D undici)')
  }
}
const PER_PAGE = 100

// ---------- fetch con reintentos ----------

async function fetchJson(url, attempt = 1) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    if (res.status >= 500 && attempt <= 3) {
      await new Promise((r) => setTimeout(r, 2000 * attempt))
      return fetchJson(url, attempt + 1)
    }
    throw new Error(`HTTP ${res.status} en ${url}`)
  }
  return {
    data: await res.json(),
    total: parseInt(res.headers.get('X-WP-Total') || '0', 10),
    totalPages: parseInt(res.headers.get('X-WP-TotalPages') || '0', 10),
  }
}

async function fetchAll(endpoint, params = {}) {
  const items = []
  let page = 1
  let totalPages = 1
  do {
    const url = new URL(`${API}${endpoint}`)
    url.searchParams.set('per_page', String(PER_PAGE))
    url.searchParams.set('page', String(page))
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))
    const { data, totalPages: tp } = await fetchJson(url.toString())
    items.push(...data)
    totalPages = tp
    process.stdout.write(`\r  ${endpoint}: página ${page}/${totalPages} (${items.length} items)   `)
    page++
  } while (page <= totalPages)
  process.stdout.write('\n')
  return items
}

// ---------- detección de flags en el contenido ----------

function decode(html) {
  return html
    .replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, '').trim()
}

const RE_MP4_PROPIO = /["'](https?:\/\/(?:www\.)?usinadejusticia\.org\.ar[^"']*\.mp4)["']/gi
const RE_MP4_CUALQUIERA = /["']([^"']+\.mp4)["']/gi
const RE_YOUTUBE = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/i
const RE_PDF = /href=["']([^"']+\.pdf)["']/gi
// Contenido IVUJUS (Instituto de Victimología): capacitaciones, cursos, simposios, diplomaturas
const RE_IVUJUS = /ivujus|simposio|diplomatura|curso de|capacitaci[oó]n|victimolog[ií]a/i

function matchesAll(re, html) {
  const out = new Set()
  let m
  const rx = new RegExp(re.source, re.flags)
  while ((m = rx.exec(html)) !== null) out.add(m[1])
  return [...out]
}

// ---------- main ----------

async function main() {
  console.log(`Inventario WP — ${API}`)
  await mkdir(OUT_DIR, { recursive: true })

  // 1. Taxonomías (para resolver IDs → slugs)
  const [cats, tags] = await Promise.all([
    fetchAll('/categories', { hide_empty: false }),
    fetchAll('/tags', { hide_empty: false }),
  ])
  const catById = new Map(cats.map((c) => [c.id, c]))
  const tagById = new Map(tags.map((t) => [t.id, t]))
  const userById = new Map((await fetchAll('/users')).map((u) => [u.id, u.name]))

  // 2. Posts (con _embed para featured image; _fields para acotar payload)
  const rawPosts = await fetchAll('/posts', {
    _embed: 'wp:featuredmedia',
    _fields: 'id,slug,title,date,modified,status,author,categories,tags,content,link,_links,_embedded',
  })

  const posts = rawPosts.map((p) => {
    const html = p.content?.rendered || ''
    const mp4Propios = matchesAll(RE_MP4_PROPIO, html)
    const mp4Todos = matchesAll(RE_MP4_CUALQUIERA, html)
    const pdfs = matchesAll(RE_PDF, html)
    const titulo = decode(p.title?.rendered || '')
    return {
      id: p.id,
      slug: p.slug,
      titulo,
      fecha: p.date,
      modificado: p.modified,
      link: p.link,
      autor: userById.get(p.author) || String(p.author),
      categorias: (p.categories || []).map((id) => catById.get(id)?.slug || id),
      tags: (p.tags || []).map((id) => tagById.get(id)?.slug || id),
      featuredImage: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      flags: {
        tieneMp4Propio: mp4Propios.length > 0,
        tieneMp4Externo: mp4Todos.length > mp4Propios.length,
        tieneYouTube: RE_YOUTUBE.test(html),
        tienePdf: pdfs.length > 0,
        posibleIvujus: RE_IVUJUS.test(titulo) || RE_IVUJUS.test(html.slice(0, 2000)),
      },
      mp4Propios,
      pdfs,
    }
  })

  // 3. Páginas
  const rawPages = await fetchAll('/pages', {
    _fields: 'id,slug,title,status,parent,link,menu_order',
  })
  const pages = rawPages.map((p) => ({
    id: p.id,
    slug: p.slug,
    titulo: decode(p.title?.rendered || ''),
    estado: p.status,
    parent: p.parent || 0,
    link: p.link,
  }))

  // 4. Media: resumen por tipo MIME
  const media = await fetchAll('/media', { _fields: 'id,mime_type,source_url' })
  const mimeResumen = {}
  for (const m of media) mimeResumen[m.mime_type] = (mimeResumen[m.mime_type] || 0) + 1

  // 5. Resumen general
  const porCategoria = {}
  for (const c of cats) porCategoria[c.slug] = { nombre: c.name, id: c.id, count: c.count }
  const resumen = {
    generado: new Date().toISOString(),
    api: API,
    totalPosts: posts.length,
    totalPages: pages.length,
    totalMedia: media.length,
    totalCategorias: cats.length,
    totalTags: tags.length,
    porCategoria,
    postsConMp4Propio: posts.filter((p) => p.flags.tieneMp4Propio).length,
    postsConYouTube: posts.filter((p) => p.flags.tieneYouTube).length,
    postsConPdf: posts.filter((p) => p.flags.tienePdf).length,
    postsPosibleIvujus: posts.filter((p) => p.flags.posibleIvujus).length,
  }

  await writeFile(join(OUT_DIR, 'posts.json'), JSON.stringify(posts, null, 2))
  await writeFile(join(OUT_DIR, 'pages.json'), JSON.stringify(pages, null, 2))
  await writeFile(join(OUT_DIR, 'media-resumen.json'), JSON.stringify(mimeResumen, null, 2))
  await writeFile(join(OUT_DIR, 'resumen.json'), JSON.stringify(resumen, null, 2))

  console.log('\n== RESUMEN ==')
  console.log(JSON.stringify(resumen, null, 2))
  console.log(`\nArchivos escritos en ${OUT_DIR}`)
}

main().catch((err) => {
  console.error('\nERROR:', err.message)
  process.exit(1)
})
