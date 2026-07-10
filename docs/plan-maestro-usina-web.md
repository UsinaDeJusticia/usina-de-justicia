# Plan Maestro — Rebuild Web Usina de Justicia
**Versión:** 1.0 — 10 de julio de 2026
**Autor del plan:** Claude (Fable 5) · **Operador:** Emanuel (orquestador, no escribe código)
**Modelo de ejecución:** 100% mediante agentes (Claude Code Desktop + Codex), con CLIs y MCPs. Intervención humana solo en decisiones de contenido/diseño y aprobación de gates.

---

## 0. Contexto consolidado (decisiones YA tomadas — no reabrir)

Estas decisiones fueron cerradas en sesiones previas (marzo–junio 2026) y son vinculantes:

| # | Decisión | Estado |
|---|---|---|
| D1 | **WordPress queda como CMS** (headless, "Variante B"). El equipo editorial sigue usando el mismo wp-admin. Strapi y Payload **descartados definitivamente para Usina** | Cerrada |
| D2 | Frontend: **Next.js + TypeScript + Tailwind en Vercel**, consumiendo WP REST API (`/wp-json/wp/v2`) | Cerrada |
| D3 | Consolidación de **16 categorías → 6** | Cerrada (mapa a validar en Fase 1) |
| D4 | `/necesito-ayuda` elevada a navegación principal | Cerrada |
| D5 | Landing `/en` en inglés (origen: presentación OEA) | Cerrada |
| D6 | **IVUJUS se separa** a su propio sitio (`ivujus-web`, Payload CMS) — proyecto aparte, fuera del alcance de este plan salvo los redirects 301 del lado de Usina | Cerrada |
| D7 | GEO según guía oficial de Google (mayo 2026): **no** llms.txt, **no** chunking artificial. Sí: Wikidata + `sameAs`, JSON-LD, sitemap, semántica, Core Web Vitals | Cerrada |
| D8 | Colores institucionales: navy `#1E427C`, gris `#A7A8AC`, blanco. Nunca violeta/púrpura | Cerrada |
| D9 | Elementor Pro está vencido → el frontend actual de WP es una bomba de tiempo; motivo adicional para acelerar | Contexto |

**Inventario existente:**
- WordPress en Hostinger: ~850 posts, ~23 páginas, 13–16 categorías solapadas, contenido IVUJUS mezclado.
- Repo `UsinaDeJusticia/usina-de-justicia`: frontend Next.js con ~83 páginas, REST API integrada, `CATEGORY_MAP` funcionando. **Estado real desconocido** → se audita en Fase 0, no se asume nada.
- Diseño nuevo: trabajado por Emanuel en Claude Design (aparte).
- `docs/geo-schema.md`: existe pero **desactualizado** (pre-guía Google mayo 2026). Actualizarlo es tarea temprana.

---

## 1. Principio rector

> **Máximo contenido migrado, mínima fricción, un solo estilo, estructura impecable.**
> Primero paridad de contenido con calidad superior (SEO/GEO/diseño). Features nuevas (agentes, interactividad) recién después del lanzamiento.

**Definición de "producto de calidad" (criterios de aceptación del proyecto):**
1. 100% del contenido valioso de WP visible en el sitio nuevo (posts, páginas, documentos, videos, imágenes).
2. Árbol de información: 6 categorías, 8 secciones jerárquicas, cero contenido huérfano.
3. Lighthouse ≥ 90 en Performance/SEO/Accessibility en las plantillas clave.
4. JSON-LD válido (NGO, Article, BreadcrumbList, Dataset, FAQPage) verificado con Rich Results Test.
5. Redirects 301 de todas las URLs viejas con tráfico → cero pérdida de posicionamiento.
6. El equipo editorial no cambia su flujo de trabajo en absolutamente nada.

---

## 2. Arquitectura de ejecución con agentes

### 2.1. Roles
- **Fable 5 (orquestador, Claude Code Desktop):** lee este documento, planifica cada fase, delega, revisa, mantiene `ESTADO.md` actualizado.
- **`implementador` (Sonnet, effort medium):** código Next.js, componentes, scripts de migración.
- **`explorador` (Haiku, effort low):** auditorías de solo lectura, inventarios, verificación de endpoints.
- **Codex (vía plugin `openai/codex-plugin-cc`):** tareas de implementación mecánica/repetitiva para conservar uso de Claude (ej.: generar los 6 archivos de plantilla de categoría, transformaciones masivas de datos).

