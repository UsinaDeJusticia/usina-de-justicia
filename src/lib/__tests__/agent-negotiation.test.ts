// Test runner nativo de Node (node:test + node:assert), sin dependencias
// nuevas: la política de supply-chain del proyecto
// (`minimumReleaseAge: 10080` en pnpm-workspace.yaml, mitigación
// post-Shai-Hulud) hace que meter vitest —40 paquetes y un build script de
// esbuild que el repo dejó deliberadamente sin aprobar— tenga un costo
// mayor que el beneficio para testear dos módulos de funciones puras.
//
// Correr con: pnpm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseAcceptHeader, prefersMarkdown } from '../agent-negotiation.ts'

describe('parseAcceptHeader', () => {
  it('asume q=1 cuando no viene el parámetro', () => {
    assert.deepEqual(parseAcceptHeader('text/markdown'), [
      { type: 'text/markdown', q: 1, index: 0 },
    ])
  })

  it('lee los factores de calidad y normaliza a minúsculas', () => {
    assert.deepEqual(parseAcceptHeader('TEXT/Markdown;q=0.9, text/html;q=0.8'), [
      { type: 'text/markdown', q: 0.9, index: 0 },
      { type: 'text/html', q: 0.8, index: 1 },
    ])
  })

  it('ignora parámetros que no son q (por ejemplo el variant de RFC 7764)', () => {
    assert.deepEqual(parseAcceptHeader('text/markdown;variant=GFM;q=0.7'), [
      { type: 'text/markdown', q: 0.7, index: 0 },
    ])
  })

  it('cae a q=1 si el valor es inválido o está fuera de rango', () => {
    assert.equal(parseAcceptHeader('text/markdown;q=abc')[0].q, 1)
    assert.equal(parseAcceptHeader('text/markdown;q=5')[0].q, 1)
  })

  it('devuelve lista vacía sin header', () => {
    assert.deepEqual(parseAcceptHeader(null), [])
    assert.deepEqual(parseAcceptHeader(''), [])
  })
})

describe('prefersMarkdown', () => {
  it('sirve markdown cuando es lo único que se pide', () => {
    assert.equal(prefersMarkdown('text/markdown'), true)
  })

  it('sirve markdown cuando gana por factor de calidad', () => {
    assert.equal(prefersMarkdown('text/markdown;q=0.9, text/html;q=0.8'), true)
  })

  it('NO intercepta a un navegador real', () => {
    // Header típico de Chrome/Firefox: markdown solo matchea vía */*;q=0.8,
    // que queda por debajo del text/html explícito.
    const chrome =
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    assert.equal(prefersMarkdown(chrome), false)
  })

  it('el match exacto le gana al comodín aunque el comodín venga con menos q', () => {
    assert.equal(prefersMarkdown('text/markdown, */*;q=0.1'), true)
  })

  it('un comodín solo no alcanza: sin señal clara se sirve HTML', () => {
    assert.equal(prefersMarkdown('*/*'), false)
    assert.equal(prefersMarkdown('text/*'), false)
  })

  it('el empate va a HTML', () => {
    assert.equal(prefersMarkdown('text/markdown, text/html'), false)
  })

  it('no sirve markdown si está explícitamente rechazado', () => {
    assert.equal(prefersMarkdown('text/markdown;q=0, text/html'), false)
  })

  it('sin header no intercepta', () => {
    assert.equal(prefersMarkdown(null), false)
  })
})

// El `Vary: Accept` NO se testea acá: no lo produce código nuestro sino el
// bloque `headers()` de next.config.mjs (el middleware no sirve para esto,
// Next.js sobrescribe el header después). Se verifica end-to-end con curl
// contra el build de producción — ver docs/ESTADO.md.
