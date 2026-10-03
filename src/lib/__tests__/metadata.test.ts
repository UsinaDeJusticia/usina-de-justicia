import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateArticleMetadata, buildNewsArticleJsonLd, esMencionExterna } from '../metadata.ts'
import { variantesDeMedia, varianteParaCompartir } from '../imagenes.ts'
import { getArticuloBySlug } from '../wordpress.ts'
import { siteConfig } from '../site-config.ts'
import type { Articulo, ImageAsset } from '../../types/index.ts'
import type { WPMedia } from '../../types/wordpress.ts'

const media: WPMedia = {
  id: 1, alt_text: 'Foto de la actividad', mime_type: 'image/jpeg',
  source_url: 'https://wp.test/foto.jpg',
  media_details: { width: 2400, height: 1600, filesize: 800000, sizes: {
    thumbnail: { source_url: 'https://wp.test/foto-150.jpg', width: 150, height: 150, mime_type: 'image/jpeg' },
    large: { source_url: 'https://wp.test/foto-1024.jpg', width: 1024, height: 1024, mime_type: 'image/jpeg' },
    '1536x1536': { source_url: 'https://wp.test/foto-1536.jpg', width: 1536, height: 1024, mime_type: 'image/jpeg', filesize: 150000 },
  } },
}
const imagen: ImageAsset = { url: media.source_url, alt: media.alt_text, width: 2400, height: 1600, variantes: variantesDeMedia(media) }
function articulo(image: ImageAsset | undefined = imagen): Articulo {
  return { id: '1', slug: 'una-nota', titulo: 'Título de la nota', contenido: '<p>Contenido</p>', extracto: 'Extracto',
    seoDescription: 'Descripción SEO', imagenDestacada: image, categoria: { id: '6', slug: 'institucional', nombre: 'Institucional' },
    tags: [], autor: siteConfig.name, fechaPublicacion: '2026-09-01T12:00:00', updatedAt: '2026-09-02T15:00:00', createdAt: '2026-09-01T12:00:00', publicado: true }
}
function images(note: Articulo) {
  const metadata = generateArticleMetadata(note, note.slug)
  return {
    metadata,
    og: metadata.openGraph?.images as Array<{ url: string; width: number; height: number; alt: string }>,
    twitter: metadata.twitter?.images as Array<{ url: string }>,
  }
}

describe('metadata de noticias — archivos existentes', () => {
  it('usa la variante grande sin recorte en OG y Twitter, con dimensiones reales y URL absoluta', () => {
    const { og, twitter, metadata } = images(articulo())
    assert.deepEqual(og, [{ url: 'https://wp.test/foto-1536.jpg', width: 1536, height: 1024, alt: media.alt_text }])
    assert.equal(twitter[0].url, og[0].url)
    assert.equal(new URL(og[0].url).protocol, 'https:')
    assert.equal(metadata.alternates?.canonical, `${siteConfig.url}/noticias/una-nota`)
    assert.equal(metadata.description, 'Descripción SEO')
    assert.equal(metadata.title, 'Título de la nota')
  })

  it('sin destacada usa un PNG estático real en ambas superficies', () => {
    const note = articulo(); delete note.imagenDestacada
    const { og, twitter } = images(note)
    assert.equal(og[0].url, `${siteConfig.url}/images/og-default.png`)
    assert.equal(twitter[0].url, og[0].url)
    const png = readFileSync(new URL('../../../public/images/og-default.png', import.meta.url))
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
    assert.equal(png.readUInt32BE(16), 1200)
    assert.equal(png.readUInt32BE(20), 630)
    assert.ok(png.length < 5 * 1024 * 1024)
  })

  it('NewsArticle conserva la imagen original, autor, fechas, publisher y canonical', () => {
    const note = articulo()
    const json = buildNewsArticleJsonLd(note, note.slug)
    assert.deepEqual(json.image, [media.source_url])
    assert.notEqual(json.image?.[0], images(note).og[0].url)
    assert.equal(json.datePublished, note.fechaPublicacion)
    assert.equal(json.dateModified, note.updatedAt)
    assert.deepEqual(json.author, { '@id': `${siteConfig.url}/#organization` })
    assert.deepEqual(json.publisher, { '@id': `${siteConfig.url}/#organization` })
    assert.equal(json.mainEntityOfPage['@id'], `${siteConfig.url}/noticias/una-nota`)
    note.autor = 'Autora de ejemplo'
    assert.deepEqual(buildNewsArticleJsonLd(note, note.slug).author, { '@type': 'Person', name: note.autor })
    delete note.imagenDestacada
    assert.equal('image' in buildNewsArticleJsonLd(note, note.slug), false, 'el logo social no representa la fotografía de una noticia')
  })

  it('En los medios conserva noindex/follow y los artículos propios heredan robots del layout', () => {
    const note = articulo()
    assert.equal(generateArticleMetadata(note, note.slug).robots, undefined)
    note.categoria.slug = 'en-los-medios'
    assert.equal(esMencionExterna(note), true)
    assert.deepEqual(generateArticleMetadata(note, note.slug).robots, { index: false, follow: true })
  })

  it('impide reintroducir una ruta OG dinámica dentro de noticias', () => {
    const dir = fileURLToPath(new URL('../../app/noticias/', import.meta.url))
    const dynamicImages = readdirSync(dir, { recursive: true }).filter((name) => /(?:opengraph|twitter)-image\.(tsx?|jsx?)$/.test(String(name)))
    assert.deepEqual(dynamicImages, [])
    assert.equal(existsSync(`${dir}/[slug]/opengraph-image.tsx`), false)
  })
})

