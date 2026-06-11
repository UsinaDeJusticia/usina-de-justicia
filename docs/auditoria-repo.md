# Auditoría del repositorio — Día 1

Fecha: 11 de junio de 2026
Rama de trabajo: `feat/dia1-inventario`

## Veredicto

**APTO CON RESERVAS** — el build pasa limpio y la integración WP es sólida, pero
las rutas actuales no coinciden con la IA nueva (el blog vive en `/blog`, no en
`/noticias`), el `next.config.mjs` trae ~35 redirects especulativos que **chocan
con el redirect map nuevo** (incluye `/noticias → /blog`, el inverso exacto del
plan: combinarlos produciría un loop), y faltan sitemap/robots. Nada de esto es
estructural; es trabajo de los Días 2 y 6–7.

## 1. Identificación

- **Repo:** `UsinaDeJusticia/usina-de-justicia` (GitHub)
- **Rama principal:** `master`
- **Último commit:** `97e6aea` — 2026-03-10 — "Docs: nota sobre ampliar medios de pago en Donar"
- El repo estuvo 3 meses sin commits (marzo → junio 2026).

## 2. Build

- **Package manager:** npm (hay `package-lock.json`; se respetó, no se usó bun)
- `npm ci`: ✅ sin errores
- `npm run build`: ✅ **PASA** (exit 0) — 20 páginas estáticas generadas
- Importante: el build pasa incluso **sin acceso de red al WP** — la capa de
  fetch degrada con listas vacías en vez de romper. Bueno para CI/Vercel.

## 3. Stack

| Componente | Versión / Estado |
|---|---|
| Next.js | 14.2.35 (App Router, `src/` dir) |
| React | 18.x |
| TypeScript | 5.x, **`strict: true`** ✅ |
| Tailwind CSS | 3.4.1 |
| Node usado en auditoría | 22.22.2 |
| ISR | `revalidate: 300` a nivel fetch en `wpFetch()` |

## 4. Mapa de rutas (16 archivos de página, 4 dinámicas)

```
/                                    ✅ conectada a WP
/blog                                ✅ WP, paginación ?page=N (server-rendered)
/blog/[slug]                         ✅ WP (SSG)
/blog/categoria/[categoria]          ✅ WP (SSG)
/blog/tag/[tag]                      ✅ WP (SSG)
/sobre-nosotros                      ✅ contenido real
/sobre-nosotros/equipo               ⏳ placeholder
/sobre-nosotros/transparencia        ✅ PDFs 2021-2023
/programas                           ⏳ placeholder
/programas/[slug]                    ⏳ placeholder — pre-genera 4 slugs INVENTADOS
                                        (asistencia-a-victimas, reformas-legislativas,
                                        capacitacion-y-formacion, litigio-estrategico)
                                        que NO coinciden con los programas reales
/recursos                            ⏳ placeholder
/galeria                             ⏳ placeholder
/contacto                            ⏳ placeholder
/donar                               ⏳ placeholder (datos MP/BBVA en PROYECTO-CONTEXTO)
/legal/privacidad                    ✅
/legal/terminos                      ✅
```

**Sobre las "~83 rutas" esperadas:** el repo tiene 16 archivos de ruta. Las
URLs públicas se multiplican vía rutas dinámicas (825 posts en `/blog/[slug]`,
categorías, tags), pero como árbol de páginas son 16. La cifra de 83 no
corresponde a este repo tal como está hoy.

## 5. Capa de integración WordPress

- **Fetchers:** `src/lib/wordpress.ts` — `wpFetch()` base con timeout 15s,
  transformadores WP→tipos propios, y 10 funciones públicas (posts, categorías,
  tags, búsqueda, secciones).
