import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getAllPostsBuscador } from '../wordpress.ts'

function post(id: number, slug: string) {
  return {
    id,
    title: { rendered: `Nota ${id}` },
    excerpt: { rendered: `Extracto ${id}` },
    slug,
    date: `2026-01-${String(id).padStart(2, '0')}T12:00:00`,
    categories: [],
  }
}

describe('getAllPostsBuscador — paginación estable', () => {
  it('ordena por ID ascendente y descarta IDs solapados entre páginas', async (t) => {
    const postsPorPagina = {
      '1': [post(1, 'nota-1'), post(2, 'nota-2-actual')],
      '2': [post(2, 'nota-2-solapada'), post(3, 'nota-3')],
    }
    const consultas: URL[] = []

    t.mock.method(globalThis, 'fetch', async (input) => {
      const url = new URL(input instanceof Request ? input.url : input.toString())
      if (url.pathname.endsWith('/categories')) {
        return new Response('[]', { headers: { 'content-type': 'application/json' } })
      }
      if (url.pathname.endsWith('/posts')) {
        consultas.push(url)
        const pagina = url.searchParams.get('page') ?? '1'
        return new Response(JSON.stringify(postsPorPagina[pagina as keyof typeof postsPorPagina] ?? []), {
          headers: {
            'content-type': 'application/json',
            'X-WP-TotalPages': '2',
          },
        })
      }
      throw new Error(`Endpoint inesperado en el test: ${url.pathname}`)
    })

    const posts = await getAllPostsBuscador()

    assert.deepEqual(posts.map(({ id }) => id), [1, 2, 3])
    assert.equal(posts[1].slug, 'nota-2-actual', 'conserva la primera copia de la página ordenada')
    assert.equal(consultas.length, 2)
    assert.ok(
      consultas.every(
        (url) => url.searchParams.get('orderby') === 'id' && url.searchParams.get('order') === 'asc'
      )
    )
  })
})
