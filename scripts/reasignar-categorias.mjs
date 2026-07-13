#!/usr/bin/env node
// scripts/reasignar-categorias.mjs
// Fase 2 — Reasignación de categorías 16→6 según el mapa aprobado en G1
// (docs/MAPA-MIGRACION.md v1.1 + docs/inventario/COLA-LARGA-decisiones.md).
//
// Modo por defecto: DRY-RUN — no escribe nada en WP; genera el reporte
// docs/inventario/REASIGNACION-dryrun.{md,json} para el gate G2.
//
// Ejecución real: node scripts/reasignar-categorias.mjs --ejecutar
//   Requiere WP_APP_USER y WP_APP_PASSWORD en el entorno.
//   Estrategia ADITIVA: agrega la categoría nueva SIN sacar las viejas,
//   así el sitio Elementor actual no se rompe; la limpieza de categorías
//   viejas es post-cutover (Fase 5). Cada cambio queda registrado con las
//   categorías previas en docs/inventario/reasignacion-log.json (rollback).
//
// Los 19 posts IVUJUS→301 NO se tocan: no se migran y sus URLs entran a la
// tabla de redirects de Fase 4.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'docs', 'inventario')
const API = process.env.WP_API_URL || 'https://usinadejusticia.org.ar/wp-json/wp/v2'
const EJECUTAR = process.argv.includes('--ejecutar')

if (process.env.HTTPS_PROXY || process.env.https_proxy) {
  const { setGlobalDispatcher, EnvHttpProxyAgent } = await import('undici')
  setGlobalDispatcher(new EnvHttpProxyAgent())
}

// ============ MAPA APROBADO (G1, 11-jul-2026) ============

// Decisiones post-por-post de la cola larga (COLA-LARGA-decisiones.md)
const IVUJUS_301 = new Set([22614, 22612, 22365, 21108])
const A_INCIDENCIA = new Set([22379, 21780, 20556, 21105, 17217, 14089, 13939, 13422, 9769, 9760, 8449, 8464, 8654, 8870, 9984])
const A_PRENSA = new Set([18968, 17925])
const A_INSTITUCIONAL = new Set([20820, 16954, 15000, 14903, 14840, 8420, 8465, 9795, 9831, 9821])

const COLA_LARGA = ['debatesyconferencias', 'capacitacion', 'actividades', 'eventos', 'distinciones-premios', 'institucional', 'boletin-informativo', 'otras', 'publicaciones', 'estadisticas']

// Regla de especificidad para posts con categoría grande (aprobada en G1)
const PRIORIDAD = [
  ['historias', 'historias'],
  ['historias-de-los-miembros-de-uj', 'historias'],
  ['acompanamiento-a-victimas-de-homicidio', 'acompanamiento'],
  ['incidencia-en-politicas-publicas', 'incidencia'],
  ['medios-y-entrevistas', 'prensa'],
]

// Categorías destino: slug → nombre público (se crean si no existen)
const DESTINOS = {
  historias: 'Historias',
  acompanamiento: 'Acompañamiento',
  incidencia: 'Incidencia',
  prensa: 'Prensa',
  institucional: 'Institucional',
  observatorio: 'Observatorio',
}

function destino(post) {
  const cats = post.categorias
  const esColaExclusiva = cats.length && cats.every((c) => COLA_LARGA.includes(c))
  if (esColaExclusiva && cats.includes('capacitacion')) return 'IVUJUS-301'
  if (IVUJUS_301.has(post.id)) return 'IVUJUS-301'
  if (A_INCIDENCIA.has(post.id)) return 'incidencia'
  if (A_PRENSA.has(post.id)) return 'prensa'
  if (A_INSTITUCIONAL.has(post.id)) return 'institucional'
  const grande = PRIORIDAD.find(([slug]) => cats.includes(slug))
  if (grande) return grande[1]
  if (cats.some((c) => ['publicaciones', 'estadisticas'].includes(c))) return 'observatorio'
  return 'institucional'
}

// ============ CÁLCULO DEL PLAN ============

const posts = JSON.parse(readFileSync(join(OUT, 'posts.json'), 'utf8'))
const plan = posts.map((p) => ({
  id: p.id,
  slug: p.slug,
  titulo: p.titulo,
  categoriasActuales: p.categorias,
  destino: destino(p),
}))

const porDestino = {}
for (const p of plan) porDestino[p.destino] = (porDestino[p.destino] || 0) + 1

