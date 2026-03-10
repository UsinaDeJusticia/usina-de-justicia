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

      // === BLOG (consolidación editorial) ===
      { source: '/noticias', destination: '/blog', permanent: true },
      { source: '/noticias/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/comunicados', destination: '/blog/categoria/comunicados', permanent: true },
      { source: '/comunicados/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/articulos', destination: '/blog/categoria/opinion', permanent: true },
      { source: '/articulos/:slug', destination: '/blog/:slug', permanent: true },
      { source: '/opinion', destination: '/blog/categoria/opinion', permanent: true },
      { source: '/prensa', destination: '/blog/categoria/prensa', permanent: true },
      { source: '/novedades', destination: '/blog', permanent: true },

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
