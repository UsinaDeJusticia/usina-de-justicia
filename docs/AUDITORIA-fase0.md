# AUDITORÍA — Fase 0 · Rebuild Web Usina de Justicia
**Fecha:** 10 de julio de 2026 · **Ejecutada por:** Claude (Fable 5, sesión móvil)
**Gate:** G0 — decisión *reutilizar repo* vs *repo nuevo*

---

## 1. Repo `UsinaDeJusticia/usina-de-justicia` (rama única: `master`)

**Último commit:** 10 de marzo de 2026 ("Docs: nota sobre ampliar medios de pago en Donar"). 4 meses sin actividad.

### Stack real
| Componente | Versión | Estado |
|---|---|---|
| Next.js | **14.2.35** (App Router, src-dir) | Desactualizado (objetivo: 15+) |
| React | 18 | Acompaña upgrade |
| Tailwind | **3.4** | Desactualizado (objetivo: v4, estándar de los demás proyectos) |
| TypeScript | 5 | OK |
| Gestor de paquetes | **npm** (package-lock.json) | Migrar a pnpm 11 (política de seguridad post-Shai-Hulud) |
| Extras | next-sitemap, lucide-react, clsx, tailwind-merge | OK, mínimos |

### Rutas existentes: 16 archivos `page.tsx`
`/`, `/blog` (+ `[slug]`, `categoria/[categoria]`, `tag/[tag]`), `/contacto`, `/donar`, `/galeria`, `/legal/privacidad`, `/legal/terminos`, `/programas` (+ `[slug]`), `/recursos`, `/sobre-nosotros` (+ `/equipo`, `/transparencia`).

> Nota: la cifra de "83 páginas" que circulaba en sesiones de junio correspondía a páginas *generadas* (rutas dinámicas × contenido), no a archivos. La base real es 16 rutas. **Faltan** respecto al árbol objetivo: `/necesito-ayuda`, `/observatorio`, `/en`, `/acompanamiento` como sección propia.

### Activos valiosos (esto es lo que se rescata)
- **`src/lib/wordpress.ts` (12 KB): capa REST de calidad.** Fetch tipado con timeout (15s), manejo de errores, caché en memoria para taxonomías, ISR con `revalidate: 300` ya integrado, transformación WP → tipos propios (`Articulo`, `Categoria`, `Tag`). Es exactamente la capa que el plan pedía construir — ya existe.
- **`src/types/wordpress.ts` + `CATEGORY_MAP`**: tipos completos de la API + mapa de categorías funcionando.
- **`PROYECTO-CONTEXTO.md` (17 KB)**: inventario documental completo del WP — 825 posts publicados, 14 borradores, 16 categorías con conteos exactos, 9 plugins activos, autores, datos de contacto. Adelanta gran parte de la Fase 1.
- Componentes de layout (Header, Footer, Breadcrumbs con Schema.org) y de blog (ArticleCard, Pagination): reutilizables como lógica, aunque el estilo se reemplaza.

### Deuda / a reemplazar
- Diseño visual: se descarta completo (viene el nuevo de Claude Design).
- Sin JSON-LD de NGO/Article, sin `/necesito-ayuda`, sin sitemap dinámico verificado, sin redirects.
- Flujo de trabajo documentado en PROYECTO-CONTEXTO es el viejo (Minimax/artifacts) — obsoleto, se reemplaza por la orquestación de agentes.

## 2. WordPress en producción (verificación externa)
- Sitio vivo en Hostinger, **Elementor 4.1.4** generando el frontend actual.
- **Confirmado el hack de Google Translate en el header** (links a translate.google.com para PT/FR/EN) — a eliminar y reemplazar por `/en` + hreflang, como ya estaba decidido.
- Menú actual: inicio, Nosotros, Programas (3 subpáginas), Noticias, Contacto, link externo a ivujus.org.ar, Transparencia.
- La REST API es consumida por el repo contra `https://usinadejusticia.org.ar/wp-json/wp/v2` (verificación en vivo del endpoint pendiente para la primera sesión de desktop — la sesión móvil no tiene acceso de red directo al dominio).

## 3. Distribución real de contenido (de PROYECTO-CONTEXTO.md)
429 posts (52%) son "Medios y entrevistas"; historias 121; acompañamiento 121; incidencia 120. La cola larga (9 categorías) suma <90 posts. **Implicancia:** el mapa 16→6 es de bajo riesgo — las 4 categorías grandes ya coinciden casi 1:1 con las 6 propuestas; solo la cola larga requiere criterio editorial.

Mapa preliminar (a refinar en Fase 1):
| Vieja | → Nueva |
|---|---|
| medios-y-entrevistas (429) | prensa |
| historias (121) + historias-de-los-miembros-de-uj (5) | historias |
| acompanamiento (121) | acompanamiento |
| incidencia-en-politicas-publicas (120) | incidencia |
| debatesyconferencias (20) + capacitacion (15) + actividades (14) + eventos (6) + distinciones (17) + institucional (5) + boletin (2) | institucional |
| publicaciones (6) + estadisticas (2) | observatorio |
| otras (3) + ig-publicaciones (0) | revisar caso por caso / eliminar |

---

## 4. Recomendación G0: **REUTILIZAR el repo, con modernización**

Fundamento: la parte cara y riesgosa (capa REST tipada + tipos + CATEGORY_MAP + estructura de rutas de blog) ya está hecha y es de buena calidad. Lo que se descarta (el diseño) se iba a descartar igual en cualquier escenario. Arrancar repo nuevo solo agregaría trabajo de re-copiar `lib/` y `types/` sin ganar nada.

**Plan de modernización (primera tarea de Fase 3, rama `chore/modernizacion`):**
1. npm → **pnpm 11** con protecciones de seguridad del estándar del proyecto.
2. Next 14.2 → **15.x** (codemod oficial) + React 19.
3. Tailwind 3 → **4** (migración de config a CSS-first, tokens del nuevo diseño).
4. Actualizar `PROYECTO-CONTEXTO.md` → reemplazar por `docs/ESTADO.md` + este plan.

**Riesgo aceptado:** el upgrade Next 14→15 puede romper detalles de fetch/caching (cambios de default en caching de Next 15). Mitigación: la capa `wordpress.ts` centraliza todo el fetching — un solo lugar para ajustar.

## 5. Próximos pasos inmediatos (primera sesión en Claude Code Desktop)
1. Verificar `wp-json` en vivo + conteos actuales (pueden haber crecido desde marzo).
2. `pnpm install` + build del repo tal cual está (baseline).
3. Ejecutar modernización (rama + preview Vercel).
4. Iniciar Fase 1 formal: exportar inventario completo y generar `MAPA-MIGRACION.md` para gate G1.
