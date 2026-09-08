// Test runner nativo de Node (node:test + node:assert), sin dependencias
// nuevas — mismo criterio que el resto de la suite (ver el comentario largo
// en agent-negotiation.test.ts).
//
// Correr con: pnpm test

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  variantesDeMedia,
  varianteParaAncho,
  urlParaAncho,
  ANCHO_TARJETA,
  ANCHO_HERO_NOTA,
} from '../imagenes.ts'
import type { ImageAsset } from '../../types/index.ts'
import type { WPMedia } from '../../types/wordpress.ts'

/** Una imagen de WordPress como la devuelve `_embed`: original + tamaños. */
function media(overrides: Partial<WPMedia> = {}): WPMedia {
  return {
    id: 55,
    source_url: 'https://wp.test/foto.png',
    alt_text: 'Una foto',
    media_details: {
      width: 2000,
      height: 1333,
      sizes: {
        medium: {
          source_url: 'https://wp.test/foto-300x200.png',
          width: 300,
          height: 200,
          mime_type: 'image/png',
        },
        medium_large: {
          source_url: 'https://wp.test/foto-768x512.png',
          width: 768,
          height: 512,
          mime_type: 'image/png',
        },
        large: {
          source_url: 'https://wp.test/foto-1024x683.png',
          width: 1024,
          height: 683,
          mime_type: 'image/png',
        },
      },
    },
    ...overrides,
  } as WPMedia
}

/** El ImageAsset que arma `wpPostToArticulo` a partir de ese media. */
function asset(m: WPMedia = media()): ImageAsset {
  return {
    url: m.source_url,
    alt: m.alt_text,
    width: m.media_details.width,
    height: m.media_details.height,
    variantes: variantesDeMedia(m),
  }
}

describe('variantesDeMedia', () => {
  it('devuelve los tamaños de WordPress más el original, de menor a mayor', () => {
    assert.deepEqual(
      variantesDeMedia(media()).map((v) => v.width),
      [300, 768, 1024, 2000]
    )
  })

  it('descarta los recortes que cambian la proporción (el thumbnail cuadrado)', () => {
    // WordPress recorta `thumbnail` a cuadrado por defecto: usarlo cambiaría
    // el encuadre de la foto, no sólo su peso.
    const m = media()
    m.media_details.sizes.thumbnail = {
      source_url: 'https://wp.test/foto-150x150.png',
      width: 150,
      height: 150,
      mime_type: 'image/png',
    }
    const urls = variantesDeMedia(m).map((v) => v.url)
    assert.ok(
      !urls.some((u) => u.includes('150x150')),
      'el recorte cuadrado no tendría que estar entre las variantes'
    )
    assert.equal(urls.length, 4)
  })

  it('acepta un tamaño con una diferencia de redondeo en la proporción', () => {
    // 768x512 es 1.5000 y el original 2000x1333 es 1.50037: la diferencia es
    // el redondeo de WordPress al generar el tamaño, no un recorte.
    const anchos = variantesDeMedia(media()).map((v) => v.width)
    assert.ok(anchos.includes(768))
  })

  it('no duplica el original cuando también viene listado como `full`', () => {
    const m = media()
    m.media_details.sizes.full = {
      source_url: 'https://wp.test/foto.png',
      width: 2000,
      height: 1333,
      mime_type: 'image/png',
    }
    const urls = variantesDeMedia(m).map((v) => v.url)
    assert.equal(new Set(urls).size, urls.length)
    assert.equal(urls.filter((u) => u === 'https://wp.test/foto.png').length, 1)
  })

  it('descarta variantes de otro origen (quedarían bloqueadas por la CSP)', () => {
    // La CSP del sitio declara `img-src` con los hosts de WordPress y nada
    // más. Una variante en otro host se vería como una imagen rota, así que
    // vale más caer al original.
    const m = media()
    m.media_details.sizes.large = {
      source_url: 'https://cdn-ajeno.example/foto-1024x683.png',
      width: 1024,
      height: 683,
      mime_type: 'image/png',
    }
    const urls = variantesDeMedia(m).map((v) => v.url)
    assert.ok(!urls.some((u) => u.includes('cdn-ajeno')))
    // Y el pedido de 1024 cae al original, que sí está permitido.
    assert.equal(varianteParaAncho(asset(m), 1024)!.url, 'https://wp.test/foto.png')
  })

  it('sin `sizes` devuelve sólo el original', () => {
    const m = media()
    m.media_details.sizes = {}
    assert.deepEqual(variantesDeMedia(m).map((v) => v.width), [2000])
  })

  it('ignora entradas incompletas en vez de romperse', () => {
    const m = media()
    // @ts-expect-error se simula una respuesta malformada de WordPress
    m.media_details.sizes.rota = { source_url: '', width: 0, height: 0 }
    assert.equal(variantesDeMedia(m).length, 4)
  })
})

describe('varianteParaAncho', () => {
  it('elige la más chica que llega al ancho pedido', () => {
    assert.equal(varianteParaAncho(asset(), 400)!.width, 768)
    assert.equal(varianteParaAncho(asset(), 768)!.width, 768)
    assert.equal(varianteParaAncho(asset(), 800)!.width, 1024)
  })

  it('nunca agranda: si ninguna llega, devuelve la más grande', () => {
    // Agrandar no agrega detalle, sólo peso y desenfoque.
    assert.equal(varianteParaAncho(asset(), 5000)!.width, 2000)
  })

  it('una foto subida chica se sirve tal cual', () => {
    const m = media({ source_url: 'https://wp.test/chica.png' })
    m.media_details = { width: 320, height: 213, sizes: {} }
    assert.equal(varianteParaAncho(asset(m), ANCHO_TARJETA)!.width, 320)
  })

  it('sin variantes cae al original (una imagen que no viene de WordPress)', () => {
    const local: ImageAsset = {
      url: '/images/equipo/foo.webp',
      alt: 'foo',
      width: 240,
      height: 240,
    }
    assert.equal(varianteParaAncho(local, ANCHO_TARJETA)!.url, '/images/equipo/foo.webp')
  })

  it('sin imagen devuelve undefined', () => {
    assert.equal(varianteParaAncho(undefined, ANCHO_TARJETA), undefined)
  })
})

describe('urlParaAncho — lo que consumen los componentes', () => {
  it('la tarjeta de listado NO recibe el original', () => {
    const url = urlParaAncho(asset(), ANCHO_TARJETA)
    assert.equal(url, 'https://wp.test/foto-768x512.png')
    assert.notEqual(url, 'https://wp.test/foto.png')
  })

  it('el hero de la nota recibe la variante grande, no el original', () => {
    assert.equal(urlParaAncho(asset(), ANCHO_HERO_NOTA), 'https://wp.test/foto-1024x683.png')
  })

  it('las superficies que quieren el original lo siguen teniendo en `url`', () => {
    // opengraph-image.tsx y la `image` del JSON-LD leen `imagen.url` directo:
    // ahí conviene la mejor resolución disponible.
    assert.equal(asset().url, 'https://wp.test/foto.png')
  })

  it('sin imagen devuelve undefined', () => {
    assert.equal(urlParaAncho(undefined, ANCHO_TARJETA), undefined)
  })
})
