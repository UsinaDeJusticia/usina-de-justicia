/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  poweredByHeader: false,

  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'usinadejusticia.org.ar',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },

  async redirects() {
    return [
      // === WORDPRESS VIEJO: IVUJUS (Fase 4 / Ola C — SEO técnico) ===
      // Estas 22 reglas van PRIMERO, antes que cualquier otra (Next.js aplica
      // la primera que matchea): 19 posts + 3 páginas planas que pertenecen
      // 100% al curso/campus virtual de IVUJUS (sub-marca con sitio propio,
      // ivujus.org.ar), reasignados en la Fase 2 al destino "IVUJUS-301" (ver
      // docs/inventario/COLA-LARGA-decisiones.md sección IVUJUS y
      // docs/inventario/REASIGNACION-dryrun.json). Si la regla wildcard de
      // fecha de más abajo los agarrara primero, terminarían apuntando a
      // /noticias/:slug (404, porque esos posts no se migran a este sitio).
      //
      // El post 22365 tiene un slug con emoji percent-encoded tal cual viene
      // en WP (%e2%9a%96%ef%b8%8f%f0%9f%92%bb = ⚖️💻) — se usa literal, sin
      // decodificar, porque así llega el pathname crudo de la request.
      { source: '/2026/04/03/para-que-puedas-organizar-tu-agenda-y-aprovechar-al-maximo-cada-jornada-compartimos-el-cronograma-oficial-del-primer-simposio-americano-y-europeo-de-victimologia-penal', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2026/04/03/primer-simposio-americano-y-europeo-de-victimologia-penal-inscripciones-abiertas', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2025/11/12/%e2%9a%96%ef%b8%8f%f0%9f%92%bb-asi-vivimos-la-jornada-hacia-un-derecho-cientifico-en-el-cpacf', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2025/11/10/hacia-un-derecho-cientifico-medicion-cualitativa-en-la-era-del-algoritmo', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2024/07/01/encuentro-con-la-universidad-nacional-de-asuncion-para-conversar-sobre-la-formacion-en-victimologia', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/09/21/hoy-ultima-jornada-donde-usina-de-justicia-participa-activamente-en-el-dictado-del-curso-sobre-victimas-en-el-colegio-publico-de-abogados-de-la-capital-federal-cpacf', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/07/31/ministerios-publicos-fiscales-otras-entidades-y-profesionales-particulares-ya-se-sumaron-a-la-capacitacion-en-campus-virtual-de-usina-de-justicia-ley-de-victimas-en-el-marco-de-la-victimologia', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/07/01/usina-de-justicia-lanzo-su-nuevo-campus-virtual', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/04/20/usina-de-justicia-participa-activamente-en-la-capacitacion-en-victimas-de-delito-de-acuerdo-al-convenio-celebrado-con-el-colegio-publico-de-la-abogacia-de-la-capital-federal', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/04/18/nota-en-agencia-universitaria-de-noticias-comenzo-una-capacitacion-inedita-para-la-proteccion-de-victimas-de-delito-el-programa-fue-lanzada-por-usina-de-justicia-en-colaboracion-con-la-facultad-de', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/04/08/nota-en-infobae-se-lanzo-por-primera-vez-en-el-pais-un-programa-universitario-de-capacitacion-en-victimas-de-delitos', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/04/03/usina-de-justicia-en-colaboracion-con-la-uade-comenzara-el-jueves-13-de-abril-con-el-programa-de-capacitacion-en-victimas-de-delito', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/03/17/capacitacion-en-victimas-de-delito-colegio-publico-de-abogados-con-la-participacion-de-usina-en-el-dictado-de-la-capacitacion', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2023/03/08/colegio-publico-de-la-abogacia-de-la-capital-federal-16-de-marzo-capacitacion-en-victimas-de-delito-presentadora-mariana-romano-y-participa-en-la-apertura-a-cargo-de-diana-cohen-agrest', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2019/10/30/uj-dicto-clases-en-la-facultad-de-derecho-uba', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2019/10/03/uj-estuvo-presente-en-la-capacitacion-de-victimas-de-la-subsecretaria-de-justicia-caba', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2019/03/07/participamos-en-la-jornada-dialogando-ba-proteccion-de-victimas-en-la-facultad-de-derecho-de-la-universidad-de-buenos-aires', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2017/11/08/ministerio-seguridad-la-nacion-capacitacion-fuerzas-seguridad', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/2016/05/05/seminario-en-la-udemm', destination: 'https://ivujus.org.ar/', permanent: true },
      // Páginas planas (no posts de blog) del curso/campus de IVUJUS.
      { source: '/capacitacion', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/inscripcion-al-curso-de-victimologia', destination: 'https://ivujus.org.ar/', permanent: true },
      { source: '/preinscripcion-al-curso', destination: 'https://ivujus.org.ar/', permanent: true },

      // === WORDPRESS VIEJO: posts por fecha → /noticias/:slug ===
      // Cubre los ~822 posts restantes (841 totales del inventario - 19
      // IVUJUS de arriba). Verificado: 0 colisiones de slug contra las rutas
      // del árbol nuevo. DEBE ir después de las 22 reglas de IVUJUS: Next.js
      // usa la primera regla que matchea, y este wildcard matchea cualquier
      // /:year/:month/:day/:slug, incluidos los de IVUJUS.
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/noticias/:slug',
        permanent: true,
      },

      // === PÁGINAS WP viejas sin redirect (docs/MAPA-MIGRACION.md §4) ===
      // /nosotros ya existe como ruta nueva (mismo slug, no hace falta
      // redirect). /colaborar → /donar ya está más abajo, en === DONACIONES
      // ===; no se duplica acá.
      { source: '/acompanamiento-a-la-victima', destination: '/acompanamiento', permanent: true },
      { source: '/acompanamos-a-las-victimas', destination: '/acompanamiento', permanent: true },

      // === INSTITUCIONAL ===
      // Fase 3: /sobre-nosotros se renombra a /nosotros (fusiona además el
      // contenido real de distinciones y agradecimientos de WordPress).
      { source: '/sobre-nosotros', destination: '/nosotros', permanent: true },
      { source: '/sobre-nosotros/equipo', destination: '/nosotros/equipo', permanent: true },
      { source: '/sobre-nosotros/transparencia', destination: '/nosotros/transparencia', permanent: true },
      { source: '/quienes-somos', destination: '/nosotros', permanent: true },
      { source: '/mision', destination: '/nosotros', permanent: true },
      { source: '/mision-y-vision', destination: '/nosotros', permanent: true },
      { source: '/vision', destination: '/nosotros', permanent: true },
      { source: '/distinciones', destination: '/nosotros/distinciones', permanent: true },
      { source: '/agradecimientos', destination: '/nosotros', permanent: true },
      { source: '/transparencia-institucional', destination: '/nosotros/transparencia', permanent: true },
      { source: '/autoridades', destination: '/nosotros/equipo', permanent: true },
      { source: '/equipo', destination: '/nosotros/equipo', permanent: true },
      { source: '/staff', destination: '/nosotros/equipo', permanent: true },

      // === BLOG → NOTICIAS (Fase 3: /blog se renombra a /noticias) ===
      { source: '/blog', destination: '/noticias', permanent: true },
      { source: '/blog/categoria/:categoria*', destination: '/noticias/categoria/:categoria*', permanent: true },
      { source: '/blog/tag/:tag*', destination: '/noticias/tag/:tag*', permanent: true },
      { source: '/blog/:slug*', destination: '/noticias/:slug*', permanent: true },

      // === NOTICIAS: categorías legacy → 6 secciones definitivas ===
      // Fase 2 reasignó los 841 posts a las 6 categorías nuevas
      // (historias/acompanamiento/incidencia/prensa/institucional/
      // observatorio), pero las ~14 categorías legacy de WP siguen existiendo
      // y generateStaticParams ya no las pre-renderiza (ver
      // src/app/noticias/categoria/[categoria]/page.tsx). Sin este redirect,
      // esas URLs devolverían 404 en vez de mandar al visitante/buscador a la
      // categoría nueva correspondiente. Mapeo por slug — no usa
      // LEGACY_CATEGORY_MAP (que mapea a una taxonomía intermedia vieja) sino
      // la correspondencia final de docs/MAPA-MIGRACION.md §1.
      { source: '/noticias/categoria/medios-y-entrevistas', destination: '/noticias/categoria/prensa', permanent: true },
      { source: '/noticias/categoria/debatesyconferencias', destination: '/noticias/categoria/institucional', permanent: true },
      { source: '/noticias/categoria/acompanamiento-a-victimas-de-homicidio', destination: '/noticias/categoria/acompanamiento', permanent: true },
      { source: '/noticias/categoria/incidencia-en-politicas-publicas', destination: '/noticias/categoria/incidencia', permanent: true },
      { source: '/noticias/categoria/historias-de-los-miembros-de-uj', destination: '/noticias/categoria/historias', permanent: true },
      { source: '/noticias/categoria/distinciones-premios', destination: '/noticias/categoria/institucional', permanent: true },
      { source: '/noticias/categoria/capacitacion', destination: '/noticias/categoria/institucional', permanent: true },
      { source: '/noticias/categoria/actividades', destination: '/noticias/categoria/institucional', permanent: true },
      { source: '/noticias/categoria/eventos', destination: '/noticias/categoria/institucional', permanent: true },
      { source: '/noticias/categoria/boletin-informativo', destination: '/noticias/categoria/institucional', permanent: true },
      { source: '/noticias/categoria/publicaciones', destination: '/noticias/categoria/observatorio', permanent: true },
      { source: '/noticias/categoria/estadisticas', destination: '/noticias/categoria/observatorio', permanent: true },
      { source: '/noticias/categoria/otras', destination: '/noticias/categoria/institucional', permanent: true },
      { source: '/noticias/categoria/ig-publicaciones', destination: '/noticias/categoria/institucional', permanent: true },

      // === NOTICIAS: paginación vieja por query string → segmento de ruta ===
      // Fase B (perf): /noticias, /noticias/categoria/[categoria] y
      // /noticias/tag/[tag] dejan de leer `?page=N` (searchParams es lo que
      // forzaba SSR puro) y pasan a /pagina/N como segmento de ruta
      // estático. `page=1` no necesita regla acá: cae en /pagina/1, y ese
      // page.tsx hace redirect() a la ruta base.
      {
        source: '/noticias',
        has: [{ type: 'query', key: 'page', value: '(?<page>\\d+)' }],
        destination: '/noticias/pagina/:page',
        permanent: true,
      },
      {
        source: '/noticias/categoria/:categoria',
        has: [{ type: 'query', key: 'page', value: '(?<page>\\d+)' }],
        destination: '/noticias/categoria/:categoria/pagina/:page',
        permanent: true,
      },
      {
        source: '/noticias/tag/:tag',
        has: [{ type: 'query', key: 'page', value: '(?<page>\\d+)' }],
        destination: '/noticias/tag/:tag/pagina/:page',
        permanent: true,
      },

      // === NOTICIAS (consolidación editorial, pre-existente) ===
      { source: '/comunicados', destination: '/noticias/categoria/comunicados', permanent: true },
      { source: '/comunicados/:slug', destination: '/noticias/:slug', permanent: true },
      { source: '/articulos', destination: '/noticias/categoria/opinion', permanent: true },
      { source: '/articulos/:slug', destination: '/noticias/:slug', permanent: true },
      { source: '/opinion', destination: '/noticias/categoria/opinion', permanent: true },
      { source: '/prensa', destination: '/noticias/categoria/prensa', permanent: true },
      { source: '/novedades', destination: '/noticias', permanent: true },

      // === PROGRAMAS → ACOMPAÑAMIENTO ===
      // `/programas` era un placeholder hardcodeado sin contenido real (ver
      // docs/MAPA-MIGRACION.md §4: página WP 213 "no se migra, la estructura
      // desaparece"). El árbol nuevo la reemplaza por /acompanamiento. Las 4
      // rutas hijas viejas (asistencia-a-victimas, reformas-legislativas,
      // capacitacion-y-formacion, litigio-estrategico) tampoco correspondían
      // a contenido real — son hipótesis sin datos de tráfico, así que no se
      // arman redirects específicos por slug; el wildcard alcanza.
      { source: '/programas', destination: '/acompanamiento', permanent: true },
      { source: '/programas/:slug*', destination: '/acompanamiento', permanent: true },
      { source: '/areas', destination: '/acompanamiento', permanent: true },
      { source: '/areas-de-trabajo', destination: '/acompanamiento', permanent: true },

      // === RECURSOS ===
      { source: '/publicaciones', destination: '/recursos', permanent: true },
      { source: '/documentos', destination: '/recursos', permanent: true },
      { source: '/descargas', destination: '/recursos', permanent: true },
      { source: '/informes', destination: '/recursos', permanent: true },
      { source: '/biblioteca', destination: '/recursos', permanent: true },

      // === GALERÍA ===
      { source: '/fotos', destination: '/galeria', permanent: true },
      { source: '/imagenes', destination: '/galeria', permanent: true },
      { source: '/multimedia', destination: '/galeria', permanent: true },

      // === DONACIONES ===
      { source: '/colaborar', destination: '/donar', permanent: true },
      { source: '/colabora', destination: '/donar', permanent: true },
      { source: '/donaciones', destination: '/donar', permanent: true },
      { source: '/aportar', destination: '/donar', permanent: true },

      // === LEGAL ===
      { source: '/privacidad', destination: '/legal/privacidad', permanent: true },
      { source: '/politica-privacidad', destination: '/legal/privacidad', permanent: true },
      { source: '/terminos', destination: '/legal/terminos', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          // Sin includeSubDomains ni preload: decisión deliberada. WordPress
          // se va a mudar a un subdominio propio (p. ej. wp.usinadejusticia
          // .org.ar) en el cutover, y ese subdominio no tiene por qué
          // heredar HSTS del dominio principal todavía. Cuando el cutover
          // esté estable se puede endurecer a includeSubDomains + preload.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          // CSP v1 pragmática. 'unsafe-inline' en script-src/style-src es
          // una concesión consciente: hay JSON-LD y scripts inline de Next,
          // y el contenido de WP/next-font trae estilos inline. El upgrade
          // futuro es generar nonces por request vía middleware y sacar
          // 'unsafe-inline'.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://usinadejusticia.org.ar",
              "font-src 'self'",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.canva.com https://www.facebook.com https://www.yumpu.com",
              "media-src 'self' https://usinadejusticia.org.ar",
              "connect-src 'self' https://usinadejusticia.org.ar",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
