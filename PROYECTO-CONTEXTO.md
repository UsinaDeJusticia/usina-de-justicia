# Usina de Justicia — Rediseño Web

## Documento de Contexto del Proyecto

**Última actualización:** 10 de marzo de 2026
**Conversación:** Chat 3 (componentes compartidos + secciones)

---

## 1. INFORMACIÓN GENERAL

- **Sitio actual:** https://usinadejusticia.org.ar (WordPress + Elementor)
- **Descripción:** Asociación Civil por los derechos de las víctimas de homicidio y femicidio
- **Stack nuevo:** Next.js 14, TypeScript, Tailwind CSS, App Router con src-dir
- **Deploy futuro:** Vercel (front) + Strapi en Hostinger (CMS)
- **Backend temporal:** WP REST API (https://usinadejusticia.org.ar/wp-json/wp/v2)
- **Dev server:** localhost:3001

## 2. EQUIPO Y FLUJO DE TRABAJO

- **Vibe coder** (usuario): coordina, toma decisiones, implementa
- **Claude** (Anthropic): genera código en artifacts
- **Minimax** (en OpenCode/VSC): implementa el código en el proyecto
- **Flujo:** Claude genera → usuario pasa a Minimax → Minimax implementa → usuario reporta resultado a Claude

### Reglas aprendidas:

- Siempre pedir auditoría a Minimax antes de integrar archivos nuevos
- Los archivos largos los pasa el usuario directamente (Minimax a veces resume)
- Hacer `git commit` después de cada paso exitoso
- Verificar nombres de tipos/interfaces existentes antes de crear nuevos

## 3. DATOS REALES DEL SITIO

- **Email:** info@usinadejusticia.org.ar
- **Teléfono:** +54 11 6422-2228
- **Redes:** Instagram, Facebook, TikTok, Twitter/X (URLs configuradas)
- **Logo:** /public/images/logo.png
- **WordPress:** 825 posts publicados, 14 borradores, 16 categorías
- **Autores WP:** Ely Rud, Patricia Borras, Jair Emanuel
- **Tags:** sin criterio definido, puestos al azar

### Plugins WP activos (9):

- Advanced Google reCAPTCHA
- All-in-One WP Migration and Backup
- Elementor + Elementor Pro
- Hostinger Tools
- Image Optimizer
- Joinchat (WhatsApp)
- LiteSpeed Cache
- PDF Embedder

### Categorías WP (16) con cantidad de posts:

| Categoría                                          | Slug                                   | Posts |
| -------------------------------------------------- | -------------------------------------- | ----- |
| Medios y entrevistas a Miembros de UJ              | medios-y-entrevistas                   | 429   |
| Historias de las familias que acompañamos          | historias                              | 121   |
| Acompañamiento a víctimas de homicidio y femicidio | acompanamiento-a-victimas-de-homicidio | 121   |
| Incidencia en Políticas Públicas                   | incidencia-en-politicas-publicas       | 120   |
| Debates y conferencias                             | debatesyconferencias                   | 20    |
| Distinciones y Premios                             | distinciones-premios                   | 17    |
| Cursos y Capacitaciones                            | capacitacion                           | 15    |
| ACTIVIDADES                                        | actividades                            | 14    |
| Eventos de Usina de Justicia                       | eventos                                | 6     |
| Publicaciones                                      | publicaciones                          | 6     |
| INSTITUCIONAL                                      | institucional                          | 5     |
| Historias de los miembros de UJ                    | historias-de-los-miembros-de-uj        | 5     |
| otras                                              | otras                                  | 3     |
| Boletín informativo                                | boletin-informativo                    | 2     |
| INFORMES Y ESTADISTICAS                            | estadisticas                           | 2     |
| Instagram Publicaciones                            | ig-publicaciones                       | 0     |

## 4. ESTRUCTURA DE ARCHIVOS (actualizada)

```
src/
├── app/
│   ├── page.tsx                              # Home (placeholder)
│   ├── layout.tsx                            # Layout raíz
│   ├── blog/
│   │   ├── page.tsx                          # ✅ Secciones agrupadas con SITE_SECTIONS (Archivo 26)
│   │   ├── [slug]/
│   │   │   └── page.tsx                      # ✅ CONECTADO A WP API (Archivo 27)
│   │   ├── categoria/
│   │   │   └── [categoria]/
│   │   │       └── page.tsx                  # ✅ Secciones + categorías WP (Archivo 28)
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx                  # ✅ CONECTADO A WP API (Archivo 29)
│   ├── sobre-nosotros/
│   │   ├── page.tsx                          # ⏳ Placeholder
│   │   ├── equipo/page.tsx                   # ⏳ Placeholder
│   │   └── transparencia/page.tsx            # ⏳ Placeholder
│   ├── programas/
│   │   ├── page.tsx                          # ⏳ Placeholder
│   │   └── [slug]/page.tsx                   # ⏳ Placeholder
│   ├── recursos/page.tsx                     # ⏳ Placeholder
│   ├── galeria/page.tsx                      # ⏳ Placeholder
│   ├── contacto/page.tsx                     # ⏳ Placeholder
│   ├── donar/page.tsx                        # ⏳ Placeholder
│   └── legal/
│       ├── privacidad/page.tsx               # ⏳ Placeholder
│       └── terminos/page.tsx                 # ⏳ Placeholder
├── components/
│   ├── layout/
│   │   ├── Header.tsx                        # ✅ Funcional
│   │   ├── Footer.tsx                        # ✅ Funcional
│   │   └── Breadcrumbs.tsx                   # ✅ Funcional (requiere href en todos los items)
│   └── blog/
│       ├── ArticleCard.tsx                   # ✅ Componente compartido (Archivo 30)
│       └── Pagination.tsx                    # ✅ Componente compartido (Archivo 31)
├── lib/
│   ├── utils.ts                              # ✅ cn(), formatDate(), truncate(), formatFileSize()
│   ├── site-config.ts                        # ✅ Configuración del sitio
│   ├── metadata.ts                           # ✅ Metadata helpers
│   └── wordpress.ts                          # ✅ Servicio WP API (Archivo 25)
└── types/
    ├── index.ts                              # ✅ Tipos base (Articulo, Categoria, Tag, etc.)
    └── wordpress.ts                          # ✅ Tipos WP + CATEGORY_MAP + SITE_SECTIONS (Archivo 24)
```

## 5. TIPOS EXISTENTES (src/types/index.ts)

```typescript
interface SEOFields {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: ImageAsset;
}

interface ImageAsset {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface Articulo extends SEOFields {
  id: string;
  titulo: string;
  slug: string;
  contenido: string;
  extracto: string;
  imagenDestacada?: ImageAsset;
  categoria: Categoria;
  tags: Tag[];
  autor: string;
  fechaPublicacion: string;
  publicado: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
}

interface Tag {
  id: string;
  nombre: string;
  slug: string;
}

// También existen: Programa, Recurso, MiembroEquipo, Album, FileAsset, BreadcrumbItem
```

## 6. FUNCIONES DEL SERVICIO WP (src/lib/wordpress.ts)

```typescript
// Categorías
getWPCategories(): Promise<Categoria[]>
getCategoriesBySection(section): Promise<CategoryInfo[]>

// Artículos
getArticulos(params?): Promise<PaginatedResponse<Articulo>>
getArticuloBySlug(slug): Promise<Articulo | null>
getArticulosBySection(section, params?): Promise<PaginatedResponse<Articulo>>
getArticulosByCategorySlug(slug, params?): Promise<PaginatedResponse<Articulo>>
searchArticulos(query, params?): Promise<PaginatedResponse<Articulo>>

// Tags
getWPTags(): Promise<Tag[]>
getArticulosByTagSlug(slug, params?): Promise<PaginatedResponse<Articulo>>

// Utilidades
cleanWPContent(html): string        // Limpia HTML de Elementor
extractFirstImage(html): string|null // Fallback si no hay featured image
extractVideos(html): Array<...>      // Extrae YouTube y .mp4
estimateReadTime(html): number       // Minutos de lectura
```

## 7. MAPEO DE CATEGORÍAS WP → SECCIONES NUEVAS

```typescript
const CATEGORY_MAP = {
  'historias' → 'historias',
  'acompanamiento-a-victimas-de-homicidio' → 'historias',
  'medios-y-entrevistas' → 'medios',
  'incidencia-en-politicas-publicas' → 'incidencia',
  'debatesyconferencias' → 'incidencia',
  'actividades' → 'actividades',
  'eventos' → 'actividades',
  'capacitacion' → 'actividades',
  'institucional' → 'institucional',
  'distinciones-premios' → 'institucional',
  'historias-de-los-miembros-de-uj' → 'institucional',
  'publicaciones' → 'institucional',
  'boletin-informativo' → 'informativo',
  'estadisticas' → 'informativo',
  'ig-publicaciones' → null (ignorar),
  'otras' → null (ignorar),
}
```

## 8. CONFIGURACIÓN IMPORTANTE

### next.config.js

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'usinadejusticia.org.ar',
      pathname: '/wp-content/uploads/**',
    },
  ],
}
```

### .env.local

```
NEXT_PUBLIC_WP_API_URL=https://usinadejusticia.org.ar/wp-json/wp/v2
```

### Breadcrumbs

- Requiere `href` en TODOS los items, incluido el último

### Next.js 14 params

- `params` y `searchParams` son `Promise` — siempre usar `await`

## 9. HISTORIAL DE ARCHIVOS GENERADOS

| #    | Archivo                                          | Estado          | Descripción                                              |
| ---- | ------------------------------------------------ | --------------- | -------------------------------------------------------- |
| 1-23 | (varios)                                         | ✅ Chat 1       | Estructura base completa con placeholder                 |
| 24   | src/types/wordpress.ts                           | ✅ Implementado | Tipos WP API + CATEGORY_MAP + SITE_SECTIONS              |
| 25   | src/lib/wordpress.ts                             | ✅ Implementado | Servicio WP API completo (incl. getWPTags, getArticulosByTagSlug, getArticulosBySection) |
| 26   | src/app/blog/page.tsx                            | ✅ Implementado | Blog con filtros por SITE_SECTIONS + componentes compartidos |
| 27   | src/app/blog/[slug]/page.tsx                     | ✅ Implementado | Artículo individual desde WP                             |
| 28   | src/app/blog/categoria/[categoria]/page.tsx      | ✅ Implementado | Secciones agrupadas + categorías WP + componentes compartidos |
| 29   | src/app/blog/tag/[tag]/page.tsx                  | ✅ Implementado | Filtro por tag + componentes compartidos                 |
| 30   | src/components/blog/ArticleCard.tsx              | ✅ Implementado | Componente compartido para cards de artículos |
| 31   | src/components/blog/Pagination.tsx               | ✅ Implementado | Componente compartido de paginación |

## 10. PROBLEMAS CONOCIDOS / DEUDA TÉCNICA

1. **Tags sin criterio:** Los tags de WP están puestos al azar. No vale la pena limpiarlos ahora, se hará cuando se migre a Strapi.

## 11. MEJORAS SEO/ACCESIBILIDAD PENDIENTES

Estas mejoras aplican a archivos ya implementados y deberían hacerse en un paso dedicado:

### Prioridad alta:
- [ ] JSON-LD `Organization` en layout raíz o home (identifica la ONG para Google)
- [ ] JSON-LD `Article` en blog/[slug]/page.tsx (resultados enriquecidos)
- [ ] Sitemap dinámico (/sitemap.xml) con las 825+ URLs del blog
- [ ] robots.txt

### Prioridad media:
- [ ] Open Graph images en páginas de categoría y tag
- [ ] Canonical URLs en páginas paginadas (?page=2 → apuntar a base)
- [ ] Verificar JSON-LD BreadcrumbList en componente Breadcrumbs
- [ ] Meta article:section y article:tag en posts individuales

### Prioridad baja:
- [ ] aria-label en secciones de la home y grids de artículos
- [ ] hreflang (solo si se agrega otro idioma)

### Archivos que se verán afectados:
- src/app/layout.tsx (JSON-LD Organization)
- src/app/page.tsx (aria-labels, structured data)
- src/app/blog/[slug]/page.tsx (JSON-LD Article, meta tags)
- src/app/blog/categoria/[categoria]/page.tsx (og:image, canonical)
- src/app/blog/tag/[tag]/page.tsx (og:image, canonical)
- src/app/sitemap.ts (nuevo archivo)
- public/robots.txt (nuevo archivo)

## 12. PRÓXIMOS PASOS SUGERIDOS

### Siguiente fase (páginas con placeholder):

- [ ] Home page con contenido real
- [ ] Sobre nosotros
- [ ] Programas
- [ ] Contacto
- [ ] Donar

### Futuro:

- [ ] Sistema de fichas/timeline para historias de víctimas
- [ ] Migración a Strapi
- [ ] Deploy en Vercel

---

## 13. PROMPT PARA CONTINUAR EN NUEVA VENTANA DE CLAUDE

> Estoy rediseñando usinadejusticia.org.ar. Te adjunto PROYECTO-CONTEXTO.md con todo el estado del proyecto. Léelo completo antes de responder. Estamos en [DESCRIBIR PASO ACTUAL]. Mi flujo de trabajo: vos generás código en artifacts, yo se lo paso a Minimax en VSC para implementarlo, y te reporto el resultado. Antes de generar archivos nuevos, siempre pedime que audite con Minimax para evitar conflictos de tipos o imports.
