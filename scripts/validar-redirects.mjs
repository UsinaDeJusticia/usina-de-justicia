#!/usr/bin/env node
// scripts/validar-redirects.mjs
// Valida docs/redirect-map.json:
//   1. Cero sources duplicados.
//   2. Cero cadenas (A→B donde B es source de otro redirect) y cero loops.
//   3. Cobertura contra docs/inventario-wp.json (si existe): toda URL pública
//      del WP debe quedar redirigida, conservada o FASE2. Lo que no encaje se
//      reporta para sumar a docs/urls-sin-decision.md.
// Uso:  node scripts/validar-redirects.mjs

import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const MAP_PATH = 'docs/redirect-map.json'
const INV_PATH = 'docs/inventario-wp.json'

// Rutas viejas que se conservan tal cual en el sitio nuevo (sin redirect).
const CONSERVADAS = ['/nosotros', '/contacto', '/colaborar']

// Categorías sin decisión tomada (documentadas en docs/urls-sin-decision.md).
const SIN_DECISION = ['/category/otras', '/category/boletin-informativo', '/category/ig-publicaciones']

const norm = (p) => (p === '/' ? '/' : p.replace(/\/+$/, ''))
const sinHash = (p) => p.split('#')[0]

let fallas = 0
const fallo = (msg) => { console.error(`✗ ${msg}`); fallas++ }
const ok = (msg) => console.log(`✓ ${msg}`)

const map = JSON.parse(await readFile(MAP_PATH, 'utf8'))

// --- 1. Sources duplicados ---
const sources = map.map((r) => norm(r.source))
const dups = sources.filter((s, i) => sources.indexOf(s) !== i)
if (dups.length) fallo(`Sources duplicados: ${[...new Set(dups)].join(', ')}`)
else ok(`Sin sources duplicados (${sources.length} redirects)`)

// --- 2. Cadenas y loops ---
const sourceSet = new Set(sources)
const cadenas = map.filter(
  (r) => r.destination && sourceSet.has(norm(sinHash(r.destination)))
)
if (cadenas.length) {
  for (const r of cadenas) {
    const tipo = norm(sinHash(r.destination)) === norm(r.source) ? 'LOOP' : 'CADENA'
    fallo(`${tipo}: ${r.source} → ${r.destination} (el destino también es source)`)
  }
} else {
  ok('Sin cadenas ni loops')
}

// --- FASE2 bien formadas ---
const fase2 = map.filter((r) => r.fase === 'FASE2-IVUJUS')
const fase2Mal = fase2.filter((r) => r.destination !== null)
if (fase2Mal.length) fallo(`Entradas FASE2 con destination ≠ null: ${fase2Mal.map((r) => r.source).join(', ')}`)
else ok(`${fase2.length} entradas FASE2-IVUJUS con destination null (se sirven en su URL actual hasta julio)`)

const activos = map.filter((r) => !r.fase)
const activosSinDestino = activos.filter((r) => !r.destination)
if (activosSinDestino.length) fallo(`Redirects sin destination: ${activosSinDestino.map((r) => r.source).join(', ')}`)

// --- 3. Cobertura contra el inventario ---
if (!existsSync(INV_PATH)) {
  console.log(`\n⚠ ${INV_PATH} no existe — cobertura PENDIENTE.`)
  console.log('  Corré primero: WP_API_BASE=https://usinadejusticia.org.ar node scripts/inventario-wp.mjs')
} else {
  const inv = JSON.parse(await readFile(INV_PATH, 'utf8'))
  const base = inv.base
  const aPath = (link) => norm(new URL(link).pathname)

  const huerfanas = []

  for (const p of inv.paginas) {
    const ruta = aPath(p.link)
    if (sourceSet.has(ruta)) continue
    if (CONSERVADAS.includes(ruta)) continue
    huerfanas.push({ tipo: 'página', ruta, id: p.id })
  }

  for (const c of inv.categorias) {
    const ruta = `/category/${c.slug}`
    if (sourceSet.has(ruta)) continue
    if (SIN_DECISION.includes(ruta)) continue
    huerfanas.push({ tipo: 'categoría', ruta, posts: c.count })
  }

  // Posts: conservan URL histórica salvo que-hacer-primero (ya en el map).
  const PERMALINK_RE = /^\/\d{4}\/\d{2}\/\d{2}\/[^/]+$/
  const postsRaros = inv.posts.filter((p) => !PERMALINK_RE.test(aPath(p.link)))
  if (postsRaros.length) {
    for (const p of postsRaros) {
      huerfanas.push({ tipo: 'post fuera de patrón', ruta: aPath(p.link), id: p.id })
    }
  } else {
    ok(`Patrón de permalink consistente en los ${inv.posts.length} posts`)
  }

  if (huerfanas.length) {
    fallo(`${huerfanas.length} URL(s) sin estado (ni redirigida, ni conservada, ni FASE2):`)
    for (const h of huerfanas) console.error(`    - [${h.tipo}] ${h.ruta}`)
    console.error('  → Agregarlas a docs/urls-sin-decision.md con sugerencia de destino.')
  } else {
    ok(`Cobertura total contra inventario de ${base}`)
  }
  console.log(`\nNota: ${SIN_DECISION.length} categorías ya registradas en docs/urls-sin-decision.md: ${SIN_DECISION.join(', ')}`)
}

console.log(fallas ? `\n${fallas} problema(s) encontrado(s)` : '\nValidación OK')
process.exit(fallas ? 1 : 0)
