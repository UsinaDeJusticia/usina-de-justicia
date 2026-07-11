# ESTADO DEL PROYECTO — Rebuild Web Usina de Justicia
**Última actualización:** 11 de julio de 2026 · **Sesión:** Modernización + Fase 1 (Claude Code remoto, Fable 5 orquestador)

> Este archivo reemplaza a `PROYECTO-CONTEXTO.md` como fuente de verdad del estado del proyecto. Los documentos vinculantes son `docs/plan-maestro-usina-web.md` (decisiones D1–D9) y `docs/AUDITORIA-fase0.md` (gate G0 aprobado: reutilizar + modernizar).

---

## Estado actual (fin de sesión 10-11 jul)

**La modernización está EN PRODUCCIÓN.** Emanuel mergeó el PR #1 a `master` y conectó el repo a Vercel (proyecto `usina-de-justicia`). El sitio corre en https://usina-de-justicia.vercel.app con el stack nuevo. **La Fase 1 está completa**: inventario extraído en vivo y mapa de migración v1.0 listo para el gate G1.

## Qué se hizo

### Modernización (mergeada a master vía PR #1) ✅
| Cambio | Detalle |
|---|---|
| npm → **pnpm 11.11.0** | `pnpm-workspace.yaml` con `minimumReleaseAge: 10080` (7 días); solo `sharp` y `unrs-resolver` aprobados como build scripts |
| Next 14.2 → **15.5.20** + React **19.2.7** | Codemod async-request-api (solo `programas/[slug]` lo necesitó); `wordpress.ts` intacto con `revalidate: 300` |
| Tailwind 3.4 → **4.3.2** CSS-first | `tailwind.config.ts` eliminado, tokens en `@theme` de `globals.css`; solo paridad funcional |

**Verificado en producción (Vercel):** build verde con el stack nuevo; smoke test OK con contenido real de WP: `/`, `/blog` (posts reales), `/blog/jesus-buffarini`, `/blog/categoria/historias`, `/contacto`.

### Fase 1 — Inventario completo en vivo ✅
- Emanuel agregó `usinadejusticia.org.ar` al network allowlist del entorno remoto → la extracción corrió completa el 11-jul.
- `scripts/inventario.mjs` (ahora proxy-aware vía `undici` para entornos sandboxeados) exportó a `docs/inventario/`: **841 posts** (+16 desde marzo), **20 páginas**, **1.230 media** (114 PDF, 64 MP4), 16 categorías, 37 tags.
- Flags detectados: 43 posts con .mp4 propio (56 archivos únicos), 150 con YouTube, 71 con PDF, 37 con patrón IVUJUS.
- `docs/MAPA-MIGRACION.md` **v1.0** con datos reales + `docs/inventario/ANEXO-listas.md` con las listas post-por-post (77 cola larga, 37 IVUJUS, 43 con video).

## Decisiones tomadas
1. Next fijado en **15.5.20** (el plan especifica 15.x; existe Next 16.2 — evaluar post-lanzamiento).
2. `minimumReleaseAge: 10080` (7 días) como política supply-chain.
3. Diseño visual actual intacto (paridad) — se reemplaza cuando llegue el de Claude Design.
4. Regla de dedup para posts multi-categoría (63 casos): gana la categoría más específica (historias > acompanamiento > incidencia > prensa > institucional).

## Pendientes
1. **Gate G1 (Emanuel):** aprobar `docs/MAPA-MIGRACION.md` §1–§4. Revisión editorial de Jimena sobre `docs/inventario/ANEXO-listas.md` (77 posts de cola larga + 37 candidatos IVUJUS).
2. Deuda técnica menor para Fase 3: try/catch en `src/app/blog/page.tsx` (hoy 500 si la WP API falla); metadata propia en `/contacto` (usa el título genérico del sitio); migrar de `next lint` a ESLint CLI antes de Next 16.
3. (Solo para trabajo local en Windows) reparar npm/corepack con `prompt-reparar-npm.md`.
4. Borrar `PROYECTO-CONTEXTO.md` en Fase 3 (obsoleto; el inventario en vivo lo reemplaza).

## Próximo paso exacto
1. Emanuel aprueba G1 (con Jimena para las listas del ANEXO).
2. Con G1 aprobado → **Fase 2** según plan maestro: **backup completo de WP (archivos + DB) como primer comando**, luego plugin `usina-headless`, reasignación 16→6 con dry-run + gate G2. Requiere que Emanuel genere credenciales (Application Password WP, SSH/token Hostinger) — nunca en el repo.
