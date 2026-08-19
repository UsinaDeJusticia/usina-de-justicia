# ESTADO DEL PROYECTO — Rebuild Web Usina de Justicia
**Última actualización:** 15 de julio de 2026 · **Sesión:** Fase 4 completa — Seguridad, Performance, SEO técnico, GEO + docs, gate G4 (Claude Code remoto, orquestador Sonnet 5)

> Este archivo reemplaza a `PROYECTO-CONTEXTO.md` como fuente de verdad del estado del proyecto. Los documentos vinculantes son `docs/plan-maestro-usina-web.md` (decisiones D1–D9) y `docs/AUDITORIA-fase0.md` (gate G0 aprobado: reutilizar + modernizar).

---

## Estado actual (14-jul-2026)

**Modernización EN PRODUCCIÓN** (PR #1 mergeado; Vercel conectado; https://usina-de-justicia.vercel.app con pnpm 11 + Next 15.5 + React 19 + Tailwind 4).

**Gate G1 ✅ APROBADO** (11-jul): mapa 16→6 final con todas las decisiones editoriales en `docs/MAPA-MIGRACION.md` + `docs/inventario/COLA-LARGA-decisiones.md`.

**Gate G2 ✅ APROBADO Y EJECUTADO** (13-jul): reasignación de categorías corrida contra el WordPress de producción — 696/696 posts modificados, 0 errores. Estrategia ADITIVA: ninguna categoría vieja se quitó; el sitio Elementor actual no muestra ningún cambio visible. Los 19 posts IVUJUS quedaron intactos. Rollback posible vía `docs/inventario/reasignacion-log.json`.

**Fase 3 (rediseño completo) ✅ COMPLETA — Gate G3 ✅ APROBADO (15-jul):** Emanuel revisó el sitio completo en su celular sobre el preview de la rama y lo aprobó ("se ve excelente"). Todo el árbol de navegación en el diseño nuevo.

**Gate G4 ✅ COMPLETO (15-jul):** optimización integral verificada — Lighthouse ≥96 en Performance y 100 en SEO en las 5 plantillas clave (ver sección Optimización).

## Rama mergeada: `feature/acompanamiento-guias-derechos` (11-ago-2026, PR #3 → master)

Trabajo posterior al merge de PR #2, sobre `/acompanamiento`, a pedido de Emanuel. No forma parte de las Fases 1-4 ni de los gates ya cerrados arriba — es evolución posterior. Detalle completo de fuentes y decisiones en `docs/COPY-acompanamiento-guias.md` v2.

1. Primera guía de la serie "Guías para la etapa que estás viviendo" (derechos durante la ejecución de la pena, Pcia. de Bs. As.) + FAQ de 4 preguntas — fuente: documento propio de Lucrecia Zárate + síntesis abstracta de una reunión interna (sin ningún dato de caso).
2. Cierre de página "Seguí explorando" con enlaces reales a otras secciones.
3. **Sección "Historias"**: la categoría real de WordPress "historias" (127 casos publicados al 11-ago, sube seguido) ahora se muestra en vivo desde `/acompanamiento` (6 más recientes + link a `/noticias/categoria/historias`) — surgió de una consulta de Emanuel sobre SEO/GEO: no se agregó contenido nuevo, se le dio visibilidad a contenido que el equipo ya publica desde hace años. Ningún nombre vive en el código; todo llega en runtime de la API de WP.
4. Refuerzo SEO/GEO de `/noticias/categoria/[categoria]`: JSON-LD `CollectionPage`+`ItemList` (las 6 categorías), prioridad de sitemap de "historias" subida a 0.7.
5. **Consulta legal RESUELTA**: los abogados de la organización confirmaron que la publicación de casos con nombre real es de interés público (ya salió en medios) y que los datos sensibles no se publican; agregan una regla: iniciales en vez de nombre completo cuando el imputado es menor de edad (criterio editorial para WordPress, no aplicable en código — ver `docs/COPY-acompanamiento-guias.md` §7).
6. **Copy v3 del equipo (11-ago)**: tras revisar el preview, el equipo mandó texto propio para el hero, el reencuadre y las 3 tarjetas de "Cómo trabaja el equipo", y pidió eliminar "Dos maneras de acompañar" (confusa). Implementado con un solo ajuste técnico (conservar "ejecución de la pena" en la tarjeta 3, no "cumplimiento de la pena", por consistencia de término con el resto del sitio). El hero ahora afirma que el servicio es gratuito — primera vez que el sitio lo dice explícitamente (fuente: el equipo). **RESUELTO**: el equipo confirmó que es gratuito sin condición; se corrigió `src/app/donar/page.tsx` (decía "para víctimas que no pueden costear un abogado") para unificar con `/acompanamiento`.
7. ~~**Pendiente sin resolver, dejado a propósito**~~ — **RESUELTO (19-ago)**: el caso sin fuente rastreable en `src/components/home/Testimonios.tsx` ("Néstor Alejandro Valdez") se retiró — Emanuel confirmó que no hay más registros disponibles, quedaba incompleto.
8. Build verde en cada commit, Lighthouse ≥90 en las 4 categorías verificado, PR #3 mergeado a `master`.

## Rama mergeada: `feature/equipo-comision-directiva` (11-ago-2026, PR #4 → master)

1. Comisión Directiva real en `/nosotros/equipo` (6 personas, ver sección "Pendientes" — punto 4). Sin fotos todavía.
2. `/necesito-ayuda` leído y aprobado por Emanuel sin cambios de copy.

## Rama mergeada: `feature/direccion-oea-contacto` (13/14-ago-2026, PR #5 y #6 → master)

1. Dirección postal + CUIT reales en el JSON-LD del NGO (`src/app/layout.tsx`).
2. `/en`: cerrado el pendiente de contenido OEA (confirmado que no existe esa presentación).
3. `/api/contact` real con Resend — probado y funcionando en producción (dominio verificado, bug del remitente con "www." corregido).
4. Fix: botón de teléfono invisible en el CTA final de `/necesito-ayuda` (bg-transparent faltante en el override del variant secondary).
5. Wikidata de Usina de Justicia conectada al `sameAs` del NGO (Q141058778, creada por Emanuel).

## Rama en curso: `feature/fotos-equipo-logo` (18-ago-2026, sin PR todavía)

1. **Logo**: Emanuel envió el logo re-exportado en PNG alta resolución (fondo transparente, 6772×2966) vía opencode (que pusheó los archivos crudos directo a `master`, commit `4956926`). Reemplaza a `public/images/logo_uj.png` (mismo diseño, solo mejor resolución de origen — Next.js lo redimensiona igual en cada uso).
2. **Fotos de la Comisión Directiva**: las 6 llegaron completas en el mismo push de opencode, sin nombre identificable (`diana1.png`, `guillermo1.png`, etc.). Renombradas a `public/images/equipo/<nombre-apellido>.png` y cableadas en `src/app/nosotros/equipo/page.tsx` (campo `foto` de cada integrante) — ya no se muestra el avatar de iniciales para ninguno de los 6.
3. Build verde. Falta abrir PR a `master`.

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

## Pendientes APARCADOS por decisión de Emanuel (15-jul) — se retoman después
Ninguno bloquea el trabajo técnico; varios sí bloquean el CUTOVER final:
1. ~~**Wikidata**~~ — **RESUELTO (14-ago)**: Emanuel creó y completó la entrada (Q141058778, https://www.wikidata.org/wiki/Q141058778), conectada al `sameAs` del NGO en `src/app/layout.tsx`.
2. ~~**Logo**~~ — **RESUELTO (18-ago)**: Emanuel envió el logo en PNG de alta resolución (no se pudo adjuntar en `.svg`, bloqueado por el cliente); reemplaza `public/images/logo_uj.png`.
3. ~~**Dirección postal**~~ — **RESUELTO (13-ago)**: Emanuel confirmó el domicilio legal (Basavilbaso 1350, 3° Dto. 311, C.A.B.A.) y el CUIT vía documento de IGJ; ya está en el JSON-LD del NGO (`src/app/layout.tsx`).
4. ~~**Equipo**~~ — **RESUELTO (18-ago)**: nómina real de la Comisión Directiva (6 personas: Diana Cohen Agrest -Presidente-, Raquel Slotolow -Secretaria-, Guillermo Bargna -Tesorero-, Raquel Berthi/Roberto Picozzi/Mariana Romano -Vocales-) con foto real de cada integrante, ya en `src/app/nosotros/equipo/page.tsx`.
5. **Retratos de Testimonios — PARCIALMENTE RESUELTO (13/19-ago)**: Emanuel confirmó que ya existe el consentimiento de las familias, y el caso sin fuente rastreable ("Néstor Alejandro Valdez") se retiró (queda 7 personas). Sigue faltando que mande los archivos de foto de cada una — Emanuel va a intentar conseguirlas (posiblemente lista para el 20-ago). Hasta entonces sigue el placeholder de iniciales.
6. ~~**`/en`**~~ — **RESUELTO/no aplica (13-ago)**: Emanuel confirmó que la presentación ante la OEA que originó la decisión D5 no existe. `/en` queda en v1 de forma permanente, no hay más contenido pendiente por este motivo.
7. ~~**Formulario de contacto**~~ — **RESUELTO (14-ago)**: `/api/contact` con Resend, dominio verificado, probado en producción por Emanuel ("funciona e increíblemente rápido").
8. ~~**Lectura editorial de `/necesito-ayuda`**~~ — **RESUELTO (11-ago)**: Emanuel la leyó completa y la aprobó tal como está, sin cambios de copy.
9. **PR a master**: PR #3, #4, #5 y #6 ya mergeados. El trabajo de esta sesión está todo en `master`.
10. **Cutover DNS** (Fase 5 del plan maestro): congelar publicación → www→Vercel + apex redirect → smoke test → HSTS includeSubDomains como paso 2 → revocar credenciales de agente.
11. **Webhook de revalidación instantánea (plugin `usina-headless`) — Emanuel pidió (19-ago) sumarlo a los pendientes antes de lanzar la página.** Hoy el contenido nuevo publicado en WordPress se refleja solo en el sitio nuevo dentro de una ventana de hasta 5 minutos (ISR, `revalidate = 300`), sin que nadie tenga que hacer nada — funciona, pero no es instantáneo. El endpoint `/api/revalidate` ya existe en el código (con secreto, comparación timing-safe) esperando que WordPress le avise al publicar/editar. Falta instalar en el WordPress real el plugin `usina-headless` (documentado en `docs/plan-maestro-usina-web.md`, v0.4 — hoy solo especificado, no instalado) que dispare ese webhook. No bloquea nada técnicamente: el sitio funciona igual sin él, solo con 5 minutos de demora en vez de segundos.

## Hallazgos de esta sesión (para tener en cuenta)
1. **La página WP "Distinciones" (id 20992) es basura**: plantilla de Elementor sin publicar con contenido de relleno en inglés de un SaaS de reclutamiento, cero contenido real de Usina. Se descartó como fuente; las distinciones reales (Laurel de Plata, Socia Honoraria, Premio Defensor de la República, etc.) estaban dentro de la propia página "Nosotros" y de ahí se migraron.
2. **`/nosotros/equipo` sigue con datos de placeholder** — no existe ningún roster real del equipo en ninguna fuente. **Necesito que Emanuel pase nombres, roles y fotos del equipo** para completar esta página antes del lanzamiento.
3. **`/programas` era contenido 100% inventado** (4 "programas" hardcodeados sin conexión a WP) — se retiró del árbol y se reemplazó por `/acompanamiento`, con redirect 308.
4. Los PDFs de las memorias en `/nosotros/transparencia` estaban desactualizados (URLs de 2022/2023 muertas); se corrigieron a las URLs reales vigentes y se agregaron 2024/2025. El botón de "Año 2026" queda deshabilitado ("Próximamente") porque WordPress mismo no tiene el archivo todavía.

## Optimización (Fase 4) — COMPLETA

Las 4 olas de la Fase 4 (SEO + GEO, actualizada a la doctrina de mayo 2026,
decisión D7) están hechas y con build verde en cada commit. Resumen:

**Ola A — Seguridad.**
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: origin-when-cross-origin`, `Strict-Transport-Security`
(sin `includeSubDomains` todavía — ver pendientes), `Permissions-Policy`
restrictiva y una CSP v1 pragmática (`next.config.mjs`). Comparación
timing-safe en `/api/revalidate`. `poweredByHeader` apagado. `.gitignore` de
`.env` completo.

**Ola B — Performance.** Pre-renderizado estático de `/noticias` y sus
segmentos (categoría/tag/paginación), pre-render de los 100 posts más
recientes, `/recursos` estático con paginación client-side, deduplicación de
logo. Tiempos medidos: rutas estáticas sirven en **~5ms**; el mismo contenido
vía fetch en caliente a WordPress tardaba **~1.5s**.

**Ola C — SEO técnico.** `sitemap.ts` y `robots.ts` nativos de Next.js
(**876 URLs** en la corrida de esta sesión), tabla de redirects 301 del
WordPress viejo (fechas, categorías legacy, páginas renombradas, IVUJUS →
`ivujus.org.ar`), JSON-LD `NGO` consolidado + `NewsArticle` + `FAQPage` +
`Dataset` + `AboutPage` + `Service` + `BreadcrumbList`, `hreflang` es/en,
`opengraph-image` de marca, manifest e íconos.

**Ola D — GEO + documentación + verificación (esta sesión).**
- Verificado el párrafo de definición institucional de la Home
  (`src/components/home/HeroEditorial.tsx`): ya cubría quiénes son, qué
  hacen y desde cuándo; se agregó "en Argentina" (única palabra faltante en
  texto plano visible — antes solo estaba en el `meta description`).
- Creados `docs/geo-schema.md` (doctrina D7 + inventario completo de lo
  implementado, con paths de archivo) y `docs/WIKIDATA.md` (guía paso a paso
  para que Emanuel cree la entrada de Wikidata en ~15 minutos).
- Lighthouse corrido contra 5 plantillas clave (`pnpm build && pnpm start`,
  Chromium headless local) — ver tabla abajo.

### Lighthouse — gate G4 (≥90 Performance/SEO/Accessibility)

Reportes JSON completos en el scratchpad de la sesión. Post real usado:
`/noticias/usina-de-justicia-firma-un-convenio-internacional-con-el-instituto-dominicano-de-derecho-procesal-para-impulsar-la-proteccion-de-las-victimas`.

| Página | Performance | SEO | Accessibility | Best Practices |
|---|---|---|---|---|
| `/` (Home) | ~~74~~ → **97** (Ola E) | 100 | 97 | 100 |
| `/necesito-ayuda` | 97 | 100 | 96 | 100 |
| `/noticias` | 98 | 100 | 96 | 100 |
| `/noticias/[slug]` | 97 | 100 | 96 | 100 |
| `/donar` | 99 | 100 | 96 | 100 |

**GATE G4 ✅ COMPLETO: 5 de 5 pasan** tras la Ola E (fix quirúrgico de Home: fetchPriority explícito en la imagen LCP + minimumCacheTTL + hidratación diferida del rotador — LCP 3.7s→2.5s, CLS 0.072→0, TBT 540ms→~70ms, sin regresión en el resto). El texto siguiente describe el estado PREVIO a la Ola E: Home quedaba debajo en Performance (SEO y
Accessibility sí cumplen ahí). Core Web Vitals de laboratorio (más estables
que el score compuesto en localhost sin CDN): LCP 3.7s / CLS 0.072 / TBT
540ms en Home, contra LCP 2.0–2.7s / CLS 0 / TBT 50–80ms en el resto.

Causas identificadas en Home (no corregidas en esta sesión — requieren
decisión, no son fixes de una línea):
1. El elemento LCP es la imagen destacada del último post en
   `HeroEditorial`, servida vía `/_next/image?url=https://usinadejusticia.org.ar/...`
   sin caché previa — 2415ms de los ~2.5s de LCP son `resourceLoadDuration`
   (round-trip real al WordPress de producción).
2. `HeroRotator` es el único componente cliente pesado de las 5 plantillas:
   3 variantes de hero + `matchMedia` + `setInterval` de auto-avance +
   tablist navegable, hidratándose en el hilo principal (~1.58s de
   `bootup-time` atribuido al propio documento).
3. Total Blocking Time (540ms) y Max Potential FID (670ms) muy por encima
   del resto de páginas (50–80ms), consecuencia directa de la hidratación
   del rotador.

En producción (Vercel edge, imagen cacheada tras el primer hit) el score
debería mejorar, pero la diferencia de CWV es real y reproducible, no solo
ruido de medición local — queda para que el orquestador decida si amerita
intervención (ej. quitar auto-avance por defecto, precargar la imagen del
último post) antes de dar el gate G4 por cerrado en Home específicamente.

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
2. **Entrada de Wikidata de Usina de Justicia** — máxima palanca GEO (decisión D7). Guía lista en `docs/WIKIDATA.md` para que Emanuel la cree (~15 min). Cuando tenga el Q-ID, hay un `TODO` esperando en `src/app/layout.tsx` (`organizationSchema.sameAs`) para conectarlo.
3. **Dirección postal de la sede social** — sin confirmar; el `NGO` schema (`src/app/layout.tsx`) tiene un `TODO` explícito, no se inventó ningún dato.
4. **Logo en SVG** — Emanuel intentó adjuntarlo en una sesión anterior y no llegó al repo; seguimos con el PNG (`public/images/logo_uj.png`). Retomar cuando lo tenga a mano.
5. **Contenido real que necesito de Emanuel:**
   - Nombres/roles/fotos del equipo para `/nosotros/equipo`.
   - Consentimientos de las familias para reemplazar los placeholders de retratos en Testimonios (Home).
   - Material real de la presentación ante la OEA para completar `/en`.
   - Decisión sobre el servicio de email para conectar el envío real de `/contacto` (Resend/SendGrid/etc. + API key) — sigue simulado.
6. **Fase 2, resto:** CPT "Documentos" + webhook de revalidación en el plugin (v0.4) — cuando esté, `/recursos` deja de ser v1 basada en el inventario estático.
7. **Home — Performance de Lighthouse (74/100)**: ver causas en la sección "Optimización (Fase 4)" arriba. Requiere decisión del orquestador, no es un fix de una línea.
8. Deuda menor: migrar de `next lint` a ESLint CLI antes de Next 16; borrar `PROYECTO-CONTEXTO.md`.
9. **PR a `master`**: abrir cuando Emanuel lo pida — todas las olas de las Fases 3 y 4 están pusheadas y con build verde en esta rama.
10. **Cutover (Fase 5):** DNS `www` → Vercel + redirect del apex + purga de caché/CDN; limpiar categorías viejas de los posts; redirects 301 finales (IVUJUS + URLs viejas restantes); revocar credenciales de agente. **Paso 2 post-cutover** (deliberadamente pospuesto): endurecer `Strict-Transport-Security` a `includeSubDomains` una vez que el subdominio de WordPress esté estable — ver comentario en `next.config.mjs`. También post-cutover: alta en Google Search Console y Google Business Profile (acciones de Emanuel, asistidas por agente).
11. (Solo trabajo local en Windows) reparar npm/corepack con `prompt-reparar-npm.md`.

## Próximo paso exacto
1. Emanuel revisa el preview completo (todas las páginas del árbol nuevo) en el teléfono — gate G3 — y crea la entrada de Wikidata con `docs/WIKIDATA.md`.
2. Con el Q-ID de Wikidata, conectar el `sameAs` en `src/app/layout.tsx` (cambio de una línea).
3. Resolver el contenido pendiente del punto 5 (equipo, retratos, OEA, servicio de email) y decidir si se interviene el Performance de Home antes de dar el gate G4 por cerrado del todo.
4. Abrir PR de esta rama a `master` cuando Emanuel lo indique.
5. Cutover (Fase 5): DNS, purga de caché, smoke test de las URLs con más tráfico, monitoreo 72h, y luego el endurecimiento de HSTS (`includeSubDomains`) como paso 2 post-cutover.
