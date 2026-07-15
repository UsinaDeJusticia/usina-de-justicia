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
