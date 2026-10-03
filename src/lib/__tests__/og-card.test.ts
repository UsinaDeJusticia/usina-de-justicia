import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { fetchOgImageDataUri, truncateOgTitle } from '../og-card.ts'

const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0x00, 0x01])
const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00])

async function withFetch<T>(fetcher: typeof fetch, run: () => Promise<T>): Promise<T> {
  const previousFetch = globalThis.fetch
  const previousApiUrl = process.env.NEXT_PUBLIC_WP_API_URL
  globalThis.fetch = fetcher
  process.env.NEXT_PUBLIC_WP_API_URL = 'https://wp.test/wp-json/wp/v2'
  try {
    return await run()
  } finally {
    globalThis.fetch = previousFetch
    if (previousApiUrl === undefined) delete process.env.NEXT_PUBLIC_WP_API_URL
    else process.env.NEXT_PUBLIC_WP_API_URL = previousApiUrl
  }
}

describe('tarjeta social — descarga acotada y fallback', () => {
  it('acepta JPEG y PNG sólo cuando coinciden MIME y firma', async () => {
    await withFetch(async () => new Response(jpeg, {
      headers: { 'content-type': 'image/jpeg' },
    }), async () => {
      assert.equal(await fetchOgImageDataUri('https://wp.test/wp-content/uploads/foto.jpg'),
        `data:image/jpeg;base64,${btoa(String.fromCharCode(...jpeg))}`)
    })

    await withFetch(async () => new Response(png, {
      headers: { 'content-type': 'image/png; charset=binary' },
    }), async () => {
      assert.equal((await fetchOgImageDataUri('https://wp.test/wp-content/uploads/foto.png'))?.startsWith('data:image/png;base64,'), true)
    })
  })

  it('rechaza HTTP, estados de error, respuestas que no son imagen y firmas inválidas', async () => {
    let requests = 0
    await withFetch(async () => {
      requests++
      return new Response('error', { status: 503 })
    }, async () => {
      assert.equal(await fetchOgImageDataUri('http://wp.test/wp-content/uploads/foto.jpg'), null)
      assert.equal(requests, 0, 'no intenta conexiones HTTP sin TLS')
      assert.equal(await fetchOgImageDataUri('https://attacker.test/wp-content/uploads/foto.jpg'), null)
      assert.equal(await fetchOgImageDataUri('https://wp.test/wp-content/uploads/foto.jpg'), null)
      assert.equal(requests, 1, 'sólo intenta el host configurado de WordPress')
    })

    await withFetch(async () => new Response('<html>not an image</html>', {
      headers: { 'content-type': 'text/html' },
    }), async () => {
      assert.equal(await fetchOgImageDataUri('https://wp.test/wp-content/uploads/foto.jpg'), null)
    })

    await withFetch(async () => new Response(new Uint8Array([1, 2, 3]), {
      headers: { 'content-type': 'image/jpeg' },
    }), async () => {
      assert.equal(await fetchOgImageDataUri('https://wp.test/wp-content/uploads/foto.jpg'), null)
    })
  })

  it('rechaza cuerpos mayores a 5 MiB aunque no declaren su tamaño', async () => {
    await withFetch(async () => new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(jpeg)
        controller.enqueue(new Uint8Array(5 * 1024 * 1024))
        controller.close()
      },
    }), { headers: { 'content-type': 'image/jpeg' } }), async () => {
      assert.equal(await fetchOgImageDataUri('https://wp.test/wp-content/uploads/foto.jpg'), null)
    })
  })

  it('cae con seguridad cuando el origen o el timeout fallan', async () => {
    await withFetch(async () => { throw new Error('connection reset') }, async () => {
      assert.equal(await fetchOgImageDataUri('https://wp.test/wp-content/uploads/foto.jpg'), null)
    })
  })
})

describe('títulos de tarjeta social', () => {
  it('recorta sin partir caracteres Unicode y usa una marca si está vacío', () => {
    assert.equal(truncateOgTitle('   '), 'Usina de Justicia')
    assert.equal(truncateOgTitle('😀'.repeat(15), 12), `${'😀'.repeat(11)}…`)
    assert.equal(truncateOgTitle('Nota breve'), 'Nota breve')
  })
})
