// ============================================
// src/lib/site-config.ts
// ============================================

export const siteConfig = {
  name: 'Usina de Justicia',
  description: 'Defensa de los derechos de las víctimas del delito en Argentina',
  url: 'https://www.usinadejusticia.org.ar',
  // Ruta fija que expone src/app/opengraph-image.tsx (ImageResponse
  // generado, no un archivo estático) — reemplaza la referencia a un .jpg
  // que nunca existió en public/images.
  ogImage: '/opengraph-image',
  locale: 'es_AR',

  contact: {
    email: 'info@usinadejusticia.org.ar',
    phone: '+54 11 6422-2228',
    // Deep link de WhatsApp para el mismo teléfono de arriba (prefijo 54 +
    // 9 de celular argentino + característica 11 + número, sin espacios ni
    // guiones). Si no es el número real de WhatsApp de la organización,
    // ajustar acá.
    whatsapp: 'https://wa.me/5491164222228',
    address: '',
  },

  social: {
    instagram: 'https://www.instagram.com/usinadejusticia/?hl=es',
    facebook: 'https://www.facebook.com/usinadejusticia/?locale=es_LA',
    tiktok: 'https://www.tiktok.com/@usinadejusticia1',
    twitter: 'https://x.com/UsinadeJusticia',
  },

  // Sub-marca con sitio propio (ivujus.org.ar) — no vive en este Next.js app.
  externalLinks: {
    ivujus: 'https://ivujus.org.ar/',
  },

  mainNav: [
    {
      label: 'Acompañamiento',
      href: '/acompanamiento',
      children: [
        { label: 'Guías para familias', href: '/acompanamiento#guias' },
        { label: 'Encuentros abiertos', href: '/encuentros' },
        { label: 'Historias y testimonios', href: '/noticias/categoria/historias' },
      ],
    },
    {
      label: 'Incidencia',
      href: '/incidencia',
      children: [
        { label: 'Propuestas legislativas e intervenciones judiciales', href: '/noticias/categoria/incidencia' },
        { label: 'Informes y recursos', href: '/recursos' },
        { label: 'Archivo de publicaciones', href: '/observatorio' },
      ],
    },
    {
      label: 'Formación e investigación',
      href: '/formacion-e-investigacion',
      children: [
        { label: 'Cursos y diplomatura', href: 'https://ivujus.org.ar/es/formacion' },
        { label: 'Publicaciones del IVUJUS', href: 'https://ivujus.org.ar/es/publicaciones' },
        { label: 'Eventos académicos', href: 'https://ivujus.org.ar/es/simposios' },
      ],
    },
  ],

  headerCta: {
    help: { label: 'Necesito ayuda', href: '/necesito-ayuda' },
    donate: { label: 'Donar', href: '/donar' },
  },

  footerNav: {
    institucion: [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Equipo', href: '/nosotros/equipo' },
      { label: 'Transparencia institucional', href: '/nosotros/transparencia' },
    ],
    publicaciones: [
      { label: 'Noticias', href: '/noticias' },
      { label: 'Informes y guías', href: '/recursos' },
      { label: 'Archivo de publicaciones', href: '/observatorio' },
      { label: 'Prensa', href: '/noticias/categoria/prensa' },
      { label: 'En los medios', href: '/noticias/categoria/en-los-medios' },
    ],
    contacto: [
      { label: 'Contacto', href: '/contacto' },
      { label: 'Necesito ayuda', href: '/necesito-ayuda' },
      { label: 'Donar', href: '/donar' },
    ],
    legal: [
      { label: 'Política de Privacidad', href: '/privacidad' },
      { label: 'Términos y Condiciones', href: '/terminos' },
    ],
  },
}