### 2.2. Herramientas por capa
| Capa | Herramienta | Uso |
|---|---|---|
| WordPress (contenido) | **WP-CLI vía SSH Hostinger** | Reasignar categorías en lote, crear CPT, exportar, limpiar |
| WordPress (extensión) | Plugin propio mínimo (`usina-headless`) | CPT Documentos + campos ACF expuestos en REST + webhook de revalidación |
| Hostinger (infra) | **`hapi` CLI** + **Hostinger MCP server** (`hostinger/api-mcp-server`) | Deploy de plugins, purga de caché/CDN, DNS al final |
| WordPress (agente) | **WordPress MCP** (incluido en hosting WP de Hostinger, o `wp-mcp` self-hosted con Application Password) | Que Fable 5 lea/escriba contenido de WP directamente durante la migración |
| Frontend | Repo GitHub + Vercel (previews automáticos) | Flujo ya probado en Simposio 2026: feature branch → preview → verificar en móvil → merge |
| Verificación | `explorador` + Lighthouse CI + Rich Results Test | Gates de calidad |

### 2.3. Reglas de seguridad (innegociables, infraestructura crítica de ONG)
- Application Password de WP dedicada para agentes, con usuario propio (`agente-migracion`) y rol mínimo necesario. Revocar al terminar.
- Token de Hostinger API con expiración corta. Nunca en el repo: variables de entorno / `.env` fuera de git.
- **Backup completo (archivos + DB) vía Hostinger antes de cualquier operación de escritura en WP.** Es el primer comando de la Fase 2.
- Toda operación destructiva en WP (reasignación de categorías, borrado de drafts) corre primero en modo dry-run con reporte, y se ejecuta solo tras aprobación de Emanuel (gate).
- pnpm 11 con las protecciones ya verificadas (post-Shai-Hulud): `minimumReleaseAge`, scripts bloqueados. El repo nuevo/existente migra a pnpm si aún está en npm/bun. ⚠️ **Prerequisito:** resolver la rotura de npm/corepack en el entorno Windows (ya existe `prompt-reparar-npm.md`) antes de arrancar la Fase 0, porque bloquea a los agentes.

---

## 3. Árbol de información objetivo

### 3.1. Secciones (navegación principal)
```
/                        Home
/necesito-ayuda          ★ Prioridad máxima. FAQPage schema. CTA claro.
/nosotros                Historia, equipo, transparencia, distinciones
/acompanamiento          Qué hacemos, cómo trabajamos, casos (historias)
/observatorio            Datos, informes, enlace a Mapa del Delito. Dataset schema (isBasedOn SNIC)
/noticias                Blog consolidado (6 categorías)
/recursos                Documentos, guías (para familias / para prensa), videos
/contacto  ·  /donar     Conversión
/en                      Landing inglés (hreflang)
/legal/*                 Privacidad, términos
```

### 3.2. Las 6 categorías consolidadas (propuesta a validar en Fase 1 contra el inventario real)
1. `historias` — Historias de las familias que acompañamos
2. `acompanamiento` — Acompañamiento a víctimas
3. `incidencia` — Incidencia en políticas públicas / reforma penal
4. `prensa` — Medios y entrevistas
5. `institucional` — Distinciones, premios, comunicados
6. `observatorio` — Informes y datos

Todo post de las 13–16 categorías actuales se mapea a exactamente una. El mapa `categoria_vieja → categoria_nueva` se genera en Fase 1 y **Emanuel lo aprueba antes de ejecutar** (gate G1).

### 3.3. Tipos de contenido y su mecánica futura (responde la duda original)
| Contenido | Cómo se carga (equipo) | Cómo llega al sitio |
|---|---|---|
| Noticias/posts | wp-admin como siempre | REST `/posts` → ISR + webhook revalidación |
| Páginas institucionales | wp-admin (páginas) | REST `/pages` |
| **Documentos (PDF/informes)** | CPT "Documentos" en wp-admin: título, archivo, año, tipo, descripción | REST `/wp-json/wp/v2/documentos` → biblioteca en `/recursos` |
| **Videos** | Se suben a YouTube; en WP solo se pega la URL en un campo | Embed optimizado (`lite-youtube`) en Next.js |
| Imágenes | Media Library como siempre | URLs de Hostinger optimizadas con `next/image` |

---

## 4. Fases de ejecución

