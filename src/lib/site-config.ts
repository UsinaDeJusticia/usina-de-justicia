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

  // Nav principal portada del design system (design-system/home/Header.jsx).
  // `/programas` (placeholder hardcodeado, sin contenido real — ver
  // docs/MAPA-MIGRACION.md §4) se retira del árbol: "Acompañamiento" pasa a
  // apuntar a la sección propia /acompanamiento y "Observatorio" a su ruta
  // dedicada /observatorio. "Incidencia" vive como categoría de noticias
  // (no tiene página propia), así que apunta a /noticias/categoria/incidencia.
  mainNav: [
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Acompañamiento', href: '/acompanamiento' },
    { label: 'Incidencia', href: '/noticias/categoria/incidencia' },
    { label: 'Observatorio', href: '/observatorio' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'Recursos', href: '/recursos' },
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
    // "Capacitación" se retiró: en el sitio viejo apuntaba a
    // /programas/capacitacion-y-formacion, contenido placeholder sin fuente
    // real (lo propio de Usina en esa categoría es cola larga editorial;
    // el resto es IVUJUS → 301, ver MAPA-MIGRACION.md §3). IVUJUS sigue
    // linkeado porque tiene sitio propio real (ivujus.org.ar).
    acompanamiento: [
      { label: 'Acompañamiento', href: '/acompanamiento' },
      { label: 'Incidencia', href: '/noticias/categoria/incidencia' },
      { label: 'IVUJUS', href: 'https://ivujus.org.ar/', external: true },
    ],
    observatorio: [
      { label: 'Publicaciones', href: '/observatorio' },
      { label: 'Informes', href: '/recursos' },
      { label: 'Amicus curiae', href: '/noticias/categoria/incidencia' },
      // "Noticias" se agregó en ago-2026, al revisar la sugerencia de la
      // Comisión de replicar el menú superior en el pie. El pie ya tenía
      // navegación por columnas —así que no hacía falta construirla— pero
      // faltaba justo la sección que más crece: /noticias, con las 842 notas
      // publicadas, era la única del menú principal que no estaba enlazada
      // desde acá.
      { label: 'Noticias', href: '/noticias' },
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