// Tests del saneado del HTML que llega de WordPress.
//
// Es la única barrera entre el contenido del CMS —donde escriben varias
// personas— y el `dangerouslySetInnerHTML` de la página de cada nota. Hasta
// el 27-ago-2026 no tenía ni un test.
//
// Correr con: pnpm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { cleanWPContent } from '../wordpress.ts'

describe('cleanWPContent — saneado', () => {
  it('elimina scripts', () => {
    const salida = cleanWPContent('<p>hola</p><script>alert(1)</script>')
    assert.equal(salida.includes('<script'), false)
    assert.equal(salida.includes('alert'), false)
  })

  it('elimina manejadores de eventos en línea', () => {
    const salida = cleanWPContent('<img src="/x.jpg" onerror="alert(1)">')
    assert.equal(salida.includes('onerror'), false)
  })

  it('elimina enlaces con esquema javascript:', () => {
    const salida = cleanWPContent('<a href="javascript:alert(1)">clic</a>')
    assert.equal(salida.includes('javascript:'), false)
  })

  it('conserva el contenido legítimo de una nota', () => {
    const salida = cleanWPContent('<p>Un <strong>párrafo</strong> con <a href="https://ejemplo.test">un enlace</a>.</p>')
    assert.equal(salida.includes('<strong>'), true)
    assert.equal(salida.includes('href="https://ejemplo.test"'), true)
  })

  it('conserva los iframes de las plataformas permitidas', () => {
    const salida = cleanWPContent('<iframe src="https://www.youtube.com/embed/abc"></iframe>')
    assert.equal(salida.includes('<iframe'), true)
  })

  it('elimina los iframes de plataformas no permitidas', () => {
    const salida = cleanWPContent('<iframe src="https://ejemplo-ajeno.test/x"></iframe>')
    assert.equal(salida.includes('ejemplo-ajeno.test'), false)
  })
})

describe('cleanWPContent — denegación de servicio por retroceso de regex', () => {
  // Regresión del 27-ago-2026. El validador de `border-radius`, `padding` y
  // `margin` tenía un cuantificador sobre un grupo ambiguo, así que ante un
  // valor que no matchea el motor probaba todas las particiones posibles de
  // la tira de dígitos. Medido con el regex viejo: 400 dígitos tardaban 11
  // segundos y 600 dígitos, 55 segundos — bloqueando el hilo dentro del
  // render de la nota, o sea dejando esa página caída de forma permanente.
  //
  // El test mide tiempo a propósito. Es la única forma de fijar esto: un
  // test que solo comprobara la salida pasaría igual con el regex viejo,
  // solo que tardando un minuto.
  const PROPIEDADES = ['border-radius', 'padding', 'margin']
  const TOPE_MS = 250

  for (const propiedad of PROPIEDADES) {
    it(`sanea ${propiedad} con un valor patológico sin colgarse`, () => {
      const html = `<div style="${propiedad}:${'1'.repeat(2000)}x">texto</div>`
      const inicio = process.hrtime.bigint()
      const salida = cleanWPContent(html)
      const ms = Number(process.hrtime.bigint() - inicio) / 1e6

      assert.ok(
        ms < TOPE_MS,
        `${propiedad} tardó ${ms.toFixed(1)} ms (tope ${TOPE_MS} ms) — volvió el retroceso catastrófico`
      )
      assert.equal(salida.includes('1111'), false, 'el valor inválido tiene que descartarse')
      assert.equal(salida.includes('texto'), true, 'el contenido tiene que sobrevivir')
    })
  }

  it('sigue aceptando los valores legítimos de esas propiedades', () => {
    const salida = cleanWPContent('<div style="padding:10px 20px;margin:0;border-radius:8px">x</div>')
    assert.equal(salida.includes('padding'), true)
    assert.equal(salida.includes('10px 20px'), true)
    assert.equal(salida.includes('border-radius'), true)
  })
})
