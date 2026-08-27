// ============================================================
// DÓNDE VIVE WORDPRESS — la única perilla del cutover
// ============================================================
// Hoy WordPress y el sitio público comparten el mismo dominio
// (usinadejusticia.org.ar). En el cutover, ese dominio pasa a servir ESTE
// sitio y WordPress se muda a un subdominio propio. Para que ese día sea un
// cambio de configuración y no un cambio de código bajo presión, el host de
// WordPress se lee de una variable de entorno y de ella se derivan las tres
// cosas que dependen de él: la API REST (src/lib/wordpress.ts), los dominios
// permitidos del optimizador de imágenes, y la Content-Security-Policy.
//
// Valor por defecto = el dominio actual, así que MIENTRAS NADIE SETEE
// WP_HOST el comportamiento es exactamente el de siempre. El cutover se
// activa poniendo WP_HOST=wp.usinadejusticia.org.ar en Vercel y
// redesplegando; se revierte borrando la variable. Ver docs/CUTOVER.md.
const WP_HOST = process.env.WP_HOST || 'usinadejusticia.org.ar'

// El dominio con el que se publicó el contenido histórico. 215 de los 842
// posts migrados tienen imágenes con la URL absoluta
// https://usinadejusticia.org.ar/wp-content/... escrita dentro del cuerpo
// del post (auditoría del 26-ago-2026), más los PDFs de memorias y balances.
// Ese host tiene que seguir permitido por la CSP y por el optimizador de
// imágenes aunque WordPress se mude, porque esas URLs viven dentro del
// contenido y no se reescriben solas. La regla de redirect /wp-content/*
// de más abajo se encarga de que sigan resolviendo.
const LEGACY_WP_HOST = 'usinadejusticia.org.ar'

// ============================================================
// EL DOMINIO SIN www — que es el que la gente escribe
// ============================================================
// Todo el sitio declara https://www.usinadejusticia.org.ar como canónico
// (etiquetas canonical, sitemap, OpenGraph, JSON-LD). Pero casi nadie
// escribe el "www" a mano: la mayoría teclea el dominio pelado. Si el
// dominio pelado no llevara al sitio nuevo, la mayor parte del tráfico
// seguiría viendo el sitio viejo.
//
// La regla de más abajo lo resuelve: cualquier pedido que llegue al dominio
// pelado se redirige al canónico conservando la ruta. Es inocua hasta que
// el dominio pelado apunte a este sitio — hoy ese host ni siquiera llega
// acá.
//
// Los puntos van escapados y el valor va anclado con ^...$ A PROPÓSITO: sin
// eso, "usinadejusticia.org.ar" también matchearía como substring dentro de
// "www.usinadejusticia.org.ar" y el canónico se redirigiría a sí mismo en
// un bucle infinito. Verificado con un build real y las dos cabeceras Host
// antes de mergear, no deducido.
const APEX_HOST = 'usinadejusticia.org.ar'
const CANONICAL_HOST = 'www.usinadejusticia.org.ar'

