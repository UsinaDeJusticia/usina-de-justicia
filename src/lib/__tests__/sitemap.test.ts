import { it } from 'node:test'
import assert from 'node:assert/strict'
import sitemap from '../../app/sitemap.ts'
import { siteConfig } from '../site-config.ts'

it('sitemap conserva URLs indexables y post.modified; omite fechas inventadas y En los medios', async () => {
  const previousFetch = globalThis.fetch
  const modified = '2026-09-02T15:00:00Z'
  globalThis.fetch = async (input) => {
    const url = new URL(String(input))
    const data = url.pathname.endsWith('/tags') ? [{ id: 1, name: 'Víctimas', slug: 'victimas' }]
      : url.pathname.endsWith('/categories') ? [{ id: 7, slug: 'en-los-medios', name: 'En los medios' }]
      : [
        { slug: 'nota-indexable', modified, categories: [6] },
        { slug: 'mencion-externa', modified, categories: [7] },
        { slug: 'usina-de-justicia-lanzo-su-nuevo-campus-virtual', modified, categories: [6] },
      ]
    return Response.json(data, { headers: { 'X-WP-TotalPages': '1' } })
  }
  try {
    const first = await sitemap()
    const second = await sitemap()
    assert.deepEqual(first, second, 'regenerar no anuncia modificaciones nuevas')
    const post = first.find((entry) => entry.url.endsWith('/noticias/nota-indexable'))
    assert.ok(post)
    assert.equal((post.lastModified as Date).toISOString(), modified.replace('Z', '.000Z'))
    assert.ok(first.some((entry) => entry.url === `${siteConfig.url}/noticias/categoria/en-los-medios`))
    assert.ok(first.some((entry) => entry.url.endsWith('/noticias/tag/victimas')))
    assert.ok(first.some((entry) => entry.url === `${siteConfig.url}/`))
    assert.ok(!first.some((entry) => entry.url.endsWith('/mencion-externa')))
    assert.ok(!first.some((entry) => entry.url.includes('nuevo-campus-virtual')))
    for (const entry of first.filter((entry) => entry !== post)) {
      assert.equal(entry.lastModified, undefined, entry.url)
    }
  } finally { globalThis.fetch = previousFetch }
})
