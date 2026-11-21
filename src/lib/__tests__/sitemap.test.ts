import { it } from 'node:test'
import assert from 'node:assert/strict'
import sitemap from '../../app/sitemap.ts'
import { siteConfig } from '../site-config.ts'

it('sitemap respeta las zonas horarias y solo consulta las URLs indexables', async () => {
  const previousFetch = globalThis.fetch
  const endpoints: string[] = []
  globalThis.fetch = async (input) => {
    const url = new URL(String(input))
    const endpoint = url.pathname.split('/').at(-1) ?? ''
    endpoints.push(endpoint)
    const data = endpoint === 'categories'
      ? [{ id: 7, slug: 'en-los-medios', name: 'En los medios' }]
      : [
          { slug: 'nota-argentina', modified: '2026-09-02T15:00:00', categories: [6] },
          { slug: 'nota-utc', modified: '2026-09-02T15:00:00Z', categories: [6] },
          { slug: 'nota-con-offset', modified: '2026-09-02T15:00:00-05:00', categories: [6] },
          { slug: 'nota-sin-fecha', modified: '', categories: [6] },
          { slug: 'mencion-externa', modified: '2026-09-02T15:00:00Z', categories: [7] },
          { slug: 'usina-de-justicia-lanzo-su-nuevo-campus-virtual', modified: '2026-09-02T15:00:00Z', categories: [6] },
        ]
    return Response.json(data, { headers: { 'X-WP-TotalPages': '1' } })
  }

  try {
    const first = await sitemap()
    const second = await sitemap()
    assert.deepEqual(first, second, 'regenerar no anuncia modificaciones nuevas')
    assert.ok(!endpoints.includes('tags'), 'el sitemap no consulta las etiquetas')
    const expectedDates: Record<string, string> = {
      'nota-argentina': '2026-09-02T18:00:00.000Z',
      'nota-utc': '2026-09-02T15:00:00.000Z',
      'nota-con-offset': '2026-09-02T20:00:00.000Z',
    }
    for (const [slug, expected] of Object.entries(expectedDates)) {
      const post = first.find((entry) => entry.url.endsWith(`/noticias/${slug}`))
      assert.ok(post, slug)
      assert.ok(post.lastModified instanceof Date, slug)
      assert.equal(post.lastModified.toISOString(), expected, slug)
    }
    assert.ok(first.some((entry) => entry.url.endsWith('/noticias/nota-sin-fecha')))
    assert.ok(first.some((entry) => entry.url === `${siteConfig.url}/noticias/categoria/en-los-medios`))
    assert.ok(!first.some((entry) => entry.url.includes('/noticias/tag/')))
    assert.ok(first.some((entry) => entry.url === `${siteConfig.url}/`))
    assert.ok(!first.some((entry) => entry.url.endsWith('/mencion-externa')))
    assert.ok(!first.some((entry) => entry.url.includes('nuevo-campus-virtual')))
    for (const entry of first) {
      const slug = entry.url.split('/').at(-1) ?? ''
      if (!(slug in expectedDates)) assert.equal(entry.lastModified, undefined, entry.url)
    }
  } finally {
    globalThis.fetch = previousFetch
  }
})
