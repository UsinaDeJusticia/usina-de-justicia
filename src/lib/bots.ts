// ============================================
// src/lib/bots.ts
// Política de bots (perf/bajar-cpu, nov-2026). Una sola fuente para
// robots.txt (src/app/robots.ts) y para el 403 del middleware Edge.
//
// PERMITIDOS: buscadores y asistentes de IA que traen visibilidad (SEO y
// GEO). GPTBot (entrenamiento de OpenAI) queda permitido por decisión de
// Jair: priorizar presencia en respuestas de IA.
// BLOQUEADOS: rastreadores de herramientas SEO, scrapers y crawlers que
// consumen CPU sin devolver tráfico. Varios ignoran robots.txt, por eso el
// middleware también los corta con 403.
// ============================================

export const ALLOWED_BOTS = [
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'Applebot',
  'Applebot-Extended',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot', // decisión de Jair
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'DuckDuckBot',
  'YandexBot',
] as const

export const BLOCKED_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'Bytespider',
  'PetalBot',
  'DataForSeoBot',
  'BLEXBot',
  // Amazonbot: alimenta Alexa/Rufus y modelos de Amazon; casi no manda
  // tráfico a un sitio de noticias argentino. Se bloquea; revertir es
  // sacarlo de esta lista.
  'Amazonbot',
] as const

/**
 * Nunca bloquea si el UA contiene un bot permitido (Googlebot sobre todo),
 * aunque también coincida con uno bloqueado. UA vacío/ausente => no se
 * bloquea (curl, monitoreo, previews de links y webhooks legítimos).
 */
export function isBlockedUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  if (ALLOWED_BOTS.some((bot) => ua.includes(bot.toLowerCase()))) return false
  return BLOCKED_BOTS.some((bot) => ua.includes(bot.toLowerCase()))
}
