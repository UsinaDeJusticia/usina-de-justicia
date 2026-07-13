import { generatePageMetadata } from '@/lib/metadata'
import { siteConfig } from '@/lib/site-config'

// La página de contacto es un client component (usa useState para el
// formulario), por lo que no puede exportar `metadata` directamente.
// Se define acá, en el layout del segmento, siguiendo el patrón de
// Next.js para metadata en rutas con page.tsx cliente.
export const metadata = generatePageMetadata({
  title: 'Contacto',
  description: `¿Sos víctima de un delito o necesitás orientación? Escribinos a ${siteConfig.contact.email} o completá el formulario y te responderemos a la brevedad.`,
  path: '/contacto',
})

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