> Cada fase termina en un **gate**: reporte del orquestador + aprobación de Emanuel. Nada avanza sin gate aprobado. El progreso vive en `docs/ESTADO.md` del repo (qué se hizo, qué falta, decisiones tomadas) para que cualquier sesión nueva de agente retome sin pérdida de contexto — este archivo es la cura de la desorganización histórica del proyecto.

### FASE 0 — Auditoría y decisión repo (solo lectura, sin riesgo)
**Ejecuta:** `explorador` + Fable 5. **Duración estimada:** 1 sesión.
1. Reparar entorno npm/corepack (ejecutar `prompt-reparar-npm.md`) si aún pendiente.
2. Clonar `UsinaDeJusticia/usina-de-justicia`. Auditar: ¿compila? ¿qué versión de Next? ¿cuántas de las 83 páginas están completas vs placeholder? ¿el fetching a WP REST funciona hoy? ¿estado del `CATEGORY_MAP`?
3. Auditar WP vía REST (sin credenciales, endpoints públicos): conteo real de posts por categoría, páginas publicadas vs draft, tamaño de Media Library.
4. **Decisión de gate G0:** *reutilizar repo* vs *repo nuevo importando lo rescatable*. Criterio: si el repo compila con Next ≥ 15 alcanzable con upgrade menor y la capa de fetching es sana → reutilizar (estructura y CATEGORY_MAP valen oro). Si está podrido o en Next 14 con deuda → repo nuevo `usina-web` copiando selectivamente `lib/`, tipos y las páginas buenas. **El diseño visual se aplica de cero en cualquier caso** (viene de Claude Design), así que "arrancar de nuevo" el estilo no depende de esta decisión.
5. Entregable: `docs/AUDITORIA.md` + recomendación fundada.

### FASE 1 — Inventario de contenido y mapa de migración
**Ejecuta:** `explorador` (extracción) + Fable 5 (análisis). 
1. Exportar inventario completo vía REST/WP-CLI: todos los posts (id, título, fecha, categorías, tags, autor, medios embebidos), todas las páginas, todos los adjuntos.
2. Generar `docs/MAPA-MIGRACION.md`: categoría vieja → nueva (con conteos), páginas WP → rutas Next.js, contenido IVUJUS identificado y marcado para redirect 301 futuro, contenido a NO migrar (drafts abandonados, duplicados como Colaborar/Donar, experimentos tipo "Inicio nueva", "Sabías que?").
3. Detectar posts con video propio (.mp4 en Hostinger) → lista para subir a YouTube (única tarea semi-manual del proyecto; se puede asistir con agente + API de YouTube).
4. **Gate G1:** Emanuel aprueba el mapa de migración (idealmente con revisión de Jimena para el criterio editorial).

### FASE 2 — Preparar WordPress como headless
**Ejecuta:** `implementador` con WP-CLI + Hostinger MCP.
1. **Backup completo** (archivos + DB). Verificar restaurabilidad.
2. Instalar/activar: ACF (free), plugin propio `usina-headless` (CPT Documentos con `show_in_rest`, campos ACF en REST, webhook → endpoint de revalidación de Vercel).
3. Ejecutar reasignación de categorías 16→6 con WP-CLI: primero dry-run con reporte, luego real (gate G2 entre medio).
4. Crear usuario `agente-migracion` + Application Password. Configurar WordPress MCP para acceso de agentes.
5. Higiene: forzar HTTPS (Hostinger Tools), deshabilitar XML-RPC, verificar que `/wp-json` responde rápido, purgar caché.
6. **Gate G2:** categorías consolidadas verificadas en el panel; el equipo editorial no nota ningún cambio en su flujo.

### FASE 3 — Frontend: estructura + integración de contenido
**Ejecuta:** `implementador` (páginas clave) + Codex (plantillas repetitivas). Rama por sección, preview de Vercel por rama.
1. Base del repo (según G0): Next.js 15+, App Router, TypeScript, Tailwind v4, pnpm. Capa `lib/wp.ts` tipada para REST (posts, pages, documentos, media) con ISR (revalidate 300s) + endpoint `/api/revalidate` para el webhook.
2. Construir por orden de prioridad: `/necesito-ayuda` → Home → `/noticias` (+6 categorías + detalle de post) → `/nosotros` → `/acompanamiento` → `/observatorio` → `/recursos` → `/contacto`, `/donar` → `/en` → `/legal`.
3. Aplicar el sistema de diseño de Claude Design de forma transversal (tokens de color/tipografía en Tailwind config — un solo estilo para todo, D8).
4. Render de contenido WP: sanitizar HTML de posts, mapear embeds (YouTube → lite-embed, imágenes → `next/image` con dominio de Hostinger permitido).
5. **Gate G3:** navegación completa en preview de Vercel con contenido real; Emanuel verifica en móvil.