- **CATEGORY_MAP:** `src/types/wordpress.ts` — mapea los 16 slugs de categorías
  WP a 6 secciones (`historias`, `medios`, `incidencia`, `actividades`,
  `institucional`, `informativo`) + 2 ignoradas (`otras`, `ig-publicaciones`).
  ⚠ Estas 6 secciones **no coinciden** con las 6 categorías destino del plan de
  relanzamiento (`institucional`, `incidencia`, `acompanamiento`, `medios`,
  `distinciones` + `/historias` como sección propia). Reconciliar en Día 2.
- **Caché:** doble capa — ISR de Next (`next: { revalidate: 300 }`) + caché en
  memoria de 5 min para categorías y tags.
- **Base URL del API:** env var `NEXT_PUBLIC_WP_API_URL` con fallback hardcodeado
  a `https://usinadejusticia.org.ar/wp-json/wp/v2`. El plan pide `WP_API_BASE`;
  el script de inventario nuevo acepta ambas. Unificar en Día 6–7.

## 6. Resumen de PROYECTO-CONTEXTO.md

- Última actualización 10/03/2026. Documenta: WP con 825 posts publicados,
  14 borradores, 16 categorías (tabla completa con counts), 9 plugins activos.
- **Fase 1 completa** (estructura + blog + home conectados a WP API).
- **Fase 2 en curso**: sobre-nosotros y transparencia listas; equipo, programas,
  distinciones y donar pendientes (con IDs de páginas WP que tienen el contenido
  real: programas id:213/103/101/15851, donar id:21260, distinciones id:20992).
- Pendientes SEO ya identificados: JSON-LD, sitemap dinámico, robots.txt,
  canonicals en paginadas.
- Deuda declarada: tags al azar, link MercadoPago a verificar, página Donar
  necesita sistema modular de pagos.
- ⚠ El plan original del documento era migrar a **Strapi** (Fase 6); la
  arquitectura decidida ahora es **WP permanente como CMS headless**. El
  documento quedó desactualizado en ese punto.

## 7. Deuda técnica visible

1. **🔴 Redirects especulativos en `next.config.mjs`:** ~35 redirects con
   sources que no existen en el WP real (`/comunicados`, `/opinion`, `/prensa`,
   `/mision-y-vision`…) y destinos a categorías inexistentes
   (`/blog/categoria/comunicados`). Crítico: incluye **`/noticias → /blog`**,
   exactamente el inverso del redirect map nuevo (`/blog → /noticias`). Si en el
   Día 6–7 se conecta el map sin limpiar esto primero, hay loop infinito.
   **Acción Día 2: vaciar ese bloque.**
2. **Slugs inventados en `/programas/[slug]`:** `generateStaticParams` hardcodea
   4 programas que no son los reales (acompañamiento, incidencia, capacitación).
3. **Dependencia muerta:** `next-sitemap` está en package.json pero no hay
   `next-sitemap.config.js` ni postbuild que lo use. Ni sitemap ni robots.txt
   existen.
4. **Canonicals hardcodeados con `www.`:** 15+ archivos usan
   `https://www.usinadejusticia.org.ar/...` literal. El sitio actual responde
   sin `www`. Centralizar en `site-config` + env var en Día 2.
5. **Optimizador de imágenes de Vercel activo:** `next.config.mjs` define
   `images.formats` y `remotePatterns` y las páginas usan `next/image` sin
   `unoptimized` — viola la decisión de servir imágenes directo desde WP
   (límite 5.000 transformaciones/mes en Hobby). **Acción Día 2/6: `images.unoptimized = true`.**
6. **Secretos:** ✅ ninguno commiteado. No hay `.env*` en git; los datos
   bancarios/CBU en PROYECTO-CONTEXTO.md son públicos por naturaleza (página
   Donar). Sin URGENTES.
7. Dependencias razonablemente al día (Next 14.2.x es LTS de facto; no bloquea).

## 8. Riesgo para el deadline (22 de junio)

El repo es una base viable. Lo que falta para producción: reestructura de rutas
a la IA nueva (Día 2), páginas placeholder con contenido real (programas,
contacto, donar→colaborar), sitemap/robots, conectar redirect map, y DNS.
Apretado pero factible si no se agrega alcance.
