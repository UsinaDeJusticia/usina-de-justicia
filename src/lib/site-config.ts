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

  // Nav principal portada del design system (design-system/home/Header.jsx).
  // Los items del árbol nuevo que todavía no tienen ruta propia se mapean a
  // su equivalente actual; cada mapeo temporal queda marcado con
  // "TODO Fase 3" para cuando se creen las rutas dedicadas.
  mainNav: [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Programas', href: '/programas' },
    { label: 'Observatorio', href: '/#observatorio' }, // TODO Fase 3: crear ruta dedicada /observatorio
    { label: 'Noticias', href: '/noticias' },
    { label: 'IVUJUS', href: 'https://ivujus.org.ar/', external: true },
    { label: 'Contacto', href: '/contacto' },
  ],

  // CTAs del header (design-system/home/Header.jsx: "Necesito ayuda" + "Donar").
  headerCta: {
    help: { label: 'Necesito ayuda', href: '/necesito-ayuda' },
    donate: { label: 'Donar', href: '/donar' },
  },

  // Columnas del footer (design-system/home/Footer.jsx). Igual que en mainNav,
  // los sub-ítems sin página propia apuntan al equivalente real más cercano.
  footerNav: {
    institucion: [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'Equipo', href: '/nosotros/equipo' },
      { label: 'Transparencia institucional', href: '/nosotros/transparencia' },
    ],
    programas: [
      { label: 'Acompañamiento', href: '/programas/asistencia-a-victimas' },
      { label: 'Incidencia', href: '/programas/reformas-legislativas' },
      { label: 'Capacitación', href: '/programas/capacitacion-y-formacion' },
      { label: 'IVUJUS', href: 'https://ivujus.org.ar/', external: true },
    ],
    observatorio: [
      { label: 'Informes', href: '/recursos' },
      { label: 'Amicus curiae', href: '/noticias/categoria/incidencia' },
      { label: 'Base de sentencias', href: '/#observatorio' }, // TODO Fase 3: ruta /observatorio
      { label: 'Prensa', href: '/noticias/categoria/prensa' },
    ],
    contacto: [
      { label: 'Necesito ayuda', href: '/necesito-ayuda' },
      { label: 'Escribinos', href: '/contacto' },
      { label: 'Sumate como voluntario', href: '/contacto' }, // TODO Fase 3: formulario de voluntariado
      { label: 'Convenios', href: '/contacto' }, // TODO Fase 3: página de convenios institucionales
      { label: 'Prensa', href: 'mailto:info@usinadejusticia.org.ar' },
    ],
    legal: [
      { label: 'Política de Privacidad', href: '/legal/privacidad' },
      { label: 'Términos de Uso', href: '/legal/terminos' },
    ],
  },
}