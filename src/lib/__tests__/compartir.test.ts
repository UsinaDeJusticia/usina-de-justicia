// Test runner nativo de Node (node:test + node:assert), sin dependencias
// nuevas — mismo criterio que el resto de la suite (ver el comentario largo
// en agent-negotiation.test.ts).
//
// Correr con: pnpm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  compartirUrl,
  urlCanonicaNota,
  REDES_COMPARTIR,
  type RedCompartir,
} from '../compartir.ts'

const NOTA = {
  url: 'https://www.usinadejusticia.org.ar/noticias/una-nota',
  titulo: 'Perpetua para el asesino de Axel',
}

/** Devuelve los query params de una URL de compartir, ya decodificados. */
function params(href: string): URLSearchParams {
  return new URL(href).searchParams
}

describe('compartirUrl — destinos', () => {
  it('WhatsApp manda título y URL en un solo texto', () => {
    const href = compartirUrl('whatsapp', NOTA)
    assert.equal(new URL(href).origin + new URL(href).pathname, 'https://wa.me/')
    assert.equal(params(href).get('text'), `${NOTA.titulo}\n${NOTA.url}`)
  })

  it('Facebook manda solo `u` (ignora cualquier texto pre-cargado)', () => {
    const href = compartirUrl('facebook', NOTA)
    const qs = params(href)
    assert.equal(qs.get('u'), NOTA.url)
    assert.deepEqual([...qs.keys()], ['u'])
  })

  it('X manda texto, URL y el `via` de la organización', () => {
    const qs = params(compartirUrl('x', NOTA))
    assert.equal(qs.get('text'), NOTA.titulo)
    assert.equal(qs.get('url'), NOTA.url)
    assert.equal(qs.get('via'), 'UsinadeJusticia')
  })

  it('LinkedIn manda solo `url`', () => {
    const qs = params(compartirUrl('linkedin', NOTA))
    assert.equal(qs.get('url'), NOTA.url)
    assert.deepEqual([...qs.keys()], ['url'])
  })

  it('el correo va sin destinatario, con asunto y cuerpo', () => {
    const href = compartirUrl('email', NOTA)
    assert.ok(href.startsWith('mailto:?'), `no arranca con mailto:? → ${href}`)
    const qs = new URLSearchParams(href.slice('mailto:?'.length))
    assert.equal(qs.get('subject'), NOTA.titulo)
    assert.equal(qs.get('body'), `${NOTA.titulo}\n\n${NOTA.url}`)
  })
})

describe('compartirUrl — títulos reales de WordPress', () => {
  // El más largo de los 841 posts migrados tiene 273 caracteres
  // (docs/inventario/posts.json). X cuenta 280 y le asigna 23 fijos a la URL.
  const TITULO_LARGO =
    'Perpetua para uno de los asesinos de Axel Guardia en la Provincia de Córdoba. ' +
    'Desde Usina de Justicia abrazamos y acompañamos a Yolanda, su mamá, en todo ' +
    'este proceso. Gracias Dra. Raquel Slotolow y Raquel Berthi miembros de Usina ' +
    'de Justicia, por acompañar a esta familia.'

  it('el título largo se recorta para X y entra en el límite del compositor', () => {
    const texto = params(compartirUrl('x', { ...NOTA, titulo: TITULO_LARGO })).get('text')!

    assert.ok(TITULO_LARGO.length > 260, 'el título de prueba tiene que ser largo')
    assert.ok(texto.length <= 201, `quedó en ${texto.length} caracteres`)
    assert.ok(texto.endsWith('…'), 'tiene que cerrar con puntos suspensivos')
    // 23 de la URL + 20 de " via @UsinadeJusticia" + el texto, bajo los 280.
    assert.ok(texto.length + 23 + 20 < 280)
  })

  it('el recorte corta en un espacio, no en la mitad de una palabra', () => {
    const texto = params(compartirUrl('x', { ...NOTA, titulo: TITULO_LARGO })).get('text')!
    const ultimaPalabra = texto.slice(0, -1).trimEnd().split(' ').at(-1)!
    assert.ok(
      TITULO_LARGO.includes(` ${ultimaPalabra} `) || TITULO_LARGO.endsWith(` ${ultimaPalabra}`),
      `"${ultimaPalabra}" quedó cortada`
    )
  })

  it('los títulos cortos no se tocan', () => {
    assert.equal(params(compartirUrl('x', NOTA)).get('text'), NOTA.titulo)
  })

  it('el resto de las redes NO recorta: el título va entero', () => {
    const nota = { ...NOTA, titulo: TITULO_LARGO }
    assert.ok(params(compartirUrl('whatsapp', nota)).get('text')!.includes(TITULO_LARGO))
    assert.ok(
      new URLSearchParams(compartirUrl('email', nota).slice('mailto:?'.length))
        .get('subject')!
        .includes(TITULO_LARGO)
    )
  })
})

