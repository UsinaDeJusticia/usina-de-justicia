# ESTADO DEL PROYECTO — Rebuild Web Usina de Justicia
**Última actualización:** 10 de julio de 2026 · **Sesión:** Modernización + Fase 1 (Claude Code remoto, Fable 5 orquestador)
**Rama de trabajo:** `claude/usina-justicia-rebuild-phase1-b6u658` (pusheada a origin)

> Este archivo reemplaza a `PROYECTO-CONTEXTO.md` como fuente de verdad del estado del proyecto. Los documentos vinculantes son `docs/plan-maestro-usina-web.md` (decisiones D1–D9) y `docs/AUDITORIA-fase0.md` (gate G0 aprobado: reutilizar + modernizar).

---

## Qué se hizo en esta sesión

### TAREA 0 — Sanidad del entorno ✅
La sesión corrió en el entorno remoto de Claude Code (contenedor Linux), no en la máquina Windows — la rotura de npm/corepack de Windows no aplica acá. Node 22.22.2, npm 10.9.7, corepack 0.34.6 funcionando. La reparación del entorno Windows (`prompt-reparar-npm.md`) sigue pendiente **solo para cuando se trabaje local**.

### TAREA 1 — Baseline ✅ (con salvedad de red)
- **Build baseline sobre master: VERDE.** Next 14.2.35, 20 páginas generadas, sin errores de tipos ni warnings.
- **Verificación de la API en vivo: BLOQUEADA.** La política de red del entorno remoto solo permite salida a registries de paquetes y GitHub; `usinadejusticia.org.ar` devuelve 403 en el proxy (probado con curl y WebFetch, incluso example.com da 403). Los conteos de marzo (825 posts, 16 categorías) siguen siendo la referencia, sin re-verificar.
- Por lo mismo, el build genera las rutas de blog vacías (los `generateStaticParams` tienen try/catch y devuelven `[]` sin red). Es esperado en este entorno; en Vercel el build fetchea WP normalmente.

### TAREA 2 — Modernización ✅ (build verde en cada paso)
| Paso | Commit | Resultado |
|---|---|---|
| npm → pnpm 11.11.0 | `bdaa5c0` | `pnpm-workspace.yaml` con `minimumReleaseAge: 10080` (7 días) y solo 2 build scripts aprobados (`sharp`, `unrs-resolver`) vía `allowBuilds` |
| Next 14.2 → **15.5.20** + React **19.2.7** | `2b574be` | Codemod `next-async-request-api` solo tocó `programas/[slug]` (el resto ya usaba params async). `wordpress.ts` intacto: `revalidate: 300` verificado operativo |
| Tailwind 3.4 → **4.3.2** (CSS-first) | `8172d54` | `tailwind.config.ts` eliminado, tokens portados a `@theme` en `globals.css`, clases v3→v4 renombradas sin cambio visual. Solo paridad funcional, sin tokens nuevos (el diseño llega de Claude Design) |

**Smoke test local:** `/`, `/contacto`, `/donar`, `/sobre-nosotros` → 200. `/blog` → 500, pero es un **bug preexistente** (reproducido en el baseline): `src/app/blog/page.tsx` llama `getArticulos()` sin try/catch y sin red la página explota en runtime. No es regresión de la migración.

**Nota:** el plan pedía rama `chore/modernizacion`; esta sesión remota tiene rama designada obligatoria, así que todo va en `claude/usina-justicia-rebuild-phase1-b6u658`. El contenido es el mismo.

### TAREA 3 — Fase 1: inventario y mapa ✅ parcial (bloqueado por red)
- `scripts/inventario.mjs` (commit `4f17e5a`): pagina la REST API pública y exporta `docs/inventario/{posts,pages,media-resumen,resumen}.json`. Detecta por post: mp4 propio (Hostinger), embeds de YouTube, PDFs linkeados, y patrón IVUJUS. Solo lectura, sin credenciales. **No pudo correr acá** (403 del proxy).
- `docs/MAPA-MIGRACION.md` v0.9: mapa 16→6 con conteos de marzo, criterio de cola larga (~90 posts), tratamiento IVUJUS (no migrar + 301), páginas WP → rutas Next. Las listas post-por-post (§2.1 y §5) se completan cuando corra el inventario.

## Decisiones tomadas en esta sesión
1. Next se fijó en **15.5.20** (última 15.x), NO 16.x — el plan especifica 15.x y no se reabre. Existe Next 16.2; evaluar el salto recién post-lanzamiento. `next lint` está deprecado en Next 16 (migrar a ESLint CLI cuando toque).
2. `minimumReleaseAge: 10080` (7 días) como política supply-chain — ajustar si la config global de la máquina de Emanuel usa otro valor.
3. El diseño visual actual quedó tal cual (paridad funcional) — se descarta completo cuando llegue el de Claude Design.

## Pendientes para Emanuel (bloquean lo marcado)
1. **Conectar el repo a Vercel** (bloquea el preview): vercel.com → Add New Project → Import `UsinaDeJusticia/usina-de-justicia`. No existe proyecto Vercel para este repo (verificado vía MCP; sí existen ivujus-web, simposio2026, etc.). Con eso, cada push de rama genera preview automático — y en Vercel `/blog` va a renderizar con contenido real porque ahí sí hay red hacia WP.
2. **Destrabar la red del entorno remoto** (bloquea inventario en vivo): en claude.ai/code → configuración del entorno → network policy, permitir `usinadejusticia.org.ar`. Alternativa: correr `node scripts/inventario.mjs` en cualquier máquina con Node 18+ y commitear `docs/inventario/`.
3. **Aprobar gate G1**: revisar `docs/MAPA-MIGRACION.md` (§1 mapa, §2 criterio cola larga, §3 IVUJUS, §4 páginas). La revisión editorial de Jimena aplica a las listas post-por-post cuando el inventario esté corrido.
4. (Cuando toque trabajar local) reparar npm/corepack en Windows con `prompt-reparar-npm.md`.

## Deuda técnica anotada
- `src/app/blog/page.tsx`: sin try/catch en `getArticulos()` → 500 si la WP API falla. Fix chico recomendado en Fase 3 (estado vacío elegante).
- Tags de WP sin criterio (ya sabido) — se resuelve en migración de contenido.
- `PROYECTO-CONTEXTO.md` queda obsoleto: su flujo de trabajo (Minimax/artifacts) ya no aplica. Se conserva solo como referencia de datos hasta que el inventario en vivo lo reemplace; borrarlo en Fase 3.

## Próximo paso exacto
1. Emanuel: pendientes 1 y 2 de arriba (5 minutos en total).
2. Próxima sesión de agente: correr `node scripts/inventario.mjs`, completar §2.1 y §5 de `MAPA-MIGRACION.md` con datos reales, comparar conteos vivos vs marzo, y presentar el mapa final para aprobación G1.
3. Con G1 aprobado → Fase 2 (backup + WP headless) según plan maestro.
