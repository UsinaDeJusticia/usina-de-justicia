// Tests del motor del buscador (src/lib/buscador.ts).
// Ver la nota sobre el runner en agent-negotiation.test.ts.
// Correr con: pnpm test
//
// Cero red: el módulo bajo prueba recibe los documentos por inyección, así
// que todo corre con fixtures. Los títulos de los fixtures son inventados y
// neutros a propósito — NUNCA nombres de personas reales (repo público).

import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  foldAccents,
  buildIndex,
  buscar,
  getIndice,
  _resetIndiceParaTests,
  MAX_RESULTADOS,
} from '../buscador.ts'
import type { DocBuscador } from '../buscador.ts'

const FIXTURES: DocBuscador[] = [
  {
    id: 'post:1',
    tipo: 'post',
    titulo: 'Nota de ejemplo sobre reforma procesal',
    extracto: 'Un análisis del acompañamiento a las víctimas durante el proceso penal.',
    href: '/noticias/nota-1',
    categoria: 'Incidencia',
    fechaPublicacion: '2024-03-01T00:00:00',
  },
  {
    id: 'post:2',
    tipo: 'post',
    titulo: 'Informe estadístico anual de ejemplo',
    extracto: 'Datos sobre el funcionamiento del sistema penal en las 24 jurisdicciones.',
    href: '/noticias/nota-2',
    categoria: 'Observatorio',
    fechaPublicacion: '2024-05-01T00:00:00',
  },
  {
    id: 'post:3',
    tipo: 'post',
    titulo: 'Crónica de ejemplo sobre una audiencia',
    extracto: 'La reforma procesal explicada paso a paso para las familias.',
    href: '/noticias/nota-3',
    categoria: 'Prensa',
    fechaPublicacion: '2024-07-01T00:00:00',
  },
]

describe('foldAccents', () => {
  it('quita tildes', () => {
    assert.equal(foldAccents('víctima'), 'victima')
    assert.equal(foldAccents('Crónica'), 'cronica')
  })

  it('baja la ñ a n (vía NFD)', () => {
    assert.equal(foldAccents('acompañamiento'), 'acompanamiento')
  })

  it('pasa a minúsculas', () => {
    assert.equal(foldAccents('JUSTICIA'), 'justicia')
  })
})

describe('buscar', () => {
  const index = buildIndex(FIXTURES)

  it('folding bidireccional: query sin tilde encuentra doc con tilde y viceversa', () => {
    // "victimas" (sin tilde) debe encontrar el doc que dice "víctimas".
    const sinTilde = buscar(index, 'victimas')
    assert.ok(sinTilde.resultados.some((r) => r.href === '/noticias/nota-1'))

    // Y una query CON tilde encuentra un doc escrito sin tilde.
    const indexAdHoc = buildIndex([
      {
        id: 'post:9',
        tipo: 'post',
        titulo: 'Nota de ejemplo con analisis sin tilde',
        extracto: 'Texto de relleno.',
        href: '/noticias/nota-9',
        categoria: 'Prensa',
      },
    ])
    const conTilde = buscar(indexAdHoc, 'análisis')
    assert.ok(conTilde.resultados.some((r) => r.href === '/noticias/nota-9'))
  })

  it('prefix: "jurisdic" encuentra "jurisdicciones"', () => {
    const r = buscar(index, 'jurisdic')
    assert.ok(r.resultados.some((res) => res.href === '/noticias/nota-2'))
  })

  it('fuzzy: el typo "reforna" encuentra "reforma"', () => {
    // fuzzy 0.2 = distancia de edición 1 por cada ~5 letras (Levenshtein
    // simple: una transposición como "refroma" cuenta 2 y NO entra).
    const r = buscar(index, 'reforna')
    assert.ok(r.total > 0)
    assert.ok(r.resultados.some((res) => res.href === '/noticias/nota-1'))
  })

  it('boost de título: el doc con la palabra en el título sale antes que el que la tiene solo en el extracto', () => {
    const r = buscar(index, 'reforma')
    assert.ok(r.total >= 2)
    assert.equal(r.resultados[0].href, '/noticias/nota-1')
  })

  it('AND→OR fallback: dos palabras que ningún doc tiene juntas devuelven resultados parciales', () => {
    // "reforma" está en las notas 1 y 3; "jurisdicciones" solo en la 2.
    // Ningún doc tiene ambas → el AND da 0 y el OR rescata resultados.
    const r = buscar(index, 'reforma jurisdicciones')
    assert.ok(r.total > 0)
  })

  it('query vacía, de una letra o solo espacios: respuesta vacía', () => {
    assert.deepEqual(buscar(index, ''), { total: 0, resultados: [] })
    assert.deepEqual(buscar(index, 'a'), { total: 0, resultados: [] })
    assert.deepEqual(buscar(index, '  x '), { total: 0, resultados: [] })
  })

  it('query de 500 caracteres: no lanza y devuelve un objeto válido', () => {
    const larga = 'palabra'.repeat(72) // ~504 chars
    const r = buscar(index, larga)
    assert.equal(typeof r.total, 'number')
    assert.ok(Array.isArray(r.resultados))
  })

  it('cap de resultados: total real pero como mucho MAX_RESULTADOS en la lista', () => {
    const muchos: DocBuscador[] = Array.from({ length: 40 }, (_, i) => ({
      id: `post:${100 + i}`,
      tipo: 'post' as const,
      titulo: `Nota repetida ${i} sobre victimologia`,
      extracto: 'Texto de relleno.',
      href: `/noticias/nota-${100 + i}`,
      categoria: 'Prensa',
    }))
    const r = buscar(buildIndex(muchos), 'victimologia')
    assert.equal(r.total, 40)
    assert.equal(r.resultados.length, MAX_RESULTADOS)
  })
})

