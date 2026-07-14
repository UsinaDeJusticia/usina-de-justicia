/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

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
      { source: '/quienes-somos', destination: '/sobre-nosotros', permanent: true },
      { source: '/mision', destination: '/sobre-nosotros', permanent: true },
      { source: '/mision-y-vision', destination: '/sobre-nosotros', permanent: true },
      { source: '/vision', destination: '/sobre-nosotros', permanent: true },
      { source: '/autoridades', destination: '/sobre-nosotros/equipo', permanent: true },
      { source: '/equipo', destination: '/sobre-nosotros/equipo', permanent: true },
      { source: '/staff', destination: '/sobre-nosotros/equipo', permanent: true },

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

      // === PROGRAMAS ===
      { source: '/areas', destination: '/programas', permanent: true },
      { source: '/areas-de-trabajo', destination: '/programas', permanent: true },

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
        ],
      },
    ]
  },
}

export default nextConfig
