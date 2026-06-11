# Inventario WordPress — Usina de Justicia

**Estado: ⚠ BLOQUEADO — pendiente de ejecución con acceso de red.**

Fecha del intento: 11 de junio de 2026.

El entorno remoto donde se trabajó el Día 1 no tiene egreso de red hacia
`usinadejusticia.org.ar` (el proxy del sandbox responde `403 — Host not in
allowlist` para cualquier host fuera de su allowlist; se verificó que el 403 no
proviene de Hostinger). Conforme a la regla de trabajo "si un endpoint falla,
documentalo y continuá; no inventes datos", este archivo registra el bloqueo y
los datos de referencia documentados, claramente etiquetados como tales.

## Cómo completar este inventario

Desde cualquier máquina con red (la conexión es solo al API público, sin
credenciales):

```bash
WP_API_BASE=https://usinadejusticia.org.ar node scripts/inventario-wp.mjs
node scripts/validar-redirects.mjs   # valida cobertura del redirect map
```

El script genera `docs/inventario-wp.json` (crudo) y sobreescribe este `.md`
con los totales reales, las páginas duplicadas/obsoletas detectadas y los posts
fuera del patrón de permalink.

## Datos de referencia (de PROYECTO-CONTEXTO.md, 2026-03-10 — NO verificados hoy)

| Recurso | Cantidad documentada |
|---|---|
| Posts publicados | 825 |
| Borradores | 14 según PROYECTO-CONTEXTO; 3 según el plan del Día 1 — **discrepancia a resolver en el admin** |
| Categorías | 16 |
| Tags | sin criterio, cantidad no documentada |
| Media | no documentado |
| Páginas | ≥9 con contenido real identificado (ids 8, 94, 101, 103, 213, 15851, 20992, 21247, 21260) |

### Categorías documentadas (16)

| Categoría | Slug | Posts |
|---|---|---|
| Medios y entrevistas a Miembros de UJ | `medios-y-entrevistas` | 429 |
| Historias de las familias que acompañamos | `historias` | 121 |
| Acompañamiento a víctimas de homicidio y femicidio | `acompanamiento-a-victimas-de-homicidio` | 121 |
| Incidencia en Políticas Públicas | `incidencia-en-politicas-publicas` | 120 |
| Debates y conferencias | `debatesyconferencias` | 20 |
| Distinciones y Premios | `distinciones-premios` | 17 |
| Cursos y Capacitaciones | `capacitacion` | 15 |
| ACTIVIDADES | `actividades` | 14 |
| Eventos de Usina de Justicia | `eventos` | 6 |
| Publicaciones | `publicaciones` | 6 |
| INSTITUCIONAL | `institucional` | 5 |
| Historias de los miembros de UJ | `historias-de-los-miembros-de-uj` | 5 |
| otras | `otras` | 3 |
| Boletín informativo | `boletin-informativo` | 2 |
| INFORMES Y ESTADISTICAS | `estadisticas` | 2 |
| Instagram Publicaciones | `ig-publicaciones` | 0 |

## Borradores conocidos (revisión manual en el admin)

- Privacy Policy
- Elementor Página #22572
- (resto a confirmar — ver discrepancia 3 vs 14 arriba)
