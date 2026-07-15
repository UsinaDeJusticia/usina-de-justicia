# GEO / Schema — doctrina vigente e inventario

**Última actualización:** 15 de julio de 2026 · Fase 4 (SEO + GEO), Ola D.

> Este archivo reemplaza cualquier versión previa desactualizada. Referenciado desde
> `docs/plan-maestro-usina-web.md` (decisión D7) — es la fuente de verdad sobre qué
> hace y qué NO hace este repo para optimización en motores generativos (GEO:
> Generative Engine Optimization — cómo el sitio es leído, citado y recuperado por
> ChatGPT, Perplexity, Google AI Overviews, Claude, etc., además del SEO clásico).

---

## 1. Doctrina vigente (decisión D7, guía oficial de Google, mayo 2026)

La decisión D7 del plan maestro cerró esta discusión de forma vinculante:

**NO hacer:**
- **NO `llms.txt`.** No es un estándar adoptado por los motores generativos
  principales; no reemplaza contenido HTML bien estructurado y semántico.
- **NO chunking artificial.** No partir el contenido en fragmentos optimizados
  para "recuperación" (patrón RAG) ni maquetar párrafos cortos artificiales
  pensando en cómo los va a trocear un LLM. El contenido se escribe para
  personas; la estructura semántica correcta (headings, listas, tablas) ya es
  lo que los LLMs usan para extraer y citar.

**SÍ hacer:**
1. **Entidad en Wikidata + `sameAs`.** La palanca de mayor impacto: una entrada
   verificable en el grafo de conocimiento público le da a los motores
   generativos una fuente estructurada e independiente para confirmar quién es
   la organización, cuándo se fundó, quién la fundó. Ver `docs/WIKIDATA.md`.
2. **JSON-LD (schema.org)** en todas las páginas relevantes — no como
   sustituto del HTML visible sino como refuerzo estructurado del mismo
   contenido.
3. **Sitemap** completo y actualizado.
4. **Semántica HTML correcta**: un `<h1>` por página, jerarquía `h2`/`h3`,
   landmarks (`<main>`, `<nav>`, `<footer>`), tablas HTML reales para datos
   (no solo gráficos), preguntas literales como headings donde aplique.
5. **Core Web Vitals** sanos (LCP, CLS, TBT) — la velocidad y estabilidad de
   render siguen siendo señal de calidad tanto para SEO clásico como para los
   crawlers de motores generativos.

El razonamiento: los motores generativos de 2026 hacen fetch y parseo de HTML
real (no dependen de un archivo de instrucciones aparte) y priorizan fuentes
con identidad verificable (entidades de Wikidata/Wikipedia) y frescura
verificable (`datePublished`/`dateModified`). Optimizar para eso es optimizar
bien el sitio en general — no hay una "capa GEO" separada del SEO técnico
bien hecho.

---

## 2. Inventario de lo YA implementado en este repo

### 2.1 JSON-LD (schema.org)

| Schema | Dónde | Archivo | Notas |
|---|---|---|---|
| `NGO` (entidad consolidada) | Layout raíz, todas las páginas | `src/app/layout.tsx` | `@id` estable (`{siteConfig.url}/#organization`) para que otras páginas la referencien por `{ "@id": ... }` en vez de duplicarla. Incluye `foundingDate: 2014-11-12`, `founder` (Diana Cohen Agrest, con `sameAs` a su entrada de Wikidata Q23907251), `contactPoint`, `sameAs` (redes sociales). Dos TODOs pendientes marcados en el código: dirección postal y `sameAs` a la futura entrada de Wikidata de Usina (ver §3 y `docs/WIKIDATA.md`). |
| `AboutPage` | `/nosotros` | `src/app/nosotros/page.tsx` | `mainEntity` referencia el `NGO` por `@id`. |
| `Dataset` + `DataDownload` | `/observatorio` | `src/app/observatorio/page.tsx` | Datos del observatorio de víctimas. |
| `Service` | `/acompanamiento` | `src/app/acompanamiento/page.tsx` | |
| `FAQPage` (+ `Question`/`Answer`) | `/necesito-ayuda` | `src/app/necesito-ayuda/page.tsx`, `src/components/necesito-ayuda/FAQ.tsx` | Preguntas literales ("¿Qué hago en las primeras 48 horas?") como headings en el HTML visible, no solo en el JSON-LD — cumple el punto 11 de `design-system/seo/SEO_HANDOFF.md`. |
| `NewsArticle` | Cada post | `src/app/noticias/[slug]/page.tsx` | Incluye `author` (Person u Organization según el post), `mainEntityOfPage`, fechas de publicación/modificación. |
| `BreadcrumbList` | Rutas jerárquicas | `src/components/layout/Breadcrumbs.tsx` | |

Todos los bloques se inyectan vía `<script type="application/ld+json">` con
`dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }}` — es intencional y
seguro porque el contenido es JSON generado por el propio código, no HTML de
terceros; no pasa por la sanitización de `sanitize-html` (que es para el HTML
de posts de WordPress, ver §2.5).

Pendiente de verificar formalmente con Rich Results Test de Google en las 5
plantillas clave antes del gate G4 final (ver `docs/ESTADO.md`).

### 2.2 Sitemap y robots

