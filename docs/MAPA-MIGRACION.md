# MAPA DE MIGRACIÓN — Fase 1 · Gate G1 ✅ APROBADO
**Versión:** 1.1 (final) · **Fecha:** 11 de julio de 2026 · **Aprobado por:** Emanuel
**Fuente:** REST API en vivo, extracción completa en `docs/inventario/` (841 posts, 20 páginas, 1.230 archivos de media, 16 categorías, 37 tags). Listas post-por-post en `docs/inventario/ANEXO-listas.md`; decisiones editoriales de la cola larga en `docs/inventario/COLA-LARGA-decisiones.md`.

**Evolución desde marzo:** +16 posts (825 → 841). Crecieron medios (+5), incidencia (+6), acompañamiento (+3), y hay contenido nuevo del Simposio 2026 y Victim Support Europe.

## Distribución FINAL aprobada (cada post en exactamente un destino)
| Destino | Posts | | Destino | Posts |
|---|---|---|---|---|
| prensa | 404 | | acompanamiento | 121 |
| incidencia | 129 | | institucional | 33 |
| historias | 127 | | observatorio | 8 |
| **IVUJUS → 301** | **19** | | **Total** | **841** |

## Decisiones G1 registradas (11-jul-2026)
1. **Debates y conferencias:** separados por tema — política criminal/reforma penal → `incidencia`; el resto → `institucional` (clasificación post-por-post en COLA-LARGA-decisiones.md).
2. **Simposio 2026 e IVUJUS:** todo el contenido propio de IVUJUS (Simposio 2026, cursos/capacitaciones, jornada CPACF, encuentro UNA Asunción) → **no se migra, redirect 301** (19 posts + 3 páginas). Las participaciones en simposios *externos* quedan en Usina.
3. **Newsletter:** se relanza post-lanzamiento (backlog Fase 6). La página `quiero-suscribirme` no se migra; los 2 posts de boletín → institucional.
4. **Regla de desempate** (63 posts multi-categoría): gana la más específica — historias > acompanamiento > incidencia > prensa > institucional.
5. **Páginas:** `agradecimientos` → sección en `/nosotros`; `gracias` se recrea en Next para el formulario de contacto.
6. **Índice de Calidad Legislativa:** el lanzamiento queda en `incidencia`; la jornada CPACF organizada por IVUJUS → 301.
7. **Libros de miembros** (Fiumara, Pascua) → `incidencia` (banderas de reforma penal).

---

## 1. Categorías: 16 viejas → 6 nuevas (conteos en vivo)

Hay 63 posts con más de una categoría y 0 sin categoría. Regla: **todo post queda en exactamente una categoría nueva**; ante conflicto, gana la más específica (historias > acompanamiento > incidencia > prensa > institucional).

| Categoría vieja (slug) | Posts (vivo) | mar-2026 | → Nueva | Riesgo |
|---|---|---|---|---|
| medios-y-entrevistas | 434 | 429 | **prensa** | Bajo — 1:1 |
| incidencia-en-politicas-publicas | 126 | 120 | **incidencia** | Bajo — 1:1 |
| acompanamiento-a-victimas-de-homicidio | 124 | 121 | **acompanamiento** | Bajo — 1:1 |
| historias | 121 | 121 | **historias** | Bajo — 1:1 |
| historias-de-los-miembros-de-uj | 7 | 5 | **historias** | Bajo |
| debatesyconferencias | 21 | 20 | **institucional** (†) | Medio — debates de reforma penal podrían ser `incidencia` |
| distinciones-premios | 17 | 17 | **institucional** | Bajo |
| actividades | 17 | 14 | **institucional** (†) | Medio — cajón de sastre, revisar |
| capacitacion | 15 | 15 | **institucional** (†) | Medio — 11 de 15 con patrón IVUJUS, ver §3 |
| eventos | 8 | 6 | **institucional** | Bajo |
| institucional | 6 | 5 | **institucional** | Bajo — 1:1 |
| boletin-informativo | 2 | 2 | **institucional** | Bajo |
| publicaciones | 6 | 6 | **observatorio** | Bajo |
| estadisticas | 2 | 2 | **observatorio** | Bajo |
| otras | 3 | 3 | **revisar caso por caso** | — (son 3) |
| ig-publicaciones | 0 | 0 | **eliminar** (vacía) | Nulo |

(†) = integra la cola larga con revisión editorial (§2).

**Resultado proyectado (antes de dedup de multi-categoría):** prensa ~434 · historias ~128 · incidencia ~126 · acompanamiento ~124 · institucional ~86 · observatorio ~8.

**Nota técnica:** el `CATEGORY_MAP` de `src/types/wordpress.ts` mapea a una taxonomía intermedia vieja (medios/actividades/informativo). En Fase 3 se actualiza a estas 6 categorías definitivas.

## 2. Cola larga — 77 posts que necesitan criterio editorial

De los ~90 posts en categorías chicas, **77 pertenecen SOLO a la cola larga** (el resto también está en una categoría grande y se mapea automático). Lista completa con fecha, link y flag IVUJUS en `docs/inventario/ANEXO-listas.md` §1, agrupada así:

