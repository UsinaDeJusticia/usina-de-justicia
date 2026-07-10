# MAPA DE MIGRACIÓN — Fase 1 · Entregable del gate G1
**Versión:** 0.9 (borrador para aprobación) · **Fecha:** 10 de julio de 2026
**Estado de los datos:** conteos de `PROYECTO-CONTEXTO.md` (marzo 2026: 825 posts, 16 categorías). La re-verificación en vivo quedó **bloqueada por la política de red del entorno remoto** (ver §6). El script `scripts/inventario.mjs` está listo para regenerar este documento con datos frescos en cuanto haya acceso a la API.

> **Qué se aprueba en G1:** el mapa 16→6 (§1), el criterio para la cola larga (§2), el tratamiento IVUJUS (§3) y el destino de las páginas WP (§4). Las listas post-por-post (§2.1, §5) se completan con la corrida del inventario — no bloquean la aprobación del criterio.

---

## 1. Categorías: 16 viejas → 6 nuevas

Los conteos suman más de 825 porque hay posts con múltiples categorías (el inventario en vivo cuantificará el solapamiento). Regla general: **todo post queda en exactamente una categoría nueva**; ante conflicto, gana la más específica (historias > acompanamiento > incidencia > prensa > institucional).

| Categoría vieja (slug) | Posts (mar-2026) | → Nueva | Riesgo |
|---|---|---|---|
| medios-y-entrevistas | 429 | **prensa** | Bajo — 1:1 |
| historias | 121 | **historias** | Bajo — 1:1 |
| historias-de-los-miembros-de-uj | 5 | **historias** | Bajo |
| acompanamiento-a-victimas-de-homicidio | 121 | **acompanamiento** | Bajo — 1:1 |
| incidencia-en-politicas-publicas | 120 | **incidencia** | Bajo — 1:1 |
| debatesyconferencias | 20 | **institucional** (†) | Medio — revisar: los debates de reforma penal podrían ser `incidencia` |
| distinciones-premios | 17 | **institucional** | Bajo |
| capacitacion | 15 | **institucional** (†) | Medio — mayoría es contenido IVUJUS, ver §3 |
| actividades | 14 | **institucional** (†) | Medio — cajón de sastre, revisar |
| eventos | 6 | **institucional** | Bajo |
| institucional | 5 | **institucional** | Bajo — 1:1 |
| boletin-informativo | 2 | **institucional** | Bajo |
| publicaciones | 6 | **observatorio** | Bajo |
| estadisticas | 2 | **observatorio** | Bajo |
| otras | 3 | **revisar caso por caso** | — |
| ig-publicaciones | 0 | **eliminar** (vacía) | Nulo |

(†) = integra la cola larga con revisión editorial (§2).

**Resultado proyectado:** prensa ~429 · historias ~126 · acompanamiento ~121 · incidencia ~120 · institucional ~79 · observatorio ~8.

**Nota técnica:** el `CATEGORY_MAP` actual de `src/types/wordpress.ts` mapea a una taxonomía intermedia vieja (medios/actividades/informativo). En Fase 3 se actualiza a estas 6 categorías definitivas.

## 2. Cola larga (~90 posts) — criterio editorial

Las 9 categorías chicas suman ~90 posts. Propuesta de tratamiento por grupo:

| Grupo | Posts | Propuesta de destino | Decisión editorial requerida |
|---|---|---|---|
| debatesyconferencias | 20 | `institucional`, salvo debates de política criminal → `incidencia` | Jimena: separar por tema |
| distinciones-premios | 17 | `institucional` (todo) | Ninguna |
| capacitacion | 15 | Mayoría → redirect a IVUJUS (§3); lo propio de Usina → `institucional` | Confirmar cuáles son IVUJUS |
| actividades | 14 | Repartir: historias / incidencia / institucional según contenido | Jimena: caso por caso |
| eventos + institucional + boletin | 13 | `institucional` (todo) | Ninguna |
| publicaciones + estadisticas | 8 | `observatorio` (todo) | Ninguna |
| otras | 3 | Revisar: reasignar o borrar | Caso por caso (son 3) |

