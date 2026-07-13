# SEO / GEO — Especificación para la reconstrucción en producción

Contexto: `home.html` e `ivujus.html` son prototipos de diseño (React + Babel en browser).
La versión de producción DEBE renderizar HTML en servidor o build (Astro, Next.js SSG, o HTML plano).
El contenido real llega por API REST — consumirla en build time (SSG con revalidación), no en el cliente.

## Crítico (sin esto no hay SEO ni GEO)
1. **HTML renderizado en build/servidor.** Nada de contenido que solo exista tras ejecutar JS.
2. **Un `<h1>` por página**, jerarquía h2/h3 semántica (el diseño ya la tiene — respetarla).
3. **`<title>` y `<meta name="description">` únicos por página**, en español.
   - Home: "Usina de Justicia — Acompañamiento a víctimas de homicidio en Argentina"
4. **Schema.org JSON-LD**:
   - `NGO` (nombre, logo, dirección CABA, sameAs → redes, foundingDate 2014)
   - `FAQPage` sobre la sección "¿Qué hacer en primer lugar?"
   - `Course` en IVUJUS (Victimología Penal)
   - `Article` + `NewsArticle` en noticias/columnas
5. **Open Graph + Twitter Cards** con imagen institucional (no retratos de víctimas).

## Alto impacto
6. **Core Web Vitals**: imágenes AVIF/WebP con `width/height` explícitos, `loading="lazy"` bajo el fold, fuentes con `font-display: swap`, LCP < 2.5s.
7. **URLs semánticas en español**: `/que-hacer`, `/observatorio`, `/testimonios`, `/ivujus`, `/donar`.
8. **sitemap.xml + robots.txt**. Permitir bots GEO: GPTBot, ClaudeBot, PerplexityBot.
9. **`alt` descriptivo en toda imagen**; en retratos de víctimas: nombre + contexto, con respeto.
10. **Datos del observatorio como texto/tabla HTML**, no solo gráfico — los LLMs citan tablas.

## GEO específico
11. Página "¿Qué hacer?" como guía paso a paso con preguntas literales como headings
    ("¿Qué hago en las primeras 48 horas?") — formato que los LLMs recuperan y citan.
12. Párrafo de definición institucional al inicio de la home (quiénes son, qué hacen, desde cuándo,
    dónde) en texto plano — es lo que los motores generativos extraen como respuesta.
13. Fechar el contenido (`datePublished`/`dateModified`) — los LLMs priorizan frescura verificable.

## Accesibilidad (afecta ranking)
14. Contraste AA (la paleta navy ya cumple), landmarks (`<main>`, `<nav>`, `<footer>`),
    focus visible, `lang="es"` en `<html>`.

## Redirects
15. Mapear URLs viejas del sitio actual → nuevas con 301 para no perder la autoridad acumulada.
