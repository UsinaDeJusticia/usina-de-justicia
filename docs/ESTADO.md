# ESTADO DEL PROYECTO — Rebuild Web Usina de Justicia
**Última actualización:** 13 de julio de 2026 · **Sesión:** Modernización + Fases 1 y 2 (Claude Code remoto, Fable 5 orquestador)

> Este archivo reemplaza a `PROYECTO-CONTEXTO.md` como fuente de verdad del estado del proyecto. Los documentos vinculantes son `docs/plan-maestro-usina-web.md` (decisiones D1–D9) y `docs/AUDITORIA-fase0.md` (gate G0 aprobado: reutilizar + modernizar).

---

## Estado actual (13-jul-2026)

**Modernización EN PRODUCCIÓN** (PR #1 mergeado; Vercel conectado; https://usina-de-justicia.vercel.app con pnpm 11 + Next 15.5 + React 19 + Tailwind 4).

**Gate G1 ✅ APROBADO** (11-jul): mapa 16→6 final con todas las decisiones editoriales en `docs/MAPA-MIGRACION.md` + `docs/inventario/COLA-LARGA-decisiones.md`.

**Gate G2 ✅ APROBADO Y EJECUTADO** (13-jul): reasignación de categorías corrida contra el WordPress de producción — **696/696 posts modificados, 0 errores**. Verificado en vivo: historias 127 · acompanamiento 121 · incidencia 129 · prensa 404 · observatorio 8 · institucional 34 (+1 por diseño: post 8926 conserva ambas categorías hasta el cutover). Estrategia ADITIVA: ninguna categoría vieja se quitó; el sitio Elementor actual no muestra ningún cambio visible (verificado). Los 19 posts IVUJUS quedaron intactos. Rollback posible: `docs/inventario/reasignacion-log.json` guarda el estado previo de cada post.

## Infraestructura de agentes sobre WordPress (Fase 2)
- **Plugin `usina-headless` v0.3.0 activo** (`wp-plugin/` en el repo, se sube como zip por wp-admin): re-habilita Application Passwords (un plugin las tenía apagadas), corrige el pasaje del header Authorization a PHP (regla .htaccess + populate de PHP_AUTH en FastCGI/LSAPI), deshabilita XML-RPC, y expone `/wp-json/usina-headless/v1/status` con autodiagnóstico del pipeline de autenticación.
- **Usuario `agente-migracion` (rol editor)** con Application Password activa; credenciales en variables de entorno del entorno remoto (`WP_APP_USER`/`WP_APP_PASSWORD`), nunca en repo/chat. Revocar al terminar la migración.
- **SSH de Hostinger habilitado** pero inutilizable desde el entorno remoto (la red solo permite HTTPS); queda para sesiones locales. Todo lo de Fase 2 se hizo por REST API.
- Backup completo previo verificado: `.wpress` ~2 GB (archivos + DB) en PC de Emanuel + copia en Drive.

## Fixes de frontend (13-jul, en rama)
- `/blog` ya no da 500 si la WP API falla (try/catch + estado vacío).
- `/contacto` con metadata propia (title/description; corregida duplicación del sufijo del sitio).
- Nuevo `POST /api/revalidate` (secret vía `REVALIDATE_SECRET`, revalida paths) — contraparte lista para el webhook del plugin.

## Decisiones tomadas
1. Next fijado en **15.5.20** (el plan especifica 15.x; existe Next 16.2 — evaluar post-lanzamiento).
2. `minimumReleaseAge: 10080` (7 días) como política supply-chain.
3. Diseño visual actual intacto — se reemplaza en Fase 3 con el de Claude Design (Emanuel ya tiene una versión).
4. Regla de dedup multi-categoría: historias > acompanamiento > incidencia > prensa > institucional.
5. Categorías nuevas en WP: acompanamiento id 253 · incidencia 254 · prensa 255 · observatorio 256 · historias 211 (reusada) · institucional 6 (reusada).

## Pendientes
1. **Fase 2, restos:** CPT Documentos + webhook de revalidación en el plugin (v0.4) — conviene junto con `/recursos` en Fase 3. Forzar HTTPS/verificaciones de higiene ya cubiertas en lo esencial (XML-RPC off).
2. **Fase 3 (siguiente):** diseño de Claude Design → tokens en `@theme` + componentes; árbol de rutas nuevo (`/noticias`, `/necesito-ayuda` ★, `/nosotros`, `/acompanamiento`, `/observatorio`, `/recursos`, `/en`); actualizar `CATEGORY_MAP` a las 6 categorías definitivas (IDs arriba); migrar contenido de páginas según MAPA-MIGRACION §4.
3. Deuda menor: migrar de `next lint` a ESLint CLI antes de Next 16; borrar `PROYECTO-CONTEXTO.md` en Fase 3.
4. Post-cutover (Fase 5): limpiar categorías viejas de los posts (log de reasignación como referencia), redirects 301 (IVUJUS + URLs viejas), revocar credenciales de agente.
5. (Solo trabajo local en Windows) reparar npm/corepack con `prompt-reparar-npm.md`.

## Próximo paso exacto
**Arrancar Fase 3:** Emanuel comparte el diseño de Claude Design (link o export) → extracción de tokens (D8: navy #1E427C, gris #A7A8AC, blanco; nunca violeta) → construcción por prioridad: `/necesito-ayuda` → Home → `/noticias` (6 categorías nuevas + detalle) → resto del árbol. Rama con preview de Vercel por sección; gate G3 = navegación completa con contenido real verificada en móvil.
