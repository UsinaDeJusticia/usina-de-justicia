// Ver la nota sobre el runner en agent-negotiation.test.ts.
// Correr con: pnpm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  decodeEntities,
  extractMainContent,
  htmlToMarkdown,
} from '../html-to-markdown.ts'

const BASE = 'https://www.usinadejusticia.org.ar/acompanamiento'

describe('decodeEntities', () => {
  it('decodifica entidades con nombre, decimales y hexadecimales', () => {
    assert.equal(decodeEntities('Asociaci&oacute;n &amp; Justicia'), 'Asociación & Justicia')
    assert.equal(decodeEntities('&#8212; guion'), '— guion')
    assert.equal(decodeEntities('&#x2014; guion'), '— guion')
  })

  it('deja intactas las entidades que no conoce', () => {
    assert.equal(decodeEntities('&noexiste;'), '&noexiste;')
  })
})

describe('extractMainContent', () => {
  it('se queda solo con <main>, descartando header y footer', () => {
    const html = `
      <html><body>
        <header><nav><a href="/donar">Donar</a></nav></header>
        <main><p>Contenido propio</p></main>
        <footer><p>Pie repetido</p></footer>
      </body></html>`
    const main = extractMainContent(html)
    assert.ok(main.includes('Contenido propio'))
    assert.ok(!main.includes('Pie repetido'))
    assert.ok(!main.includes('Donar'))
  })

  it('cae al <body> si no hay <main>', () => {
    assert.ok(extractMainContent('<html><body><p>Sin main</p></body></html>').includes('Sin main'))
  })
})

describe('htmlToMarkdown', () => {
  it('convierte la jerarquía de headings', () => {
    assert.equal(
      htmlToMarkdown('<h1>Acompañamiento</h1><h2>Cómo trabaja el equipo</h2><h3>Asesoramiento</h3>'),
      '# Acompañamiento\n\n## Cómo trabaja el equipo\n\n### Asesoramiento'
    )
  })

  it('vuelve absolutos los enlaces relativos', () => {
    assert.equal(
      htmlToMarkdown('<p>Ver <a href="/necesito-ayuda">ayuda</a></p>', BASE),
      'Ver [ayuda](https://www.usinadejusticia.org.ar/necesito-ayuda)'
    )
  })

  it('deja intactos los enlaces absolutos', () => {
    assert.ok(
      htmlToMarkdown('<p><a href="https://ivujus.org.ar/">IVUJUS</a></p>', BASE).includes(
        '[IVUJUS](https://ivujus.org.ar/)'
      )
    )
  })

  it('convierte listas no ordenadas y ordenadas', () => {
    assert.equal(htmlToMarkdown('<ul><li>Uno</li><li>Dos</li></ul>'), '- Uno\n- Dos')
    assert.equal(
      htmlToMarkdown('<ol><li>Primero</li><li>Segundo</li></ol>'),
      '1. Primero\n2. Segundo'
    )
  })

  it('aplana listas anidadas con indentación', () => {
    assert.equal(
      htmlToMarkdown('<ul><li>Padre<ul><li>Hijo</li></ul></li></ul>'),
      '- Padre\n  - Hijo'
    )
  })

  it('no fusiona ítems de una lista anidada (regresión: "- Padre Hijo")', () => {
    // Un regex no-greedy cortaba en el </ul> de la sublista y terminaba
    // pegando dos ítems distintos en una sola línea.
    assert.equal(
      htmlToMarkdown('<ul><li>Padre<ul><li>Hijo</li></ul></li><li>Tío</li></ul>'),
      '- Padre\n  - Hijo\n- Tío'
    )
  })

  it('mantiene el texto posterior a un bloque anidado', () => {
    assert.equal(
      htmlToMarkdown('<ul><li>Uno<ol><li>Sub</li></ol></li></ul><p>Después</p>'),
      '- Uno\n  1. Sub\n\nDespués'
    )
  })

  it('convierte tablas a formato GFM', () => {
    assert.equal(
      htmlToMarkdown(
        '<table><tr><th>Dato</th><th>Valor</th></tr><tr><td>CUIT</td><td>30-71540108-4</td></tr></table>'
      ),
      '| Dato | Valor |\n| --- | --- |\n| CUIT | 30-71540108-4 |'
    )
  })

  it('descarta scripts, estilos y SVG (íconos)', () => {
    assert.equal(
      htmlToMarkdown('<p>Visible</p><script>alert(1)</script><style>.x{}</style><svg><path/></svg>'),
      'Visible'
    )
  })

  it('descarta lo marcado como decorativo con aria-hidden', () => {
    // El avatar de iniciales de Testimonios.tsx y los íconos de lucide-react
    // llevan aria-hidden en todo el sitio.
    assert.equal(
      htmlToMarkdown('<p aria-hidden="true">ZC</p><p>Zoe Nerea Cortez</p>'),
      'Zoe Nerea Cortez'
    )
  })

  it('separa <span> adyacentes (pares etiqueta/valor de /donar)', () => {
    // En el HTML no hay espacio entre los dos spans: lo da el CSS.
    assert.equal(
      htmlToMarkdown('<div><span>CBU</span><span>0170035020000001904442</span></div>'),
      'CBU 0170035020000001904442'
    )
  })

  it('rescata texto maquetado con div/span, no solo etiquetas de bloque', () => {
    // Regresión: la primera versión solo miraba <p>/<h*>/<ul>/<table> y
    // perdía todo el contenido en divs — entre otras cosas los datos
    // bancarios, que son el contenido principal de /donar.
    assert.equal(
      htmlToMarkdown('<div><div>Dato suelto</div><div>Otro dato</div></div>'),
      'Dato suelto\n\nOtro dato'
    )
  })

  it('conserva negritas y énfasis', () => {
    assert.equal(
      htmlToMarkdown('<p>Es <strong>gratuito</strong> y <em>apartidario</em></p>'),
      'Es **gratuito** y _apartidario_'
    )
  })

  it('deduplica bloques idénticos consecutivos (rotador del hero)', () => {
    assert.equal(
      htmlToMarkdown('<p>Misma bajada</p><p>Misma bajada</p><p>Otra</p>'),
      'Misma bajada\n\nOtra'
    )
  })

  it('devuelve string vacío si no hay contenido de texto', () => {
    assert.equal(htmlToMarkdown('<div><svg><path/></svg></div>'), '')
  })

  it('no deja saltos de línea de más entre bloques', () => {
    assert.equal(htmlToMarkdown('<h2>Título</h2>\n\n\n<p>Cuerpo</p>'), '## Título\n\nCuerpo')
  })
})
