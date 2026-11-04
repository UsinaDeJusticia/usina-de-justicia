# Reglas sugeridas para el Firewall de Vercel (NO aplicadas)

Contexto: rama `perf/bajar-cpu`. El middleware ya responde 403 a los bots
bloqueados, pero el middleware igual es una invocación Edge. Una regla del
Firewall corta antes y no consume cómputo. Aplicar a mano en
Vercel → Project → Firewall → Configure → New Rule, primero en modo **Log**
uno o dos días, y después pasar a **Deny**.

## Regla 1 — Bloquear scrapers y herramientas SEO
- Nombre: `Bloquear bots sin retorno`
- If: `User Agent` · `Matches expression` (regex, sin distinguir mayúsculas):
  `(?i)(AhrefsBot|SemrushBot|MJ12bot|DotBot|Bytespider|PetalBot|DataForSeoBot|BLEXBot|Amazonbot)`
- AND `User Agent` · `Does not match expression`:
  `(?i)(Googlebot|Bingbot|Applebot|GPTBot|OAI-SearchBot|ChatGPT-User|PerplexityBot|ClaudeBot|DuckDuckBot|YandexBot)`
- AND `Request Path` · `Does not equal` · `/robots.txt`
- Then: **Deny** (o primero **Log**).

## Regla 2 (opcional) — Rate limit genérico a /noticias/*
- If: `Request Path` · `Starts with` · `/noticias/`
- Then: **Rate Limit** fixed window, 60 s, ~120 pedidos por IP, acción 429.
- Excepción: no aplicar a bots verificados (activar "Bot Protection"/
  "Verified bots" de Vercel si está disponible en el plan, que identifica a
  Googlebot por IP y no solo por User-Agent).

## Lo que NO conviene hacer: bloquear pedidos sin User-Agent
Riesgo **medio/alto**. Sin UA llegan: el webhook de WordPress si el cliente
HTTP no lo setea, chequeos de uptime, algunos previews de links (apps de
mensajería), lectores RSS y `curl` de diagnóstico. El ahorro es chico (los
scrapers serios mandan UA falso de navegador). Si se quiere probar: regla en
modo Log una semana, mirar qué cae y recién ahí decidir, nunca sobre
`/api/revalidate`.

## Nota
El UA se puede falsificar: estas reglas frenan a los bots "honestos" que
ignoran robots.txt. Para bots que se hacen pasar por navegador, lo útil es
el rate limit o el Attack Challenge Mode puntual.