### FASE 4 — SEO + GEO (actualizado a doctrina mayo 2026)
**Ejecuta:** `implementador`. Primero: **actualizar `docs/geo-schema.md`** eliminando llms.txt/chunking y consolidando lo vigente.
1. Metadata API en todas las rutas (title pattern, description, OG/Twitter cards con imágenes propias, canonicals).
2. JSON-LD: `NGO` en layout raíz (fundación 2014, Reconquista 458, `sameAs` completo), `Article` en posts, `BreadcrumbList` en rutas jerárquicas, `Dataset` en /observatorio (`isBasedOn` → SNIC, enlace a Mapa del Delito), `FAQPage` en /necesito-ayuda.
3. `sitemap.xml` dinámico (~850 URLs) + `robots.txt` (bloquear /api, permitir todo lo público).
4. `hreflang` solo entre `/` y `/en`. Eliminar cualquier resto del hack de Google Translate.
5. **Tabla de redirects 301**: URL vieja de WP → URL nueva (generada desde el inventario de Fase 1), implementada en `next.config` / middleware. Incluye rutas IVUJUS → placeholder hasta que ivujus-web esté vivo.
6. Acciones fuera del código (Emanuel, asistido): **entrada en Wikidata** de Usina (máxima palanca GEO) + Google Business Profile + Search Console del dominio con el sitio nuevo.
7. **Gate G4:** Rich Results Test verde en las 5 plantillas; Lighthouse ≥ 90; sitemap válido.

### FASE 5 — Cutover
**Ejecuta:** Fable 5 orquesta; `hapi`/Hostinger MCC para DNS.
1. Congelar publicación editorial por unas horas (avisar al equipo).
2. Verificación final del preview de producción con dominio de prueba.
3. DNS: `usinadejusticia.org.ar` → Vercel. WP queda accesible en el mismo hosting (wp-admin directo o subdominio `panel.`). Purga de caché/CDN vía MCP.
4. Smoke test post-cutover: 20 URLs con más tráfico (según Search Console) responden 200 o 301 correcto.
5. Monitoreo 72h: Search Console (errores de cobertura), Vercel Analytics.
6. **Gate G5 = lanzamiento.** Revocar credenciales de agentes de migración.

### FASE 6 — Post-lanzamiento (backlog, no bloquea nada)
- Redirects finales IVUJUS cuando `ivujus-web` salga.
- Buscador interno (Algolia/pagefind o pgvector si se justifica).
- Features "de época": interfaz conversacional/agente sobre el contenido, integración profunda con Mapa del Delito, newsletter.
- Entrada Wikidata de IVUJUS con `parent organization`.

---

## 5. Estructura del repositorio (destino)
```
usina-de-justicia/            (o usina-web si G0 decide repo nuevo)
├── docs/
│   ├── PLAN-MAESTRO.md       ← este documento
│   ├── ESTADO.md             ← actualizado por el orquestador en cada sesión
│   ├── AUDITORIA.md          ← salida Fase 0
│   ├── MAPA-MIGRACION.md     ← salida Fase 1
│   └── geo-schema.md         ← actualizado en Fase 4
├── src/app/...               ← rutas según árbol §3.1
├── src/lib/wp.ts             ← capa REST tipada
├── src/components/...
├── wp-plugin/usina-headless/ ← plugin WP versionado acá, deploy vía Hostinger MCP
└── scripts/                  ← WP-CLI batch scripts (dry-run flags)
```

## 6. Lo que Emanuel hace personalmente (todo lo demás es de agentes)
1. Resolver/supervisar la reparación de npm (prompt ya existe).
2. Generar credenciales: Application Password WP, token Hostinger API, verificar SSH.
3. Aprobar los gates G0–G5 (revisar previews en móvil).
4. Validar el mapa de categorías con criterio editorial (con Jimena si corresponde).
5. Crear la entrada de Wikidata y el Google Business Profile (asistido por agente).
6. Avisar al equipo editorial del freeze breve en el cutover.

---

*Handoff: abrir Claude Code Desktop, cargar este documento como contexto raíz, y ejecutar Fase 0.*
