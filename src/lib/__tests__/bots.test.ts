import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { ALLOWED_BOTS, BLOCKED_BOTS, isBlockedUserAgent } from '../bots.ts'
import robots from '../../app/robots.ts'

type Resolver = (specifier: string, context: object) => { url: string; shortCircuit?: boolean }
const { registerHooks } = createRequire(import.meta.url)('node:module') as {
  registerHooks: (hooks: { resolve: (specifier: string, context: object, next: Resolver) => ReturnType<Resolver> }) => { deregister: () => void }
}

const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
const AHREFS = 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)'
const BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36'

describe('robots.txt', () => {
  const r = robots()
  const rules = Array.isArray(r.rules) ? r.rules : [r.rules]
  const forAgent = (ua: string) => rules.find((rule) =>
    (Array.isArray(rule.userAgent) ? rule.userAgent : [rule.userAgent]).includes(ua))

  it('permite exactamente la lista de buscadores e IA', () => {
    assert.deepEqual([...ALLOWED_BOTS], ['Googlebot', 'Google-Extended', 'Bingbot', 'Applebot', 'Applebot-Extended',
      'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'PerplexityBot', 'Perplexity-User', 'ClaudeBot', 'Claude-User',
      'Claude-SearchBot', 'DuckDuckBot', 'YandexBot'])
    for (const bot of ALLOWED_BOTS) {
      assert.equal(forAgent(bot)?.allow, '/', bot)
      assert.deepEqual(forAgent(bot)?.disallow, ['/api/', '/buscar'], bot)
    }
  })

  it('bloquea toda la lista de scrapers/SEO tools', () => {
    assert.deepEqual([...BLOCKED_BOTS], ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'Bytespider', 'PetalBot',
      'DataForSeoBot', 'BLEXBot', 'Amazonbot'])
    for (const bot of BLOCKED_BOTS) assert.equal(forAgent(bot)?.disallow, '/', bot)
  })

  it('el resto (*) sigue permitido y se publica el sitemap', () => {
    assert.equal(forAgent('*')?.allow, '/')
    assert.match(String(r.sitemap), /\/sitemap\.xml$/)
  })
})

describe('isBlockedUserAgent', () => {
  it('nunca bloquea Googlebot ni bots permitidos, ni UA vacío ni navegadores', () => {
    assert.equal(isBlockedUserAgent(GOOGLEBOT), false)
    assert.equal(isBlockedUserAgent(`${GOOGLEBOT} AhrefsBot`), false, 'permitido gana siempre')
    assert.equal(isBlockedUserAgent('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2)'), false)
    assert.equal(isBlockedUserAgent(null), false)
    assert.equal(isBlockedUserAgent(''), false)
    assert.equal(isBlockedUserAgent(BROWSER), false)
  })
  it('bloquea cada bot de la lista, sin importar mayúsculas', () => {
    for (const bot of BLOCKED_BOTS) assert.equal(isBlockedUserAgent(`Mozilla/5.0 (compatible; ${bot.toLowerCase()}/1.0)`), true, bot)
    assert.equal(isBlockedUserAgent(AHREFS), true)
  })
})

describe('middleware', () => {
  it('403 para bots bloqueados; Googlebot y navegadores pasan; robots.txt siempre accesible', async () => {
    const hooks = registerHooks({ resolve(specifier, context, nextResolve) {
      if (specifier.startsWith('@/lib/')) {
        return nextResolve(new URL(`../${specifier.slice(6)}.ts`, import.meta.url).href, context)
      }
      return nextResolve(specifier === 'next/server' ? 'next/server.js' : specifier, context)
    } })
    try {
      const { middleware } = await import('../../middleware.ts')
      const { NextRequest } = await import('next/server.js') as typeof import('next/server')
      const req = (path: string, ua?: string) => new NextRequest(`https://usina.test${path}`,
        { headers: ua ? { 'user-agent': ua } : {} })
      assert.equal(middleware(req('/noticias/una-nota', AHREFS)).status, 403)
      assert.equal(middleware(req('/', 'Bytespider')).status, 403)
      assert.notEqual(middleware(req('/robots.txt', AHREFS)).status, 403)
      assert.notEqual(middleware(req('/noticias/una-nota', GOOGLEBOT)).status, 403)
      assert.notEqual(middleware(req('/noticias/una-nota', BROWSER)).status, 403)
      assert.notEqual(middleware(req('/noticias/una-nota')).status, 403)
    } finally {
      hooks.deregister()
    }
  })
})
