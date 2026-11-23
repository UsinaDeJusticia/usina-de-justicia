import type { Metadata } from 'next'
import { ContenidoTerminos } from '@/components/legal/ContenidoTerminos'
import { DocumentoLegal } from '@/components/legal/DocumentoLegal'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso',
  description:
    'Términos y condiciones de uso del sitio de Usina de Justicia: uso permitido, propiedad intelectual, enlaces a terceros, responsabilidad y ley aplicable.',
  alternates: { canonical: `${siteConfig.url}/terminos` },
}

export default function TerminosPage() {
  return (
    <DocumentoLegal
      titulo="Términos y Condiciones de Uso"
      actualizacion="16 de noviembre de 2026"
      breadcrumbs={[{ label: 'Términos y Condiciones de Uso', href: '/terminos' }]}
    >
      <ContenidoTerminos />
    </DocumentoLegal>
  )
}
