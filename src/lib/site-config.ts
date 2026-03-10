// ============================================
// src/lib/site-config.ts
// ============================================

export const siteConfig = {
  name: 'Usina de Justicia',
  description: 'Defensa de los derechos de las víctimas del delito en Argentina',
  url: 'https://www.usinadejusticia.org.ar',
  ogImage: '/images/og-default.jpg',
  locale: 'es_AR',

  contact: {
    email: 'info@usinadejusticia.org.ar',
    phone: '+54 11 6422-2228',
    address: '',
  },

  social: {
    instagram: 'https://www.instagram.com/usinadejusticia/?hl=es',
    facebook: 'https://www.facebook.com/usinadejusticia/?locale=es_LA',
    tiktok: 'https://www.tiktok.com/@usinadejusticia1',
    twitter: 'https://x.com/UsinadeJusticia',
  },

  mainNav: [
    {
      label: 'Sobre Nosotros',
      href: '/sobre-nosotros',
      children: [
        { label: 'Nuestra Historia', href: '/sobre-nosotros' },
        { label: 'Equipo', href: '/sobre-nosotros/equipo' },
        { label: 'Transparencia', href: '/sobre-nosotros/transparencia' },
      ],
    },
    {
      label: 'Programas',
      href: '/programas',
      children: [
        { label: 'Asistencia a Víctimas', href: '/programas/asistencia-a-victimas' },
        { label: 'Reformas Legislativas', href: '/programas/reformas-legislativas' },
        { label: 'Capacitación y Formación', href: '/programas/capacitacion-y-formacion' },
        { label: 'Litigio Estratégico', href: '/programas/litigio-estrategico' },
      ],
    },
    { label: 'Blog', href: '/blog' },
    { label: 'Recursos', href: '/recursos' },
    { label: 'Contacto', href: '/contacto' },
  ],

  footerNav: {
    institucional: [
      { label: 'Sobre Nosotros', href: '/sobre-nosotros' },
      { label: 'Equipo', href: '/sobre-nosotros/equipo' },
      { label: 'Transparencia', href: '/sobre-nosotros/transparencia' },
    ],
    contenido: [
      { label: 'Blog', href: '/blog' },
      { label: 'Recursos', href: '/recursos' },
      { label: 'Galería', href: '/galeria' },
      { label: 'Programas', href: '/programas' },
    ],
    legal: [
      { label: 'Política de Privacidad', href: '/legal/privacidad' },
      { label: 'Términos de Uso', href: '/legal/terminos' },
    ],
  },
}