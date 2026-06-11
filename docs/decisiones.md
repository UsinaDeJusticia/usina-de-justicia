# Registro de decisiones

Una línea por decisión no trivial, con fecha y justificación.

## 2026-06-11 (Día 1)

- **npm en vez de bun:** el repo tiene `package-lock.json`; se respeta el
  manager existente para no introducir un segundo lockfile.
- **Inventario WP no ejecutado desde este entorno:** el sandbox de Claude Code
  bloquea el egreso a `usinadejusticia.org.ar` (proxy responde 403 "Host not in
  allowlist"). El script `scripts/inventario-wp.mjs` quedó completo y probado en
  sintaxis; correrlo desde una máquina con red:
  `WP_API_BASE=https://usinadejusticia.org.ar node scripts/inventario-wp.mjs`.
  No se inventaron datos: `docs/inventario-wp.md` marca el estado bloqueado y
  los totales provienen de PROYECTO-CONTEXTO.md, etiquetados como tales.
- **Redirect map construido desde datos documentados:** las 16 categorías con
  slugs y counts están en PROYECTO-CONTEXTO.md (actualizado 2026-03-10); el map
  usa esos slugs y la validación de cobertura contra el inventario real queda
  automatizada en `scripts/validar-redirects.mjs` (corre cuando exista
  `docs/inventario-wp.json`).
- **Sources del map sin trailing slash:** `next.config` tiene
  `trailingSlash: false`, Next normaliza `/x/` → `/x` antes de evaluar
  redirects; escribirlos sin barra final cubre ambas formas.
- **`/colaborar` no entra al map:** la URL vieja y la nueva coinciden
  (`/colaborar` → `/colaborar` sería un self-redirect); se registra como
  "conservada" junto con `/nosotros` y `/contacto`. Solo `/donar → /colaborar`
  es redirect real.
- **`/blog/page/:page` → `/noticias` (sin preservar número de página):** la
  paginación nueva usa query string (`?page=N`), no path; mandar todo a la
  portada de noticias es lo estándar para archivos paginados viejos.
- **Entradas FASE2-IVUJUS con `destination: null`:** `publicaciones`,
  `capacitacion` y `debatesyconferencias` migran a IVUJUS en julio; el campo
  `fase` las marca para que el conector de Día 6–7 las saltee y sigan
  sirviéndose desde su URL actual.
- **Script de validación separado del inventario:** permite validar la
  estructura del map (duplicados/cadenas/loops) hoy, sin red, y la cobertura
  después, cuando el inventario corra.