describe('getIndice', () => {
  beforeEach(() => {
    _resetIndiceParaTests()
  })

  it('las páginas estáticas son encontrables aun sin posts', async () => {
    const index = await getIndice(async () => [])

    const transparencia = buscar(index, 'transparencia')
    const hit = transparencia.resultados.find((r) => r.href === '/nosotros/transparencia')
    assert.ok(hit)
    assert.equal(hit.tipo, 'pagina')

    // "donacion" sin tilde encuentra /donar ("Tu donación…").
    const donar = buscar(index, 'donacion')
    assert.ok(donar.resultados.some((r) => r.href === '/donar'))
  })

  it('memoiza: el loader corre una sola vez entre llamadas, y de nuevo tras el reset', async () => {
    let llamadas = 0
    const loader = async () => {
      llamadas++
      return []
    }
    await getIndice(loader)
    await getIndice(loader)
    assert.equal(llamadas, 1)

    _resetIndiceParaTests()
    await getIndice(loader)
    assert.equal(llamadas, 2)
  })

  it('deduplica construcciones concurrentes: dos llamadas frías, el loader corre una vez', async () => {
    let llamadas = 0
    const loaderLento = async () => {
      llamadas++
      await new Promise((r) => setTimeout(r, 20))
      return []
    }
    await Promise.all([getIndice(loaderLento), getIndice(loaderLento)])
    assert.equal(llamadas, 1)
  })

  it('índice vencido: se sirve el viejo al instante y el refresco corre de fondo', async () => {
    // ttlMs: 0 fuerza que todo índice ya esté vencido.
    await getIndice(async () => [], { ttlMs: 0 })

    let refrescoTermino = false
    const loaderLento = async () => {
      await new Promise((r) => setTimeout(r, 30))
      refrescoTermino = true
      return []
    }

    const index = await getIndice(loaderLento, { ttlMs: 0 })
    // Resolvió SIN esperar al loader: eso es servir stale.
    assert.equal(refrescoTermino, false)
    // Y el índice viejo es utilizable.
    assert.ok(buscar(index, 'transparencia').total > 0)

    // El refresco sí corre, de fondo.
    await new Promise((r) => setTimeout(r, 50))
    assert.equal(refrescoTermino, true)
  })

  it('un fallo del refresco de fondo no rompe: se sigue sirviendo el índice viejo', async () => {
    let llamadas = 0
    const loader = async () => {
      llamadas++
      if (llamadas > 1) throw new Error('WP caído (simulado)')
      return []
    }
    await getIndice(loader, { ttlMs: 0 }) // construye ok (llamada 1)
    await getIndice(loader, { ttlMs: 0 }) // sirve stale, refresco falla (2)
    // Dejar que el refresco fallido termine (y su catch lo absorba).
    await new Promise((r) => setTimeout(r, 10))
    const index = await getIndice(loader, { ttlMs: 0 }) // sirve stale (3)
    assert.ok(buscar(index, 'transparencia').total > 0)
  })

  it('si el loader falla y no hay índice previo, rechaza', async () => {
    // El camino "stale ante fallo" (índice previo + TTL vencido + loader
    // roto) necesitaría fake timers para vencer el TTL — se documenta y no
    // se testea acá.
    await assert.rejects(
      getIndice(async () => {
        throw new Error('WP caído (simulado)')
      })
    )
  })

  it('los posts del loader quedan indexados con su href de noticias', async () => {
    const index = await getIndice(async () => [
      {
        id: 7,
        titulo: 'Nota de ejemplo sobre victimología penal',
        extracto: 'Texto de relleno.',
        slug: 'nota-ejemplo',
        fechaPublicacion: '2024-01-01T00:00:00',
        categoria: 'Incidencia',
      },
    ])
    const r = buscar(index, 'victimologia')
    const hit = r.resultados.find((res) => res.href === '/noticias/nota-ejemplo')
    assert.ok(hit)
    assert.equal(hit.tipo, 'post')
    assert.equal(hit.categoria, 'Incidencia')
  })
})