| Grupo | Posts exclusivos | Propuesta de destino | Decisión editorial |
|---|---|---|---|
| debatesyconferencias | 17 | `institucional`, salvo política criminal → `incidencia` | Jimena: separar por tema |
| capacitacion | 15 | Mayoría IVUJUS → 301 (§3); lo propio de Usina → `institucional` | Confirmar cuáles son IVUJUS |
| distinciones-premios | 15 | `institucional` (todo) | Ninguna |
| actividades | 13 | Repartir: historias / incidencia / institucional | Jimena: caso por caso |
| eventos + institucional + boletin | 13 | `institucional` (todo) | Ninguna |
| publicaciones + estadisticas | 8 | `observatorio` (todo) | Ninguna |
| otras | 3 | Reasignar o borrar | Caso por caso |

## 3. Contenido IVUJUS → redirect 301 futuro (decisión D6)

**37 posts** con patrón IVUJUS detectados automáticamente (`ivujus|simposio|diplomatura|curso|capacitación|victimología`) — lista completa en ANEXO §2. De ellos, 11 están en la categoría `capacitacion`. La detección es de recall alto: incluye eventos del Simposio 2026 que podrían ser institucionales de Usina — requiere confirmación editorial.

Páginas WP que también son IVUJUS: `inscripcion-al-curso-de-victimologia` (18480), `preinscripcion-al-curso` (18452) y `capacitacion` (15851, parcial).

**Tratamiento:** lo confirmado como IVUJUS no se migra; entra a la tabla de redirects 301 de Fase 4 apuntando a un placeholder hasta que `ivujus-web` esté vivo.

## 4. Páginas WP (20 en vivo) → rutas Next.js

| ID | Slug WP | Título | Destino | Acción |
|---|---|---|---|---|
| 94 | nosotros | Nosotros | `/nosotros` | Migrar (hoy en `/sobre-nosotros`, se renombra según árbol del plan) |
| 21247 | transparencia-institucional | Transparencia | `/nosotros/transparencia` | Migrar (PDFs ya integrados) |
| 20992 | distinciones | Distinciones | `/nosotros` (sección) | Fusionar |
| 22579 | agradecimientos | Agradecimientos | `/nosotros` (sección) | Fusionar (evaluar) |
| 103 | acompanamiento-a-la-victima | Acompañamiento | `/acompanamiento` | Migrar — sección propia |
| 44 | acompanamos-a-las-victimas | Acompañamos a las familias | `/acompanamiento` | Fusionar con la anterior (es su hija) |
| 101 | incidencia-en-politicas-publicas | Incidencia en PP | contenido → `/acompanamiento` u `/observatorio` | Migrar contenido; ruta final en Fase 3 |
| 21260 | donar | Donar | `/donar` | Ya migrada (BBVA + MercadoPago) |
| 8 | contacto | Contacto | `/contacto` | Ya migrada |
| 9 | blog | Blog | `/noticias` | La reemplaza el blog consolidado |
| 15851 | capacitacion | Capacitación | — | **No migrar entera**: IVUJUS (§3); rescatar lo institucional |
| 18480 | inscripcion-al-curso-de-victimologia | Inscripción curso | — | **No migrar**: IVUJUS → 301 |
| 18452 | preinscripcion-al-curso | Preinscripción | — | **No migrar**: IVUJUS → 301 |
| 213 | programas | PROGRAMAS | — | **No migrar**: vacía; la estructura desaparece |
| 19713 | inicio-nueva | Inicio nueva | — | **No migrar**: experimento |
| 109 | sabias-que | Sabías que? | — | **No migrar**: experimento |
| 97 | colaborar | Colaborar | — | **No migrar**: duplicado de Donar → 301 a `/donar` |
| 6 | el-nuevo-umoma-abre-sus-puertas-2 | inicio | — | **No migrar**: home vieja de Elementor |
| 113 | gracias | Gracias | página de gracias post-form | Recrear en Next si el form la usa |
| 13574 | quiero-suscribirme | Quiero Suscribirme | — | Decidir: ¿newsletter sigue? Si sí → `/contacto` o footer |

Rutas nuevas sin origen WP (Fase 3): `/necesito-ayuda` ★, `/observatorio`, `/en`, `/recursos` (biblioteca con CPT Documentos).

## 5. Videos: 43 posts con .mp4 propio → subir a YouTube

- **43 posts** embeben **56 archivos .mp4 únicos** alojados en Hostinger (lista con links en ANEXO §3).
- La Media Library tiene **64 .mp4 en total** → 8 no están embebidos en ningún post publicado (huérfanos o en drafts; revisar antes de descartar).
- Además hay **150 posts con embeds de YouTube** ya correctos (no requieren acción) y **71 posts que linkean PDFs** (insumo para el CPT Documentos de `/recursos`).
- Media total: 600 JPEG · 352 PNG · 114 PDF · 64 MP4 · 57 WebP · 16 SVG · 13 AVIF · 6 MP3 · resto menor.

## 6. Estado de la extracción

✅ Completa (11-jul-2026, API en vivo). Para regenerar: `node scripts/inventario.mjs` (en el entorno remoto requiere `usinadejusticia.org.ar` permitido en la network policy — ya configurado).

---
**Gate G1 — para aprobación de Emanuel:** ¿se aprueba el mapa §1, el criterio de cola larga §2, el tratamiento IVUJUS §3 y el destino de páginas §4? Revisión editorial de Jimena sobre `docs/inventario/ANEXO-listas.md` (77 posts de cola larga + 37 candidatos IVUJUS).
