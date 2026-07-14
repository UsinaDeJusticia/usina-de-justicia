# ESTADO DEL PROYECTO — Rebuild Web Usina de Justicia
**Última actualización:** 14 de julio de 2026 · **Sesión:** Modernización + Fases 1, 2 y 3 (Claude Code remoto, orquestador Sonnet 5)

> Este archivo reemplaza a `PROYECTO-CONTEXTO.md` como fuente de verdad del estado del proyecto. Los documentos vinculantes son `docs/plan-maestro-usina-web.md` (decisiones D1–D9) y `docs/AUDITORIA-fase0.md` (gate G0 aprobado: reutilizar + modernizar).

---

## Estado actual (14-jul-2026)

**Modernización EN PRODUCCIÓN** (PR #1 mergeado; Vercel conectado; https://usina-de-justicia.vercel.app con pnpm 11 + Next 15.5 + React 19 + Tailwind 4).

**Gate G1 ✅ APROBADO** (11-jul): mapa 16→6 final con todas las decisiones editoriales en `docs/MAPA-MIGRACION.md` + `docs/inventario/COLA-LARGA-decisiones.md`.

**Gate G2 ✅ APROBADO Y EJECUTADO** (13-jul): reasignación de categorías corrida contra el WordPress de producción — 696/696 posts modificados, 0 errores. Estrategia ADITIVA: ninguna categoría vieja se quitó; el sitio Elementor actual no muestra ningún cambio visible. Los 19 posts IVUJUS quedaron intactos. Rollback posible vía `docs/inventario/reasignacion-log.json`.

**Fase 3 (rediseño completo) ✅ TODAS LAS OLAS PUSHEADAS (13-14 jul).** Todo el árbol de navegación quedó en el diseño nuevo. **Pendiente: gate G3 — revisión completa de Emanuel en el teléfono** sobre el preview de la rama.

## Árbol de navegación — estado final de la Fase 3

| Ruta | Estado | Fuente de contenido |
|---|---|---|
| `/` (Home) | ✅ Rediseñada | Hero rotador 3 variantes + secciones institucionales + último post real de WP |
| `/necesito-ayuda` ★ | ✅ Nueva | Copy 100% trazado a fuente real (ver `docs/COPY-necesito-ayuda.md`) — **pendiente que Emanuel la lea antes del launch** |
| `/noticias` (ex `/blog`) | ✅ Renombrada + rediseñada | 841 posts reales, 6 categorías definitivas de WP (redirect 308 desde `/blog*`) |
| `/nosotros` (ex `/sobre-nosotros`) | ✅ Renombrada + rediseñada + fusionada | WP 94 (historia/valores) + distinciones reales (extraídas de dentro de la propia página, ver hallazgo abajo) + agradecimientos (sección) + transparencia (PDFs reales) |
| `/acompanamiento` | ✅ Nueva (reemplaza `/programas`, que era 100% placeholder inventado) | WP 103 + 44, distinta de `/necesito-ayuda` (institucional vs. urgente) |
| `/observatorio` | ✅ Nueva | 8 posts reales de la categoría + link a Mapa del Delito (`mapa-delito-usina.vercel.app`, sin dominio propio aún) |
| `/recursos` | ✅ Reescrita con datos reales | 88 documentos reales (71 posts con PDF) del inventario — v1 sin CPT, ver pendiente abajo |
| `/donar`, `/legal/privacidad`, `/legal/terminos` | ✅ Restyle puro | Contenido intacto (bancarios, MercadoPago, Ley 25.326) |
| `/contacto` | ✅ Restyle puro | Formulario sigue con submit simulado — ver pendiente abajo |
| `/en` | ✅ Nueva, v1 mínima | Solo hechos ya verificados en español (fundación 2014, misión, contacto) — marcada en código como pendiente del contenido real de la presentación OEA (decisión D5) |

**Componente nuevo reusable:** `src/components/documentos/DocumentCard.tsx`, extraído del patrón maduro de `/nosotros/transparencia` y reusado en `/recursos`.

## Hallazgos de esta sesión (para tener en cuenta)
1. **La página WP "Distinciones" (id 20992) es basura**: plantilla de Elementor sin publicar con contenido de relleno en inglés de un SaaS de reclutamiento, cero contenido real de Usina. Se descartó como fuente; las distinciones reales (Laurel de Plata, Socia Honoraria, Premio Defensor de la República, etc.) estaban dentro de la propia página "Nosotros" y de ahí se migraron.
2. **`/nosotros/equipo` sigue con datos de placeholder** — no existe ningún roster real del equipo en ninguna fuente. **Necesito que Emanuel pase nombres, roles y fotos del equipo** para completar esta página antes del lanzamiento.
3. **`/programas` era contenido 100% inventado** (4 "programas" hardcodeados sin conexión a WP) — se retiró del árbol y se reemplazó por `/acompanamiento`, con redirect 308.
4. Los PDFs de las memorias en `/nosotros/transparencia` estaban desactualizados (URLs de 2022/2023 muertas); se corrigieron a las URLs reales vigentes y se agregaron 2024/2025. El botón de "Año 2026" queda deshabilitado ("Próximamente") porque WordPress mismo no tiene el archivo todavía.

## Infraestructura de agentes sobre WordPress (Fase 2)
- Plugin `usina-headless` v0.3.0 activo (`wp-plugin/`): re-habilita Application Passwords, corrige el pasaje del header Authorization a PHP, deshabilita XML-RPC, expone `/wp-json/usina-headless/v1/status`.
- Usuario `agente-migracion` (rol editor) con Application Password activa; credenciales en variables de entorno del entorno remoto. Revocar al terminar la migración.
- SSH de Hostinger habilitado pero inutilizable desde el entorno remoto (solo HTTPS); queda para sesiones locales.
- Backup completo previo verificado: `.wpress` ~2 GB en PC de Emanuel + copia en Drive.

## Decisiones tomadas
1. Next fijado en 15.5.20 (existe Next 16.2 — evaluar post-lanzamiento).
2. `minimumReleaseAge: 10080` (7 días) como política supply-chain.
3. Categorías nuevas en WP: acompanamiento id 253 · incidencia 254 · prensa 255 · observatorio 256 · historias 211 (reusada) · institucional 6 (reusada).
4. Hero de Home: rotador con las 3 variantes, densidad amplia, retratos SÍ (placeholder digno hasta tener consentimientos), acento ámbar SÍ.
5. Formulario de `/contacto`: se mantiene simulado en esta ola (decisión explícita) — conectar un envío real requiere elegir un servicio de email (Resend/SendGrid/etc.) y su API key, pendiente para Emanuel.
6. `/en`: v1 mínima con hechos verificados, sin esperar el contenido real de la OEA (decisión explícita).
7. Orquestación: planificación/verificación en el hilo principal, ejecución delegada a agentes `general-purpose` con `model: sonnet` (política pedida por Emanuel); tareas mecánicas de solo lectura pueden bajar a `haiku`.

## Pendientes
1. **Gate G3 (Emanuel): revisar el preview completo en el teléfono** — es lo único que falta para cerrar la Fase 3. Preview: https://usina-de-justicia-git-claude-usi-22815a-ejairsud-3412s-projects.vercel.app
2. **Contenido real que necesito de Emanuel:**
   - Nombres/roles/fotos del equipo para `/nosotros/equipo`.
   - Consentimientos de las familias para reemplazar los placeholders de retratos en Testimonios (Home).
   - Material real de la presentación ante la OEA para completar `/en`.
   - Decisión sobre el envío real de `/contacto` (servicio de email + API key).
3. **Fase 2, resto:** CPT "Documentos" + webhook de revalidación en el plugin (v0.4) — cuando esté, `/recursos` deja de ser v1 basada en el inventario estático.
4. Deuda menor: migrar de `next lint` a ESLint CLI antes de Next 16; borrar `PROYECTO-CONTEXTO.md`.
5. Post-cutover (Fase 5): limpiar categorías viejas de los posts, redirects 301 finales (IVUJUS + URLs viejas), revocar credenciales de agente.
6. (Solo trabajo local en Windows) reparar npm/corepack con `prompt-reparar-npm.md`.

## Próximo paso exacto
1. Emanuel revisa el preview completo (todas las páginas del árbol nuevo) en el teléfono — gate G3.
2. Con G3 aprobado y el contenido pendiente del punto 2 (equipo, retratos, OEA) resuelto → Fase 4: SEO/GEO (JSON-LD, sitemap, redirects finales, hreflang ya preparado para `/en`).
3. Abrir PR de esta rama a `master` cuando Emanuel lo indique (todas las olas de Fase 3 están pusheadas y con build verde).