describe('compartirUrl — codificación', () => {
  // Títulos con tildes, comillas, & y signos de pregunta son lo normal acá:
  // si algo queda sin codificar, el parámetro se parte y el enlace llega roto.
  const TITULO_HOSTIL = '¿Justicia & reparación? "La causa Núñez" — 100% de los casos'

  it('los caracteres especiales sobreviven el ida y vuelta en todas las redes', () => {
    for (const red of REDES_COMPARTIR) {
      const href = compartirUrl(red, { ...NOTA, titulo: TITULO_HOSTIL })
      const qs =
        red === 'email'
          ? new URLSearchParams(href.slice('mailto:?'.length))
          : params(href)

      assert.ok([...qs.keys()].length > 0, `${red}: el enlace quedó sin parámetros`)

      // Facebook y LinkedIn no llevan el título: para ellos alcanza con que
      // la URL viaje intacta.
      if (red === 'whatsapp') assert.ok(qs.get('text')!.includes(TITULO_HOSTIL))
      if (red === 'x') assert.equal(qs.get('text'), TITULO_HOSTIL)
      if (red === 'email') assert.equal(qs.get('subject'), TITULO_HOSTIL)
      if (red === 'facebook') assert.equal(qs.get('u'), NOTA.url)
      if (red === 'linkedin') assert.equal(qs.get('url'), NOTA.url)
    }
  })

  it('toda red devuelve una URL absoluta parseable', () => {
    for (const red of REDES_COMPARTIR) {
      const href = compartirUrl(red, { ...NOTA, titulo: TITULO_HOSTIL })
      assert.doesNotThrow(() => new URL(href), `${red} devolvió algo no parseable`)
      assert.ok(
        href.startsWith('https://') || href.startsWith('mailto:'),
        `${red} no usa un esquema esperado: ${href}`
      )
    }
  })

  it('un salto de línea no rompe el parámetro', () => {
    const qs = params(compartirUrl('whatsapp', NOTA))
    assert.ok(compartirUrl('whatsapp', NOTA).includes('%0A'), 'el \\n tiene que ir codificado')
    assert.equal(qs.get('text')!.split('\n').length, 2)
  })
})

describe('urlCanonicaNota', () => {
  it('arma la misma URL que declara el canonical de la nota', () => {
    assert.equal(
      urlCanonicaNota('una-nota'),
      'https://www.usinadejusticia.org.ar/noticias/una-nota'
    )
  })

  it('conserva tal cual los slugs percent-encoded que vienen de WordPress', () => {
    // Hay slugs con emoji percent-encoded en el catálogo migrado (ver la
    // lista IVUJUS_SLUGS en src/app/sitemap.ts). No se re-codifican: el slug
    // ya llega en la forma en que WordPress lo publicó.
    const slug = '%e2%9a%96%ef%b8%8f-una-nota'
    assert.equal(
      urlCanonicaNota(slug),
      `https://www.usinadejusticia.org.ar/noticias/${slug}`
    )
  })
})

describe('REDES_COMPARTIR', () => {
  it('no tiene duplicados y todas construyen un enlace', () => {
    assert.equal(new Set(REDES_COMPARTIR).size, REDES_COMPARTIR.length)
    for (const red of REDES_COMPARTIR as readonly RedCompartir[]) {
      assert.ok(compartirUrl(red, NOTA).length > 0)
    }
  })
})