/** Hosts únicos a permitir (WP_HOST y el legacy pueden coincidir hoy). */
const WP_HOSTS = [...new Set([WP_HOST, LEGACY_WP_HOST])]

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  poweredByHeader: false,

  images: {
    formats: ['image/webp', 'image/avif'],
    // Las imágenes de WordPress cambian poco una vez publicadas: 1h de
    // cache en el optimizador de imágenes evita re-fetchear el origen (WP,
    // lento) en cada revalidación y baja la duración de carga de la imagen
    // LCP del hero (Perf Home, gate G4).
    minimumCacheTTL: 3600,
    remotePatterns: WP_HOSTS.map((hostname) => ({
      protocol: 'https',
      hostname,
      pathname: '/wp-content/uploads/**',
    })),
  },

  async redirects() {
    return [
      // === ARCHIVOS DE WORDPRESS (/wp-content, /wp-admin) ===
      // Va PRIMERO de todo: después del cutover, este sitio pasa a responder
      // en el dominio con el que se publicó todo el contenido histórico, y
      // esas URLs tienen que seguir resolviendo al WordPress real.
      //
      // Cubre de una sola regla:
      //  - Las imágenes con URL absoluta dentro del cuerpo de 215 de los 842
      //    posts migrados (no se reescriben solas; están en el HTML guardado).
      //  - Los PDFs de memorias y balances enlazados desde
      //    /nosotros/transparencia.
      //  - Cualquier otro archivo subido a la biblioteca de medios que algún
      //    contenido enlace y que no hayamos inventariado.
      //
      // Mientras WP_HOST siga siendo el dominio actual esta regla es inocua
      // (redirige a sí mismo un path que este sitio no sirve igual); recién
      // hace trabajo real cuando WordPress se muda. Ver docs/CUTOVER.md.
      {
        source: '/wp-content/:path*',
        destination: `https://${WP_HOST}/wp-content/:path*`,
        permanent: true,
      },
      // Comodidad para el equipo: entrar al panel por el dominio de siempre
      // sigue funcionando y lleva al WordPress real, en vez de dar 404.
      // `permanent: false` (307) a propósito: la ubicación del panel es una
      // decisión de infraestructura que puede cambiar, y un 301 se queda
      // cacheado en el navegador de cada persona del equipo.
      {
        source: '/wp-admin/:path*',
        destination: `https://${WP_HOST}/wp-admin/:path*`,
        permanent: false,
      },
      {
        source: '/wp-login.php',
        destination: `https://${WP_HOST}/wp-login.php`,
        permanent: false,
      },

      // === DOMINIO PELADO → CANÓNICO CON www ===
      // Va DESPUÉS de las tres reglas de WordPress de arriba a propósito: así
      // usinadejusticia.org.ar/wp-admin llega al panel en un solo salto, en
      // vez de rebotar primero por www. Y va ANTES que todo lo demás para que
      // ninguna otra regla procese un pedido que todavía está en el host
      // equivocado (si no, un post viejo daría dos redirects encadenados y
      // aterrizaría con el canónico incorrecto).
      {
        source: '/:path*',
        has: [{ type: 'host', value: `^${APEX_HOST.replace(/\./g, '\\.')}$` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },

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

      // === ALIAS EN INGLÉS DE LAS "TRUST ANCHOR PAGES" ===
      // Los agentes que verifican si una organización es legítima buscan las
      // rutas convencionales en inglés (/about, /privacy, /terms) antes de
      // recomendarla. Este sitio es en español y sus páginas viven en
      // /nosotros y /legal/*, así que esas URLs daban 404 aunque el contenido
      // exista y sea extenso. Se resuelve con un 301 al equivalente real, no
      // con páginas nuevas: duplicar el contenido en dos URLs partiría la
      // autoridad SEO de cada una y contradiría los `canonical` ya
      // declarados. Un solo salto, sin cadenas de redirects.
      { source: '/about', destination: '/nosotros', permanent: true },
      { source: '/about-us', destination: '/nosotros', permanent: true },
      { source: '/team', destination: '/nosotros/equipo', permanent: true },

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
      // Alias en inglés — mismo criterio que /about y /team más arriba.
      { source: '/privacy', destination: '/legal/privacidad', permanent: true },
      { source: '/privacy-policy', destination: '/legal/privacidad', permanent: true },
      { source: '/terms', destination: '/legal/terminos', permanent: true },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // `strict-origin-when-cross-origin` y no `origin-when-cross-origin`:
          // la diferencia es que este NO manda nada al bajar de HTTPS a HTTP.
          // Importa particularmente en este sitio, donde la URL visitada puede
          // revelar que alguien estuvo consultando /necesito-ayuda — una
          // persona atravesando la muerte de un familiar no tiene por qué
          // dejar ese rastro en el registro de un tercero.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Negociación de contenido con agentes (ver src/middleware.ts): la
          // misma URL sirve HTML o Markdown según el header `Accept`, así que
          // los caches intermedios tienen que variar por él. Sin esto, un CDN
          // que ya cacheó la variante HTML se la sirve igual a un agente que
          // pidió markdown, y al revés.
          //
          // Va acá y no en el middleware a propósito: el middleware corre
          // ANTES de que Next.js agregue su propio `Vary` de router (`rsc`,
          // `next-router-state-tree`, …), así que lo que setea el middleware
          // termina sobrescrito. Verificado con curl contra el build de
          // producción: por middleware el header salía sin `Accept`.
          { key: 'Vary', value: 'Accept' },
          // `includeSubDomains` agregado el 27-ago-2026, con el cutover ya
          // ejecutado y estable. Antes estaba deliberadamente afuera: el
          // subdominio de WordPress todavía no existía y no tenía por qué
          // heredar HSTS del dominio principal.
          //
          // OJO CON EL ALCANCE REAL, que es menor de lo que parece —
          // medido, no supuesto. `includeSubDomains` protege los subdominios
          // DEL HOST QUE ENVÍA la cabecera. Este sitio la envía desde
          // www.usinadejusticia.org.ar, así que cubre subdominios de
          // `www.…`, que no existen. **NO alcanza a wp.usinadejusticia
          // .org.ar.**
          //
          // Alcanzarlo requeriría enviarla desde el dominio pelado, y ese
          // solo responde un 308 al canónico. Verificado con curl contra el
          // build de producción: esa respuesta 308 NO lleva ninguna de las
          // cabeceras de seguridad de este bloque, porque los redirects
          // cortocircuitan antes de que se apliquen.
          //
          // Entonces, ¿por qué dejarlo? Porque es la postura correcta y no
          // cuesta nada: el día que el dominio pelado sirva contenido en vez
          // de redirigir, la protección aplica sola. Lo que NO hay que hacer
          // es creer que hoy protege el panel de WordPress: no lo hace. Si
          // alguna vez se quiere esa protección, va configurada del lado de
          // Hostinger, en wp. — con la contrapartida de que un certificado
          // vencido ahí dejaría al equipo afuera del panel sin posibilidad
          // de "continuar igual", así que no es gratis.
          //
          // `preload` NO se agrega, y es deliberado. Inscribiría el dominio
          // en una lista que viene compilada dentro de los navegadores, y
          // salir de ahí lleva meses: cualquier error de configuración de
          // HTTPS en cualquier subdominio quedaría sin vuelta atrás rápida.
          // Para una organización que acaba de mudar toda su infraestructura,
          // esa rigidez no compensa lo poco que agrega sobre lo que ya hay.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            // Lo que NO se lista acá queda habilitado y, además, delegable a
            // los iframes vía su atributo `allow`. El contenido de las notas
            // permite iframes de YouTube, Canva, Facebook y Yumpu, así que la
            // lista corta dejaba a esas plataformas con más permisos de los
            // que necesitan para mostrar un video o un documento.
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
              'display-capture=()',
              'serial=()',
              'bluetooth=()',
              'midi=()',
              'idle-detection=()',
              'xr-spatial-tracking=()',
              'browsing-topics=()',
              'interest-cohort=()',
            ].join(', '),
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
              // Los hosts de WordPress se derivan de WP_HOST (ver arriba):
              // durante y después del cutover hay que permitir tanto el
              // subdominio nuevo como el dominio histórico con el que se
              // publicaron las imágenes que viven dentro del contenido.
              `img-src 'self' data: ${WP_HOSTS.map((h) => `https://${h}`).join(' ')}`,
              "font-src 'self'",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.canva.com https://www.facebook.com https://www.yumpu.com",
              `media-src 'self' ${WP_HOSTS.map((h) => `https://${h}`).join(' ')}`,
              `connect-src 'self' ${WP_HOSTS.map((h) => `https://${h}`).join(' ')}`,
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
