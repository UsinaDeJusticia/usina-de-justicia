# URLs sin decisión de destino

Día 1 — 11 de junio de 2026. URLs públicas del WP viejo que no encajan en el
redirect map (`docs/redirect-map.json`) ni en la lista de conservadas, con
sugerencia de destino. Necesitan decisión de Emanuel antes del Día 6–7.

## Categorías fuera del mapeo

| URL vieja | Posts | Sugerencia |
|---|---|---|
| `/category/otras` | 3 | Redirigir a `/noticias` (genérico). Son 3 posts sin clasificar; alternativa: recategorizarlos en el admin y que la categoría muera sin redirect. |
| `/category/boletin-informativo` | 2 | El `CATEGORY_MAP` del repo la manda a la sección `informativo`, que no existe en la nueva IA. Sugerencia: `/noticias/categoria/institucional`. |
| `/category/ig-publicaciones` | 0 | Vacía. Sugerencia: sin redirect (devolver 404/410 está bien para una categoría sin posts ni tráfico). |

## Taxonomías no contempladas en el plan

| URL vieja | Sugerencia |
|---|---|
| `/tag/{slug}` (los tags de WP, "puestos al azar" según PROYECTO-CONTEXTO) | Redirect genérico `/tag/:slug` → `/noticias`. Sin valor SEO individual; evita 404 masivos. |
| `/author/{slug}` (Ely Rud, Patricia Borras, Jair Emanuel) | Redirect genérico → `/noticias`. |
| Archivos de fecha `/{yyyy}/` y `/{yyyy}/{mm}/` (los genera WP automáticamente) | Redirect genérico → `/noticias`. Ojo: la regla debe ir DESPUÉS de los permalinks de posts para no pisarlos. |

## Pendiente de verificación (bloqueado por red — ver decisiones.md)

- **Cobertura total contra el inventario real**: el sandbox no tiene egreso a
  `usinadejusticia.org.ar` ("Host not in allowlist"), así que el inventario de la
  Tarea B no pudo ejecutarse. Correr `scripts/inventario-wp.mjs` desde un entorno
  con red y después `scripts/validar-redirects.mjs` para detectar páginas
  huérfanas que falten acá.
- **Slug real de "Historias de los miembros de UJ"**: PROYECTO-CONTEXTO.md lo
  documenta como `historias-de-los-miembros-de-uj` y así está en el redirect map;
  confirmar contra el inventario.
- **Patrón de permalink de los ~850 posts**: el validador lo chequea cuando
  exista `docs/inventario-wp.json`.
- **3 borradores** ("Privacy Policy", "Elementor Página #22572" y un tercero):
  no salen por API público; revisar en el admin de WP.