describe('elección social — compatibilidad y calidad', () => {
  it('elige el JPEG de WordPress para una destacada AVIF y mantiene el original en JSON-LD', () => {
    const avif = { ...imagen, url: 'https://wp.test/foto.avif', mimeType: 'image/avif', variantes: [
      { url: 'https://wp.test/foto.avif', width: 2400, height: 1600, mimeType: 'image/avif' },
      { url: 'https://wp.test/foto-usina-social-a1b2.jpg', width: 1200, height: 800, mimeType: 'image/jpeg', bytes: 120000 },
    ] }
    const note = articulo(avif)
    assert.equal(images(note).og[0].url, avif.variantes[1].url)
    assert.deepEqual(buildNewsArticleJsonLd(note, note.slug).image, [avif.url])
  })

  it('acepta la mayor imagen pequeña adecuada sin ampliarla', () => {
    assert.equal(varianteParaCompartir({ ...imagen, url: 'https://wp.test/pequena.jpg', width: 800, height: 450, variantes: [] })?.width, 800)
  })

  it('full sin filesize hereda los bytes del original y no evade el límite social', () => {
    const full = { source_url: media.source_url, width: 2400, height: 1600, mime_type: 'image/jpeg' }
    const largeMedia = { ...media, media_details: { ...media.media_details, filesize: 6 * 1024 * 1024, sizes: { full } } }
    const variantes = variantesDeMedia(largeMedia)
    assert.equal(variantes[0].bytes, 6 * 1024 * 1024)
    assert.equal(varianteParaCompartir({ ...imagen, bytes: largeMedia.media_details.filesize, variantes }), undefined)
  })

  it('rechaza URLs relativas, esquemas no HTTP, formatos incompatibles, miniaturas y archivos enormes', () => {
    for (const invalid of [
      { url: '/foto.jpg' }, { url: 'data:image/png;base64,xxx' },
      { url: 'https://wp.test/foto.webp' }, { url: 'https://wp.test/foto.avif' },
      { width: 150, height: 150 }, { width: 5000 }, { bytes: 6 * 1024 * 1024 },
    ]) {
      assert.equal(varianteParaCompartir({ ...imagen, variantes: [], ...invalid }), undefined)
    }
  })
})

it('WordPress → variantes → metadata usa el JPEG social declarado por _embed', async () => {
  const previousFetch = globalThis.fetch
  const embedded = { ...media, source_url: 'https://wp.test/foto.webp', mime_type: 'image/webp', media_details: { ...media.media_details, sizes: {
    'usina-social': { source_url: 'https://wp.test/foto-usina-social-hash.jpg', width: 1200, height: 800, mime_type: 'image/jpeg', filesize: 90000 },
  } } }
  globalThis.fetch = async (input) => {
    const url = new URL(String(input))
    const data = url.pathname.endsWith('/categories')
      ? [{ id: 6, name: 'Institucional', slug: 'institucional' }]
      : [{ id: 1, slug: 'una-nota', title: { rendered: 'Título' }, content: { rendered: '<p>Nota</p>' }, excerpt: { rendered: 'Extracto' },
        categories: [6], status: 'publish', date: '2026-09-01T12:00:00', modified: '2026-09-02T15:00:00', _embedded: { 'wp:featuredmedia': [embedded] } }]
    return Response.json(data, { headers: { 'X-WP-Total': '1', 'X-WP-TotalPages': '1' } })
  }
  try {
    const note = await getArticuloBySlug('una-nota')
    assert.ok(note)
    assert.equal(images(note).og[0].url, embedded.media_details.sizes['usina-social'].source_url)
    assert.equal(note.imagenDestacada?.variantes?.[0].bytes, 90000)
    assert.deepEqual(buildNewsArticleJsonLd(note, note.slug).image, [embedded.source_url])
  } finally { globalThis.fetch = previousFetch }
})
