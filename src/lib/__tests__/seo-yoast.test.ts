// Título y descripción SEO de /noticias/<slug> desde Yoast (yoast_head_json).
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { seoFieldsDesdeWP } from '../wordpress.ts'

const base = {
  title: { rendered: 'Título &#8220;del post&#8221;' },
  excerpt: { rendered: '<p>Extracto &amp; resumen</p>', protected: false },
}

describe('seoFieldsDesdeWP — Yoast', () => {
  it('usa título y descripción de Yoast, con entidades decodificadas', () => {
    const r = seoFieldsDesdeWP({ ...base, yoast_head_json: {
      title: 'Título SEO &#8211; Usina', description: 'Descripción &quot;Yoast&quot; &amp; más' } })
    assert.equal(r.seoTitle, 'Título SEO – Usina')
    assert.equal(r.seoDescription, 'Descripción "Yoast" & más')
  })
  it('sin yoast_head_json cae al título del post y al extracto', () => {
    const r = seoFieldsDesdeWP(base)
    assert.equal(r.seoTitle, 'Título \u201Cdel post\u201D')
    assert.equal(r.seoDescription, 'Extracto & resumen')
  })
  it('con valores vacíos cae al título del post y al extracto', () => {
    const r = seoFieldsDesdeWP({ ...base, yoast_head_json: { title: '', description: '  ' } })
    assert.equal(r.seoTitle, 'Título \u201Cdel post\u201D')
    assert.equal(r.seoDescription, 'Extracto & resumen')
  })
})

import { generateArticleMetadata } from '../metadata.ts'
import { siteConfig } from '../site-config.ts'
import type { Articulo } from '../../types/index.ts'

function nota(extra: Partial<Articulo>): Articulo {
  return { id: '1', slug: 'una-nota', titulo: 'Título del post', contenido: '', extracto: 'Extracto',
    categoria: { id: '6', slug: 'institucional', nombre: 'Institucional' }, tags: [], autor: siteConfig.name,
    fechaPublicacion: '2026-09-01T12:00:00', updatedAt: '2026-09-01T12:00:00', createdAt: '2026-09-01T12:00:00',
    publicado: true, ...extra }
}

describe('generateArticleMetadata — título de Yoast', () => {
  it('con título de Yoast lo usa completo (absolute) en title, OG y Twitter', () => {
    const m = generateArticleMetadata(nota({ ...seoFieldsDesdeWP({ ...base, yoast_head_json: { title: 'Título Yoast | Usina' } }) }), 'una-nota')
    assert.deepEqual(m.title, { absolute: 'Título Yoast | Usina' })
    assert.deepEqual(m.openGraph?.title, { absolute: 'Título Yoast | Usina' })
    assert.deepEqual(m.twitter?.title, { absolute: 'Título Yoast | Usina' })
  })
  it('sin título de Yoast deja el título del post para que el template agregue el sufijo', () => {
    const m = generateArticleMetadata(nota({ ...seoFieldsDesdeWP({ ...base, yoast_head_json: { title: '' } }) }), 'una-nota')
    assert.equal(m.title, 'Título \u201Cdel post\u201D')
    assert.equal(m.openGraph?.title, 'Título \u201Cdel post\u201D')
    assert.equal(m.twitter?.title, 'Título \u201Cdel post\u201D')
  })
})