const aEscribir = plan.filter((p) => p.destino !== 'IVUJUS-301')
// Posts que ya tienen el slug destino entre sus categorías no necesitan cambio
const sinCambio = aEscribir.filter((p) => p.categoriasActuales.includes(p.destino))
const conCambio = aEscribir.filter((p) => !p.categoriasActuales.includes(p.destino))

mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'REASIGNACION-dryrun.json'), JSON.stringify({ resumen: porDestino, sinCambio: sinCambio.length, conCambio: conCambio.length, plan }, null, 2))

let md = `# DRY-RUN — Reasignación de categorías 16→6 (gate G2)\n**Generado:** ${new Date().toISOString().slice(0, 10)} · Estrategia ADITIVA (no se quita ninguna categoría vieja; el sitio actual no cambia).\n\n`
md += `| Destino | Posts |\n|---|---|\n${Object.entries(porDestino).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}\n\n`
md += `- Posts a modificar (agregar categoría nueva): **${conCambio.length}**\n- Posts que ya tienen el slug destino (sin cambio): **${sinCambio.length}**\n- Posts IVUJUS→301 (no se tocan): **${plan.length - aEscribir.length}**\n\nMuestra de 15 cambios:\n\n| ID | Post | Categorías actuales | + Nueva |\n|---|---|---|---|\n`
md += conCambio.slice(0, 15).map((p) => `| ${p.id} | ${p.titulo.slice(0, 60)} | ${p.categoriasActuales.join(', ')} | **${p.destino}** |`).join('\n')
md += `\n\nPlan completo post-por-post en \`REASIGNACION-dryrun.json\`.\n`
writeFileSync(join(OUT, 'REASIGNACION-dryrun.md'), md)

console.log('== DRY-RUN ==')
console.log(JSON.stringify(porDestino, null, 1))
console.log(`a modificar: ${conCambio.length} · sin cambio: ${sinCambio.length} · IVUJUS sin tocar: ${plan.length - aEscribir.length}`)
console.log(`Reporte: docs/inventario/REASIGNACION-dryrun.md`)

if (!EJECUTAR) process.exit(0)

// ============ EJECUCIÓN REAL (solo con --ejecutar, tras gate G2) ============

const USER = process.env.WP_APP_USER
const PASS = process.env.WP_APP_PASSWORD
if (!USER || !PASS) { console.error('Faltan WP_APP_USER / WP_APP_PASSWORD'); process.exit(1) }
const AUTH = 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64')

async function wp(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${data.code || ''} ${data.message || ''}`)
  return data
}

// 1. Asegurar que las 6 categorías destino existan; obtener sus IDs
console.log('\nVerificando/creando categorías destino…')
const existentes = await wp('GET', '/categories?per_page=100&hide_empty=false')
const idPorSlug = new Map(existentes.map((c) => [c.slug, c.id]))
for (const [slug, nombre] of Object.entries(DESTINOS)) {
  if (!idPorSlug.has(slug)) {
    const nueva = await wp('POST', '/categories', { name: nombre, slug })
    idPorSlug.set(slug, nueva.id)
    console.log(`  creada: ${slug} (id ${nueva.id})`)
  } else {
    console.log(`  ya existe: ${slug} (id ${idPorSlug.get(slug)})`)
  }
}

// 2. Reasignación aditiva con log para rollback
const log = []
let hechos = 0, errores = 0
const LOTE = 5
for (let i = 0; i < conCambio.length; i += LOTE) {
  const lote = conCambio.slice(i, i + LOTE)
  await Promise.all(lote.map(async (p) => {
    try {
      const actual = await wp('GET', `/posts/${p.id}?_fields=categories`)
      const nuevas = [...new Set([...actual.categories, idPorSlug.get(p.destino)])]
      await wp('POST', `/posts/${p.id}`, { categories: nuevas })
      log.push({ id: p.id, antes: actual.categories, despues: nuevas, destino: p.destino })
      hechos++
    } catch (e) {
      log.push({ id: p.id, error: e.message })
      errores++
    }
  }))
  process.stdout.write(`\r  ${hechos + errores}/${conCambio.length} (errores: ${errores})  `)
  writeFileSync(join(OUT, 'reasignacion-log.json'), JSON.stringify(log, null, 2))
}
console.log(`\nListo: ${hechos} modificados, ${errores} errores. Log con estado previo en reasignacion-log.json`)
