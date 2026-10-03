import { it } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

// Runner Node 24; el repo conserva @types/node 20 sin cambiar dependencias.
type Resolver = (specifier: string, context: object) => { url: string; shortCircuit?: boolean }
const { registerHooks } = createRequire(import.meta.url)('node:module') as {
  registerHooks: (hooks: { resolve: (specifier: string, context: object, next: Resolver) => ReturnType<Resolver> }) => { deregister: () => void }
}

it('webhook invalida la página y metadata de la nota sólo con el secreto correcto', async () => {
  const paths: string[] = []
  const oldSecret = process.env.REVALIDATE_SECRET
  const state = globalThis as typeof globalThis & { __testRevalidatePath?: (path: string) => void }
  state.__testRevalidatePath = (path) => paths.push(path)
  const hooks = registerHooks({ resolve(specifier, context, nextResolve) {
    if (specifier === 'next/cache') {
      return { shortCircuit: true, url: 'data:text/javascript,export function revalidatePath(path) { globalThis.__testRevalidatePath(path) }' }
    }
    return nextResolve(specifier === 'next/server' ? 'next/server.js' : specifier, context)
  } })
  try {
    process.env.REVALIDATE_SECRET = 'local-test-secret'
    const { POST } = await import('../../app/api/revalidate/route.ts')
    const request = (secret: string) => new Request('https://next.test/api/revalidate', {
      method: 'POST', body: JSON.stringify({
        secret,
        paths: ['/', '/noticias', '/noticias/una-nota', '/noticias/categoria/prensa'],
      }),
    })
    assert.equal((await POST(request('incorrecto'))).status, 401)
    assert.deepEqual(paths, [])
    const response = await POST(request('local-test-secret'))
    assert.equal(response.status, 200)
    assert.deepEqual(paths, [
      '/', '/noticias', '/noticias/una-nota', '/noticias/categoria/prensa',
      '/noticias/una-nota/opengraph-image',
    ])
    assert.deepEqual(await response.json(), { revalidated: true, paths })
  } finally {
    hooks.deregister()
    delete state.__testRevalidatePath
    if (oldSecret === undefined) delete process.env.REVALIDATE_SECRET
    else process.env.REVALIDATE_SECRET = oldSecret
  }
})
