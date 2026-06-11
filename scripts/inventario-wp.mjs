#!/usr/bin/env node
// scripts/inventario-wp.mjs
// Día 1 — Inventario completo del WordPress de Usina de Justicia vía REST API público.
// Uso:  WP_API_BASE=https://usinadejusticia.org.ar node scripts/inventario-wp.mjs
// Genera: docs/inventario-wp.json (crudo) y docs/inventario-wp.md (resumen humano).
//
// No requiere credenciales: solo endpoints públicos. Los borradores NO aparecen
// en el API público; se listan como pendientes de revisión manual en el admin.

import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const WP_API_BASE = (
  process.env.WP_API_BASE ||
  process.env.NEXT_PUBLIC_WP_API_URL?.replace(/\/wp-json\/wp\/v2\/?$/, '') ||
  'https://usinadejusticia.org.ar'
).replace(/\/$/, '')

const API = `${WP_API_BASE}/wp-json/wp/v2`
const DELAY_MS = 500 // no castigar al Hostinger
const UA = 'UsinaDeJusticia-Inventario/1.0 (relanzamiento; info@usinadejusticia.org.ar)'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function wpGet(endpoint) {
  const url = `${API}${endpoint}`
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`)
  }
  return {
    data: await res.json(),
    total: parseInt(res.headers.get('X-WP-Total') || '0', 10),
    totalPages: parseInt(res.headers.get('X-WP-TotalPages') || '0', 10),
  }
}

// Pagina un endpoint completo usando X-WP-TotalPages, con delay entre requests.
async function wpGetAll(endpointBase, label) {
  const sep = endpointBase.includes('?') ? '&' : '?'
  const first = await wpGet(`${endpointBase}${sep}page=1`)
  const all = [...first.data]
  console.log(`  ${label}: página 1/${first.totalPages} (total ${first.total})`)
  for (let page = 2; page <= first.totalPages; page++) {
    await sleep(DELAY_MS)
    const { data } = await wpGet(`${endpointBase}${sep}page=${page}`)
    all.push(...data)
    console.log(`  ${label}: página ${page}/${first.totalPages}`)
  }
  return { items: all, total: first.total }
}

const errores = []

async function intentar(label, fn) {
  try {
    return await fn()
  } catch (err) {
    console.error(`✗ ${label}: ${err.message}`)
    errores.push({ recurso: label, error: err.message })
    return null
  }
}

async function main() {
  console.log(`Inventario WP — base: ${WP_API_BASE}\n`)

  const paginas = await intentar('páginas', () =>
    wpGetAll('/pages?per_page=100&_fields=id,title,slug,parent,status,link,modified', 'páginas')
  )
  await sleep(DELAY_MS)

  const categorias = await intentar('categorías', () =>
    wpGetAll('/categories?per_page=100&_fields=id,name,slug,count,parent', 'categorías')
  )
  await sleep(DELAY_MS)

  const posts = await intentar('posts', () =>
    wpGetAll('/posts?per_page=100&_fields=id,link,slug,date,categories,title', 'posts')
  )
  await sleep(DELAY_MS)

  const tags = await intentar('tags', () =>
    wpGetAll('/tags?per_page=100&_fields=id,name,slug,count', 'tags')
  )
  await sleep(DELAY_MS)

  const media = await intentar('media (solo total)', async () => {
    const { total } = await wpGet('/media?per_page=1&_fields=id')
    return { total }
  })

  // --- Análisis ---

  // Patrón de permalink esperado: /{yyyy}/{mm}/{dd}/{slug}/
  const PERMALINK_RE = /^https?:\/\/[^/]+\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/?$/
  const postsFueraDePatron = (posts?.items || []).filter((p) => !PERMALINK_RE.test(p.link))

  // Páginas conocidas como duplicadas/obsoletas según el plan
  const SOSPECHOSAS = [
    'colaborar', 'donar',
    'acompanamiento-a-la-victima', 'acompanamiento-a-las-familias',
    'inicio-nueva', 'sabias-que', 'gracias', 'quiero-suscribirme', 'distinciones',
  ]
  const paginasSospechosas = (paginas?.items || []).filter((p) =>
    SOSPECHOSAS.some((s) => p.slug === s || p.slug.startsWith(`${s}-`))
  )

  const resultado = {
    generado: new Date().toISOString(),
    base: WP_API_BASE,
    errores,
    totales: {
      paginas: paginas?.total ?? null,
      posts: posts?.total ?? null,
      categorias: categorias?.items?.length ?? null,
      tags: tags?.total ?? null,
      media: media?.total ?? null,
    },
    paginas: paginas?.items ?? [],
    categorias: categorias?.items ?? [],
    posts: posts?.items ?? [],
    tags: tags?.items ?? [],
    postsFueraDePatronPermalink: postsFueraDePatron.map((p) => ({ id: p.id, link: p.link })),
    borradoresConocidos: [
      // El API público no expone borradores. Pendiente de revisión manual en el admin:
      { titulo: 'Privacy Policy', nota: 'borrador — revisar en admin' },
      { titulo: 'Elementor Página #22572', nota: 'borrador — revisar en admin' },
      { titulo: '(tercer borrador, título a confirmar)', nota: 'revisar en admin' },
    ],
  }

  const docsDir = path.resolve('docs')
  await mkdir(docsDir, { recursive: true })
  await writeFile(path.join(docsDir, 'inventario-wp.json'), JSON.stringify(resultado, null, 2))

  // --- Resumen humano ---
  const cats = (categorias?.items ?? []).sort((a, b) => b.count - a.count)
  const md = `# Inventario WordPress — Usina de Justicia

Generado: ${resultado.generado}
Base API: ${WP_API_BASE}

## Totales

| Recurso | Cantidad |
|---|---|
| Páginas | ${resultado.totales.paginas ?? 'ERROR'} |
| Posts | ${resultado.totales.posts ?? 'ERROR'} |
| Categorías | ${resultado.totales.categorias ?? 'ERROR'} |
| Tags | ${resultado.totales.tags ?? 'ERROR'} |
| Media | ${resultado.totales.media ?? 'ERROR'} |

## Categorías (con count)

| Categoría | Slug | Posts |
|---|---|---|
${cats.map((c) => `| ${c.name} | \`${c.slug}\` | ${c.count} |`).join('\n')}

## Páginas detectadas como duplicadas u obsoletas

${paginasSospechosas.length
  ? paginasSospechosas.map((p) => `- [id ${p.id}] \`/${p.slug}/\` — ${typeof p.title === 'object' ? p.title.rendered : p.title} (modificada ${p.modified})`).join('\n')
  : '_Ninguna detectada automáticamente — revisar listado completo en inventario-wp.json._'}

## Posts fuera del patrón de permalink \`/{yyyy}/{mm}/{dd}/{slug}/\`

${postsFueraDePatron.length
  ? postsFueraDePatron.map((p) => `- [id ${p.id}] ${p.link}`).join('\n')
  : '_Ninguno: el patrón es consistente en todos los posts._'}

## Borradores (no visibles por API público — revisión manual en admin)

- Privacy Policy
- Elementor Página #22572
- (tercer borrador, título a confirmar en el admin)

${errores.length ? `## Errores durante el inventario\n\n${errores.map((e) => `- **${e.recurso}**: ${e.error}`).join('\n')}` : ''}
`
  await writeFile(path.join(docsDir, 'inventario-wp.md'), md)

  console.log('\n✓ docs/inventario-wp.json y docs/inventario-wp.md generados')
  if (errores.length) {
    console.log(`⚠ ${errores.length} recurso(s) fallaron — ver sección Errores del .md`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(`Error fatal: ${err.message}`)
  process.exit(1)
})