- `src/app/sitemap.ts`: sitemap nativo de Next.js (reemplazó a `next-sitemap`,
  dependencia inerte que nunca llegó a configurarse). Genera: rutas estáticas
  del árbol, las 6 categorías de noticias, tags reales (con al menos un post),
  y todos los posts publicados de WordPress — **876 URLs** en la corrida más
  reciente (ver `docs/ESTADO.md`). Excluye explícitamente los 19 slugs
  reasignados a `IVUJUS-301` (contenido que redirige a `ivujus.org.ar`, nunca
  vive en este sitio) y las variantes de paginación (`/pagina/N`), que son
  duplicados de contenido ya indexado en la página base.
- `src/app/robots.ts`: `allow: '/'`, `disallow: '/api/'`, referencia al
  sitemap. Permite explícitamente a todos los user-agents (no hay bloqueo
  específico de bots de IA/GEO como GPTBot, ClaudeBot, PerplexityBot — quedan
  permitidos por el wildcard `*`).

### 2.3 hreflang / internacionalización

- `es` (default, `<html lang="es-AR">` en `src/app/layout.tsx`) ↔ `en`
  (`/en`, `src/app/en/page.tsx`, con `lang="en"` en el contenedor porque App
  Router no permite dos `<html lang>` distintos en el árbol).
- Recíproco solo entre `/` y `/en` (no hay traducción completa del resto del
  sitio) — implementado con `alternates.languages` en
  `src/lib/metadata.ts`/`generatePageMetadata` y en `src/app/page.tsx`.
- Contenido de `/en` es v1 mínima con hechos ya verificados en español
  (fundación 2014, misión, contacto) — pendiente el contenido real de la
  presentación ante la OEA (decisión D5, ver `docs/ESTADO.md`).

### 2.4 Headers de seguridad (afectan ranking / confianza, Fase 4 Ola A)

`next.config.mjs` → `headers()`: `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy:
origin-when-cross-origin`, `Strict-Transport-Security: max-age=31536000`
(sin `includeSubDomains` todavía — ver pendiente en §3), `Permissions-Policy`
restrictiva, y una `Content-Security-Policy` v1 pragmática (con
`'unsafe-inline'` en script-src/style-src por el JSON-LD inline y los
estilos de next/font — upgrade futuro: nonces por request vía middleware).

### 2.5 Sanitización de HTML de WordPress

`src/lib/wordpress.ts` (`sanitize-html`, función alrededor de la línea 540):
todo el HTML que llega de la REST API de WordPress (posts, páginas) pasa por
una allowlist de tags/atributos/estilos antes de renderizarse — necesario
tanto por seguridad (XSS) como porque WordPress/Elementor/Gutenberg generan
markup con basura que rompería la semántica si se inyectara tal cual.

### 2.6 Redirects 301

`next.config.mjs` → `redirects()`: mapa completo de URLs viejas de WordPress
→ nuevas rutas de Next.js (fechas `/YYYY/MM/DD/:slug` → `/noticias/:slug`,
páginas institucionales renombradas, categorías legacy → 6 secciones
definitivas, paginación por query string → segmento de ruta, IVUJUS →
`ivujus.org.ar`, etc.) — preserva la autoridad SEO acumulada del sitio
WordPress anterior.

### 2.7 Core Web Vitals / performance (Fase 4 Ola B, contexto para GEO)

Ver `docs/ESTADO.md` sección de performance: pre-renderizado estático de
posts/categorías/tags, paginación por segmento de ruta, deduplicación de
imágenes, tiempos de respuesta medidos ~5ms (estático) vs ~1.5s (fetch a WP
en caliente). Resultados de Lighthouse de esta sesión en §4 más abajo (ver
también `docs/ESTADO.md`, sección Fase 4 completa).

### 2.8 Párrafo de definición institucional (GEO específico, punto 12 de SEO_HANDOFF.md)

Verificado en esta sesión (Ola D): el primer párrafo visible de la Home
(`src/components/home/HeroEditorial.tsx`, única variante del hero rotador
presente en el HTML servido sin ejecutar JavaScript) responde en texto plano
quiénes son ("Asociación Civil"), qué hacen (acompañamiento a familias,
contención emocional, asesoramiento legal, incidencia contra la impunidad),
desde cuándo ("desde 2014") y dónde ("en Argentina", agregado en esta
sesión — antes solo estaba en el `meta description`, no en texto visible).

---

## 3. Pendiente

1. **Entrada de Wikidata de Usina de Justicia.** Máxima palanca GEO según la
   doctrina D7. Guía paso a paso para que Emanuel la cree: `docs/WIKIDATA.md`.
   Cuando exista el Q-ID, hay un `TODO` esperando en
   `src/app/layout.tsx` (`organizationSchema.sameAs`) para conectarlo.
2. **Dirección postal de la sede social.** El `NGO` schema en
   `src/app/layout.tsx` tiene un `TODO` explícito: la dirección no se
   incluyó porque no hay confirmación de cuál es la sede social *registrada*
   actual (el dato de "Reconquista 458" que aparece en `plan-maestro-usina-web.md`
   §4 Fase 4 es una referencia de partida, no un dato verificado en esta
   sesión). Falta que Emanuel la confirme.
3. **Google Search Console** del dominio con el sitio nuevo — acción fuera
   del código, post-cutover (Fase 5).
4. **Google Business Profile** — ídem, acción de Emanuel, post-cutover.
5. **`includeSubDomains` en HSTS** — deliberadamente pospuesto hasta que el
   subdominio de WordPress post-cutover esté estable (ver comentario en
   `next.config.mjs`).
