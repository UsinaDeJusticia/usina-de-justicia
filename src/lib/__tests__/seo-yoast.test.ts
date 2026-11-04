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