### 2.1. Lista post-por-post
⏳ **Pendiente de la corrida del inventario** (`node scripts/inventario.mjs` → `docs/inventario/posts.json`). El script ya marca cada post de estas categorías con título, fecha y flags para que la revisión editorial sea una sola pasada sobre una tabla.

## 3. Contenido IVUJUS → redirect 301 futuro

IVUJUS se separa a su propio sitio (decisión D6). En el WP de Usina hay contenido de capacitación/cursos/simposios que le pertenece:
- **Categoría `capacitacion` (15 posts):** candidatos principales.
- **Página WP `capacitacion` (id 15851):** contenido del programa — evaluar si se divide (lo institucional de Usina queda, lo académico va a IVUJUS).
- El script detecta automáticamente posts con patrón IVUJUS (`ivujus|simposio|diplomatura|curso|victimología`) vía flag `posibleIvujus` — la lista exacta sale del inventario en vivo.

**Tratamiento:** estos posts NO se migran al sitio nuevo; entran a la tabla de redirects 301 de Fase 4 apuntando a un placeholder hasta que `ivujus-web` esté vivo.

## 4. Páginas WP → rutas Next.js

| ID | Slug WP | Título | Destino Next.js | Acción |
|---|---|---|---|---|
| 94 | nosotros | Nosotros | `/nosotros` | Migrar (contenido real: historia, valores, objetivos) — hoy vive en `/sobre-nosotros`, se renombra según árbol §3.1 del plan |
| 21247 | transparencia-institucional | Transparencia | `/nosotros/transparencia` | Migrar (PDFs memorias 2021-2023, ya integrados) |
| 20992 | distinciones | Distinciones | `/nosotros` (sección) | Fusionar dentro de Nosotros |
| 103 | acompanamiento-a-la-victima | Acompañamiento a Víctimas | `/acompanamiento` | Migrar — pasa de "programa" a sección propia (D del árbol) |
| 101 | incidencia-en-politicas-publicas | Incidencia en PP | `/acompanamiento` o `/observatorio` (contenido de programa) | Migrar contenido; la ruta final la define el árbol de Fase 3 |
| 15851 | capacitacion | Capacitación | — | **No migrar entera**: contenido IVUJUS (§3); rescatar lo institucional de Usina |
| 213 | programas | Programas | — | **No migrar**: página vacía, la estructura de programas desaparece en el árbol nuevo |
| 21260 | donar | Donar | `/donar` | Ya migrada (datos bancarios BBVA + MercadoPago reales en el repo) |
| 8 | contacto | Contacto | `/contacto` | Ya migrada |
| — | (experimentos: "Inicio nueva", "Sabías que?", Colaborar…) | — | — | **No migrar**: duplicados/experimentos. Lista exacta sale de `pages.json` (el conteo total de ~23 páginas se confirma con el inventario) |

Rutas nuevas sin origen WP (se crean en Fase 3): `/necesito-ayuda` ★, `/observatorio`, `/en`, `/recursos` (nueva biblioteca con CPT Documentos).

## 5. Posts con video .mp4 propio (subir a YouTube)

⏳ **Pendiente del inventario en vivo.** El script detecta `.mp4` alojados en `usinadejusticia.org.ar` (flag `tieneMp4Propio` + lista `mp4Propios` con URLs exactas) y separa los embeds de YouTube ya existentes (`tieneYouTube`). Con `posts.json` generado, la lista de subida a YouTube sale de un filtro directo.

## 6. Bloqueo de red y cómo destrabarlo

Este entorno remoto solo permite salida a registries de paquetes y GitHub — `usinadejusticia.org.ar` devuelve 403 en el proxy. Opciones para completar los datos en vivo (elegir una):
1. **Recomendada:** en la configuración del entorno de Claude Code web (claude.ai/code → environment → network policy), agregar `usinadejusticia.org.ar` al allowlist. La próxima sesión corre el inventario directo.
2. Correr `node scripts/inventario.mjs` en cualquier máquina con Node 18+ y commitear `docs/inventario/`.

---
**Gate G1 — para aprobación de Emanuel:** ¿se aprueba el mapa §1, el criterio de cola larga §2, el tratamiento IVUJUS §3 y el destino de páginas §4? La revisión editorial de Jimena aplica a §2.1 cuando el inventario esté corrido.
